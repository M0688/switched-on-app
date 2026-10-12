import test from 'node:test';
import assert from 'node:assert/strict';
import { SUBJECTS, ALL, makeSet, SCHEDULE } from '../src/content/index.js';
import { todayPlan, streak, activity, sessionStats, reviewPick, dayKey } from '../src/lib/stats.js';

const now = new Date('2026-10-14T10:00:00Z');
const at = (d, h = 10) => `2026-10-${String(d).padStart(2, '0')}T${String(h).padStart(2, '0')}:00:00Z`;
const att = (key, score, d, h) => ({ session_key: key, subject: key[0] === 'm' ? 'maths' : 'english', score, total: 8, created_at: at(d, h) });

test('fresh student starts at session 1 of each subject', () => {
  const p = todayPlan(SUBJECTS, [], [], now);
  assert.equal(p[0].next.key, 'm-s1'); assert.equal(p[1].next.key, 'e-s1');
  assert.equal(p[0].doneToday, false);
});

test('pass at 7 moves on; fail repeats; done-today flagged', () => {
  const a = [att('m-s1', 7, 13), att('m-s2', 5, 14), att('e-s1', 6, 12)];
  const p = todayPlan(SUBJECTS, a, [], now);
  assert.equal(p[0].next.key, 'm-s2'); assert.equal(p[0].doneToday, true); assert.equal(p[0].todayBest, 5);
  assert.equal(p[1].next.key, 'e-s1'); assert.equal(p[1].doneToday, false);
});

test('English writing session passes once marked', () => {
  const a = ['e-s1', 'e-s2', 'e-s3', 'e-s4', 'e-s5'].map(k => att(k, 8, 10));
  let p = todayPlan(SUBJECTS, a, [{ status: 'pending', created_at: at(14) }], now);
  assert.equal(p[1].next.key, 'e-s6'); assert.equal(p[1].doneToday, true);
  p = todayPlan(SUBJECTS, a, [{ status: 'marked', created_at: at(14) }], now);
  assert.equal(p[1].next.key, 'e-s7');
});

test('streak counts back from yesterday if today not done, and uses London days', () => {
  assert.equal(streak([att('m-s1', 3, 12), att('m-s1', 3, 13)], [], now), 2);
  assert.equal(streak([att('m-s1', 3, 11)], [], now), 0);
  // 23:30 UTC on 13 Oct is 00:30 on 14 Oct in London (BST)
  assert.equal(dayKey('2026-10-13T23:30:00Z'), '2026-10-14');
});

test('activity, session stats and review pick', () => {
  const a = [att('m-s1', 7, 13), att('m-s1', 8, 14), att('m-s2', 8, 14)];
  assert.equal(activity(a, [], 14, now).length, 14);
  assert.equal(activity(a, [], 14, now).at(-1).count, 2);
  const st = sessionStats(SUBJECTS.maths.sessions, a, []);
  assert.equal(st[0].best, 8); assert.equal(st[0].tries, 2); assert.equal(st[0].passed, true);
  assert.equal(reviewPick(st).key, 'm-s1');
});

test('every question set is valid', () => {
  for (const s of ALL) if (!s.writing) for (let i = 0; i < 200; i++) {
    const set = makeSet(s); assert.equal(set.length, 8);
    for (const q of set) q.o ? assert.ok(q.a >= 0 && q.a < q.o.length) : assert.ok(Number.isFinite(q.a));
  }
});

test('weekday schedule: core every day, extras by weekday', () => {
  const mon = todayPlan(SUBJECTS, [], [], new Date('2026-10-12T09:00:00Z'), SCHEDULE).map(p => p.subject);
  assert.deepEqual(mon, ['maths', 'english', 'science', 'electrical']);
  const tue = todayPlan(SUBJECTS, [], [], new Date('2026-10-13T09:00:00Z'), SCHEDULE).map(p => p.subject);
  assert.deepEqual(tue, ['maths', 'english', 'statistics', 'business']);
  assert.deepEqual(todayPlan(SUBJECTS, [], [], new Date('2026-10-17T09:00:00Z'), SCHEDULE), []);
  assert.deepEqual(todayPlan(SUBJECTS, [], [], new Date('2026-10-18T09:00:00Z'), SCHEDULE), []);
});

test('session keys are unique and every numeric answer is a clean number', () => {
  assert.equal(new Set(ALL.map(s => s.key)).size, ALL.length);
  for (const s of ALL) if (!s.writing) for (let i = 0; i < 300; i++) for (const q of makeSet(s)) {
    if (q.o) { assert.equal(new Set(q.o).size, q.o.length, s.key + ' duplicate options: ' + q.q); assert.ok(q.s, s.key + ' missing explanation'); }
    else assert.ok(Number.isFinite(q.a) && Math.abs(q.a * 1e5 - Math.round(q.a * 1e5)) < 1e-6, s.key + ' bad answer ' + q.a + ' for ' + q.q);
  }
});

test('weekends never break the streak', () => {
  // Thu 15, Fri 16, (weekend), Mon 19 Oct 2026
  const a = [att('m-s1', 3, 15), att('m-s1', 3, 16), att('m-s1', 3, 19)];
  assert.equal(streak(a, [], new Date('2026-10-19T15:00:00Z')), 3);
  assert.equal(streak(a.slice(0, 2), [], new Date('2026-10-18T15:00:00Z')), 2); // Sunday
  assert.equal(streak(a.slice(0, 2), [], new Date('2026-10-19T08:00:00Z')), 2); // Monday morning, not done yet
});
