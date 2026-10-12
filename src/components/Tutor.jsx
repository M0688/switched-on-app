import React, { useEffect, useRef, useState } from 'react';
import { askTutor } from '../lib/api.js';

export const newThread = () => (crypto.randomUUID ? crypto.randomUUID()
  : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16); }));

/** Chat with the AI tutor. `messages` lives in the parent so it survives closing the sheet. */
export function TutorChat({ threadId, sessionKey, context, chips = [], messages, setMessages, intro }) {
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const end = useRef(null);
  useEffect(() => { end.current?.scrollIntoView({ block: 'end' }); }, [messages.length, busy]);

  async function send(m) {
    const msg = (m ?? text).trim();
    if (!msg || busy) return;
    setErr(''); setText(''); setBusy(true);
    setMessages(x => [...x, { role: 'user', content: msg }]);
    try {
      const { reply } = await askTutor({ thread_id: threadId, session_key: sessionKey, context, message: msg });
      setMessages(x => [...x, { role: 'assistant', content: reply }]);
    } catch (e) { setErr(e.message); }
    setBusy(false);
  }

  return (
    <>
      <div className="chat" aria-live="polite">
        {intro && <div className="msg assistant">{intro}</div>}
        {messages.map((m, i) => <div key={i} className={'msg ' + m.role}>{m.content}</div>)}
        {busy && <div className="msg assistant muted">Thinking…</div>}
        {err && <p className="err small" role="alert">{err}</p>}
        {!messages.length && chips.length > 0 && (
          <div className="chips">{chips.map(c => <button key={c} className="chip" onClick={() => send(c)}>{c}</button>)}</div>
        )}
        <div ref={end} />
      </div>
      <form className="composer" onSubmit={e => { e.preventDefault(); send(); }}>
        <textarea id="tutor-input" rows={1} value={text} placeholder="Ask anything about this…" aria-label="Message"
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }} />
        <button className="btn" disabled={busy || !text.trim()}>Send</button>
      </form>
    </>
  );
}

export function TutorSheet({ open, onClose, title, ...chat }) {
  useEffect(() => {
    if (!open) return;
    const f = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', f); document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', f); document.body.style.overflow = ''; };
  }, [open]);
  if (!open) return null;
  return (
    <div className="scrim" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="sheet" role="dialog" aria-modal="true" aria-label="Help">
        <header><div className="grow" style={{ flex: 1, minWidth: 0 }}><span className="eyebrow">Help</span><h3>{title}</h3></div>
          <button className="btn small ghost" onClick={onClose}>Close</button></header>
        <TutorChat {...chat} />
      </div>
    </div>
  );
}
