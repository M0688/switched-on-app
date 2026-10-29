/* Weekly check: a broad quiz across every subject of the learner's course. Opens on Thursdays,
   so the Friday lesson writers can use the results. 3 questions per subject; questions missed last time
   come back first, then ones not seen yet, then the ones answered right longest ago.
   The lesson writers read the misses and write lessons on those gaps. */
import { shuffle } from './kit.js';
import { dayKey, addDays, londonWeekday } from '../lib/stats.js';
import { BANK as REPAIR } from './repair/weekly.js';
import { BANK as GCSE } from './weeklyGcse.js';

export const BANKS = { repair: REPAIR, gcse: GCSE };
export const WEEK_PREFIX = 'wk-';
export const PER_SUBJECT = 3;
export const NOT_SURE = 'Not sure';
export const weeklySize = courseId => Object.keys(BANKS[courseId] ?? {}).length * PER_SUBJECT;

/** Monday (London date) of the week containing `now`. Each week has one check, keyed by it. */
export function weekStart(now = new Date()) {
  const wd = londonWeekday(now);
  return addDays(dayKey(now), -((wd + 6) % 7));
}
export const weekKey = (now = new Date()) => WEEK_PREFIX + weekStart(now);
/** Open on Thursdays only (the lesson writers run Friday morning). */
export const weeklyOpen = (now = new Date()) => londonWeekday(now) === 4;
export const isWeekly = a => typeof a?.session_key === 'string' && a.session_key.startsWith(WEEK_PREFIX);
export const weeklyDone = (attempts, now = new Date()) => attempts.some(a => a.session_key === weekKey(now));
export const weeklyChecks = attempts => attempts.filter(isWeekly).sort((a, b) => (a.created_at < b.created_at ? 1 : -1));

/** Builds this week's check: per subject, last-time misses first, then unseen, then right longest ago. */
export function buildWeekly(attempts, courseId = 'repair') {
  const last = {}; // question text → { ok, at }
  for (const a of weeklyChecks(attempts).reverse()) for (const d of Array.isArray(a.details) ? a.details : []) last[d.q] = { ok: d.ok, at: a.created_at };
  const rank = q => !last[q] ? 1 : last[q].ok ? 2 : 0;
  return Object.entries(BANKS[courseId]).flatMap(([subject, rows]) => {
    const order = shuffle(rows).sort((x, y) => rank(x[1]) - rank(y[1]) || (rank(x[1]) === 2 ? (last[x[1]].at < last[y[1]].at ? -1 : 1) : 0));
    return order.slice(0, PER_SUBJECT).map(([topic, q, right, ...wrong]) => {
      const o = [...shuffle([right, ...wrong]), NOT_SURE];
      return { subject, topic, q, o, a: o.indexOf(right), chosen: null };
    });
  });
}
