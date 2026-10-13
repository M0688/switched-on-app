import React, { useState } from 'react';
import { useCourse } from '../lib/course.js';
import { QUESTIONS, NOT_SURE, assessKey, levelFor } from '../content/repair/assessment.js';
import { shuffle } from '../content/kit.js';
import { saveAttempts } from '../lib/api.js';

function build() {
  return Object.entries(QUESTIONS).flatMap(([track, rows]) => rows.map(([level, q, right, ...wrong]) => {
    const o = [...shuffle([right, ...wrong]), NOT_SURE];
    return { track, level, q, o, a: o.indexOf(right), chosen: null };
  }));
}

/** Placement check: one question at a time, no marking until the end. */
export default function Assessment({ onSaved }) {
  const course = useCourse();
  const [qs, setQs] = useState(build);
  const [i, setI] = useState(0);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const q = qs[i];

  function choose(j) {
    setQs(list => list.map((x, k) => k === i ? { ...x, chosen: j } : x));
    if (i < qs.length - 1) setTimeout(() => { setI(i + 1); window.scrollTo({ top: 0 }); }, 180);
  }

  async function finish() {
    setBusy(true); setErr('');
    const rows = Object.keys(QUESTIONS).map(track => {
      const mine = qs.filter(x => x.track === track);
      return {
        session_key: assessKey(track), subject: track, total: mine.length,
        score: mine.filter(x => x.chosen === x.a).length,
        details: mine.map(x => ({ q: x.q, ok: x.chosen === x.a, given: x.chosen == null ? null : x.o[x.chosen], answer: x.o[x.a], level: x.level })),
      };
    });
    try { await saveAttempts(rows); setResult(rows); onSaved(); }
    catch (e) { setErr(e.message); }
    setBusy(false);
  }

  if (result) return (
    <main className="page">
      <div className="stack" style={{ gap: 4 }}><span className="eyebrow">Placement check</span><h1>Your starting levels</h1></div>
      <div className="card">
        {result.map(r => (
          <div key={r.subject} className="row"><b>{course.subjects[r.subject].name}</b><span className="spacer" />
            <span className="muted small num">{r.score}/6</span>
            <span className="pill good">{course.levels[levelFor(r.score)]}</span></div>
        ))}
      </div>
      <p className="muted">Each track now starts at that level. Easier lessons stay open in Practice if you want them. You can retake this from Progress.</p>
      {result.some(r => r.details.some(d => !d.ok)) && (
        <details className="card"><summary>Questions you missed</summary>
          <div className="stack small" style={{ marginTop: 8, gap: 6 }}>
            {result.flatMap(r => r.details.filter(d => !d.ok)).map((d, k) => (
              <div key={k} className="corr"><b>{d.q}</b><br /><span className="x">{d.given ?? 'no answer'}</span> · answer <span className="y">{d.answer}</span></div>
            ))}
          </div>
        </details>
      )}
      <a className="btn" href="#/today">Go to today’s lessons</a>
    </main>
  );

  const answered = qs.filter(x => x.chosen != null).length;
  return (
    <main className="page">
      <a href="#/today" className="btn link" style={{ alignSelf: 'flex-start' }}>← Today</a>
      <div className="stack" style={{ gap: 4 }}>
        <span className="eyebrow">Placement check · {course.subjects[q.track].name}</span>
        <h1>Question {i + 1} of {qs.length}</h1>
        <p className="muted small">Pick "Not sure" rather than guessing, so your level comes out right.</p>
        <div className="bar" style={{ marginTop: 6, flex: 'none' }} aria-label={`${answered} of ${qs.length} answered`}><i style={{ width: (answered / qs.length * 100) + '%' }} /></div>
      </div>
      <div className="q">
        <div className="qhead"><p>{q.q}</p></div>
        <div className="opts">
          {q.o.map((t, j) => <button key={j} className={'opt' + (q.chosen === j ? ' sel' : '')} onClick={() => choose(j)}>{t}</button>)}
        </div>
      </div>
      <div className="row">
        <button className="btn ghost" disabled={i === 0} onClick={() => setI(i - 1)}>Back</button>
        <span className="spacer" />
        {i < qs.length - 1
          ? <button className="btn ghost" disabled={q.chosen == null} onClick={() => setI(i + 1)}>Next</button>
          : <button className="btn" disabled={busy || answered < qs.length} onClick={finish}>{busy ? 'Saving…' : 'See my levels'}</button>}
      </div>
      {err && <p className="err">Couldn’t save: {err}</p>}
    </main>
  );
}
