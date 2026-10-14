/* Circuit board repair, Monday track: fundamentals and components.
   level: 1 = core, 2 = bench technician, 3 = advanced. */
import { fromBank, mixed, ex, slip, ul, table, r, pick } from '../kit.js';

const round = x => Math.round(x * 1e6) / 1e6;

function ohmGen() {
  const t = r(0, 3);
  if (t === 0) {
    const V = pick([5, 12, 24]), I = pick([1, 2, 4, 5, 10, 20]);
    const R = V * 1000 / I;
    return { q: `A ${V} V rail should draw ${I} mA through a single resistor. What resistance is needed?`, a: R, u: 'Ω', s: `R = V ÷ I = ${V} ÷ ${I / 1000} = ${R} Ω` };
  }
  if (t === 1) {
    const I = pick([0.1, 0.2, 0.5]), R = pick([10, 22, 47, 100]);
    const P = round(I * I * R);
    return { q: `${I * 1000} mA flows through a ${R} Ω resistor. How much power does it dissipate?`, a: P, u: 'W', s: `P = I² × R = ${I}² × ${R} = ${P} W` };
  }
  if (t === 2) {
    const [r1, r2] = pick([[10, 10], [30, 10], [20, 10], [10, 20], [10, 30]]);
    const out = round(12 * r2 / (r1 + r2));
    return { q: `A divider from 12 V has R1 = ${r1} kΩ on top and R2 = ${r2} kΩ to ground. What is the output voltage?`, a: out, u: 'V', s: `Vout = Vin × R2 ÷ (R1 + R2) = 12 × ${r2} ÷ ${r1 + r2} = ${out} V` };
  }
  const R = pick([100, 220, 470, 1000, 4700]), n = pick([2, 2, 4]);
  return { q: `${n} identical ${R} Ω resistors are connected in parallel. What is the total resistance?`, a: round(R / n), u: 'Ω', s: `Equal resistors in parallel: ${R} ÷ ${n} = ${round(R / n)} Ω` };
}

function ldoGen() {
  const vin = pick([5, 12]), vout = pick([3.3, 1.8, 1.2]), I = pick([0.1, 0.2, 0.5, 1]);
  const P = round((vin - vout) * I);
  return { q: `An LDO drops ${vin} V to ${vout} V while supplying ${I} A. How much power does it turn into heat?`, a: P, u: 'W', s: `P = (Vin − Vout) × I = (${vin} − ${vout}) × ${I} = ${P} W` };
}

