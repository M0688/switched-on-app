import { createClient } from 'npm:@supabase/supabase-js@2';
import webpush from 'npm:web-push@3.6.7';

// Called every hour by pg_cron. At 1pm, 5pm and 9pm UK time on weekdays it reminds each student
// that a study block has opened; repair-course parents get one 9am reminder instead.
// reminder_log makes sure each reminder goes out once.
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });

const BLOCK_HOURS = [13, 17, 21];
const SCHEDULE: Record<number, string[]> = { 1: ['Science', 'Electrical'], 2: ['Statistics', 'Business'], 3: ['Science', 'Electrical'], 4: ['Statistics', 'Business'], 5: ['Science', 'Electrical'] };
const REPAIR_SUBJECTS = 'Components, testing, PCBs, phones, motherboards and consoles';

let vapidReady = false;
function setupVapid() {
  if (vapidReady) return true;
  const pub = Deno.env.get('VAPID_PUBLIC_KEY'), priv = Deno.env.get('VAPID_PRIVATE_KEY');
  if (!pub || !priv) return false;
  webpush.setVapidDetails(Deno.env.get('VAPID_SUBJECT') ?? 'mailto:alerts@switched-on.app', pub, priv);
  return (vapidReady = true);
}
async function pushTo(userIds: string[], msg: Record<string, unknown>) {
  if (!userIds.length || !setupVapid()) return 0;
  const { data: subs } = await admin.from('push_subscriptions').select('*').in('user_id', userIds);
  const payload = JSON.stringify(msg);
  const sent = await Promise.all((subs ?? []).map(async (s) => {
    try {
      const d = webpush.generateRequestDetails({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload, { TTL: 3 * 3600, urgency: 'normal' });
      const res = await fetch(d.endpoint, { method: d.method, headers: d.headers, body: d.body });
      if (res.status === 404 || res.status === 410) await admin.from('push_subscriptions').delete().eq('id', s.id);
      else if (!res.ok) console.error('push failed', res.status, await res.text());
      return res.ok;
    } catch (e) {
      console.error('push failed', e);
      return false;
    }
  }));
  return sent.filter(Boolean).length;
}

// Parents with a course of their own (circuit board repair): all of the day's lessons open at once,
// so one reminder each weekday morning. The link opens "My course".
const REPAIR_HOUR = 9;
async function remindRepair(day: string) {
  let n = 0;
  const { data: adults } = await admin.from('profiles').select('id').eq('role', 'parent').eq('course', 'repair');
  for (const s of adults ?? []) {
    const { error } = await admin.from('reminder_log').insert({ user_id: s.id, day, block: 1 });
    if (error) continue;
    n += await pushTo([s.id], {
      title: "Repair course: today's lessons are open",
      body: `${REPAIR_SUBJECTS}: three lessons each, whenever suits you today.`,
      tag: 'repair-block',
      url: './#/me',
    });
  }
  return n;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', hour: 'numeric', hourCycle: 'h23', weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date()).map((p) => [p.type, p.value]));
  const wd = ({ Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5 } as Record<string, number>)[parts.weekday] ?? 0;
  const hour = Number(parts.hour);
  const block = BLOCK_HOURS.indexOf(hour);
  const repairTime = hour === REPAIR_HOUR;
  if (!wd || (block === -1 && !repairTime)) return json({ sent: 0, reason: 'not a reminder time' });
  const day = `${parts.year}-${parts.month}-${parts.day}`;
  let sent = 0;
  if (repairTime) sent += await remindRepair(day);
  if (block === -1) return json({ sent });
  const subjects = ['Maths', 'English', ...(SCHEDULE[wd] ?? [])];
  const list = subjects.slice(0, -1).join(', ') + ' and ' + subjects.at(-1);

  const { data: students } = await admin.from('profiles').select('id, display_name').eq('role', 'student');
  for (const s of students ?? []) {
    const { error } = await admin.from('reminder_log').insert({ user_id: s.id, day, block: block + 1 });
    if (error) continue;
    sent += await pushTo([s.id], {
      title: block === 0 ? `Time to start, ${s.display_name}` : `Block ${block + 1} of 3 is open`,
      body: `${list}. About 20 minutes each, and every lesson earns fishing time.`,
      tag: 'block',
      url: './#/today',
    });
  }

  return json({ sent });
});
