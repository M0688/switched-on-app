import React, { useEffect, useState } from 'react';
import { supabase, configured } from './lib/supabase.js';
import { getProfile, loadAlerts } from './lib/api.js';
import Auth from './screens/Auth.jsx';
import Setup from './screens/Setup.jsx';
import StudentApp from './screens/StudentApp.jsx';
import ParentApp from './screens/ParentApp.jsx';
import { Logo, useRoute } from './components/ui.jsx';
import { addLessons } from './content/dynamic.js';
import { courseFor } from './content/courses.js';
import { CourseContext } from './lib/course.js';

export default function App() {
  const [session, setSession] = useState(undefined);
  const [profile, setProfile] = useState(undefined);
  const [err, setErr] = useState('');
  const [lessonsReady, setLessonsReady] = useState(false);

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
    // Extra lessons added since the app was built. If this fails, the built-in lessons still work.
    supabase.from('lessons').select('*').order('position')
      .then(({ data }) => { if (data) addLessons(data); })
      .finally(() => setLessonsReady(true));
  }, [session?.user?.id]);

  if (!configured) return (
    <main className="page bare"><Logo /><div className="card"><h2>Almost ready</h2><p>This app hasn't been connected to its database yet.</p></div></main>
  );
  if (session === undefined || (session && (profile === undefined || !lessonsReady))) return <main className="page bare"><Logo /><p className="muted">Loading…</p></main>;
  if (!session) return <Auth />;
  if (!profile) return <Setup user={session.user} onDone={setProfile} error={err} />;
  if (profile.role === 'student') return (
    <CourseContext.Provider value={courseFor(profile.course)}><StudentApp profile={profile} /></CourseContext.Provider>
  );
  if (profile.course && profile.course !== 'gcse') return <ParentWithCourse profile={profile} />;
  return <ParentApp profile={profile} />;
}

/* A parent who also follows a course of their own gets a switch between "My course" and the family view. */
const PARENT_ONLY = ['alerts', 'fishing', 'writing', 'chats'];
const MODE_KEY = 'switched-on-mode';

function ParentWithCourse({ profile }) {
  const route = useRoute();
  const [mode, setModeState] = useState(() => { try { return localStorage.getItem(MODE_KEY) || 'me'; } catch { return 'me'; } });
  const setMode = m => { setModeState(m); try { localStorage.setItem(MODE_KEY, m); } catch { /* private mode */ } };

  // Links from notifications: "#/me" opens the course; alert links open the family view.
  useEffect(() => {
    if (route[0] === 'me') { setMode('me'); window.location.replace('#/today'); }
    else if (PARENT_ONLY.includes(route[0])) setMode('family');
  }, [route.join('/')]);

  const go = m => { setMode(m); window.location.hash = m === 'me' ? '#/today' : '#/progress'; };
  const switcher = (
    <div className="page" style={{ paddingBottom: 0, paddingTop: 12 }}>
      <div className="seg" role="tablist" aria-label="View">
        <button role="tab" aria-selected={mode === 'me'} className={mode === 'me' ? 'on' : ''} onClick={() => go('me')}>My course</button>
        <button role="tab" aria-selected={mode !== 'me'} className={mode !== 'me' ? 'on' : ''} onClick={() => go('family')}>Family</button>
      </div>
    </div>
  );

  if (mode !== 'me') return <>{switcher}<ParentApp profile={profile} /></>;
  return (
    <CourseContext.Provider value={courseFor(profile.course)}>
      <StudentApp profile={profile} banner={<>{switcher}<AlertBanner /></>} />
    </CourseContext.Provider>
  );
}

/** Keeps family alerts visible while the parent is in their own course. */
function AlertBanner() {
  const [n, setN] = useState(0);
  useEffect(() => {
    const check = () => loadAlerts().then(a => setN(a.filter(x => !x.seen_at).length)).catch(() => {});
    check();
    const t = setInterval(check, 60000);
    return () => clearInterval(t);
  }, []);
  if (!n) return null;
  return (
    <div className="page" style={{ paddingBottom: 0, paddingTop: 12 }}>
      <a href="#/alerts" className="card" style={{ borderColor: 'var(--bad)', borderWidth: 2, textDecoration: 'none', color: 'inherit' }}>
        <b className="err">{n} new family alert{n === 1 ? '' : 's'}</b><span>Tap to read.</span></a>
    </div>
  );
}
