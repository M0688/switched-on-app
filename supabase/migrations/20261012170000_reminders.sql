-- One row per reminder sent, so each block's reminder goes out once.
create table public.reminder_log (
  user_id uuid not null references public.profiles(id) on delete cascade,
  day date not null,
  block int not null check (block between 1 and 3),
  sent_at timestamptz not null default now(),
  primary key (user_id, day, block)
);
alter table public.reminder_log enable row level security;
-- No policies: only the reminders function (service role) uses it.
