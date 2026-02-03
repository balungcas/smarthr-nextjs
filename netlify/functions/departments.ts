import { createClient } from '@supabase/supabase-js';
import type { Context } from '@netlify/functions';

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

export const handler = async (event: HandlerEvent, context: Context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const method = event.httpMethod;
    const path = event.path.split('/').pop();

    // GET - List all departments
    if (method === 'GET' && !path) {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ data }),
      };
    }

    // GET - Get single department
    if (method === 'GET' && path) {
      const { data, error } = await supabase
        .from('departments')
        .select('*, designations(id, name)')
        .eq('id', path)
        .single();

      if (error) throw error;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ data }),
      };
    }

    // POST - Create department
    if (method === 'POST') {
      const { name, description } = JSON.parse(event.body || '{}');

      if (!name) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Name is required' }),
        };
      }

      const { data, error } = await supabase
        .from('departments')
        .insert({ name, description })
        .select()
        .single();

      if (error) throw error;

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ data }),
      };
    }

    // PUT - Update department
    if (method === 'PUT' && path) {
      const { name, description } = JSON.parse(event.body || '{}');

      const { data, error } = await supabase
        .from('departments')
        .update({ name, description })
        .eq('id', path)
        .select()
        .single();

      if (error) throw error;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ data }),
      };
    }

    // DELETE - Delete department
    if (method === 'DELETE' && path) {
      const { error } = await supabase.from('departments').delete().eq('id', path);

      if (error) throw error;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Department deleted successfully' }),
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  } catch (error: any) {
    console.error('Department function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'Internal server error' }),
    };
  }
};
