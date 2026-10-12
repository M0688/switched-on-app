/* Helpers for writing lesson content. */
export const r = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
export const pick = a => a[r(0, a.length - 1)];
export const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = r(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/** Multiple-choice question from [question, correct, wrong1, wrong2, wrong3, why]. */
export function mc([q, right, ...rest]) {
  const why = rest.pop();
  const o = shuffle([right, ...rest]);
  return { q, o, a: o.indexOf(right), s: why, short: o.every(x => x.length <= 18) };
}

/** A set of 8 from a bank of multiple-choice rows, optionally mixed with generated questions. */
export const fromBank = (bank, n = 8) => () => shuffle(bank).slice(0, n).map(mc);
export const mixed = (bank, gen, nGen = 3) => () => {
  const seen = new Set(), g = [];
  for (let i = 0; g.length < nGen && i < 50; i++) { const x = gen(); if (!seen.has(x.q)) { seen.add(x.q); g.push(x); } }
  return shuffle([...shuffle(bank).slice(0, 8 - g.length).map(mc), ...g]);
};

export const ex = (title, ...lines) => `<div class="work"><span class="eyebrow">${title}</span>${lines.map(l => `<div>${l}</div>`).join('')}</div>`;
export const slip = t => `<p class="slip">${t}</p>`;
export const ul = items => `<ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>`;
export const table = (head, rows) => `<div style="overflow-x:auto"><table class="tbl"><thead><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
