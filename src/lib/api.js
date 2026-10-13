import { supabase } from './supabase.js';

const must = ({ data, error }) => { if (error) throw new Error(friendly(error.message)); return data; };
function friendly(m = '') {
  if (/Invalid login/i.test(m)) return 'Wrong email or password.';
  if (/Email not confirmed/i.test(m)) return 'Check your email and tap the link to confirm your account first.';
  if (/already registered/i.test(m)) return 'That email already has an account. Sign in instead.';
  if (/Password should be/i.test(m)) return 'Use a password of at least 8 characters.';
  return m.replace(/^.*?ERROR:\s*/, '') || 'Something went wrong. Try again.';
}

export async function getProfile(userId) {
  return must(await supabase.from('profiles').select('*').eq('id', userId).maybeSingle());
}
export async function getFamily() {
  return must(await supabase.from('families').select('*').maybeSingle());
}
export async function familyStudents() {
  return must(await supabase.from('profiles').select('*').eq('role', 'student').order('created_at'));
}
export async function setupParent(name) { return must(await supabase.rpc('setup_parent', { p_name: name })); }
export async function setupStudent(name, code) { return must(await supabase.rpc('setup_student', { p_name: name, p_code: code })); }
export async function joinAsParent(name, code) { return must(await supabase.rpc('join_as_parent', { p_name: name, p_code: code })); }

export async function loadStudentData(userId) {
  const [a, w, f] = await Promise.all([
    supabase.from('attempts').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(5000),
    supabase.from('writing_submissions').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(500),
    supabase.from('fishing_log').select('*').eq('student_id', userId).order('created_at', { ascending: false }).limit(1000),
  ]);
  return { attempts: must(a), writings: must(w), fishing: must(f) };
}

export async function saveAttempt(row) {
  return must(await supabase.from('attempts').insert(row).select().single());
}
export async function saveAttempts(rows) {
  return must(await supabase.from('attempts').insert(rows).select());
}

export async function submitWriting(title, body, wordCount) {
  return must(await supabase.from('writing_submissions').insert({ title, body, word_count: wordCount }).select().single());
}

async function invoke(name, body) {
  const { data, error } = await supabase.functions.invoke(name, { body });
  if (error) {
    let msg = 'The helper is not available right now. Try again later.';
    try { const j = await error.context.json(); if (j?.error) msg = j.error; } catch { /* keep default */ }
    throw new Error(msg);
  }
  return data;
}
export const markWriting = id => invoke('mark-writing', { submission_id: id });
export const askTutor = (p) => invoke('tutor', p);

export async function tutorThreads(userId) {
  return must(await supabase.from('tutor_messages').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(300));
}
export { friendly };

export async function loadAlerts() {
  return must(await supabase.from('alerts').select('*').order('created_at', { ascending: false }).limit(100));
}
export async function markAlertSeen(id) {
  return must(await supabase.from('alerts').update({ seen_at: new Date().toISOString() }).eq('id', id));
}
export const testPush = () => invoke('test-push', {});

export async function logFishing(student, minutes, note) {
  return must(await supabase.from('fishing_log').insert({ student_id: student.id, family_id: student.family_id, minutes, note: note || null }).select().single());
}
export async function undoFishing(id) {
  return must(await supabase.from('fishing_log').delete().eq('id', id));
}
