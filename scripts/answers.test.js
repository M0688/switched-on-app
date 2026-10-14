import test from 'node:test';
import assert from 'node:assert/strict';
import { COURSES } from '../src/content/courses.js';

// Guard against "the longest answer is usually right". For each subject, sample every built-in
// multiple-choice question and check how often the right answer is clearly (30%+) longer than
// every wrong one. Short fixed terms (units, single words) make a little of this unavoidable.
test('right answers are not given away by being the longest option', () => {
  for (const course of Object.values(COURSES)) {
    const by = {};
    for (const s of course.all) {
      if (!s.make || /-d\d+$/.test(s.key)) continue;
      const seen = new Map();
      for (let i = 0; i < 60; i++) for (const q of s.make()) if (q.o && q.o.length > 2) seen.set(q.q + [...q.o].sort().join('|'), q);
      for (const q of seen.values()) {
        const len = q.o.map(x => String(x).length), right = len[q.a], wrong = Math.max(...len.filter((_, j) => j !== q.a));
        const b = (by[s.subject] ||= { n: 0, longest: 0, clear: 0 });
        b.n++; if (right > wrong) b.longest++; if (right >= 1.3 * wrong && right - wrong > 4) b.clear++;
      }
    }
    for (const [subject, b] of Object.entries(by)) {
      assert.ok(b.clear / b.n <= 0.12, `${course.id}/${subject}: right answer clearly longest in ${b.clear}/${b.n}`);
      assert.ok(b.longest / b.n <= 0.6, `${course.id}/${subject}: right answer longest in ${b.longest}/${b.n}`);
    }
  }
});
