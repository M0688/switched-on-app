/* Fishing rewards. Pure functions: earned time is always worked out from his saved lessons,
   so it can never go down, and the parent's sign-offs are subtracted to give the bank.

   Rules (agreed with Mitchell, 12 Oct 2026):
   - 10 min for each PLANNED lesson he completes: 3 blocks a day x the day's subjects (Mon-Fri).
     Extra practice doesn't count. At most 10 hours a week.
   - Hidden minimum (he isn't told): 6/8 or better always counts; 4/8 or 5/8 counts only with 3+ minutes spent;
     under 4/8 never counts. Random clicking scores about 2/8, so this catches it without punishing a quick 8/8.
   - The writing task counts as completed when he submits it (it has no score).
   - Bonus (agreed 29 Oct 2026): +24 hours, once per week, for completing every planned lesson that week
     (Mon-Fri, all 3 blocks, every subject) while his running average is 85% or more (raised from 75% on 29 Oct 2026). The running average
     is worked out across every planned lesson he has ever done, up to the end of that week, all subjects.
     The writing task counts as completed but is left out of the average.
   - Until then the bonus was 8/8 on every lesson in a day, or on one subject all week. Weeks up to and
     including 26 Oct 2026 can still earn it that way, so nothing already earned is taken away.
   - Hours never expire and are never taken away. */
import { dayKey, addDays } from './stats.js';
import { replay, scheduledOn, PER_DAY } from './plan.js';

export const LESSON_MIN = 10;
export const BONUS_MIN = 24 * 60;
export const MIN_SCORE_RATIO = 0.5;
export const MIN_SECONDS = 180;
export const NO_TIME_CHECK_RATIO = 0.75; // 6/8 and above
export const WEEK_AVG = 0.85;
const NEW_RULE_FROM = '2026-10-26'; // weeks from this Monday: the full-week bonus
const OLD_RULE_UNTIL = '2026-10-26'; // weeks up to this Monday: the old perfect-score bonus as well

const weekdayOfKey = k => new Date(k + 'T12:00:00Z').getUTCDay();
export const weekStart = k => addDays(k, -((weekdayOfKey(k) + 6) % 7)); // Monday
const noon = k => new Date(k + 'T12:00:00Z');

function judge(ev, sessions) {
  const s = sessions.find(x => x.key === ev.session_key);
  const base = { day: dayKey(ev.created_at), subject: ev.subject, key: ev.session_key, title: s?.title ?? ev.session_key, slot: ev.slot, review: ev.review, at: ev.created_at, done: true };
  if (ev.kind === 'writing') return { ...base, writing: true, counted: true, perfect: null, minutes: LESSON_MIN };
  const lowScore = ev.score / ev.total < MIN_SCORE_RATIO;
  const tooFast = !lowScore && ev.score / ev.total < NO_TIME_CHECK_RATIO && (ev.duration_s ?? 0) < MIN_SECONDS;
  const counted = !lowScore && !tooFast;
  return {
    ...base, writing: false, attemptId: ev.id, score: ev.score, total: ev.total, seconds: ev.duration_s,
    counted, minutes: counted ? LESSON_MIN : 0, perfect: ev.score === ev.total,
    reason: lowScore ? 'Score under 4/8' : tooFast ? 'Scored 4 or 5 out of 8 in under 3 minutes' : null,
  };
}

