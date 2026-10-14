/* Circuit board repair, Friday track: devices. */
import { fromBank, mixed, ex, slip, ul, table, pick } from '../kit.js';

function loopGen() {
  const mA = pick([6, 8, 10, 14, 16, 18, 20]);
  const pct = (mA - 4) / 16 * 100;
  return { q: `A 4–20 mA sensor loop reads ${mA} mA. What percentage of its range is that?`, a: pct, u: '%', s: `(${mA} − 4) ÷ 16 × 100 = ${pct}%` };
}

export default [
{
  id: 'v1', level: 1, title: 'Phones and tablets: common faults', sub: 'Easy wins before board work',
  lesson: `<p>Most phone faults are parts, not the board. Rule out the cheap, easy things first.</p>
${table(['Symptom', 'Check first'], [['Won’t charge or charges intermittently', 'Lint in the port, a known-good cable and charger, the port flex'], ['Image only visible with a torch', 'Backlight: screen, backlight circuit (boost, filter, fuse)'], ['Touch dead in places', 'The screen assembly'], ['Short battery life, shuts down at 20%', 'Battery health'], ['Boot loop after liquid', 'Unplug flexes one at a time: a failed sensor can fail a boot check']])}
${ul(['<b>Known-good parts</b> (screen, battery, port flex) are the fastest test.', 'Many recent iPhones use <b>parts pairing</b>: unpaired screens, batteries or cameras can show an "unknown part" message and lose some features.', 'Modern phones <b>encrypt storage</b> with keys tied to the processor. Data recovery means getting the <b>original board</b> working.', 'Glued tablet screens need gentle heat and patience.'])}
${slip('Disconnect the battery before any board work, and before unplugging screens.')}`,
  make: fromBank([
    ['A phone won’t charge. The cheapest first check is…', 'inspect and clean the port, and try a known-good cable', 'replace the charging IC on the board straight away, as it’s the usual cause', 'reflow the charging area with hot air', 'fit a new screen, as it controls charging', 'Lint is a very common cause.'],
    ['Swapping in a known-good screen or battery first helps…', 'rule out easy parts before board work', 'reset the phone to factory settings first', 'improve the phone’s mobile signal strength', 'nothing; go straight to the board', 'Fast, cheap and conclusive.'],
    ['On many recent iPhones, fitting an unpaired screen or battery can…', 'show an unknown-part message and lose some features', 'always brick the phone until Apple unlocks it', 'improve the battery health reading to 100%', 'have no effect at all on any model', 'Parts pairing.'],
    ['A phone shows a picture only with a torch shone on it. Likely fault:', 'backlight', 'touch', 'charging', 'audio', 'The image is there but unlit.'],
    ['Touch works only in parts of the screen. Most likely:', 'the screen assembly', 'the battery', 'the charge port', 'the SIM reader', 'The digitiser is part of the screen.'],
    ['After a drop, no image, and a known-good screen also shows nothing. Next:', 'check the display connector and its lines on the board', 'replace the battery, as a drop often kills it', 'reset all settings and update the software', 'replace the earpiece speaker and its flex', 'Now it’s a board fault.'],
    ['Lint in a charge port causes…', 'poor or intermittent charging because the plug can’t seat', 'a short on VBAT that drains the battery flat overnight, even when off', 'no image on the screen until it is cleaned', 'no sound from the speakers or earpiece', 'Clean it with a non-metal pick.'],
    ['A phone boot-loops after liquid damage. A useful test is…', 'unplug flexes one at a time to find one failing a check', 'replace the CPU, as liquid always damages it first', 'charge it overnight so the battery recovers', 'update the software through a computer', 'A faulty peripheral can restart the phone.'],
    ['Before board work, always…', 'disconnect the battery', 'charge the battery full', 'update the phone’s software', 'remove only the SIM tray', 'Avoid shorts while working.'],
    ['Glued tablet screens need…', 'gentle heat and patience to avoid cracking glass or LCD', 'a firm tap with a plastic hammer to break the glue', 'freeze spray on the glue so it goes brittle and snaps', 'steady force at one corner with a metal pry tool', 'Work the adhesive slowly.'],
    ['A phone shuts down at 20% and drains fast. Check…', 'battery health first', 'the rear camera module', 'the loudspeaker', 'the SIM tray', 'Worn batteries sag under load.'],
    ['Recovering data from a damaged modern phone depends mainly on…', 'getting the original board working', 'moving the storage chip to a new board', 'the SIM card, which holds the photos', 'a working screen to unlock the data', 'Storage is encrypted to that processor.'],
  ]),
},
{
  id: 'v2', level: 1, title: 'Lithium-ion batteries safely', sub: 'Voltages, swelling, storage, fire and disposal',
  lesson: `${table(['State', 'Voltage per cell'], [['Full (standard cell)', '4.2 V'], ['Full (high-voltage cell)', 'about 4.35–4.45 V (check label)'], ['Nominal', 'about 3.6–3.85 V'], ['Storage', 'about 40–60% charge'], ['Too low', 'below about 2.5–3.0 V for long periods: may be damaged']])}
${ul(['<b>Thermal runaway:</b> a damaged or shorted cell heats itself in a chain reaction, venting and burning.', 'Never puncture, bend or crush a cell. Remove glued batteries with pull tabs, adhesive remover or gentle heat; not by levering with metal.', 'Swollen batteries come out carefully and go for recycling, not back in the device.', 'A hot, hissing or smoking battery is a fire risk: keep clear, isolate it in a fire-safe container (sand or a fire bag) only if safe, and call 999 if fire spreads.', 'In the UK, waste batteries go to battery recycling, never general waste. Shipping them is regulated as dangerous goods.'])}
${slip('Disconnect the battery before soldering anywhere near its connector.')}`,
  make: fromBank([
    ['A fully charged standard Li-ion cell is about…', '4.2 V', '3.0 V', '3.7 V', '5.0 V', 'High-voltage cells go to about 4.35–4.45 V.'],
    ['A swollen phone battery should be…', 'removed carefully without bending or puncturing it', 'pressed back flat so the phone closes again', 'left in place and charged to see if it settles back down', 'pierced with a pin to let the gas out safely', 'Then recycled.'],
    ['Thermal runaway is…', 'a chain reaction where a cell heats itself uncontrollably', 'slow charging caused by a worn or faulty charging cable', 'the normal capacity loss as a cell ages over the years', 'a software fault that misreports the battery temperature', 'It ends in venting and fire.'],
    ['The best long-term storage charge for Li-ion is about…', '40–60%', '100%', '0%', '5–10%', 'Full and empty both age cells faster.'],
    ['A punctured Li-ion battery is dangerous because…', 'it can short internally and catch fire', 'it leaks water that shorts the board', 'it always explodes the moment it’s pierced', 'it isn’t, once it has been discharged', 'Sometimes after a delay.'],
    ['Waste Li-ion batteries in the UK should be…', 'taken for battery recycling', 'put in the household waste bin', 'burnt in a metal container', 'buried away from buildings', 'Batteries in bins cause waste fires.'],
    ['A cell left below about 2.5–3.0 V for a long time…', 'may be damaged and unsafe to recharge', 'is fine and charges as normal', 'charges faster than a healthy cell would', 'becomes a high-voltage cell', 'Over-discharge damages cells.'],
    ['A battery on the bench starts hissing and smoking. You should…', 'keep clear, isolate it in a fire-safe container if safe, and be ready to call 999', 'cover it with a damp cloth and keep it on the bench until the hissing stops', 'connect it to the charger so the protection circuit can take over and stop it', 'cut the pouch open carefully so the trapped gas can escape before it builds up', 'Your safety first.'],
    ['Glued phone batteries are safest removed with…', 'pull tabs, adhesive remover or gentle heat', 'a metal screwdriver used as a lever under the cell', 'a sharp knife cut under the battery', 'pliers gripping the edge of the pouch', 'Metal levers puncture cells.'],
    ['Posting Li-ion batteries…', 'is regulated as dangerous goods with packing rules', 'has no special rules if the battery is fitted inside a phone', 'is banned completely by every UK courier', 'only needs bubble wrap and a padded envelope', 'Couriers also have their own rules.'],
    ['Battery capacity falls with…', 'charge cycles, heat and age', 'screen time, but nothing else', 'the colour of the phone case', 'nothing; capacity stays the same', 'Heat is the biggest enemy.'],
    ['Before soldering near a battery connector, you should…', 'disconnect or remove the battery', 'charge the battery fully first', 'cover the battery with kitchen foil', 'nothing; the heat won’t reach it', 'Avoid shorts and heat near the cell.'],
  ]),
},
{
  id: 'v3', level: 2, title: 'Laptops: no power, no charge', sub: 'Adapters, USB-C PD, charger ICs',
  lesson: `<h3>Adapter and input</h3>
${ul(['Test the adapter’s output, ideally <b>under load</b>: some only fail when loaded.', 'Many Dell and HP chargers have a centre <b>ID pin</b>. Broken, the laptop may refuse to charge or throttle.', 'The <b>input MOSFETs</b> after the jack switch adapter power onto the board, driven by the <b>charger IC</b>. They can fail short.'])}
<h3>USB-C Power Delivery</h3>
${ul(['A USB-C charger gives only <b>5 V</b> until the laptop’s PD controller negotiates more over the <b>CC lines</b>, commonly 20 V.', 'Stuck at 5 V: suspect the PD controller, CC lines or the port.', 'PD 3.1 EPR adds 28, 36 and 48 V levels, up to 240 W.'])}
<h3>Charger IC</h3>
<p>Selects adapter or battery power and controls charging. Runs on adapter but won’t charge: check the battery, its connector, and the charger IC.</p>
${ex('Example', '19.5 V at the jack, 0 V after the input MOSFETs', 'Check the charger IC’s gate-drive signals, and look for a short beyond the MOSFETs')}
${slip('Packs left flat for months can lock themselves out when the cells drop too low.')}`,
  make: fromBank([
    ['A USB-C laptop charger outputs only 5 V until…', 'the laptop’s PD controller negotiates a higher voltage', 'you press the laptop’s power button and the CPU wakes up', 'the laptop battery has charged up fully at the slow rate', 'the charger has warmed up for a minute after plugging in', 'USB PD starts at 5 V.'],
    ['A USB-C laptop stays at 5 V and won’t charge. A likely area is…', 'the PD controller or CC lines', 'the screen and its cable', 'the keyboard ribbon cable', 'the RAM slots and modules', 'CC carries the negotiation.'],
    ['If a Dell or HP charger’s centre ID pin is broken…', 'the laptop may refuse to charge or throttle', 'the laptop charges faster than it normally would', 'nothing changes; the pin is optional', 'the screen turns off until it’s fixed', 'The laptop can’t identify the adapter.'],
    ['To test a laptop adapter properly, measure…', 'its output voltage, ideally under load', 'its resistance between the two pins', 'the plug’s outer barrel diameter only', 'its current with the meter in parallel', 'Some fail only under load.'],
    ['Liquid spilt on a laptop keyboard often damages…', 'the area under the keyboard, near the EC and input circuits', 'only the screen, because liquid runs up the hinges', 'nothing; keyboards are sealed against liquid', 'the hinges only, which then seize', 'Check what sits under the spill.'],
    ['A laptop runs on the charger but won’t charge the battery. Check…', 'the battery, its connector and the charger IC', 'the Wi-Fi card and its two antenna leads', 'the RAM modules and the slots they sit in', 'the webcam module and its thin ribbon cable', 'Follow the charge path.'],
    ['The input MOSFETs after the DC jack…', 'switch adapter power onto the board, and can fail short', 'drive the screen backlight and set its brightness', 'store the BIOS settings when the laptop is off', 'set the CPU clock speed when the laptop starts', 'Controlled by the charger IC.'],
    ['19.5 V at the jack, 0 V after the input MOSFETs. Next…', 'check the charger IC’s gate drive and look for a short beyond', 'replace the CPU, as it controls the input MOSFETs directly', 'replace the RAM, as a bad module stops power coming in', 'flash the BIOS first, as it switches the MOSFETs on at boot', 'Find why the switch is off.'],
    ['A battery reads 0% and won’t charge after months unused. Possibly…', 'the cells are over-discharged and the pack has locked out', 'the screen is broken and showing the wrong reading', 'a new BIOS has turned battery charging off', 'normal; it will start charging after a day', 'Packs protect themselves.'],
    ['Removing the main and RTC batteries when a laptop won’t wake can…', 'reset the EC and power state', 'speed up the processor', 'update Windows automatically', 'never help; it’s a myth', 'A full drain clears a stuck EC.'],
    ['A laptop charger IC…', 'selects adapter or battery power and controls charging', 'drives the speakers and the headphone socket', 'controls only the cooling fans', 'stores the user’s passwords and BIOS settings', 'It sits at the start of the power path.'],
    ['USB PD 3.1 EPR allows up to…', '48 V at 5 A (240 W)', '20 V at 5 A (100 W)', '28 V at 3 A (84 W)', '60 V at 5 A (300 W)', 'EPR adds 28, 36 and 48 V.'],
  ]),
},
{
  id: 'v4', level: 2, title: 'Games consoles', sub: 'HDMI ports, overheating, power and controllers',
  lesson: `${table(['Fault', 'What to check'], [['No picture (known-good TV and cable)', 'HDMI port, its lines, then the HDMI encoder/retimer chip'], ['Overheating, shutting down', 'Dust, fan, thermal paste or pads'], ['Stick drift', 'Worn potentiometers in the stick module'], ['Controller won’t charge', 'Cable, then charge port']])}
${ul(['<b>HDMI port replacement</b> is the most common console board job. Ports that were yanked often take pads and traces with them: expect jumpers.', 'Big ground planes and shield tabs soak up heat. Use <b>preheat</b>, plenty of flux and leaded solder to mix.', 'The PS5 uses <b>liquid metal</b> on the APU. It conducts: keep it off the board.', 'Many consoles have an internal <b>mains PSU</b>. Unplug and make sure the bulk cap is discharged.', 'Some consoles pair storage to the board, so data and drives may not move to a replacement board.', 'Old "red ring" style failures were mostly cracked BGA joints from heat cycling.'])}
${slip('Before fitting a new HDMI port, check the old pads under the microscope. Fitting a port over a missing pad wastes the job.')}`,
  make: fromBank([
    ['The most common board-level console repair is…', 'replacing a damaged HDMI port', 'replacing the APU', 'reballing the RAM chips', 'replacing the cooling fan', 'Ports get yanked and bent.'],
    ['After a new HDMI port there’s still no picture. Check…', 'the lines from port to the HDMI encoder/retimer, and that chip', 'the controller and its pairing with the console', 'the fan and its connector on the board', 'the disc drive, which must spin up before video starts', 'Follow the signal back.'],
    ['If PS5 liquid metal spills onto the board…', 'it can short components because it conducts', 'it is harmless because it is non-conductive', 'it forms an insulating layer over the parts', 'it improves cooling of the parts it touches', 'Clean it off fully.'],
    ['A console overheating and shutting down usually needs…', 'cleaning, fan checks and new thermal paste or pads', 'a new HDMI port and a new retimer chip next to it', 'a new controller and a new charging cable for it', 'a firmware downgrade to an older system version', 'Cooling first.'],
    ['Before working on a console’s internal mains PSU…', 'unplug it and make sure the bulk cap is discharged', 'keep it plugged in so you can measure the voltages safely', 'touch the bulk cap quickly to check it’s empty', 'nothing; console PSUs are low voltage inside', 'It can hold over 300 V.'],
    ['Analogue stick drift is usually caused by…', 'worn potentiometers in the stick module', 'a fault in the console’s APU or memory chips', 'damage to the HDMI port or its lines', 'a failing internal power supply unit', 'Hall-effect sticks avoid this wear.'],
    ['Old "red ring" style failures were often…', 'cracked BGA joints from heat cycling', 'software faults fixed by an update', 'faulty HDMI cables from the factory', 'worn controllers sending bad signals', 'Lead-free joints cracking under thermal stress.'],
    ['Pulling an HDMI port off a board often also…', 'rips pads and traces, needing jumpers', 'never damages the board underneath it', 'damages the console’s controller', 'fixes the fault on its own', 'Inspect before fitting a new port.'],
    ['Console powers on, fan spins, no picture on a known-good TV and cable. Likely area:', 'HDMI port, its lines or the HDMI encoder chip', 'the controller or its wireless pairing', 'the Wi-Fi and Bluetooth module', 'the disc drive or its power cable', 'The video path.'],
    ['Why use plenty of preheat when removing a console HDMI port?', 'Ground planes and shield tabs soak up heat', 'Preheat makes the new port line up neatly on its pads', 'It isn’t needed on console boards', 'To dry out the board before working', 'Less top heat, fewer lifted pads.'],
    ['A controller won’t charge. First check…', 'the cable and the charge port', 'the console’s APU', 'the console’s HDMI port and its lines', 'the console’s cooling fan', 'Simple first.'],
    ['If a console pairs its storage to the board, swapping boards means…', 'the original data, and sometimes the drive, won’t work on the new board', 'everything on the drive transfers across as long as the model matches', 'nothing changes as long as the replacement board is brand new', 'the console runs faster because the new board has fresh firmware', 'Warn the customer.'],
  ]),
},
{
  id: 'v5', level: 3, title: 'TVs and switch-mode power supplies', sub: 'SMPS stages, backlights, and working safely on mains',
  lesson: `<h3>SMPS stages</h3>
<p>Mains → fuse, NTC, EMI filter → bridge rectifier → <b>bulk capacitor</b> (about 325 V DC from 230 V AC) → PWM controller and switching MOSFET → transformer → secondary rectifiers and output caps. <b>Feedback</b> crosses the isolation barrier through an <b>optocoupler</b>, often with a TL431 reference. A separate <b>standby</b> supply stays on when the set is off.</p>
${table(['Symptom', 'Common cause'], [['Sound, black picture; faint image with a torch', 'Backlight LEDs (one open LED kills the string) or LED driver'], ['Clicks on and off', 'PSU output caps or overload shutdown'], ['Dead, fuse blown', 'Shorted bridge rectifier or switching MOSFET; find it before a new fuse']])}
${ul(['The <b>primary side is not isolated from mains</b>. Treat it as live.', 'Use an <b>isolation transformer</b> for the set under test when probing the primary, and never connect an earthed scope ground to the primary.', 'Power a repaired PSU first through a <b>bulb limiter</b> (series lamp) to limit current if a fault remains.'])}
${slip('An isolation transformer removes the earth reference, not the danger. Parts are still at lethal voltages relative to each other.')}`,
  make: fromBank([
    ['The bulk capacitor on a 230 V SMPS charges to about…', '325 V DC', '230 V DC', '160 V DC', '400 V DC', '230 × 1.414 ≈ 325 V, the mains peak.'],
    ['The primary side of an SMPS is…', 'connected to mains and not isolated', 'safe to touch once the TV has been switched on', 'always at 12 V or less', 'isolated from mains by the fuse', 'Treat it as live.'],
    ['Feedback from secondary to primary usually goes through…', 'an optocoupler, often with a TL431 reference', 'the mains fuse and the bridge rectifier', 'a relay that clicks when the output is right', 'the bulk capacitor on the primary side', 'It crosses the isolation barrier.'],
    ['A TV has sound but a black picture, and a torch shows a faint image. Most likely:', 'backlight LEDs or the backlight driver', 'the tuner and its signal input', 'the remote control receiver', 'the speakers and audio amplifier', 'The panel works but isn’t lit.'],
    ['Why use a bulb limiter when first powering a repaired PSU?', 'It limits current if a short remains', 'It brightens the screen while testing', 'It tests the remote control receiver', 'It raises the mains voltage slightly', 'The lamp glows bright if there’s still a fault.'],
    ['A blown mains fuse in an SMPS usually means…', 'something shorted downstream, often the bridge or switching MOSFET', 'the fuse was old and simply wore out over the years of normal use', 'the TV was left in standby too long and the fuse overheated', 'nothing more; fit a new fuse of the same rating and test it', 'Find it before a new fuse.'],
    ['An isolation transformer is used to…', 'make probing the primary side safer', 'raise the mains voltage for testing', 'filter noise out of the audio', 'charge batteries from the mains', 'It removes the earth reference, not the danger.'],
    ['A TV clicks on and off repeatedly. A common cause is…', 'a failing PSU (often output caps) or overload shutdown', 'flat batteries in the remote sending repeated commands', 'a loose HDMI cable to the set-top box or games console', 'a software update that failed halfway through installing', 'Check ESR on the secondary caps.'],
    ['TV LED backlight strips often fail because…', 'one LED goes open, breaking the whole series string', 'they run too cold and the LED lenses crack and fall off', 'the remote sends the wrong brightness level to the driver', 'the strips work loose over time and come unplugged', 'Test each LED and replace the strip set.'],
    ['Secondary output capacitors in an SMPS usually fail by…', 'losing capacitance and rising in ESR', 'growing in value and falling in ESR', 'turning into a short-circuit resistor', 'never failing; they outlast the TV', 'Heat dries them out.'],
    ['The standby supply in a TV…', 'stays on when the TV is off, powering the remote receiver and standby circuits', 'turns off with the TV, so the remote has to wake the main supply directly', 'only powers the backlight strips when the picture is dimmed or fading', 'is the main 12 V supply that runs the mainboard when the TV is on', 'Often a separate small SMPS.'],
    ['Never connect an earthed scope’s ground clip to…', 'the primary side of a non-isolated mains SMPS', 'the secondary ground of an isolated SMPS', 'the ground pin of a USB port on the board', 'the negative terminal of a battery pack', 'It creates a short through earth.'],
  ]),
},
{
  id: 'v6', level: 3, title: 'Industrial boards', sub: 'Control voltages, I/O, signals and safe working',
  lesson: `${table(['Thing', 'What to know'], [['24 V DC', 'The most common control voltage'], ['PNP / NPN I/O', 'PNP (sourcing) switches +24 V to the input; NPN (sinking) switches 0 V'], ['Opto-isolated inputs', 'Protect logic from noisy, faulty field wiring'], ['Relay outputs', 'Contacts wear, pit or weld'], ['4–20 mA loops', '4 mA = 0%, 20 mA = 100%. 0 mA = broken loop ("live zero")'], ['RS-485', 'Differential serial bus, e.g. Modbus']])}
${ul(['<b>Conformal coating</b> must be removed locally before soldering and reapplied after.', 'Variable speed drives on 400 V three-phase have a DC bus around <b>560–600 V</b> that stays charged after power-off.', 'Back up or record <b>firmware and parameters</b> before work where you can.', 'No schematic? Trace the circuit around the fault, identify parts by code, and compare with a known-good board.', 'Working on machinery in place: <b>safe isolation and lock-off</b>. The Electricity at Work Regulations 1989 apply.'])}
${ex('4–20 mA', '12 mA → (12 − 4) ÷ 16 = 0.5 → 50%')}
${slip('Wait for drive DC bus capacitors to discharge, then measure them yourself. Don’t trust the indicator LED alone.')}`,
  make: mixed([
    ['The most common control voltage in industrial equipment is…', '24 V DC', '5 V AC', '110 V DC', '12 V AC', 'Standard for PLCs, sensors and relays.'],
    ['In a 4–20 mA loop, 0 mA usually means…', 'a broken wire or failed loop', '0% of the measured range', '100% of the measured range', 'normal operation while the machine is idle', '4 mA is 0%, so 0 mA is a fault.'],
    ['A 4–20 mA signal of 12 mA represents…', '50% of the range', '60% of the range', '12% of the range', '75% of the range', '(12 − 4) ÷ 16 = 0.5.'],
    ['Opto-isolated inputs are used to…', 'protect the logic from field wiring noise and faults', 'amplify weak sensor signals before they reach logic', 'store input states when the power goes off', 'drive motors directly from the logic outputs', 'The light link isolates the two sides.'],
    ['Conformal coating must be…', 'removed locally before soldering, then reapplied', 'left alone; solder melts straight through it', 'blasted off the whole board with hot air', 'soldered through with extra flux', 'Coating stops solder wetting.'],
    ['The DC bus in a 400 V three-phase drive is around…', '560–600 V DC', '24 V DC', '230 V DC', '400 V DC (same as the mains)', '400 × 1.414 ≈ 565 V, and it stays charged.'],
    ['Before repairing a board that stores firmware or settings, you should…', 'back up or record them where possible', 'erase them so the board starts clean', 'ignore them; they reload by themselves', 'reset everything to factory defaults', 'Saves a lot of trouble on recommissioning.'],
    ['Relay output faults on PLC boards are often due to…', 'worn or welded contacts', 'too little coil current', 'corrupt firmware', 'ESD damage only', 'Contacts wear with every switch.'],
    ['RS-485 is…', 'a differential serial bus used for comms like Modbus', 'a 24 V power rail used to feed sensors in a panel', 'a type of fast-blow fuse used on control boards', 'an analogue 0–10 V signal used for drive speeds', 'A and B lines, often with termination resistors.'],
    ['A board has no schematic. A good approach is…', 'trace around the fault, identify parts by code, compare with a known-good board', 'replace every chip on the board one at a time until the fault clears', 'refuse the job, as boards can’t be repaired without a schematic', 'reflow the whole board, as no-schematic faults are usually joints', 'Reverse-engineer only what you need.'],
    ['Working on machinery in place, you must…', 'follow safe isolation and lock-off procedures', 'work live to save time if you’re careful', 'leave guards off so you can see the board clearly', 'skip testing if the machine is switched off', 'EAWR 1989 applies.'],
    ['A PNP (sourcing) sensor output switches…', '+24 V to the input when active', '0 V to the input when active', '230 V to the input when active', 'nothing until it is inactive', 'NPN sinks to 0 V.'],
  ], loopGen, 1),
},
];
