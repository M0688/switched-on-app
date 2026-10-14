/* Circuit board repair, Wednesday track: schematics and fault-finding. */
import { fromBank, ex, slip, ul, table } from '../kit.js';

export default [
{
  id: 'f1', level: 1, title: 'Reading schematics', sub: 'Designators, nets, labels and notation',
  lesson: `${table(['Designator', 'Part'], [['R / C / L', 'Resistor / capacitor / inductor'], ['D', 'Diode (including LEDs, TVS)'], ['Q', 'Transistor or MOSFET'], ['U', 'Integrated circuit'], ['J or CN', 'Connector'], ['F', 'Fuse'], ['FB', 'Ferrite bead'], ['Y or X', 'Crystal or oscillator'], ['TP', 'Test point']])}
${ul(['<b>Nets:</b> points with the same net label are connected, even on different pages. Off-page arrows show where a net continues.', '<b>Values:</b> 4K7 = 4.7 kΩ, 0R = zero-ohm link.', '<b>DNP / NC / NOSTUFF:</b> not fitted. An empty footprint can be normal.', '<b>Active low:</b> a # suffix (PWRBTN#) or a bar over the name means it does its job when pulled low.', 'Big chips are often split into several boxes across pages (power pins on one, data on another).'])}
${slip('Before you call a part "missing", check the schematic: it may be DNP on that model.')}`,
  make: fromBank([
    ['Reference designator U usually means…', 'an integrated circuit', 'a resistor network', 'a fuse or polyfuse', 'a board connector', 'U for ICs.'],
    ['Q12 on a schematic is most likely…', 'a transistor or MOSFET', 'a capacitor or bead', 'a crystal or oscillator', 'a fuse or zero-ohm link', 'Q is used for transistors.'],
    ['Two points with the same net label on different pages are…', 'connected', 'separate nets that share a name', 'both tied to ground', 'a drawing error to ignore', 'Net labels join points without a drawn wire.'],
    ['A part marked DNP on a schematic…', 'is not fitted on the board', 'is faulty and must be replaced', 'must be added before the board works', 'is a fuse that has blown', 'An empty footprint can be normal.'],
    ['A signal named PWRBTN# is…', 'active low', 'active high', 'a ground return', 'an analogue level', 'It acts when pulled low.'],
    ['4K7 on a schematic means:', '4.7 kΩ', '47 kΩ', '4.7 Ω', '470 Ω', 'The letter replaces the decimal point.'],
    ['FB on a schematic usually means…', 'ferrite bead', 'fuse block', 'flat battery', 'fan bracket', 'Ferrite beads filter rails, and go open when overloaded.'],
    ['Y or X designators usually mark…', 'crystals and oscillators', 'transistors and MOSFETs', 'resistors and resistor packs', 'test points and pads', 'A missing clock stops many chips.'],
    ['An off-page connector arrow tells you…', 'the net continues on another page', 'the signal is unused on this board', 'current can only flow one way on this net', 'there’s a fault marked on this net', 'Follow it to the referenced page.'],
    ['Why is one chip sometimes drawn as several boxes?', 'Large chips are split into sections by function', 'There are several separate chips on the board', 'It is a drafting mistake on the schematic', 'To save space on a crowded schematic page', 'Power pins may be on one page, data on another.'],
    ['J or CN usually marks…', 'a connector', 'a jumper link only', 'a capacitor', 'a crystal', 'Connectors are often where tracing starts.'],
    ['TP on a board means…', 'test point', 'transistor pair', 'thermal pad', 'top plate', 'Labelled spots to measure signals.'],
  ]),
},
{
  id: 'f2', level: 1, title: 'A fault-finding method', sub: 'History, inspection, measurement and records',
  lesson: `<ol style="margin:0;padding-left:1.3em;display:flex;flex-direction:column;gap:6px">
<li><b>History:</b> what happened? Drops, liquid, previous repairs, when it started.</li>
<li><b>Reproduce</b> the fault, so you can prove the fix later.</li>
<li><b>Inspect</b> under the microscope: corrosion, burnt parts, cracked parts, lifted pins.</li>
<li><b>Measure</b> unpowered first (main rail to ground), then powered, following the power path.</li>
<li><b>Compare</b> with a known-good board or reference values.</li>
<li><b>Half-split</b> long paths, and change <b>one thing at a time</b>.</li>
<li><b>Record</b> what you found, did and tested.</li></ol>
<h3>Customer and records</h3>
${ul(['Under the Consumer Rights Act 2015, a service must be carried out with <b>reasonable care and skill</b>.', 'Photos before you start record its condition and help reassembly.', 'Warn about data-loss risk and get agreement before risky work.', 'A job record: device ID, fault, findings, work done, parts, tests, warranty.'])}
${slip('Faults come in pairs, especially after liquid damage. Fixing one and stopping is the commonest mistake.')}`,
  make: fromBank([
    ['Before opening a device, the most useful first step is…', 'getting the fault history from the customer', 'reflowing the main board to rule out joints', 'replacing the battery with a known-good one', 'cleaning the outside so you can see damage', 'Drops, liquid and previous repairs save hours.'],
    ['Why inspect under a microscope before measuring?', 'Corrosion, burns and damage are often visible', 'It’s a legal requirement under UK law', 'The light warms the board for measuring', 'It isn’t useful; meters find everything', 'A quick look often finds the fault.'],
    ['Half-splitting means…', 'testing in the middle of a path to halve the search', 'cutting the board in half to isolate the faulty side', 'using half the normal voltage when injecting', 'replacing half the parts on the rail at once', 'Each test rules out half of what’s left.'],
    ['Why change only one thing at a time?', 'So you know which change made the difference', 'It’s the fastest way to finish any repair', 'Parts are cheaper when bought one at a time', 'It doesn’t matter how many you change at once', 'Several changes hide the real cause.'],
    ['A known-good board is useful because…', 'you can compare readings directly', 'you can sell it on to cover costs', 'it has no faults, so it needs no testing', 'it replaces the need for any schematic', 'Comparison spots odd readings fast.'],
    ['Under UK law, a repair service must be carried out with…', 'reasonable care and skill', 'a five-year written guarantee', 'no written record needed', 'genuine maker’s parts only', 'Consumer Rights Act 2015.'],
    ['Photos before a repair help with…', 'reassembly and any dispute about prior damage', 'making the CPU run faster after the repair', 'cleaning the board before you start work', 'nothing useful once the job is booked in', 'They record the condition it arrived in.'],
    ['A good job record includes…', 'device ID, fault, findings, work done, parts and tests', 'only the price quoted and the date it was collected', 'just the customer’s name and their phone number', 'nothing written; a verbal note is enough for repairs', 'Supports warranty claims and repeat faults.'],
    ['Before a repair that could lose data, you should…', 'warn the customer and get agreement', 'say nothing unless they ask about it', 'wipe it anyway to protect their privacy', 'refuse all work that might touch data', 'Agree the risk first, ideally in writing.'],
    ['You fix one fault but the device still won’t work. Next…', 'measure again from the start of the power path', 'give up; there’s a second fault you can’t find', 'replace the CPU, as it’s usually the next fault', 'reflow everything on the board to be safe', 'There may be more than one fault.'],
    ['Reproducing the fault first matters because…', 'you can then prove the fix', 'it adds labour to the bill', 'customers expect to see it', 'it doesn’t; just start repairing', 'No reproduction, no proof.'],
    ['The most efficient order on a dead board is…', 'visual, then main rail, then follow the power sequence', 'CPU first, then work outwards to the smaller parts', 'screen first, then work back towards the battery', 'random likely parts first, then measure if needed', 'Simple and likely before complex.'],
  ]),
},
{
  id: 'f3', level: 2, title: 'Boardviews and power rails', sub: 'Rail names, states, and finding parts fast',
  lesson: `<p>A <b>boardview</b> shows where each part and net physically sits. Click a net and every pad on it lights up: every suspect for a short, every place to measure.</p>
<h3>Rail naming</h3>
${table(['Name pattern', 'When it’s on'], [['ALW, S5, AON (e.g. +3VALW, PP3V3_S5)', 'Always on whenever the board has power'], ['S3 / SUS', 'Sleep (memory kept powered) and running'], ['S0 / VS / RUN', 'Only when fully running'], ['VBAT / VDD_MAIN', 'Main battery-level rail on phones']])}
<p>Names vary by maker, so learn each one’s pattern from its schematics.</p>
<h3>For any missing rail, check in this order</h3>
${ul(['Is it shorted? (diode mode, unpowered)', 'Does the regulator have its <b>input</b>?', 'Is its <b>enable</b> high?', 'Only then suspect the regulator itself.'])}
${slip('Power good (PG) signals tell the next stage to start. A missing PG stops the sequence even when the rail looks fine.')}`,
  make: fromBank([
    ['A boardview shows…', 'where each part and net is on the board', 'the device’s software and firmware files', 'only the schematic symbols for each part', 'the price of each part from suppliers', 'Click a net to highlight every pad on it.'],
    ['A rail named +3VALW (or PP3V3_S5) is usually…', 'always on when the board has power', 'on only when the system is fully running', 'a ground return path for the 3 V rail', 'a data line between the EC and the BIOS', 'ALW/S5 rails come up before the power button.'],
    ['A rail with S0 or VS in its name is usually present…', 'only when the system is fully running', 'always, whenever the board has power', 'only while the battery is charging', 'only while the system is asleep', 'S0 is the running state.'],
    ['Rails with S3 in the name are on in…', 'sleep and running', 'off state only', 'running only', 'battery-out only', 'They keep memory powered while asleep.'],
    ['You highlight a shorted net and see 12 capacitors. That helps you…', 'find every part that could be shorting it', 'measure the frequency on the shorted net', 'remove the solder from all 12 at once', 'flash the firmware that controls the rail', 'Every pad on the net is a suspect.'],
    ['VBAT on a phone is…', 'the battery-voltage rail', 'a clock signal', 'the backlight output', 'a USB data line', 'It feeds the PMIC and main parts.'],
    ['Why are rails turned on in a sequence?', 'Chips need some supplies stable before others', 'To save copper on the board layout', 'It’s random; the order doesn’t matter', 'So the battery charges between each rail', 'Power-good signals enforce the order.'],
    ['A rail is missing. Before replacing its regulator, check…', 'for a short, its input, and its enable', 'the screen and its connector', 'the SIM reader and tray', 'nothing; replace it straight away', 'Short, input, enable. Then the regulator.'],
    ['Boardviews often include…', 'net names, part numbers and sometimes reference readings', 'repair prices and supplier links for every part', 'firmware files and BIOS images for the board', 'the device’s serial number and owner details', 'Some include known-good diode readings.'],
    ['Rail and signal names differ between makers, so you should…', 'read that board’s schematic or boardview', 'assume they’re the same on every board', 'guess from the nearest chip’s markings', 'ignore the names and measure everything', 'Learn each maker’s patterns.'],
    ['A signal like 3V_PG going high means…', 'the 3 V rail is up and stable', 'the 3 V rail is shorted to ground', 'the CPU is busy and can’t respond', 'the battery is fully charged', 'PG = power good.'],
    ['Why check a rail in diode mode before powering?', 'To avoid powering into a short and causing more damage', 'It makes the board boot faster when power is applied', 'It charges the rail’s capacitors ready for power-on', 'There’s no reason; powering it shows the same thing', 'Find shorts unpowered first.'],
  ]),
},
{
  id: 'f4', level: 2, title: 'Common faults', sub: 'Liquid damage, cracked joints, lifted pads',
  lesson: `<h3>Liquid damage</h3>
${ul(['Disconnect the battery straight away. Power drives corrosion (electrolysis).', 'Corrosion is worst on <b>powered</b> pins: near the battery, connectors and charge circuits.', 'Remove shields: liquid hides under them.', 'Clean with a suitable fluid, using an ultrasonic cleaner if you have one (remove batteries, mics and anything sensitive first), then dry fully.', 'Look for dendrites (metal growths between pins) and corroded vias.'])}
<h3>Other common faults</h3>
${table(['Fault', 'Sign'], [['Cracked joint (through-hole, PSUs, TVs)', 'Ring-shaped crack around the pin'], ['Cracked MLCC or BGA joint', 'Intermittent; changes when the board flexes'], ['Lifted or ripped pad', 'Pin has no connection; needs a jumper'], ['Burnt part', 'Find why it overheated, or the new one dies too']])}
${slip('Never "test" a wet device by switching it on. That’s how small liquid damage becomes big board damage.')}`,
  make: fromBank([
    ['Liquid-damage corrosion is worst where…', 'voltage was present, causing electrolysis', 'the board was coldest when the liquid got in', 'there is no exposed copper on the board', 'there are no components fitted', 'Powered pins corrode fastest.'],
    ['After liquid damage, the first thing to do is…', 'disconnect the battery', 'charge it so it dries out', 'put it in a bag of rice', 'switch it on to test it', 'Power keeps corrosion going.'],
    ['An ultrasonic cleaner with a suitable fluid is used to…', 'remove corrosion and residue from under parts', 'reflow solder joints without using any heat', 'test which rails are shorted on the board', 'lift BGA chips off the board for reballing', 'Remove batteries and sensitive parts first.'],
    ['A ring-shaped crack around a through-hole joint is…', 'a cracked joint from heat cycling', 'normal for lead-free solder joints', 'a sign of a newer solder alloy', 'flux residue left after cleaning', 'Reflow with fresh solder and flux.'],
    ['Green or white crusty deposits on a board are usually…', 'corrosion', 'conformal coating', 'dried flux', 'thermal paste', 'They can conduct, or eat traces and pads.'],
    ['Fine metal growths between pins after liquid damage are called…', 'dendrites', 'vias', 'jumpers', 'factory bridges', 'They grow by electromigration and short pins.'],
    ['Faults that change when you flex the board often point to…', 'a cracked joint or cracked component', 'a software fault in the firmware', 'a faulty charger or cable', 'a dead short on the main rail', 'Flex changes the contact.'],
    ['A lifted pad under a connector pin means…', 'that pin has lost its connection and needs a pad repair or jumper', 'nothing; the pin still connects through the solder fillet alone', 'the connector is a genuine part fitted at the factory', 'it just needs extra flux and the joint will reflow normally', 'Jumper to the next point on the trace.'],
    ['Corroded vias are a problem because…', 'they can go open, breaking links between layers', 'they make the board shine and hide other damage', 'they add resistance between the board and case', 'they glow under the microscope and confuse readings', 'Check continuity across them.'],
    ['Why remove shields after liquid damage?', 'Liquid gets trapped under them and keeps corroding', 'Shields are always faulty after any liquid damage', 'Removing them improves the phone’s mobile signal', 'It isn’t needed; liquid can’t get under shields', 'Hidden corrosion causes repeat faults.'],
    ['A burnt mark beside a part suggests…', 'that part or its circuit overheated and likely failed', 'normal wear on a board that’s a few years old', 'an old repair that was done by the factory', 'good soldering that used plenty of heat', 'Find out why, or the new part fails too.'],
    ['After cleaning liquid damage, you should…', 'dry it fully and inspect again before powering', 'power it while still wet to see what works', 'rinse it under the tap to remove the cleaner', 'skip inspection if the board looks clean', 'Trapped moisture can still short.'],
  ]),
},
{
  id: 'f5', level: 3, title: 'The power-on sequence', sub: 'Laptops and phones, stage by stage',
  lesson: `<h3>Typical Intel-style laptop</h3>
<ol style="margin:0;padding-left:1.3em;display:flex;flex-direction:column;gap:6px">
<li>Adapter in. The <b>charger IC</b> detects it (e.g. ACOK) and switches the input MOSFETs to make the system rail.</li>
<li><b>Always-on</b> 3 V/5 V rails come up.</li>
<li>The <b>EC</b> (embedded controller) starts; it often loads firmware from the BIOS SPI chip. It releases <b>RSMRST#</b> to the chipset.</li>
<li>Power button → EC → <b>PWRBTN#</b> to the chipset.</li>
<li>Chipset releases <b>SLP_S5#/S4#</b>, then <b>SLP_S3#</b> (active low; going high means "leave sleep"), and the EC switches on the S3 then S0 rails.</li>
<li>Power-good signals chain together; the CPU VCORE controller is enabled (VR_ON) near the end.</li>
<li>System power OK, resets released, CPU runs, BIOS POSTs.</li></ol>
<p><b>Phones:</b> VBAT → PMIC → power key → PMIC brings up rails in order → processor boots from storage. Current draw on a bench supply follows these stages.</p>
${slip('The fault is just after the last thing that worked. Measure in order instead of jumping to the CPU.')}`,
  make: fromBank([
    ['On a laptop, which comes up first?', 'Always-on 3 V/5 V rails', 'CPU VCORE and its phases', 'The DDR memory rail', 'The screen backlight rail', 'They power the EC before the button is pressed.'],
    ['The EC (embedded controller) on a laptop…', 'handles the power button, battery, charging and sequencing', 'is the graphics chip that drives the internal display', 'is the Wi-Fi card that connects the laptop to networks', 'stores the user’s files when the laptop is switched off', 'It runs from always-on rails.'],
    ['When SLP_S3# goes high, the board…', 'switches on the S0 (running) rails', 'shuts down to the off state', 'starts charging the battery', 'resets the BIOS settings', 'It’s active low: high means leaving sleep.'],
    ['Always-on rails present, nothing happens on pressing power. A good next check is…', 'the power button signal reaching the EC', 'CPU VCORE and its regulator phases', 'the screen and its eDP cable', 'the RAM speed setting in the BIOS', 'If the button signal doesn’t change, nothing downstream will.'],
    ['A corrupt BIOS can cause "no power" because…', 'the EC may load its firmware from the BIOS chip', 'the BIOS chip supplies the 19 V input rail', 'a corrupt BIOS shorts the always-on rail', 'it can’t; BIOS faults only affect the display', 'On many laptops the EC firmware shares the SPI chip.'],
    ['CPU VCORE usually comes up…', 'late, after the main rails and an enable', 'first of all, before any other rail', 'before the adapter is even connected', 'never on a working board', 'Its controller waits for VR_ON or similar.'],
    ['Power-good signals are used to…', 'tell the next stage it can start', 'measure how much current a rail draws', 'reset the user’s passwords', 'charge the rail’s capacitors', 'Each stage waits for the previous PG.'],
    ['On a phone, which chip makes most rails after the power key?', 'The PMIC', 'The audio codec', 'The Wi-Fi chip', 'The storage chip', 'It sequences rails for the processor and peripherals.'],
    ['A laptop charger IC must detect the adapter before…', 'it switches adapter power onto the system rail', 'the CPU starts running its first instructions', 'the screen lights up with the maker’s logo', 'the keyboard backlight turns on', 'Adapter detect lets it switch the input MOSFETs.'],
    ['Why learn the normal sequence for a platform?', 'To find the exact stage where it stops', 'To overclock the CPU once it’s repaired', 'To pass the maker’s certification test', 'It isn’t useful; every board is different', 'The fault follows the last good stage.'],
    ['On Intel laptops, RSMRST# is…', 'a chipset reset the EC releases once standby power is good', 'the screen reset line that restarts the internal display panel', 'a signal that reports the battery level to the charger IC', 'a USB data line used by the keyboard and touchpad', 'If it stays low, the chipset stays in reset.'],
    ['All rails present but no display. Next check…', 'resets, power-good signals and clocks, then BIOS and RAM', 'the adapter’s output voltage under a heavy load', 'the battery only, as it powers the display', 'nothing; it’s a screen fault if rails are present', 'Rails alone aren’t enough.'],
  ]),
},
{
  id: 'f6', level: 3, title: 'Diagnosing no-power boards', sub: 'Putting it together: real scenarios',
  lesson: `<p>Start with the current draw, then follow the branch:</p>
${table(['Symptom', 'Where to look'], [['Hits current limit at once', 'Short on the main rail: diode mode, then injection and thermal'], ['0 mA, no response', 'Input path (jack/port, fuse, protection, input MOSFETs, charger IC), then always-on rails, then EC/PMIC and button'], ['High standby draw before pressing power', 'Partial short or leaky part on an always-on rail: inject and look for warmth'], ['Starts then stops or loops', 'A missing rail, PG, clock, or a peripheral failing a check'], ['Rail present but low', 'Heavy load dragging it down, or a failing regulator: lift the load and retest']])}
${ul(['A blown fuse blew for a reason. Find the short before fitting a new one.', 'Before replacing an expensive IC, confirm its supplies, enable, clock and that its outputs aren’t just loaded down by something else.', 'After clearing a short, check its regulator: shorts often damage them.'])}
${slip('Re-run the whole sequence after each fix. A board that "still won’t power" usually has a second fault.')}`,
  make: fromBank([
    ['Laptop: 0 A draw, 20 V at the DC jack, 0 V on the system rail. Most likely area:', 'the input path: fuse, input MOSFETs or charger IC', 'the CPU and its VCORE regulator phases', 'the RAM and its own separate supply rail', 'the screen, its backlight fuse and eDP cable', 'Power stops before the system rail.'],
    ['Laptop: system rail present, always-on 3 V/5 V missing, not shorted. Check…', 'the always-on regulator’s input and enable', 'the GPU, its memory and its VRAM rail', 'the keyboard ribbon and its connector', 'the BIOS chip contents and its clock', 'Input and enable before the regulator itself.'],
    ['Phone: VDD_MAIN shorted; under injection, a capacitor near the PMIC heats up. Next:', 'remove it and re-measure the rail', 'replace the PMIC straight away', 'reflow the CPU to clear the short', 'replace the battery and try again', 'Simplest likely part first.'],
    ['An input fuse is open. Before fitting a new one…', 'check for a short downstream that blew it', 'fit a bigger fuse so it won’t blow again', 'bridge it with wire to test the board', 'power it up to see what happens', 'Fuses blow for a reason.'],
    ['New charge port fitted, phone still won’t charge but works on battery. Check…', 'the charging IC path, its input line and protection parts', 'the loudspeaker, its flex cable and the audio codec', 'the rear camera module and its connector on the board', 'the SIM reader, the tray and the SIM card itself', 'Follow the charge path past the port.'],
    ['Laptop turns on for a second then off. Common causes include…', 'a rail failing its power good, or a short appearing under load', 'a faulty keyboard sending the power button signal repeatedly', 'weak Wi-Fi making the laptop shut down to save power', 'a Windows update that stops the laptop booting', 'Something trips protection or the sequence.'],
    ['Board draws 0.5 A standby before pressing power (a good one draws 0.02 A). This suggests…', 'a partial short or leaky part on an always-on rail', 'normal standby current for a laptop board', 'an open input fuse stopping power reaching the board', 'a dead adapter that can’t supply enough current', 'Inject and look for the warm part.'],
    ['Why measure the main rail to ground before powering a liquid-damaged board?', 'To catch shorts before they cause more damage', 'To charge the rail’s capacitors before powering', 'It’s quicker than connecting a bench supply', 'It isn’t needed once the board has been cleaned', 'Unpowered checks first.'],
    ['Phone: current jumps to 30 mA on pressing power, then drops to 0. Likely:', 'the PMIC starts but a check fails, so it shuts down', 'a dead short on the main rail pulls the supply down', 'a full boot that’s waiting for the screen to light', 'a perfect start; the phone has gone into standby', 'Look for a missing rail, clock or processor/storage fault.'],
    ['Before replacing an expensive IC, you should…', 'confirm its supplies, enable and clock, and that its outputs aren’t loaded down', 'just replace it, as checking supplies and clocks takes longer than swapping a chip', 'reflow it twice with plenty of flux to see whether the fault clears by itself', 'buy two of the chip in case the first replacement is faulty out of the packet', 'Most "dead ICs" are a missing input or a load short.'],
    ['A 3.3 V rail reads 2.1 V. This often means…', 'a heavy load or partial short dragging it down, or a failing regulator', 'normal for a 3.3 V rail when the board is running under a heavy load', 'an open circuit between the regulator output and the rest of the rail', 'the rail is set too high and needs a lower value in its feedback divider', 'Lift the load to test the regulator alone.'],
    ['You cleared a short and the board still won’t power. Next…', 're-run the sequence checks from the input', 'assume the CPU is dead and quote for it', 'give up; the board has a second fault', 'reflow the whole board with hot air', 'Shorts often damage their regulator too.'],
  ]),
},
];
