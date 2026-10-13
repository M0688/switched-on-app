import { createClient, SupabaseClient } from 'npm:@supabase/supabase-js@2';

export const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
}

export const admin: SupabaseClient = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  { auth: { persistSession: false } },
);

/** Returns the signed-in student's profile, or a Response to send back. */
export async function requireStudent(req: Request) {
  const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
  if (!token) return { error: json({ error: 'Please sign in again.' }, 401) };
  const { data, error } = await admin.auth.getUser(token);
  if (error || !data.user) return { error: json({ error: 'Please sign in again.' }, 401) };
  const { data: prof } = await admin.from('profiles').select('*').eq('id', data.user.id).single();
  if (!prof || prof.role !== 'student') return { error: json({ error: 'Only student accounts can use this.' }, 403) };
  return { profile: prof as { id: string; display_name: string; family_id: string } };
}

/** Returns the signed-in learner's profile: any student, or a parent who follows a course of their own. */
export async function requireLearner(req: Request) {
  const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
  if (!token) return { error: json({ error: 'Please sign in again.' }, 401) };
  const { data, error } = await admin.auth.getUser(token);
  if (error || !data.user) return { error: json({ error: 'Please sign in again.' }, 401) };
  const { data: prof } = await admin.from('profiles').select('*').eq('id', data.user.id).single();
  if (!prof || (prof.role !== 'student' && (prof.course ?? 'gcse') === 'gcse'))
    return { error: json({ error: 'Only learner accounts can use this.' }, 403) };
  return { profile: prof as { id: string; display_name: string; family_id: string; role: string; course?: string } };
}

function londonDay() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London' }).format(new Date());
}

/** Increments today's counter; returns false if the daily limit is reached. */
export async function takeQuota(userId: string, kind: 'tutor' | 'marking', limit: number) {
  const day = londonDay();
  const { data } = await admin.from('ai_usage').select('count').match({ user_id: userId, day, kind }).maybeSingle();
  const count = data?.count ?? 0;
  if (count >= limit) return false;
  await admin.from('ai_usage').upsert({ user_id: userId, day, kind, count: count + 1 });
  return true;
}

export async function callClaude(body: Record<string, unknown>) {
  const key = Deno.env.get('ANTHROPIC_API_KEY');
  if (!key) throw new Error('The AI helper is not set up yet (missing API key).');
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    console.error('Anthropic error', res.status, await res.text());
    throw new Error('The AI helper is busy. Try again in a minute.');
  }
  return await res.json();
}

/** No lessons at weekends: study features are closed on Saturdays and Sundays (UK time). */
export function isWeekend() {
  const d = new Intl.DateTimeFormat('en-GB', { weekday: 'short', timeZone: 'Europe/London' }).format(new Date());
  return d === 'Sat' || d === 'Sun';
}
