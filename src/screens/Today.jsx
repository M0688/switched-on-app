import React from 'react';
import { SUBJECTS, ALL, SCHEDULE } from '../content/index.js';
import { todayPlan, streak, activity, sessionStats, reviewPick, dayKey, isWeekend } from '../lib/stats.js';
import { Logo } from '../components/ui.jsx';
import { supabase } from '../lib/supabase.js';

function greeting() {
  const h = Number(new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hourCycle: 'h23', timeZone: 'Europe/London' }).format(new Date()));
  return h < 12 ? 'Morning' : h < 18 ? 'Afternoon' : 'Evening';
}

export function StreakCard({ attempts, writings }) {
  const s = streak(attempts, writings), act = activity(attempts, writings), today = dayKey();
  return (
    <div className="card">
      <div className="row"><span className="eyebrow">Last 14 days</span><span className="spacer" />
        <b className="num" style={{ color: 'var(--amber)' }}>{s} school day{s === 1 ? '' : 's'} in a row</b></div>
      <div className="dots" aria-label={`Studied on ${act.filter(d => d.count).length} of the last 14 days`}>
        {act.map(d => <i key={d.day} className={(d.count ? 'on ' : '') + (d.weekend ? 'wk ' : '') + (d.day === today ? 'today' : '')} title={d.day} />)}
      </div>
    </div>
  );
}

export default function Today({ profile, data }) {
  const { attempts, writings } = data;
  const plan = todayPlan(SUBJECTS, attempts, writings, new Date(), SCHEDULE);
  const weekend = isWeekend();
  const allDone = !weekend && plan.every(p => p.doneToday || p.complete);
  const review = allDone ? reviewPick(sessionStats(ALL, attempts, writings)) : null;
  const latest = writings.find(w => w.status === 'marked');

  return (
    <main className="page">
      <div className="top"><Logo small /><span className="spacer" /><button className="btn link small" onClick={() => supabase.auth.signOut()}>Sign out</button></div>
      <div className="stack" style={{ gap: 4 }}>
        <span className="eyebrow">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/London' })}</span>
        <h1>{greeting()}, {profile.display_name}</h1>
        <p className="muted">{weekend ? 'It\u2019s the weekend. No lessons today. Enjoy your time off; lessons are back on Monday.' : allDone ? 'Today’s work is done. Nice one.' : `${['', 'One', 'Two', 'Three', 'Four', 'Five'][plan.length] ?? plan.length} short lesson${plan.length === 1 ? '' : 's'} today, about 20 minutes each.`}</p>
      </div>

      <div className="stack" style={{ gap: 10 }}>
        {plan.map(p => {
          if (p.complete) return (
            <div key={p.subject} className="task done"><span className="ic">✓</span><span className="t"><b>{p.name}: week complete</b><span>New lessons are on the way. Keep sharp with Practice.</span></span></div>
          );
          const href = p.next.writing ? '#/writing' : '#/s/' + p.next.key;
          const sub = p.doneToday
            ? (p.todayBest != null ? `Done today: ${p.todayBest}/8. ${p.todayBest >= 7 ? 'Next lesson tomorrow.' : 'Try again tomorrow.'}` : 'Writing sent today.')
            : p.lastTry ? `Last try ${p.lastTry.score}/8. Aim for 7.` : `Lesson ${p.index + 1} of ${p.total}`;
          return (
            <a key={p.subject} href={href} className={'task' + (p.doneToday ? ' done' : '')} style={{ textDecoration: 'none', color: 'inherit' }}>
              <span className="ic">{p.doneToday ? '✓' : SUBJECTS[p.subject].icon}</span>
              <span className="t"><span className="eyebrow">{p.name}</span><b>{p.next.title}</b><span>{sub}</span></span>
            </a>
          );
        })}
      </div>

      {review && (
        <a href={'#/s/' + review.key} className="task" style={{ textDecoration: 'none', color: 'inherit' }}>
          <span className="ic" style={{ background: 'var(--amber-soft)', color: 'var(--amber)' }}>↻</span>
          <span className="t"><span className="eyebrow">Optional extra</span><b>Review: {review.title}</b><span>Your weakest topic so far</span></span>
        </a>
      )}

      <StreakCard attempts={attempts} writings={writings} />

      {latest && (
        <a href="#/writing" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <span className="eyebrow">Latest writing feedback</span>
          <b>{latest.feedback?.grade_estimate}</b>
          <p className="muted small">{latest.feedback?.summary}</p>
        </a>
      )}

      {!weekend && <a href="#/help" className="note" style={{ textDecoration: 'none', color: 'inherit' }}>
        <b>Stuck?</b> Have a go first. Once you've answered, tap <b>Ask tutor</b> on the question, or use <b>Ask</b> below for any topic.
      </a>}
    </main>
  );
}
