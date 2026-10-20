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

test('repair plan: all six subjects every weekday, three of each a day, starting at placement level', () => {
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
  assert.equal(acc.ok, true); // all of the day's lessons are open at once
  assert.equal(acc.planned, true);
});

test('database lessons go to the right course with their level', () => {
  const mc = i => ({ type: 'mc', q: `Q${i}?`, options: ['right', 'w1', 'w2', 'w3'], answer: 0, why: 'Because.' });
  const before = repair.all.length;
  assert.equal(addLessons([{ subject: 'consoles', position: 1, level: 3, title: 'Extra', sub: '', lesson_html: '<p>x</p>', questions: [...Array(12)].map((_, i) => mc(i)) }]), 1);
  const s = findSession(repair, 'rc-d1');
  assert.equal(s.level, 3); assert.equal(repair.all.length, before + 1);
  assert.equal(findSession(gcse, 'rc-d1'), undefined);
});

test('adaptive: struggling in a subject brings easier lessons back into the plan', () => {
  const a = [ax('testing', 3)]; // level 2
  assert.ok(repair.planSubjects(a).testing.sessions.every(s => s.level >= 2));
  const low = (k, score, h) => ({ session_key: k, subject: 'testing', score, total: 8, created_at: at(13, h) });
  const hard = [...a, low('rt-t3', 2, 12), low('rt-t4', 3, 13)];
  const plan = repair.planSubjects(hard);
  assert.ok(plan.testing.sessions.some(s => s.level === 1));
  const next = dayPlan(plan, repair.schedule, hard, [], new Date('2026-10-13T16:05:00Z')).items.find(i => i.subject === 'testing').next;
  assert.equal(next.key, 'rt-t1');
  const better = [...hard, low('rt-t1', 8, 14), low('rt-t2', 7, 15)];
  assert.ok(repair.planSubjects(better).testing.sessions.every(s => s.level >= 2));
  assert.ok(repair.planSubjects(a).phones.sessions.length > 0); // other subjects unaffected
});

test('adaptive: wrong calculations alone do not drop the level; wrong understanding does', () => {
  const a = [ax('testing', 3)];
  const mc = ok => ({ q: 'mc', kind: 'mc', ok, given: 'x', answer: ok ? 'x' : 'y' });
  const num = ok => ({ q: 'n', kind: 'number', ok, given: '1', answer: ok ? '1' : '2' });
  const att = (k, d, h) => ({ session_key: k, subject: 'testing', score: d.filter(x => x.ok).length, total: 8, details: d, created_at: at(13, h) });
  const mathsOnly = [...a, att('rt-t3', [mc(1), mc(1), mc(1), mc(1), num(0), num(0), num(0), num(0)].map(x => x), 12),
    att('rt-t4', [mc(1), mc(1), mc(1), mc(0), num(0), num(0), num(0), num(0)], 13)];
  mathsOnly[1].score = 3; mathsOnly[2].score = 3; // under half overall
  assert.equal(repair.planSubjects(mathsOnly).testing.sessions.some(s => s.level === 1), false);
  const concept = [...a, att('rt-t3', [mc(0), mc(0), mc(0), mc(1), num(1), num(1), num(0), num(0)], 12),
    att('rt-t4', [mc(0), mc(0), mc(1), mc(0), num(1), num(0), num(0), num(0)], 13)];
  assert.equal(repair.planSubjects(concept).testing.sessions.some(s => s.level === 1), true);
});

test('repair lessons are all open from the start of a weekday; GCSE keeps its blocks', async () => {
  const { COURSES } = await import('../src/content/courses.js');
  const { lessonAccess, dayPlan } = await import('../src/lib/plan.js');
  const r = COURSES.repair, g = COURSES.gcse;
  const early = new Date('2026-10-20T06:30:00Z'); // Tue 7:30am UK
  const plan = dayPlan(r.planSubjects([]), r.schedule, [], [], early);
  assert.ok(plan.items.length > 0 && plan.items.every(i => i.canStart && i.open === 3));
  const key = plan.items[0].next.key;
  const done = [{ session_key: key, subject: plan.items[0].subject, score: 8, total: 8, created_at: '2026-10-20T06:40:00Z' }];
  const next = dayPlan(r.planSubjects(done), r.schedule, done, [], new Date('2026-10-20T06:50:00Z')).items[0];
  assert.equal(next.done, 1); assert.equal(next.canStart, true);
  assert.equal(lessonAccess(r.planSubjects(done), r.schedule, done, [], next.next.key, new Date('2026-10-20T06:50:00Z')).ok, true);
  assert.equal(dayPlan(g.planSubjects([]), g.schedule, [], [], early).items.every(i => !i.canStart), true);
  assert.equal(dayPlan(r.planSubjects([]), r.schedule, [], [], new Date('2026-10-24T10:00:00Z')).items.length, 0); // Saturday
});
