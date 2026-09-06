import { createClient, type SupabaseClient } from '@supabase/supabase-js';
// Only public browser credentials belong here. Access is enforced by RLS.
export const supabaseUrl = '';
const publishableKey = '';
export const isCloudConfigured = Boolean(supabaseUrl && publishableKey);
let client: SupabaseClient | null = null;
export function getSupabase() {
  if (!supabaseUrl || !publishableKey) return null;
  client ??= createClient(supabaseUrl, publishableKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  return client;
}
