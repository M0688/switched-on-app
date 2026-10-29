import React from 'react';
import { useCourse } from '../lib/course.js';
import { findSession, placement, lessonAttempts } from '../content/courses.js';
import { sessionStats, streak, totals, integrity, dayKey } from '../lib/stats.js';
import { StreakCard } from './Today.jsx';
import { pct, when } from '../components/ui.jsx';
import { weeklyChecks, weeklyOpen, weeklyDone } from '../content/repair/weekly.js';

const mins = secs => secs < 60 ? `${secs} sec` : `${Math.round(secs / 60)} min`;
const clock = secs => `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;

export default function Progress({ profile, data, self }) {
  const course = useCourse();
  const { writings } = data;
  const attempts = course.assessment ? lessonAttempts(data.attempts) : data.attempts;
  const ALL = course.all, SUBJECTS = course.subjects;
  const place = course.assessment ? placement(data.attempts) : {};
  const st = sessionStats(ALL, attempts, writings);
  const t = totals(attempts);
  const passed = st.filter(s => s.passed).length;
  const weak = st.filter(s => !s.session.writing && s.accuracy != null && s.accuracy < 0.7).sort((a, b) => a.accuracy - b.accuracy);

  return (
    <main className="page">
      <div className="stack" style={{ gap: 4 }}><span className="eyebrow">All subjects</span><h1>{self ? 'Your progress' : `${profile.display_name}'s progress`}</h1></div>

      <div className="statrow">
        <div className="stat streak"><b>{streak(attempts, writings)}</b><span>day streak</span></div>
        <div className="stat"><b>{passed}<small style={{ fontSize: '.9rem', color: 'var(--muted)' }}>/{ALL.length}</small></b><span>lessons passed</span></div>
        <div className="stat"><b>{pct(t.accuracy)}</b><span>{t.answered} answered</span></div>
      </div>
      <StreakCard attempts={attempts} writings={writings} />
      {t.minutes > 0 && <p className="muted small">About {t.minutes} minutes of practice in total.</p>}

      {weak.length > 0 && (
        <div className="note"><b>{self ? 'Worth another go' : 'Needs work'}:</b> {weak.slice(0, 3).map(w => w.session.title).join(', ')}</div>
      )}

      {course.assessment && (
        <div className="card">
          <div className="row"><span className="eyebrow">Placement</span><span className="spacer" />
            {self && <a href="#/assess" className="small">{Object.keys(place).length ? 'Retake' : 'Take it now'}</a>}</div>
          {Object.entries(SUBJECTS).map(([id, subj]) => (
            <div key={id} className="row"><b>{subj.name}</b><span className="spacer" />
              {place[id] ? <span className="muted small num" style={{ whiteSpace: 'nowrap' }}>{place[id].score}/6 · starts at {course.levels[place[id].level]}</span> : <span className="muted small">Not taken</span>}</div>
          ))}
        </div>
      )}

      {course.assessment && (() => {
        const checks = weeklyChecks(data.attempts).slice(0, 4);
        const due = self && weeklyOpen() && !weeklyDone(data.attempts);
        if (!checks.length && !due) return null;
        const missed = (checks[0]?.details ?? []).filter(d => !d.ok).map(d => d.topic).filter(Boolean);
        return (
          <div className="card">
            <div className="row"><span className="eyebrow">Weekly checks</span><span className="spacer" />
              {due && <a href="#/weekly" className="small">Take this week’s</a>}</div>
            {checks.map(c => (
              <div key={c.session_key} className="row"><b>w/c {new Date(c.session_key.slice(3) + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</b><span className="spacer" />
                <span className="muted small num">{c.score}/{c.total}</span></div>
            ))}
            {missed.length > 0 && <p className="muted small">Latest gaps: {missed.join(', ')}</p>}
          </div>
        );
      })()}

      {Object.entries(SUBJECTS).map(([id, subj]) => (
        <section key={id} className="card">
          <div className="row"><h2>{subj.name}</h2><span className="spacer" /><span className="muted small">{subj.qual}</span></div>
          <div className="list">
            {st.filter(s => s.session.subject === id).map(s => (
              <div key={s.session.key} className="li">
                <span className="grow"><b>{s.session.title}</b><br />
                  <span className="muted small">{s.session.writing ? `${s.tries} piece${s.tries === 1 ? '' : 's'} written` : s.tries ? `${s.tries} tr${s.tries === 1 ? 'y' : 'ies'} · ${pct(s.accuracy)} right overall` : 'Not started'}</span></span>
                {s.passed ? <span className="pill good">{s.best != null ? `${s.best}/8` : 'Done'}</span>
                  : s.best != null ? <span className="pill warn">{s.best}/8</span> : <span className="pill quiet">–</span>}
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="card">
        <h2>Recent sessions</h2>
        {!self && (() => {
          const today = attempts.filter(x => dayKey(x.created_at) === dayKey());
          const flagged = today.filter(x => integrity(x).level !== 'ok');
          return today.length > 0 && <p className={flagged.length ? 'err small' : 'muted small'}>
            Today: {flagged.length ? `${flagged.length} of ${today.length} lessons flagged. Open them to see why.` : `${today.length} lesson${today.length === 1 ? '' : 's'}, nothing flagged.`}</p>;
        })()}
        {!attempts.length && <p className="muted">Nothing yet. Finished lessons show up here.</p>}
        <div className="list">
          {attempts.slice(0, 40).map(a => {
            const s = findSession(course, a.session_key), list = a.details || [];
            const flag = self ? null : integrity(a);
            return (
              <details key={a.id} className="li" style={{ display: 'block' }}>
                <summary><span style={{ color: 'var(--ink)' }}>{s?.title ?? a.session_key}</span> <span className="num">{a.score}/{a.total}</span>
                  <span className="muted small" style={{ fontWeight: 400 }}> · {when(a.created_at)}{a.duration_s ? ` · ${mins(a.duration_s)}` : ''}</span>
                  {flag?.level === 'likely' && <> <span className="pill bad">Looked up?</span></>}
                  {flag?.level === 'check' && <> <span className="pill warn">Check</span></>}</summary>
                <div className="stack small" style={{ marginTop: 8, gap: 6 }}>
                  {flag && flag.level !== 'ok' && <p className={flag.level === 'likely' ? 'err' : ''}><b>{flag.level === 'likely' ? 'Likely looked up elsewhere: ' : 'Worth checking: '}</b>{flag.reasons.join('; ')}.</p>}
                  {!list.length && <p className="muted">No question details saved.</p>}
                  {list.map((d, i) => (
                    <div key={i} className="corr" style={{ borderLeftColor: d.ok ? 'var(--good)' : 'var(--bad)' }}>
                      <b>{i + 1}. {d.q}</b><br />
                      {d.ok ? <span className="y">✓ {d.given}</span> : <><span className="x">✗ {d.given ?? 'no answer'}</span> · answer <span className="y">{d.answer}</span></>}
                      {Array.isArray(d.options) && <><br /><span className="muted">Options: {d.options.join(' · ')}</span></>}
                      {d.away > 0 && <><br /><span className="err">Left the app for {d.away} s{d.afterBack != null ? `, answered ${d.afterBack} s after coming back` : ''}</span></>}
                      {(d.tries > 1 || d.secs != null) && <span className="muted"> · {[d.tries > 1 && '2nd try', d.secs != null && `answered at ${clock(d.secs)}`].filter(Boolean).join(' · ')}</span>}
                    </div>
                  ))}
                </div>
              </details>
            );
          })}
        </div>
      </section>
    </main>
  );
}
