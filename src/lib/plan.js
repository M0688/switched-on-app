/* The daily plan (agreed with Mitchell, 12 Oct 2026):
   - Weekdays only. Three study blocks a day at 1pm, 5pm and 9pm (UK time).
   - Each block has one lesson of every subject scheduled that day (Maths and English daily,
     plus Science+Electrical Mon/Wed/Fri or Statistics+Business Tue/Thu). So 12 lessons a day.
   - A block's lessons open at its start time; missed ones can be caught up later the same day.
   - He moves on to the next lesson whatever he scores. When a subject's lessons run out,
     its weakest lesson comes back as a review.
   Everything here is worked out from his saved attempts, so it's the same on every device. */
import { dayKey, isWeekend, londonWeekday } from './stats.js';

export const BLOCK_HOURS = [13, 17, 21];
export const PER_DAY = BLOCK_HOURS.length;

const hm = new Intl.DateTimeFormat('en-GB', { hour: 'numeric', minute: 'numeric', hourCycle: 'h23', timeZone: 'Europe/London' });
export function londonHour(d) {
  const parts = Object.fromEntries(hm.formatToParts(new Date(d)).map(p => [p.type, p.value]));
  return Number(parts.hour) + Number(parts.minute) / 60;
}
/** How many blocks have opened by this moment (0-3). */
export const blocksOpen = d => isWeekend(d) ? 0 : BLOCK_HOURS.filter(h => londonHour(d) >= h).length;
/** Lessons open by this moment. A schedule marked allDay opens the whole day's lessons at once (weekdays). */
export const opened = (schedule, d) => schedule?.allDay ? (isWeekend(d) ? 0 : PER_DAY) : blocksOpen(d);
export const blockLabel = i => { const h = BLOCK_HOURS[i]; return `${h > 12 ? h - 12 : h}${h >= 12 ? 'pm' : 'am'}`; };

export function scheduledOn(subjects, schedule, subj, d) {
  if (isWeekend(d)) return false;
  return !!subjects[subj].core || (schedule[londonWeekday(d)] ?? []).includes(subj);
}

/** The lesson a subject is up to: the first one never tried, or (when all are done) the weakest one. */
export function nextLesson(sessions, tried, best, last = {}) {
  const fresh = sessions.find(s => !tried.has(s.key));
  if (fresh) return { session: fresh, review: false };
  const scored = sessions.filter(s => !s.writing);
  // Weakest first; on a tie, the one he hasn't seen for longest.
  const weakest = [...scored].sort((a, b) => (best[a.key] ?? 0) - (best[b.key] ?? 0) || (last[a.key] ?? '').localeCompare(last[b.key] ?? '') || scored.indexOf(a) - scored.indexOf(b))[0];
  return { session: weakest, review: true };
}

/** Replays everything in order and marks which attempts filled a planned slot. */
export function replay(subjects, schedule, attempts, writings) {
  const events = [
    ...attempts.map(a => ({ ...a, kind: 'lesson' })),
    ...writings.map(w => ({ ...w, kind: 'writing', subject: 'english', session_key: subjects.english.sessions.find(s => s.writing)?.key })),
  ].sort((a, b) => a.created_at.localeCompare(b.created_at));
  const tried = {}, best = {}, last = {}, slots = {};
  for (const id of Object.keys(subjects)) { tried[id] = new Set(); best[id] = {}; last[id] = {}; }
  for (const ev of events) {
    const subj = ev.subject, sessions = subjects[subj]?.sessions;
    if (!sessions) continue;
    const day = dayKey(ev.created_at);
    const used = (slots[day] ??= {})[subj] ?? 0;
    const next = nextLesson(sessions, tried[subj], best[subj], last[subj]);
    ev.planned = scheduledOn(subjects, schedule, subj, ev.created_at)
      && next.session.key === ev.session_key
      && used < PER_DAY && used < opened(schedule, ev.created_at);
    if (ev.planned) { slots[day][subj] = used + 1; ev.slot = used + 1; ev.review = next.review; }
    tried[subj].add(ev.session_key);
    last[subj][ev.session_key] = ev.created_at;
    if (ev.kind === 'lesson') best[subj][ev.session_key] = Math.max(best[subj][ev.session_key] ?? 0, ev.score);
  }
  return { events, tried, best, last, slots };
}

/** Today's plan for the Today screen. */
export function dayPlan(subjects, schedule, attempts, writings, now = new Date()) {
  const { events, tried, best, last, slots } = replay(subjects, schedule, attempts, writings);
  const today = dayKey(now), open = opened(schedule, now);
  const subjectsToday = Object.keys(subjects).filter(id => scheduledOn(subjects, schedule, id, now));
  const items = subjectsToday.map(id => {
    const done = slots[today]?.[id] ?? 0;
    const next = nextLesson(subjects[id].sessions, tried[id], best[id], last[id]);
    const todays = events.filter(e => e.planned && e.subject === id && dayKey(e.created_at) === today);
    return {
      subject: id, name: subjects[id].name, done, open: Math.min(open, PER_DAY),
      canStart: done < Math.min(open, PER_DAY), finished: done >= PER_DAY,
      next: next.session, review: next.review, index: subjects[id].sessions.indexOf(next.session), total: subjects[id].sessions.length,
      results: todays.map(e => ({ score: e.score, total: e.total, writing: e.kind === 'writing' })),
    };
  });
  const lessonsDone = items.reduce((t, i) => t + i.done, 0);
  return {
    weekend: isWeekend(now), items, open, lessonsDone, lessonsTotal: items.length * PER_DAY,
    nextBlock: open < PER_DAY ? open : null, // index of the next block to open
    currentBlock: items.length ? Math.min(...items.map(i => i.done)) : 0, // block he should be working on
  };
}

/** Can this lesson be opened now? Returns { ok, why, planned }. */
export function lessonAccess(subjects, schedule, attempts, writings, key, now = new Date()) {
  const subj = Object.keys(subjects).find(id => subjects[id].sessions.some(s => s.key === key));
  if (!subj) return { ok: false, why: 'That lesson wasn’t found.' };
  const { tried, best, last, slots } = replay(subjects, schedule, attempts, writings);
  const next = nextLesson(subjects[subj].sessions, tried[subj], best[subj], last[subj]);
  if (next.session.key !== key) {
    return tried[subj].has(key) ? { ok: true, planned: false } : { ok: false, why: 'You’ll get to this lesson soon. Do the ones on your Today screen first.' };
  }
  const used = slots[dayKey(now)]?.[subj] ?? 0, open = opened(schedule, now);
  let why = null;
  if (isWeekend(now)) why = 'No lessons at weekends.';
  else if (!scheduledOn(subjects, schedule, subj, now)) why = `${subjects[subj].name} isn’t on today’s plan.`;
  else if (used >= PER_DAY) why = `That’s all ${PER_DAY} ${subjects[subj].name} lessons done today.`;
  else if (used >= open) why = `Your next ${subjects[subj].name} lesson opens at ${blockLabel(used)}.`;
  if (!why) return { ok: true, planned: true };
  return tried[subj].has(key) ? { ok: true, planned: false } : { ok: false, why };
}
