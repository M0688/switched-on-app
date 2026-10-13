/* Circuit board repair, Tuesday track: test and measurement. */
import { fromBank, ex, slip, ul, table } from '../kit.js';

export default [
{
  id: 't1', level: 1, title: 'Multimeter essentials', sub: 'Voltage, resistance, continuity and current without mistakes',
  lesson: `${table(['Measuring', 'Board state', 'How'], [['DC voltage', 'Powered', 'Black on a solid ground (shield, screw hole), red on the point'], ['Resistance / continuity', '<b>Unpowered</b>', 'The meter supplies its own small current'], ['Current', 'Powered', 'Meter <b>in series</b>, red lead moved to the A or mA socket']])}
${ul(['Continuity beeps below a low threshold (often tens of ohms), so a beep isn’t proof of a perfect joint.', 'OL means over limit: open circuit, or above the range.', 'The current inputs are fused. If current readings suddenly show zero, check the fuse.', 'For mains equipment, use a meter and leads with a suitable CAT rating: CAT II or above for plug-in equipment.'])}
${ex('Habit that saves boards', 'Check the meter on a known voltage first', 'Use fine needle probes on dense boards', 'Move the red lead back to V/Ω straight after a current reading')}
${slip('Measuring voltage with the red lead still in the A socket puts a near-short across the circuit. It can blow the meter fuse or kill the board.')}`,
  make: fromBank([
    ['To measure current, the meter must be…', 'in series with the load', 'in parallel with the load', 'across the battery', 'on the resistance range', 'Current has to flow through the meter.'],
    ['You measure voltage with the red lead still in the 10 A socket. What happens?', 'You short the circuit through the meter', 'It reads normally', 'It reads double', 'Nothing at all', 'The A socket is a near-zero resistance path.'],
    ['Resistance and continuity must be measured…', 'with the circuit unpowered', 'with the circuit powered', 'only on AC', 'with the charger connected', 'External voltage gives false readings and can damage the meter.'],
    ['The black lead goes into…', 'COM', 'the 10 A socket', 'the V socket', 'mA', 'COM is the common reference.'],
    ['A good reference point for the black lead on a board is…', 'ground, such as a shield or screw hole', 'any CPU pin', 'the positive battery pad', 'the screen connector', 'Use a solid ground and confirm it with continuity.'],
    ['Why is a slipping probe on a powered board a problem?', 'It can short adjacent pins and kill parts', 'It changes the meter range', 'It drains the probe', 'It isn’t a problem', 'Use fine probes, or solder on a test wire.'],
    ['For plug-in mains equipment, a meter should be rated at least…', 'CAT II', 'CAT 0', 'no rating needed', '12 V only', 'CAT ratings show how well a meter survives voltage spikes.'],
    ['A meter shows OL on resistance. That means…', 'open circuit, or above the selected range', 'zero ohms', 'the battery is flat', 'it is measuring voltage', 'OL = over limit.'],
    ['Continuity mode beeps when…', 'resistance is below a low threshold', 'voltage is present', 'a capacitor is charged', 'the circuit is open', 'The threshold varies by meter.'],
    ['To measure a board rail, select…', 'V DC', 'V AC', 'Ω', 'A AC', 'Board rails are DC.'],
    ['What protects a meter’s current input from overload?', 'An internal fuse', 'The display', 'The battery', 'The rotary switch', 'Check it if current readings drop to zero.'],
    ['Before trusting a "0 V" reading, it’s good practice to…', 'check the meter on a known voltage', 'switch to resistance', 'remove its battery', 'touch the probes together while powered', 'A faulty meter or lead can show zero on a live rail.'],
  ]),
},
{
  id: 't2', level: 1, title: 'Diode mode and readings to ground', sub: 'The fastest way to spot shorts and opens',
  lesson: `<p>In diode mode the meter pushes a small current and shows the <b>voltage drop</b>. A silicon junction reads about 0.5–0.7 V forward and OL in reverse.</p>
<h3>Readings to ground</h3>
<p>With the board <b>unpowered</b> and the battery disconnected, put the <b>red probe on ground</b> and the black on the test point. You’re reading the protection and body diodes inside the chips on that line.</p>
${table(['Reading', 'Usually means'], [['Close to 0.000', 'Short to ground'], ['OL where a good board reads a value', 'Open: broken trace, lifted pin, missing pad'], ['Similar to the matching line or a known-good board', 'Healthy']])}
${ul(['There is no universal "correct" number. <b>Compare</b>: with a known-good board, a reference database, or the matching line (D+ against D−).', 'Big rails like CPU VCORE can read very low and still be fine. Compare before you condemn them.', 'Pick one convention (red or black to ground) and stick to it, or your readings won’t compare.'])}
${slip('Take readings before and after a repair. The "after" reading is your proof the fault has gone.')}`,
  make: fromBank([
    ['In diode mode, the meter displays…', 'the voltage drop across the junction', 'resistance in ohms', 'current in amps', 'capacitance', 'It pushes a small current and shows the voltage needed.'],
    ['A silicon diode in diode mode reads about…', '0.5–0.7 V forward, OL reverse', '0 V both ways', 'OL both ways', '5 V forward', 'Forward conducts with a drop; reverse blocks.'],
    ['Diode readings "to ground" are commonly taken with…', 'red on ground and black on the test point', 'both probes on ground', 'the board powered on', 'the meter on AC', 'Whatever you choose, be consistent.'],
    ['A charge-port data line reads 0.003 to ground. This suggests…', 'the line is shorted to ground', 'it is healthy', 'it is open', 'the meter is on the wrong range', 'Often a failed TVS diode, filter or the IC.'],
    ['A pin reads OL where a known-good board reads 0.45. This suggests…', 'an open: broken trace, missing pad or lifted pin', 'a short', 'a healthy pin', 'a charged capacitor', 'OL means no path.'],
    ['The best way to judge a diode-mode reading is to…', 'compare with a known-good board or the matching line', 'guess from experience', 'take the highest value', 'average all readings', 'Comparison is what reveals faults.'],
    ['D+ reads 0.48 and D− reads 0.47 to ground on a USB port. This most likely means…', 'both lines look healthy and matched', 'both are shorted', 'D+ is open', 'the port is AC', 'Paired lines should read similar values.'],
    ['CPU VCORE reads about 0.1 to ground. This…', 'can be normal, so compare with a known-good board', 'always means a short', 'means the CPU is missing', 'means it’s open', 'Big loads have many paths to ground.'],
    ['Diode-mode readings must be taken with…', 'the board unpowered and battery disconnected', 'the board running', 'the charger plugged in', 'freeze spray applied', 'External power gives false readings.'],
    ['A Schottky diode reads about … forward in diode mode:', '0.15–0.45 V', '0.6–0.7 V', '1.5–2 V', 'OL', 'Lower forward drop than silicon.'],
    ['Why take readings on a connector before and after replacing a part?', 'To confirm the repair fixed the faulty line', 'To heat the part', 'To calibrate the meter', 'It isn’t useful', 'Before and after proves the fix.'],
    ['0.000 across a capacitor on a rail in diode mode means…', 'the rail (or that cap) is shorted', 'the cap is fully charged', 'the rail is healthy', 'the meter needs zeroing', 'Next: find which part on the rail is the short.'],
  ]),
},
{
  id: 't3', level: 2, title: 'Bench power supply diagnostics', sub: 'Reading the ammeter to see where a board stops',
  lesson: `<p>Powering a board from a bench supply instead of its battery or adapter lets you <b>watch the current</b>. That tells you how far it gets.</p>
${ul(['<b>Phones:</b> about 3.8–4.2 V into the battery connector through a boot cable.', '<b>Laptops:</b> the adapter voltage (often 19–20 V) into the DC jack or USB-C, through a suitable trigger.', 'Start with a <b>low current limit</b> and raise it once you know there’s no short. Double-check polarity.'])}
${table(['What the ammeter does', 'Likely meaning'], [['Hits the limit at once, voltage collapses (CC light on)', 'Short on the main rail'], ['0 mA, nothing on pressing power', 'Not starting: button line, main rail, PMIC/EC, input path'], ['Rises then stops at a fixed value', 'Stuck at a stage; compare with known boot currents'], ['Rises, drops, repeats', 'Boot loop'], ['Small steady draw before pressing power (laptop)', 'Normal standby: always-on circuits alive']])}
<h3>Voltage injection</h3>
<p>To find a short, feed the shorted rail with current-limited power at <b>no more than its normal voltage</b>. The faulty part heats up first.</p>
${slip('Never inject above the rail’s voltage. You’ll kill the good parts on it.')}`,
  make: fromBank([
    ['A phone board hits the current limit immediately and the voltage collapses. This suggests…', 'a short on the main supply rail', 'a healthy board', 'an open circuit', 'a software fault', 'CC mode with low voltage means something is shorting the rail.'],
    ['Pressing power on a phone on the bench shows 0 mA and no change. This suggests…', 'nothing is starting: check button line, main rail and PMIC', 'a short on VBAT', 'a normal boot', 'only a faulty screen', 'No change means the board isn’t responding.'],
    ['Why set a low current limit first?', 'To protect the board if there is a short', 'To charge faster', 'To raise the voltage', 'It makes no difference', 'A limit stops a short burning tracks or parts.'],
    ['The CC light on the supply is on. This means…', 'the supply is limiting current; the load wants more', 'the voltage is perfect', 'the supply is off', 'the output is AC', 'In CC mode voltage drops to hold the current limit.'],
    ['Current rises, drops and repeats every few seconds. This suggests…', 'a boot loop', 'a dead short', 'no power at all', 'a broken supply', 'It starts, fails a check, and restarts.'],
    ['What voltage would you use in place of a single-cell phone battery?', 'About 3.8–4.2 V', '12 V', '1.5 V', '19 V', 'Match one Li-ion cell; never exceed its maximum.'],
    ['When injecting voltage into a shorted rail, the voltage should be…', 'no higher than the rail’s normal voltage', 'double the rail voltage', 'mains voltage', 'as high as possible', 'Higher kills good parts on the rail.'],
    ['Why is current-limited injection useful for short-finding?', 'The shorted part heats up so you can find it', 'It repairs the short', 'It removes flux', 'It charges the battery', 'Current flows into the faulty part, which warms first.'],
    ['A laptop board on 20 V draws about 0.02 A before you press power. This is…', 'typical standby draw', 'a dead short', 'a full boot', 'impossible', 'The always-on circuits are alive. Exact values vary.'],
    ['Current rises to a fixed value and stays there with no display. This suggests…', 'the boot is stuck at a stage', 'a perfect boot', 'a dead short', 'no supply', 'Compare with known boot-current patterns for that model.'],
    ['Phones are usually connected to a bench supply through…', 'the battery connector, using a boot cable or adaptor', 'the headphone socket', 'the SIM tray', 'the screen connector', 'Boot cables give a clean connection.'],
    ['Reverse polarity from a bench supply can…', 'destroy parts instantly', 'charge the board faster', 'do nothing', 'reset the software', 'Check polarity before switching on.'],
  ]),
},
{
  id: 't4', level: 2, title: 'Short-finding methods', sub: 'Thermal camera, freeze spray, IPA, rosin, divide and conquer',
  lesson: `<p>Once diode mode shows a rail is shorted, you need to find <b>which</b> of the parts on it is the culprit. Inject current-limited power at or below the rail voltage, then look for heat:</p>
${table(['Method', 'What you see'], [['Thermal camera', 'Hot spot shows directly, without touching'], ['Freeze spray', 'Frost melts first over the hot part'], ['IPA', 'Alcohol evaporates first over the hot part'], ['Rosin', 'Melts or smokes over the hot part']])}
${ul(['Very low-resistance shorts need more current to make heat. Raise the <b>current</b>, not the voltage.', '<b>Divide and conquer:</b> lift an inductor, zero-ohm link or ferrite on the rail to see which side holds the short.', 'Start with the simplest likely part (often an MLCC). Re-measure after each removal.', 'If the only hot spot is the CPU or a big IC, it may be the fault, or something under it. Confirm before replacing.'])}
${slip('Let IPA evaporate fully before using hot air near it. It’s flammable.')}`,
  make: fromBank([
    ['Freeze spray helps find a shorted part because…', 'frost melts first on the part that’s heating', 'it removes the short', 'it insulates the board', 'it shows corrosion', 'Spray, inject current, watch where frost clears.'],
    ['IPA on a board under voltage injection…', 'evaporates fastest over the hot part', 'changes colour over the short', 'conducts and shows the short', 'freezes', 'Look for where it dries first.'],
    ['A thermal camera is useful because it…', 'shows the hot spot without touching the board', 'measures resistance', 'removes components', 'needs no injection', 'It makes heat visible straight away.'],
    ['Rosin applied over a board during injection…', 'melts or smokes over the hot part', 'insulates it', 'conducts current', 'cleans the board', 'Rosin melts at a low temperature.'],
    ['A rail has 30 capacitors and one is shorted. Which method avoids removing them one by one?', 'Voltage injection with thermal imaging', 'Removing all 30', 'Replacing the CPU', 'Reflowing the board', 'Injection makes the faulty part warm.'],
    ['Before injecting voltage, you should…', 'confirm the rail and its normal voltage', 'set the supply to maximum', 'connect the battery', 'flux the whole board', 'Know the rail voltage so you don’t overvolt good parts.'],
    ['You inject 1 V into a shorted rail at 2 A and nothing warms. You could…', 'raise the current carefully, keeping voltage at or below rail level', 'raise the voltage to 20 V', 'give up', 'add more flux', 'Very low-resistance shorts need more current.'],
    ['Lifting an inductor or zero-ohm link on a rail helps by…', 'splitting the rail to see which side holds the short', 'fixing the short', 'raising the voltage', 'cooling the board', 'Divide and conquer.'],
    ['The hot part is a capacitor next to a large IC. The best next step is…', 'remove the capacitor and re-measure the rail', 'replace the IC first', 'reflow the board', 'ignore it', 'Simplest likely part first, then measure.'],
    ['After removing the suspect part, the rail still reads shorted. This means…', 'the short is elsewhere on that rail', 'the repair is done', 'the meter is broken', 'the board is scrap', 'Re-inject and look again.'],
    ['Why is finger-touch a poor way to find a hot part?', 'You can get burnt, and it’s unreliable on tiny parts', 'It shorts the board', 'Fingers are too cold', 'It isn’t poor', 'Use a camera or freeze spray.'],
    ['During injection, only the CPU warms. This means…', 'the CPU (or something under it) may be the short; confirm before replacing', 'injection never heats CPUs', 'the CPU is fine', 'the polarity is wrong', 'Check for caps under or behind it before condemning it.'],
  ]),
},
{
  id: 't5', level: 3, title: 'Oscilloscope basics for repair', sub: 'Probes, coupling, ripple, clocks and switch nodes',
  lesson: `<p>A meter averages. A scope shows what happens moment by moment: ripple, dips, clocks and switching.</p>
${table(['Setting', 'What it does'], [['Volts/div', 'Vertical scale'], ['Time/div', 'Horizontal scale'], ['Trigger', 'Starts each sweep at the same point so the trace stands still'], ['AC coupling', 'Removes DC so you can zoom in on ripple'], ['Probe ×10', 'Higher bandwidth, less loading. Set the channel to ×10 to match.']])}
${ul(['<b>Ripple:</b> use a short ground spring, not the long clip, which picks up noise.', '<b>Clocks:</b> an RTC crystal runs at 32.768 kHz. A missing clock stops many chips.', '<b>Buck switch node:</b> a square wave between about Vin and 0 V.', 'Bandwidth is the highest frequency the scope shows accurately.'])}
${slip('A bench scope’s ground clip is tied to mains earth. Clipping it to the primary side of a mains supply makes a short. Use an isolation transformer for the device under test, or a differential probe.')}`,
  make: fromBank([
    ['Why use the ×10 probe setting for most work?', 'Higher bandwidth and less loading on the circuit', 'It makes signals 10 times bigger', 'It makes mains safe', 'It needs no ground', 'Set the channel to ×10 to match.'],
    ['A mains-powered scope’s ground clip is connected to…', 'mains earth, through the scope', 'nothing', 'the probe tip', 'the battery', 'Clipping it to a live point causes a short.'],
    ['To see small ripple on a 12 V rail, set the channel to…', 'AC coupling', 'DC coupling at 5 V/div', 'XY mode', 'off', 'AC coupling removes the 12 V so you can zoom in.'],
    ['Measuring ripple, why use a short ground spring?', 'The long clip picks up noise and adds false spikes', 'It is faster', 'It looks neater', 'The clip is for mains only', 'Long ground leads act as aerials.'],
    ['A real-time clock crystal usually runs at…', '32.768 kHz', '50 Hz', '2.4 GHz', '1 MHz', '32 768 = 2¹⁵, easy to divide to 1 Hz.'],
    ['Triggering on a scope…', 'makes a repeating waveform stand still', 'switches the scope off', 'measures resistance', 'injects voltage', 'Each sweep starts at the same point.'],
    ['Time/div controls…', 'how much time each horizontal division shows', 'the voltage scale', 'the probe gain', 'the trigger level', 'Volts/div is vertical.'],
    ['On a working buck regulator’s switch node you expect…', 'a square wave', 'flat DC', 'a 50 Hz sine wave', 'nothing', 'It toggles between about Vin and 0 V.'],
    ['A meter shows a correct rail voltage but the device crashes. A scope might show…', 'ripple or dips the meter averages out', 'nothing new', 'resistance', 'capacitance', 'Meters average; scopes don’t.'],
    ['A scope’s bandwidth tells you…', 'the highest frequency it measures accurately', 'its screen size', 'its maximum voltage', 'its channel count', 'Near the limit, signals shrink and round off.'],
    ['Channel set to ×1 but probe on ×10. Readings appear…', '10 times too small', '10 times too large', 'correct', 'inverted', 'Always match the probe setting.'],
    ['A safer way to probe a mains SMPS primary side is…', 'an isolation transformer or differential probe', 'clipping ground to live', 'removing the scope’s earth pin', 'bare wires', 'Never defeat the scope’s earth.'],
  ]),
},
{
  id: 't6', level: 3, title: 'In-circuit testing and ESR', sub: 'What in-circuit readings can and can’t tell you',
  lesson: `<p>Measuring a part on the board, you also measure everything in parallel with it.</p>
${ul(['In-circuit resistance reads the <b>same or lower</b> than the part’s value. Higher than marked means the part is open or drifted.', 'Capacitance meters are unreliable in circuit. Lift a leg or remove the part.', '<b>ESR meters</b> use a small AC test voltage (too low to turn on junctions), so they can usually test electrolytics in circuit.', 'High ESR is the classic electrolytic failure, even when capacitance still looks normal.', 'Large healthy low-ESR caps (say 1000 µF 25 V) read in the tens of milliohms. Check the maker’s chart.'])}
${ex('Example', '10 kΩ resistor reads 4.7 kΩ in circuit', 'Something about 8.9 kΩ is in parallel with it', 'Not a fault on its own')}
${slip('Discharge capacitors before testing. Stored charge can damage the meter, and you.')}`,
  make: fromBank([
    ['A 10 kΩ resistor reads 4.7 kΩ in circuit. The likely reason is…', 'other parts in parallel with it', 'the resistor has drifted high', 'the meter is on AC', 'the resistor is open', 'Parallel paths lower the reading.'],
    ['An in-circuit resistor reads higher than its marked value. It is…', 'likely faulty (open or drifted high)', 'normal', 'shorted', 'reading parallel paths', 'Parallel paths can only lower a reading.'],
    ['Why can ESR meters usually test capacitors in circuit?', 'They use a small AC test voltage too low to turn on junctions', 'They remove the capacitor', 'They use mains', 'They ignore the capacitor', 'Diodes and transistors stay off.'],
    ['Before testing capacitors in a power supply, you must…', 'discharge them', 'charge them', 'heat them', 'freeze them', 'Stored charge damages meters.'],
    ['An ESR reading far above the chart for that capacitance and voltage means…', 'the capacitor is worn out', 'it is a better capacitor', 'it is shorted', 'it is reversed', 'High ESR is the classic failure.'],
    ['An LCR meter is best used for…', 'measuring a part’s value out of circuit', 'measuring mains voltage', 'finding hot spots', 'reballing', 'In circuit, other parts distort it.'],
    ['Low-ESR electrolytics are commonly used in…', 'switch-mode power supply outputs', 'remote controls only', 'crystal oscillators', 'fuses', 'SMPS outputs need low ESR to keep ripple down.'],
    ['Two 1 kΩ resistors in parallel on the board make one of them read about:', '500 Ω', '1 kΩ', '2 kΩ', '0 Ω', 'Equal parallel resistors halve.'],
    ['Why might a capacitance meter give a strange value in circuit?', 'Other parts charge and discharge with it', 'It is too accurate', 'Capacitors never change', 'It uses mains', 'Lift a leg for a true reading.'],
    ['A cap reads correct capacitance but very high ESR. Is it good?', 'No, replace it', 'Yes, capacitance is all that matters', 'Only if it’s ceramic', 'Only if it’s bulging', 'ESR is the better test for electrolytics.'],
    ['The most reliable way to confirm a suspect part is faulty is often to…', 'lift or remove it and measure again', 'look at its colour', 'smell it', 'tap it', 'Out of circuit, nothing in parallel can fool you.'],
    ['A healthy 1000 µF 25 V low-ESR capacitor typically reads:', 'tens of milliohms', 'tens of ohms', 'megohms', 'exactly zero', 'Check the maker’s chart for the exact figure.'],
  ]),
},
];
