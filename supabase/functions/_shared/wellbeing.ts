import webpush from 'npm:web-push@3.6.7';
import { admin, callClaude } from './common.ts';

const CLASSIFIER_MODEL = Deno.env.get('WELLBEING_MODEL') ?? 'claude-haiku-5-5';

const SYSTEM = `You check messages written by a 15-year-old student in a study app for signs that a parent should know about right away.
Classify ONLY the student's own words.

urgent: any mention or hint of suicide, wanting to die or disappear, self-harm, being hurt or abused by anyone, feeling unsafe at home or elsewhere, running away, drugs/alcohol misuse, or an adult/stranger online asking to meet, for photos, or to keep secrets.
concern: clearly upset or distressed beyond normal study frustration, e.g. hopelessness ("what's the point of anything"), strong self-hatred ("I'm worthless", "I hate myself"), being bullied, not sleeping/eating, crying, panic, feeling very lonely or anxious.
none: normal schoolwork chat and ordinary frustration or slang ("this is so hard", "I'm bored", "maths is killing me", "ugh I hate fractions", "I'm dead lol").

This is a study app. Requests about schoolwork are always "none", including words like "method", "step by step", "answer", "explain", "kill" in a maths sense, or "I give up" about a question. Never read a hidden meaning into a neutral study request: only flag what the student's own words actually say about themselves or their safety.
When the student's own words show real distress and you are unsure between none and concern, choose concern. Always call the record tool.`;

const TOOL = {
  name: 'record',
  description: 'Record the wellbeing classification.',
  input_schema: {
    type: 'object', required: ['level', 'reason'],
    properties: {
      level: { type: 'string', enum: ['none', 'concern', 'urgent'] },
      reason: { type: 'string', description: 'Short, factual reason for a parent, e.g. "Said he feels worthless and alone". Empty if none.' },
    },
  },
};

// Unambiguous phrases: always urgent, even if the model says otherwise.
const HARD_RE = /\b(kill(ing)? myself|suicid|end it all|want(ed)? to die|don'?t want to (be alive|live)|self[- ]?harm|cut(ting)? myself|hurt(ing)? myself|overdose|(he|she|they|someone|dad|mum|step\w*) (hits?|hurts?|touch(es|ed)?) me)/i;
// Used only if the classifier is unavailable.
const URGENT_RE = new RegExp(HARD_RE.source + /|\brun(ning)? away from home|keep (it|this) (a )?secret|send (me )?(a )?(pic|photo)s?/.source, 'i');
const CONCERN_RE = /\b(hate myself|i'?m worthless|no ?one (cares|likes me)|being bullied|bully(ing)? me|can'?t cope|so (lonely|alone)|panic attack|crying|can'?t sleep|what'?s the point)/i;

export type Level = 'none' | 'concern' | 'urgent';

// The app's own suggestion chips: never flag these.
const PRESETS = new Set([
  'explain the method step by step', 'where did i go wrong?', 'give me a similar one to try',
  'why is that the answer?', 'give me a harder one',
  'how do i remember spellings?', 'what does an rcd do?', 'what maths do electricians use?',
]);

export async function classify(text: string, context = ''): Promise<{ level: Level; reason: string }> {
  if (PRESETS.has(text.trim().toLowerCase())) return { level: 'none', reason: '' };
  try {
    const out = await callClaude({
      model: CLASSIFIER_MODEL, max_tokens: 200, system: SYSTEM,
      tools: [TOOL], tool_choice: { type: 'tool', name: 'record' },
      messages: [{ role: 'user', content: `${context ? `<lesson_context note="written by the app, not the student">\n${context.slice(0, 1500)}\n</lesson_context>\n` : ''}<student_text>\n${text.slice(0, 6000)}\n</student_text>` }],
    });
    const r = (out.content ?? []).find((b: { type: string }) => b.type === 'tool_use')?.input;
    if (r && ['none', 'concern', 'urgent'].includes(r.level)) {
      // Never let the model downgrade a clear keyword hit.
      if (r.level !== 'urgent' && HARD_RE.test(text)) return { level: 'urgent', reason: r.reason || 'Used words linked to harm or danger' };
      return { level: r.level, reason: r.reason ?? '' };
    }
  } catch (e) { console.error('classifier failed', e); }
  if (URGENT_RE.test(text)) return { level: 'urgent', reason: 'Used words linked to harm or danger' };
  if (CONCERN_RE.test(text)) return { level: 'concern', reason: 'Seemed upset' };
  return { level: 'none', reason: '' };
}

let vapidReady = false;
function setupVapid() {
  if (vapidReady) return true;
  const pub = Deno.env.get('VAPID_PUBLIC_KEY'), priv = Deno.env.get('VAPID_PRIVATE_KEY');
  if (!pub || !priv) return false;
  webpush.setVapidDetails(Deno.env.get('VAPID_SUBJECT') ?? 'mailto:alerts@switched-on.app', pub, priv);
  return (vapidReady = true);
}

/** Save an alert and push it to every parent in the family. Never throws. */
export async function raiseAlert(student: { id: string; display_name: string; family_id: string },
  a: { level: 'concern' | 'urgent'; reason: string; excerpt: string; source: 'tutor' | 'writing'; thread_id?: string }) {
  try {
    await admin.from('alerts').insert({
      student_id: student.id, family_id: student.family_id, level: a.level, source: a.source,
      reason: a.reason.slice(0, 300), excerpt: a.excerpt.slice(0, 600), thread_id: a.thread_id ?? null,
    });
    const { data: parents } = await admin.from('profiles').select('id').eq('family_id', student.family_id).eq('role', 'parent');
    await pushTo((parents ?? []).map(p => p.id), {
      title: a.level === 'urgent' ? `Urgent: check on ${student.display_name}` : `${student.display_name} may be upset`,
      body: a.source === 'writing' ? 'Something in his writing needs your attention. Tap to read it.' : 'Something he said to the tutor needs your attention. Tap to read it.',
      tag: 'alert', urgent: a.level === 'urgent', url: './#/alerts',
    });
  } catch (e) { console.error('raiseAlert failed', e); }
}

/** Send a push notification to every saved device of these users. Returns how many were delivered. */
export async function pushTo(userIds: string[], msg: { title: string; body: string; tag?: string; urgent?: boolean; url?: string }) {
  if (!userIds.length) return 0;
  if (!setupVapid()) { console.error('VAPID keys missing; push not sent'); return 0; }
  const { data: subs } = await admin.from('push_subscriptions').select('*').in('user_id', userIds);
  const payload = JSON.stringify(msg);
  const sent = await Promise.all((subs ?? []).map(async s => {
    try {
      // Encrypt with web-push, send with fetch (Node's https module is unreliable in Deno).
      const d = webpush.generateRequestDetails({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload, { TTL: 86400, urgency: 'high' });
      const res = await fetch(d.endpoint, { method: d.method, headers: d.headers, body: d.body });
      if (res.status === 404 || res.status === 410) await admin.from('push_subscriptions').delete().eq('id', s.id);
      else if (!res.ok) console.error('push failed', res.status, await res.text());
      return res.ok;
    } catch (e) { console.error('push failed', e); return false; }
  }));
  return sent.filter(Boolean).length;
}