export function computeRewards({ subjects, schedule, attempts, writings, log = [], now = new Date() }) {
  const today = dayKey(now);
  const { events } = replay(subjects, schedule, attempts, writings);
  const lessons = events.filter(e => e.planned).map(e => judge(e, subjects[e.subject].sessions));
  const byWeek = {};
  for (const l of lessons) {
    const w = (byWeek[weekStart(l.day)] ??= { weekStart: weekStart(l.day), days: {}, lessons: [] });
    (w.days[l.day] ??= []).push(l); w.lessons.push(l);
  }
  const thisWeekKey = weekStart(today);
  byWeek[thisWeekKey] ??= { weekStart: thisWeekKey, days: {}, lessons: [] };

  const subjectsOn = d => Object.keys(subjects).filter(id => scheduledOn(subjects, schedule, id, noon(d)));
  const fullAndPerfect = (rows) => rows.length >= PER_DAY && rows.filter(r => !r.writing).every(r => r.perfect);

  // The old bonus (weeks up to 26 Oct 2026): a perfect day, or a perfect subject week.
  function oldBonus(week) {
    // a) A perfect day: every subject's 3 lessons done, all 8/8.
    for (const d of Object.keys(week.days).sort()) {
      const subs = subjectsOn(d);
      const rows = week.days[d];
      const scored = rows.filter(r => !r.writing);
      if (subs.length && scored.length && subs.every(id => fullAndPerfect(rows.filter(r => r.subject === id)))) {
        return { reason: 'perfect-day', day: d, label: `100% on every lesson on ${noon(d).toLocaleDateString('en-GB', { weekday: 'long', timeZone: 'UTC' })}` };
      }
    }
    // b) A perfect subject week: every scheduled day that week, all 3 lessons done, all 8/8.
    {
      for (const id of Object.keys(subjects)) {
        const days = [0, 1, 2, 3, 4].map(i => addDays(week.weekStart, i)).filter(d => subjectsOn(d).includes(id));
        if (!days.length || days.some(d => d > today)) continue;
        const rows = days.map(d => (week.days[d] ?? []).filter(r => r.subject === id));
        if (rows.every(fullAndPerfect) && rows.flat().some(r => !r.writing)) {
          return { reason: 'perfect-subject', subject: id, label: `100% in ${subjects[id].name} all week` };
        }
      }
    }
    return null;
  }

  let runGot = 0, runOut = 0; // running average across all weeks so far
  for (const week of Object.values(byWeek).sort((a, b) => a.weekStart.localeCompare(b.weekStart))) {
    week.baseMin = week.lessons.reduce((t, l) => t + l.minutes, 0);
    week.bonus = null;
    // Weekly bonus: every planned lesson done (Mon-Fri), with a running average of 75% or more.
    const weekDays = [0, 1, 2, 3, 4].map(i => addDays(week.weekStart, i));
    const planned = weekDays.reduce((t, d) => t + subjectsOn(d).length * PER_DAY, 0);
    const scored = week.lessons.filter(l => !l.writing);
    const got = scored.reduce((t, l) => t + l.score, 0), out = scored.reduce((t, l) => t + l.total, 0);
    runGot += got; runOut += out;
    week.progress = { planned, done: week.lessons.length, weekAvg: out ? got / out : null, avg: runOut ? runGot / runOut : null };
    const allDone = planned > 0 && weekDays.every(d => subjectsOn(d).every(id => (week.days[d] ?? []).filter(r => r.subject === id).length >= PER_DAY));
    if (week.weekStart >= NEW_RULE_FROM && allDone && week.progress.avg >= WEEK_AVG)
      week.bonus = { reason: 'full-week', label: `every lesson done, with a ${Math.round(week.progress.avg * 100)}% running average` };
    if (!week.bonus && week.weekStart <= OLD_RULE_UNTIL) week.bonus = oldBonus(week);
    week.bonusMin = week.bonus ? BONUS_MIN : 0;
    week.totalMin = week.baseMin + week.bonusMin;
  }

  const earnedMin = Object.values(byWeek).reduce((t, w) => t + w.totalMin, 0);
  const usedMin = log.reduce((t, r) => t + r.minutes, 0);
  const thisWeek = byWeek[thisWeekKey];
  const todayRows = thisWeek.days[today] ?? [];
  const subsToday = subjectsOn(today);
  return {
    earnedMin, usedMin, availableMin: Math.max(0, earnedMin - usedMin),
    weeks: Object.values(byWeek).sort((a, b) => b.weekStart.localeCompare(a.weekStart)),
    thisWeek, lessons,
    perfectDayToday: subsToday.length > 0 && subsToday.every(id => fullAndPerfect(todayRows.filter(r => r.subject === id))),
    weekMax: (() => { let n = 0; for (let i = 0; i < 5; i++) n += subjectsOn(addDays(thisWeekKey, i)).length * PER_DAY; return n * LESSON_MIN; })(),
  };
}

export function hours(min) {
  const h = Math.floor(min / 60), m = min % 60;
  return h && m ? `${h}h ${m}m` : h ? `${h} hour${h === 1 ? '' : 's'}` : `${m} min`;
}
