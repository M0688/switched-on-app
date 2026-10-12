/* Electrical Installation, Week 2: tools, circuits in a home, and testing. */
import { fromBank, ex, slip, ul, table } from './kit.js';

export default [
{
  id: 's7', title: 'Tools of the trade', sub: 'Hand tools and test equipment',
  lesson: `${table(['Tool', 'What it’s for'], [
    ['Insulated (VDE) screwdrivers', 'Terminals and fixings; insulated to 1000 V as an extra safety layer'],
    ['Wire strippers', 'Removing insulation without nicking the copper'],
    ['Side cutters', 'Cutting cable cleanly'],
    ['Crimping tool', 'Fitting crimp connectors and lugs'],
    ['Cable and pipe detector', 'Finding hidden cables and pipes before drilling'],
    ['Approved voltage indicator + proving unit', 'Safe isolation: proving a circuit is dead'],
    ['Multifunction tester (MFT)', 'Testing a finished installation: continuity, insulation resistance, RCDs and more'],
    ['Spirit level', 'Fitting sockets, switches and boards straight'],
  ])}
${slip('Insulated tools are an extra safeguard, not permission to work live. Always isolate first.')}`,
  make: fromBank([
    ['Which tool do you use before drilling into a wall?', 'Cable and pipe detector', 'Side cutters', 'Crimping tool', 'Spirit level', 'It finds hidden cables and pipes so you don’t drill into them.'],
    ['Insulated (VDE) screwdrivers are rated to…', '1000 V', '12 V', '50 V', '100,000 V', 'They’re tested to 1000 V as an extra safety layer.'],
    ['Do insulated tools make live working safe?', 'No, always isolate first', 'Yes, always', 'Only on lighting circuits', 'Only if you wear gloves', 'They are a backup, not a replacement for safe isolation.'],
    ['Which tool removes insulation from a cable?', 'Wire strippers', 'Spirit level', 'Proving unit', 'Cable detector', 'Strippers remove insulation without damaging the copper.'],
    ['A multifunction tester (MFT) is used to…', 'test a finished installation', 'cut cable', 'find studs in walls', 'tighten terminals', 'It carries out the tests needed before an installation is used.'],
    ['Which tool fits connectors onto the end of a cable?', 'Crimping tool', 'Side cutters', 'Spirit level', 'Voltage indicator', 'Crimpers squeeze connectors tightly onto the conductor.'],
    ['What is a proving unit used with?', 'An approved voltage indicator', 'A drill', 'A spirit level', 'Wire strippers', 'It checks the tester works before and after proving dead.'],
    ['Why use a spirit level when fitting a socket?', 'So it’s fitted straight', 'To test the voltage', 'To find cables', 'To cut the box', 'A level gives a neat, professional finish.'],
    ['Nicking the copper while stripping cable can…', 'weaken it and cause overheating', 'make it stronger', 'improve the connection', 'make no difference', 'A damaged conductor can break or overheat.'],
  ]),
},
{
  id: 's8', title: 'Circuits in a home', sub: 'Lighting, sockets and high-power radials',
  lesson: `<p>A home is split into separate <b>circuits</b>, each with its own protective device in the consumer unit. If one circuit has a fault, the others keep working.</p>
${table(['Circuit', 'Typical protective device', 'Typical cable'], [
    ['Lighting (radial)', '6 A MCB', '1.0 mm² or 1.5 mm²'],
    ['Sockets (ring final)', '32 A MCB', '2.5 mm²'],
    ['Cooker or electric shower (radial)', 'Higher rating, e.g. 32 A or 40 A', 'Thicker, e.g. 6 mm² or 10 mm²'],
  ])}
${ul(['A <b>radial</b> circuit runs out from the consumer unit and ends at the last point.', 'A <b>ring final</b> circuit loops out and back to the consumer unit, so current has two paths to each socket.'])}
${slip('These are typical values. The real design depends on the load, cable length and how it’s installed. That’s what BS 7671 calculations are for.')}`,
  make: fromBank([
    ['Why is a house split into several circuits?', 'A fault on one doesn’t switch everything off', 'It uses less cable', 'It’s cheaper', 'So lights are brighter', 'Separate circuits limit the effect of a fault.'],
    ['A typical protective device for a lighting circuit is…', '6 A', '32 A', '100 A', '1 A', 'Lighting draws little current.'],
    ['A typical protective device for a socket ring final circuit is…', '32 A', '6 A', '3 A', '1000 A', 'A common rating for ring finals in UK homes.'],
    ['Socket ring final circuits are usually wired in…', '2.5 mm² cable', '0.5 mm² cable', '25 mm² cable', 'speaker wire', 'A common size for ring finals.'],
    ['A ring final circuit…', 'loops out and back to the consumer unit', 'ends at the last socket', 'only feeds lights', 'has no protective device', 'Current has two paths to each socket.'],
    ['A radial circuit…', 'runs out and ends at the last point', 'loops back to the start', 'has two paths to every point', 'is only for outdoors', 'Like a branch: it goes out and stops.'],
    ['An electric shower usually needs…', 'its own circuit with thicker cable', 'to share the lighting circuit', 'a plug and socket', '1.0 mm² cable', 'High power needs its own, heavier circuit.'],
    ['Why do high-power appliances need thicker cable?', 'More current would overheat thin cable', 'Thick cable looks better', 'It’s required for plugs', 'To reduce voltage', 'Thicker conductors carry more current safely.'],
    ['Where are each circuit’s protective devices?', 'In the consumer unit', 'In each light switch', 'In the meter', 'At the socket', 'The consumer unit holds the MCBs or RCBOs.'],
  ]),
},
{
  id: 's9', title: 'Inspection and testing', sub: 'Proving an installation is safe',
  lesson: `<p>BS 7671 requires every new installation to be <b>inspected and tested</b> before it’s put into use, and existing ones to be checked from time to time.</p>
${ul(['<b>EIC</b> (Electrical Installation Certificate): issued for new work.', '<b>EICR</b> (Electrical Installation Condition Report): a periodic check of an existing installation. In England, privately rented homes need one at least every 5 years.', '<b>Inspection</b> comes first: looking for damage, missing covers, wrong cable sizes, signs of overheating.'])}
${ex('Testing order (simplified)', 'Dead tests first, with the supply isolated: continuity of protective conductors, ring continuity, insulation resistance, polarity.', 'Then live tests: earth fault loop impedance and RCD operation.')}
${slip('Dead tests come first so faults are found before the power is switched on.')}`,
  make: fromBank([
    ['New electrical work gets an…', 'Electrical Installation Certificate (EIC)', 'MOT', 'EICR', 'gas safety certificate', 'An EIC confirms new work was designed, installed and tested correctly.'],
    ['A periodic check of an existing installation produces an…', 'EICR', 'EIC', 'invoice', 'energy rating', 'Electrical Installation Condition Report.'],
    ['In England, privately rented homes need an EICR at least every…', '5 years', '20 years', '6 months', '50 years', 'Landlords must have the electrics checked at least every 5 years.'],
    ['What comes first?', 'Inspection (looking)', 'Live testing', 'Switching everything on', 'Painting', 'You look for obvious problems before testing.'],
    ['Why are dead tests done before live tests?', 'To find faults before the power goes on', 'They’re quicker', 'It doesn’t matter', 'Live tests need no power', 'Switching on a faulty circuit could be dangerous.'],
    ['Insulation resistance testing checks that…', 'current can’t leak between conductors', 'the lights are bright', 'the socket is straight', 'the meter is accurate', 'Good insulation keeps current where it should be.'],
    ['Polarity testing checks that…', 'line is connected to the right terminals', 'cables are the right colour paint', 'sockets are level', 'the fuse is 13 A', 'Switches and fuses must be in the line conductor.'],
    ['An RCD test checks that the RCD…', 'trips quickly enough', 'is the right colour', 'is labelled', 'is expensive', 'It must disconnect fast to protect people.'],
    ['Which tool is used for most of these tests?', 'Multifunction tester', 'Spirit level', 'Hacksaw', 'Cable detector', 'An MFT can do continuity, insulation, loop and RCD tests.'],
  ]),
},
];
