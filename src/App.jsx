import React, { useEffect, useState } from 'react';
import { supabase, configured } from './lib/supabase.js';
import { getProfile } from './lib/api.js';
import Auth from './screens/Auth.jsx';
import Setup from './screens/Setup.jsx';
import StudentApp from './screens/StudentApp.jsx';
import ParentApp from './screens/ParentApp.jsx';
import { Logo } from './components/ui.jsx';

export default function App() {
  const [session, setSession] = useState(undefined);
  const [profile, setProfile] = useState(undefined);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!configured) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) { setProfile(session === null ? null : undefined); return; }
    setProfile(undefined);
    getProfile(session.user.id).then(setProfile).catch(e => { setErr(e.message); setProfile(null); });
  }, [session?.user?.id]);

  if (!configured) return (
    <main className="page bare"><Logo /><div className="card"><h2>Almost ready</h2><p>This app hasn't been connected to its database yet.</p></div></main>
  );
  if (session === undefined || (session && profile === undefined)) return <main className="page bare"><Logo /><p className="muted">Loading…</p></main>;
  if (!session) return <Auth />;
  if (!profile) return <Setup user={session.user} onDone={setProfile} error={err} />;
  return profile.role === 'student' ? <StudentApp profile={profile} /> : <ParentApp profile={profile} />;
}
