import React, { useEffect, useState } from 'react';
import { markAlertSeen, testPush, tutorThreads } from '../lib/api.js';
import { pushSupport, currentSubscription, enablePush } from '../lib/push.js';
import { when } from '../components/ui.jsx';

export function PushSetup({ compact, student }) {
  const [state, setState] = useState('checking');
  const [msg, setMsg] = useState('');
  useEffect(() => {
    const s = pushSupport();
    if (s !== 'ok') { setState(s); return; }
    currentSubscription().then(sub => setState(sub && Notification.permission === 'granted' ? 'on' : 'off')).catch(() => setState('off'));
  }, []);

  async function turnOn() {
    setMsg('');
    try { await enablePush(); setState('on'); if (student) setMsg('Reminders are on. You\u2019ll get one when each block opens.'); else { await testPush(); setMsg('Done. A test alert is on its way to this phone.'); } }
    catch (e) { setMsg(e.message); }
  }
  async function test() { setMsg(''); try { await testPush(); setMsg('Test alert sent.'); } catch (e) { setMsg(e.message); } }

  if (state === 'checking' || (compact && state === 'on')) return null;
  return (
    <div className={state === 'on' ? 'card' : 'note'} style={state === 'on' ? null : { borderLeftColor: 'var(--bad)' }}>
      {state === 'on' && (student ? <b>Reminders are on for this phone.</b> : <><b>Alerts are on for this phone.</b><div className="row"><button className="btn small ghost" onClick={test}>Send a test alert</button></div></>)}
      {state === 'off' && (student
        ? <><b>Turn on reminders</b><p>Get a notification at 1pm, 5pm and 9pm when each study block opens.</p><div className="row"><button className="btn" onClick={turnOn}>Turn on reminders</button></div></>
        : <><b>Turn on alerts</b><p>Get a notification straight away if he seems upset in the app.</p><div className="row"><button className="btn" onClick={turnOn}>Turn on alerts</button></div></>)}
      {state === 'ios-install' && <><b>Install the app to get {student ? 'reminders' : 'alerts'}</b><p>On iPhone, tap Share, then <b>Add to Home Screen</b>. Open Switched On from your home screen and turn them on there.</p></>}
      {state === 'denied' && <><b>{student ? 'Reminders are blocked' : 'Alerts are blocked'}</b><p>Notifications are turned off for this app. Turn them on in your phone's settings, then reopen the app.</p></>}
      {state === 'unsupported' && <><b>This browser can't show notifications</b><p>Open the app in Chrome (Android) or install it to your home screen (iPhone).</p></>}
      {state === 'unconfigured' && <p>Phone alerts aren't set up on the server yet. Alerts still appear on this page.</p>}
      {msg && <p className="small" role="status">{msg}</p>}
    </div>
  );
}

export default function Alerts({ alerts, kids, onChange }) {
  const [open, setOpen] = useState(null);
  const [thread, setThread] = useState([]);
  const name = id => kids.find(k => k.id === id)?.display_name ?? 'Your child';

  async function view(a) {
    setOpen(open === a.id ? null : a.id);
    if (a.thread_id) {
      const rows = await tutorThreads(a.student_id).catch(() => []);
      setThread(rows.filter(r => r.thread_id === a.thread_id).reverse());
    } else setThread([]);
    if (!a.seen_at) { await markAlertSeen(a.id).catch(() => {}); onChange(); }
  }

  return (
    <main className="page">
      <div className="stack" style={{ gap: 4 }}><h1>Alerts</h1>
        <p className="muted">The app checks everything he types to the tutor and in his writing. If he seems upset or unsafe, you're notified straight away.</p></div>
      <PushSetup />
      {!alerts.length && <p className="muted">No alerts. That's good.</p>}
      {alerts.map(a => (
        <div key={a.id} className="card" style={{ borderColor: a.seen_at ? 'var(--line)' : 'var(--bad)', borderWidth: a.seen_at ? 1 : 2 }}>
          <div className="row">
            <span className={'pill ' + (a.level === 'urgent' ? 'bad' : 'warn')}>{a.level === 'urgent' ? 'Urgent' : 'Concern'}</span>
            {!a.seen_at && <span className="pill bad">New</span>}
            <span className="spacer" /><span className="muted small">{when(a.created_at)}</span>
          </div>
          <b>{name(a.student_id)}: {a.reason}</b>
          <p className="passage">"{a.excerpt}"</p>
          <p className="muted small">From {a.source === 'tutor' ? 'a tutor chat' : 'his writing'}.</p>
          <div className="row"><button className="btn small ghost" onClick={() => view(a)}>{open === a.id ? 'Hide' : a.thread_id ? 'Read the whole chat' : 'Mark as seen'}</button></div>
          {open === a.id && thread.length > 0 && (
            <div className="chat" style={{ padding: '6px 0' }}>{thread.map(m => <div key={m.id} className={'msg ' + m.role}>{m.content}</div>)}</div>
          )}
        </div>
      ))}
      <div className="note small">
        <b>If you're worried about his safety right now</b>, call 999. For urgent mental health advice, call NHS 111 and choose the mental health option. He can talk to Childline any time, free, on 0800 1111.
      </div>
    </main>
  );
}
