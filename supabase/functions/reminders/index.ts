import { createClient } from 'npm:@supabase/supabase-js@2';
import webpush from 'npm:web-push@3.6.7';

// Called every 15 minutes by pg_cron. On weekdays it sends each learner (students, and parents
// following a course of their own) a reminder at the times they chose in Settings (reminder_prefs,
// up to 3 a day). With no settings saved, the reminder goes at 9am. reminder_log stops repeats.
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });

const DEFAULT_TIMES = ['09:00'];
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

function message(p: { role: string; display_name: string }, n: number, wd: number) {
  const first = n === 1;
  if (p.role === 'student') {
    const subjects = ['Maths', 'English', ...(SCHEDULE[wd] ?? [])];
    const list = subjects.slice(0, -1).join(', ') + ' and ' + subjects.at(-1);
    return {
      title: first ? `Today's lessons are ready, ${p.display_name}` : `Lesson reminder, ${p.display_name}`,
      body: `${list}: three lessons each, any time today. Every lesson earns fishing time.`,
      tag: 'block', url: './#/today',
    };
  }
  return {
    title: first ? "Repair course: today's lessons are open" : 'Repair course reminder',
    body: `${REPAIR_SUBJECTS}: three lessons each, whenever suits you today.`,
    tag: 'repair-block', url: './#/me',
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', hour: 'numeric', minute: 'numeric', hourCycle: 'h23', weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date()).map((p) => [p.type, p.value]));
  const wd = ({ Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5 } as Record<string, number>)[parts.weekday] ?? 0;
  if (!wd) return json({ sent: 0, reason: 'weekend' });
  const slot = `${parts.hour.padStart(2, '0')}:${String(Math.floor(Number(parts.minute) / 15) * 15).padStart(2, '0')}`;
  const day = `${parts.year}-${parts.month}-${parts.day}`;

  const { data: people } = await admin.from('profiles').select('id, role, display_name, course');
  const { data: prefs } = await admin.from('reminder_prefs').select('user_id, enabled, times');
  const byUser = new Map((prefs ?? []).map((p) => [p.user_id, p]));
  let sent = 0;
  for (const p of people ?? []) {
    if (p.role !== 'student' && (p.course ?? 'gcse') === 'gcse') continue; // parents without a course of their own
    const pref = byUser.get(p.id);
    if (pref && !pref.enabled) continue;
    const times: string[] = pref ? pref.times : DEFAULT_TIMES;
    const i = times.indexOf(slot);
    if (i === -1) continue;
    const { error } = await admin.from('reminder_log').insert({ user_id: p.id, day, block: i + 1 });
    if (error) continue; // already sent
    sent += await pushTo([p.id], message(p, i + 1, wd));
  }
  return json({ sent, slot });
});
