import React from 'react';
import { useCourse } from '../lib/course.js';
import { findSession, placement, lessonAttempts } from '../content/courses.js';
import { sessionStats, streak, totals } from '../lib/stats.js';
import { StreakCard } from './Today.jsx';
import { pct, when } from '../components/ui.jsx';

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
        {!attempts.length && <p className="muted">Nothing yet. Finished lessons show up here.</p>}
        <div className="list">
          {attempts.slice(0, 15).map(a => {
            const s = findSession(course, a.session_key); const missed = (a.details || []).filter(d => !d.ok);
            return (
              <details key={a.id} className="li" style={{ display: 'block' }}>
                <summary><span style={{ color: 'var(--ink)' }}>{s?.title ?? a.session_key}</span> <span className="num">{a.score}/{a.total}</span>
                  <span className="muted small" style={{ fontWeight: 400 }}> · {when(a.created_at)}{a.duration_s ? ` · ${Math.max(1, Math.round(a.duration_s / 60))} min` : ''}</span></summary>
                <div className="stack small" style={{ marginTop: 8, gap: 6 }}>
                  {missed.length ? missed.map((d, i) => (
                    <div key={i} className="corr"><b>{d.q}</b><br /><span className="x">{d.given ?? 'no answer'}</span> · answer <span className="y">{d.answer}</span></div>
                  )) : <p className="muted">All correct.</p>}
                </div>
              </details>
            );
          })}
        </div>
      </section>
    </main>
  );
}
