/* Circuit board repair course: six subjects, one lesson of each in every block, every weekday. */
import basics from './basics.js';
import testing from './testing.js';
import faults from './faults.js';
import rework from './rework.js';
import devices from './devices.js';
import { placement } from './assessment.js';

/* Each lesson keeps the key it was written with (rb-b1, rf-f3, …), so old attempts still match.
   `PREFIX` is only used for new lessons added from the database (e.g. rph-d4). */
const pool = { rb: basics, rt: testing, rf: faults, rr: rework, rd: devices };
const pick = (prefix, ids) => ids.map(id => ({ prefix, s: pool[prefix].find(x => x.id === id) }));
const def = (id, name, lessons, extra = {}) =>
  [id, { name, ...extra, sessions: lessons.map(({ prefix, s }) => ({ ...s, key: prefix + '-' + s.id, subject: id })) }];

export const PREFIX = { components: 'rb', testing: 'rt', pcbs: 'rp', phones: 'rph', motherboards: 'rm', consoles: 'rc' };

export const SUBJECTS = Object.fromEntries([
  def('components', 'Components', pick('rb', ['b1', 'b2', 'b3', 'b4', 'b5', 'b6']), { icon: 'Ω', qual: 'What parts do and how they fail' }),
  def('testing', 'Testing & measuring', pick('rt', ['t1', 't2', 't3', 't4', 't5', 't6']), { icon: 'mA', qual: 'Meters, supplies, scopes' }),
  def('pcbs', 'PCBs', [...pick('rr', ['r1', 'r2']), ...pick('rf', ['f1', 'f2', 'f3', 'f4']), ...pick('rr', ['r3', 'r4', 'r5', 'r6']), ...pick('rd', ['v5', 'v6'])], { icon: '▦', qual: 'Boards, soldering and rework' }),
  def('phones', 'Phones', pick('rd', ['v1', 'v2']), { icon: '▯', qual: 'Phones and tablets' }),
  def('motherboards', 'PC motherboards', [...pick('rd', ['v3']), ...pick('rf', ['f5', 'f6'])], { icon: '▣', qual: 'Desktops and laptops' }),
  def('consoles', 'Games consoles', pick('rd', ['v4']), { icon: '◎', qual: 'PlayStation, Xbox, Switch' }),
]);

/** Every weekday, every subject: one lesson of each in every block. */
const ALL_DAYS = Object.keys(SUBJECTS);
export const SCHEDULE = { 1: ALL_DAYS, 2: ALL_DAYS, 3: ALL_DAYS, 4: ALL_DAYS, 5: ALL_DAYS, 6: [], 0: [] };

/** The placement check still has five sections; this says which section sets each subject's start level. */
const PLACE_FROM = { components: ['basics'], testing: ['testing'], pcbs: ['faults', 'rework'], phones: ['devices'], motherboards: ['devices'], consoles: ['devices'] };

export const ALL = Object.values(SUBJECTS).flatMap(s => s.sessions);

export const LEVELS = { 1: 'Core', 2: 'Bench', 3: 'Advanced' };

/** The plan only uses lessons at or above each track's starting level (from the placement check).
    Skipped lessons stay available as extra practice. */
const cache = new WeakMap();
export function planSubjects(attempts) {
  if (cache.has(attempts)) return cache.get(attempts);
  const place = placement(attempts);
  const out = {};
  for (const [id, subj] of Object.entries(SUBJECTS)) {
    const levels = PLACE_FROM[id].map(t => place[t]?.level).filter(Boolean);
    const start = levels.length ? Math.min(...levels) : 1;
    const lv = s => s.level ?? 2;
    const sorted = [...subj.sessions].sort((a, b) => lv(a) - lv(b)); // stable: keeps order within a level
    const kept = sorted.filter(s => lv(s) >= start);
    out[id] = { ...subj, sessions: kept.length ? kept : sorted };
  }
  cache.set(attempts, out);
  return out;
}
