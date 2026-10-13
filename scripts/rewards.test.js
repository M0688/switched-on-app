import test from 'node:test';
import assert from 'node:assert/strict';
import { SUBJECTS, SCHEDULE } from '../src/content/index.js';
import { computeRewards, BONUS_MIN } from '../src/lib/rewards.js';
import { dayPlan, lessonAccess, blocksOpen } from '../src/lib/plan.js';

// Week of Mon 12 Oct 2026 (BST, UTC+1). Blocks open 13:00, 17:00, 21:00 UK = 12:00, 16:00, 20:00 UTC.
const t = (day, h, m = 0) => `2026-10-${String(day).padStart(2, '0')}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00Z`;
let n = 0;
const SUBJ = { m: 'maths', e: 'english', sc: 'science', st: 'statistics', b: 'business', el: 'electrical' };
const A = (key, score, iso, secs = 600) => ({ id: 'a' + (++n), session_key: key, subject: SUBJ[key.split('-')[0]], score, total: 8, duration_s: secs, created_at: iso });
const run = (attempts, now, writings = [], log = []) => computeRewards({ subjects: SUBJECTS, schedule: SCHEDULE, attempts, writings, log, now: new Date(now) });
const plan = (attempts, now, writings = []) => dayPlan(SUBJECTS, SCHEDULE, attempts, writings, new Date(now));

// A whole Monday block: maths, english, science, electrical lessons s{k}
// The k-th lesson (1-based) of a subject, in course order
const K = (p, k) => SUBJECTS[SUBJ[p]].sessions[k - 1].key;
const block = (k, score, iso, secs) => ['m', 'e', 'sc', 'el'].map(p => A(K(p, k), score, iso, secs));

test('blocks open at 1pm, 5pm and 9pm UK time; none at weekends', () => {
  assert.equal(blocksOpen(new Date(t(12, 11, 59))), 0);
  assert.equal(blocksOpen(new Date(t(12, 12, 0))), 1);
  assert.equal(blocksOpen(new Date(t(12, 16, 30))), 2);
  assert.equal(blocksOpen(new Date(t(12, 20, 5))), 3);
  assert.equal(blocksOpen(new Date(t(17, 20, 5))), 0);
});

test('he moves on whatever he scores, and each block unlocks the next lesson', () => {
  const a = [A('m-s1', 2, t(12, 12, 10))];
  const p = plan(a, t(12, 12, 30));
  const maths = p.items.find(i => i.subject === 'maths');
  assert.equal(maths.done, 1); assert.equal(maths.next.key, 'm-s2'); assert.equal(maths.canStart, false);
  assert.equal(plan(a, t(12, 16, 1)).items.find(i => i.subject === 'maths').canStart, true);
  assert.deepEqual(p.items.map(i => i.subject), ['maths', 'english', 'science', 'electrical']);
});

test('lesson access: next lesson only when a block is open; earlier lessons always open for practice', () => {
  const a = [A('m-s1', 8, t(12, 12, 10))];
  assert.equal(lessonAccess(SUBJECTS, SCHEDULE, a, [], 'm-s2', new Date(t(12, 13))).ok, false);
  assert.equal(lessonAccess(SUBJECTS, SCHEDULE, a, [], 'm-s2', new Date(t(12, 16, 5))).planned, true);
  assert.deepEqual(lessonAccess(SUBJECTS, SCHEDULE, a, [], 'm-s1', new Date(t(12, 13))), { ok: true, planned: false });
  assert.equal(lessonAccess(SUBJECTS, SCHEDULE, a, [], 'm-s4', new Date(t(12, 16, 5))).ok, false);
});

test('missed blocks can be caught up later the same day', () => {
  const a = [A('m-s1', 6, t(12, 20, 10)), A('m-s2', 6, t(12, 20, 30)), A('m-s3', 6, t(12, 20, 50))];
  assert.equal(run(a, t(12, 22)).thisWeek.lessons.length, 3);
  assert.equal(plan(a, t(12, 22)).items.find(i => i.subject === 'maths').finished, true);
});

test('10 minutes per planned lesson; extra practice and a 4th lesson do not count', () => {
  const a = [A('m-s1', 6, t(12, 12, 10)), A('m-s1', 8, t(12, 12, 20)), A('st-s1', 8, t(12, 12, 30)),
    A('m-s2', 6, t(12, 16, 10)), A('m-s3', 6, t(12, 20, 10)), A('m-s4', 6, t(12, 20, 30))];
  assert.equal(run(a, t(12, 22)).thisWeek.baseMin, 30);
});

