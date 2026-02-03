import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  // Check if we're in a browser context
  if (typeof window === 'undefined') {
    throw new Error('createClient should only be called in browser context');
  }
  
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
