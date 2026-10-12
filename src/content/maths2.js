/* Maths, Week 2: number skills and core Foundation topics. */
import { r, pick, ex, slip, ul } from './kit.js';

const fmtNeg = n => (n < 0 ? '−' + Math.abs(n) : String(n));
const money = n => '£' + n.toFixed(2);
const gcd = (a, b) => b ? gcd(b, a % b) : a;

export default [
{
  id: 's7', title: 'Negative numbers', sub: 'Adding, subtracting and multiplying below zero',
  lesson: `<p>Picture a number line, or a thermometer. Going <b>up</b> is adding; going <b>down</b> is subtracting.</p>
${ul(['Subtracting a negative is the same as adding: 5 − (−3) = 5 + 3 = 8', 'Adding a negative is the same as subtracting: 4 + (−6) = 4 − 6 = −2', 'Multiplying or dividing: same signs give a positive, different signs give a negative'])}
${ex('Worked example', 'The freezer is at −8°C. It warms up by 11 degrees.', '−8 + 11 = <b>3°C</b>')}
${ex('Worked example', '−4 × −3', 'Same signs, so positive: <b>12</b>')}
${slip('Type a negative answer with a minus sign, e.g. -5.')}`,
  gen() {
    const t = r(0, 4);
    if (t === 0) { const a = -r(2, 12), b = r(3, 20); return { q: `The temperature is ${fmtNeg(a)}°C. It rises by ${b} degrees. What is it now? (°C)`, a: a + b, s: `${fmtNeg(a)} + ${b} = ${fmtNeg(a + b)}` }; }
    if (t === 1) { const a = r(-10, 10), b = r(2, 15); return { q: `Work out ${fmtNeg(a)} − ${b}`, a: a - b, s: `Go down ${b} from ${fmtNeg(a)}: ${fmtNeg(a - b)}` }; }
    if (t === 2) { const a = r(-9, 9), b = r(2, 9); return { q: `Work out ${fmtNeg(a)} − (−${b})`, a: a + b, s: `Subtracting a negative is adding: ${fmtNeg(a)} + ${b} = ${fmtNeg(a + b)}` }; }
    if (t === 3) { const a = r(2, 9) * pick([-1, 1]), b = r(2, 9) * pick([-1, 1]); return { q: `Work out ${fmtNeg(a)} × ${b < 0 ? '(' + fmtNeg(b) + ')' : b}`, a: a * b, s: `${(a < 0) === (b < 0) ? 'Same signs give a positive' : 'Different signs give a negative'}: ${fmtNeg(a * b)}` }; }
    const b = r(2, 9), q = r(2, 9) * pick([-1, 1]), a = b * q * -1; return { q: `Work out ${fmtNeg(a)} ÷ (−${b})`, a: a / -b, s: `${(a < 0) ? 'Same signs give a positive' : 'Different signs give a negative'}: ${fmtNeg(a / -b)}` };
  },
},
{
  id: 's8', title: '× and ÷ by 10, 100, 1000', sub: 'Moving digits, not the decimal point',
  lesson: `<p>Multiplying by 10 makes a number <b>ten times bigger</b>: every digit moves one place to the left. Dividing by 10 moves every digit one place to the right.</p>
${ul(['× 10: one place left. × 100: two places. × 1000: three places.', '÷ does the same to the right.', 'Fill empty places with zeros.'])}
${ex('Worked examples', '3.7 × 100 = <b>370</b>', '45 ÷ 1000 = <b>0.045</b>', 'A cable reel holds 50 m. 100 reels = 50 × 100 = <b>5000 m</b>')}
${slip('Don’t just "add a zero": 3.7 × 10 is 37, not 3.70.')}`,
  gen() {
    const p = pick([10, 100, 1000]);
    if (r(0, 1)) { const n = pick([r(2, 99), r(11, 99) / 10, r(101, 999) / 100]); const a = Math.round(n * p * 1000) / 1000; return { q: `Work out ${n} × ${p}`, a, s: `Move the digits ${String(p).length - 1} place${p > 10 ? 's' : ''} left: ${a}` }; }
    const n = pick([r(2, 999), r(11, 99) / 10]); const a = Math.round(n / p * 100000) / 100000; return { q: `Work out ${n} ÷ ${p}`, a, s: `Move the digits ${String(p).length - 1} place${p > 10 ? 's' : ''} right: ${a}` };
  },
},
{
  id: 's9', title: 'Long multiplication', sub: 'Multiplying bigger numbers without a calculator',
  lesson: `<p>Split the second number into tens and units, multiply by each, then add.</p>
${ex('Worked example: 34 × 26', '34 × 6 = 204', '34 × 20 = 680', '204 + 680 = <b>884</b>')}
<p>The grid method does the same thing: split both numbers, multiply each pair, add the four answers.</p>
${ex('Grid method: 34 × 26', '30 × 20 = 600, 30 × 6 = 180', '4 × 20 = 80, 4 × 6 = 24', '600 + 180 + 80 + 24 = <b>884</b>')}
${slip('Estimate first: 34 × 26 is about 30 × 30 = 900. If your answer is miles off, check again.')}`,
  gen() {
    const a = r(12, 89), b = r(12, 49);
    const ctx = pick([null, 'cable']);
    if (ctx) return { q: `A job needs ${b} lengths of cable, each ${a} cm long. How many cm is that in total?`, a: a * b, u: 'cm', s: `${a} × ${b}: ${a} × ${b % 10} = ${a * (b % 10)}, ${a} × ${b - b % 10} = ${a * (b - b % 10)}, total ${a * b}` };
    return { q: `Work out ${a} × ${b}`, a: a * b, s: `${a} × ${b % 10} = ${a * (b % 10)}; ${a} × ${b - b % 10} = ${a * (b - b % 10)}; ${a * (b % 10)} + ${a * (b - b % 10)} = ${a * b}` };
  },
},
{
  id: 's10', title: 'Short division', sub: 'The bus stop method',
  lesson: `<p>Divide one digit at a time from the left. Carry any remainder to the next digit.</p>
${ex('Worked example: 852 ÷ 4', '8 ÷ 4 = 2', '5 ÷ 4 = 1 remainder 1, carry the 1 to make 12', '12 ÷ 4 = 3', 'Answer: <b>213</b>')}
${ex('With money', 'Share £378 between 6 people: 378 ÷ 6', '37 ÷ 6 = 6 r 1, then 18 ÷ 6 = 3', 'Answer: <b>£63</b> each')}
${slip('Check by multiplying back: 213 × 4 = 852 ✓')}`,
  gen() {
    const d = r(3, 9), q = r(21, 199), n = d * q;
    if (r(0, 1)) return { q: `Work out ${n} ÷ ${d}`, a: q, s: `${n} ÷ ${d} = ${q}. Check: ${q} × ${d} = ${n}` };
    return { q: `£${n} is shared equally between ${d} people. How much does each get?`, a: q, u: '£', pre: true, s: `${n} ÷ ${d} = ${q}. Check: ${q} × ${d} = ${n}` };
  },
},
{
  id: 's11', title: 'Fractions of amounts', sub: 'Divide by the bottom, times by the top',
  lesson: `<p>To find a fraction of an amount: <b>divide by the bottom number</b>, then <b>multiply by the top number</b>.</p>
${ex('Worked example: ¾ of 40', '40 ÷ 4 = 10 (one quarter)', '10 × 3 = <b>30</b> (three quarters)')}
<p><b>Equivalent fractions</b> are the same amount written differently: ½ = 2/4 = 4/8. Multiply or divide top and bottom by the same number.</p>
${slip('To simplify, divide top and bottom by the biggest number that goes into both: 6/8 → 3/4.')}`,
  gen() {
    const t = r(0, 2);
    if (t < 2) {
      const den = pick([2, 3, 4, 5, 6, 8, 10]); let num = r(1, den - 1); while (gcd(num, den) > 1) num = r(1, den - 1);
      const n = den * r(2, 15);
      const thing = pick(['', ' metres of cable', ' screws', ' pounds']);
      return { q: `Work out ${num}/${den} of ${n}${thing}`, a: n / den * num, s: `${n} ÷ ${den} = ${n / den}, then × ${num} = ${n / den * num}` };
    }
    const den = pick([4, 6, 8, 10, 12]), f = r(2, 5); let num = r(1, den - 1); while (gcd(num, den) > 1) num = r(1, den - 1);
    return { q: `${num}/${den} = ?/${den * f}. What is the missing number?`, a: num * f, s: `${den} × ${f} = ${den * f}, so the top is ${num} × ${f} = ${num * f}` };
  },
},
{
  id: 's12', title: 'Percentages of amounts', sub: 'Using 10%, 5% and 1%',
  lesson: `<p>Build any percentage from easy pieces:</p>
${ul(['<b>50%</b> = halve it', '<b>25%</b> = quarter it', '<b>10%</b> = divide by 10', '<b>5%</b> = half of 10%', '<b>1%</b> = divide by 100'])}
${ex('Worked example: 35% of £240', '10% = £24, so 30% = £72', '5% = £12', '35% = 72 + 12 = <b>£84</b>')}
${ex('Price rise', 'A drill costs £60. The price goes up 20%.', '10% = £6, 20% = £12', 'New price = 60 + 12 = <b>£72</b>')}`,
  gen() {
    const t = r(0, 2);
    const p = pick([10, 20, 25, 30, 5, 15, 35, 40, 50, 75]);
    const n = pick([40, 60, 80, 120, 160, 200, 240, 300, 360, 400, 500]);
    const ans = n * p / 100;
    if (t === 0) return { q: `Work out ${p}% of £${n}`, a: ans, u: '£', pre: true, s: `10% of ${n} = ${n / 10}. ${p}% = ${ans}` };
    if (t === 1) return { q: `A tool costs £${n}. It goes up by ${p}%. What is the new price?`, a: n + ans, u: '£', pre: true, s: `${p}% of ${n} = ${ans}. ${n} + ${ans} = ${n + ans}` };
    return { q: `A tool costs £${n}. It is reduced by ${p}% in a sale. What is the sale price?`, a: n - ans, u: '£', pre: true, s: `${p}% of ${n} = ${ans}. ${n} − ${ans} = ${n - ans}` };
  },
},
{
  id: 's13', title: 'Solving equations', sub: 'Doing the same to both sides',
  lesson: `<p>An equation is a balance. Whatever you do to one side, do to the other, until the letter is on its own.</p>
${ul(['Undo + with −, and − with +', 'Undo × with ÷, and ÷ with ×', 'Undo the + or − first, then the × or ÷'])}
${ex('Worked example: 4x − 5 = 23', 'Add 5 to both sides: 4x = 28', 'Divide both sides by 4: <b>x = 7</b>', 'Check: 4 × 7 − 5 = 23 ✓')}
${slip('Always check by putting your answer back in.')}`,
  gen() {
    const x = r(2, 15), t = r(0, 3);
    if (t === 0) { const c = r(3, 30); return { q: `Solve x + ${c} = ${x + c}`, a: x, s: `Subtract ${c} from both sides: x = ${x}` }; }
    if (t === 1) { const m = r(2, 9); return { q: `Solve ${m}x = ${m * x}`, a: x, s: `Divide both sides by ${m}: x = ${x}` }; }
    if (t === 2) { const m = r(2, 9), c = r(1, 20); return { q: `Solve ${m}x + ${c} = ${m * x + c}`, a: x, s: `Subtract ${c}: ${m}x = ${m * x}. Divide by ${m}: x = ${x}` }; }
    const m = r(2, 9), c = r(1, Math.min(20, m * x - 1)); return { q: `Solve ${m}x − ${c} = ${m * x - c}`, a: x, s: `Add ${c}: ${m}x = ${m * x}. Divide by ${m}: x = ${x}` };
  },
},
{
  id: 's14', title: 'Rounding and estimating', sub: 'Decimal places and significant figures',
  lesson: `<p>Look at the digit <b>just after</b> where you’re rounding to. 5 or more: round up. 4 or less: round down.</p>
${ul(['To the nearest 10: 47 → 50', 'To 1 decimal place: 3.46 → 3.5', 'To 1 significant figure (the first non-zero digit): 382 → 400, 0.0476 → 0.05'])}
${ex('Estimating', '48.7 × 3.1 ≈ 50 × 3 = <b>150</b>', 'Round each number to 1 significant figure, then work it out.')}
${slip('Rounding 382 to 1 significant figure gives 400, not 4. Keep the zeros to hold the place.')}`,
  gen() {
    const t = r(0, 3);
    if (t === 0) { const n = r(101, 999); const a = Math.round(n / 10) * 10; return { q: `Round ${n} to the nearest 10`, a, s: `Look at the units digit (${n % 10}): ${a}` }; }
    if (t === 1) { const n = r(1001, 9999) / 1000; const a = Math.round(n * 10) / 10; return { q: `Round ${n} to 1 decimal place`, a, s: `Look at the second decimal place: ${a}` }; }
    if (t === 2) { const n = r(120, 980); const mag = 100; const a = Math.round(n / mag) * mag; return { q: `Round ${n} to 1 significant figure`, a, s: `The first digit is in the hundreds. Look at the tens digit: ${a}` }; }
    const a = r(2, 9) * 10 + r(1, 4), b = r(2, 9) + pick([0.1, 0.2, 0.3]); const ea = Math.round(a / 10) * 10, eb = Math.round(b);
    return { q: `Estimate ${a} × ${b} by rounding each number to 1 significant figure`, a: ea * eb, s: `${a} ≈ ${ea} and ${b} ≈ ${eb}. ${ea} × ${eb} = ${ea * eb}` };
  },
},
{
  id: 's15', title: 'Area and perimeter', sub: 'Rectangles, triangles and L-shapes',
  lesson: `${ul(['<b>Perimeter</b> is the distance all the way round: add up every side.', '<b>Area of a rectangle</b> = length × width (in cm² or m²)', '<b>Area of a triangle</b> = base × height ÷ 2'])}
${ex('Worked example', 'A room is 5 m by 4 m.', 'Perimeter = 5 + 4 + 5 + 4 = <b>18 m</b> (handy for working out cable or skirting)', 'Area = 5 × 4 = <b>20 m²</b> (handy for flooring)')}
${slip('Area units are squared (m²). Perimeter units are not (m).')}`,
  gen() {
    const t = r(0, 3), a = r(3, 15), b = r(2, 12);
    if (t === 0) return { q: `A rectangle is ${a} cm by ${b} cm. What is its perimeter?`, a: 2 * (a + b), u: 'cm', s: `${a} + ${b} + ${a} + ${b} = ${2 * (a + b)} cm` };
    if (t === 1) return { q: `A room is ${a} m by ${b} m. What is its floor area?`, a: a * b, u: 'm²', s: `${a} × ${b} = ${a * b} m²` };
    if (t === 2) { const base = r(2, 10) * 2, h = r(3, 12); return { q: `A triangle has base ${base} cm and height ${h} cm. What is its area?`, a: base * h / 2, u: 'cm²', s: `${base} × ${h} ÷ 2 = ${base * h / 2} cm²` }; }
    return { q: `A cable runs round the edge of a ${a} m by ${b} m room. How long is it?`, a: 2 * (a + b), u: 'm', s: `Perimeter = 2 × (${a} + ${b}) = ${2 * (a + b)} m` };
  },
},
];
