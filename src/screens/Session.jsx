import React, { useEffect, useRef, useState } from 'react';
import { byKey, makeSet, SUBJECTS } from '../content/index.js';
import { saveAttempt } from '../lib/api.js';
import { PASS } from '../lib/stats.js';
import { TutorSheet, newThread } from '../components/Tutor.jsx';

const strip = html => html.replace(/<[^>]+>/g, '');

function contextFor(session, q) {
  const lines = [`I'm doing the lesson "${session.title}" (${session.subject}).`];
  if (q.p) lines.push(`Passage: ${strip(q.p)}`);
  lines.push(`Question: ${q.q}`);
  if (q.o) lines.push(`Options: ${q.o.join(' | ')}`);
  if (q.done) {
    const mine = q.o ? q.o[q.chosen] : q.last;
    const right = q.o ? q.o[q.a] : `${q.pre ? q.u : ''}${q.a}${q.u && !q.pre ? ' ' + q.u : ''}`;
    lines.push(`I answered: ${mine} (${q.ok ? 'correct' : 'wrong'}). The correct answer is ${right}. Method: ${q.s}`);
  } else lines.push("I haven't answered this yet.");
  return lines.join('\n');
}

function Question({ q, n, onAnswer, onHelp }) {
  const [val, setVal] = useState('');
  const [msg, setMsg] = useState('');
  const ans = (q.pre ? q.u : '') + q.a + (q.u && !q.pre ? ' ' + q.u : '');

  function check() {
    if (q.done) return;
    const v = parseFloat(val.replace(/[£,\s]/g, '').replace('−', '-'));
    if (isNaN(v)) { setMsg('Type a number first.'); return; }
    const tries = (q.tries ?? 0) + 1;
    if (Math.abs(v - q.a) < 1e-9) onAnswer({ done: true, ok: true, tries, last: val });
    else if (tries < 2) { setMsg('Not quite. Look at the worked example and try once more.'); onAnswer({ tries, last: val }); }
    else onAnswer({ done: true, ok: false, tries, last: val });
  }

  return (
    <div className={'q' + (q.done ? (q.ok ? ' ok' : ' no') : '')}>
      {q.p && <div className="passage" dangerouslySetInnerHTML={{ __html: q.p }} />}
      <div className="qhead"><span className="n">{n}.</span><p>{q.q}</p>
        {q.done && <button className="help" onClick={onHelp} aria-label={`Ask the tutor about question ${n}`}>Ask tutor</button>}</div>
      {q.o ? (
        <div className={'opts' + (q.short ? ' short' : '')}>
          {q.o.map((t, j) => (
            <button key={j} className={'opt' + (q.done ? (j === q.a ? ' right' : j === q.chosen ? ' wrong' : '') : '')}
              disabled={q.done} onClick={() => onAnswer({ done: true, ok: j === q.a, chosen: j })}>{t}</button>
          ))}
        </div>
      ) : (
        <form className="ans" onSubmit={e => { e.preventDefault(); check(); }}>
          {q.pre && <span className="unit">{q.u}</span>}
          <input inputMode="decimal" autoComplete="off" value={val} disabled={q.done} aria-label={`Answer to question ${n}`} onChange={e => setVal(e.target.value)} />
          {q.u && !q.pre && <span className="unit">{q.u}</span>}
          <button className="btn small" disabled={q.done}>Check</button>
        </form>
      )}
      {q.done ? (
        <div className={'fb ' + (q.ok ? 'ok' : 'no')}><b>{q.ok ? 'Correct.' : q.o ? 'Not this time.' : `The answer is ${ans}.`}</b><span className="steps">{q.s}</span>
          {!q.ok && <button className="help" style={{ marginTop: 4 }} onClick={onHelp}>Explain this to me</button>}</div>
      ) : msg && <div className="fb try">{msg}</div>}
    </div>
  );
}

