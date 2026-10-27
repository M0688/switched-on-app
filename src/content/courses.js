/* Each user follows one course. Mason: GCSE (default). Mitchell: circuit board repair. */
import * as gcse from './index.js';
import * as repair from './repair/index.js';
import { placement, isAssessment } from './repair/assessment.js';

const same = subjects => () => subjects;

export const COURSES = {
  gcse: {
    id: 'gcse', name: 'GCSE', subjects: gcse.SUBJECTS, schedule: gcse.SCHEDULE, all: gcse.ALL,
    planSubjects: same(gcse.SUBJECTS), rewards: true, assessment: false, dayWord: 'school day',
    lessonMinutes: 20, extraPractice: 'Extra practice doesn’t earn fishing time.',
    weekendTutor: false,
  },
  repair: {
    id: 'repair', name: 'Circuit board repair', subjects: repair.SUBJECTS, schedule: repair.SCHEDULE, all: repair.ALL,
    planSubjects: repair.planSubjects, rewards: false, assessment: true, dayWord: 'weekday',
    lessonMinutes: 15, extraPractice: 'Lessons below your placement level are open here too.',
    weekendTutor: true, levels: repair.LEVELS,
  },
};

export const courseFor = id => COURSES[id] ?? COURSES.gcse;
export const findSession = (course, key) => course.all.find(s => s.key === key);
export const lessonAttempts = attempts => attempts.filter(a => !isAssessment(a));
export { placement, isAssessment };

/** Lessons below the user's placement level: open as extra practice, not part of the plan. */
export function isSkipped(course, attempts, key) {
  if (!course.assessment) return false;
  const plan = course.planSubjects(attempts);
  const s = findSession(course, key);
  return !!s && !plan[s.subject].sessions.includes(s);
}
