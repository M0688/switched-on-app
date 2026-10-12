-- Switched On: study app schema
-- A family has one or more parents and one or more students.
-- Students write their own progress; parents can read everything in their family.

create table public.families (
  id uuid primary key default gen_random_uuid(),
  join_code text not null unique,
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('student', 'parent')),
  display_name text not null check (char_length(display_name) between 1 and 40),
  family_id uuid not null references public.families(id) on delete cascade,
  created_at timestamptz not null default now()
);
create index on public.profiles (family_id);

create table public.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  session_key text not null check (char_length(session_key) <= 20),
  subject text not null check (subject ~ '^[a-z]{2,20}$'),
  score int not null check (score >= 0),
  total int not null check (total > 0 and total <= 20 and score <= total),
  duration_s int check (duration_s >= 0),
  details jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
create index on public.attempts (user_id, created_at desc);

create table public.writing_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) <= 200),
  body text not null check (char_length(body) between 1 and 8000),
  word_count int not null default 0,
  status text not null default 'pending' check (status in ('pending', 'marked', 'failed')),
  feedback jsonb,
  created_at timestamptz not null default now()
);
create index on public.writing_submissions (user_id, created_at desc);

-- Tutor chats are kept so a parent can see them.
create table public.tutor_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  thread_id uuid not null,
  session_key text,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);
create index on public.tutor_messages (user_id, created_at desc);
create index on public.tutor_messages (thread_id, created_at);

-- Daily AI usage counters, written only by edge functions (service role).
create table public.ai_usage (
  user_id uuid not null references public.profiles(id) on delete cascade,
  day date not null,
  kind text not null check (kind in ('tutor', 'marking')),
  count int not null default 0,
  primary key (user_id, day, kind)
);

-- Wellbeing alerts for parents, raised by edge functions.
create table public.alerts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  family_id uuid not null references public.families(id) on delete cascade,
  level text not null check (level in ('concern', 'urgent')),
  source text not null check (source in ('tutor', 'writing')),
  reason text not null,
  excerpt text not null,
  thread_id uuid,
  created_at timestamptz not null default now(),
  seen_at timestamptz
);
create index on public.alerts (family_id, created_at desc);

-- Web push subscriptions (parents' phones).
create table public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);

-- Helpers -------------------------------------------------------------------
create or replace function public.my_family() returns uuid
language sql stable security definer set search_path = public as $$
  select family_id from public.profiles where id = auth.uid()
$$;

create or replace function public.is_parent() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'parent')
$$;

-- Can the caller see this user's records? (themselves, or a parent in the same family)
create or replace function public.can_view(target uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select target = auth.uid()
      or (public.is_parent() and exists (
            select 1 from public.profiles p where p.id = target and p.family_id = public.my_family()))
$$;

-- Onboarding RPCs ------------------------------------------------------------
create or replace function public.setup_parent(p_name text) returns public.profiles
language plpgsql security definer set search_path = public as $$
declare fam uuid; code text; prof public.profiles;
begin
  if auth.uid() is null then raise exception 'Not signed in'; end if;
  if exists (select 1 from profiles where id = auth.uid()) then raise exception 'Profile already set up'; end if;
  loop
    code := '';
    for i in 1..6 loop
      code := code || substr('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 1 + floor(random() * 32)::int, 1);
    end loop;
    exit when not exists (select 1 from families where join_code = code);
  end loop;
  insert into families (join_code) values (code) returning id into fam;
  insert into profiles (id, role, display_name, family_id)
    values (auth.uid(), 'parent', trim(p_name), fam) returning * into prof;
  return prof;
end $$;

create or replace function public.setup_student(p_name text, p_code text) returns public.profiles
language plpgsql security definer set search_path = public as $$
declare fam uuid; prof public.profiles;
begin
  if auth.uid() is null then raise exception 'Not signed in'; end if;
  if exists (select 1 from profiles where id = auth.uid()) then raise exception 'Profile already set up'; end if;
  select id into fam from families where join_code = upper(trim(p_code));
  if fam is null then raise exception 'That family code was not found'; end if;
  insert into profiles (id, role, display_name, family_id)
    values (auth.uid(), 'student', trim(p_name), fam) returning * into prof;
  return prof;
end $$;

-- A second parent can join an existing family with the code.
create or replace function public.join_as_parent(p_name text, p_code text) returns public.profiles
language plpgsql security definer set search_path = public as $$
declare fam uuid; prof public.profiles;
begin
  if auth.uid() is null then raise exception 'Not signed in'; end if;
  if exists (select 1 from profiles where id = auth.uid()) then raise exception 'Profile already set up'; end if;
  select id into fam from families where join_code = upper(trim(p_code));
  if fam is null then raise exception 'That family code was not found'; end if;
  insert into profiles (id, role, display_name, family_id)
    values (auth.uid(), 'parent', trim(p_name), fam) returning * into prof;
  return prof;
end $$;

revoke all on function public.setup_parent(text), public.setup_student(text, text), public.join_as_parent(text, text) from public, anon;
grant execute on function public.setup_parent(text), public.setup_student(text, text), public.join_as_parent(text, text) to authenticated;

-- Row level security ---------------------------------------------------------
alter table public.families enable row level security;
alter table public.profiles enable row level security;
alter table public.attempts enable row level security;
alter table public.writing_submissions enable row level security;
alter table public.tutor_messages enable row level security;
alter table public.ai_usage enable row level security;

create policy "family members read their family" on public.families
  for select to authenticated using (id = public.my_family());

create policy "read own family profiles" on public.profiles
  for select to authenticated using (family_id = public.my_family());
create policy "rename self" on public.profiles
  for update to authenticated using (id = auth.uid())
  with check (id = auth.uid());
-- Only display_name may change from the client.
revoke update on public.profiles from authenticated;
grant update (display_name) on public.profiles to authenticated;

create policy "read attempts" on public.attempts
  for select to authenticated using (public.can_view(user_id));
create policy "students add own attempts" on public.attempts
  for insert to authenticated with check (
    user_id = auth.uid() and exists (select 1 from public.profiles where id = auth.uid() and role = 'student'));

create policy "read writing" on public.writing_submissions
  for select to authenticated using (public.can_view(user_id));
create policy "students submit writing" on public.writing_submissions
  for insert to authenticated with check (
    user_id = auth.uid() and status = 'pending' and feedback is null
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'student'));

create policy "read tutor chats" on public.tutor_messages
  for select to authenticated using (public.can_view(user_id));
-- tutor_messages and ai_usage are written only by edge functions (service role bypasses RLS).

create policy "read own usage" on public.ai_usage
  for select to authenticated using (public.can_view(user_id));

alter table public.alerts enable row level security;
alter table public.push_subscriptions enable row level security;

create policy "parents read family alerts" on public.alerts
  for select to authenticated using (public.is_parent() and family_id = public.my_family());
create policy "parents mark alerts seen" on public.alerts
  for update to authenticated using (public.is_parent() and family_id = public.my_family())
  with check (public.is_parent() and family_id = public.my_family());
revoke update on public.alerts from authenticated;
grant update (seen_at) on public.alerts to authenticated;

create policy "own push subscriptions" on public.push_subscriptions
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
