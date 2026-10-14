/* Science (IGCSE Double Award), Week 2. */
import { r, pick, fromBank, mixed, ex, slip, ul, table } from './kit.js';

export default [
{
  id: 's7', title: 'Speed', sub: 'Physics: distance, time and speed',
  lesson: `<p><b>average speed = distance moved ÷ time taken</b></p>
${table(['Quantity', 'Unit'], [['Distance', 'metres (m)'], ['Time', 'seconds (s)'], ['Speed', 'metres per second (m/s)']])}
${ex('Worked example', 'A van travels 600 m in 30 s.', 'Speed = 600 ÷ 30 = <b>20 m/s</b>')}
${ex('Rearranging', 'distance = speed × time', 'time = distance ÷ speed')}
<p><b>Distance-time graphs</b>: a <b>steeper</b> line means a faster speed. A <b>flat</b> (horizontal) line means the object has stopped.</p>
${slip('Check the units match: if the time is in minutes, change it to seconds first.')}`,
  make: mixed([
    ['The unit of speed is…', 'm/s', 'm', 's', 'N', 'Metres per second.'],
    ['Speed = …', 'distance ÷ time', 'time ÷ distance', 'distance × time', 'distance + time', 'average speed = distance moved ÷ time taken.'],
    ['To find distance, you use…', 'speed × time', 'speed ÷ time', 'time ÷ speed', 'speed + time', 'Rearrange the speed equation.'],
    ['On a distance-time graph, a flat line means…', 'the object is stopped', 'it is going fast', 'it is speeding up', 'it is going backwards', 'Distance isn’t changing, so it isn’t moving.'],
    ['On a distance-time graph, a steeper line means…', 'a faster speed', 'a slower speed', 'stopped', 'going backwards', 'More distance in the same time.'],
  ], () => {
    const t = r(0, 2);
    if (t === 0) { const v = r(2, 30), s = r(5, 60); return { q: `A car travels ${v * s} m in ${s} s. What is its average speed?`, a: v, u: 'm/s', s: `${v * s} ÷ ${s} = ${v} m/s` }; }
    if (t === 1) { const v = r(2, 15), s = r(10, 60); return { q: `A cyclist travels at ${v} m/s for ${s} s. How far do they go?`, a: v * s, u: 'm', s: `${v} × ${s} = ${v * s} m` }; }
    const v = r(2, 10), s = r(5, 40); return { q: `A runner covers ${v * s} m at ${v} m/s. How long does it take?`, a: s, u: 's', s: `${v * s} ÷ ${v} = ${s} s` };
  }, 4),
},
{
  id: 's8', title: 'Energy stores and transfers', sub: 'Physics: where energy goes, and efficiency',
  lesson: `<p>Energy is stored in different ways and moved (transferred) between stores.</p>
${ul(['<b>Stores:</b> chemical (food, fuel, batteries), kinetic (moving things), gravitational (things high up), elastic (stretched springs), thermal (hot things), nuclear, magnetic, electrostatic', '<b>Transfers:</b> by forces (mechanical work), by electrical current, by heating, by radiation (light, sound waves)'])}
<p>Energy is never created or destroyed. Some is always <b>wasted</b>, usually as heat to the surroundings.</p>
${ex('Efficiency', 'efficiency = useful energy out ÷ total energy in', 'A bulb uses 100 J and gives out 20 J of light: 20 ÷ 100 = 0.2 = <b>20%</b> efficient')}`,
  make: mixed([
    ['A battery stores energy in its…', 'chemical store', 'kinetic store', 'gravitational store', 'elastic store', 'Batteries store chemical energy.'],
    ['A moving car has energy in its…', 'kinetic store', 'nuclear store', 'elastic store', 'magnetic store', 'Moving objects have kinetic energy.'],
    ['A stretched spring stores energy in its…', 'elastic store', 'thermal store', 'chemical store', 'kinetic store', 'Stretching or squashing stores elastic energy.'],
    ['A rock at the top of a cliff has energy in its…', 'gravitational store', 'kinetic store', 'chemical store', 'elastic store', 'Height above the ground means gravitational energy.'],
    ['Energy wasted by machines usually ends up as…', 'heat in the surroundings', 'new energy that wasn’t there', 'nothing at all; it disappears', 'more electricity in the wires', 'Wasted energy spreads out as heat.'],
    ['Which is true?', 'Energy can’t be created or destroyed', 'Energy can be destroyed', 'Machines make energy', 'Efficient machines create energy', 'It only moves between stores.'],
    ['A kettle transfers energy by…', 'electrical current, then heating', 'radiation only', 'sound only', 'magnetism only', 'Electricity heats the element, which heats the water.'],
  ], () => {
    const tin = pick([100, 200, 400, 500, 1000]), pct = pick([10, 20, 25, 40, 50, 60, 75, 80, 90]);
    return { q: `A motor takes in ${tin} J and gives out ${tin * pct / 100} J of useful energy. What is its efficiency, as a percentage?`, a: pct, u: '%', s: `${tin * pct / 100} ÷ ${tin} = ${pct / 100} = ${pct}%` };
  }, 3),
},
{
  id: 's9', title: 'Moving in and out of cells', sub: 'Biology: diffusion, osmosis and active transport',
  lesson: `${ul(['<b>Diffusion:</b> particles spread from where there are lots of them (high concentration) to where there are few (low concentration). No energy needed. Example: oxygen moving into blood in the lungs.', '<b>Osmosis:</b> the diffusion of <b>water</b> across a partially permeable membrane, from a dilute solution to a more concentrated one.', '<b>Active transport:</b> moving particles from low to high concentration, against the gradient. It <b>needs energy</b> from respiration. Example: plant roots taking in minerals from soil.'])}
<p>Diffusion is <b>faster</b> when it’s warmer (particles move faster) and when there’s a bigger difference in concentration.</p>
${slip('Diffusion and osmosis don’t need energy. Active transport does.')}`,
  make: fromBank([
    ['Particles spreading from high to low concentration is…', 'diffusion', 'active transport', 'respiration', 'photosynthesis', 'That’s the definition of diffusion.'],
    ['Osmosis is the movement of…', 'water', 'oxygen', 'glucose', 'minerals', 'Osmosis is specifically about water.'],
    ['Osmosis happens across a…', 'partially permeable membrane', 'cell wall only', 'solid barrier', 'nucleus', 'The membrane lets water through but not everything.'],
    ['Which process needs energy?', 'Active transport', 'Diffusion', 'Osmosis', 'None of them', 'It moves particles against the concentration gradient.'],
    ['Active transport moves particles from…', 'low to high concentration', 'high to low concentration', 'nowhere', 'only into the nucleus', 'Against the gradient, which needs energy.'],
    ['Plant roots take in minerals from the soil by…', 'active transport', 'osmosis', 'photosynthesis', 'evaporation', 'Minerals are often more concentrated inside the root.'],
    ['Oxygen moving from the lungs into the blood is an example of…', 'diffusion', 'active transport', 'osmosis', 'digestion', 'There is more oxygen in the lungs than in the blood arriving there.'],
    ['Where does the energy for active transport come from?', 'Respiration', 'Photosynthesis', 'Osmosis', 'Sunlight directly', 'Respiration releases energy in cells.'],
    ['Diffusion is faster when…', 'it is warmer', 'it is colder', 'particles are bigger', 'there is less difference in concentration', 'Warmer particles move faster.'],
    ['A plant cell placed in pure water will…', 'take in water by osmosis', 'lose water', 'stay exactly the same', 'make glucose', 'Water moves into the more concentrated cell contents.'],
  ]),
},
];
