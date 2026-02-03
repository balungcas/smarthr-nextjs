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

const invoiceSchema = z.object({
  invoice_number: z.string(),
  client_id: z.string().uuid(),
  project_id: z.string().uuid().optional().nullable(),
  issue_date: z.string(),
  due_date: z.string(),
  subtotal: z.number(),
  tax_rate: z.number().optional(),
  tax_amount: z.number().optional(),
  discount: z.number().optional(),
  total: z.number(),
  status: z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled']).optional(),
  notes: z.string().optional().nullable(),
  items: z.array(z.object({
    description: z.string(),
    quantity: z.number(),
    rate: z.number(),
    amount: z.number(),
  })),
});

export const handler = async (event: HandlerEvent, context: Context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const method = event.httpMethod;
    const pathParts = event.path.split('/');
    const invoiceId = pathParts[pathParts.length - 1];
    const action = pathParts[pathParts.length - 2];

    // GET - List all invoices
    if (method === 'GET' && !invoiceId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          clients!inner(id, client_id, company_name, first_name, last_name, email),
          projects(id, name),
          invoice_items(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ data }),
      };
    }

    // GET - Get single invoice with items
    if (method === 'GET' && invoiceId) {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          clients!inner(id, client_id, company_name, first_name, last_name, email, address),
          projects(id, name),
          invoice_items(*),
          payments(*)
        `)
        .eq('id', invoiceId)
        .single();

      if (error) throw error;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ data }),
      };
    }

    // POST - Create invoice
    if (method === 'POST' && action !== 'payment') {
      const body = JSON.parse(event.body || '{}');
      const { items, ...invoiceData } = invoiceSchema.parse(body);

      // Insert invoice
      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .insert(invoiceData)
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      // Insert invoice items
      const itemsWithInvoiceId = items.map((item) => ({
        ...item,
        invoice_id: invoice.id,
      }));

      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(itemsWithInvoiceId);

      if (itemsError) throw itemsError;

      // Fetch complete invoice with items
      const { data: completeInvoice } = await supabase
        .from('invoices')
        .select(`
          *,
          clients!inner(id, client_id, company_name, first_name, last_name, email),
          projects(id, name),
          invoice_items(*)
        `)
        .eq('id', invoice.id)
        .single();

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ data: completeInvoice }),
      };
    }

    // POST - Create payment for invoice (Stripe integration)
    if (method === 'POST' && action === 'payment') {
      const body = JSON.parse(event.body || '{}');
      const { amount, payment_method_id, invoice_id, created_by } = body;

      // Get invoice details
      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .select('*, clients!inner(email, first_name, last_name)')
        .eq('id', invoice_id)
        .single();

      if (invoiceError) throw invoiceError;

      // Record payment in database (Stripe integration removed)
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert({
          invoice_id,
          amount,
          payment_date: new Date().toISOString().split('T')[0],
          payment_method: payment_method_id || 'manual',
          transaction_id: `TXN-${Date.now()}`, // Generate simple transaction ID
          created_by,
        })
        .select()
        .single();

      if (paymentError) throw paymentError;

      // Update invoice status to paid if fully paid
      const totalPaid = await supabase
        .from('payments')
        .select('amount')
        .eq('invoice_id', invoice_id);

      const paidSum = totalPaid.data?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

      if (paidSum >= invoice.total) {
        await supabase
          .from('invoices')
          .update({ status: 'paid' })
          .eq('id', invoice_id);
      }

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ 
          data: payment,
        }),
      };
    }

    // PUT - Update invoice
    if (method === 'PUT' && invoiceId) {
      const body = JSON.parse(event.body || '{}');
      const { items, ...invoiceData } = body;

      const { data, error } = await supabase
        .from('invoices')
        .update(invoiceData)
        .eq('id', invoiceId)
        .select(`
          *,
          clients!inner(id, client_id, company_name, first_name, last_name),
          projects(id, name),
          invoice_items(*)
        `)
        .single();

      if (error) throw error;

      // Update items if provided
      if (items) {
        // Delete existing items
        await supabase.from('invoice_items').delete().eq('invoice_id', invoiceId);

        // Insert new items
        const itemsWithInvoiceId = items.map((item: any) => ({
          ...item,
          invoice_id: invoiceId,
        }));

        await supabase.from('invoice_items').insert(itemsWithInvoiceId);
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ data }),
      };
    }

    // DELETE - Delete invoice
    if (method === 'DELETE' && invoiceId) {
      // Delete invoice items first (cascade should handle this but being explicit)
      await supabase.from('invoice_items').delete().eq('invoice_id', invoiceId);

      const { error } = await supabase.from('invoices').delete().eq('id', invoiceId);

      if (error) throw error;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Invoice deleted successfully' }),
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  } catch (error: any) {
    console.error('Invoice function error:', error);
    return {
      statusCode: error instanceof z.ZodError ? 400 : 500,
      headers,
      body: JSON.stringify({ 
        error: error instanceof z.ZodError ? error.issues : (error.message || 'Internal server error')
      }),
    };
  }
};