export default [
{
  id: 'b1', level: 1, title: 'Ohm’s law on a board', sub: 'Voltage, current, power, series and parallel',
  lesson: `<p>Almost every reading you take on a board comes back to three formulas:</p>
${table(['Formula', 'Use it for'], [['V = I × R', 'Voltage across a part'], ['I = V ÷ R', 'Current through a part'], ['P = V × I = I² × R', 'Heat a part has to get rid of']])}
<h3>Series and parallel</h3>
${ul(['<b>Series:</b> one path, same current everywhere, resistances add.', '<b>Parallel:</b> same voltage across each branch. Two equal resistors give half the value; otherwise use product ÷ sum.', '<b>Voltage divider:</b> Vout = Vin × R2 ÷ (R1 + R2). Used for feedback, reference and detect circuits everywhere.'])}
<p>Why this matters at the bench: a healthy rail has resistance to ground set by everything on it. A shorted part drops that to near zero, and the supply pours current into it (I = V ÷ R). That’s what blows fuses, burns tracks and makes the faulty part heat up so you can find it.</p>
${ex('Worked example', '3.3 V rail, normally about 400 Ω to ground', 'Now reads 0.3 Ω', 'At 3.3 V that’s 3.3 ÷ 0.3 = 11 A. The supply current-limits and the rail collapses.')}
${slip('Watch your prefixes: 4.7 kΩ is 4700 Ω, and 50 mA is 0.05 A. Most wrong answers come from a slipped prefix.')}`,
  make: mixed([
    ['A 5 V rail feeds a 1 kΩ resistor. What current flows?', '5 mA', '5 A', '0.2 mA', '50 mA', 'I = V ÷ R = 5 ÷ 1000 = 0.005 A = 5 mA.'],
    ['Two 10 kΩ resistors in parallel give:', '5 kΩ', '20 kΩ', '10 kΩ', '100 kΩ', 'Equal resistors in parallel: divide one value by how many there are.'],
    ['In a series circuit, the current is…', 'the same through every part', 'split between the parts', 'highest at the end', 'zero at the resistor', 'One path, so the same current everywhere.'],
    ['Components in parallel share the same…', 'voltage', 'current', 'resistance', 'power', 'Parallel branches sit across the same two nodes, so they see the same voltage.'],
    ['A 0.125 W, 100 Ω resistor carries 50 mA. Is it within its rating?', 'No: it dissipates 0.25 W', 'Yes: it dissipates 0.05 W', 'Yes: exactly 0.125 W', 'No: it dissipates 5 W', 'P = I² × R = 0.05² × 100 = 0.25 W, double its rating.'],
    ['A 3.3 V rail that normally reads about 400 Ω to ground now reads 0.3 Ω. This suggests…', 'a short on that rail', 'a healthy rail', 'an open circuit', 'a flat battery', 'A big drop from its normal value usually means a failed part is shorting the rail.'],
    ['A divider has R1 = 10 kΩ (top) and R2 = 10 kΩ (bottom) from 12 V. The output is:', '6 V', '12 V', '3 V', '0 V', 'Vout = 12 × 10 ÷ 20 = 6 V.'],
    ['Which formula gives power from current and resistance?', 'P = I² × R', 'P = I ÷ R', 'P = R ÷ I²', 'P = V × R', 'P = V × I, and V = I × R, so P = I² × R.'],
    ['You measure 12 V across a 4 Ω load. The current is:', '3 A', '48 A', '0.33 A', '16 A', 'I = V ÷ R = 12 ÷ 4 = 3 A.'],
    ['1 mA is the same as:', '0.001 A', '0.1 A', '1000 A', '0.01 A', 'Milli means one thousandth.'],
    ['A 10 Ω and a 22 Ω resistor in series total:', '32 Ω', '6.9 Ω', '12 Ω', '220 Ω', 'Series resistances simply add.'],
    ['A rail’s supply current-limits as soon as you power it. Ohm’s law says the rail’s resistance to ground is…', 'very low', 'very high', 'exactly normal', 'infinite', 'A low R needs a huge I at the rail voltage, so the supply hits its limit.'],
  ], ohmGen, 3),
},
{
  id: 'b2', level: 1, title: 'Reading component markings', sub: 'Resistor and capacitor codes, polarity marks',
  lesson: `<h3>SMD resistors</h3>
${table(['Marking', 'How to read it', 'Value'], [['103', 'Two digits, then that many zeros', '10 kΩ'], ['1002', 'Three digits, then that many zeros (usually 1%)', '10 kΩ'], ['4R7', 'R is the decimal point', '4.7 Ω'], ['01C', 'EIA-96: code 01 = 100, C = ×100', '10 kΩ'], ['000 or 0', 'Zero-ohm link', '0 Ω']])}
<h3>Capacitors</h3>
<p>Codes are in <b>picofarads</b>: 104 = 10 × 10⁴ pF = 100 000 pF = <b>100 nF</b>. 105 = 1 µF. Most small SMD ceramics are <b>unmarked</b>, so you need the schematic, boardview, or an LCR meter on the removed part.</p>
<h3>Polarity</h3>
${ul(['<b>Aluminium electrolytic:</b> the stripe marks <b>negative</b>.', '<b>SMD tantalum:</b> the bar marks <b>positive</b>. The opposite way round, and fitting one backwards can make it fail short or burn.', '<b>Diodes:</b> the band is the <b>cathode</b>, matching the bar on the symbol.'])}
${ex('Colour bands', 'Brown (1), black (0), red (×100), gold (±5%)', '= 1000 Ω = 1 kΩ ±5%')}
${slip('Never fit a tantalum by copying the stripe habit from electrolytics. Check the bar and the silkscreen.')}`,
  make: fromBank([
    ['An SMD resistor is marked 103. Its value is:', '10 kΩ', '103 Ω', '1 kΩ', '100 kΩ', '10 followed by 3 zeros: 10 000 Ω.'],
    ['An SMD resistor is marked 4R7. Its value is:', '4.7 Ω', '47 Ω', '4.7 kΩ', '470 Ω', 'R marks the decimal point.'],
    ['An SMD resistor is marked 1002. Its value is:', '10 kΩ', '1 kΩ', '100 kΩ', '1002 Ω', '4-digit code: 100 followed by 2 zeros = 10 000 Ω.'],
    ['A capacitor is marked 104. Its value is:', '100 nF', '104 pF', '10 nF', '1 µF', '10 × 10⁴ pF = 100 000 pF = 100 nF.'],
    ['On an SMD tantalum capacitor, the bar marks…', 'the positive end', 'the negative end', 'the voltage rating', 'nothing', 'The opposite of an aluminium electrolytic. Reversed tantalums can fail short or burn.'],
    ['On an aluminium electrolytic capacitor, the stripe marks…', 'the negative lead', 'the positive lead', 'the date code', 'the tolerance', 'The stripe, often with minus signs, marks negative.'],
    ['The band on a diode marks…', 'the cathode', 'the anode', 'the gate', 'pin 1', 'It matches the bar on the diode symbol.'],
    ['A resistor marked 000 is…', 'a zero-ohm link', 'a blown resistor', 'an unmarked capacitor', 'a 1 MΩ resistor', 'Zero-ohm links act as jumpers and options, and sometimes as cheap fuses.'],
    ['Colour bands brown, black, red, gold mean:', '1 kΩ ±5%', '102 Ω ±5%', '10 kΩ ±5%', '100 Ω ±10%', 'Brown 1, black 0, red ×100 = 1000 Ω; gold ±5%.'],
    ['Why are most small SMD ceramic capacitors hard to identify?', 'They are usually unmarked', 'They are always black', 'They use colour bands', 'Their codes are in hex', 'Use the schematic, the boardview, or an LCR meter out of circuit.'],
    ['Capacitor code 105 means:', '1 µF', '105 pF', '10 nF', '100 µF', '10 × 10⁵ pF = 1 000 000 pF = 1 µF.'],
    ['An EIA-96 code like 01C uses…', 'a number for the value and a letter for the multiplier', 'three colour bands printed around the body', 'a letter for the value and a number for tolerance', 'a maker’s part number you look up online', 'Codes 01–96 are 1% values (01 = 100); C means ×100, so 01C = 10 kΩ.'],
  ]),
},
{
  id: 'b3', level: 2, title: 'Capacitors in real circuits', sub: 'MLCC, electrolytic, tantalum; how they fail',
  lesson: `${table(['Type', 'Where you find it', 'How it fails'], [['Ceramic (MLCC)', 'Everywhere: decoupling and filtering on every rail', 'Cracks from flex, drops or heat; often fails <b>short</b>'], ['Aluminium electrolytic', 'Power supplies, TVs, consoles, older boards', 'Dries out: ESR rises, capacitance falls, may bulge'], ['Tantalum / polymer', 'Laptops, compact power rails', 'Tantalum fails short after surges; polymer is more forgiving']])}
<p><b>ESR</b> (equivalent series resistance) is the small internal resistance of a capacitor. As electrolytics age, ESR rises, ripple increases, and supplies start cycling, whining or refusing to start.</p>
<p><b>Decoupling</b> caps sit right by IC power pins to supply fast current spikes. <b>Bulk</b> caps store energy for slower, larger demands.</p>
${ex('Replacing a capacitor', 'Same capacitance', 'Same or higher voltage rating', 'Similar type and ESR (don’t swap a low-ESR part for a general one)', 'Correct polarity')}
<p>Ceramics also lose capacitance as DC voltage rises (DC bias), so a 10 µF X5R part on a 5 V rail may give well under 10 µF.</p>
${slip('Large caps in mains supplies can hold over 300 V after unplugging. Discharge through a suitable resistor and confirm with a meter.')}`,
  make: fromBank([
    ['A dead short on a phone or laptop rail is very often caused by…', 'a failed ceramic (MLCC) capacitor', 'a resistor that has gone open circuit', 'a cracked screen pulling the rail down', 'too much flux left under the connector', 'MLCCs sit on every rail and can fail short, pulling it to ground.'],
    ['Why do MLCCs crack?', 'Board flex, drops and thermal shock', 'Running them at too little current', 'Strong magnetic fields near the board', 'Storing the board in low humidity', 'Ceramic is brittle; bending or uneven heating cracks it.'],
    ['ESR stands for:', 'Equivalent series resistance', 'Electrical safety rating', 'Energy storage reserve', 'Effective switching rate', 'The small internal resistance of a capacitor.'],
    ['High-ESR electrolytics in a power supply typically cause:', 'ripple, cycling or failure to start', 'higher efficiency and less heat', 'a lower output voltage rating', 'nothing you would notice in use', 'Classic signs: cycling, whining, flickering, no start-up when cold.'],
    ['A bulging top on an electrolytic capacitor usually means:', 'it has failed and should be replaced', 'it is a high-voltage type of capacitor', 'it is normal as capacitors age', 'it is holding a full charge', 'Gas from breakdown of the electrolyte pushes up the vent.'],
    ['Tantalum capacitors are commonly derated to about…', '50% of their voltage rating', '150% of their voltage rating', 'exactly their voltage rating', '10% of their voltage rating', 'They fail short under surges, so designers run them at about half their rating.'],
    ['Decoupling capacitors are placed…', 'as close to the IC power pins as possible', 'anywhere on the board along the rail', 'next to the battery connector only', 'on the far side of the board from the IC', 'Short paths keep inductance low so they can supply fast spikes.'],
    ['A replacement capacitor’s voltage rating should be…', 'equal to or higher than the original', 'lower than the original, to save space', 'any value, as long as capacitance matches', 'about half the original rating', 'Never go lower.'],
    ['X5R and X7R ceramic capacitors…', 'lose capacitance as DC voltage across them rises', 'gain capacitance as DC voltage across them rises', 'are polarised and must be fitted one way round', 'hold exactly the same value at any voltage', 'This is DC bias derating.'],
    ['Before working on a mains power supply board you should…', 'discharge the bulk capacitor safely and confirm with a meter', 'short the bulk capacitor with a screwdriver to drain it', 'touch the capacitor quickly to check whether it’s charged', 'wait five seconds after unplugging, then start work', 'Bulk caps can hold over 300 V. Screwdriver shorts damage parts and can injure you.'],
    ['Bulk capacitors on a rail are there to…', 'store energy and smooth slower changes in load', 'filter out radio signals from the antenna', 'set the clock speed of the processor', 'measure how much current the rail draws', 'Big caps handle slower, larger demands; small ones handle fast spikes.'],
    ['A shorted capacitor in resistance mode reads…', 'close to 0 Ω and stays there', 'climbing slowly up to OL', 'OL straight away and stays there', 'a value that keeps flickering', 'A healthy cap charges from the meter so the reading rises. A shorted one stays near zero.'],
  ]),
},
{
  id: 'b4', level: 2, title: 'Diodes, transistors and MOSFETs', sub: 'What they do on a board and how they fail',
  lesson: `${table(['Part', 'Job on a board', 'Typical diode-mode reading'], [['Silicon diode', 'Rectifying, steering, protection', '0.5–0.7 V one way, OL the other'], ['Schottky diode', 'Power paths (low drop, fast)', '0.15–0.45 V one way'], ['Zener', 'Holds a set voltage in reverse', 'Like a diode forward'], ['TVS diode', 'Clamps spikes on ports and lines', 'Often fails <b>short</b> after a surge'], ['BJT', 'Small switches, level shifting', 'B–E and B–C read like diodes'], ['MOSFET', 'Load switches, power stages', 'Body diode between D and S']])}
<h3>MOSFETs</h3>
${ul(['<b>N-channel:</b> on when the gate is above the source by more than the threshold voltage. Used on the low side and in buck converters.', '<b>P-channel:</b> on when the gate is pulled <b>below</b> the source. Common as a high-side load switch.', 'Power MOSFETs have a <b>body diode</b> from source to drain.', 'Classic failure: <b>drain–source short</b>, often damaging what’s around it.'])}
${slip('MOSFET gates are easily damaged by static. Handle with ESD protection.')}`,
  make: fromBank([
    ['A TVS diode on a charge-port data line most often fails…', 'short, after a surge', 'open, from age', 'by changing colour', 'only when cold', 'TVS diodes sacrifice themselves clamping spikes.'],
    ['A Schottky diode’s forward voltage is typically:', '0.15–0.45 V', '0.6–0.7 V', '1.8–3 V', '5–6 V', 'Lower than silicon, which is why they’re used in power paths.'],
    ['A Zener diode is mainly used to…', 'hold a fixed voltage in reverse breakdown', 'give out light when current flows forward', 'store charge like a small capacitor', 'amplify a small audio signal', 'Zeners conduct in reverse at a set voltage.'],
    ['An N-channel MOSFET turns on when the gate is…', 'above the source by more than its threshold', 'below the source by more than its threshold', 'left floating with nothing connected', 'at the same voltage as the source', 'Vgs above the threshold turns it on.'],
    ['A P-channel high-side load switch turns on when the gate is…', 'pulled below the source', 'pulled above the source', 'left floating', 'shorted to the drain', 'P-channel needs a negative Vgs.'],
    ['Diode mode across a power MOSFET’s drain and source shows about 0.5 V one way. That is…', 'the internal body diode', 'a drain–source short', 'the gate charging up', 'a faulty meter reading', 'Power MOSFETs have a body diode between source and drain.'],
    ['A failed power MOSFET most commonly…', 'shorts drain to source', 'goes open gate to source only', 'turns into a capacitor', 'becomes a P-channel', 'D–S shorts are the classic failure.'],
    ['A BJT (bipolar transistor) is controlled by…', 'base current', 'gate voltage with no current', 'drain temperature', 'light only', 'A small base current controls a larger collector current.'],
    ['A silicon NPN transistor’s base–emitter junction in diode mode reads about:', '0.6–0.7 V', '0.1 V', '3.3 V', 'OL both ways', 'B–E and B–C are PN junctions.'],
    ['Why can a 3-pin SOT-23 part be hard to identify?', 'The same package holds diodes, transistors, MOSFETs and regulators', 'Its marking code is always printed underneath, against the board', 'SOT-23 parts never carry any marking code at all', 'Its three pins are numbered differently by every maker', 'Look up the code and the circuit around it.'],
    ['MOSFET gates are sensitive because…', 'the thin gate oxide can be punched through by static', 'the gate carries the full load current when switched on', 'the gate is magnetic and attracts metal debris', 'the gate is made of glass that cracks with heat', 'Handle with ESD protection.'],
    ['Current flows through a forward-biased diode from…', 'anode to cathode', 'cathode to anode', 'both ways equally', 'gate to source', 'Conventional current, anode to cathode.'],
  ]),
},
{
  id: 'b5', level: 3, title: 'SMD packages and marking codes', sub: 'Sizes, packages, and identifying unknown parts',
  lesson: `<h3>Passive sizes: imperial vs metric</h3>
${table(['Imperial', 'Metric', 'Size (mm)'], [['01005', '0402', '0.4 × 0.2'], ['0201', '0603', '0.6 × 0.3'], ['0402', '1005', '1.0 × 0.5'], ['0603', '1608', '1.6 × 0.8'], ['0805', '2012', '2.0 × 1.25']])}
<p>"0603" and "0402" exist in both systems as different sizes. Always check which one a parts list means.</p>
<h3>IC packages</h3>
${ul(['<b>SOT-23 / SOT-23-5/6:</b> transistors, diodes, small LDOs, logic.', '<b>SOIC</b> (1.27 mm pitch) and <b>TSSOP</b> (usually 0.65 mm): leaded, easy to inspect.', '<b>QFN/DFN:</b> no leads, joints under the edges, usually a centre <b>thermal pad</b> that must be soldered.', '<b>BGA:</b> balls across the underside. <b>WLCSP:</b> bare silicon with balls, barely bigger than the die; common in phones and fragile.'])}
<h3>Marking codes</h3>
<p>Small parts carry 2–4 character codes, not part numbers. The same code can mean different parts from different makers. Identify by <b>code + package + pin-out + the circuit around it</b>, using SMD code databases and the boardview.</p>
${slip('Pin 1 is a dot, notch or bevelled edge. Match it to the silkscreen or boardview before you solder.')}`,
  make: fromBank([
    ['An imperial 0402 component measures about:', '1.0 × 0.5 mm', '4.0 × 2.0 mm', '0.4 × 0.2 mm', '2.0 × 1.25 mm', 'Imperial 0402 = metric 1005.'],
    ['Metric 0603 is the same size as imperial…', '0201', '0603', '0402', '1206', 'Metric 0603 (0.6 × 0.3 mm) is imperial 0201.'],
    ['A QFN package has…', 'pads under the edges and usually a centre thermal pad', 'long gull-wing legs on all four sides of the body', 'through-hole pins that go right through the board', 'solder balls in a grid across the whole underside', 'Quad flat no-lead.'],
    ['WLCSP parts are…', 'bare silicon with solder balls, barely bigger than the die', 'large ceramic packages with a metal lid on top', 'through-hole parts with long legs for sockets', 'plastic packages with gull-wing legs on two sides', 'Common in phones; sensitive to board flex.'],
    ['SOIC pins are at 1.27 mm pitch. TSSOP pins are usually at…', '0.65 mm', '2.54 mm', '1.27 mm', '5 mm', 'Finer pitch, more risk of bridges.'],
    ['A 2-character marking code on a SOT-23 part…', 'can mean different parts from different makers', 'is always a unique part number worldwide', 'is only a date code, never the part type', 'is the part’s resistance in ohms', 'Codes are short and reused.'],
    ['To identify an SMD part by its code you need…', 'the code, the package and the circuit around it', 'just the code; the package makes no difference', 'the colour of the package and its weight', 'the device serial number and the maker’s logo', 'Code databases are sorted by package; context confirms it.'],
    ['A SOT-23-5 package is often used for…', 'small LDO regulators and logic gates', 'large BGA processors and memory', 'mains fuses on power supply boards', 'USB-C and charging connectors', 'Five pins suits an LDO: in, out, ground, enable and one spare.'],
    ['Why are QFN joints harder to inspect than SOIC joints?', 'They are mostly hidden under the package', 'They are always plated in gold', 'They use no solder, only pressure', 'They are much bigger than SOIC joints', 'You only see the edge fillets.'],
    ['Imperial 0805 is roughly:', '2.0 × 1.25 mm', '8 × 5 mm', '0.8 × 0.5 mm', '0.2 × 0.1 mm', 'Metric 2012.'],
    ['The centre thermal pad on a QFN regulator must be…', 'soldered, as it carries heat and often ground', 'left unsoldered so the chip can expand', 'covered in Kapton to stop it shorting', 'trimmed off before fitting the chip', 'Unsoldered pads cause overheating or a missing ground.'],
    ['Pin 1 on an IC is shown by…', 'a dot, notch or bevelled edge', 'the largest pin', 'the pin nearest the battery', 'a gold pin', 'Match it to the silkscreen or boardview.'],
  ]),
},
{
  id: 'b6', level: 3, title: 'Regulators: LDO, buck and boost', sub: 'How rails are made, and how regulators fail',
  lesson: `${table(['Type', 'How it works', 'Notes'], [['LDO', 'Drops the extra voltage as heat', 'Heat = (Vin − Vout) × I. Needs Vin above Vout by the dropout voltage.'], ['Buck', 'Switches Vin into an inductor and capacitor', '85–95% efficient. Switch node (LX/SW) is a square wave.'], ['Boost', 'Makes a higher voltage than its input', 'Backlight drivers, 5 V from one Li-ion cell']])}
<h3>Pins to check on any regulator</h3>
${ul(['<b>Input</b> present?', '<b>EN</b> (enable) high? No enable, no rail.', '<b>Output</b> shorted to ground?', '<b>FB</b> (feedback) divider intact? Vout = Vref × (1 + R1 ÷ R2).', '<b>PG</b> (power good) goes high when the rail is in regulation, and often enables the next stage.'])}
${ex('Worked example', 'Buck with Vref = 0.6 V, R1 = R2', 'Vout = 0.6 × (1 + 1) = 1.2 V')}
<p>PMICs put many regulators and the sequencing logic in one chip, especially in phones.</p>
${slip('If a buck’s high-side MOSFET fails short, Vin can appear on the output and kill everything it feeds. After fixing a dead regulator, check what’s downstream.')}`,
  make: mixed([
    ['An LDO drops 5 V to 3.3 V at 0.5 A. How much heat?', '0.85 W', '1.65 W', '2.5 W', '0.33 W', 'P = (5 − 3.3) × 0.5 = 0.85 W.'],
    ['Why use a buck converter instead of an LDO for a big drop at high current?', 'It is far more efficient, so less heat', 'It is always cheaper and smaller', 'It has no ripple at all', 'It needs no inductor', 'A buck switches instead of burning off the difference.'],
    ['A boost converter…', 'makes a higher voltage than its input', 'only ever makes a lower voltage', 'turns AC from the mains into DC', 'is a type of resettable fuse', 'Used in backlight drivers and 5 V from a single cell.'],
    ['On a working buck converter, the LX/SW pin shows…', 'a fast square wave between about Vin and 0 V', 'steady DC at the regulator’s output voltage', 'a 50 Hz sine wave from the mains input', 'nothing at all until the load is connected', 'That’s the switch node feeding the inductor.'],
    ['A buck’s feedback divider has Vref = 0.6 V and R1 = R2. The output is:', '1.2 V', '0.6 V', '0.3 V', '2.4 V', 'Vout = 0.6 × (1 + 1) = 1.2 V.'],
    ['If a buck’s high-side MOSFET fails short, the output…', 'can rise to the input voltage and damage what it feeds', 'drops to zero and nothing downstream is at risk', 'turns into AC because switching has stopped', 'stays at the right voltage; the low side takes over', 'One failed regulator can take out a CPU downstream.'],
    ['The EN pin on a regulator…', 'switches the regulator on or off', 'sets the current limit only', 'always connects straight to the battery', 'is for programming', 'No enable, no rail.'],
    ['A PG (power good) output tells the system…', 'the rail is up and in regulation', 'the inductor is the right value', 'the battery is fully charged', 'the board has a good ground', 'PG often enables the next rail in the sequence.'],
    ['A regulator has good input, EN high, output 0 V, and the output isn’t shorted. Likely cause:', 'the regulator itself, or its feedback parts', 'the screen pulling the output down', 'the speaker drawing too much current', 'nothing; that’s normal until boot', 'Input, enable and no short confirmed: suspect the regulator.'],
    ['Which part stores energy in a buck converter between switching cycles?', 'The inductor', 'The feedback resistor', 'The enable pin', 'The thermal pad', 'The inductor and output cap smooth the switched input.'],
    ['A PMIC is…', 'a chip with several regulators and power control in one package', 'a type of board-to-board connector used in phones and tablets', 'a capacitor code used on power rails in modern devices', 'a bench meter for measuring current on a phone board', 'Phones and many laptops use PMICs to make and sequence rails.'],
    ['An LDO needs its input to be…', 'above its output by at least the dropout voltage', 'lower than its output by the dropout voltage', 'exactly equal to its output at all times', 'AC, which it then rectifies to DC', 'Below dropout, the output sags.'],
  ], ldoGen, 2),
},
];
