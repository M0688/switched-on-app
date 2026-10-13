import maths from './maths.js';
import english, { PROMPTS, CHECKS } from './english.js';
import science from './science.js';
import statistics from './statistics.js';
import business from './business.js';
import electrical from './electrical.js';
import maths2 from './maths2.js';
import english2 from './english2.js';
import science2 from './science2.js';
import electrical2 from './electrical2.js';
import electrical0 from './electrical0.js';

const def = (id, prefix, name, sessions, extra = {}) =>
  [id, { name, ...extra, sessions: sessions.map(s => ({ ...s, key: prefix + '-' + s.id, subject: id })) }];

/** Subjects in display order. `core` subjects are every day; the rest follow SCHEDULE. */
export const SUBJECTS = Object.fromEntries([
  def('maths', 'm', 'Maths', [...maths, ...maths2], { core: true, icon: '×', qual: 'GCSE' }),
  def('english', 'e', 'English', [...english, ...english2], { core: true, icon: 'Aa', qual: 'GCSE' }),
  def('science', 'sc', 'Science', [...science.filter(s => s.id !== 's2'), ...science2, ...science.filter(s => s.id === 's2')], { icon: '⚗', qual: 'IGCSE Double Award' }),
  def('statistics', 'st', 'Statistics', statistics, { icon: '%', qual: 'GCSE' }),
  def('business', 'b', 'Business', business, { icon: '£', qual: 'GCSE' }),
  def('electrical', 'el', 'Electrical', [...electrical0, ...electrical, ...electrical2], { icon: '⚡', qual: 'Getting ready for college' }),
]);

/** Extra lessons by weekday (0 = Sunday). Maths and English every weekday. No lessons at weekends. */
export const SCHEDULE = {
  1: ['science', 'electrical'],
  2: ['statistics', 'business'],
  3: ['science', 'electrical'],
  4: ['statistics', 'business'],
  5: ['science', 'electrical'],
  6: [], 0: [],
};

export const ALL = Object.values(SUBJECTS).flatMap(s => s.sessions);
export const byKey = k => ALL.find(s => s.key === k);
export { PROMPTS, CHECKS };

/** Build a fresh set of 8 questions for a session. */
export function makeSet(session) {
  if (session.make) return session.make();
  const seen = new Set(), out = [];
  let guard = 0;
  while (out.length < 8 && guard++ < 200) {
    const g = session.gen();
    if (seen.has(g.q)) continue;
    seen.add(g.q); out.push(g);
  }
  return out;
}
