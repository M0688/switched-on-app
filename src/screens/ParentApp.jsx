import React, { useEffect, useState } from 'react';
import { familyStudents, getFamily, loadStudentData, tutorThreads, loadAlerts } from '../lib/api.js';
import Alerts, { PushSetup } from './Alerts.jsx';
import { ParentFishing, FishingCard } from '../components/Fishing.jsx';
import { supabase } from '../lib/supabase.js';
import { Logo, Tabs, useRoute, when } from '../components/ui.jsx';
import Progress from './Progress.jsx';
import Feedback from '../components/Feedback.jsx';
import { dayPlan, PER_DAY } from '../lib/plan.js';
import { BlockStrip } from './Today.jsx';
import { SUBJECTS, SCHEDULE } from '../content/index.js';

function FamilyCode({ family, empty }) {
  return (
    <div className={empty ? 'card' : 'note'}>
      {empty && <h2>Add your child</h2>}
      <p>{empty ? 'Ask them to install the app, make their own account, choose "I’m the student", and enter this family code:' : 'Family code (to add another child or parent):'}</p>
      <p className="code">{family?.join_code ?? '······'}</p>
    </div>
  );
}

function Chats({ kid }) {
  const [rows, setRows] = useState(null);
  useEffect(() => { tutorThreads(kid.id).then(setRows).catch(() => setRows([])); }, [kid.id]);
  if (!rows) return <p className="muted">Loading…</p>;
  const threads = {};
  for (const m of [...rows].reverse()) (threads[m.thread_id] ??= []).push(m);
  const list = Object.values(threads).sort((a, b) => b.at(-1).created_at.localeCompare(a.at(-1).created_at));
  return (
    <>
      {!list.length && <p className="muted">No tutor chats yet.</p>}
      {list.map(t => (
        <details key={t[0].thread_id} className="card">
          <summary>{when(t[0].created_at)} · {t.filter(m => m.role === 'user').length} question{t.filter(m => m.role === 'user').length === 1 ? '' : 's'}</summary>
          <div className="chat" style={{ padding: '10px 0' }}>
            {t.map(m => <div key={m.id} className={'msg ' + m.role}>{m.content}</div>)}
          </div>
        </details>
      ))}
    </>
  );
}