test('hidden minimum: under 4/8 never; 4-5/8 needs 3 minutes; 6/8+ always', () => {
  const r = run([A('m-s1', 3, t(12, 12, 1), 900), A('e-s1', 5, t(12, 12, 2), 120), A(K('sc', 1), 4, t(12, 12, 3), 180), A(K('el', 1), 8, t(12, 12, 4), 45)], t(12, 13));
  assert.equal(r.thisWeek.baseMin, 20);
  assert.deepEqual(r.lessons.filter(l => !l.counted).map(l => l.reason).sort(), ['Score under 4/8', 'Scored 4 or 5 out of 8 in under 3 minutes']);
});

test('perfect day needs all 12 lessons done at 8/8', () => {
  const day = [...block(1, 8, t(12, 12, 5)), ...block(2, 8, t(12, 16, 5)), ...block(3, 8, t(12, 20, 5))];
  assert.equal(run(day.slice(0, 8), t(12, 20, 1)).thisWeek.bonus, null);
  const r = run(day, t(12, 21));
  assert.equal(r.thisWeek.bonus.reason, 'perfect-day');
  assert.equal(r.earnedMin, 120 + BONUS_MIN);
  assert.ok(r.perfectDayToday);
  const flawed = day.map((x, i) => i === 11 ? { ...x, score: 7 } : x);
  assert.equal(run(flawed, t(12, 21)).thisWeek.bonus, null);
});

test('perfect subject week: science 8/8 in all 3 blocks on Mon, Wed and Fri', () => {
  let k = 0;
  const sci = d => [12, 16, 20].map(h => A(K('sc', ++k), 8, t(d, h, 5)));
  const a = [...sci(12), ...sci(14)];
  assert.equal(run(a, t(14, 21)).thisWeek.bonus, null); // Friday still to come
  const fri = sci(16);
  const r = run([...a, ...fri], t(16, 21));
  assert.equal(r.thisWeek.bonus?.reason, 'perfect-subject');
  assert.equal(r.thisWeek.bonus.subject, 'science');
});

test('bonus at most once a week; bank = earned minus signed off, never below zero', () => {
  const mon = [...block(1, 8, t(12, 12, 5)), ...block(2, 8, t(12, 16, 5)), ...block(3, 8, t(12, 20, 5))];
  const wed = [...block(4, 8, t(14, 12, 5)), ...block(5, 8, t(14, 16, 5)), ...block(6, 8, t(14, 20, 5))];
  assert.equal(run([...mon, ...wed], t(14, 21)).thisWeek.bonusMin, BONUS_MIN);
  assert.equal(run([A('m-s1', 6, t(12, 12, 5))], t(12, 13), [], [{ minutes: 4 }]).availableMin, 6);
  assert.equal(run([A('m-s1', 6, t(12, 12, 5))], t(12, 13), [], [{ minutes: 90 }]).availableMin, 0);
});

test('nothing counts at weekends', () => {
  assert.equal(run([A('m-s1', 8, t(17, 12, 5))], t(17, 13)).earnedMin, 0);
  assert.equal(plan([], t(17, 13)).items.length, 0);
});

test('when a subject runs out, the weakest lesson comes back as review', () => {
  const a = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((k, i) => A(K('sc', k), k === 4 ? 3 : 8, t([12, 14, 16][Math.floor(i / 3)], 12 + 4 * (i % 3), 5)));
  const p = plan(a, t(19, 12, 30));
  const sci = p.items.find(i => i.subject === 'science');
  assert.equal(sci.next.key, K('sc', 4)); assert.equal(sci.review, true); assert.equal(sci.canStart, true);
});

test('writing task fills an English slot when submitted', () => {
  const eng = [1, 2, 3, 4, 5].map((k, i) => A(`e-s${k}`, 8, t(9, 12 + 4 * (i % 3), i)));
  const w = [{ id: 'w1', status: 'pending', created_at: t(12, 12, 30) }];
  const r = run(eng, t(12, 13), w);
  const row = r.thisWeek.days['2026-10-12'].find(x => x.subject === 'english');
  assert.ok(row.writing && row.counted);
});
