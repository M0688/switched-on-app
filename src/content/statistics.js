/* GCSE Statistics, Week 1 foundations. */
import { r, pick, shuffle, fromBank, mixed, ex, slip, ul, table } from './kit.js';

function list(n, lo, hi) { return Array.from({ length: n }, () => r(lo, hi)); }
const sorted = a => [...a].sort((x, y) => x - y);

function avgQ() {
  const t = r(0, 2);
  if (t === 0) { // mean with integer answer
    for (;;) { const n = r(4, 6), m = r(5, 20), xs = list(n - 1, Math.max(1, m - 7), m + 7); const last = n * m - xs.reduce((a, b) => a + b, 0);
      if (last >= 1 && last <= 40) { xs.push(last); const s = shuffle(xs); return { q: `Find the mean of ${s.join(', ')}`, a: m, s: `Total ${n * m} ÷ ${n} numbers = ${m}` }; } }
  }
  if (t === 1) { // median, odd count
    const n = pick([5, 7]), xs = list(n, 1, 30), so = sorted(xs);
    return { q: `Find the median of ${xs.join(', ')}`, a: so[(n - 1) / 2], s: `In order: ${so.join(', ')}. The middle value is ${so[(n - 1) / 2]}.` };
  }
  for (;;) { // mode with a single mode
    const xs = list(6, 1, 12), c = {}; xs.forEach(x => c[x] = (c[x] || 0) + 1);
    const top = Math.max(...Object.values(c)), modes = Object.keys(c).filter(k => c[k] === top);
    if (top >= 2 && modes.length === 1) return { q: `Find the mode of ${xs.join(', ')}`, a: Number(modes[0]), s: `${modes[0]} appears most often (${top} times).` };
  }
}

function rangeQ() {
  const n = r(5, 7), xs = list(n, 2, 60), so = sorted(xs);
  const ctx = pick(['', 'Test scores: ', 'Minutes late: ', 'Daily temperatures (°C): ']);
  return { q: `${ctx}${xs.join(', ')}. What is the range?`, a: so[n - 1] - so[0], s: `Largest ${so[n - 1]} − smallest ${so[0]} = ${so[n - 1] - so[0]}` };
}

function freqQ() {
  for (;;) {
    const vals = [0, 1, 2, 3, 4], f = vals.map(() => r(1, 9)), total = f.reduce((a, b) => a + b, 0), sum = vals.reduce((a, v, i) => a + v * f[i], 0);
    const tbl = vals.map((v, i) => `${v}: ${f[i]}`).join(' | ');
    const t = r(0, 2);
    if (t === 0) return { q: `Number of pets (value: frequency): ${tbl}. How many people were asked?`, a: total, s: `Add the frequencies: ${f.join(' + ')} = ${total}` };
    if (t === 1) { const mx = Math.max(...f); if (f.filter(x => x === mx).length > 1) continue;
      return { q: `Number of pets (value: frequency): ${tbl}. What is the mode?`, a: vals[f.indexOf(mx)], s: `The value with the highest frequency (${mx}) is ${vals[f.indexOf(mx)]}.` }; }
    if (sum % total) continue;
    return { q: `Number of pets (value: frequency): ${tbl}. Find the mean number of pets.`, a: sum / total, s: `Total pets = ${vals.map((v, i) => `${v}×${f[i]}`).join(' + ')} = ${sum}. People = ${total}. ${sum} ÷ ${total} = ${sum / total}` };
  }
}

function pieQ() {
  const total = pick([30, 36, 40, 60, 72, 90, 120]);
  for (;;) { const f = r(1, total - 1), ang = f / total * 360; if (Number.isInteger(ang)) {
    const what = pick(['chose football', 'travel by bus', 'prefer tea', 'have a dog']);
    return { q: `${total} people were asked. ${f} ${what}. What angle would this be on a pie chart?`, a: ang, u: '°', s: `${f} ÷ ${total} × 360 = ${ang}°` }; } }
}

