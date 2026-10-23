/* Pure functions for the daily plan and progress stats. No React, no network. */
export const PASS = 7;

const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London' });
export const dayKey = (d = new Date()) => fmt.format(new Date(d));
export function addDays(key, n) {
  const d = new Date(key + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function bestBySession(attempts) {
  const best = {};
  for (const a of attempts) best[a.session_key] = Math.max(best[a.session_key] ?? 0, a.score);
  return best;
}

export function isPassed(session, best, writings) {
  if (session.writing) return writings.some(w => w.status === 'marked');
  return (best[session.key] ?? -1) >= PASS;
}

/**
 * Today's plan: for each subject, the first session not yet passed.
 * A subject counts as done today once he has finished any attempt (or submitted writing) for it today.
 */
export const londonWeekday = (d = new Date()) => ({ Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 })[new Intl.DateTimeFormat('en-GB', { weekday: 'short', timeZone: 'Europe/London' }).format(new Date(d))];
/** No lessons at weekends, ever. */
export const isWeekend = (d = new Date()) => [0, 6].includes(londonWeekday(d));
const keyWeekend = key => [0, 6].includes(new Date(key + 'T12:00:00Z').getUTCDay());

export function todayPlan(subjects, attempts, writings, now = new Date(), schedule = null) {
  const today = dayKey(now);
  const best = bestBySession(attempts);
  if (schedule && isWeekend(now)) return [];
  const extras = schedule ? (schedule[londonWeekday(now)] ?? []) : null;
  return Object.entries(subjects).filter(([id, subj]) => !extras || subj.core || extras.includes(id)).map(([id, subj]) => {
    const next = subj.sessions.find(s => !isPassed(s, best, writings)) ?? null;
    const todays = attempts.filter(a => a.subject === id && dayKey(a.created_at) === today);
    const wroteToday = id === 'english' && writings.some(w => dayKey(w.created_at) === today);
    const index = next ? subj.sessions.indexOf(next) : subj.sessions.length;
    return {
      subject: id, name: subj.name, next, index, total: subj.sessions.length,
      doneToday: todays.length > 0 || wroteToday,
      todayBest: todays.length ? Math.max(...todays.map(a => a.score)) : null,
      lastTry: next ? attempts.filter(a => a.session_key === next.key).sort((a, b) => b.created_at.localeCompare(a.created_at))[0] ?? null : null,
      complete: !next,
    };
  });
}

/** Consecutive weekdays studied, ending today (or the last weekday, if today isn't done yet). Weekends never break it. */
export function streak(attempts, writings, now = new Date()) {
  const days = new Set([...attempts, ...writings].map(a => dayKey(a.created_at)));
  const prevWeekday = k => { do k = addDays(k, -1); while (keyWeekend(k)); return k; };
  let d = dayKey(now);
  if (keyWeekend(d) || !days.has(d)) d = prevWeekday(d);
  let n = 0;
  while (days.has(d)) { n++; d = prevWeekday(d); }
  return n;
}

export function activity(attempts, writings, days = 14, now = new Date()) {
  const counts = {};
  for (const a of [...attempts, ...writings]) { const k = dayKey(a.created_at); counts[k] = (counts[k] ?? 0) + 1; }
  const today = dayKey(now);
  return Array.from({ length: days }, (_, i) => { const k = addDays(today, i - days + 1); return { day: k, count: counts[k] ?? 0, weekend: keyWeekend(k) }; });
}

export function sessionStats(sessions, attempts, writings) {
  const best = bestBySession(attempts);
  return sessions.map(s => {
    const mine = attempts.filter(a => a.session_key === s.key);
    const score = mine.reduce((t, a) => t + a.score, 0), total = mine.reduce((t, a) => t + a.total, 0);
    return {
      session: s, tries: s.writing ? writings.length : mine.length,
      best: s.writing ? null : (best[s.key] ?? null),
      accuracy: total ? score / total : null,
      passed: isPassed(s, best, writings),
      last: mine.length ? mine.map(a => a.created_at).sort().at(-1) : null,
    };
  });
}

export function totals(attempts) {
  const score = attempts.reduce((t, a) => t + a.score, 0), total = attempts.reduce((t, a) => t + a.total, 0);
  const secs = attempts.reduce((t, a) => t + (a.duration_s ?? 0), 0);
  return { answered: total, correct: score, accuracy: total ? score / total : null, minutes: Math.round(secs / 60) };
}

/** The weakest passed session, for an optional review once today's work is done. */
export function reviewPick(stats) {
  const cands = stats.filter(s => s.passed && !s.session.writing && s.accuracy != null);
  cands.sort((a, b) => a.accuracy - b.accuracy);
  return cands[0]?.session ?? null;
}

/** Signs a lesson's answers may have come from somewhere else (e.g. a screenshot pasted into an AI app).
    Uses what the lesson screen records per question: seconds away from the app before answering, and
    how soon after coming back the answer went in. Older attempts without these fields only get the
    "rushed" check. Returns { level: 'ok' | 'check' | 'likely', reasons: [...] }. */
export const RUSHED_SECS = 120;
export function integrity(attempt) {
  const d = Array.isArray(attempt.details) ? attempt.details : [];
  const tracked = d.some(x => 'away' in x);
  const awayQs = d.filter(x => x.away > 0);
  const awaySecs = awayQs.reduce((t, x) => t + x.away, 0);
  // Left the app for 5 s or more, came back, and answered within 20 s.
  const lookups = d.filter(x => x.away >= 5 && x.afterBack != null && x.afterBack <= 20);
  const reasons = [];
  if (lookups.length) reasons.push(`${lookups.length} answer${lookups.length === 1 ? '' : 's'} given straight after coming back to the app`);
  if (awayQs.length) reasons.push(`left the app ${awayQs.length} time${awayQs.length === 1 ? '' : 's'} during the questions (${awaySecs} s away)`);
  if (attempt.duration_s != null && attempt.duration_s < RUSHED_SECS) reasons.push('finished in under 2 minutes');
  const perfect = attempt.total && attempt.score === attempt.total;
  let level = 'ok';
  if (lookups.length >= 2 || (lookups.length >= 1 && perfect && awayQs.length >= 2)) level = 'likely';
  else if (lookups.length || awayQs.length >= 2 || (attempt.duration_s != null && attempt.duration_s < RUSHED_SECS)) level = 'check';
  return { level, reasons, tracked };
}