export default function ParentApp({ profile }) {
  const [top] = useRoute();
  const tab = ['writing', 'chats', 'alerts', 'fishing'].includes(top) ? top : 'progress';
  const [kids, setKids] = useState(null);
  const [family, setFamily] = useState(null);
  const [kidId, setKidId] = useState(null);
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const [alerts, setAlerts] = useState([]);
  const refreshAlerts = () => loadAlerts().then(setAlerts).catch(() => {});
  useEffect(() => {
    refreshAlerts();
    const t = setInterval(refreshAlerts, 60000);
    const f = () => document.visibilityState === 'visible' && refreshAlerts();
    document.addEventListener('visibilitychange', f);
    return () => { clearInterval(t); document.removeEventListener('visibilitychange', f); };
  }, []);
  const unseen = alerts.filter(a => !a.seen_at).length;

  useEffect(() => {
    Promise.all([familyStudents(), getFamily()]).then(([k, f]) => { setKids(k); setFamily(f); setKidId(k[0]?.id ?? null); }).catch(e => setErr(e.message));
  }, []);
  useEffect(() => { if (kidId) { setData(null); loadStudentData(kidId).then(setData).catch(e => setErr(e.message)); } }, [kidId]);
  const reloadKid = () => loadStudentData(kidId).then(setData).catch(e => setErr(e.message));
  const kid = kids?.find(k => k.id === kidId);

  const header = (
    <div className="page" style={{ paddingBottom: 0 }}>
      <div className="top"><Logo small /><span className="spacer" /><button className="btn link small" onClick={() => supabase.auth.signOut()}>Sign out</button></div>
      {kids?.length > 1 && <div className="seg">{kids.map(k => <button key={k.id} className={k.id === kidId ? 'on' : ''} onClick={() => setKidId(k.id)}>{k.display_name}</button>)}</div>}
    </div>
  );

  let body;
  if (tab === 'alerts' && kids) body = <Alerts alerts={alerts} kids={kids} onChange={refreshAlerts} />;
  else if (err) body = <main className="page"><p className="err">{err}</p></main>;
  else if (!kids) body = <main className="page"><p className="muted">Loading…</p></main>;
  else if (!kids.length) body = <main className="page"><h1>Hello, {profile.display_name}</h1><FamilyCode family={family} empty />
    <p className="muted small">Once they've joined, pull down or reopen the app to see their progress here.</p></main>;
  else if (!data) body = <main className="page"><p className="muted">Loading {kid?.display_name}'s work…</p></main>;
  else if (tab === 'writing') body = (
    <main className="page"><h1>{kid.display_name}'s writing</h1>
      {!data.writings.length && <p className="muted">Nothing written yet. The writing task is lesson 6 of English.</p>}
      {data.writings.map(w => (
        <details key={w.id} className="card" open={w === data.writings[0]}>
          <summary>{w.title} <span className="muted small" style={{ fontWeight: 400 }}>· {when(w.created_at)}</span></summary>
          <div className="stack" style={{ marginTop: 10 }}>
            {w.status === 'marked' ? <Feedback fb={w.feedback} parent /> : <p className="muted">Not marked yet.</p>}
            <details><summary>What he wrote ({w.word_count} words)</summary><p style={{ whiteSpace: 'pre-wrap', marginTop: 6 }}>{w.body}</p></details>
          </div>
        </details>
      ))}
    </main>);
  else if (tab === 'fishing') body = <ParentFishing kid={kid} data={data} onChange={reloadKid} />;
  else if (tab === 'chats') body = <main className="page"><h1>Tutor chats</h1><p className="muted small">Everything {kid.display_name} has asked the AI tutor.</p><Chats kid={kid} /></main>;
  else {
    const plan = dayPlan(SUBJECTS, SCHEDULE, data.attempts, data.writings);
    body = (<>
      <div className="page" style={{ paddingBottom: 0 }}>
        {unseen > 0 && (
          <a href="#/alerts" className="card" style={{ borderColor: 'var(--bad)', borderWidth: 2, textDecoration: 'none', color: 'inherit' }}>
            <b className="err">{unseen} new alert{unseen === 1 ? '' : 's'}</b><span>{kid.display_name} may be upset. Tap to read.</span></a>
        )}
        <PushSetup compact />
        <FishingCard data={data} link="#/fishing" />
        <div className="card"><div className="row"><span className="eyebrow">Today</span><span className="spacer" />
          {!plan.weekend && <b className="num">{plan.lessonsDone} of {plan.lessonsTotal} lessons</b>}</div>
          {plan.weekend ? <p className="muted">Weekend: no lessons. Back on Monday.</p> : <BlockStrip plan={plan} />}
          {plan.items.map(p => <div key={p.subject} className="row"><b>{p.name}</b>
            <span className="muted small num">{p.results.map(r => r.writing ? 'writing' : `${r.score}/8`).join(' \u00b7 ') || 'not started'}</span><span className="spacer" />
            <span className={'pill ' + (p.finished ? 'good' : p.done ? 'warn' : 'quiet')}>{p.done}/{PER_DAY}</span></div>)}
        </div>
      </div>
      <Progress profile={kid} data={data} />
      <div className="page" style={{ paddingTop: 0, marginTop: -24 }}><FamilyCode family={family} /></div>
    </>);
  }

  return <>{header}{body}<Tabs current={tab} items={[['progress', 'Progress'], ['alerts', unseen ? `Alerts (${unseen})` : 'Alerts'], ['fishing', 'Fishing'], ['writing', 'Writing'], ['chats', 'Chats']]} /></>;
}
