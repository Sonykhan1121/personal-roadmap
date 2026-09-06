-- Run in the Supabase SQL editor as postgres. All test records are rolled back.
begin;
insert into auth.users (id, email, aud, role) values
 ('bd959560-572d-492e-a709-49866f202e41', 'roadmap-test-a@example.invalid', 'authenticated', 'authenticated'),
 ('bd959560-572d-492e-a709-49866f202e42', 'roadmap-test-b@example.invalid', 'authenticated', 'authenticated');
set local role authenticated;
select set_config('request.jwt.claim.sub', 'bd959560-572d-492e-a709-49866f202e41', true);
insert into public.roadmap_progress (user_id, topic_id, status) values ('bd959560-572d-492e-a709-49866f202e41', 'rls-verification', 'learning');
insert into public.roadmap_settings (user_id, weekly_hours) values ('bd959560-572d-492e-a709-49866f202e41', 10);
update public.roadmap_progress set status = 'done', notes = 'Verification only' where topic_id = 'rls-verification';
do $$ begin
 if (select count(*) from public.roadmap_progress where status = 'done') <> 1 then raise exception 'Owner update/read failed'; end if;
 if (select count(*) from public.roadmap_settings) <> 1 then raise exception 'Owner settings read failed'; end if;
 begin
  update public.roadmap_progress set user_id = 'bd959560-572d-492e-a709-49866f202e42';
  raise exception 'Ownership reassignment was allowed';
 exception when insufficient_privilege then null;
 end;
end $$;
select set_config('request.jwt.claim.sub', 'bd959560-572d-492e-a709-49866f202e42', true);
do $$ declare affected integer; begin
 if (select count(*) from public.roadmap_progress) <> 0 then raise exception 'Cross-user progress read was allowed'; end if;
 if (select count(*) from public.roadmap_settings) <> 0 then raise exception 'Cross-user settings read was allowed'; end if;
 update public.roadmap_progress set notes = 'Cross-user overwrite';
 get diagnostics affected = row_count;
 if affected <> 0 then raise exception 'Cross-user progress update was allowed'; end if;
 update public.roadmap_settings set weekly_hours = 1;
 get diagnostics affected = row_count;
 if affected <> 0 then raise exception 'Cross-user settings update was allowed'; end if;
 begin
  insert into public.roadmap_progress (user_id, topic_id) values ('bd959560-572d-492e-a709-49866f202e41', 'forbidden');
  raise exception 'Cross-user progress insert was allowed';
 exception when insufficient_privilege then null;
 end;
 begin
  insert into public.roadmap_settings (user_id) values ('bd959560-572d-492e-a709-49866f202e41');
  raise exception 'Cross-user settings insert was allowed';
 exception when insufficient_privilege then null;
 end;
end $$;
reset role;
do $$ begin
 if has_table_privilege('anon', 'public.roadmap_progress', 'SELECT') or has_table_privilege('anon', 'public.roadmap_settings', 'SELECT') then raise exception 'Anonymous access was allowed'; end if;
end $$;
rollback;
select 'Ownership checks passed. All test records rolled back.' as result;