const S = [
{
  id: 's1', title: 'Types of data', sub: 'Qualitative, quantitative, discrete, continuous',
  lesson: `<p>All data is <b>either</b> qualitative <b>or</b> quantitative. Quantitative data is then <b>either</b> discrete <b>or</b> continuous.</p>
${table(['Type', 'Meaning', 'Example'], [['Qualitative (also called categorical)', 'Words or categories', 'Favourite colour, car make'], ['Quantitative', 'Numbers. Always one of the two below.', 'See below'], ['↳ Discrete', 'Numbers you count (exact values)', 'Shoe size, goals scored'], ['↳ Continuous', 'Numbers you measure (any value in a range)', 'Height, time, weight']])}
<p>So height is quantitative <b>and</b> continuous. If a question offers “continuous”, that is the more exact answer.</p>
<p><b>Primary data</b> is collected by you (a survey you run). <b>Secondary data</b> was collected by someone else (government figures, a website).</p>
${ex('Quick test', 'Can it be any value, like 1.73 m? → continuous', 'Can you only count it, like 3 brothers? → discrete')}
${slip('Shoe size is discrete: you can buy 9 or 9½, but not 9.37.')}`,
  make: fromBank([
    ['Favourite football team is…', 'qualitative', 'quantitative', 'continuous', 'discrete', 'It’s a category, not a number.'],
    ['Number of people in a family is…', 'discrete', 'continuous', 'qualitative', 'secondary', 'You count people: 1, 2, 3…'],
    ['Height of a student is…', 'continuous', 'discrete', 'qualitative', 'categorical', 'Height is measured and can be any value.'],
    ['Time to run 100 m is…', 'continuous', 'discrete', 'qualitative', 'primary only', 'Time is measured.'],
    ['Shoe size is…', 'discrete', 'continuous', 'qualitative', 'secondary', 'Only certain sizes exist.'],
    ['Data you collect yourself is…', 'primary', 'secondary', 'continuous', 'biased', 'Primary = first-hand.'],
    ['Data from a government website is…', 'secondary', 'primary', 'discrete', 'qualitative', 'Someone else collected it.'],
    ['Quantitative data is…', 'numerical', 'in words', 'always continuous', 'always secondary', 'Quantity = how many or how much.'],
    ['Eye colour is…', 'qualitative', 'discrete', 'continuous', 'quantitative', 'It’s a description, not a number.'],
    ['The mass of a parcel is…', 'continuous', 'discrete', 'qualitative', 'categorical', 'Mass is measured.'],
    ['Number of goals in a match is…', 'discrete', 'continuous', 'qualitative', 'secondary', 'You count goals.'],
  ]),
},
{
  id: 's2', title: 'Populations and samples', sub: 'Who to ask, and avoiding bias',
  lesson: `${ul(['The <b>population</b> is everyone (or everything) you want to find out about.', 'A <b>census</b> collects data from the whole population. Accurate, but slow and expensive.', 'A <b>sample</b> is part of the population. Quicker and cheaper.', 'A <b>random sample</b> gives every member an equal chance of being picked.', '<b>Bias</b> is when a sample doesn’t fairly represent the population.'])}
${ex('Example', 'To find how teenagers in Watford travel to college, you only ask people at the bus station.', 'That’s biased: people who drive or walk are left out.')}
<p>A <b>leading question</b> pushes people towards an answer ("Don’t you agree college is great?"). It makes the results biased.</p>
<p>A <b>pilot study</b> is a small trial run of a survey, to find problems before the real thing.</p>
${slip('A bigger sample is usually more reliable, but only if it’s chosen fairly.')}`,
  make: fromBank([
    ['Asking every single person in the population is a…', 'census', 'sample', 'pilot', 'bias', 'A census covers everyone.'],
    ['Why use a sample instead of a census?', 'It’s quicker and cheaper', 'It’s always more accurate', 'It includes everyone', 'It’s required by law', 'Samples save time and money.'],
    ['In a random sample, every member…', 'has an equal chance of being picked', 'is picked to take part in the survey', 'is over 18 years old', 'chooses themselves whether to take part', 'That’s what makes it fair.'],
    ['Asking only people at a gym how often they exercise is…', 'biased', 'random', 'a census', 'secondary data', 'Gym-goers exercise more than most people.'],
    ['The population is…', 'the whole group you want to know about', 'everyone in the UK, whatever the question', 'only the people you actually asked', 'the answers people gave you', 'It depends on your question.'],
    ['Which sample is likely to be more reliable?', '100 people chosen at random', '5 friends', '20 people in one shop', 'Only your family', 'Larger and random is better.'],
    ['A survey question "Don’t you agree college is great?" is…', 'a leading (biased) question', 'a fair question', 'a census', 'random', 'It pushes people towards an answer.'],
    ['One way to pick a random sample is…', 'number everyone and use a random number generator', 'ask the first people you see in the street that day', 'ask your friends and their friends to take part', 'ask for volunteers to put their names forward', 'Random number generators give everyone an equal chance.'],
    ['A small trial run of a survey is called a…', 'pilot study', 'census', 'population', 'bias', 'It helps fix problems before the real survey.'],
    ['A sample that leaves out a group is…', 'biased', 'random', 'complete', 'a census', 'It won’t represent the whole population.'],
  ]),
},
{
  id: 's3', title: 'Mode, median and mean', sub: 'Three kinds of average',
  lesson: `${ul(['<b>Mode:</b> the most common value.', '<b>Median:</b> the middle value once they’re in order.', '<b>Mean:</b> add them all up, divide by how many.'])}
${ex('Worked example: 3, 7, 2, 7, 6', 'Mode: 7 (appears twice)', 'Median: in order 2, 3, 6, 7, 7 → middle is 6', 'Mean: 3 + 7 + 2 + 7 + 6 = 25, then 25 ÷ 5 = 5')}
${slip('Always put the numbers in order before finding the median.')}`,
  make: mixed([
    ['The median is…', 'the middle value in order', 'the most common value', 'the total divided by how many', 'biggest minus smallest', 'Order first, then find the middle.'],
    ['The mode is…', 'the most common value', 'the middle value', 'the average of the ends', 'the total', 'Mode = most.'],
    ['Which average is affected most by one extreme value?', 'Mean', 'Median', 'Mode', 'None of them', 'One huge value pulls the mean up.'],
    ['For "favourite colour", which average can you use?', 'Mode', 'Mean', 'Median', 'All three', 'You can’t add or order colours.'],
  ], avgQ, 6),
},
{
  id: 's4', title: 'Range and spread', sub: 'How spread out data is',
  lesson: `<p>The <b>range</b> is the <b>biggest value minus the smallest</b>. It tells you how spread out the data is.</p>
${ex('Worked example', 'Scores: 12, 18, 9, 15, 20', 'Range = 20 − 9 = <b>11</b>')}
<p>When comparing two sets of data, compare <b>an average</b> (which is higher on the whole) and <b>the range</b> (which is more consistent).</p>
${ex('Comparing', 'Sam: mean 14, range 3. Ali: mean 15, range 12.', 'Ali scored higher on average. Sam was more consistent (smaller range).')}
${slip('Range is one number: 11, not "9 to 20".')}`,
  make: mixed([
    ['A smaller range means the data is…', 'more consistent', 'higher', 'lower', 'wrong', 'Values are closer together.'],
    ['Range is…', 'largest minus smallest', 'largest plus smallest', 'the middle value', 'the most common value', 'It measures spread.'],
    ['To compare two teams’ scores fairly, compare…', 'an average and the range', 'only the highest score', 'only the lowest score', 'the number of players', 'One tells you level, the other consistency.'],
  ], rangeQ, 6),
},
{
  id: 's5', title: 'Frequency tables', sub: 'Organising data and finding averages from tables',
  lesson: `<p>A <b>frequency table</b> shows how many times each value appears.</p>
<p>You often count with <b>tally marks</b>, grouped in fives: four lines, then a fifth line across them, which makes 5.</p>
${table(['Pets', 'Frequency'], [['0', '4'], ['1', '6'], ['2', '3'], ['3', '2']])}
${ex('From the table above', 'Total people: 4 + 6 + 3 + 2 = 15', 'Mode: 1 pet (highest frequency, 6)', 'Mean: (0×4 + 1×6 + 2×3 + 3×2) ÷ 15 = 18 ÷ 15 = 1.2')}
${slip('The mode is the value (1 pet), not the frequency (6).')}`,
  make: mixed([
    ['In a frequency table, the frequency is…', 'how many times a value appears', 'the value itself', 'the total of all the values', 'the mean of the values', 'Frequency = how often.'],
    ['Tally marks are grouped in…', 'fives', 'tens', 'twos', 'threes', 'Four lines and one across makes five.'],
  ], freqQ, 6),
},
{
  id: 's6', title: 'Charts', sub: 'Bar charts and pie charts',
  lesson: `${ul(['<b>Bar charts</b> compare amounts in categories. Bars should be equal width with gaps between.', '<b>Pie charts</b> show proportions of a whole. The whole circle is 360°.', '<b>Line graphs</b> show how something changes over time (e.g. temperature through a day).'])}
${ex('Pie chart angle', '60 people asked; 15 chose tea.', 'Angle = 15 ÷ 60 × 360 = <b>90°</b>')}
${slip('Check your pie chart angles add up to 360°.')}`,
  make: mixed([
    ['A full pie chart is…', '360°', '180°', '100°', '90°', 'A full turn.'],
    ['Pie charts are best for showing…', 'proportions of a whole', 'change over time', 'exact values', 'a single number', 'Each slice is a share.'],
    ['Bars in a bar chart for categories should…', 'be equal width with gaps', 'touch each other', 'be different widths', 'be in 3D', 'Gaps show the categories are separate.'],
    ['A line graph is best for showing…', 'change over time', 'favourite colours', 'shares of a whole', 'a single value', 'e.g. temperature through a day.'],
  ], pieQ, 5),
},
];

export default S;
