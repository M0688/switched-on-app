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
    ['An ESD wrist strap connects to earth through…', 'a 1 MΩ resistor', 'a direct wire with no resistor', 'a fast-blow fuse', 'a small capacitor', 'Drains static slowly and protects you from shock.'],
    ['ESD damage can be…', 'invisible and cause failures later', 'always obvious the moment it happens', 'only a problem on mains equipment', 'impossible on phones and small boards', 'Latent damage weakens parts.'],
    ['Rosin (colophony) flux fumes are a known cause of…', 'occupational asthma', 'skin cancer', 'hearing loss', 'nothing at all', 'Use fume extraction.'],
    ['Why disconnect the battery before working on a phone board?', 'To avoid shorts and damage while working', 'To make the phone lighter to handle', 'To reset the clock and date settings', 'It isn’t necessary with the screen off', 'Battery power plus a slipped tool means damage.'],
    ['IPA near a hot air station is a risk because…', 'it is flammable', 'it is conductive', 'it melts solder', 'it freezes parts', 'Let it evaporate first.'],
    ['Sensitive boards should be stored and moved in…', 'static-shielding bags', 'ordinary clear plastic bags', 'bubble wrap on its own', 'kitchen foil sheets', 'Shielding bags block static fields.'],
    ['After handling leaded solder you should…', 'wash your hands before eating or drinking', 'do nothing; leaded solder is safe once cool', 'wipe your hands clean on a dry cloth', 'only wear gloves for the next job', 'Lead is absorbed by swallowing.'],
    ['Low humidity makes ESD…', 'more likely', 'less likely', 'impossible', 'irrelevant', 'Dry air lets charge build up.'],
    ['A swollen Li-ion battery should be…', 'removed carefully without puncturing, stored safely and recycled', 'pressed back flat so the device closes and works again as normal', 'charged on the bench to test whether it still holds charge', 'pierced with a pin to release the gas, then refitted', 'Puncture can cause fire.'],
    ['Eye protection is wise when…', 'clipping leads or using chemicals', 'reading schematics on a screen', 'using a multimeter on low voltage', 'never; it’s only needed on mains', 'Clipped leads fly.'],
    ['Why handle boards by the edges?', 'To avoid touching pins and sensitive parts', 'The board is stronger in the middle', 'Fingerprints help solder wet the pads', 'There’s no reason; anywhere is fine', 'Less ESD and contamination.'],
    ['A good ESD-safe bench has…', 'a grounded mat and a wrist strap point', 'a carpet to soak up static charge', 'a plastic sheet to insulate the board', 'bare metal tied directly to mains earth', 'Mats bleed charge slowly through resistance.'],
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
    ['SAC305 lead-free solder melts at about…', '217–220 °C', '183–185 °C', '150–160 °C', '320–350 °C', 'Higher than leaded.'],
    ['The main job of flux is to…', 'remove oxides so solder wets the metal', 'add mechanical strength to the joint', 'insulate the joint once it has cooled', 'cool the iron tip between joints', 'Clean metal plus flux = good wetting.'],
    ['Adding leaded solder to a lead-free joint before removing a part…', 'lowers the melting point and makes removal easier', 'raises the melting point and makes removal harder', 'has no effect on how easily the part comes off', 'always damages the pad under the part', 'Many repairers do this on purpose.'],
    ['Water-soluble flux must be…', 'washed off after use', 'left on to protect the joint from air', 'heated again to cure it', 'covered with Kapton tape', 'Its residues are corrosive.'],
    ['Why tin the iron tip?', 'It protects it and improves heat transfer', 'It cools the tip down between joints', 'It only makes the tip look clean and shiny', 'It turns the tip into a lead-free tip', 'Oxidised tips don’t transfer heat.'],
    ['A good joint usually looks…', 'smooth with a concave fillet', 'lumpy and balled up on the pad', 'grainy and dull on leaded solder', 'like a round ball sitting on the pad', 'Smooth wetting shows a good bond.'],
    ['A cold joint is often…', 'dull, grainy or lumpy, and unreliable', 'very shiny, smooth and reliable', 'stronger than a normal joint', 'impossible with a modern iron', 'Not enough heat, or movement while cooling.'],
    ['To remove solder from pads, use…', 'solder wick with flux', 'a flat screwdriver blade', 'fine wet-and-dry sandpaper', 'IPA on its own', 'Wick soaks up solder.'],
    ['Turning the iron right up to make a small tip handle a big joint…', 'risks lifting pads and damaging parts', 'is best practice for large joints', 'is safe and quick on any board', 'is required for lead-free solder', 'Use a bigger tip or preheat.'],
    ['No-clean flux residue…', 'is designed to be safe to leave, though many clean it off', 'must always be washed off straight away or it corrodes', 'is highly conductive and causes shorts if left on', 'contains lead, so it must be removed before handing back', 'Cleaning helps inspection.'],
    ['Brass wool is preferred to a wet sponge because…', 'it cleans without thermal shock to the tip', 'it adds a little solder to the tip each time', 'it’s cheaper, but cleans no differently', 'it cools the tip more than a wet sponge', 'Wet sponges shorten tip life.'],
  ]),
},
{
  id: 'r3', level: 2, title: 'Hot air rework', sub: 'Removing and fitting SMD parts cleanly',
  lesson: `${ul(['<b>Flux first</b>: it helps heat transfer and flow.', '<b>Low airflow</b> for small parts, or you’ll blow them away.', '<b>Shield</b> plastic connectors, cameras and nearby parts with Kapton tape or foil.', '<b>Preheat</b> from below on thick boards with big ground planes: less warping, less top heat needed.', 'Move the nozzle in small circles. Don’t hold it on one spot.', 'Lift only when the solder flows and the part moves freely with a gentle nudge. Never force it.'])}
<h3>Fitting</h3>
${ul(['Clean pads flat with wick and flux, then tin lightly.', 'Place, flux, heat evenly. <b>Surface tension</b> pulls small parts into line.', 'Uneven heating makes one end melt first: <b>tombstoning</b>.'])}
${slip('Underfill under phone chips must be softened and picked away slowly. Rushing it rips pads.')}`,
  make: fromBank([
    ['Why use low airflow on small parts?', 'High airflow can blow them away', 'Low airflow heats parts faster', 'Airflow isn’t important at all', 'Low airflow cools the board quicker', 'Small passives scatter easily.'],
    ['Kapton tape or foil is used to…', 'shield nearby heat-sensitive parts', 'add solder to pads before fitting', 'conduct heat into the part being removed', 'mark pin 1 on a new chip', 'Protect plastic and cameras.'],
    ['A preheater helps by…', 'reducing thermal shock and the top heat needed', 'cooling the board between reflow cycles', 'adding flux under the part as it heats', 'measuring the board’s temperature only', 'Especially on thick boards.'],
    ['A part is ready to lift when…', 'the solder flows and it moves freely with a gentle nudge', 'it starts to smoke and the flux has all burnt away', 'exactly 10 seconds of hot air have passed', 'the board around it starts to turn brown', 'Forcing it rips pads.'],
    ['Surface tension during reflow…', 'helps small parts self-align', 'pulls parts off their pads', 'cools the solder faster', 'has no effect on the part', 'Liquid solder pulls the part to its pads.'],
    ['Tombstoning is caused by…', 'one end melting or wetting before the other', 'too much flux on both pads at the same time', 'using leaded rather than lead-free solder', 'fitting the part with pin 1 the wrong way', 'Heat evenly with equal solder on both pads.'],
    ['Plastic connectors near the work…', 'can melt, so shield or remove them', 'are heat-proof up to about 450 °C', 'help spread the heat across the board', 'don’t matter for short reworks', 'Shield them.'],
    ['Underfill under a chip…', 'glues it down and must be softened and removed carefully', 'is a type of solder that melts along with the balls underneath', 'makes removal easy because it lifts the chip as it heats', 'is flux left behind after the factory reflow process', 'Common under phone processors and storage.'],
    ['Before fitting a new part, prepare the pads by…', 'cleaning flat with wick and flux, then tinning', 'scratching them with a blade so the solder grips better', 'covering them with Kapton tape', 'adding a dot of glue to hold the part', 'Flat, clean pads let it sit level.'],
    ['Holding the nozzle still on one spot…', 'can overheat that spot; move in small circles', 'is best practice for even heating of the part', 'makes no difference to the board or the part', 'saves time and is safe on any type of board', 'Spread the heat.'],
    ['The board warps during rework. The likely cause is…', 'uneven or excessive heat without support or preheat', 'too little flux on the pads under the part', 'using leaded solder on a lead-free board', 'static discharge from the hot air station', 'Support and preheat the board.'],
    ['Why add fresh flux before removing a part with hot air?', 'It helps heat transfer and solder flow', 'It cools the part so it doesn’t crack under heat', 'It stops static damaging the part', 'It isn’t needed with hot air', 'Old solder is oxidised.'],
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
    ['Drag soldering means…', 'dragging a loaded tip along a row of pins with plenty of flux', 'pulling a part off the board with pliers while heating it', 'using hot air alone to solder all the pins at once', 'putting a separate blob of solder on each pin in turn', 'Flux and surface tension do the work.'],
    ['The most important thing for drag soldering is…', 'plenty of flux', 'a very cold iron', 'lots of extra solder', 'no flux at all', 'Flux prevents bridges.'],
    ['A bridge between two pins can be cleared by…', 'adding flux and dragging a clean tip, or using wick', 'adding more solder until the bridge melts away', 'cutting through it with a sharp craft knife', 'blowing on the joint while it’s still molten', 'Flux lets surface tension pull the solder back.'],
    ['Before soldering a fine-pitch IC, tack it by…', 'soldering two opposite corner pins after aligning it', 'gluing it to the board until the solder sets', 'soldering one whole side first, then aligning', 'holding it with hot glue on two corners', 'Corners lock alignment.'],
    ['A hoof or mini-wave tip helps because…', 'it holds a small reservoir of solder for dragging', 'it is very sharp for reaching between fine-pitch pins', 'it stays cooler than other tips', 'it removes flux as it drags', 'Made for drag soldering.'],
    ['After soldering, check for bridges using…', 'a microscope and continuity between adjacent pins', 'your nose, to smell for burnt flux between pins', 'your thumbnail run gently along the row of pins', 'nothing; drag soldering never leaves bridges', 'Some bridges are hard to see.'],
    ['Pin pitch is…', 'the distance between centres of adjacent pins', 'the length of each pin from body to tip', 'the angle each pin is bent at', 'the total number of pins on the package', 'Smaller pitch, more bridge risk.'],
    ['Misaligned by half a pin after tacking, the IC should be…', 'reheated and realigned before soldering the rest', 'left as it is; the solder will pull it straight', 'pushed into place with tweezers while cold', 'glued in position and then soldered', 'Fix it while only two pins are soldered.'],
    ['A dull lead-free fine-pitch joint…', 'can be normal; check the fillet and wetting', 'is always a bad joint and must be redone', 'means there is a bridge to the next pin', 'means leaded solder has been used', 'Lead-free is less shiny.'],
    ['Why clean flux off after fine-pitch work?', 'To inspect joints clearly', 'It makes the joints stronger', 'All flux is highly conductive', 'You should never clean it off afterwards', 'Residue hides bridges and cracks.'],
    ['Solder paste is…', 'tiny solder balls mixed with flux', 'flux on its own, with no solder in it', 'a glue that holds parts down', 'thermal grease for chips', 'Used with stencils and hot air.'],
    ['Too much solder on QFN edge pads causes…', 'bridges under the part', 'better heat transfer only', 'stronger joints and nothing else', 'no problem at all', 'Hidden bridges are hard to find.'],
  ]),
},
{
  id: 'r5', level: 3, title: 'Microsoldering: pads and jumpers', sub: 'Rebuilding broken connections',
  lesson: `${ul(['Work under a <b>stereo microscope</b> (around 7–45×) for depth perception.', 'Use the <b>boardview</b> to find the next point on the broken net: a via, a component pad, a test point.', '<b>Scrape the solder mask</b> off the trace with a scalpel or fibreglass pen to expose copper, then tin it.', 'Use very fine <b>enamelled copper wire</b>. Strip the enamel at the ends (a hot tip with solder burns it off).', 'Solder the jumper, then <b>secure it</b> with UV-curing solder mask and cure with a UV lamp.', 'Confirm with continuity from pad to the far end of the net, then diode mode against a known-good reading.'])}
<p>Check the boardview first: a torn pad under an <b>NC</b> (no-connect) BGA ball usually doesn’t need rebuilding.</p>
${slip('Heavy ground pads soak up heat. Add heat capacity or preheat rather than just raising temperature.')}`,
  make: fromBank([
    ['A microsoldering jumper is usually…', 'very fine enamelled copper wire', 'thin mains cable with a PVC sheath', 'a strand of solder wick', 'a strip of aluminium foil', 'Fine enough to sit between parts.'],
    ['Before soldering to a trace, you must…', 'scrape away the solder mask to expose copper', 'apply a dot of glue to hold the wire', 'heat the board to 400 °C first', 'nothing; solder sticks through the mask', 'Solder won’t stick to mask.'],
    ['UV-curing solder mask is used to…', 'insulate and secure jumpers and exposed copper', 'clean flux off the board after soldering', 'remove solder from pads before fitting', 'cool the board down after hot air work', 'Cure it with a UV lamp.'],
    ['To find where a missing pad’s trace goes, use…', 'the boardview or schematic to find the next point on the net', 'guesswork based on the nearest chip to the missing pad', 'an X-ray machine, as it is the only reliable way', 'the colour of the case and the model sticker', 'Any pad on the same net will do.'],
    ['Why secure a jumper wire?', 'So movement doesn’t break it or tear the pad', 'Securing it makes the repair look neater only', 'A secured wire conducts better than a loose one', 'It isn’t needed if the wire is short', 'Flex and handling break loose jumpers.'],
    ['Enamel on jumper wire must be…', 'removed at the ends before soldering', 'kept on everywhere, including the ends', 'painted over with nail varnish first', 'stripped off the whole length of the wire', 'The enamel insulates the rest of the run.'],
    ['A stereo microscope is used because…', 'it gives depth perception for tiny parts', 'it shows X-ray views through the parts to the joints', 'it measures the voltage on each pad', 'it heats the board for soldering', 'You need to judge height and contact.'],
    ['After a jumper repair, confirm it by…', 'continuity from the pad to the far end of the net', 'looking at it closely under the microscope only', 'powering on straight away without checks', 'adding more flux to the finished joint', 'Then compare a diode-mode reading.'],
    ['A torn pad under an NC (no-connect) BGA ball…', 'usually doesn’t need repairing', 'must always be rebuilt before refitting', 'means the chip is dead and must be replaced', 'shorts the board until it’s repaired', 'Check the boardview: no net, no repair.'],
    ['Why is pad repair under BGA chips hard?', 'Pads are tiny, close together, and must be flat for the ball', 'The pads are made of plastic, so solder won’t stick to them', 'The pads are too big to fit a jumper wire to them', 'It isn’t hard; BGA pads are the easiest to repair', 'It needs great precision.'],
    ['Heavy ground pads take longer to heat because…', 'the copper plane pulls heat away', 'they are coated in a layer of insulation', 'they contain lead in the copper', 'they are smaller than other pads', 'Add heat capacity or preheat.'],
    ['A good tip for microsoldering is…', 'a small conical or knife tip with good heat recovery', 'a large chisel tip only, for the most heat possible', 'a hot air nozzle fitted onto the soldering iron', 'the smallest tip you have, at the lowest temperature', 'Small, but able to deliver heat quickly.'],
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
    ['Reballing means…', 'removing a BGA, cleaning it, fitting new balls and refitting it', 'heating the chip in place with hot air until the joints reflow', 'adding glue around a BGA chip to stop it cracking again', 'replacing the whole board with one that has new BGA chips', 'A proper fix for bad joints.'],
    ['A reflow without reballing is often…', 'temporary, because the underlying fault remains', 'permanent, as long as enough flux is used', 'the best repair for any cracked BGA joint', 'a software fix that stops the fault returning', 'If the die is failing, heat only buys time.'],
    ['The stages of a reflow profile are…', 'preheat, soak, reflow, cool', 'cool, heat, cool, heat', 'flux, wash, dry, test', 'one fast blast of heat', 'Controlled stages avoid thermal shock.'],
    ['Why bake a board or chip before BGA work?', 'To drive out moisture that can crack the package', 'To clean flux and residue off the board surface', 'To add solder to the pads ready for the new balls', 'To cure the underfill so the chip lifts more easily', 'Known as popcorning.'],
    ['A thermocouple near the chip is used to…', 'measure the real temperature during the profile', 'measure the voltage on the chip’s power pins', 'align the chip with the silkscreen outline', 'hold the stencil in place over the chip', 'Set temperature isn’t joint temperature.'],
    ['Peak joint temperature for lead-free BGA reflow is typically about…', '230–250 °C', '150–160 °C', '183 °C exactly', '350–400 °C', 'Above SAC305’s melting range, not much more.'],
    ['A stencil is used in reballing to…', 'place balls accurately on each pad', 'remove underfill from around the chip edges', 'cool the chip quickly after reflow', 'test the chip before refitting it', 'One ball per hole.'],
    ['Why heat the board from below during BGA work?', 'To reduce warping and the heat needed from above', 'To cool the chip while the top heater works', 'To push flux up under the chip from below', 'It doesn’t help; top heat alone is better', 'Even heating, less stress.'],
    ['Using the wrong ball size can cause…', 'bridges or open joints', 'a faster boot time', 'better cooling of the chip', 'nothing; any size works', 'Match the chip’s spec.'],
    ['After removing a BGA, the pads should be…', 'cleaned flat with wick and flux, without lifting any', 'scraped clean with a knife to remove all old solder', 'left with lumps of old solder to help the new balls', 'taped over until the reballed chip is ready to fit', 'Flat pads for the new balls.'],
    ['When placing a BGA, alignment is checked using…', 'the silkscreen outline and corner marks', 'the chip’s colour against the board', 'the number of balls on the chip', 'the sound it makes as it settles', 'Self-alignment only helps a little.'],
    ['Why is BGA work on phone boards with underfill extra risky?', 'Removing underfill can rip pads and traces', 'Phones don’t use BGA chips at all', 'Underfill makes the chip lift off too easily', 'Phone boards are too thick to heat evenly', 'Go slowly with heat and a pick.'],
  ]),
},
];
