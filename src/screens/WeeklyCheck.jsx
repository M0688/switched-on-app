import React, { useEffect, useState } from 'react';
import { useCourse } from '../lib/course.js';
import { buildWeekly, weekKey, weeklyOpen, weeklyDone, weekStart } from '../content/weekly.js';
import { saveAttempts } from '../lib/api.js';
import { loadDraft, saveDraft, clearDraft } from '../lib/draft.js';

/** End-of-week check: broad questions across all six subjects, one at a time, marked at the end. */
export default function WeeklyCheck({ data, onSaved }) {
  const course = useCourse();
  const key = weekKey();
  const [draft] = useState(() => loadDraft(key));
  const [qs, setQs] = useState(() => draft?.qs ?? buildWeekly(data.attempts, course.id));
  const [i, setI] = useState(() => draft?.i ?? 0);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (!result && qs.some(x => x.chosen != null)) saveDraft(key, { qs, i }); }, [qs, i, result, key]);

  if (!result && (!weeklyOpen() || weeklyDone(data.attempts))) return (
    <main className="page"><div className="card">
      <h1>Weekly check</h1>
      <p className="muted">{weeklyOpen() ? 'You’ve done this week’s check. The next one opens next Thursday.' : 'The weekly check opens on Thursdays.'}</p>
      <a className="btn" href="#/today">OK</a>
    </div></main>
  );

  const q = qs[i];
  function choose(j) {
    setQs(list => list.map((x, k) => k === i ? { ...x, chosen: j } : x));
    if (i < qs.length - 1) setTimeout(() => { setI(i + 1); window.scrollTo({ top: 0 }); }, 180);
  }

  async function finish() {
    setBusy(true); setErr('');
    const details = qs.map(x => ({ q: x.q, kind: 'mc', subject: x.subject, topic: x.topic, ok: x.chosen === x.a, given: x.chosen == null ? null : x.o[x.chosen], answer: x.o[x.a] }));
    const row = { session_key: key, subject: 'weekly', total: qs.length, score: details.filter(d => d.ok).length, details };
    try { await saveAttempts([row]); clearDraft(key); setResult(row); onSaved(); }
    catch (e) { setErr(e.message); }
    setBusy(false);
  }

  if (result) {
    const missed = result.details.filter(d => !d.ok);
    return (
      <main className="page">
        <div className="stack" style={{ gap: 4 }}><span className="eyebrow">Weekly check · w/c {new Date(weekStart() + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
          <h1>{result.score} out of {result.total}</h1></div>
        <div className="card">
          {Object.keys(course.subjects).map(id => {
            const mine = result.details.filter(d => d.subject === id);
            return <div key={id} className="row"><b>{course.subjects[id].name}</b><span className="spacer" /><span className="muted small num">{mine.filter(d => d.ok).length}/{mine.length}</span></div>;
          })}
        </div>
        <p className="muted">{missed.length ? 'Upcoming lessons will cover the topics you missed, and those questions come back in next week’s check.' : 'Full marks. Next week’s check moves on to new topics.'}</p>
        {missed.length > 0 && (
          <div className="card"><span className="eyebrow">To work on</span>
            <div className="stack small" style={{ marginTop: 8, gap: 6 }}>
              {missed.map((d, k) => (
                <div key={k} className="corr"><b>{d.topic}</b>: {d.q}<br /><span className="x">{d.given ?? 'no answer'}</span> · answer <span className="y">{d.answer}</span></div>
              ))}
            </div>
          </div>
        )}
        <a className="btn" href="#/today">Done</a>
      </main>
    );
  }

  const answered = qs.filter(x => x.chosen != null).length;
  return (
    <main className="page">
      <a href="#/today" className="btn link" style={{ alignSelf: 'flex-start' }}>← Today</a>
      <div className="stack" style={{ gap: 4 }}>
        <span className="eyebrow">Weekly check · {course.subjects[q.subject].name}</span>
        <h1>Question {i + 1} of {qs.length}</h1>
        <p className="muted small">Pick "Not sure" rather than guessing, so next week’s lessons cover the right things.</p>
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
          : <button className="btn" disabled={busy || answered < qs.length} onClick={finish}>{busy ? 'Saving…' : 'See my results'}</button>}
      </div>
      {err && <p className="err">Couldn’t save: {err}</p>}
    </main>
  );
}
