import test from 'node:test';
import assert from 'node:assert/strict';
import { SUBJECTS, byKey, makeSet } from '../src/content/index.js';
import { addLessons } from '../src/content/dynamic.js';

const mc = i => ({ type: 'mc', q: `Q${i}?`, options: ['right', 'w1', 'w2', 'w3'], answer: 0, why: 'Because.' });
test('database lessons are appended, validated and playable', () => {
  const before = SUBJECTS.business.sessions.length;
  const n = addLessons([
    { subject: 'business', position: 2, title: 'Second', sub: '', lesson_html: '<p onclick="x()">Hi<script>bad()</script></p>', questions: [...Array(10)].map((_, i) => mc(i)) },
    { subject: 'business', position: 1, title: 'First', sub: '', lesson_html: '<p>Hi</p>', questions: [...Array(9)].map((_, i) => mc(i)).concat([{ type: 'number', q: 'Sum?', answer: 4, unit: '£', unit_before: true, why: '2+2' }]) },
    { subject: 'business', position: 3, title: 'Too few', sub: '', lesson_html: '<p>x</p>', questions: [mc(1), { type: 'mc', q: 'bad', options: ['a', 'a'], answer: 0, why: 'x' }] },
  ]);
  assert.equal(n, 2);
  assert.equal(SUBJECTS.business.sessions.length, before + 2);
  assert.equal(SUBJECTS.business.sessions.at(-2).key, 'b-d1');
  const set = makeSet(byKey('b-d2'));
  assert.equal(set.length, 8);
  for (const q of set) assert.equal(q.o[q.a], 'right');
  assert.equal(addLessons([{ subject: 'business', position: 1, title: 'Dup', lesson_html: '', questions: [...Array(9)].map((_, i) => mc(i)) }]), 0);
});
