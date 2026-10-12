import React, { useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { friendly } from '../lib/api.js';
import { Logo } from '../components/ui.jsx';

export default function Auth() {
  const [mode, setMode] = useState('in');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  async function submit(e) {
    e.preventDefault(); setErr(''); setMsg(''); setBusy(true);
    try {
      if (mode === 'in') {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
        if (error) throw error;
      } else if (mode === 'up') {
        if (pw.length < 8) throw new Error('Password should be at least 8 characters.');
        const { data, error } = await supabase.auth.signUp({ email, password: pw, options: { emailRedirectTo: window.location.origin + window.location.pathname } });
        if (error) throw error;
        if (!data.session) setMsg('Account made. Check your email and tap the link to confirm, then sign in here.');
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + window.location.pathname });
        if (error) throw error;
        setMsg('If that email has an account, a reset link is on its way.');
      }
    } catch (e2) { setErr(friendly(e2.message)); }
    setBusy(false);
  }

  return (
    <main className="page bare" style={{ gap: 24 }}>
      <Logo />
      <div className="stack" style={{ gap: 6 }}>
        <h1>{mode === 'up' ? 'Make an account' : mode === 'reset' ? 'Reset password' : 'Welcome back'}</h1>
        <p className="muted">Daily maths and English, one step at a time, on the way to college.</p>
      </div>
      <form className="card" onSubmit={submit} style={{ gap: 14 }}>
        <label className="field">Email<input id="email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} /></label>
        {mode !== 'reset' && <label className="field">Password<input id="password" type="password" autoComplete={mode === 'up' ? 'new-password' : 'current-password'} required value={pw} onChange={e => setPw(e.target.value)} /></label>}
        {err && <p className="err" role="alert">{err}</p>}
        {msg && <p className="note">{msg}</p>}
        <button className="btn wide" disabled={busy}>{busy ? 'Please wait…' : mode === 'up' ? 'Create account' : mode === 'reset' ? 'Send reset link' : 'Sign in'}</button>
      </form>
      <div className="row">
        {mode !== 'in' && <button className="btn link" onClick={() => setMode('in')}>I have an account</button>}
        {mode !== 'up' && <button className="btn link" onClick={() => setMode('up')}>Make an account</button>}
        {mode === 'in' && <button className="btn link" onClick={() => setMode('reset')}>Forgot password</button>}
      </div>
    </main>
  );
}
