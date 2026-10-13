import React from 'react';
import { useCourse } from '../lib/course.js';
import { isSkipped } from '../content/courses.js';
import { sessionStats } from '../lib/stats.js';
import { replay } from '../lib/plan.js';

export default function Practice({ data }) {
  const course = useCourse();
  const { tried } = replay(course.planSubjects(data.attempts), course.schedule, data.attempts, data.writings);
  return (
    <main className="page">
      <div className="stack" style={{ gap: 4 }}><span className="eyebrow">All subjects</span><h1>Practice</h1>
        <p className="muted">New lessons come from your Today screen. Go back to any you've already done for extra practice. {course.extraPractice}</p></div>
      {Object.entries(course.subjects).map(([id, subj]) => {
        const st = sessionStats(subj.sessions, data.attempts, data.writings);
        const skipped = s => isSkipped(course, data.attempts, s.session.key);
        const firstOpen = st.findIndex(s => !tried[id].has(s.session.key) && !skipped(s));
        return (
          <section key={id} className="card">
            <div className="row"><h2>{subj.name}</h2><span className="spacer" /><span className="muted small">{subj.qual}</span></div>
            <div className="list">
              {st.map((s, i) => {
                const below = skipped(s);
                const locked = !tried[id].has(s.session.key) && !below;
                const href = s.session.writing ? '#/writing' : '#/s/' + s.session.key;
                const pill = s.passed ? <span className="pill good">Done</span>
                  : s.best != null ? <span className="pill warn">Best {s.best}/8</span>
                  : s.session.writing && tried[id].has(s.session.key) ? <span className="pill quiet">Sent</span>
                  : below ? <span className="pill quiet">Optional</span> : null;
                const inner = (<>
                  <span className="num muted" style={{ width: '1.4em', fontWeight: 700 }}>{i + 1}</span>
                  <span className="grow"><b>{s.session.title}</b><br /><span className="muted small">{course.levels && s.session.level ? `${course.levels[s.session.level]} · ` : ''}{s.session.sub}</span></span>
                  {locked ? <span className="muted small">{i === firstOpen ? 'Up next' : 'Locked'}</span> : pill}
                </>);
                return locked
                  ? <div key={s.session.key} className="li" style={{ opacity: .55 }}>{inner}</div>
                  : <a key={s.session.key} href={href} className="li" style={{ textDecoration: 'none', color: 'inherit' }}>{inner}</a>;
              })}
            </div>
          </section>
        );
      })}
    </main>
  );
}
