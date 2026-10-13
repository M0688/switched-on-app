/* Circuit board repair, Thursday track: soldering and rework. */
import { fromBank, ex, slip, ul, table } from '../kit.js';

export default [
{
  id: 'r1', level: 1, title: 'ESD and bench safety', sub: 'Static, fumes, lead, heat and batteries',
  lesson: `<h3>Static (ESD)</h3>
${ul(['ESD damage is often <b>invisible</b>, and can weaken a part so it fails weeks later.', 'Wear a wrist strap connected to earth through a <b>1 MΩ resistor</b>, and work on a grounded mat.', 'Store and move boards in <b>static-shielding</b> bags. Dry air makes static worse.', 'Handle boards by the edges.'])}
<h3>Your health</h3>
${ul(['Rosin (colophony) flux fumes can cause <b>occupational asthma</b>. Use fume extraction; in the UK this falls under COSHH.', 'Wash your hands after handling leaded solder; no food or drink on the bench.', 'Wear eye protection when clipping leads or using chemicals.'])}
<h3>Heat and batteries</h3>
${ul(['Disconnect the battery before board work.', 'IPA is flammable: let it evaporate before using hot air.', 'Never puncture or bend a Li-ion battery; remove swollen ones carefully.'])}
${slip('A wrist strap wired straight to earth with no resistor is a shock hazard if you touch something live.')}`,
  make: fromBank([
    ['An ESD wrist strap connects to earth through…', 'a 1 MΩ resistor', 'a direct wire with no resistor', 'a fuse', 'a capacitor', 'Drains static slowly and protects you from shock.'],
    ['ESD damage can be…', 'invisible and cause failures later', 'always obvious straight away', 'only a mains problem', 'impossible on phones', 'Latent damage weakens parts.'],
    ['Rosin (colophony) flux fumes are a known cause of…', 'occupational asthma', 'better eyesight', 'nothing', 'hearing loss', 'Use fume extraction.'],
    ['Why disconnect the battery before working on a phone board?', 'To avoid shorts and damage while working', 'To make it lighter', 'To reset the clock', 'It isn’t necessary', 'Battery power plus a slipped tool means damage.'],
    ['IPA near a hot air station is a risk because…', 'it is flammable', 'it is conductive', 'it melts solder', 'it freezes', 'Let it evaporate first.'],
    ['Sensitive boards should be stored and moved in…', 'static-shielding bags', 'ordinary plastic bags', 'bubble wrap only', 'food foil', 'Shielding bags block static fields.'],
    ['After handling leaded solder you should…', 'wash your hands before eating or drinking', 'do nothing', 'wipe them on your clothes', 'only wear gloves next time', 'Lead is absorbed by swallowing.'],
    ['Low humidity makes ESD…', 'more likely', 'less likely', 'impossible', 'irrelevant', 'Dry air lets charge build up.'],
    ['A swollen Li-ion battery should be…', 'removed carefully without puncturing, stored safely and recycled', 'pressed flat', 'charged to test it', 'pierced to release gas', 'Puncture can cause fire.'],
    ['Eye protection is wise when…', 'clipping leads or using chemicals', 'reading schematics', 'using a multimeter only', 'never', 'Clipped leads fly.'],
    ['Why handle boards by the edges?', 'To avoid touching pins and sensitive parts', 'They’re stronger there', 'Fingerprints help solder', 'No reason', 'Less ESD and contamination.'],
    ['A good ESD-safe bench has…', 'a grounded mat and a wrist strap point', 'carpet', 'a plastic sheet', 'bare metal tied directly to mains earth', 'Mats bleed charge slowly through resistance.'],
  ]),
},
{
  id: 'r2', level: 1, title: 'Solder, flux and the iron', sub: 'Alloys, temperatures and good joints',
  lesson: `${table(['Solder', 'Melts at', 'Notes'], [['Sn63/Pb37 (leaded)', '183 °C', 'Eutectic: melts and sets at one temperature. Easy to work.'], ['SAC305 (lead-free)', 'about 217–220 °C', 'Used on most modern boards. Duller finish is normal.']])}
${ul(['<b>Flux</b> removes oxides so solder wets the metal. No flux, no good joint.', '<b>No-clean</b> flux residue is designed to be left, but many clean it for inspection. <b>Water-soluble</b> flux must be washed off.', 'Adding leaded solder to a lead-free joint <b>lowers the melting point</b>, making removal easier.', 'Typical iron temperatures are around 320–380 °C. Use the right tip size rather than cranking up the heat.', 'Keep the tip tinned; clean on brass wool, which doesn’t thermally shock the tip like a wet sponge.'])}
${ex('Good joint vs bad', 'Good: smooth, concave fillet, solder wetted onto the pad and lead', 'Cold: dull and grainy (on leaded), lumpy or balled, unreliable')}
${slip('Too much heat for too long lifts pads. More heat capacity (bigger tip, preheat) beats more temperature.')}`,
  make: fromBank([
    ['Sn63/Pb37 leaded solder melts at about…', '183 °C', '217 °C', '300 °C', '120 °C', 'It is eutectic.'],
    ['SAC305 lead-free solder melts at about…', '217–220 °C', '183 °C', '150 °C', '350 °C', 'Higher than leaded.'],
    ['The main job of flux is to…', 'remove oxides so solder wets the metal', 'add strength', 'insulate joints', 'cool the iron', 'Clean metal plus flux = good wetting.'],
    ['Adding leaded solder to a lead-free joint before removing a part…', 'lowers the melting point and makes removal easier', 'raises the melting point', 'has no effect', 'always damages the pad', 'Many repairers do this on purpose.'],
    ['Water-soluble flux must be…', 'washed off after use', 'left on', 'heated again', 'taped over', 'Its residues are corrosive.'],
    ['Why tin the iron tip?', 'It protects it and improves heat transfer', 'It cools it', 'For looks', 'To make it lead-free', 'Oxidised tips don’t transfer heat.'],
    ['A good joint usually looks…', 'smooth with a concave fillet', 'lumpy and balled', 'grainy and dull on leaded solder', 'like a sphere on the pad', 'Smooth wetting shows a good bond.'],
    ['A cold joint is often…', 'dull, grainy or lumpy, and unreliable', 'very shiny and smooth', 'stronger than normal', 'impossible', 'Not enough heat, or movement while cooling.'],
    ['To remove solder from pads, use…', 'solder wick with flux', 'a screwdriver', 'sandpaper', 'IPA alone', 'Wick soaks up solder.'],
    ['Turning the iron right up to make a small tip handle a big joint…', 'risks lifting pads and damaging parts', 'is best practice', 'is safe and quick', 'is required for lead-free', 'Use a bigger tip or preheat.'],
    ['No-clean flux residue…', 'is designed to be safe to leave, though many clean it off', 'must always be washed', 'is highly conductive', 'contains lead', 'Cleaning helps inspection.'],
    ['Brass wool is preferred to a wet sponge because…', 'it cleans without thermal shock to the tip', 'it adds solder', 'it’s cheaper only', 'it cools the tip more', 'Wet sponges shorten tip life.'],
  ]),
},
{
  id: 'r3', level: 2, title: 'Hot air rework', sub: 'Removing and fitting SMD parts cleanly',
  lesson: `${ul(['<b>Flux first</b>: it helps heat transfer and flow.', '<b>Low airflow</b> for small parts, or you’ll blow them away.', '<b>Shield</b> plastic connectors, cameras and nearby parts with Kapton tape or foil.', '<b>Preheat</b> from below on thick boards with big ground planes: less warping, less top heat needed.', 'Move the nozzle in small circles. Don’t hold it on one spot.', 'Lift only when the solder flows and the part moves freely with a gentle nudge. Never force it.'])}
<h3>Fitting</h3>
${ul(['Clean pads flat with wick and flux, then tin lightly.', 'Place, flux, heat evenly. <b>Surface tension</b> pulls small parts into line.', 'Uneven heating makes one end melt first: <b>tombstoning</b>.'])}
${slip('Underfill under phone chips must be softened and picked away slowly. Rushing it rips pads.')}`,
  make: fromBank([
    ['Why use low airflow on small parts?', 'High airflow can blow them away', 'It heats faster', 'It isn’t important', 'It cools faster', 'Small passives scatter easily.'],
    ['Kapton tape or foil is used to…', 'shield nearby heat-sensitive parts', 'add solder', 'conduct heat into the part', 'mark pin 1', 'Protect plastic and cameras.'],
    ['A preheater helps by…', 'reducing thermal shock and the top heat needed', 'cooling the board', 'adding flux', 'measuring temperature only', 'Especially on thick boards.'],
    ['A part is ready to lift when…', 'the solder flows and it moves freely with a gentle nudge', 'it starts smoking', 'exactly 10 seconds have passed', 'the board turns brown', 'Forcing it rips pads.'],
    ['Surface tension during reflow…', 'helps small parts self-align', 'pulls parts off', 'cools the solder', 'has no effect', 'Liquid solder pulls the part to its pads.'],
    ['Tombstoning is caused by…', 'one end melting or wetting before the other', 'too much flux only', 'leaded solder', 'pin 1 errors', 'Heat evenly with equal solder on both pads.'],
    ['Plastic connectors near the work…', 'can melt, so shield or remove them', 'are heat-proof', 'help spread heat', 'don’t matter', 'Shield them.'],
    ['Underfill under a chip…', 'glues it down and must be softened and removed carefully', 'is a type of solder', 'makes removal easy', 'is flux', 'Common under phone processors and storage.'],
    ['Before fitting a new part, prepare the pads by…', 'cleaning flat with wick and flux, then tinning', 'scratching them', 'covering with tape', 'adding glue', 'Flat, clean pads let it sit level.'],
    ['Holding the nozzle still on one spot…', 'can overheat that spot; move in small circles', 'is best', 'makes no difference', 'saves time safely', 'Spread the heat.'],
    ['The board warps during rework. The likely cause is…', 'uneven or excessive heat without support or preheat', 'too little flux', 'leaded solder', 'ESD', 'Support and preheat the board.'],
    ['Why add fresh flux before removing a part with hot air?', 'It helps heat transfer and solder flow', 'It cools the part', 'It stops ESD', 'It isn’t needed', 'Old solder is oxidised.'],
  ]),
},
{
  id: 'r4', level: 2, title: 'Drag soldering fine-pitch ICs', sub: 'Tacking, dragging, clearing bridges',
  lesson: `<ol style="margin:0;padding-left:1.3em;display:flex;flex-direction:column;gap:6px">
<li>Clean and flatten the pads with wick and flux.</li>
<li>Align the IC (pin 1!) and <b>tack two opposite corner pins</b>. Check alignment under the microscope; reheat and nudge if needed.</li>
<li>Apply <b>plenty of flux</b> along a row.</li>
<li>Load a hoof or mini-wave tip with a little solder and <b>drag</b> slowly along the pins. Flux and surface tension leave each pin soldered.</li>
<li>Clear any bridge with more flux and a clean tip, or wick.</li>
<li>Clean off the flux and inspect every pin; check adjacent pins for shorts with continuity.</li></ol>
<p><b>Pitch</b> is the distance between pin centres. Finer pitch, more care. Too much solder on QFN edge pads bridges underneath, where you can’t see it.</p>
${slip('Lead-free joints look duller than leaded ones. Judge the fillet shape and wetting, not the shine.')}`,
  make: fromBank([
    ['Drag soldering means…', 'dragging a loaded tip along a row of pins with plenty of flux', 'pulling a part off with pliers', 'using hot air only', 'a separate blob on each pin', 'Flux and surface tension do the work.'],
    ['The most important thing for drag soldering is…', 'plenty of flux', 'a very cold iron', 'lots of solder', 'no flux', 'Flux prevents bridges.'],
    ['A bridge between two pins can be cleared by…', 'adding flux and dragging a clean tip, or using wick', 'adding more solder only', 'cutting it with a knife', 'blowing on it', 'Flux lets surface tension pull the solder back.'],
    ['Before soldering a fine-pitch IC, tack it by…', 'soldering two opposite corner pins after aligning it', 'gluing it', 'soldering one whole side first', 'hot glue', 'Corners lock alignment.'],
    ['A hoof or mini-wave tip helps because…', 'it holds a small reservoir of solder for dragging', 'it is very sharp', 'it stays cold', 'it removes flux', 'Made for drag soldering.'],
    ['After soldering, check for bridges using…', 'a microscope and continuity between adjacent pins', 'smell', 'your thumbnail', 'nothing', 'Some bridges are hard to see.'],
    ['Pin pitch is…', 'the distance between centres of adjacent pins', 'the pin length', 'the pin angle', 'the pin count', 'Smaller pitch, more bridge risk.'],
    ['Misaligned by half a pin after tacking, the IC should be…', 'reheated and realigned before soldering the rest', 'left as it is', 'forced into place', 'glued', 'Fix it while only two pins are soldered.'],
    ['A dull lead-free fine-pitch joint…', 'can be normal; check the fillet and wetting', 'is always bad', 'means a bridge', 'means leaded solder', 'Lead-free is less shiny.'],
    ['Why clean flux off after fine-pitch work?', 'To inspect joints clearly', 'It strengthens joints', 'Flux is always conductive', 'Never clean it', 'Residue hides bridges and cracks.'],
    ['Solder paste is…', 'tiny solder balls mixed with flux', 'flux with no solder', 'glue', 'thermal grease', 'Used with stencils and hot air.'],
    ['Too much solder on QFN edge pads causes…', 'bridges under the part', 'better heat', 'only stronger joints', 'nothing', 'Hidden bridges are hard to find.'],
  ]),
},
{
  id: 'r5', level: 3, title: 'Microsoldering: pads and jumpers', sub: 'Rebuilding broken connections',
  lesson: `${ul(['Work under a <b>stereo microscope</b> (around 7–45×) for depth perception.', 'Use the <b>boardview</b> to find the next point on the broken net: a via, a component pad, a test point.', '<b>Scrape the solder mask</b> off the trace with a scalpel or fibreglass pen to expose copper, then tin it.', 'Use very fine <b>enamelled copper wire</b>. Strip the enamel at the ends (a hot tip with solder burns it off).', 'Solder the jumper, then <b>secure it</b> with UV-curing solder mask and cure with a UV lamp.', 'Confirm with continuity from pad to the far end of the net, then diode mode against a known-good reading.'])}
<p>Check the boardview first: a torn pad under an <b>NC</b> (no-connect) BGA ball usually doesn’t need rebuilding.</p>
${slip('Heavy ground pads soak up heat. Add heat capacity or preheat rather than just raising temperature.')}`,
  make: fromBank([
    ['A microsoldering jumper is usually…', 'very fine enamelled copper wire', 'mains cable', 'solder wick', 'aluminium foil', 'Fine enough to sit between parts.'],
    ['Before soldering to a trace, you must…', 'scrape away the solder mask to expose copper', 'apply glue', 'heat the board to 400 °C', 'nothing', 'Solder won’t stick to mask.'],
    ['UV-curing solder mask is used to…', 'insulate and secure jumpers and exposed copper', 'clean flux', 'remove solder', 'cool the board', 'Cure it with a UV lamp.'],
    ['To find where a missing pad’s trace goes, use…', 'the boardview or schematic to find the next point on the net', 'guesswork', 'X-ray only', 'the case colour', 'Any pad on the same net will do.'],
    ['Why secure a jumper wire?', 'So movement doesn’t break it or tear the pad', 'For looks', 'It conducts better', 'It isn’t needed', 'Flex and handling break loose jumpers.'],
    ['Enamel on jumper wire must be…', 'removed at the ends before soldering', 'kept on everywhere', 'painted over', 'stripped off the whole length', 'The enamel insulates the rest of the run.'],
    ['A stereo microscope is used because…', 'it gives depth perception for tiny parts', 'it shows X-rays', 'it measures voltage', 'it heats the board', 'You need to judge height and contact.'],
    ['After a jumper repair, confirm it by…', 'continuity from the pad to the far end of the net', 'looking only', 'powering on with no checks', 'adding more flux', 'Then compare a diode-mode reading.'],
    ['A torn pad under an NC (no-connect) BGA ball…', 'usually doesn’t need repairing', 'must always be rebuilt', 'means the chip is dead', 'shorts the board', 'Check the boardview: no net, no repair.'],
    ['Why is pad repair under BGA chips hard?', 'Pads are tiny, close together, and must be flat for the ball', 'They’re plastic', 'They’re too big', 'It isn’t', 'It needs great precision.'],
    ['Heavy ground pads take longer to heat because…', 'the copper plane pulls heat away', 'they’re insulated', 'they contain lead', 'they’re smaller', 'Add heat capacity or preheat.'],
    ['A good tip for microsoldering is…', 'a small conical or knife tip with good heat recovery', 'a large chisel only', 'a hot air nozzle', 'a screwdriver', 'Small, but able to deliver heat quickly.'],
  ]),
},
{
  id: 'r6', level: 3, title: 'BGA reflow and reballing', sub: 'Profiles, moisture, stencils and when it’s worth it',
  lesson: `${table(['Job', 'What it is', 'Reality'], [['Reflow', 'Heating the chip in place to remelt its joints', 'Often temporary: if the fault is inside the chip, it comes back'], ['Reball', 'Remove chip, clean pads, fit new balls with a stencil, refit', 'Fixes bad joints properly; doesn’t fix a failing die']])}
<h3>Profile</h3>
<p><b>Preheat → soak → reflow → cool.</b> For lead-free, the joints peak at roughly 230–250 °C, above SAC305’s 217–220 °C melting range. Use a <b>thermocouple</b> by the chip to know the real temperature, and <b>bottom heat</b> to limit warping.</p>
${ul(['<b>Bake</b> boards and chips first to drive out moisture, which can crack the package ("popcorning").', 'Use the correct <b>ball size</b> for the chip; wrong size causes bridges or opens.', 'Clean pads flat with wick and flux, without lifting any.', 'Align to the silkscreen outline and corner marks.', 'Phone boards often have underfill: removing it is where most pads are lost.'])}
${slip('Be honest with customers: a reflow may buy time rather than fix the fault for good.')}`,
  make: fromBank([
    ['Reballing means…', 'removing a BGA, cleaning it, fitting new balls and refitting it', 'heating the chip in place only', 'adding glue', 'replacing the board', 'A proper fix for bad joints.'],
    ['A reflow without reballing is often…', 'temporary, because the underlying fault remains', 'permanent', 'the best repair', 'a software fix', 'If the die is failing, heat only buys time.'],
    ['The stages of a reflow profile are…', 'preheat, soak, reflow, cool', 'cool, heat, cool', 'flux, wash, dry', 'one fast blast', 'Controlled stages avoid thermal shock.'],
    ['Why bake a board or chip before BGA work?', 'To drive out moisture that can crack the package', 'To clean it', 'To add solder', 'To cure underfill', 'Known as popcorning.'],
    ['A thermocouple near the chip is used to…', 'measure the real temperature during the profile', 'measure voltage', 'align the chip', 'hold the stencil', 'Set temperature isn’t joint temperature.'],
    ['Peak joint temperature for lead-free BGA reflow is typically about…', '230–250 °C', '150 °C', '183 °C exactly', '400 °C', 'Above SAC305’s melting range, not much more.'],
    ['A stencil is used in reballing to…', 'place balls accurately on each pad', 'remove underfill', 'cool the chip', 'test the chip', 'One ball per hole.'],
    ['Why heat the board from below during BGA work?', 'To reduce warping and the heat needed from above', 'To cool the chip', 'To add flux', 'It doesn’t help', 'Even heating, less stress.'],
    ['Using the wrong ball size can cause…', 'bridges or open joints', 'faster boot', 'better cooling', 'nothing', 'Match the chip’s spec.'],
    ['After removing a BGA, the pads should be…', 'cleaned flat with wick and flux, without lifting any', 'scraped with a knife', 'left with lumps of old solder', 'taped over', 'Flat pads for the new balls.'],
    ['When placing a BGA, alignment is checked using…', 'the silkscreen outline and corner marks', 'the chip’s colour', 'the ball count', 'sound', 'Self-alignment only helps a little.'],
    ['Why is BGA work on phone boards with underfill extra risky?', 'Removing underfill can rip pads and traces', 'Phones have no BGAs', 'Underfill makes it easy', 'Boards are too thick', 'Go slowly with heat and a pick.'],
  ]),
},
];
