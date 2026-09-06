-- Supabase's "Enable automatic RLS" project option creates this event-trigger
-- helper. Only database administrators need to execute it.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
