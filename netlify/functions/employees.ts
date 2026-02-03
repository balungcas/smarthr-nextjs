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

const employeeSchema = z.object({
  user_id: z.string().uuid(),
  employee_id: z.string(),
  department_id: z.string().uuid().optional().nullable(),
  designation_id: z.string().uuid().optional().nullable(),
  joining_date: z.string(),
  employment_type: z.enum(['full-time', 'part-time', 'contract', 'intern']).optional(),
  status: z.enum(['active', 'inactive', 'on-leave']).optional(),
  manager_id: z.string().uuid().optional().nullable(),
  salary: z.number().optional().nullable(),
});

export const handler = async (event: HandlerEvent, context: Context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const method = event.httpMethod;
    const pathParts = event.path.split('/');
    const employeeId = pathParts[pathParts.length - 1];

    // GET - List all employees with user details
    if (method === 'GET' && !employeeId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      const { data, error } = await supabase
        .from('employees')
        .select(`
          *,
          users!inner(id, email, first_name, last_name, phone, avatar_url, role),
          departments(id, name),
          designations(id, name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ data }),
      };
    }

    // GET - Get single employee
    if (method === 'GET' && employeeId) {
      const { data, error } = await supabase
        .from('employees')
        .select(`
          *,
          users!inner(id, email, first_name, last_name, phone, address, avatar_url, role),
          departments(id, name),
          designations(id, name),
          manager:manager_id(
            id,
            users!inner(first_name, last_name)
          )
        `)
        .eq('id', employeeId)
        .single();

      if (error) throw error;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ data }),
      };
    }

    // POST - Create employee
    if (method === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const validated = employeeSchema.parse(body);

      const { data, error } = await supabase
        .from('employees')
        .insert(validated)
        .select(`
          *,
          users!inner(id, email, first_name, last_name, phone, avatar_url),
          departments(id, name),
          designations(id, name)
        `)
        .single();

      if (error) throw error;

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ data }),
      };
    }

    // PUT - Update employee
    if (method === 'PUT' && employeeId) {
      const body = JSON.parse(event.body || '{}');
      const validated = employeeSchema.partial().parse(body);

      const { data, error } = await supabase
        .from('employees')
        .update(validated)
        .eq('id', employeeId)
        .select(`
          *,
          users!inner(id, email, first_name, last_name, phone, avatar_url),
          departments(id, name),
          designations(id, name)
        `)
        .single();

      if (error) throw error;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ data }),
      };
    }

    // DELETE - Delete employee
    if (method === 'DELETE' && employeeId) {
      const { error } = await supabase.from('employees').delete().eq('id', employeeId);

      if (error) throw error;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Employee deleted successfully' }),
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  } catch (error: any) {
    console.error('Employee function error:', error);
    return {
      statusCode: error instanceof z.ZodError ? 400 : 500,
      headers,
      body: JSON.stringify({ 
        error: error instanceof z.ZodError ? error.issues : (error.message || 'Internal server error')
      }),
    };
  }
};
