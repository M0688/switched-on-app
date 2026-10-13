-- Courses: each profile follows one course. 'gcse' (default) is Mason's; 'repair' is circuit board repair.
-- A parent can have a course of their own as well as seeing their family.
alter table public.profiles
  add column course text not null default 'gcse' check (course in ('gcse', 'repair'));
-- Clients still may only change display_name (column grants unchanged), so nobody can switch course themselves.

-- Anyone following a course can save their own attempts (students as before, plus parents with a course).
-- The older "students add own attempts" policy is left in place; policies are OR'd, so it's a subset of this one.
create policy "learners add own attempts" on public.attempts
  for insert to authenticated with check (
    user_id = auth.uid() and exists (
      select 1 from public.profiles
      where id = auth.uid() and (role = 'student' or course <> 'gcse')));

-- Weekly lessons for the repair tracks, with a level (1 core, 2 bench, 3 advanced).
alter table public.lessons drop constraint lessons_subject_check, add constraint lessons_subject_check check (subject in (
  'maths', 'english', 'science', 'statistics', 'business', 'electrical',
  'basics', 'testing', 'faults', 'rework', 'devices'));
alter table public.lessons add column level smallint check (level between 1 and 3);

-- Applied by hand on 13 Oct 2026, then: update profiles set course = 'repair' for Mitchell's parent profile.
