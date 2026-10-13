import React, { useCallback, useEffect, useState } from 'react';
import { loadStudentData } from '../lib/api.js';
import { Tabs, useRoute } from '../components/ui.jsx';
import Today from './Today.jsx';
import Practice from './Practice.jsx';
import Session from './Session.jsx';
import Writing from './Writing.jsx';
import Progress from './Progress.jsx';
import Help from './Help.jsx';
import { isWeekend } from '../lib/stats.js';
import { FishingPage } from '../components/Fishing.jsx';
import Assessment from './Assessment.jsx';
import { useCourse } from '../lib/course.js';

export default function StudentApp({ profile, banner = null }) {
  const course = useCourse();
  const route = useRoute();
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const reload = useCallback(() => loadStudentData(profile.id).then(setData).catch(e => setErr(e.message)), [profile.id]);
  useEffect(() => { reload(); }, [reload]);

  const [top, arg] = route;
  const tab = ['practice', 's', 'writing'].includes(top) ? 'practice' : top === 'progress' ? 'progress' : top === 'help' ? 'help' : 'today';

  const weekend = isWeekend();
  // GCSE: everything closes at weekends. Repair: only lessons do; the tutor and placement check stay open.
  const closed = course.weekendTutor ? ['s', 'practice'] : ['s', 'writing', 'practice', 'help'];
  let body;
  if (weekend && closed.includes(top)) body = (
    <main className="page"><div className="card"><h1>It's the weekend</h1>
      <p>No lessons on Saturdays and Sundays. Rest is part of learning. Everything's back on Monday.</p>
      <a className="btn" href="#/today">OK</a></div></main>);
  else if (!data) body = <main className="page"><p className={err ? 'err' : 'muted'}>{err || 'Loading…'}</p></main>;
  else if (top === 's' && arg) body = <Session key={arg} sessionKey={arg} data={data} onSaved={reload} />;
  else if (top === 'writing') body = <Writing data={data} onSaved={reload} />;
  else if (top === 'practice') body = <Practice data={data} />;
  else if (top === 'progress') body = <Progress profile={profile} data={data} self />;
  else if (top === 'help') body = <Help />;
  else if (top === 'assess' && course.assessment) body = <Assessment onSaved={reload} />;
  else if (top === 'fishing' && course.rewards) body = <FishingPage data={data} />;
  else body = <Today profile={profile} data={data} />;

  const tabs = weekend ? [['today', 'Today'], ['progress', 'Progress'], ...(course.weekendTutor ? [['help', 'Ask']] : [])]
    : [['today', 'Today'], ['practice', 'Practice'], ['progress', 'Progress'], ['help', 'Ask']];
  return <>{banner}{body}<Tabs current={tab} items={tabs} /></>;
}
