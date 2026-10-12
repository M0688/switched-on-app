-- Fishing time signed off by a parent. Earned time is calculated from lessons, so it can't go down.
create table public.fishing_log (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  family_id uuid not null references public.families(id) on delete cascade,
  minutes int not null check (minutes > 0 and minutes <= 24 * 60 * 7),
  note text check (char_length(note) <= 200),
  logged_by uuid not null default auth.uid() references public.profiles(id),
  created_at timestamptz not null default now()
);
create index on public.fishing_log (student_id, created_at desc);
alter table public.fishing_log enable row level security;

create policy "family reads fishing log" on public.fishing_log
  for select to authenticated using (public.can_view(student_id));
create policy "parents log fishing" on public.fishing_log
  for insert to authenticated with check (
    public.is_parent() and logged_by = auth.uid() and family_id = public.my_family()
    and exists (select 1 from public.profiles p where p.id = student_id and p.family_id = public.my_family() and p.role = 'student'));
create policy "parents undo own entries" on public.fishing_log
  for delete to authenticated using (public.is_parent() and family_id = public.my_family());
