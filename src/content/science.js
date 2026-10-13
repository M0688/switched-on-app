/* Science (IGCSE Double Award, Edexcel 4SD0), Week 1 foundations. */
import { r, pick, fromBank, mixed, ex, slip, ul, table } from './kit.js';

const S = [
{
  id: 's1', title: 'Units and prefixes', sub: 'Physics: measuring things properly',
  lesson: `<p>Every measurement in science needs a number <b>and a unit</b>. "5" means nothing; "5 m" is a length.</p>
${table(['Quantity', 'Unit', 'Symbol'], [['Length', 'metre', 'm'], ['Mass', 'kilogram', 'kg'], ['Time', 'second', 's'], ['Current', 'ampere (amp)', 'A'], ['Temperature', 'degree Celsius', '°C'], ['Energy', 'joule', 'J'], ['Force', 'newton', 'N']])}
<h3>Prefixes</h3>
${ul(['<b>kilo</b> (k) = × 1000. 2 km = 2000 m', '<b>milli</b> (m) = ÷ 1000. 500 mA = 0.5 A', '<b>mega</b> (M) = × 1 000 000. 3 MW = 3 000 000 W', '<b>centi</b> (c) = ÷ 100. 150 cm = 1.5 m'])}
${ex('Worked example', 'Convert 2500 g to kg.', 'kilo means 1000, so divide by 1000.', '2500 ÷ 1000 = <b>2.5 kg</b>')}
${slip('Small unit to big unit: divide. Big unit to small unit: multiply.')}`,
  make: mixed([
    ['What is the unit of mass?', 'kilogram (kg)', 'newton (N)', 'metre (m)', 'joule (J)', 'Mass is in kg. Weight is a force, in newtons.'],
    ['What is the unit of energy?', 'joule (J)', 'watt (W)', 'newton (N)', 'amp (A)', 'Energy is measured in joules.'],
    ['What is the unit of force?', 'newton (N)', 'joule (J)', 'kilogram (kg)', 'second (s)', 'Force is in newtons.'],
    ['"kilo" means…', '× 1000', '÷ 1000', '× 100', '× 1 000 000', '1 km = 1000 m.'],
    ['"milli" means…', '÷ 1000', '× 1000', '÷ 100', '× 1 000 000', '1 mm = 0.001 m.'],
    ['"mega" means…', '× 1 000 000', '× 1000', '÷ 1000', '× 100', 'A megawatt is a million watts.'],
    ['Which is the largest?', '1 km', '1 m', '1 cm', '1 mm', 'A kilometre is 1000 metres.'],
    ['Why must measurements have units?', 'The number means nothing without one', 'To make them longer', 'Only for exams', 'They don’t need them', '5 could be 5 mm or 5 km.'],
  ], () => {
    const t = r(0, 3);
    if (t === 0) { const g = r(11, 95) * 100; return { q: `Convert ${g} g to kg.`, a: g / 1000, u: 'kg', s: `Divide by 1000: ${g} ÷ 1000 = ${g / 1000} kg` }; }
    if (t === 1) { const k = r(2, 9) + pick([0, 0.5]); return { q: `Convert ${k} km to m.`, a: k * 1000, u: 'm', s: `Multiply by 1000: ${k} × 1000 = ${k * 1000} m` }; }
    if (t === 2) { const m = r(1, 9) * 100; return { q: `Convert ${m} mA to A.`, a: m / 1000, u: 'A', s: `Divide by 1000: ${m} ÷ 1000 = ${m / 1000} A` }; }
    const c = r(12, 45) * 10; return { q: `Convert ${c} cm to m.`, a: c / 100, u: 'm', s: `Divide by 100: ${c} ÷ 100 = ${c / 100} m` };
  }),
},
{
  id: 's2', title: 'Electric circuits', sub: 'Physics: current, charge, voltage and energy',
  lesson: `<p>Electricity flows round a complete loop called a <b>circuit</b>. Voltage is the push, current is the flow (see the Electrical lessons “What is electricity?” and “Volts, amps and watts” if this is new).</p>
<p>Current is the <b>rate of flow of charge</b>: how much charge passes each second. Charge is measured in <b>coulombs (C)</b>. 1 amp = 1 coulomb per second.</p>
${table(['Equation', 'Meaning'], [['Q = I × t', 'charge (C) = current (A) × time (s)'], ['V = I × R', 'voltage (V) = current (A) × resistance (Ω)'], ['P = I × V', 'power (W) = current (A) × voltage (V)'], ['E = I × V × t', 'energy (J) = current × voltage × time (s)']])}
${ul(['An <b>ammeter</b> measures current. It goes <b>in series</b> (in the loop).', 'A <b>voltmeter</b> measures voltage. It goes <b>in parallel</b> (across the component).', 'In a <b>series</b> circuit, the current is the same everywhere.', 'In a <b>parallel</b> circuit, each branch has the full voltage.'])}
${ex('Worked example', 'A current of 2 A flows for 30 s. How much charge flows?', 'Q = I × t = 2 × 30 = <b>60 C</b>')}
${slip('Time must be in seconds. 2 minutes = 120 s.')}`,
  make: mixed([
    ['Charge is measured in…', 'coulombs (C)', 'amps (A)', 'volts (V)', 'watts (W)', 'Q is in coulombs.'],
    ['An ammeter is connected…', 'in series', 'in parallel', 'either way', 'outside the circuit', 'Current has to flow through it to be measured.'],
    ['A voltmeter is connected…', 'in parallel, across the component', 'in series', 'to the battery only', 'anywhere', 'It compares the two sides of a component.'],
    ['In a series circuit, the current…', 'is the same everywhere', 'is biggest at the end', 'splits between paths', 'is zero', 'There’s only one path.'],
    ['In a parallel circuit, each branch gets…', 'the full supply voltage', 'half the voltage', 'no voltage', 'the same current as the battery', 'That’s why houses are wired in parallel.'],
    ['Current is…', 'the rate of flow of charge', 'the push on charge', 'stored energy', 'the same as resistance', 'One amp is one coulomb per second.'],
  ], () => {
    const t = r(0, 2);
    if (t === 0) { const I = r(2, 9), s = r(2, 12) * 5; return { q: `A current of ${I} A flows for ${s} s. Use Q = I × t to find the charge.`, a: I * s, u: 'C', s: `Q = ${I} × ${s} = ${I * s} C` }; }
    if (t === 1) { const I = r(2, 5), m = r(1, 4); return { q: `A current of ${I} A flows for ${m} minute${m > 1 ? 's' : ''}. Find the charge in coulombs.`, a: I * m * 60, u: 'C', s: `${m} min = ${m * 60} s. Q = ${I} × ${m * 60} = ${I * m * 60} C` }; }
    const I = r(1, 5), V = pick([6, 12]), s = r(2, 10) * 10; return { q: `A ${V} V lamp draws ${I} A for ${s} s. Use E = I × V × t to find the energy.`, a: I * V * s, u: 'J', s: `E = ${I} × ${V} × ${s} = ${I * V * s} J` };
  }, 3),
},
{
  id: 's3', title: 'States of matter', sub: 'Chemistry: solids, liquids and gases',
  lesson: `${table(['State', 'Arrangement', 'Movement'], [['Solid', 'Packed tightly in a regular pattern', 'Vibrate on the spot'], ['Liquid', 'Close together, random', 'Slide past each other'], ['Gas', 'Far apart, random', 'Move quickly in all directions']])}
<h3>Changes of state</h3>
${ul(['Solid → liquid: <b>melting</b>', 'Liquid → gas: <b>boiling</b> or <b>evaporating</b>', 'Gas → liquid: <b>condensing</b>', 'Liquid → solid: <b>freezing</b>', 'Solid → gas directly: <b>sublimation</b>'])}
<p><b>Diffusion</b> is particles spreading out from where there are lots of them to where there are fewer. It's fastest in gases. That's why you smell food from another room.</p>
${slip('Heating gives particles more energy, so they move more. It doesn’t make the particles themselves bigger.')}`,
  make: fromBank([
    ['In which state are particles in a regular pattern, vibrating on the spot?', 'Solid', 'Liquid', 'Gas', 'All of them', 'Solids keep their shape because particles are held in place.'],
    ['In which state are particles far apart and moving quickly?', 'Gas', 'Solid', 'Liquid', 'None', 'Gases fill their container.'],
    ['Liquid particles…', 'are close together and slide past each other', 'are far apart', 'don’t move', 'are in rows', 'That’s why liquids flow but keep their volume.'],
    ['Solid to liquid is called…', 'melting', 'freezing', 'condensing', 'boiling', 'Ice melts into water.'],
    ['Gas to liquid is called…', 'condensing', 'evaporating', 'melting', 'sublimation', 'Steam condenses on a cold window.'],
    ['Liquid to solid is called…', 'freezing', 'melting', 'boiling', 'condensing', 'Water freezes into ice.'],
    ['Solid straight to gas is called…', 'sublimation', 'condensing', 'diffusion', 'freezing', 'Dry ice sublimes.'],
    ['Diffusion is fastest in…', 'gases', 'solids', 'liquids', 'it’s the same in all', 'Gas particles move fastest and have most space.'],
    ['What happens to particles when a substance is heated?', 'They gain energy and move more', 'They get bigger', 'They stop moving', 'They disappear', 'More energy means more movement.'],
    ['Smelling perfume across a room is an example of…', 'diffusion', 'melting', 'condensing', 'freezing', 'Perfume particles spread out through the air.'],
  ]),
},
{
  id: 's4', title: 'Atoms, elements and compounds', sub: 'Chemistry: what everything is made of',
  lesson: `<p>Everything is made of tiny <b>atoms</b>. An atom has a <b>nucleus</b> (protons and neutrons) with <b>electrons</b> around it.</p>
${table(['Particle', 'Charge', 'Mass', 'Where'], [['Proton', '+1', '1', 'Nucleus'], ['Neutron', '0', '1', 'Nucleus'], ['Electron', '−1', 'almost 0', 'Shells around the nucleus']])}
${ul(['<b>Element:</b> only one type of atom (e.g. copper, Cu; oxygen, O).', '<b>Compound:</b> two or more elements chemically joined (e.g. water, H₂O).', '<b>Mixture:</b> substances together but not chemically joined (e.g. air, sea water). Easy to separate.'])}
${ex('Atomic number', 'The atomic number is the number of protons.', 'Carbon has atomic number 6, so every carbon atom has 6 protons.', 'Atoms are neutral, so it also has 6 electrons.')}`,
  make: fromBank([
    ['What charge does a proton have?', '+1', '−1', '0', '+2', 'Protons are positive.'],
    ['What charge does an electron have?', '−1', '+1', '0', '−2', 'Electrons are negative.'],
    ['What charge does a neutron have?', '0', '+1', '−1', '+2', 'Neutrons are neutral.'],
    ['Where are protons and neutrons found?', 'In the nucleus', 'In shells', 'Outside the atom', 'Only in metals', 'The nucleus is the tiny centre of the atom.'],
    ['An element contains…', 'only one type of atom', 'two elements joined', 'a mixture of substances', 'no atoms', 'Copper contains only copper atoms.'],
    ['Water (H₂O) is a…', 'compound', 'element', 'mixture', 'metal', 'Hydrogen and oxygen are chemically joined.'],
    ['Air is a…', 'mixture', 'compound', 'element', 'metal', 'Nitrogen, oxygen and other gases aren’t chemically joined.'],
    ['The atomic number tells you the number of…', 'protons', 'neutrons', 'shells', 'molecules', 'Every atom of an element has the same number of protons.'],
    ['Sodium has atomic number 11. How many electrons does a sodium atom have?', '11', '22', '1', '23', 'Atoms are neutral, so electrons = protons.'],
    ['Which particle has almost no mass?', 'Electron', 'Proton', 'Neutron', 'Nucleus', 'An electron is about 1/2000 of a proton’s mass.'],
    ['What is the symbol for copper?', 'Cu', 'Co', 'C', 'Cp', 'From its Latin name, cuprum.'],
  ]),
},
{
  id: 's5', title: 'Living organisms', sub: 'Biology: what makes something alive',
  lesson: `<p>All living organisms share some characteristics. The IGCSE course lists these:</p>
${ul(['<b>Nutrition:</b> taking in materials for energy and growth', '<b>Respiration:</b> releasing energy from food', '<b>Excretion:</b> getting rid of waste made by the body', '<b>Response:</b> reacting to surroundings', '<b>Movement:</b> moving all or part of themselves', '<b>Control of internal conditions:</b> e.g. keeping temperature steady', '<b>Reproduction:</b> making more of the same kind', '<b>Growth and development</b>'])}
${ex('Remembering them', 'One way: "MRS C GREN" – Movement, Respiration, Sensitivity (response), Control, Growth, Reproduction, Excretion, Nutrition.')}
${slip('Respiration is not breathing. It’s the chemical reaction in cells that releases energy.')}`,
  make: fromBank([
    ['Releasing energy from food in cells is called…', 'respiration', 'breathing', 'excretion', 'nutrition', 'Respiration happens in every living cell.'],
    ['Getting rid of waste made by the body is…', 'excretion', 'respiration', 'reproduction', 'growth', 'For example, removing carbon dioxide and urea.'],
    ['Reacting to changes in surroundings is…', 'response (sensitivity)', 'movement', 'nutrition', 'growth', 'A plant bending towards light is responding.'],
    ['Taking in materials for energy and growth is…', 'nutrition', 'excretion', 'respiration', 'response', 'Plants make food; animals eat it.'],
    ['Keeping body temperature steady is an example of…', 'control of internal conditions', 'reproduction', 'excretion', 'movement', 'Your body keeps itself at about 37°C.'],
    ['Is respiration the same as breathing?', 'No, it’s a reaction in cells', 'Yes, exactly the same', 'Only in plants', 'Only in fish', 'Breathing moves air; respiration releases energy.'],
    ['Which of these is NOT a characteristic of all living things?', 'Speaking', 'Growth', 'Reproduction', 'Respiration', 'Plants and bacteria are alive but don’t speak.'],
    ['A car moves and uses fuel. Why isn’t it alive?', 'It can’t grow or reproduce', 'It moves', 'It uses energy', 'It is made of metal only', 'It must show all the characteristics.'],
    ['Making more of the same kind of organism is…', 'reproduction', 'growth', 'nutrition', 'response', 'Without reproduction a species dies out.'],
    ['Plants can move parts of themselves, e.g.…', 'flowers opening and closing', 'walking', 'swimming', 'they can’t move at all', 'Movement doesn’t have to mean walking.'],
  ]),
},
{
  id: 's6', title: 'Cells', sub: 'Biology: animal and plant cells',
  lesson: `${table(['Part', 'Job', 'Animal', 'Plant'], [['Nucleus', 'Controls the cell; contains genetic material', '✓', '✓'], ['Cytoplasm', 'Where most reactions happen', '✓', '✓'], ['Cell membrane', 'Controls what goes in and out', '✓', '✓'], ['Mitochondria', 'Where aerobic respiration happens', '✓', '✓'], ['Ribosomes', 'Make proteins', '✓', '✓'], ['Cell wall', 'Made of cellulose; supports the cell', '', '✓'], ['Chloroplasts', 'Photosynthesis (contain chlorophyll)', '', '✓'], ['Vacuole', 'Contains cell sap; keeps cell firm', '', '✓']])}
${ex('Levels of organisation', 'cells → tissues → organs → organ systems → organism', 'e.g. muscle cells → muscle tissue → heart → circulatory system → you')}
${slip('Plant cells have a cell wall AND a cell membrane. The wall is outside the membrane.')}`,
  make: fromBank([
    ['Which part controls the cell?', 'Nucleus', 'Cytoplasm', 'Vacuole', 'Cell wall', 'The nucleus contains the genetic material.'],
    ['Where does aerobic respiration happen?', 'Mitochondria', 'Chloroplasts', 'Nucleus', 'Vacuole', 'Mitochondria release energy.'],
    ['Where does photosynthesis happen?', 'Chloroplasts', 'Mitochondria', 'Ribosomes', 'Nucleus', 'Chloroplasts contain green chlorophyll.'],
    ['What do ribosomes do?', 'Make proteins', 'Store sap', 'Control the cell', 'Photosynthesise', 'Proteins are built at ribosomes.'],
    ['Which is found in plant cells but NOT animal cells?', 'Cell wall', 'Nucleus', 'Cell membrane', 'Mitochondria', 'Plant cells also have chloroplasts and a permanent vacuole.'],
    ['What is the plant cell wall made of?', 'Cellulose', 'Protein', 'Fat', 'Chlorophyll', 'Cellulose is strong and supports the cell.'],
    ['What does the cell membrane do?', 'Controls what goes in and out', 'Makes proteins', 'Contains chlorophyll', 'Supports the cell', 'It’s a barrier that lets some things through.'],
    ['What is the correct order?', 'cell → tissue → organ → organ system', 'organ → cell → tissue → system', 'tissue → cell → organ → system', 'system → organ → cell → tissue', 'Small to big: cells make tissues, tissues make organs.'],
    ['The heart is an example of…', 'an organ', 'a cell', 'a tissue', 'an organism', 'Organs are made of several tissues working together.'],
    ['Where do most chemical reactions in the cell happen?', 'Cytoplasm', 'Cell wall', 'Vacuole', 'Membrane', 'The cytoplasm is the jelly where reactions take place.'],
  ]),
},
];

export default S;
