import React, { useState } from 'react';
import { byKey, PROMPTS, CHECKS } from '../content/index.js';
import { submitWriting, markWriting } from '../lib/api.js';
import Feedback from '../components/Feedback.jsx';
import { when } from '../components/ui.jsx';

const DKEY = 'so-writing-draft';
const words = t => (t.trim().match(/\S+/g) || []).length;
function loadDraft() { try { return JSON.parse(localStorage.getItem(DKEY)) || { p: 0, t: '' }; } catch { return { p: 0, t: '' }; } }
function storeDraft(d) { try { localStorage.setItem(DKEY, JSON.stringify(d)); } catch { /* private mode */ } }

export default function Writing({ data, onSaved }) {
  const session = byKey('e-s6');
  const [draft, setDraft] = useState(loadDraft);
  const [showLesson, setShowLesson] = useState(!data.writings.length);
  const [busy, setBusy] = useState('');
  const [err, setErr] = useState('');
  const [result, setResult] = useState(null);
  const upd = d => { setDraft(d); storeDraft(d); };
  const wc = words(draft.t);

  async function send() {
    setErr(''); setBusy('Saving…');
    try {
      const sub = await submitWriting(PROMPTS[draft.p], draft.t.trim(), wc);
      upd({ p: draft.p, t: '' });
      setBusy('Marking… this takes about 20 seconds.');
      onSaved();
      const { feedback } = await markWriting(sub.id);
      setResult(feedback); onSaved();
    } catch (e) { setErr(e.message + ' Your writing is saved; you can try marking again below.'); onSaved(); }
    setBusy('');
  }
  async function retry(id) {
    setErr(''); setBusy('Marking…');
    try { const { feedback } = await markWriting(id); setResult(feedback); onSaved(); } catch (e) { setErr(e.message); }
    setBusy('');
  }

  return (
    <main className="page">
      <a href="#/today" className="btn link" style={{ alignSelf: 'flex-start' }}>← Today</a>
      <div className="stack" style={{ gap: 4 }}><span className="eyebrow">English · Lesson 6</span><h1>Writing task</h1></div>

      <div className="lesson">
        <button className="lesson-toggle" onClick={() => setShowLesson(s => !s)} aria-expanded={showLesson}><h3>How to do it</h3><span className="muted small">{showLesson ? 'Hide' : 'Show'}</span></button>
        {showLesson && <div className="stack" dangerouslySetInnerHTML={{ __html: session.lesson }} />}
      </div>

      {result ? (
        <div className="card" style={{ borderColor: 'var(--accent)', borderWidth: 2 }}>
          <span className="eyebrow">Your feedback</span><Feedback fb={result} />
          <button className="btn ghost" onClick={() => setResult(null)}>Write another</button>
        </div>
      ) : (
        <>
          <section className="stack">
            <h3>Choose a title</h3>
            {PROMPTS.map((t, j) => <button key={j} className={'opt' + (draft.p === j ? ' sel' : '')} aria-pressed={draft.p === j} onClick={() => upd({ ...draft, p: j })}>{t}</button>)}
          </section>
          <section className="stack">
            <h3>Write here</h3>
            <textarea id="essay" style={{ minHeight: 280 }} value={draft.t} placeholder="Start with a sentence that says what you think…" aria-label="Your writing" onChange={e => upd({ ...draft, t: e.target.value })} />
            <p className="muted small num">{wc} words · aim for 150–250 · saved on this phone as you type</p>
          </section>
          <section className="card">
            <h3>Check before you send</h3>
            {CHECKS.map((c, j) => <label key={j} className="check"><input type="checkbox" id={'ck' + j} /><span>{c}</span></label>)}
          </section>
          {err && <p className="err" role="alert">{err}</p>}
          <button className="btn wide" disabled={!!busy || wc < 40} onClick={send}>{busy || (wc < 40 ? `Write at least 40 words (${wc} so far)` : 'Send for marking')}</button>
        </>
      )}

      {data.writings.length > 0 && (
        <section className="card">
          <h3>Your writing</h3>
          <div className="list">
            {data.writings.map(w => (
              <details key={w.id} className="li" style={{ display: 'block' }}>
                <summary><span style={{ color: 'var(--ink)' }}>{w.title}</span> <span className="muted small" style={{ fontWeight: 400 }}>· {when(w.created_at)}</span></summary>
                <div className="stack" style={{ marginTop: 10 }}>
                  {w.status === 'marked' ? <Feedback fb={w.feedback} />
                    : <div className="row"><span className="muted">{w.status === 'pending' ? 'Not marked yet.' : 'Marking failed.'}</span>
                      <button className="btn small" disabled={!!busy} onClick={() => retry(w.id)}>Mark it now</button></div>}
                  <details><summary>What you wrote ({w.word_count} words)</summary><p style={{ whiteSpace: 'pre-wrap', marginTop: 6 }}>{w.body}</p></details>
                </div>
              </details>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
