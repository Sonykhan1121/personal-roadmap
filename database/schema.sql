-- Personal roadmap progress. Authentication is provided by Supabase Auth.
create table public.roadmap_progress (
 user_id uuid not null references auth.users(id) on delete cascade,
 topic_id text not null check (length(topic_id) between 1 and 100),
 status text not null default 'not_started' check (status in ('not_started','learning','practicing','done','skipped')),
 checked_steps integer[] not null default '{}' check (cardinality(checked_steps) <= 10 and checked_steps <@ array[0,1,2,3,4,5,6,7,8,9]),
 notes text not null default '' check (length(notes) <= 20000),
 evidence_url text not null default '' check (length(evidence_url) <= 2048 and (evidence_url = '' or evidence_url ~ '^https?://')),
 review_date date,
 updated_at timestamptz not null default now(),
 primary key (user_id, topic_id)
);
create table public.roadmap_settings (
 user_id uuid primary key references auth.users(id) on delete cascade,
 weekly_hours integer not null default 10 check (weekly_hours between 1 and 40),
 start_date date not null default current_date,
 updated_at timestamptz not null default now()
);
alter table public.roadmap_progress enable row level security;
alter table public.roadmap_settings enable row level security;
revoke all on public.roadmap_progress, public.roadmap_settings from anon, authenticated;
grant select, insert, update, delete on public.roadmap_progress, public.roadmap_settings to authenticated;
create policy "Read own progress" on public.roadmap_progress for select to authenticated using ((select auth.uid()) = user_id);
create policy "Create own progress" on public.roadmap_progress for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Update own progress" on public.roadmap_progress for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Delete own progress" on public.roadmap_progress for delete to authenticated using ((select auth.uid()) = user_id);
create policy "Read own settings" on public.roadmap_settings for select to authenticated using ((select auth.uid()) = user_id);
create policy "Create own settings" on public.roadmap_settings for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Update own settings" on public.roadmap_settings for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Delete own settings" on public.roadmap_settings for delete to authenticated using ((select auth.uid()) = user_id);
create function public.roadmap_touch_updated_at() returns trigger language plpgsql security invoker set search_path = '' as $$
begin new.updated_at = now(); return new; end;
$$;
revoke all on function public.roadmap_touch_updated_at() from public;
create trigger roadmap_progress_updated before update on public.roadmap_progress for each row execute function public.roadmap_touch_updated_at();
create trigger roadmap_settings_updated before update on public.roadmap_settings for each row execute function public.roadmap_touch_updated_at();
