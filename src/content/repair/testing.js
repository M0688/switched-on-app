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
    ['To measure current, the meter must be…', 'in series with the load', 'in parallel across the load', 'across the battery terminals', 'on the resistance range first', 'Current has to flow through the meter.'],
    ['You measure voltage with the red lead still in the 10 A socket. What happens?', 'You short the circuit through the meter', 'It reads the voltage as normal', 'It reads double the true voltage', 'The meter switches itself to amps', 'The A socket is a near-zero resistance path.'],
    ['Resistance and continuity must be measured…', 'with the circuit unpowered', 'with the circuit powered up', 'only on the AC voltage range', 'with the charger connected', 'External voltage gives false readings and can damage the meter.'],
    ['The black lead goes into…', 'COM', 'the 10 A socket', 'the VΩ socket', 'the mA socket', 'COM is the common reference.'],
    ['A good reference point for the black lead on a board is…', 'ground, such as a shield or screw hole', 'any pin on the CPU or main SoC', 'the positive battery connector pad', 'a pin on the screen connector', 'Use a solid ground and confirm it with continuity.'],
    ['Why is a slipping probe on a powered board a problem?', 'It can short adjacent pins and kill parts', 'It changes the meter’s selected range', 'It drains the meter’s internal battery', 'It isn’t a problem on low-voltage boards', 'Use fine probes, or solder on a test wire.'],
    ['For plug-in mains equipment, a meter should be rated at least…', 'CAT II', 'CAT 0', 'No rating is needed', 'Any meter rated for 12 V', 'CAT ratings show how well a meter survives voltage spikes.'],
    ['A meter shows OL on resistance. That means…', 'open circuit, or above the selected range', 'zero ohms: a dead short between the probes', 'the meter’s own battery is flat', 'the meter has switched to measuring voltage', 'OL = over limit.'],
    ['Continuity mode beeps when…', 'resistance is below a low threshold', 'any voltage is present on the circuit', 'a capacitor on the line is fully charged', 'the circuit between the probes is open', 'The threshold varies by meter.'],
    ['To measure a board rail, select…', 'V DC', 'V AC', 'Ω (resistance)', 'A AC', 'Board rails are DC.'],
    ['What protects a meter’s current input from overload?', 'An internal fuse', 'The display backlight circuit', 'The meter’s 9 V battery', 'The rotary range switch', 'Check it if current readings drop to zero.'],
    ['Before trusting a "0 V" reading, it’s good practice to…', 'check the meter on a known voltage', 'switch the meter to resistance', 'swap the meter’s battery for a new one', 'touch the probes together while powered', 'A faulty meter or lead can show zero on a live rail.'],
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
    ['In diode mode, the meter displays…', 'the voltage drop across the junction', 'the resistance of the junction in ohms', 'the current through the junction in amps', 'the capacitance of the junction', 'It pushes a small current and shows the voltage needed.'],
    ['A silicon diode in diode mode reads about…', '0.5–0.7 V forward, OL reverse', '0.000 V in both directions', 'OL in both directions', '0.5–0.7 V in both directions', 'Forward conducts with a drop; reverse blocks.'],
    ['Diode readings "to ground" are commonly taken with…', 'red on ground and black on the test point', 'both probes on two different grounds', 'the board powered on and running', 'the meter set to the AC voltage range', 'Whatever you choose, be consistent.'],
    ['A charge-port data line reads 0.003 to ground. This suggests…', 'the line is shorted to ground', 'the line is healthy and normal', 'the line is open (no path)', 'the meter is on the wrong range', 'Often a failed TVS diode, filter or the IC.'],
    ['A pin reads OL where a known-good board reads 0.45. This suggests…', 'an open: broken trace, missing pad or lifted pin', 'a short to ground somewhere on that line', 'a healthy pin with high resistance', 'a capacitor on the line still holding charge', 'OL means no path.'],
    ['The best way to judge a diode-mode reading is to…', 'compare with a known-good board or the matching line', 'check it against one fixed value for all lines', 'take the highest of three readings', 'average all the readings on the connector', 'Comparison is what reveals faults.'],
    ['D+ reads 0.48 and D− reads 0.47 to ground on a USB port. This most likely means…', 'both lines look healthy and matched', 'both lines are shorted to ground', 'D+ is open and D− is shorted', 'the port has a damaged ground pin', 'Paired lines should read similar values.'],
    ['CPU VCORE reads about 0.1 to ground. This…', 'can be normal, so compare with a known-good board', 'always means VCORE is shorted to ground', 'means the CPU has been removed', 'means the rail is open circuit', 'Big loads have many paths to ground.'],
    ['Diode-mode readings must be taken with…', 'the board unpowered and battery disconnected', 'the board powered on and running', 'the charger plugged in but screen off', 'freeze spray applied to the board first', 'External power gives false readings.'],
    ['A Schottky diode reads about … forward in diode mode:', '0.15–0.45 V', '0.6–0.7 V', '1.5–2.0 V', 'OL (no reading)', 'Lower forward drop than silicon.'],
    ['Why take readings on a connector before and after replacing a part?', 'To confirm the repair fixed the faulty line', 'To warm the new part before soldering', 'To calibrate the meter against the board', 'It isn’t useful once the part is replaced', 'Before and after proves the fix.'],
    ['0.000 across a capacitor on a rail in diode mode means…', 'the rail (or that cap) is shorted', 'the cap is fully charged and healthy', 'the rail is healthy and normal', 'the meter needs zeroing first', 'Next: find which part on the rail is the short.'],
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
    ['A phone board hits the current limit immediately and the voltage collapses. This suggests…', 'a short on the main supply rail', 'a healthy board starting to boot', 'an open circuit on the main rail', 'a software or firmware fault', 'CC mode with low voltage means something is shorting the rail.'],
    ['Pressing power on a phone on the bench shows 0 mA and no change. This suggests…', 'nothing is starting: check button line, main rail and PMIC', 'a dead short on VBAT pulling the supply into limit', 'a normal boot that just hasn’t shown a picture yet', 'only a faulty screen; the board itself is fine', 'No change means the board isn’t responding.'],
    ['Why set a low current limit first?', 'To protect the board if there is a short', 'So the board charges its battery faster', 'So the supply can raise the voltage', 'It makes no difference to the board', 'A limit stops a short burning tracks or parts.'],
    ['The CC light on the supply is on. This means…', 'the supply is limiting current; the load wants more', 'the voltage is exactly at the value you set on the dial', 'the output is switched off and idle', 'the supply has switched to AC output', 'In CC mode voltage drops to hold the current limit.'],
    ['Current rises, drops and repeats every few seconds. This suggests…', 'a boot loop', 'a dead short on the main rail', 'no power reaching the board', 'a faulty bench supply', 'It starts, fails a check, and restarts.'],
    ['What voltage would you use in place of a single-cell phone battery?', 'About 3.8–4.2 V', 'About 12 V', 'About 1.5 V', 'About 5.0–5.5 V', 'Match one Li-ion cell; never exceed its maximum.'],
    ['When injecting voltage into a shorted rail, the voltage should be…', 'no higher than the rail’s normal voltage', 'about double the rail’s normal voltage', 'the board’s full input voltage', 'as high as the supply will allow', 'Higher kills good parts on the rail.'],
    ['Why is current-limited injection useful for short-finding?', 'The shorted part heats up so you can find it', 'The current burns the short open and repairs it', 'It dries out flux and moisture on the rail', 'It charges the rail’s capacitors to find the short', 'Current flows into the faulty part, which warms first.'],
    ['A laptop board on 20 V draws about 0.02 A before you press power. This is…', 'typical standby draw', 'a dead short on the input', 'a full boot to the desktop', 'a sign the EC is missing', 'The always-on circuits are alive. Exact values vary.'],
    ['Current rises to a fixed value and stays there with no display. This suggests…', 'the boot is stuck at a stage', 'a perfect boot with a dark screen', 'a dead short on a main rail', 'no supply reaching the board', 'Compare with known boot-current patterns for that model.'],
    ['Phones are usually connected to a bench supply through…', 'the battery connector, using a boot cable or adaptor', 'the charging port, set to the battery voltage', 'test pads on the SIM tray connector', 'the display connector’s backlight pins', 'Boot cables give a clean connection.'],
    ['Reverse polarity from a bench supply can…', 'destroy parts instantly', 'make the board charge faster', 'do nothing; boards are protected', 'just reset the firmware', 'Check polarity before switching on.'],
  ]),
},
{
  id: 't4', level: 2, title: 'Short-finding methods', sub: 'Thermal camera, freeze spray, IPA, rosin, divide and conquer',
  lesson: `<p>Once diode mode shows a rail is shorted, you need to find <b>which</b> of the parts on it is the culprit. Inject current-limited power at or below the rail voltage, then look for heat:</p>
${table(['Method', 'What you see'], [['Thermal camera', 'Hot spot shows directly, without touching'], ['Freeze spray', 'Frost melts first over the hot part'], ['IPA', 'Alcohol evaporates first over the hot part'], ['Rosin', 'Melts or smokes over the hot part']])}
${ul(['Very low-resistance shorts need more current to make heat. Raise the <b>current</b>, not the voltage.', '<b>Divide and conquer:</b> lift an inductor, zero-ohm link or ferrite on the rail to see which side holds the short.', 'Start with the simplest likely part (often an MLCC). Re-measure after each removal.', 'If the only hot spot is the CPU or a big IC, it may be the fault, or something under it. Confirm before replacing.'])}
${slip('Let IPA evaporate fully before using hot air near it. It’s flammable.')}`,
  make: fromBank([
    ['Freeze spray helps find a shorted part because…', 'frost melts first on the part that’s heating', 'the cold shrinks the part and clears the short', 'it insulates the board so current flows through the short', 'the frost turns colour where corrosion is hiding', 'Spray, inject current, watch where frost clears.'],
    ['IPA on a board under voltage injection…', 'evaporates fastest over the hot part', 'changes colour over the shorted part', 'conducts and lights up the shorted area', 'freezes over the coldest part first', 'Look for where it dries first.'],
    ['A thermal camera is useful because it…', 'shows the hot spot without touching the board', 'measures the resistance of each part', 'finds shorts without any power applied', 'shows which parts are under the shields', 'It makes heat visible straight away.'],
    ['Rosin applied over a board during injection…', 'melts or smokes over the hot part', 'hardens and insulates the shorted part', 'conducts current away from the short', 'turns dark where the board is corroded', 'Rosin melts at a low temperature.'],
    ['A rail has 30 capacitors and one is shorted. Which method avoids removing them one by one?', 'Voltage injection with thermal imaging', 'Removing all 30 and testing each one', 'Replacing the rail’s power IC first', 'Reflowing the whole board with hot air', 'Injection makes the faulty part warm.'],
    ['Before injecting voltage, you should…', 'confirm the rail and its normal voltage', 'set the supply to its maximum voltage', 'connect the battery to help the supply', 'cover the whole board in flux', 'Know the rail voltage so you don’t overvolt good parts.'],
    ['You inject 1 V into a shorted rail at 2 A and nothing warms. You could…', 'raise the current carefully, keeping voltage at or below rail level', 'raise the voltage well above the rail’s normal level to make more heat', 'give up: injection can’t find low-resistance shorts', 'switch to AC injection at the same voltage', 'Very low-resistance shorts need more current.'],
    ['Lifting an inductor or zero-ohm link on a rail helps by…', 'splitting the rail to see which side holds the short', 'removing the short by breaking its current path', 'raising the rail voltage so the short heats up', 'letting the board cool between injections', 'Divide and conquer.'],
    ['The hot part is a capacitor next to a large IC. The best next step is…', 'remove the capacitor and re-measure the rail', 'replace the large IC first, then re-measure', 'reflow the IC and capacitor together', 'ignore it; capacitors rarely short', 'Simplest likely part first, then measure.'],
    ['After removing the suspect part, the rail still reads shorted. This means…', 'the short is elsewhere on that rail', 'the repair is done; it will clear with power', 'the meter is faulty and needs checking', 'the board is beyond economic repair', 'Re-inject and look again.'],
    ['Why is finger-touch a poor way to find a hot part?', 'You can get burnt, and it’s unreliable on tiny parts', 'Your finger shorts the rail to ground', 'Fingers are too cold to feel the difference', 'It isn’t poor; it’s the most accurate method', 'Use a camera or freeze spray.'],
    ['During injection, only the CPU warms. This means…', 'the CPU (or something under it) may be the short; confirm before replacing', 'the CPU is just drawing normal current, so the short is elsewhere', 'the injection voltage is too low to heat the real faulty part', 'the supply polarity is reversed, so only the CPU conducts', 'Check for caps under or behind it before condemning it.'],
  ]),
},
{
  id: 't5', level: 3, title: 'Oscilloscope basics for repair', sub: 'Probes, coupling, ripple, clocks and switch nodes',
  lesson: `<p>A meter averages. A scope shows what happens moment by moment: ripple, dips, clocks and switching.</p>
${table(['Setting', 'What it does'], [['Volts/div', 'Vertical scale'], ['Time/div', 'Horizontal scale'], ['Trigger', 'Starts each sweep at the same point so the trace stands still'], ['AC coupling', 'Removes DC so you can zoom in on ripple'], ['Probe ×10', 'Higher bandwidth, less loading. Set the channel to ×10 to match.']])}
${ul(['<b>Ripple:</b> use a short ground spring, not the long clip, which picks up noise.', '<b>Clocks:</b> an RTC crystal runs at 32.768 kHz. A missing clock stops many chips.', '<b>Buck switch node:</b> a square wave between about Vin and 0 V.', 'Bandwidth is the highest frequency the scope shows accurately.'])}
${slip('A bench scope’s ground clip is tied to mains earth. Clipping it to the primary side of a mains supply makes a short. Use an isolation transformer for the device under test, or a differential probe.')}`,
  make: fromBank([
    ['Why use the ×10 probe setting for most work?', 'Higher bandwidth and less loading on the circuit', 'It makes small signals 10 times bigger on the screen', 'It makes probing mains circuits safe', 'It lets you probe without a ground lead', 'Set the channel to ×10 to match.'],
    ['A mains-powered scope’s ground clip is connected to…', 'mains earth, through the scope', 'nothing: it floats', 'the probe tip, through a resistor', 'the scope’s internal battery', 'Clipping it to a live point causes a short.'],
    ['To see small ripple on a 12 V rail, set the channel to…', 'AC coupling', 'DC coupling at 5 V/div', 'XY mode', 'Ground coupling', 'AC coupling removes the 12 V so you can zoom in.'],
    ['Measuring ripple, why use a short ground spring?', 'The long clip picks up noise and adds false spikes', 'The spring raises the scope’s bandwidth limit', 'It stops the probe tip slipping off', 'The long clip is only for mains work', 'Long ground leads act as aerials.'],
    ['A real-time clock crystal usually runs at…', '32.768 kHz', '50 Hz', '24.000 MHz', '1.0000 MHz', '32 768 = 2¹⁵, easy to divide to 1 Hz.'],
    ['Triggering on a scope…', 'makes a repeating waveform stand still', 'freezes the screen until you press run', 'sets how many volts each division shows', 'removes the DC part of the signal', 'Each sweep starts at the same point.'],
    ['Time/div controls…', 'how much time each horizontal division shows', 'how many volts each vertical division shows', 'the probe’s attenuation setting', 'the level the trigger fires at', 'Volts/div is vertical.'],
    ['On a working buck regulator’s switch node you expect…', 'a square wave', 'flat DC at the output voltage', 'a 50 Hz sine wave', 'a slow triangle wave', 'It toggles between about Vin and 0 V.'],
    ['A meter shows a correct rail voltage but the device crashes. A scope might show…', 'ripple or dips the meter averages out', 'the same steady voltage as the meter', 'the resistance of the rail', 'the capacitance on the rail', 'Meters average; scopes don’t.'],
    ['A scope’s bandwidth tells you…', 'the highest frequency it measures accurately', 'the largest voltage it can safely measure', 'how many samples it stores per sweep', 'how many channels it can show at once', 'Near the limit, signals shrink and round off.'],
    ['Channel set to ×1 but probe on ×10. Readings appear…', '10 times too small', '10 times too large', 'correct', 'upside down', 'Always match the probe setting.'],
    ['A safer way to probe a mains SMPS primary side is…', 'an isolation transformer or differential probe', 'clipping the scope’s ground lead to live', 'removing the scope’s earth pin', 'a ×1 probe with a long ground lead', 'Never defeat the scope’s earth.'],
  ]),
},
{
  id: 't6', level: 3, title: 'In-circuit testing and ESR', sub: 'What in-circuit readings can and can’t tell you',
  lesson: `<p>Measuring a part on the board, you also measure everything in parallel with it.</p>
${ul(['In-circuit resistance reads the <b>same or lower</b> than the part’s value. Higher than marked means the part is open or drifted.', 'Capacitance meters are unreliable in circuit. Lift a leg or remove the part.', '<b>ESR meters</b> use a small AC test voltage (too low to turn on junctions), so they can usually test electrolytics in circuit.', 'High ESR is the classic electrolytic failure, even when capacitance still looks normal.', 'Large healthy low-ESR caps (say 1000 µF 25 V) read in the tens of milliohms. Check the maker’s chart.'])}
${ex('Example', '10 kΩ resistor reads 4.7 kΩ in circuit', 'Something about 8.9 kΩ is in parallel with it', 'Not a fault on its own')}
${slip('Discharge capacitors before testing. Stored charge can damage the meter, and you.')}`,
  make: fromBank([
    ['A 10 kΩ resistor reads 4.7 kΩ in circuit. The likely reason is…', 'other parts in parallel with it', 'the resistor has drifted high', 'the meter is set to the AC range', 'the resistor has gone open circuit', 'Parallel paths lower the reading.'],
    ['An in-circuit resistor reads higher than its marked value. It is…', 'likely faulty (open or drifted high)', 'normal, because of parallel paths', 'shorted to the next component', 'reading the tolerance band correctly', 'Parallel paths can only lower a reading.'],
    ['Why can ESR meters usually test capacitors in circuit?', 'They use a small AC test voltage too low to turn on junctions', 'They use a large DC voltage that swamps the other parts', 'They measure capacitance, which parallel parts can’t affect', 'They use mains voltage to break down the junctions', 'Diodes and transistors stay off.'],
    ['Before testing capacitors in a power supply, you must…', 'discharge them', 'charge them up', 'warm them up', 'cool them down', 'Stored charge damages meters.'],
    ['An ESR reading far above the chart for that capacitance and voltage means…', 'the capacitor is worn out', 'it is a higher-quality capacitor', 'it is shorted inside', 'it was fitted the wrong way round', 'High ESR is the classic failure.'],
    ['An LCR meter is best used for…', 'measuring a part’s value out of circuit', 'measuring live mains voltage', 'finding hot spots during injection', 'checking BGA joints for cracks', 'In circuit, other parts distort it.'],
    ['Low-ESR electrolytics are commonly used in…', 'switch-mode power supply outputs', 'TV remote control circuits', 'crystal oscillator load positions', 'fuse holders on mains inputs', 'SMPS outputs need low ESR to keep ripple down.'],
    ['Two 1 kΩ resistors in parallel on the board make one of them read about:', '500 Ω', '1 kΩ', '2 kΩ', '250 Ω', 'Equal parallel resistors halve.'],
    ['Why might a capacitance meter give a strange value in circuit?', 'Other parts charge and discharge with it', 'The meter is too accurate for small caps', 'Capacitors change value when warm', 'The meter uses mains to test', 'Lift a leg for a true reading.'],
    ['A cap reads correct capacitance but very high ESR. Is it good?', 'No, replace it', 'Yes, capacitance is all that matters', 'Yes, unless it’s also bulging', 'Yes, if it is a ceramic type', 'ESR is the better test for electrolytics.'],
    ['The most reliable way to confirm a suspect part is faulty is often to…', 'lift or remove it and measure again', 'look for discolouration on the part', 'check it with the board powered', 'tap it while the board is running', 'Out of circuit, nothing in parallel can fool you.'],
    ['A healthy 1000 µF 25 V low-ESR capacitor typically reads:', 'tens of milliohms', 'tens of ohms', 'several megohms', 'exactly zero ohms', 'Check the maker’s chart for the exact figure.'],
  ]),
},
];
