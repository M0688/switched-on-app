import React from 'react';
import { useCourse } from '../lib/course.js';
import { placement } from '../content/courses.js';
import { weeklyOpen, weeklyDone, weeklySize } from '../content/weekly.js';
import { streak, activity, dayKey } from '../lib/stats.js';
import { dayPlan, BLOCK_HOURS, PER_DAY, blockLabel } from '../lib/plan.js';
import { Logo } from '../components/ui.jsx';
import { supabase } from '../lib/supabase.js';
import { FishingCard } from '../components/Fishing.jsx';
import { PushSetup } from './Alerts.jsx';

function greeting() {
  const h = Number(new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hourCycle: 'h23', timeZone: 'Europe/London' }).format(new Date()));
  return h < 12 ? 'Morning' : h < 18 ? 'Afternoon' : 'Evening';
}

export function StreakCard({ attempts, writings }) {
  const { dayWord } = useCourse();
  const s = streak(attempts, writings), act = activity(attempts, writings), today = dayKey();
  return (
    <div className="card">
      <div className="row"><span className="eyebrow">Last 14 days</span><span className="spacer" />
        <b className="num" style={{ color: 'var(--amber)' }}>{s} {dayWord}{s === 1 ? '' : 's'} in a row</b></div>
      <div className="dots" aria-label={`Studied on ${act.filter(d => d.count).length} of the last 14 days`}>
        {act.map(d => <i key={d.day} className={(d.count ? 'on ' : '') + (d.weekend ? 'wk ' : '') + (d.day === today ? 'today' : '')} title={d.day} />)}
      </div>
    </div>
  );
}

export function BlockStrip({ plan }) {
  return (
    <div className="blocks" role="list" aria-label="Today's study blocks">
      {BLOCK_HOURS.map((_, i) => {
        const done = plan.items.length > 0 && plan.items.every(it => it.done > i);
        const open = i < plan.open;
        return (
          <div key={i} role="listitem" className={'blk' + (done ? ' done' : open ? ' open' : '')}>
            <b>{blockLabel(i)}</b><span>{done ? 'Done' : open ? 'Open now' : 'Locked'}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function Today({ profile, data }) {
  const { attempts, writings } = data;
  const course = useCourse();
  const plan = dayPlan(course.planSubjects(attempts), course.schedule, attempts, writings);
  const needsPlacement = course.assessment && Object.keys(placement(attempts)).length === 0;
  const weekend = plan.weekend;
  const weeklyDue = course.weekly && !needsPlacement && weeklyOpen() && !weeklyDone(attempts);
  const allDone = !weekend && plan.items.length > 0 && plan.items.every(i => i.finished);
  const waiting = !weekend && !allDone && plan.items.every(i => !i.canStart);
  const latest = writings.find(w => w.status === 'marked');
  const left = plan.lessonsTotal - plan.lessonsDone;

  let intro;
  if (weekend) intro = 'It\u2019s the weekend. No lessons today. Enjoy your time off; lessons are back on Monday.';
  else if (allDone) intro = course.schedule.allDay ? 'All of today\u2019s lessons done. Brilliant work.' : 'All 3 blocks done today. Brilliant work.';
  else if (plan.open === 0) intro = `Your first block opens at ${blockLabel(0)}. ${plan.lessonsTotal} lessons today, about ${course.lessonMinutes} minutes each.`;
  else if (waiting) intro = `Block done. The next one opens at ${blockLabel(plan.open)}.`;
  else intro = `${plan.lessonsDone} of ${plan.lessonsTotal} lessons done today. ${left} to go.`;

  return (
    <main className="page">
      <div className="top"><Logo small /><span className="spacer" /><button className="btn link small" onClick={() => supabase.auth.signOut()}>Sign out</button></div>
      <div className="stack" style={{ gap: 4 }}>
        <span className="eyebrow">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/London' })}</span>
        <h1>{greeting()}, {profile.display_name}</h1>
        <p className="muted">{intro}</p>
      </div>

      {needsPlacement && (
        <a href="#/assess" className="card" style={{ borderColor: 'var(--accent)', borderWidth: 2, textDecoration: 'none', color: 'inherit' }}>
          <span className="eyebrow">Start here</span><b>Placement check</b>
          <span className="muted">30 questions, about 10 minutes. It sets your starting level in each subject, so you skip what you already know.</span>
          <span className="btn" style={{ alignSelf: 'flex-start' }}>Start</span>
        </a>
      )}
      {weeklyDue && (
        <a href="#/weekly" className="card" style={{ borderColor: 'var(--accent)', borderWidth: 2, textDecoration: 'none', color: 'inherit' }}>
          <span className="eyebrow">End of the week</span><b>Weekly check</b>
          <span className="muted">{weeklySize(course.id)} questions across every subject, about 5 minutes. {course.weeklyNote ?? ''}What you miss shapes your next lessons.</span>
          <span className="btn" style={{ alignSelf: 'flex-start' }}>Start</span>
        </a>
      )}
      {!weekend && !needsPlacement && !course.schedule.allDay && <BlockStrip plan={plan} />}
      <PushSetup compact student />

      {!needsPlacement && <div className="stack" style={{ gap: 10 }}>
        {plan.items.map(p => {
          const href = p.next.writing ? '#/writing' : '#/s/' + p.next.key;
          const last = p.results[p.results.length - 1];
          const sub = p.finished ? `All ${PER_DAY} done today${last && !last.writing ? `. Last score ${last.score}/8` : ''}.`
            : p.canStart ? `${p.review ? 'Review \u00b7 ' : ''}Lesson ${p.done + 1} of ${PER_DAY} today`
            : `${p.done} of ${PER_DAY} done. Next opens at ${blockLabel(p.done)}.`;
          const inner = (<>
            <span className="ic">{p.finished ? '\u2713' : course.subjects[p.subject].icon}</span>
            <span className="t"><span className="eyebrow">{p.name}</span><b>{p.finished ? 'Finished for today' : p.next.title}</b><span>{sub}</span></span>
            <span className="pips" aria-hidden="true">{Array.from({ length: PER_DAY }, (_, i) => <i key={i} className={i < p.done ? 'on' : ''} />)}</span>
          </>);
          return p.canStart
            ? <a key={p.subject} href={href} className="task" style={{ textDecoration: 'none', color: 'inherit' }}>{inner}</a>
            : <div key={p.subject} className={'task' + (p.finished ? ' done' : ' wait')}>{inner}</div>;
        })}
      </div>}

      {course.rewards && <FishingCard data={data} link="#/fishing" />}

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
