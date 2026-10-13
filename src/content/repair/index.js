/* Circuit board repair course: five tracks, one a day, three lessons a day. */
import basics from './basics.js';
import testing from './testing.js';
import faults from './faults.js';
import rework from './rework.js';
import devices from './devices.js';
import { placement } from './assessment.js';

const def = (id, prefix, name, sessions, extra = {}) =>
  [id, { name, ...extra, sessions: sessions.map(s => ({ ...s, key: prefix + '-' + s.id, subject: id })) }];

export const PREFIX = { basics: 'rb', testing: 'rt', faults: 'rf', rework: 'rr', devices: 'rd' };

export const SUBJECTS = Object.fromEntries([
  def('basics', PREFIX.basics, 'Fundamentals', basics, { icon: 'Ω', qual: 'Components and theory' }),
  def('testing', PREFIX.testing, 'Test & measurement', testing, { icon: 'mA', qual: 'Meters, supplies, scopes' }),
  def('faults', PREFIX.faults, 'Fault-finding', faults, { icon: '?!', qual: 'Schematics and diagnosis' }),
  def('rework', PREFIX.rework, 'Soldering & rework', rework, { icon: 'Sn', qual: 'Iron, hot air, BGA' }),
  def('devices', PREFIX.devices, 'Devices', devices, { icon: '▣', qual: 'Phones to industrial' }),
]);

/** One track per weekday. */
export const SCHEDULE = { 1: ['basics'], 2: ['testing'], 3: ['faults'], 4: ['rework'], 5: ['devices'], 6: [], 0: [] };

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
    const start = place[id]?.level ?? 1;
    const lv = s => s.level ?? 2;
    const sorted = [...subj.sessions].sort((a, b) => lv(a) - lv(b)); // stable: keeps order within a level
    const kept = sorted.filter(s => lv(s) >= start);
    out[id] = { ...subj, sessions: kept.length ? kept : sorted };
  }
  cache.set(attempts, out);
  return out;
}
