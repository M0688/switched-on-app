/* Weekly check for the repair course: a broad, no-maths quiz that opens at the end of each week
   (Friday to Sunday). 3 questions per subject; questions he missed last time come back first,
   then ones he hasn't seen, then the ones he got right longest ago.
   The weekly lesson writer reads the misses and writes lessons on those gaps. */
import { shuffle } from '../kit.js';
import { dayKey, addDays, londonWeekday } from '../../lib/stats.js';

export const WEEK_PREFIX = 'wk-';
export const PER_SUBJECT = 3;

// subject: [ [topic, question, right, wrong1, wrong2, wrong3], ... ]
export const BANK = {
  components: [
    ['Pull-up resistors', 'A pull-up resistor connects an input pin to:', 'The supply rail, so it reads high', 'Ground, so it reads low until pressed', 'Another input, so the two share a level', 'Nothing, so the pin is free to float'],
    ['Pull-down resistors', 'With a pull-down resistor fitted, an input pin reads ___ until a switch changes it.', 'Low', 'High', 'Half the supply', 'Randomly'],
    ['Floating inputs', 'An input pin with nothing connected to it can:', 'Read randomly high or low', 'Only ever read as a solid low', 'Only ever read as a solid high', 'Draw a large current from the rail'],
    ['Pull-ups on I²C', 'The I²C lines SDA and SCL need:', 'Pull-up resistors to the supply', 'Pull-down resistors to ground', 'A series capacitor on each line', 'A diode on each line to ground'],
    ['Voltage drop', 'The voltage drop across a part is:', 'The voltage used up across it as current flows', 'The current that leaks through it to ground when off', 'The rail voltage left on it after power is removed', 'The voltage rating printed on the body of the part'],
    ['Diode forward drop', 'A standard silicon diode that is conducting drops about:', '0.6 to 0.7 V', '0.1 V or less', 'About 3.3 V', 'About 1.5 V'],
    ['Schottky diodes', 'Schottky diodes are often used in power paths because they have:', 'A lower forward voltage drop', 'A higher reverse voltage rating', 'A built-in current limit', 'A slower switching speed'],
    ['Decoupling capacitors', 'A small ceramic capacitor right next to an IC’s power pin is there to:', 'Smooth fast noise on that supply', 'Store data while the power is off', 'Set the clock speed of the IC', 'Limit the current into the IC'],
    ['MOSFET switching', 'An N-channel MOSFET switches on when its gate is:', 'Several volts above its source', 'At the same voltage as its source', 'Left with nothing connected', 'Several volts below its source'],
    ['LDO vs buck', 'Dropping 12 V to 3.3 V at the same load, an LDO compared with a buck regulator will:', 'Waste far more power as heat', 'Run cooler than the buck at that load', 'Need a larger inductor than the buck', 'Give a noisier output than the buck'],
    ['Resettable fuses', 'A resettable PTC fuse (polyfuse) that has tripped will:', 'Recover once the fault is gone and it cools', 'Stay open for good until it is replaced', 'Short the rail straight to ground for good', 'Drop a fixed 0.7 V across it, like a diode'],
    ['TVS diodes', 'A TVS diode on a USB line is there to:', 'Clamp voltage spikes such as ESD', 'Boost the line to a higher voltage', 'Store charge for when power drops', 'Set the data speed of the port'],
  ],
  testing: [
    ['Measuring voltage', 'To measure voltage, the meter goes:', 'Across the part, in parallel', 'In series, breaking the circuit', 'Across the part, board unpowered', 'In series, on the ohms range'],
    ['Measuring voltage drop', 'To measure the voltage drop across a fuse, you:', 'Probe both ends with the board powered', 'Probe both ends with the board switched off', 'Remove the fuse and probe across its pads', 'Probe one end and the board’s ground'],
    ['Voltage drop testing', 'A switch is on and its load is running on a 12 V circuit, but it has 2 V across its contacts. This means:', 'The contacts have high resistance', 'The switch is working perfectly', 'The load is drawing no current', 'The switch is actually turned off'],
    ['Continuity on coils', 'Continuity mode beeps across an inductor (coil). This is:', 'Normal, as coils read very low resistance', 'A short across the coil that needs fixing', 'A sign the coil has gone open circuit', 'A sign the meter’s battery is running flat'],
    ['Open circuits', 'Continuity reads OL between two points the schematic shows joined. This suggests:', 'A break, such as a cracked trace', 'A short between the two points', 'A healthy, normal connection', 'A capacitor that is still charged'],
    ['Resistance in circuit', 'Before measuring resistance on a board, the board must be:', 'Off, with capacitors discharged', 'On, at its normal voltage', 'On, at half its normal voltage', 'Warmed up to working temperature'],
    ['Bench PSU current limit', 'A bench supply switches to constant current (CC) mode. This means:', 'The board is drawing the set current limit', 'The board is drawing no current from the supply', 'The output voltage has been set too high', 'The bench supply itself has developed a fault'],
    ['Finding shorts', 'Freeze spray or isopropyl alcohol on a shorted rail helps by:', 'Showing which part warms up first', 'Cooling the short until it clears', 'Washing the short off the board', 'Lowering the voltage on the rail'],
    ['Meter leads', 'Measuring current, the red lead goes in:', 'The A or mA socket', 'The V/Ω socket, as for volts', 'The COM socket, with the black', 'Whichever socket is free'],
    ['Meter safety', 'Leaving the red lead in the current socket and probing a rail for voltage will:', 'Short the rail through the meter', 'Read the voltage on the rail as normal', 'Read zero but do no harm to anything', 'Show the current flowing on the rail'],
    ['Seeing ripple', 'Ripple on a DC rail is best seen with:', 'An oscilloscope', 'A meter on DC volts', 'Continuity mode', 'An ESR meter'],
    ['ESR meters', 'An ESR meter is mainly used to check:', 'Electrolytic capacitors', 'Fuses and zero-ohm links', 'Crystals and oscillators', 'Diodes and transistors'],
  ],
  pcbs: [
    ['Vias', 'A via on a PCB is:', 'A plated hole joining copper layers', 'A pad for soldering a surface-mount part', 'A gap left in the green solder mask', 'A printed label beside a part'],
    ['Solder mask', 'The solder mask (usually green) is there to:', 'Stop solder bridging between copper', 'Carry current between the board’s layers', 'Conduct heat away from the hot parts', 'Show where each part should be fitted'],
    ['Flux', 'Flux is used when soldering to:', 'Clean oxide so the solder flows and wets', 'Add extra tin to the joint as it forms', 'Cool the joint down more quickly afterwards', 'Insulate the joint once it has set'],
    ['Dry joints', 'A cracked or dry joint usually looks:', 'Grainy, lumpy or cracked', 'Smooth, bright and evenly shaped', 'Concave and well wetted', 'Exactly like a good joint'],
    ['Liquid damage', 'Liquid damage most often causes faults through:', 'Corrosion and shorts under parts', 'Magnetising the copper traces on it', 'Melting the solder joints on the board', 'Erasing the stored firmware'],
    ['Cleaning boards', 'A liquid-damaged board is best cleaned with:', 'Isopropyl alcohol and a soft brush', 'Tap water and some washing-up liquid', 'Contact grease and a dry cloth', 'A hot air gun on its highest heat'],
    ['Schematic grounds', 'On a schematic, the same ground symbol drawn in different places means those points are:', 'All connected together', 'Separate and unconnected', 'Joined only on the same page', 'Optional connections'],
    ['Boardviews', 'A boardview is mainly used to:', 'Find where a part or net is on the board', 'Update the firmware stored on the board', 'Measure the temperature across the board', 'Order the replacement parts for the board'],
    ['Heat shielding', 'Kapton tape is used during hot air work to:', 'Shield nearby parts from the heat', 'Hold the solder paste in place', 'Conduct more heat into the part', 'Mark which of the parts are faulty'],
    ['Jumper wires', 'A jumper wire on a board is used to:', 'Replace a broken trace or ripped pad', 'Join two separate rails to share power', 'Bypass a blown fuse for good', 'Ground a chip that runs too hot'],
    ['Lead-free solder', 'Compared with leaded solder, lead-free solder:', 'Melts at a higher temperature', 'Melts at a much lower temperature', 'Needs no flux to work at all', 'Cannot be reworked once set'],
    ['Fault-finding order', 'A sensible order on a dead board is:', 'Look, check for shorts, then power up', 'Power up first, then look for any damage', 'Replace the main chip, then test it', 'Reflash the firmware before anything'],
  ],
  phones: [
    ['Phone charging path', 'On a phone charge port, VBUS is:', 'The power coming in from the charger', 'The battery’s own voltage at the connector', 'One of the USB data lines to the CPU', 'The supply for the screen backlight'],
    ['Charge ports', 'A phone that only charges with the cable held at an angle points to:', 'A worn or dirty charge port', 'A failed main processor chip', 'A faulty screen assembly', 'A problem after a software update'],
    ['Swollen batteries', 'A phone with a swollen battery should be:', 'Removed carefully, never punctured or bent', 'Charged fully before any work is done on it', 'Pressed flat so that it fits back in place', 'Left in the phone and cooled down first'],
    ['PMIC', 'A phone’s PMIC (power management IC):', 'Makes and controls the phone’s power rails', 'Stores all the photos and apps on the phone', 'Drives the loudspeaker and the earpiece', 'Handles the mobile signal and phone calls'],
    ['USB ammeter readings', 'A phone shows 0.00 A on a USB ammeter when plugged in. This suggests:', 'A fault in the port, cable or charge IC', 'The phone is charging at its normal rate', 'A fault in the screen or its connector', 'A fault in the loudspeaker circuit'],
    ['Touch faults', 'Touch doesn’t work but the picture is fine. This usually points to:', 'The touch layer, its connector or touch IC', 'The backlight circuit or backlight connector', 'The battery or the battery connector', 'The charge port or its flex cable'],
    ['Working safely on phones', 'Before unplugging any flex on a phone board, you should:', 'Disconnect the battery first', 'Switch the phone on to test it', 'Heat the connector with hot air', 'Remove the SIM tray from the side'],
    ['Parts pairing', 'Many newer phones pair key parts to the board. This means:', 'A swapped part may lose features or show a warning', 'Any part from any phone model will fit and work fully', 'Parts can only be fitted by the mobile network', 'The board must be replaced along with each part'],
    ['Liquid indicators', 'A liquid contact indicator inside a phone:', 'Turns red or pink when it gets wet', 'Turns white or clear when it gets wet', 'Sounds a beep when it first gets wet', 'Cuts the power as soon as it gets wet'],
    ['Phone screens', 'A phone shows a faint picture only when a torch shines on it. The fault is in:', 'The backlight', 'The touch layer', 'The charge port', 'The earpiece'],
    ['Boot loops', 'A phone keeps restarting (boot loop). One common hardware cause is:', 'A faulty battery or sensor flex', 'A cracked glass panel on the back', 'A blocked or dirty earpiece mesh', 'A missing or unread SIM card'],
    ['Li-ion safety', 'A damaged lithium-ion battery is dangerous mainly because it can:', 'Catch fire or vent if shorted or pierced', 'Give a mains-level electric shock if touched', 'Leak acid like a car battery when dropped', 'Lose its charge faster than a normal one'],
  ],
  motherboards: [
    ['ATX power on', 'On an ATX power supply, the PS_ON# wire turns the supply on when it is:', 'Pulled low to ground', 'Pulled high to 5 V', 'Left floating', 'Joined to 12 V'],
    ['Active-low signals', 'The # at the end of a signal name like RSMRST# means it is:', 'Active low', 'A ground', 'A 5 V rail', 'A clock'],
    ['Power good', 'PWR_OK (power good) from the PSU tells the board:', 'The supply rails are up and stable', 'The CPU is fitted correctly in its socket', 'The RAM has passed its start-up tests', 'The BIOS is fully up to date'],
    ['Standby power', 'An ATX supply’s 5VSB (standby) rail is present:', 'Whenever the supply has mains power', 'Only while the PC is fully running', 'Only for the first few seconds of start-up', 'Only when a USB device is plugged in'],
    ['VRMs', 'A motherboard’s CPU VRM:', 'Converts 12 V down to the CPU core voltage', 'Stores the BIOS settings when it is unplugged', 'Generates the clock signal used by the CPU', 'Controls the speed of the case fans'],
    ['POST codes', 'A POST code display on a motherboard shows:', 'How far the BIOS got in start-up', 'The output voltages of the PSU', 'The current temperature of the CPU', 'The speed the RAM is running at'],
    ['CMOS battery', 'The coin cell (CMOS battery) on a motherboard keeps:', 'The clock and BIOS settings when unplugged', 'The CPU running for a while if power cuts out', 'The RAM contents saved after switching off', 'The fans spinning for a while after shutdown'],
    ['Laptop EC', 'On a laptop, the EC (embedded controller) handles:', 'Power button, charging and power-up order', 'Graphics output to the internal and external screens', 'Wi-Fi and Bluetooth data to the CPU', 'Sound output to the speakers and jack'],
    ['USB-C PD', 'A USB-C laptop charger only gives more than 5 V after:', 'PD negotiation over the CC line', 'The battery is fully charged', 'The laptop has booted into Windows', 'The screen has switched on'],
    ['BIOS chip', 'On most boards, the BIOS is stored in:', 'An SPI flash chip', 'The CMOS battery', 'The CPU’s cache memory', 'The RAM modules'],
    ['No display', 'A desktop powers on with fans spinning but no display. A good first step is:', 'Reseat the RAM and clear the CMOS', 'Replace the CPU straight away', 'Reflow the chipset with hot air', 'Replace the power supply first'],
    ['Failed capacitors', 'Bulging or leaking capacitors near the CPU usually cause:', 'Crashes, instability or no power', 'A slower internet connection speed', 'A noisy hard drive', 'A dim screen'],
  ],
  consoles: [
    ['HDMI ports', 'Of these, the most common console board repair is:', 'Replacing a damaged HDMI port', 'Replacing the main APU processor', 'Replacing the Wi-Fi module', 'Replacing the clock crystal'],
    ['HDMI damage', 'Console HDMI ports are most often damaged by:', 'Cables yanked out or forced in at an angle', 'Running the console for too many hours a day', 'Using a TV with a higher refresh rate', 'Updating the console’s firmware'],
    ['Switch charging', 'On the Nintendo Switch, the M92T36 is:', 'The USB-C power delivery (PD) chip', 'The main processor (the Tegra chip)', 'The audio codec chip for the speakers', 'The Wi-Fi and Bluetooth chip'],
    ['Switch dock faults', 'A Switch works handheld but gives no TV picture in the dock. Of these, the likely area is:', 'The USB-C port or its video output path', 'The touch screen layer or its connector', 'The battery or the battery connector', 'The game card reader and its slot'],
    ['Stick drift', 'Controller stick drift is usually caused by:', 'Wear or dirt inside the stick module', 'A weak Bluetooth signal to the console', 'A flat battery inside the controller', 'Old firmware on the console itself'],
    ['Overheating', 'An overheating console is often fixed by:', 'Cleaning dust and renewing the thermal compound', 'Updating the firmware on the controllers', 'Replacing the HDMI cable with a shorter, thicker one', 'Fitting a larger and faster internal drive'],
    ['Liquid metal', 'The PS5 uses which thermal compound between its APU and heatsink?', 'Liquid metal', 'Standard thermal paste', 'A thermal pad', 'Nothing at all'],
    ['Liquid metal safety', 'Liquid metal must be handled carefully because:', 'It conducts and can short nearby parts', 'It gives off poisonous fumes when warm', 'It hardens solid within a few seconds', 'It is drawn to the magnets in the fans'],
    ['HDMI retimers', 'On a PS5, the HDMI retimer chip sits:', 'Between the APU and the HDMI port', 'Between the PSU and the main board', 'Between the SSD and the APU', 'Between the fan and its connector'],
    ['Console PSUs', 'A console’s internal power supply is dangerous to probe because:', 'Its primary side runs from mains voltage', 'It holds firmware that is lost if probed', 'It is glued and soldered to the main board', 'It runs hot enough to melt the probes'],
    ['PS5 storage', 'The PS5’s built-in SSD is:', 'Soldered to the main board', 'A removable 2.5-inch drive', 'A removable SD card in a slot', 'A USB stick inside the case'],
    ['Disc drives', 'A console works but won’t read discs. The fault is most likely in:', 'The drive’s laser or mechanism', 'The HDMI port or retimer', 'The power supply’s 12 V output', 'The controller’s USB port'],
  ],
};

