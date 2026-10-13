import test from 'node:test';
import assert from 'node:assert/strict';
import { COURSES, findSession, isSkipped, lessonAttempts } from '../src/content/courses.js';
import { makeSet } from '../src/content/index.js';
import { QUESTIONS, NOT_SURE, levelFor, placement, assessKey } from '../src/content/repair/assessment.js';
import { dayPlan, lessonAccess } from '../src/lib/plan.js';
import { addLessons } from '../src/content/dynamic.js';

const repair = COURSES.repair, gcse = COURSES.gcse;
const at = (d, h) => `2026-10-${String(d).padStart(2, '0')}T${String(h).padStart(2, '0')}:05:00Z`;
const ax = (track, score, d = 12, h = 9) => ({ session_key: assessKey(track), subject: track, score, total: 6, created_at: at(d, h) });

test('every repair lesson builds valid 8-question sets', () => {
  assert.equal(Object.keys(repair.subjects).length, 6);
  for (const s of repair.all) {
    assert.ok([1, 2, 3].includes(s.level), s.key);
    assert.ok(s.lesson.length > 200 && s.title && s.sub, s.key);
    for (let i = 0; i < 200; i++) {
      const set = makeSet(s);
      assert.equal(set.length, 8, s.key);
      assert.equal(new Set(set.map(q => q.q)).size, 8, s.key + ' duplicate question');
      for (const q of set) {
        assert.ok(q.q && q.s, s.key);
        if (q.o) { assert.ok(q.a >= 0 && q.a < q.o.length, s.key); assert.equal(new Set(q.o).size, q.o.length, s.key + ': ' + q.q); }
        else assert.ok(Number.isFinite(q.a), s.key + ': ' + q.q);
      }
    }
  }
});

test('every built-in lesson is in exactly one subject, and keys never clash with GCSE', () => {
  assert.equal(repair.all.length, 30);
  for (const subj of Object.values(repair.subjects)) assert.ok(subj.sessions.length >= 1);
  const keys = [...repair.all, ...gcse.all].map(s => s.key);
  assert.equal(new Set(keys).size, keys.length);
  for (const s of repair.all) { assert.ok(s.key.length <= 20); assert.ok(!/-d\d+$/.test(s.key), 'built-in key looks like a database key: ' + s.key); }
});

test('banks have no duplicate questions or options', () => {
  // Bank rows aren't exposed directly; sample heavily and check each question's options stay consistent.
  for (const s of repair.all) {
    const seen = {};
    for (let i = 0; i < 300; i++) for (const q of makeSet(s)) if (q.o) {
      const k = [...q.o].sort().join('|');
      if (seen[q.q]) assert.equal(seen[q.q], k, s.key + ': ' + q.q); else seen[q.q] = k;
    }
  }
});

test('assessment: 6 questions per track, 2 per level, distinct options', () => {
  for (const [track, rows] of Object.entries(QUESTIONS)) {
    assert.equal(rows.length, 6);
    for (const lv of [1, 2, 3]) assert.equal(rows.filter(r => r[0] === lv).length, 2);
    for (const [, q, ...opts] of rows) { assert.equal(new Set(opts).size, 4, q); assert.ok(!opts.includes(NOT_SURE)); }
  }
  assert.deepEqual([0, 1, 2, 3, 4, 5, 6].map(levelFor), [1, 1, 1, 2, 2, 3, 3]);
});

test('placement uses the latest attempt per track and skips easier lessons', () => {
  const a = [ax('basics', 1, 12), ax('basics', 6, 13), ax('testing', 3)];
  const p = placement(a);
  assert.equal(p.basics.level, 3); assert.equal(p.testing.level, 2); assert.equal(p.faults, undefined);
  const plan = repair.planSubjects(a);
  assert.ok(plan.components.sessions.every(s => s.level === 3));
  assert.ok(plan.testing.sessions.every(s => s.level >= 2));
  assert.equal(plan.phones.sessions.length, repair.subjects.phones.sessions.length);
  assert.equal(isSkipped(repair, a, 'rb-b1'), true);
  assert.equal(isSkipped(repair, a, 'rb-b5'), false);
  assert.equal(isSkipped(gcse, a, 'm-s1'), false);
  assert.equal(lessonAttempts(a).length, 0);
});

test('repair plan: all six subjects every weekday, one of each per block, starting at placement level', () => {
  const a = [ax('basics', 6)];
  const six = ['components', 'testing', 'pcbs', 'phones', 'motherboards', 'consoles'];
  // Monday 12 Oct 2026, 14:05 BST: block 1 open
  const mon = dayPlan(repair.planSubjects(a), repair.schedule, a, [], new Date('2026-10-12T13:05:00Z'));
  assert.deepEqual(mon.items.map(i => i.subject), six);
  assert.equal(mon.items[0].next.key, 'rb-b5');
  assert.equal(mon.lessonsTotal, 18);
  const tue = dayPlan(repair.planSubjects(a), repair.schedule, a, [], new Date('2026-10-13T13:05:00Z'));
  assert.deepEqual(tue.items.map(i => i.subject), six);
  assert.equal(tue.items[1].next.key, 'rt-t1');
  assert.equal(tue.items[5].next.key, 'rd-v4');
  const done = [...a, { session_key: 'rb-b5', subject: 'components', score: 7, total: 8, created_at: '2026-10-12T12:10:00Z' }];
  const acc = lessonAccess(repair.planSubjects(done), repair.schedule, done, [], 'rb-b6', new Date('2026-10-12T12:20:00Z'));
  assert.equal(acc.ok, false); // block 2 opens at 5pm
  assert.equal(lessonAccess(repair.planSubjects(done), repair.schedule, done, [], 'rb-b6', new Date('2026-10-12T16:05:00Z')).planned, true);
});

test('database lessons go to the right course with their level', () => {
  const mc = i => ({ type: 'mc', q: `Q${i}?`, options: ['right', 'w1', 'w2', 'w3'], answer: 0, why: 'Because.' });
  const before = repair.all.length;
  assert.equal(addLessons([{ subject: 'consoles', position: 1, level: 3, title: 'Extra', sub: '', lesson_html: '<p>x</p>', questions: [...Array(12)].map((_, i) => mc(i)) }]), 1);
  const s = findSession(repair, 'rc-d1');
  assert.equal(s.level, 3); assert.equal(repair.all.length, before + 1);
  assert.equal(findSession(gcse, 'rc-d1'), undefined);
});
