/* Electrical Installation: absolute beginner lessons. These come first, before any safety rules or formulas. */
import { fromBank, ex, slip, ul } from './kit.js';

export default [
{
  id: 'b1', title: 'What is electricity?', sub: 'Starting from zero: circuits, conductors and insulators',
  lesson: `<p><b>Electricity</b> is energy carried by tiny particles called <b>electrons</b> moving through a wire. They are far too small to see, so electricity is <b>invisible</b>.</p>
<p>Electricity only flows round a <b>complete loop</b>. This loop is called a <b>circuit</b>. If the loop is broken anywhere, the flow stops.</p>
<p>A simple circuit has three parts:</p>
${ul(['A <b>supply</b> that pushes the electricity round, like a <b>battery</b> or a plug socket.', '<b>Wires</b> that make the path.', 'Something that <b>uses</b> the electricity, like a bulb, a kettle or a motor.'])}
<p>A <b>switch</b> opens a gap in the loop (off) or closes the gap (on).</p>
<p><b>Conductors</b> let electricity flow through them easily. All metals are conductors, such as <b>copper</b>, steel and aluminium. The inside of a cable is <b>copper</b>.</p>
<p><b>Insulators</b> stop electricity flowing. Plastic, rubber and glass are insulators. The outside of a cable is <b>plastic</b>, so the electricity stays inside the copper.</p>
<p>Your <b>body</b> can conduct electricity too, and it conducts even better when your skin is <b>wet</b>. That is why electricity can hurt you.</p>
<p>A wire or part with electricity on it is called <b>live</b>. The ground beneath you is called <b>earth</b>, and electricity always tries to reach it. If you touch something live while standing on the ground, your body can complete a loop to earth, and electricity flows through you. That is an <b>electric shock</b>.</p>
${ex('Example: a torch', 'The battery pushes the electricity. The wires carry it. The bulb uses it.', 'Switch on: the gap closes, the loop is complete, the bulb lights.', 'Switch off: there is a gap in the loop, so nothing flows and the bulb goes out.')}
<p><b>Your home:</b> electricity comes from a power station, along big cables, into your house through the <b>meter</b>, then to the <b>fuse box</b> (electricians call it the <b>consumer unit</b>). From there, wires in the walls go to every socket and light.</p>
${slip('Turning a light off at its switch does NOT make the wiring safe to touch. Electricians switch off at the fuse box, lock it off and test it before touching anything. You will learn how later.')}`,
  make: fromBank([
    ['What is a circuit?', 'A complete loop that electricity flows round', 'A single wire with one end left loose', 'The plastic plug on the end of a lead', 'A battery that stores electricity inside', 'Electricity only flows when there is a complete loop.'],
    ['A bulb is lit in a circuit. Someone cuts one of the wires. What happens?', 'The bulb goes out', 'The bulb gets brighter', 'Nothing changes', 'The battery gets bigger', 'Cutting the wire breaks the loop, so the electricity stops flowing.'],
    ['What does a switch do?', 'Opens or closes a gap in the loop', 'Makes electricity', 'Stores electricity', 'Changes the colour of the wire', 'Off = a gap in the loop. On = the gap is closed, so electricity can flow.'],
    ['Which of these is a conductor?', 'Copper', 'Plastic', 'Rubber', 'Glass', 'Metals like copper let electricity flow easily.'],
    ['Which of these is an insulator?', 'Rubber', 'Copper', 'Steel', 'Aluminium', 'Rubber stops electricity flowing. The other three are metals, so they conduct.'],
    ['The metal inside a cable is usually…', 'copper', 'plastic', 'rubber', 'glass', 'Copper is a good conductor, so it carries the electricity.'],
    ['Why is the outside of a cable made of plastic?', 'Plastic is an insulator, so the electricity stays inside', 'Plastic is a conductor, so it carries the electricity', 'Plastic makes the cable heavy so it stays in place', 'Plastic makes the electricity flow faster to the plug', 'The plastic stops electricity escaping and keeps people safe.'],
    ['Electricity is carried by tiny particles called…', 'electrons', 'bubbles', 'magnets', 'sparks', 'Electrons moving through the wire carry the energy.'],
    ['In a torch, which part pushes the electricity round the circuit?', 'The battery', 'The switch', 'The bulb', 'The plastic case', 'The battery is the supply. It does the pushing.'],
    ['Why is it dangerous to touch electricity with wet hands?', 'Your body conducts electricity, even better when wet', 'Water makes new electricity when it touches a wire', 'Wet skin is an insulator, so it traps electricity', 'It is not dangerous as long as you are quick', 'Wet skin lets electricity flow into your body more easily.'],
    ['In a home, the wires to the sockets and lights start from…', 'the fuse box (consumer unit)', 'the kettle in the kitchen', 'the nearest light switch', 'the front door bell', 'Electricity comes in through the meter to the fuse box, then out to every socket and light.'],
    ['A lamp is switched off at its switch. Is the wiring now safe to touch?', 'No. Electricians switch off at the fuse box, lock it off and test it first', 'Yes. Once the switch is off, no electricity is left anywhere in the wiring', 'Yes, as long as the bulb has gone cold, the wires are safe to touch', 'Yes, if it is daytime, because the lights circuit is not being used', 'The switch only makes a gap in one place. The wiring can still be live.'],
    ['A part with electricity on it is called…', 'live', 'earth', 'an insulator', 'a switch', 'Live means it has electricity on it. Never touch anything that could be live.'],
    ['You touch something live while standing on the ground. What can happen?', 'Electricity flows through you to earth: an electric shock', 'Nothing happens, because the ground is an insulator', 'The electricity stops as soon as it reaches your hand', 'The fuse box turns on and sends more electricity', 'Your body completes a loop to earth, so electricity flows through you.'],
    ['Can you see electricity flowing in a wire?', 'No, it is invisible', 'Yes, the wire glows blue', 'Yes, the wire shakes', 'Only at night', 'Electrons are far too small to see. You can never tell by looking.'],
  ]),
},
{
  id: 'b2', title: 'Volts, amps and watts', sub: 'The three words you will hear every day',
  lesson: `<p>Think of electricity like water in a hosepipe.</p>
${ul(['<b>Voltage</b> is the <b>push</b>, like the water pressure. It is measured in <b>volts (V)</b>. A bigger voltage gives a bigger push.', '<b>Current</b> is <b>how much electricity is flowing</b>, like how much water comes out of the hose. It is measured in <b>amps (A)</b>.', '<b>Power</b> is <b>how much energy something uses every second</b>. It is measured in <b>watts (W)</b>. More watts means more power and a bigger bill.'])}
<p><b>Everyday voltages:</b> an AA battery is <b>1.5 V</b>. A car battery is <b>12 V</b>. A UK home socket is <b>230 V</b>.</p>
<p><b>Everyday power:</b> an LED light bulb uses about <b>6 W</b>. A kettle uses about <b>3000 W</b>. 1000 watts is called 1 <b>kilowatt (kW)</b>, so 3000 W = 3 kW.</p>
<p><b>Small currents:</b> <b>milli</b> means one thousandth. A <b>milliamp (mA)</b> is one thousandth of an amp. Even a few milliamps through your body can hurt you, which you will see in the next lesson.</p>
<p><b>DC and AC:</b> a battery gives <b>DC</b> (direct current): it flows one way only. Home sockets give <b>AC</b> (alternating current): it changes direction back and forth <b>50 times every second</b>. This is called 50 hertz (Hz).</p>
${ex('Example', 'A 3000 W kettle and a 6 W LED bulb.', '3000 ÷ 6 = 500', 'The kettle uses as much power as 500 LED bulbs.')}
${slip('Volts = the push. Amps = the flow. Watts = the power used. Don’t mix them up.')}`,
  make: fromBank([
    ['Voltage is measured in…', 'volts (V)', 'amps (A)', 'watts (W)', 'metres (m)', 'Voltage is the push, measured in volts.'],
    ['Current is measured in…', 'amps (A)', 'volts (V)', 'watts (W)', 'kilograms (kg)', 'Current is how much is flowing, measured in amps.'],
    ['Power is measured in…', 'watts (W)', 'volts (V)', 'amps (A)', 'litres (l)', 'Power is how much energy is used each second, measured in watts.'],
    ['Which word means the "push" that drives electricity round a circuit?', 'Voltage', 'Current', 'Power', 'Fuse', 'Voltage is like water pressure: the push.'],
    ['Which word means how much electricity is flowing?', 'Current', 'Voltage', 'Power', 'Switch', 'Current is the flow, like how much water comes out of a hose.'],
    ['What is the voltage of a UK home socket?', '230 V', '1.5 V', '12 V', '1000 V', 'UK homes are supplied at 230 volts.'],
    ['What is the voltage of an AA battery?', '1.5 V', '230 V', '12 V', '100 V', 'An AA battery gives 1.5 volts.'],
    ['Which of these uses the most power?', 'A 3000 W kettle', 'A 6 W LED bulb', 'A 10 W phone charger', 'A 60 W TV', 'The biggest number of watts uses the most power.'],
    ['1 kilowatt (kW) is the same as…', '1000 W', '100 W', '10 W', '1 W', 'Kilo means one thousand.'],
    ['A battery gives…', 'DC, which flows one way only', 'AC, which changes direction', '230 V', 'No electricity at all', 'Batteries give direct current (DC).'],
    ['UK home sockets give AC. How often does it change direction?', '50 times every second', 'Once every day', 'Never; it flows one way', 'Once every hour', 'AC goes back and forth 50 times a second: 50 hertz.'],
    ['A milliamp (mA) is…', 'one thousandth of an amp', 'one thousand amps', 'a type of plug top', 'a very small battery', 'Milli means one thousandth.'],
    ['Which describes power?', 'How much energy something uses every second', 'The push that drives electricity round', 'The colour of the wire inside a cable', 'How long a cable is from end to end', 'Power is measured in watts. More watts = more energy used each second.'],
  ]),
},
];