export const NOT_SURE = 'Not sure';

/** Monday (London date) of the week containing `now`. Each week has one check, keyed by it. */
export function weekStart(now = new Date()) {
  const wd = londonWeekday(now);
  return addDays(dayKey(now), -((wd + 6) % 7));
}
export const weekKey = (now = new Date()) => WEEK_PREFIX + weekStart(now);
/** Opens Friday and stays open over the weekend. */
export const weeklyOpen = (now = new Date()) => [5, 6, 0].includes(londonWeekday(now));
export const isWeekly = a => typeof a?.session_key === 'string' && a.session_key.startsWith(WEEK_PREFIX);
export const weeklyDone = (attempts, now = new Date()) => attempts.some(a => a.session_key === weekKey(now));
export const weeklyChecks = attempts => attempts.filter(isWeekly).sort((a, b) => (a.created_at < b.created_at ? 1 : -1));

/** Builds this week's check: per subject, last-time misses first, then unseen, then right longest ago. */
export function buildWeekly(attempts) {
  const last = {}; // question text → { ok, at }
  for (const a of weeklyChecks(attempts).reverse()) for (const d of Array.isArray(a.details) ? a.details : []) last[d.q] = { ok: d.ok, at: a.created_at };
  const rank = q => !last[q] ? 1 : last[q].ok ? 2 : 0;
  return Object.entries(BANK).flatMap(([subject, rows]) => {
    const order = shuffle(rows).sort((x, y) => rank(x[1]) - rank(y[1]) || (rank(x[1]) === 2 ? (last[x[1]].at < last[y[1]].at ? -1 : 1) : 0));
    return order.slice(0, PER_SUBJECT).map(([topic, q, right, ...wrong]) => {
      const o = [...shuffle([right, ...wrong]), NOT_SURE];
      return { subject, topic, q, o, a: o.indexOf(right), chosen: null };
    });
  });
}
