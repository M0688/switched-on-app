/* English Week 1 sessions (ported from the study pages). */
const r=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=r(0,i);[a[i],a[j]]=[a[j],a[i]]}return a};
const cap=s=>s[0].toUpperCase()+s.slice(1);

/* Session 1: subject–verb agreement. [sentence, answer, other, subject word, one/many] */
const AGREE=[
 ['The box of fuses ___ on the shelf.','is','are','box','one'],
 ['The tools in the van ___ brand new.','are','is','tools','many'],
 ['One of the sockets ___ broken.','is','are','one','one'],
 ['The cables under the floor ___ very old.','are','is','cables','many'],
 ['Each of the apprentices ___ a test meter.','has','have','each','one'],
 ['The list of jobs ___ pinned to the wall.','is','are','list','one'],
 ['My brother and I ___ going to college.','are','is','my brother and I','many'],
 ['The bag of screws ___ really heavy.','is','are','bag','one'],
 ['The wires behind the switch ___ loose.','are','is','wires','many'],
 ['Everyone in the class ___ a hard hat.','has','have','everyone','one'],
 ['The price of copper cables ___ gone up.','has','have','price','one'],
 ['The electricians on site ___ on a break.','were','was','electricians','many'],
 ['A pack of cable ties ___ in the drawer.','was','were','pack','one'],
 ['The lights in the hallway ___ flickering.','were','was','lights','many'],
 ['The noise from the drills ___ giving me a headache.','is','are','noise','one'],
];
/* Session 2: joining sentences. [first, second, linking word] */
const JOIN=[
 ['The power was off','we started work','so'],['The meter beeped','the wire was live','because'],
 ['It was raining','we worked inside','so'],['Jamal tested the socket','it showed 230 volts','and'],
 ['The van was full','we left some tools behind','so'],['I wanted to finish','the light was fading','but'],
 ['The fuse blew','the kettle was faulty','because'],['She checked the cable','it was damaged','and'],
 ['He studied every evening','he passed the test','so'],['The shop was closed','we came back later','so'],
 ['The job took longer','the plans were wrong','because'],['The site was muddy','we wore boots','so'],
];
/* Session 3: spelling. [correct, wrong1, wrong2, wrong3, memory trick] */
const SPELL=[
 ['separate','seperate','seperete','separete','There is A RAT in sep-a-rat-e.'],
 ['necessary','neccessary','necesary','neccesary','One Collar, two Sleeves: one c, two s.'],
 ['definitely','definately','definitly','defenitely','It has the word "finite" inside it.'],
 ['because','becuase','becouse','beacause','Big Elephants Can Always Understand Small Elephants.'],
 ['business','buisness','busness','bussiness','Catch the BUS: bus-i-ness.'],
 ['environment','enviroment','enviornment','envirnment','There is IRON in env-iron-ment.'],
 ['government','goverment','govenment','govermant','People who GOVERN: govern-ment.'],
 ['receive','recieve','receeve','reseive','i before e, except after c: rec-ei-ve.'],
 ['beginning','begining','beggining','beginnig','Double n before -ing: begin-n-ing.'],
 ['different','diffrent','diferent','differant','Say it slowly: diff-er-ent.'],
 ['equipment','equiptment','equippment','equipement','No t before the m: equip-ment.'],
 ['maintenance','maintainance','maintenence','maintanance','Main-ten-ance: "ten" in the middle.'],
 ['immediately','immediatly','imediately','immediatley','Immediate + ly, keep the e.'],
 ['appointment','apointment','appointmant','appointmeant','Double p: ap-point-ment.'],
 ['certificate','certifficate','sertificate','certificat','Cert-i-fi-cate: one f, ends in -cate.'],
];
/* Session 4: meaning from context. [sentence with *word*, answer, wrong x3, clue] */
const CTX=[
 ['The socket was *isolated*, so it was safe to work on.','cut off from the power supply','lonely','far away','broken','"so it was safe to work on" tells you the power had been cut off.'],
 ['The instructions were *ambiguous*, so two people did the job two different ways.','could be understood in more than one way','very long','badly printed','easy to follow','Two people read them differently, so they were unclear.'],
 ['Wear goggles to protect your eyes from *debris*.','small bits of broken material','bright sunlight','loud noise','water','Goggles protect from things flying into your eyes.'],
 ['The cable was *concealed* behind the plasterboard.','hidden','damaged','joined','painted','Behind plasterboard, you can’t see it.'],
 ['He was *reluctant* to climb the ladder, so he asked for help.','unwilling','excited','quick','able','He asked for help instead of doing it, so he didn’t want to.'],
 ['After forty years, the old wiring had *deteriorated*.','got worse','been replaced','got stronger','been tested','"Old" and "forty years" suggest it got worse with age.'],
 ['You must *comply* with the safety rules on site.','follow','argue with','write','forget','"You must" plus "safety rules" means do what they say.'],
 ['The fault was *intermittent*: sometimes the light worked, sometimes it didn’t.','stopping and starting','permanent','dangerous','very loud','The rest of the sentence explains it: sometimes on, sometimes off.'],
 ['Copper is a good *conductor*, so electricity flows through it easily.','material that lets electricity pass through','person on a bus','type of insulation','tool for cutting','"Electricity flows through it easily."'],
 ['The supervisor will *verify* the readings before signing them off.','check they are correct','throw away','guess','copy out','You check something before you sign it off.'],
 ['The workshop was *cramped*, with barely room to turn around.','small and crowded','cold','noisy','tidy','"Barely room to turn around."'],
 ['She gave a *brief* explanation, then let us start.','short','confusing','angry','long','She explained, then let us start straight away.'],
];
/* Session 5: reading between the lines. [passage, question, answer, wrong x3, clue] */
const INF=[
 ['Mia checked the ladder twice before climbing. Last year, a loose rung had sent her workmate to hospital.','Why does Mia check the ladder twice?','She remembers someone getting hurt','She is scared of heights','Her boss told her to','The ladder is new','The second sentence explains it: a loose rung hurt her workmate.'],
 ['Tom read the letter, grinned, and punched the air. Then he rang his gran.','How does Tom feel about the letter?','Happy and excited','Worried','Angry','Bored','Grinning and punching the air are signs of joy.'],
 ['The customer kept looking at her watch and tapping her foot while Ravi worked.','What does this suggest about the customer?','She is impatient','She is cold','She likes Ravi','She is tired','Watch-checking and foot-tapping show someone in a hurry.'],
 ['Ellie switched off the main power, locked the switch with a padlock, and kept the key in her pocket.','Why did Ellie keep the key in her pocket?','So nobody could switch the power back on','So she wouldn’t lose it','Because the key was valuable','Because she always does','If she has the key, no one else can unlock the switch while she works.'],
 ['The van wouldn’t start. Dan looked at the fuel gauge and groaned.','Why probably didn’t the van start?','It had run out of fuel','The battery was flat','Dan had the wrong key','It was too cold','He looks at the fuel gauge and groans: it’s empty.'],
 ['When the inspector walked in, the apprentices suddenly started sweeping the floor.','What does this suggest?','They wanted to look busy','The floor was always clean','The inspector asked them to','They love sweeping','"Suddenly" shows they started only because the inspector arrived.'],
 ['Sam’s answer was one word: "Fine." He didn’t look up from his phone.','How does Sam probably feel?','He doesn’t want to talk','He is delighted','He is confused','He is very busy at work','A one-word reply without eye contact shows he isn’t interested in talking.'],
 ['The old house had cloth-covered wires and a wooden fuse box. The electrician shook her head slowly.','What does the electrician think?','The wiring is old and unsafe','The house is lovely','She is lost','The job will be easy','Shaking her head slowly shows she is unhappy with what she sees.'],
 ['Priya had failed the test twice. This time she studied every evening for a month.','What does this tell us about Priya?','She is determined','She is lazy','She doesn’t care','She found it easy','She kept going after failing, and worked hard.'],
 ['The meter read 230 volts. Jamal stopped breathing.','Why does the writer say Jamal "stopped breathing"?','To show he was shocked and scared','He was holding his breath for fun','He had a medical problem','He was bored','People freeze and hold their breath when they get a fright.'],
 ['He opened the door. Silence. Then a crackle.','Why does the writer use such short sentences?','To build tension','Because the writer is lazy','To save space','To explain the science','Short sentences slow the reader down and make it feel tense.'],
 ['The workshop smelled of burning plastic, and a thin grey line of smoke rose from the bench.','What has probably happened?','Something has overheated','Someone is cooking','It is a cold day','The bench is new','Burning plastic and smoke point to something overheating.'],
];

