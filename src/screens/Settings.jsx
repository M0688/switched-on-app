import React, { useEffect, useState } from 'react';
import { familyStudents, getReminderPrefs, saveReminderPrefs } from '../lib/api.js';
import { PushSetup } from './Alerts.jsx';

export const DEFAULT_TIMES = ['09:00'];
const MAX = 3;
// 6am to 10:45pm in 15-minute steps
const OPTIONS = Array.from({ length: (23 - 6) * 4 }, (_, i) => {
  const m = 6 * 60 + i * 15;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
});
const label = t => { const [h, m] = t.split(':').map(Number); return `${h % 12 || 12}:${String(m).padStart(2, '0')}${h < 12 ? 'am' : 'pm'}`; };

function ReminderEditor({ person, pref, title, onSaved }) {
  const [enabled, setEnabled] = useState(pref?.enabled ?? true);
  const [times, setTimes] = useState(pref?.times?.length ? pref.times : DEFAULT_TIMES);
  const [state, setState] = useState('');
  useEffect(() => { setEnabled(pref?.enabled ?? true); setTimes(pref?.times?.length ? pref.times : DEFAULT_TIMES); }, [pref]);

  const set = (i, v) => { setTimes(t => t.map((x, k) => k === i ? v : x)); setState('changed'); };
  // A new reminder starts 4 hours after the latest one (or the first free time if that's too late).
  const add = () => setTimes(t => {
    const used = new Set(t), last = [...t].sort().at(-1) ?? '09:00';
    const target = OPTIONS[Math.min(OPTIONS.indexOf(last) + 16, OPTIONS.length - 1)];
    setState('changed');
    return [...t, [target, ...OPTIONS].find(o => !used.has(o))];
  });
  const remove = i => { setTimes(t => t.filter((_, k) => k !== i)); setState('changed'); };

  async function save() {
    const clean = [...new Set(times)].sort();
    setState('saving');
    try { await saveReminderPrefs(person.id, enabled, clean); setTimes(clean); setState('saved'); onSaved?.(); }
    catch (e) { setState('Error: ' + e.message); }
  }

  return (
    <section className="card">
      <div className="row"><h2>{title}</h2><span className="spacer" />
        <label className="small" style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
          <input type="checkbox" checked={enabled} onChange={e => { setEnabled(e.target.checked); setState('changed'); }} /> On
        </label></div>
      <p className="muted small">Weekdays only. Up to {MAX} reminders a day.</p>
      {enabled && (
        <div className="stack" style={{ gap: 8 }}>
          {times.map((t, i) => (
            <div key={i} className="row">
              <span className="muted small" style={{ width: '5.5em' }}>Reminder {i + 1}</span>
              <select value={t} onChange={e => set(i, e.target.value)} aria-label={`Reminder ${i + 1} time`}
                style={{ flex: 1, padding: '9px 10px', borderRadius: 10, border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--ink)', font: 'inherit' }}>
                {OPTIONS.map(o => <option key={o} value={o}>{label(o)}</option>)}
              </select>
              {times.length > 1 && <button className="btn small ghost" onClick={() => remove(i)} aria-label={`Remove reminder ${i + 1}`}>Remove</button>}
            </div>
          ))}
          {times.length < MAX && <button className="btn small ghost" style={{ alignSelf: 'flex-start' }} onClick={add}>Add a reminder</button>}
        </div>
      )}
      <div className="row">
        <button className="btn" disabled={state === 'saving' || state === '' || state === 'saved'} onClick={save}>{state === 'saving' ? 'Saving…' : 'Save'}</button>
        {state === 'saved' && <span className="small" role="status">Saved.</span>}
        {state.startsWith('Error') && <span className="err small" role="alert">{state}</span>}
      </div>
    </section>
  );
}

export default function Settings({ profile }) {
  const [kids, setKids] = useState(profile.role === 'parent' ? null : []);
  const [prefs, setPrefs] = useState(null);
  const [err, setErr] = useState('');
  const load = async () => {
    try {
      const k = profile.role === 'parent' ? await familyStudents() : [];
      setKids(k);
      const rows = await getReminderPrefs([profile.id, ...k.map(x => x.id)]);
      setPrefs(Object.fromEntries(rows.map(r => [r.user_id, r])));
    } catch (e) { setErr(e.message); }
  };
  useEffect(() => { load(); }, [profile.id]);

  return (
    <main className="page">
      <div className="stack" style={{ gap: 4 }}><span className="eyebrow">Settings</span><h1>Reminders</h1>
        <p className="muted">Lessons are open all day on weekdays. Choose when your phone should remind you.</p></div>
      <PushSetup student />
      {err && <p className="err">{err}</p>}
      {!prefs ? !err && <p className="muted">Loading…</p> : <>
        <ReminderEditor person={profile} pref={prefs[profile.id]} title="Your reminders" onSaved={load} />
        {kids?.map(k => <ReminderEditor key={k.id} person={k} pref={prefs[k.id]} title={`${k.display_name}’s reminders`} onSaved={load} />)}
        {kids?.length > 0 && <p className="muted small">{kids.map(k => k.display_name).join(' and ')} also needs reminders turned on on {kids.length > 1 ? 'their' : 'his'} own phone.</p>}
      </>}
    </main>
  );
}
