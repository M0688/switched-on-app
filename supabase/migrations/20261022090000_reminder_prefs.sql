-- Reminder times chosen in Settings: up to 3 a weekday, 'HH:MM' in 15-minute steps.
-- A learner edits their own; a parent can also edit their children's (can_view).
create table if not exists public.reminder_prefs (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  enabled boolean not null default true,
  times text[] not null default '{09:00}' check (
    cardinality(times) <= 3
    and array_to_string(times, ',') ~ '^(([01][0-9]|2[0-3]):(00|15|30|45)(,|$))*$'),
  updated_at timestamptz not null default now()
);
alter table public.reminder_prefs enable row level security;
create policy "read reminder prefs" on public.reminder_prefs for select to authenticated using (public.can_view(user_id));
create policy "add reminder prefs" on public.reminder_prefs for insert to authenticated with check (public.can_view(user_id));
create policy "change reminder prefs" on public.reminder_prefs for update to authenticated using (public.can_view(user_id)) with check (public.can_view(user_id));
grant select, insert, update on public.reminder_prefs to authenticated;
-- The reminders function now runs every 15 minutes:
-- select cron.alter_job(job_id := jobid, schedule := '*/15 * * * *') from cron.job where jobname = 'switched-on-reminders';
