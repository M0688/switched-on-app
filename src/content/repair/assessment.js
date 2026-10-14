/* Placement assessment for the repair course: 6 questions per track, 2 at each level.
   The score per track sets where that track starts (see startLevel). */

export const NOT_SURE = 'Not sure';

// [level, question, right, wrong1, wrong2, wrong3]
export const QUESTIONS = {
  basics: [
    [1, 'Two 10 kΩ resistors in parallel give:', '5 kΩ', '20 kΩ', '10 kΩ', '100 kΩ'],
    [1, 'An SMD resistor marked 472 is:', '4.7 kΩ', '472 Ω', '47 kΩ', '4.72 Ω'],
    [2, 'On an SMD tantalum capacitor, the bar marks:', 'Positive', 'Negative', 'Voltage rating', 'Pin 1 of an IC'],
    [2, 'Diode mode across a power MOSFET’s drain and source shows about 0.5 V one way. That is:', 'The body diode', 'A short', 'Gate charge', 'A faulty meter'],
    [3, 'Imperial 0402 is which metric size?', '1005', '0402', '0603', '1608'],
    [3, 'A buck regulator has Vref = 0.8 V and R1 = R2 in its feedback divider. Its output is:', '1.6 V', '0.8 V', '0.4 V', '3.3 V'],
  ],
  testing: [
    [1, 'To measure current, the meter goes:', 'In series with the load', 'In parallel with the load', 'Across the battery', 'On the resistance range'],
    [1, 'A line reads 0.000 to ground in diode mode. This suggests:', 'A short to ground', 'A healthy line', 'An open circuit', 'A charged capacitor'],
    [2, 'A phone board on a bench supply hits the current limit at once and the voltage collapses. This suggests:', 'A short on the main rail', 'A normal boot starting', 'An open input fuse', 'A software or firmware fault'],
    [2, 'When injecting into a shorted rail to find the hot part, the voltage should be:', 'No higher than the rail’s normal voltage', 'About double the rail’s normal voltage', 'As high as the bench supply allows', 'The board’s full input voltage'],
    [3, 'An in-circuit resistor reads higher than its marked value. It is:', 'Likely faulty', 'Normal, due to parallel paths', 'Shorted', 'Reading capacitance'],
    [3, 'Why use AC coupling on a scope to look at ripple?', 'It removes the DC so you can zoom in', 'It makes the scope safe on mains', 'It doubles the bandwidth', 'It measures current'],
  ],
  faults: [
    [1, 'Reference designator Q usually means:', 'A transistor or MOSFET', 'A crystal or oscillator', 'A board connector', 'A fuse or zero-ohm link'],
    [1, 'A signal named PWRBTN# is:', 'Active low', 'Active high', 'Ground', 'Analogue'],
    [2, 'A rail named +3VALW or PP3V3_S5 is usually:', 'Always on when the board has power', 'On only when the system is fully running', 'On only while the system is asleep', 'A data line between the EC and BIOS'],
    [2, 'A rail is missing. Before replacing its regulator, check:', 'For a short, its input and its enable', 'The screen, speakers and keyboard', 'Only the CPU and its VCORE rail', 'Nothing; replace the regulator first'],
    [3, 'On an Intel laptop, SLP_S3# going high means:', 'Switch on the S0 (running) rails', 'Shut down to the off state', 'Start charging the battery', 'Reset the BIOS to defaults'],
    [3, 'A corrupt BIOS can cause "no power" on many laptops because:', 'The EC loads its firmware from the BIOS chip', 'The BIOS chip supplies the 19 V input rail', 'A corrupt BIOS shorts the VCORE rail', 'It can’t; BIOS faults only affect display'],
  ],
  rework: [
    [1, 'Sn63/Pb37 leaded solder melts at about:', '183 °C', '217 °C', '250 °C', '150 °C'],
    [1, 'An ESD wrist strap connects to earth through:', 'A 1 MΩ resistor', 'A direct wire', 'A fuse', 'A capacitor'],
    [2, 'Tombstoning is caused by:', 'One end of the part melting before the other', 'Too much flux on both pads at once', 'Using leaded solder on a lead-free board', 'Low airflow from the hot air station'],
    [2, 'The best way to clear a bridge between fine-pitch pins is:', 'Add flux and drag a clean tip, or use wick', 'Add more solder until the bridge melts away', 'Cut through it with a sharp craft knife', 'Blow on it while the solder is still molten'],
    [3, 'The stages of a reflow profile are:', 'Preheat, soak, reflow, cool', 'Cool, heat, cool, heat', 'Flux, wash, dry, test', 'One fast blast of heat'],
    [3, 'Why bake a board or chip before BGA work?', 'To drive out moisture that can crack the package', 'To clean flux and residue off the board surface', 'To cure the underfill so the chip lifts easily', 'To add solder to the pads ready for new balls'],
  ],
  devices: [
    [1, 'A fully charged standard Li-ion cell is about:', '4.2 V', '3.0 V', '3.7 V', '5 V'],
    [1, 'A phone shows a picture only with a torch shone on it. The fault is:', 'Backlight', 'Touch', 'Charging', 'Audio'],
    [2, 'A USB-C laptop stays at 5 V and won’t charge. A likely area is:', 'The PD controller or CC lines', 'The screen and its cable', 'The RAM modules and slots', 'The keyboard ribbon cable'],
    [2, 'A console with a known-good HDMI port and TV still has no picture. Next check:', 'The HDMI lines and the encoder/retimer chip', 'The controller and its wireless pairing', 'The disc drive and its power cable', 'The cooling fan and its connector'],
    [3, 'The bulk capacitor in a 230 V SMPS charges to about:', '325 V DC', '230 V DC', '120 V DC', '12 V DC'],
    [3, 'A 4–20 mA loop reads 0 mA. This usually means:', 'A broken wire or failed loop', '0% of the measured range', '100% of the measured range', 'Normal operation at idle'],
  ],
};

export const KEY_PREFIX = 'ax-';
export const assessKey = track => KEY_PREFIX + track;
export const isAssessment = a => typeof a?.session_key === 'string' && a.session_key.startsWith(KEY_PREFIX);

/** Score out of 6 → the level that track starts at. */
export const levelFor = score => score >= 5 ? 3 : score >= 3 ? 2 : 1;

/** Latest assessment per track: { basics: { score, level, at }, ... } (missing tracks are absent). */
export function placement(attempts) {
  const out = {};
  for (const a of attempts) {
    if (!isAssessment(a)) continue;
    const track = a.session_key.slice(KEY_PREFIX.length);
    if (!out[track] || a.created_at > out[track].at) out[track] = { score: a.score, level: levelFor(a.score), at: a.created_at };
  }
  return out;
}