const S=[
{id:'s1',title:'Is or are?',sub:'Finding the real subject of a sentence',
lesson:`<p>The verb must match the <b>subject</b>, the thing the sentence is about. One thing takes <b>is / was / has</b>. More than one takes <b>are / were / have</b>.</p>
<p>The trap: extra words often sit between the subject and the verb. Cover up the "of…" or "in…" part and see what's left.</p>
<div class="work"><span class="eyebrow">Worked example</span><div>The box of fuses ___ on the shelf.</div><div>Cover "of fuses": <b>The box</b> ___ on the shelf.</div><div>One box, so: The box of fuses <span class="y">is</span> on the shelf.</div></div>
<p class="slip">A common slip is to choose "are", because "fuses" sits right before the gap. But it's the box that's on the shelf.</p>
<ul><li><b>Each, every, everyone, one of</b> always take is / has.</li><li><b>Two things joined by "and"</b> take are / have.</li></ul>`,
make(){return shuffle(AGREE).slice(0,8).map(([s,a,b,subj,n])=>{const o=shuffle([a,b]);return{q:s,o,a:o.indexOf(a),short:true,s:`The subject is "${subj}", which is ${n==='one'?'one thing':'more than one'}, so "${a}".`}})}},

{id:'s2',title:'Joining sentences',sub:'Full stops, semicolons and linking words',
lesson:`<p>Two complete sentences can't be joined with just a comma. That mistake is called a <b>comma splice</b>. There are three correct fixes.</p>
<div class="work"><span class="eyebrow">Worked example</span>
<div><span class="x">✗</span> The power was off, we started work.</div>
<div><span class="y">✓</span> The power was off. We started work. <span class="muted">(full stop, then a capital)</span></div>
<div><span class="y">✓</span> The power was off; we started work. <span class="muted">(semicolon)</span></div>
<div><span class="y">✓</span> The power was off, so we started work. <span class="muted">(linking word)</span></div></div>
<p>Linking words: <b>so, because, but, and, although, when</b>. They make writing flow better too, which helps your writing marks.</p>
<p class="slip">Test: if both halves could stand alone as sentences, a comma on its own isn't enough.</p>`,
make(){return shuffle(JOIN).slice(0,8).map(([a,b,l])=>{
 const right=[`${a}. ${cap(b)}.`,`${a}; ${b}.`,(l==='so'||l==='but')?`${a}, ${l} ${b}.`:`${a} ${l} ${b}.`][r(0,2)];
 const wrong=[`${a}, ${b}.`,`${a} ${b}.`,`${a}. ${b}.`];
 const o=shuffle([right,...wrong]);
 return{q:'Which one is punctuated correctly?',o,a:o.indexOf(right),s:`"${a}" and "${b}" are both full sentences. Join them with a full stop and capital, a semicolon, or a linking word. A comma alone is a comma splice.`}})}},

{id:'s3',title:'Tricky spellings',sub:'Words used in college and work, with memory tricks',
lesson:`<p>Some words trip up almost everyone. The fix is a memory trick for each one, then practice. Read the tricks out loud.</p>
<ul>${SPELL.map(w=>`<li><b>${w[0]}</b>: ${w[4]}</li>`).join('')}</ul>
<p class="slip">The most common slip is "seperate". Remember: there's <b>a rat</b> in sep<b>arat</b>e.</p>
<p>Tip: when you get one wrong, write it out three times on paper while saying the trick.</p>`,
make(){return shuffle(SPELL).slice(0,8).map(w=>{const o=shuffle(w.slice(0,4));return{q:'Which spelling is correct?',o,a:o.indexOf(w[0]),short:true,s:`${w[0]}: ${w[4]}`}})}},

{id:'s4',title:'Working out new words',sub:'Using clues in the sentence',
lesson:`<p>When you meet a word you don't know, the sentence around it usually gives a clue. Don't skip it. Read the whole sentence and ask: <b>what word would make sense here?</b></p>
<div class="work"><span class="eyebrow">Worked example</span><div>"The socket was <b>isolated</b>, so it was safe to work on."</div><div>Clue: "so it was safe to work on".</div><div>A socket is safe when the power is off, so <b>isolated</b> here means <span class="y">cut off from the power supply</span>.</div></div>
<p>Words can mean different things in different places. "Isolated" can mean lonely, but not when you're talking about sockets.</p>`,
make(){return shuffle(CTX).slice(0,8).map(c=>{const o=shuffle(c.slice(1,5));const word=c[0].match(/\*(.+?)\*/)[1];
 return{q:`What does "${word}" mean here?`,p:c[0].replace(/\*(.+?)\*/,'<b>$1</b>'),o,a:o.indexOf(c[1]),s:c[5]}})}},

{id:'s5',title:'Reading between the lines',sub:'Working out what the writer doesn’t say',
lesson:`<p>Writers often <b>show</b> you something instead of telling you. You work it out from clues: what people do, say, look at, or how they move. This is called <b>inference</b>, and it's worth lots of marks in GCSE English.</p>
<div class="work"><span class="eyebrow">Worked example</span><div>"Then a socket showed 230 volts on the meter. Jamal stared at the reading for a long moment."</div><div>The writer never says "Jamal was scared". But he expected 0 volts, and 230 volts could have killed him.</div><div>So he stared because <span class="y">he realised he could have been badly hurt</span>.</div></div>
<p class="slip">Avoid answers the text doesn't support. Nothing in the story says the meter was broken.</p>`,
make(){return shuffle(INF).slice(0,8).map(c=>{const o=shuffle(c.slice(2,6));return{q:c[1],p:c[0],o,a:o.indexOf(c[2]),s:c[6]}})}},

{id:'s6',title:'Writing task',sub:'A short piece for Claude to mark',writing:true,
lesson:`<p>A good short piece of writing has three things: a clear opening, ideas grouped into <b>paragraphs</b>, and a sentence to finish.</p>
<ul><li><b>Paragraph 1:</b> say what you think, and give your first reason.</li>
<li><b>Paragraph 2:</b> a second reason, with an example from real life.</li>
<li><b>Paragraph 3:</b> sum up in one or two sentences.</li></ul>
<div class="work"><span class="eyebrow">Example opening</span><div>I want to become an electrician because it is a skilled job that will always be needed. Every house, school and hospital needs power, so there will always be work.</div></div>
<p>Use linking words (because, however, although, so, for example) and start a new paragraph when the idea changes. Spend 5 minutes planning on paper first, then about 20 minutes writing.</p>`}
];

const PROMPTS=['The job I want to do, and why','Should 16-year-olds be allowed to leave education?','Describe a time you fixed or built something'];
const CHECKS=['Capital letter at the start of every sentence, and for names','A full stop (or ? or !) at the end of every sentence','No comma splices: two sentences aren’t joined with just a comma','At least two paragraphs','At least three linking words (because, so, however…)','Read it through once, out loud, for mistakes'];

export default S;
export { PROMPTS, CHECKS };
