import { admin, cors, json, isWeekend } from '../_shared/common.ts';
import { pushTo } from '../_shared/wellbeing.ts';

// Called every hour by pg_cron. At 1pm, 5pm and 9pm UK time on weekdays it reminds each student
// that a study block has opened. A log table makes sure each reminder goes out once.
const BLOCK_HOURS = [13, 17, 21];
const SCHEDULE: Record<number, string[]> = { 1: ['Science', 'Electrical'], 2: ['Statistics', 'Business'], 3: ['Science', 'Electrical'], 4: ['Statistics', 'Business'], 5: ['Science', 'Electrical'] };

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const now = new Date();
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', hour: 'numeric', hourCycle: 'h23', weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit' })
    .formatToParts(now).map(p => [p.type, p.value]));
  const hour = Number(parts.hour);
  const block = BLOCK_HOURS.indexOf(hour);
  if (isWeekend() || block === -1) return json({ sent: 0, reason: 'not a block time' });
  const day = `${parts.year}-${parts.month}-${parts.day}`;
  const wd = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5 }[parts.weekday as string] ?? 0;
  const subjects = ['Maths', 'English', ...(SCHEDULE[wd] ?? [])];
  const list = subjects.slice(0, -1).join(', ') + ' and ' + subjects.at(-1);

  const { data: students } = await admin.from('profiles').select('id, display_name').eq('role', 'student');
  let sent = 0;
  for (const s of students ?? []) {
    const { error } = await admin.from('reminder_log').insert({ user_id: s.id, day, block: block + 1 });
    if (error) continue; // already reminded for this block
    sent += await pushTo([s.id], {
      title: block === 0 ? `Time to start, ${s.display_name}` : `Block ${block + 1} of 3 is open`,
      body: `${list}. About 20 minutes each, and every lesson earns fishing time.`,
      tag: 'block', url: './#/today',
    });
  }
  return json({ sent });
});
