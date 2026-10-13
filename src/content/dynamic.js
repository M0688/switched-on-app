/* Lessons stored in the database (added weekly by a scheduled task) are appended after the
   built-in lessons for each subject, in whichever course owns that subject. Repair rows also carry
   `level` (1 core, 2 bench, 3 advanced). Format of each row's `questions` (at least 8, ideally 12-15):
     { "type": "mc", "q": "...", "options": ["...", "..."], "answer": 0, "why": "...", "passage": "optional" }
     { "type": "number", "q": "...", "answer": 12.5, "unit": "m", "unit_before": false, "why": "..." } */
import { COURSES } from './courses.js';
import { PREFIX as REPAIR_PREFIX } from './repair/index.js';
import { shuffle } from './kit.js';

const PREFIX = { maths: 'm', english: 'e', science: 'sc', statistics: 'st', business: 'b', electrical: 'el', ...REPAIR_PREFIX };
const ownerOf = subject => Object.values(COURSES).find(c => c.subjects[subject]);
const ALLOWED = new Set(['P', 'B', 'I', 'EM', 'STRONG', 'UL', 'OL', 'LI', 'DIV', 'SPAN', 'H3', 'TABLE', 'THEAD', 'TBODY', 'TR', 'TH', 'TD', 'BR', 'SUP', 'SUB']);
const CLASSES = new Set(['work', 'eyebrow', 'slip', 'tbl', 'x', 'y', 'muted', 'small']);

/** Keeps only simple formatting tags and the app's own classes. */
export function sanitize(html) {
  if (typeof DOMParser === 'undefined') return String(html).replace(/<[^>]*>/g, '');
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html');
  const walk = el => {
    for (const child of [...el.children]) {
      if (!ALLOWED.has(child.tagName)) { child.replaceWith(...child.childNodes); continue; }
      for (const a of [...child.attributes]) {
        if (a.name !== 'class') child.removeAttribute(a.name);
        else child.setAttribute('class', a.value.split(/\s+/).filter(c => CLASSES.has(c)).join(' '));
      }
      walk(child);
    }
  };
  const root = doc.body.firstElementChild;
  walk(root); walk(root); // second pass catches children lifted out of removed tags
  return root.innerHTML;
}

const str = x => typeof x === 'string' && x.trim().length > 0;
function valid(q) {
  if (!q || !str(q.q) || !str(q.why)) return false;
  if (q.type === 'mc') return Array.isArray(q.options) && q.options.length >= 2 && q.options.length <= 5
    && q.options.every(str) && new Set(q.options).size === q.options.length && Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length;
  if (q.type === 'number') return typeof q.answer === 'number' && Number.isFinite(q.answer);
  return false;
}
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function toQuestion(q) {
  if (q.type === 'mc') {
    const right = q.options[q.answer];
    const o = shuffle(q.options);
    return { q: q.q, o, a: o.indexOf(right), s: q.why, short: o.every(x => x.length <= 18), p: str(q.passage) ? esc(q.passage) : undefined };
  }
  return { q: q.q, a: q.answer, u: str(q.unit) ? q.unit : undefined, pre: !!q.unit_before, s: q.why };
}

export function addLessons(rows) {
  let added = 0;
  for (const row of [...rows].sort((a, b) => a.position - b.position)) {
    const course = ownerOf(row.subject);
    const subj = course?.subjects[row.subject];
    if (!subj) continue;
    const key = `${PREFIX[row.subject]}-d${row.position}`;
    if (subj.sessions.some(s => s.key === key)) continue;
    const qs = (Array.isArray(row.questions) ? row.questions : []).filter(valid);
    if (qs.length < 8) continue;
    const session = {
      id: 'd' + row.position, key, subject: row.subject, title: row.title, sub: row.sub ?? '',
      lesson: sanitize(row.lesson_html), make: () => shuffle(qs).slice(0, 8).map(toQuestion),
    };
    if ([1, 2, 3].includes(row.level)) session.level = row.level;
    subj.sessions.push(session); course.all.push(session); added++;
  }
  return added;
}
