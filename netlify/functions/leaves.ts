import { createClient } from '@supabase/supabase-js';
import type { Context } from '@netlify/functions';
import { z } from 'zod';

interface HandlerEvent {
  httpMethod: string;
  path: string;
  body: string | null;
  queryStringParameters?: Record<string, string>;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json',
};

const leaveSchema = z.object({
  employee_id: z.string().uuid(),
  leave_type_id: z.string().uuid(),
  start_date: z.string(),
  end_date: z.string(),
  days: z.number().int().positive(),
  reason: z.string().min(1),
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
});

export const handler = async (event: HandlerEvent, context: Context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const method = event.httpMethod;
    const pathParts = event.path.split('/');
    const leaveId = pathParts[pathParts.length - 1];
    const queryParams = event.queryStringParameters || {};

    // GET - List leaves with filters
    if (method === 'GET' && !leaveId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      let query = supabase
        .from('leaves')
        .select(`
          *,
          employees!inner(
            id,
            employee_id,
            users!inner(first_name, last_name, email)
          ),
          leave_types!inner(id, name),
          approved_by_user:approved_by(first_name, last_name)
        `);

      // Filter by employee
      if (queryParams.employee_id) {
        query = query.eq('employee_id', queryParams.employee_id);
      }

      // Filter by status
      if (queryParams.status) {
        query = query.eq('status', queryParams.status);
      }

      // Filter by date range
      if (queryParams.from_date) {
        query = query.gte('start_date', queryParams.from_date);
      }
      if (queryParams.to_date) {
        query = query.lte('end_date', queryParams.to_date);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ data }),
      };
    }

    // GET - Get single leave
    if (method === 'GET' && leaveId) {
      const { data, error } = await supabase
        .from('leaves')
        .select(`
          *,
          employees!inner(
            id,
            employee_id,
            users!inner(first_name, last_name, email)
          ),
          leave_types!inner(id, name),
          approved_by_user:approved_by(first_name, last_name)
        `)
        .eq('id', leaveId)
        .single();

      if (error) throw error;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ data }),
      };
    }

    // POST - Create leave
    if (method === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const validated = leaveSchema.parse(body);

      const { data, error } = await supabase
        .from('leaves')
        .insert(validated)
        .select(`
          *,
          employees!inner(
            id,
            employee_id,
            users!inner(first_name, last_name, email)
          ),
          leave_types!inner(id, name)
        `)
        .single();

      if (error) throw error;

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ data }),
      };
    }

    // PUT - Update leave (approve/reject)
    if (method === 'PUT' && leaveId) {
      const body = JSON.parse(event.body || '{}');
      const { status, approved_by } = body;

      const updateData: any = {};
      if (status) updateData.status = status;
      if (approved_by) {
        updateData.approved_by = approved_by;
        updateData.approved_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('leaves')
        .update(updateData)
        .eq('id', leaveId)
        .select(`
          *,
          employees!inner(
            id,
            employee_id,
            users!inner(first_name, last_name, email)
          ),
          leave_types!inner(id, name),
          approved_by_user:approved_by(first_name, last_name)
        `)
        .single();

      if (error) throw error;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ data }),
      };
    }

    // DELETE - Delete leave
    if (method === 'DELETE' && leaveId) {
      const { error } = await supabase.from('leaves').delete().eq('id', leaveId);

      if (error) throw error;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Leave deleted successfully' }),
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  } catch (error: any) {
    console.error('Leave function error:', error);
    return {
      statusCode: error instanceof z.ZodError ? 400 : 500,
      headers,
      body: JSON.stringify({ 
        error: error instanceof z.ZodError ? error.issues : (error.message || 'Internal server error')
      }),
    };
  }
};
