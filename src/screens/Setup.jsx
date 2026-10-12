import React, { useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { setupParent, setupStudent, joinAsParent } from '../lib/api.js';
import { Logo } from '../components/ui.jsx';

export default function Setup({ user, onDone, error }) {
  const [role, setRole] = useState(null);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [second, setSecond] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(error || '');

  async function submit(e) {
    e.preventDefault(); setErr(''); setBusy(true);
    try {
      const p = role === 'student' ? await setupStudent(name, code)
        : second ? await joinAsParent(name, code) : await setupParent(name);
      onDone(p);
    } catch (e2) { setErr(e2.message); setBusy(false); }
  }

  return (
    <main className="page bare" style={{ gap: 22 }}>
      <div className="top"><Logo /><span className="spacer" /><button className="btn link" onClick={() => supabase.auth.signOut()}>Sign out</button></div>
      <div className="stack" style={{ gap: 6 }}>
        <h1>Who's using this account?</h1>
        <p className="muted small">Signed in as {user.email}</p>
      </div>
      <div className="seg" role="tablist">
        <button className={role === 'student' ? 'on' : ''} onClick={() => setRole('student')}>I'm the student</button>
        <button className={role === 'parent' ? 'on' : ''} onClick={() => setRole('parent')}>I'm a parent</button>
      </div>
      {role && (
        <form className="card" onSubmit={submit} style={{ gap: 14 }}>
          <label className="field">Your first name<input id="name" required maxLength={40} value={name} onChange={e => setName(e.target.value)} /></label>
          {role === 'parent' && (
            <label className="check"><input type="checkbox" checked={second} onChange={e => setSecond(e.target.checked)} />
              <span>Another parent has already set up our family</span></label>
          )}
          {(role === 'student' || second) && (
            <label className="field">Family code
              <input id="code" required value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="e.g. K7PQ2M" autoCapitalize="characters" style={{ letterSpacing: '.15em' }} />
              <span className="muted small" style={{ fontWeight: 400 }}>Your parent can find this in their app.</span>
            </label>
          )}
          {role === 'parent' && !second && <p className="muted small">You'll get a family code to give your child so their progress links to you.</p>}
          {err && <p className="err" role="alert">{err}</p>}
          <button className="btn wide" disabled={busy}>{busy ? 'Setting up…' : 'Continue'}</button>
        </form>
      )}
    </main>
  );
}
