/* Electrical Installation, Week 1: safety and regulations (entry level, England). */
import { fromBank, ex, slip, ul, table } from './kit.js';

const S = [
{
  id: 's1', title: 'Why electricity can kill', sub: 'Shock, burns, fire and the UK supply',
  lesson: `<p>Electricity is invisible, silent and has no smell. You can't tell if a wire is live by looking at it. That's why electricians follow strict safety rules every single time.</p>
<p>UK homes are supplied at <b>230 volts AC</b>, alternating <b>50 times a second</b> (50 Hz). On building sites, portable tools usually run at a safer <b>110 V</b> from yellow transformers and plugs.</p>
<h3>The four main dangers</h3>
${ul(['<b>Electric shock:</b> current flows through your body when you become part of the circuit, usually between a live part and earth. It can stop your heart or lock your muscles so you can’t let go.', '<b>Burns:</b> current heats the body where it enters and leaves.', '<b>Fire:</b> overloaded cables and loose connections overheat.', '<b>Arc flash:</b> a blast of heat and light when current jumps through the air during a fault.'])}
<p>It takes very little current to kill. About <b>50 milliamps</b> (0.05 A) through the chest can stop the heart. A kettle uses about 10 A, which is 200 times more.</p>
${ex('What makes a shock worse', 'More current → more harm', 'Path through the chest/heart → most dangerous', 'Longer time → more harm', 'Wet skin → electricity flows into you more easily → more current')}
${slip('If someone is being shocked, don’t touch them. Switch off the supply first, then call 999.')}`,
  make: fromBank([
    ['What is the normal mains voltage in a UK home?', '230 V', '110 V', '12 V', '1000 V', 'UK homes are supplied at 230 V AC.'],
    ['What frequency is UK mains electricity?', '50 Hz', '60 Hz', '230 Hz', '13 Hz', 'UK mains alternates 50 times a second: 50 hertz.'],
    ['Portable power tools on UK building sites usually run at:', '110 V', '230 V', '400 V', '5 V', 'Sites use 110 V tools (yellow plugs) because a shock from them is much less dangerous.'],
    ['Roughly how much current through the chest can be fatal?', 'About 50 mA', 'About 50 A', 'About 13 A', 'About 100 A', '50 milliamps is just 0.05 A. Tiny currents can kill.'],
    ['An electric shock happens when…', 'your body becomes part of a circuit', 'you stand near a cable', 'a fuse blows', 'a light is switched off', 'Current only flows through you if you complete a path, for example from a live part to earth.'],
    ['Why are wet hands more dangerous around electricity?', 'Electricity flows through wet skin more easily, so more current flows', 'Water is an insulator', 'Water raises the voltage', 'They aren’t more dangerous', 'Your body conducts better when wet, so more current can flow through you.'],
    ['Overloaded cables and loose connections mainly cause:', 'Fire', 'Floods', 'Lower bills', 'Brighter lights', 'Too much current or a poor connection makes heat, which can start a fire.'],
    ['Someone is being shocked and is still holding the cable. What do you do first?', 'Switch off the supply', 'Pull them off with your hands', 'Throw water on them', 'Wait for it to stop', 'If you touch them, the current can pass through you too. Isolate the supply first.'],
    ['An arc flash is…', 'a blast of heat and light from current jumping through air', 'a type of torch', 'a safety sign', 'a fuse rating', 'Arc flashes cause serious burns and eye injuries during faults.'],
    ['Which path for current through the body is most dangerous?', 'Across the chest, through the heart', 'Through one fingertip', 'Through your hair', 'No path is dangerous', 'Current through the heart can stop it beating properly.'],
    ['AC stands for:', 'Alternating current', 'Active current', 'Amp count', 'Applied charge', 'Mains is AC: the current changes direction 50 times a second.'],
    ['The longer current flows through someone’s body…', 'the more harm it does', 'the less harm it does', 'it makes no difference', 'the lower the voltage gets', 'Time matters. That’s why RCDs are designed to switch off in a fraction of a second.'],
  ]),
},
{
  id: 's2', title: 'Laws and regulations', sub: 'The rules every electrician works to',
  lesson: `<p>Some rules are <b>statutory</b>: they're the law, and breaking them is a criminal offence. Others are <b>non-statutory</b>: official standards and guidance that show you how to meet the law.</p>
${table(['Name', 'What it is', 'Law?'], [
  ['Health and Safety at Work etc. Act 1974', 'The main safety law. Employers must keep people safe; employees must take reasonable care of themselves and others.', 'Yes'],
  ['Electricity at Work Regulations 1989', 'Electrical safety at work. Work dead wherever possible; only competent people do the work.', 'Yes'],
  ['Building Regulations Part P', 'Electrical safety in homes in England. Bigger jobs must be notified to building control.', 'Yes'],
  ['BS 7671 (IET Wiring Regulations)', 'The standard for how installations are designed, installed and tested. Currently the 18th Edition, with amendments.', 'No, but everyone works to it'],
  ['HSE GS38', 'Guidance on safe test equipment: probes, leads and fuses.', 'No (guidance)'],
])}
<p>The <b>HSE</b> (Health and Safety Executive) enforces safety law at work. It can investigate accidents and take people to court.</p>
${ex('Example', 'Replacing a consumer unit (fuse box) in a house is notifiable under Part P.', 'Swapping a broken socket front for an identical one is not.')}
${slip('"Competent" means having the knowledge, training and experience to do the job safely. Being keen isn’t enough.')}`,
  make: fromBank([
    ['Which of these is the IET Wiring Regulations?', 'BS 7671', 'HASAWA 1974', 'EAWR 1989', 'Part P', 'BS 7671 is the British Standard for electrical installations, published with the IET.'],
    ['Which law is specifically about electrical safety at work?', 'Electricity at Work Regulations 1989', 'BS 7671', 'GS38', 'The Highway Code', 'The EAWR 1989 are statutory regulations for electrical safety at work.'],
    ['Is BS 7671 the law itself?', 'No, it’s a non-statutory standard', 'Yes, it’s an Act of Parliament', 'Only in Scotland', 'Only for new houses', 'It isn’t law, but working to it is how you show your work is safe and meets the law.'],
    ['Who enforces health and safety law in workplaces?', 'The HSE', 'The IET', 'The college', 'The electricity supplier', 'The Health and Safety Executive inspects, investigates and prosecutes.'],
    ['Under the Health and Safety at Work Act, employees must…', 'take reasonable care of themselves and others', 'do the job the quickest way', 'buy their own insurance', 'ignore unsafe work', 'Everyone has duties, not just the boss.'],
    ['"Statutory" means…', 'required by law', 'a suggestion', 'a type of cable', 'out of date', 'Statutory rules come from law. Breaking them is an offence.'],
    ['Which part of the Building Regulations covers electrical safety in homes?', 'Part P', 'Part L', 'Part M', 'Part A', 'Part P is electrical safety. (L is energy, M is access, A is structure.)'],
    ['Which job is notifiable under Part P?', 'Replacing a consumer unit', 'Changing a light bulb', 'Swapping a socket front like-for-like', 'Plugging in a heater', 'Big jobs like a new circuit or a new consumer unit must be notified.'],
    ['What is GS38?', 'HSE guidance on safe test equipment', 'A cable size', 'A law about ladders', 'A type of fuse', 'GS38 covers probes, leads and fuses on test equipment.'],
    ['The Electricity at Work Regulations say work should normally be done…', 'dead (isolated)', 'live if it’s quicker', 'at night', 'with gloves on, live', 'Live work is only allowed when it’s unreasonable for it to be dead, with strict precautions.'],
    ['Which edition of BS 7671 is current?', '18th Edition (with amendments)', '15th Edition', '16th Edition', '17th Edition', 'The 18th Edition came out in 2018 and has been updated by amendments since.'],
    ['"Competent" means…', 'having the knowledge, training and experience to do it safely', 'owning the right tools', 'being over 18', 'having watched a video', 'The law says only competent people (or those supervised by them) may do electrical work.'],
  ]),
},
{
  id: 's3', title: 'Safe isolation', sub: 'Making sure a circuit is dead before you touch it',
  lesson: `<p>Before working on anything, an electrician must <b>prove</b> it is dead. Switching it off isn't enough: the wrong breaker might be off, or someone might switch it back on.</p>
<h3>The safe isolation steps</h3>
<ol style="margin:0;padding-left:1.3em;display:flex;flex-direction:column;gap:6px">
<li><b>Identify</b> the circuit or equipment, and get permission to switch it off.</li>
<li><b>Isolate:</b> switch it off at the correct device.</li>
<li><b>Secure:</b> lock it off and keep the key in your pocket.</li>
<li><b>Warn:</b> put up a notice: "Danger: do not switch on".</li>
<li><b>Prove</b> your voltage indicator works on a proving unit.</li>
<li><b>Test dead</b> between every pair: line–neutral, line–earth, neutral–earth.</li>
<li><b>Re-prove</b> the tester on the proving unit, to show it didn't fail during the test.</li></ol>
<p>Only then is it safe to start.</p>
${ex('The right tester', 'An approved two-pole voltage indicator that meets GS38: fused leads, finger guards, and probe tips with 4 mm or less of bare metal.', 'Not a non-contact "volt stick" on its own, and not a neon screwdriver.')}
${slip('If the circuit is still live after you isolate it, stop. Don’t work on it. Find out why.')}`,
  make: fromBank([
    ['What is the first step of safe isolation?', 'Identify the circuit', 'Test it dead', 'Lock it off', 'Start work', 'You need to know exactly what you’re isolating before you switch anything off.'],
    ['Why lock off the isolator and keep the key?', 'So nobody can switch it back on', 'To stop theft', 'So you don’t lose it', 'It’s just tradition', 'The lock and key mean only you can restore the power.'],
    ['After testing the circuit dead, you must…', 're-prove the tester on the proving unit', 'start work straight away', 'switch the power back on', 'remove the lock', 'Re-proving shows the tester didn’t fail during your test.'],
    ['Why prove the tester before testing?', 'So you can trust a "dead" reading', 'To charge its battery', 'Only because college says so', 'To warm it up', 'A broken tester shows "dead" on a live circuit. Proving it first catches that.'],
    ['Which should you use to test a circuit is dead?', 'An approved two-pole voltage indicator', 'A non-contact volt stick', 'A neon screwdriver', 'A light bulb', 'Two-pole indicators to GS38 are the approved tool.'],
    ['On a single-phase circuit, which pairs do you test between?', 'L–N, L–E and N–E', 'L–N only', 'L–E only', 'None, just look', 'Test every combination, so a fault on any conductor is found.'],
    ['What is a proving unit?', 'A device that gives a known voltage to check your tester', 'A type of fuse', 'A padlock', 'A socket tester', 'It lets you check your tester works without using a live circuit.'],
    ['GS38 says test probe tips should have…', '4 mm or less of bare metal', '20 mm of bare metal', 'No metal at all', 'Any length', 'Short, shrouded tips reduce the chance of an accidental short circuit.'],
    ['Why put up a warning notice?', 'To tell others not to switch it on', 'To show who the boss is', 'It’s decoration', 'To mark your toolbox', 'Notices warn everyone the circuit is being worked on.'],
    ['You isolate a circuit but it still tests live. You should…', 'stop and find the correct isolation', 'carry on carefully', 'cut the cable', 'put gloves on and continue', 'Never work on a circuit you can’t prove dead.'],
    ['Which step comes straight after switching off?', 'Securing it with a lock', 'Re-proving the tester', 'Starting work', 'Testing dead', 'Isolate, then secure (lock off), then warn, then prove, test and re-prove.'],
    ['Why isn’t switching off at the breaker enough?', 'It could be the wrong circuit, or switched back on', 'Breakers never work', 'It is enough', 'Breakers are always labelled correctly', 'Labels can be wrong, and other people can switch things on. You must lock off and prove it dead.'],
  ]),
},
{
  id: 's4', title: 'Hazards, PPE and signs', sub: 'Risk, protective kit, ladders and first aid',
  lesson: `<p>A <b>hazard</b> is something that could cause harm (a trailing lead, a live cable). A <b>risk</b> is how likely it is to hurt someone, and how badly.</p>
<p>Before a job, a <b>risk assessment</b> lists the hazards and how to control them, and a <b>method statement</b> sets out the safe steps. Together they're called <b>RAMS</b>.</p>
<p>The best control is to remove the hazard altogether. <b>PPE</b> (boots, glasses, gloves, hard hat, mask) is the <b>last resort</b>, used when the hazard can't be removed.</p>
${table(['Sign', 'Means'], [['Red circle with a line', 'Prohibition: you must not'], ['Blue circle', 'Mandatory: you must'], ['Yellow triangle', 'Warning: hazard ahead'], ['Green square', 'Safe condition: first aid, fire exit'], ['Red square', 'Fire equipment']])}
${ex('Ladders', 'Use the 1 in 4 rule: 1 unit out from the wall for every 4 units up (about 75°).', 'Keep three points of contact. Ladders are for short, light jobs.')}
${slip('Buildings built or refurbished before 2000 may contain asbestos. If you think you’ve found some, stop, don’t disturb it, and report it.')}
<p><b>Electric shock first aid:</b> don't touch the person; switch off the supply; call 999; if they're not breathing, start CPR and send for a defibrillator.</p>`,
  make: fromBank([
    ['A blue circle sign means…', 'something you must do', 'something you must not do', 'a warning', 'fire equipment', 'Blue circles are mandatory signs, e.g. "Wear eye protection".'],
    ['A red circle with a diagonal line means…', 'something you must not do', 'something you must do', 'a fire exit', 'first aid', 'It’s a prohibition sign, e.g. "No smoking".'],
    ['A yellow triangle sign means…', 'warning of a hazard', 'first aid point', 'you must wear a hat', 'fire exit', 'Yellow triangles warn, e.g. "Danger: electricity".'],
    ['A green square sign shows…', 'a safe condition, like first aid or an exit', 'a hazard', 'a ban', 'fire equipment', 'Green means safe: first aid, eyewash, fire exits.'],
    ['What is a hazard?', 'Something with the potential to cause harm', 'How likely harm is', 'A type of PPE', 'A safety sign', 'The risk is how likely and how bad; the hazard is the thing itself.'],
    ['In the order of safety controls, PPE is…', 'the last resort', 'the first thing to use', 'never needed', 'the best control', 'Remove or reduce the hazard first. PPE only protects the person wearing it.'],
    ['The ladder angle rule is…', '1 out for every 4 up', '1 out for every 1 up', 'flat against the wall', '1 out for every 10 up', 'That gives about 75°, the safest angle.'],
    ['How many points of contact should you keep on a ladder?', 'Three', 'One', 'Two', 'None', 'Two feet and a hand, or two hands and a foot, at all times.'],
    ['Asbestos is most likely in buildings…', 'built or refurbished before 2000', 'built after 2010', 'made only of wood', 'outdoors only', 'Asbestos was banned in the UK in 1999, so older buildings may contain it.'],
    ['You think you’ve found asbestos. You should…', 'stop, don’t disturb it, and report it', 'drill it to check', 'sweep it up', 'carry on', 'Asbestos fibres cause deadly lung diseases. Only specialists deal with it.'],
    ['RAMS stands for…', 'Risk assessment and method statement', 'Regulations and mandatory signs', 'Rules about meters and switches', 'Report all mistakes safely', 'RAMS are written before a job to plan how to do it safely.'],
    ['Someone has collapsed after a shock and the supply is now off. They aren’t breathing. You should…', 'call 999 and start CPR', 'give them water', 'leave them to rest', 'wait an hour', 'Call 999, start CPR, and send someone for a defibrillator.'],
  ]),
},
{
  id: 's5', title: 'Cable colours and protection', sub: 'Brown, blue, green and yellow; fuses, MCBs and RCDs',
  lesson: `${table(['Conductor', 'Colour now', 'Old colour (before 2004)'], [['Line (live)', 'Brown', 'Red'], ['Neutral', 'Blue', 'Black'], ['Protective earth', 'Green and yellow', 'Green and yellow']])}
<p>Older houses can have both sets of colours, which needs a warning label. Take care: in old wiring <b>black is neutral</b>, but in modern three-phase wiring black is a <b>line</b> (live) conductor. Never trust colours alone. Always test.</p>
<h3>Protective devices</h3>
${ul(['<b>Fuses and MCBs</b> (miniature circuit breakers) switch off if too much current flows. They protect the <b>cable</b> from overheating, not people.', '<b>RCDs</b> (residual current devices) compare the current going out on the line with the current coming back on the neutral. If some is leaking to earth, perhaps through a person, they trip. For protecting people they trip at <b>30 mA</b>, in a fraction of a second.', '<b>RCBOs</b> are an MCB and RCD in one device.', 'They all live in the <b>consumer unit</b> (what people call the fuse box).'])}
<p><b>Earthing</b> gives fault current a safe path back, so the protective device switches off quickly instead of a metal case staying live.</p>
${ex('UK plugs', 'Brown to the bottom right (with the fuse), blue to the bottom left, green and yellow to the top.', 'Common plug fuses: 3 A for low-power items, 13 A for heaters and kettles.')}`,
  make: fromBank([
    ['What colour is the line (live) conductor in modern UK wiring?', 'Brown', 'Blue', 'Red', 'Green and yellow', 'Brown is line, blue is neutral, green and yellow is earth.'],
    ['What colour is the neutral conductor in modern UK wiring?', 'Blue', 'Brown', 'Black', 'Grey', 'Blue is neutral.'],
    ['What colour is the protective earth conductor?', 'Green and yellow', 'Blue', 'Brown', 'Black', 'Green and yellow is always earth, old or new.'],
    ['In old wiring (before 2004), live was usually…', 'Red', 'Brown', 'Blue', 'Black', 'Old colours: red for live, black for neutral.'],
    ['In old wiring, neutral was usually…', 'Black', 'Red', 'Blue', 'Brown', 'Black was neutral. Don’t confuse it with anything else.'],
    ['An MCB mainly protects…', 'the cable from too much current', 'people from shock', 'the electricity meter', 'light bulbs', 'MCBs and fuses stop cables overheating.'],
    ['An RCD trips when…', 'current is leaking to earth', 'the voltage drops', 'a light is switched off', 'it gets cold', 'It spots a difference between line and neutral current.'],
    ['RCDs for protecting people trip at…', '30 mA', '30 A', '3 A', '300 A', '30 milliamps, below the level likely to kill.'],
    ['An RCBO is…', 'an MCB and an RCD in one device', 'a type of cable', 'a plug fuse', 'a light switch', 'It protects both the cable and people.'],
    ['Why are installations earthed?', 'So fault current trips the protective device', 'To make lights brighter', 'To save money', 'To carry normal current', 'Earthing gives a safe path so the supply switches off quickly.'],
    ['Common UK plug fuse sizes are…', '3 A and 13 A', '30 A and 60 A', '1 A and 100 A', '5 A and 50 A', '3 A for things like lamps, 13 A for kettles and heaters.'],
    ['In a UK plug, the brown wire goes to…', 'the bottom right, with the fuse', 'the top terminal', 'the bottom left', 'any terminal', 'BRown: Bottom Right. BLue: Bottom Left. Earth: top.'],
    ['What is a consumer unit?', 'The board with the main switch and circuit breakers', 'The electricity meter', 'A type of socket', 'A cable joint', 'Often called the fuse box.'],
  ]),
},
{
  id: 's6', title: 'Units and circuits', sub: 'Volts, amps, ohms, watts; series and parallel',
  lesson: `${table(['Quantity', 'Symbol', 'Unit', 'Think of it as'], [['Voltage', 'V', 'volt (V)', 'The push'], ['Current', 'I', 'amp (A)', 'The flow'], ['Resistance', 'R', 'ohm (Ω)', 'What slows the flow'], ['Power', 'P', 'watt (W)', 'How fast energy is used']])}
<p>Electricity bills charge for energy in <b>kilowatt-hours (kWh)</b>: 1 kWh is 1000 watts used for one hour.</p>
<p><b>Conductors</b> let current flow easily (copper, used for cable cores). <b>Insulators</b> don't (PVC, rubber, used for cable sheaths).</p>
${ex('Series and parallel', 'Series: one path. If one lamp fails, they all go out.', 'Parallel: separate paths. Each gets the full voltage and works on its own. Houses are wired in parallel.')}
${ex('Prefixes', 'milli (m) = one thousandth: 30 mA = 0.03 A', 'kilo (k) = one thousand: 3 kW = 3000 W')}
<p>Mains is <b>AC</b> (alternating current). Batteries give <b>DC</b> (direct current, one direction).</p>`,
  make: fromBank([
    ['What is the unit of resistance?', 'Ohm (Ω)', 'Amp (A)', 'Volt (V)', 'Watt (W)', 'Resistance is measured in ohms.'],
    ['What is the unit of current?', 'Amp (A)', 'Ohm (Ω)', 'Watt (W)', 'Volt (V)', 'Current is measured in amps.'],
    ['What is the unit of power?', 'Watt (W)', 'Amp (A)', 'Ohm (Ω)', 'Volt (V)', 'Power is measured in watts.'],
    ['Voltage is best described as…', 'the push that drives current', 'the flow of charge', 'what slows the current', 'the cost of electricity', 'Voltage pushes; current is the flow.'],
    ['Which is a good conductor?', 'Copper', 'PVC', 'Rubber', 'Glass', 'Copper is used for cable cores.'],
    ['Cable sheaths are usually made of…', 'PVC (an insulator)', 'Copper', 'Steel', 'Aluminium foil', 'Insulation stops current escaping and protects people.'],
    ['In a series circuit, if one lamp fails…', 'all the lamps go out', 'the others get brighter', 'nothing changes', 'only that lamp goes out', 'There’s only one path, so the circuit is broken.'],
    ['Houses are wired in parallel because…', 'each appliance gets full voltage and works on its own', 'it uses less cable', 'it’s the law in Scotland only', 'it makes lights dimmer', 'You can switch one thing off without affecting the rest.'],
    ['30 mA in amps is…', '0.03 A', '0.3 A', '3 A', '30 A', 'milli means thousandth: 30 ÷ 1000 = 0.03.'],
    ['3 kW in watts is…', '3000 W', '300 W', '30 W', '0.003 W', 'kilo means thousand: 3 × 1000 = 3000.'],
    ['A battery supplies…', 'DC', 'AC', '230 V', '50 Hz', 'Batteries give direct current, flowing one way.'],
    ['Electricity bills charge for energy in…', 'kilowatt-hours (kWh)', 'amps', 'volts', 'ohms', '1 kWh is 1000 W used for one hour.'],
  ]),
},
];

export default S;
