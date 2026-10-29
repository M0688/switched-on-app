import React, { useState } from 'react';
import { SUBJECTS, SCHEDULE } from '../content/index.js';
import { computeRewards, hours } from '../lib/rewards.js';
import { blockLabel } from '../lib/plan.js';
import { logFishing, undoFishing } from '../lib/api.js';
import { when } from './ui.jsx';

export const rewardsFor = data => computeRewards({ subjects: SUBJECTS, schedule: SCHEDULE, attempts: data.attempts, writings: data.writings, log: data.fishing ?? [] });


export function Float() {
  return (
    <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true" style={{ flex: 'none' }}>
      <path d="M20 3v8" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="20" cy="20" r="9" fill="var(--bad)" />
      <path d="M11 20a9 9 0 0 0 18 0z" fill="var(--surface)" stroke="var(--line)" />
      <path d="M4 33c4-3 8 3 12 0s8 3 12 0 8 3 8 0" stroke="var(--accent)" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** The fishing bank summary. `parent` shows sign-off details. */
export function FishingCard({ data, link }) {
  const r = rewardsFor(data);
  const wk = r.thisWeek;
  const body = (
    <>
      <div className="row" style={{ alignItems: 'center', flexWrap: 'nowrap' }}>
        <Float />
        <div className="stack" style={{ gap: 0, flex: 1, minWidth: 0 }}>
          <span className="eyebrow">Fishing bank</span>
          <b style={{ fontFamily: 'var(--display)', fontSize: '1.6rem', lineHeight: 1.1 }}>{hours(r.availableMin)}</b>
        </div>
        {wk.bonus && <span className="pill good">24h trip earned</span>}
      </div>
      <div className="stack" style={{ gap: 4 }}>
        <div className="row small"><span>This week: <b>{hours(wk.baseMin)}</b> of {hours(r.weekMax)}</span><span className="spacer" />{wk.bonusMin > 0 && <b>+{hours(wk.bonusMin)} bonus</b>}</div>
        <div className="bar"><i style={{ width: Math.min(100, wk.baseMin / (r.weekMax || 1) * 100) + '%', background: 'var(--amber)' }} /></div>
      </div>
      <p className="muted small">{wk.bonus ? `Bonus: ${wk.bonus.label}.` : `Finish all ${wk.progress.planned} of this week’s lessons and keep your average at 85% or more for a 24-hour session. So far: ${wk.progress.done} done${wk.progress.avg != null ? `, average ${Math.round(wk.progress.avg * 100)}%` : ''}.`}</p>
    </>
  );
  return link ? <a href={link} className="card" style={{ textDecoration: 'none', color: 'inherit' }}>{body}</a> : <div className="card">{body}</div>;
}

function WeekList({ week, parent }) {
  const days = Object.entries(week.days).sort();
  if (!days.length) return <p className="muted">No lessons yet this week.</p>;
  return (
    <div className="list">
      {days.map(([d, rows]) => (
        <div key={d} className="li" style={{ display: 'block' }}>
          <b>{new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short', timeZone: 'UTC' })}</b>
          {rows.map(l => (
            <div key={l.at} className="row small" style={{ marginTop: 4, flexWrap: 'nowrap' }}>
              <span style={{ flex: 1, minWidth: 0 }}><span className="muted">#{l.slot}</span> {SUBJECTS[l.subject].name}: {l.title}
                {l.done && !l.writing && <span className="muted num"> · {l.score}/{l.total}</span>}
                {parent && l.reason && <span className="err"> · {l.reason}</span>}</span>
              {l.counted ? <span className="pill good">+10m</span> : <span className="pill quiet">No time</span>}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function FishingPage({ data }) {
  const r = rewardsFor(data);
  return (
    <main className="page">
      <a href="#/today" className="btn link" style={{ alignSelf: 'flex-start' }}>← Today</a>
      <h1>Fishing time</h1>
      <FishingCard data={data} />
      <div className="note small">
        <b>How to earn it</b>
        <ul style={{ margin: '6px 0 0', paddingLeft: '1.2em' }}>
          <li>10 minutes for each of the day's lessons you complete properly: up to 2 hours a day.</li>
          <li>Only the lessons on your Today screen count, so take your time with each one.</li>
          <li>Finish every lesson in the week (all subjects, all 3 blocks, Monday to Friday) while keeping your overall average score at 85% or more to earn a 24-hour fishing session. Your average counts every lesson you’ve done, so every score matters.</li>
          <li>Your time never runs out and is never taken away.</li>
        </ul>
      </div>
      <section className="card"><h2>This week</h2><WeekList week={r.thisWeek} /></section>
      {data.fishing?.length > 0 && (
        <section className="card"><h2>Trips taken</h2>
          <div className="list">{data.fishing.map(f => (
            <div key={f.id} className="li"><span className="grow">{f.note || 'Fishing'}<br /><span className="muted small">{when(f.created_at)}</span></span><b className="num">{hours(f.minutes)}</b></div>
          ))}</div>
        </section>
      )}
    </main>
  );
}

export function ParentFishing({ kid, data, onChange }) {
  const r = rewardsFor(data);
  const [h, setH] = useState(1);
  const [m, setM] = useState(0);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');
  const mins = h * 60 + m;

  async function save(e) {
    e.preventDefault(); setErr(''); setMsg('');
    if (mins <= 0) { setErr('Enter some time first.'); return; }
    if (mins > r.availableMin) { setErr(`${kid.display_name} only has ${hours(r.availableMin)} in the bank.`); return; }
    setBusy(true);
    try { await logFishing(kid, mins, note.trim()); setNote(''); setMsg(`Signed off ${hours(mins)}.`); await onChange(); }
    catch (e2) { setErr(e2.message); }
    setBusy(false);
  }
  async function undo(id) { try { await undoFishing(id); await onChange(); } catch (e) { setErr(e.message); } }

  return (
    <main className="page">
      <h1>Fishing</h1>
      <FishingCard data={data} />
      <form className="card" onSubmit={save} style={{ gap: 12 }}>
        <h2>Sign off a trip</h2>
        <div className="row">
          <label className="field" style={{ width: 110 }}>Hours<input id="fh" type="number" min="0" max="168" inputMode="numeric" value={h} onChange={e => setH(Math.max(0, parseInt(e.target.value || '0', 10)))} /></label>
          <label className="field" style={{ width: 110 }}>Minutes
            <select id="fm" value={m} onChange={e => setM(Number(e.target.value))} style={{ font: 'inherit', padding: '11px 10px', borderRadius: 10, border: '2px solid var(--line)', background: 'var(--surface)', color: 'var(--ink)' }}>
              <option value={0}>0</option><option value={30}>30</option></select></label>
        </div>
        <label className="field">Note (optional)<input id="fn" maxLength={200} placeholder="e.g. Saturday at the lake" value={note} onChange={e => setNote(e.target.value)} /></label>
        {err && <p className="err" role="alert">{err}</p>}
        {msg && <p role="status" className="small" style={{ color: 'var(--good)', fontWeight: 700 }}>{msg}</p>}
        <button className="btn" disabled={busy || r.availableMin <= 0}>{r.availableMin <= 0 ? 'Nothing in the bank yet' : `Sign off ${hours(mins || 0)}`}</button>
      </form>
      <section className="card">
        <h2>This week's lessons</h2>
        <p className="muted small">Lessons earn time with 6/8 or better, or with 4/8 or 5/8 if he spent at least 3 minutes. {kid.display_name} doesn't see the reason; you do.</p>
        <WeekList week={r.thisWeek} parent />
      </section>
      {r.weeks.length > 1 && (
        <section className="card"><h2>Earlier weeks</h2>
          <div className="list">{r.weeks.slice(1).map(w => (
            <div key={w.weekStart} className="li"><span className="grow">Week of {new Date(w.weekStart + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })}
              {w.bonus && <><br /><span className="muted small">Bonus: {w.bonus.label}</span></>}</span><b className="num">{hours(w.totalMin)}</b></div>
          ))}</div>
        </section>
      )}
      <section className="card"><h2>Signed off</h2>
        {!data.fishing?.length && <p className="muted">No trips signed off yet.</p>}
        <div className="list">{(data.fishing ?? []).map(f => (
          <div key={f.id} className="li"><span className="grow">{f.note || 'Fishing'}<br /><span className="muted small">{when(f.created_at)}</span></span>
            <b className="num">{hours(f.minutes)}</b><button className="btn link small" onClick={() => undo(f.id)}>Undo</button></div>
        ))}</div>
      </section>
    </main>
  );
}