export default function Session({ sessionKey, data, onSaved }) {
  const session = byKey(sessionKey);
  const tried = data.attempts.some(a => a.session_key === sessionKey);
  const [showLesson, setShowLesson] = useState(!tried);
  const [qs, setQs] = useState(() => session && !session.writing ? makeSet(session).map(q => ({ ...q })) : []);
  const [saved, setSaved] = useState(null);
  const [saveErr, setSaveErr] = useState('');
  const started = useRef(Date.now());
  const [help, setHelp] = useState(null);
  const threads = useRef({});
  const [, force] = useState(0);
  const saving = useRef(false);
  useEffect(() => {
    if (qs.length && qs.every(q => q.done) && saved == null && !saving.current) { saving.current = true; save(qs); }
  }, [qs]);

  const done = qs.filter(q => q.done).length, ok = qs.filter(q => q.ok).length;
  const subj = session ? SUBJECTS[session.subject] : null;
  const idx = subj ? subj.sessions.indexOf(session) : -1;

  if (!session) return <main className="page"><p>That lesson wasn't found.</p><a href="#/practice">Back to Practice</a></main>;
  if (session.writing) { window.location.hash = '#/writing'; return null; }

  async function save(list) {
    const score = list.filter(q => q.ok).length;
    const row = {
      session_key: session.key, subject: session.subject, score, total: list.length,
      duration_s: Math.round((Date.now() - started.current) / 1000),
      details: list.map(q => ({ q: q.q, ok: q.ok, given: q.o ? q.o[q.chosen] : q.last, answer: q.o ? q.o[q.a] : String(q.a) })),
    };
    try { await saveAttempt(row); setSaved(score); setSaveErr(''); onSaved(); }
    catch (e) { setSaveErr(e.message); }
    saving.current = false;
  }

  function answer(i, patch) {
    setQs(list => list.map((q, k) => k === i ? { ...q, ...patch } : q));
  }

  function again() {
    setQs(makeSet(session).map(q => ({ ...q }))); setSaved(null); threads.current = {}; started.current = Date.now();
    window.scrollTo({ top: 0 });
  }

  const h = help != null ? (threads.current[help] ??= { id: newThread(), messages: [] }) : null;

  return (
    <main className="page">
      <a href="#/today" className="btn link" style={{ alignSelf: 'flex-start' }}>← Today</a>
      <div className="stack" style={{ gap: 4 }}>
        <span className="eyebrow">{subj.name} · Lesson {idx + 1} of {subj.sessions.length}</span>
        <h1>{session.title}</h1>
      </div>

      <div className="lesson">
        <button className="lesson-toggle" onClick={() => setShowLesson(s => !s)} aria-expanded={showLesson}>
          <h3>Lesson</h3><span className="muted small">{showLesson ? 'Hide' : 'Show'}</span></button>
        {showLesson && <div className="stack" dangerouslySetInnerHTML={{ __html: session.lesson }} />}
      </div>

      <h2>Practice</h2>
      <p className="muted small" style={{ marginTop: -8 }}>Have a go at every question yourself. Once you've answered, you can ask the tutor about it.</p>
      {qs.map((q, i) => <Question key={i + q.q} q={q} n={i + 1} onAnswer={p => answer(i, p)} onHelp={() => setHelp(i)} />)}

      {saved != null && (
        <div className="card" style={{ borderColor: 'var(--accent)', borderWidth: 2 }}>
          <h2>{saved} out of {qs.length}</h2>
          <p>{saved >= PASS
            ? (idx < subj.sessions.length - 1 ? `Lesson passed. ${subj.sessions[idx + 1].title} unlocks next.` : 'Lesson passed. That’s this week’s ' + subj.name + ' done.')
            : `Aim for ${PASS}. Have another look at the lesson and try a new set tomorrow.`}</p>
          <div className="row"><a className="btn" href="#/today">Back to Today</a><button className="btn ghost" onClick={again}>New questions</button></div>
        </div>
      )}
      {saveErr && <div className="card"><p className="err">Couldn't save your score: {saveErr}</p><button className="btn" onClick={() => save(qs)}>Try again</button></div>}

      {saved == null && (
        <div className="sticky-score"><span>{ok} correct</span><div className="bar"><i style={{ width: (done / qs.length * 100) + '%' }} /></div><span className="muted">{done}/{qs.length}</span></div>
      )}

      <TutorSheet open={help != null} onClose={() => setHelp(null)} title={help != null ? `Question ${help + 1}` : ''}
        threadId={h?.id} sessionKey={session.key} context={help != null ? contextFor(session, qs[help]) : ''}
        messages={h?.messages ?? []} setMessages={fn => { h.messages = typeof fn === 'function' ? fn(h.messages) : fn; force(x => x + 1); }}
        intro={help != null && qs[help].ok ? "Nice. Want to check you really understand it?" : "Let's look at where it went wrong. What did you do?"}
        chips={help != null && qs[help].ok ? ['Why is that the answer?', 'Give me a harder one'] : ['Explain the method step by step', 'Where did I go wrong?', 'Give me a similar one to try']} />
    </main>
  );
}
