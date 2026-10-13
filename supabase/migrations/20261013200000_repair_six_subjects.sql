-- Repair course now has six subjects, all every weekday (one lesson of each per block).
alter table public.lessons drop constraint lessons_subject_check, add constraint lessons_subject_check check (subject in (
  'maths', 'english', 'science', 'statistics', 'business', 'electrical',
  'basics', 'testing', 'faults', 'rework', 'devices',
  'components', 'pcbs', 'phones', 'motherboards', 'consoles'));
