/* English, Week 2: accuracy and reading skills for GCSE English Language. */
import { fromBank, ex, slip, ul } from './kit.js';

export default [
{
  id: 's7', title: 'Apostrophes', sub: 'Missing letters and belonging',
  lesson: `<p>Apostrophes do two jobs:</p>
${ul(['<b>Missing letters:</b> do not → don’t, it is → it’s, they are → they’re', '<b>Belonging:</b> the electrician’s van (one electrician). The electricians’ vans (more than one).'])}
${ex('Worked example', 'The van belongs to Sam: Sam’s van', 'The tools belong to the apprentices: the apprentices’ tools', 'The children own the toys: the children’s toys (children is already plural)', 'The car belongs to the boss: the boss’s car (one person whose name ends in s still gets ’s)')}
${slip('Plurals don’t need an apostrophe: "two cables", not "two cable’s".')}`,
  make: fromBank([
    ['Which is correct?', 'I don’t know.', 'I dont know.', 'I do’nt know.', 'I don,t know.', 'The apostrophe goes where the missing letter (o) was: do not → don’t.'],
    ['Which is correct?', 'We bought two new drills.', 'We bought two new drill’s.', 'We bought two new drills’.', 'We bought two new drill’s’.', 'Plurals don’t take an apostrophe.'],
    ['One customer owns the house. Which is correct?', 'the customer’s house', 'the customers house', 'the customers’ house', 'the customer’s’ house', 'One owner: add ’s.'],
    ['Three apprentices share a toolbox. Which is correct?', 'the apprentices’ toolbox', 'the apprentice’s toolbox', 'the apprentices toolbox', 'the apprentices’s toolbox', 'Plural ending in s: put the apostrophe after the s.'],
    ['"They are late." Shortened, this is…', 'They’re late.', 'Their late.', 'There late.', 'Theyr’e late.', 'they are → they’re.'],
    ['Which is correct?', 'She can’t come today.', 'She cant come today.', 'She ca’nt come today.', 'She can’t’ come today.', 'cannot → can’t.'],
    ['Which is correct?', 'the children’s books', 'the childrens’ books', 'the childrens books', 'the children books’', '"Children" is already plural and doesn’t end in s, so add ’s.'],
    ['Which is correct?', 'I’ve finished the job.', 'Iv’e finished the job.', 'Ive finished the job.', 'I’ve’ finished the job.', 'I have → I’ve.'],
    ['Which is correct?', 'We’ll start at nine.', 'Well start at nine.', 'We,ll start at nine.', 'Wel’l start at nine.', 'we will → we’ll.'],
    ['Which needs an apostrophe?', 'the boss (owns) car → the boss’s car', 'three cars parked outside the house', 'the cables are new and still coiled', 'two days later, the job was done', 'Only the one showing belonging needs an apostrophe.'],
  ]),
},
{
  id: 's8', title: 'Words that sound the same', sub: 'Their/there/they’re, your/you’re, to/too/two',
  lesson: `${ul(['<b>there</b> = a place (over there) · <b>their</b> = belonging to them · <b>they’re</b> = they are', '<b>your</b> = belonging to you · <b>you’re</b> = you are', '<b>to</b> = towards / to do · <b>too</b> = also or too much · <b>two</b> = 2', '<b>its</b> = belonging to it · <b>it’s</b> = it is', '<b>where</b> = place · <b>were</b> = past of are · <b>wear</b> = clothes'])}
${ex('Test', 'Can you swap in "they are" or "you are" or "it is"? If yes, use the apostrophe version.')}`,
  make: fromBank([
    ['___ going to be late.', 'They’re', 'Their', 'There', 'Thier', '"They are going to be late" makes sense.'],
    ['Put the tools over ___.', 'there', 'their', 'they’re', 'thier', 'A place: there.'],
    ['The apprentices left ___ bags in the van.', 'their', 'there', 'they’re', 'thier', 'Belonging to them: their.'],
    ['___ doing really well.', 'You’re', 'Your', 'Youre', 'Yor', '"You are doing really well."'],
    ['Is this ___ meter?', 'your', 'you’re', 'youre', 'yore', 'Belonging to you: your.'],
    ['This box is ___ heavy to lift.', 'too', 'to', 'two', 'tow', '"Too" means more than enough.'],
    ['We need ___ more sockets.', 'two', 'to', 'too', 'tow', 'The number 2.'],
    ['The dog wagged ___ tail.', 'its', 'it’s', 'its’', 'it is', 'Belonging to it: its (no apostrophe).'],
    ['___ raining again.', 'It’s', 'Its', 'Its’', 'It', '"It is raining again."'],
    ['___ did you leave the drill?', 'Where', 'Were', 'Wear', 'We’re', 'Asking about a place: where.'],
    ['You must ___ goggles when drilling.', 'wear', 'where', 'were', 'we’re', 'Clothes and kit: wear.'],
  ]),
},
{
  id: 's9', title: 'Capital letters', sub: 'Where they always go',
  lesson: `<p>Use a capital letter for:</p>
${ul(['The start of every sentence', 'The word <b>I</b>', 'Names of people and places: Mason, Watford, England', 'Days and months: Monday, October (not seasons: summer)', 'Organisations and brands: West Herts College, City and Guilds', 'The main words in titles'])}
${slip('Don’t use capitals for ordinary words in the middle of a sentence, like "Electrician" or "College", unless it’s a name.')}`,
  make: fromBank([
    ['Which is correct?', 'On Monday I start at West Herts College.', 'On monday I start at West Herts College.', 'On Monday i start at West Herts College.', 'On Monday I start at west herts college.', 'Days, the word I, and the college’s name all need capitals.'],
    ['Which is correct?', 'My course starts in September.', 'My course starts in september.', 'My Course starts in September.', 'my course starts in September.', 'Months need capitals; ordinary words don’t.'],
    ['Which is correct?', 'I want to be an electrician.', 'I want to be an Electrician.', 'i want to be an electrician.', 'I Want To Be An Electrician.', '"Electrician" is an ordinary word, not a name.'],
    ['Which word needs a capital?', 'london', 'cable', 'summer', 'college', 'London is the name of a place.'],
    ['Which is correct?', 'We went fishing in the summer.', 'We went fishing in the Summer.', 'we went fishing in the summer.', 'We Went fishing in the summer.', 'Seasons don’t take capitals.'],
    ['Which is correct?', 'My friend Josh lives in Hemel Hempstead.', 'My friend josh lives in Hemel Hempstead.', 'My Friend Josh lives in hemel hempstead.', 'my friend Josh lives in Hemel Hempstead.', 'Names of people and places need capitals.'],
    ['Which is correct?', 'The course is run by City and Guilds.', 'The course is run by city and guilds.', 'The Course is run by City and Guilds.', 'the course is run by City and Guilds.', 'Organisation names take capitals.'],
    ['Which needs a capital letter?', 'the word "i" on its own', 'the word "cable"', 'the word "winter"', 'the word "college"', 'I on its own is always a capital.'],
    ['Which is correct?', 'It was cold. We wore gloves.', 'It was cold. we wore gloves.', 'it was cold. We wore gloves.', 'It was cold. We Wore gloves.', 'Every new sentence starts with a capital.'],
  ]),
},
{
  id: 's10', title: 'Paragraphs', sub: 'When to start a new one',
  lesson: `<p>Start a new paragraph when something changes. Remember <b>TiPToP</b>:</p>
${ul(['<b>Ti</b>me changes ("Later that day…")', '<b>P</b>lace changes ("Back at the workshop…")', '<b>To</b>pic changes (a new reason or idea)', '<b>P</b>erson speaking changes (in speech)'])}
${ex('Example', 'Paragraph 1: why you want to be an electrician.', 'Paragraph 2: a NEW reason, so a new paragraph: the money and job security.')}
${slip('One giant paragraph loses marks for organisation, even if the ideas are good.')}`,
  make: fromBank([
    ['You’ve written about your first reason. Now you give a second reason. You should…', 'start a new paragraph', 'carry on in the same paragraph', 'start a new page', 'stop writing', 'A new idea or reason means a new paragraph.'],
    ['"The next morning, we set off early." This sentence probably starts a new paragraph because…', 'the time has changed', 'it is a short sentence', 'it has a comma in it', 'it is the end of the story', 'Time changes are a TiPToP trigger.'],
    ['In a story, a different character starts speaking. You should…', 'start a new line or paragraph', 'keep it in the same line', 'use capitals', 'leave it out', 'Each new speaker gets a new line.'],
    ['What does TiPToP stand for?', 'Time, Place, Topic, Person', 'Title, Point, Text, Paragraph', 'Tidy, Proper, Tidy, Polite', 'Time, Punctuation, Tone, Pace', 'Four reasons to start a new paragraph.'],
    ['Why do paragraphs matter in an exam?', 'They show your writing is organised', 'They make your answer look longer', 'They aren’t marked, but look neat', 'They save ink and time', 'Organisation is a big part of the writing mark.'],
    ['"Meanwhile, back at the house…" changes the…', 'place', 'speaker', 'spelling', 'tense', 'It moves to a new location.'],
    ['A good paragraph usually has…', 'one main idea', 'every idea you have', 'only one sentence', 'no full stops', 'Each paragraph focuses on one point.'],
    ['Which is a good way to start a second paragraph?', 'Another reason I want this job is…', 'and also, on top of all that…', 'so yeah, anyway, like I said…', 'The end. Thank you for reading.', 'It clearly signals a new point.'],
  ]),
},
{
  id: 's11', title: 'Fact or opinion?', sub: 'Spotting what can be proved',
  lesson: `${ul(['A <b>fact</b> can be proved true or false: "UK mains is 230 volts."', 'An <b>opinion</b> is what someone thinks or feels: "Electrics is the best job."', 'Words like <b>best, worst, should, I think, amazing, boring</b> often signal opinions.'])}
${ex('Example', '"The course lasts one year." Fact: you can check it.', '"The course is easy." Opinion: someone else might disagree.')}
${slip('Writers mix facts and opinions to persuade. Spotting which is which is a GCSE reading skill.')}`,
  make: fromBank([
    ['"Watford is in Hertfordshire." This is…', 'a fact', 'an opinion', 'a question', 'a command', 'It can be checked on a map.'],
    ['"Fishing is the most relaxing hobby." This is…', 'an opinion', 'a fact', 'a statistic', 'a command', '"Most relaxing" is a personal view.'],
    ['"The college opens at 9am." This is…', 'a fact', 'an opinion', 'a feeling', 'a guess', 'It can be checked.'],
    ['"Electricians should earn more than doctors." This is…', 'an opinion', 'a fact', 'a statistic', 'a law', '"Should" shows a view.'],
    ['Which word often shows an opinion?', 'brilliant', 'metre', 'Tuesday', 'twelve', 'Words that judge are usually opinions.'],
    ['"There are 7 days in a week." This is…', 'a fact', 'an opinion', 'a prediction', 'a question', 'It’s always true.'],
    ['"The new phone is far better than the old one." This is…', 'an opinion', 'a fact', 'a statistic', 'a law', '"Better" is a judgement.'],
    ['"65% of people surveyed said yes." This is…', 'a fact (a statistic)', 'an opinion (a view)', 'a feeling (an emotion)', 'a command (an order)', 'It reports a measured result.'],
    ['Why do adverts mix facts with opinions?', 'To persuade you', 'To confuse the law', 'Because they have to', 'To save money', 'Facts make the opinions sound believable.'],
  ]),
},
{
  id: 's12', title: 'Similes and metaphors', sub: 'Comparisons writers use',
  lesson: `${ul(['A <b>simile</b> compares using <b>like</b> or <b>as</b>: "The cable was as stiff as a rod."', 'A <b>metaphor</b> says something IS something else: "The workshop was an oven."', '<b>Personification</b> gives human qualities to things: "The wind howled."'])}
${ex('Explaining the effect', '"The workshop was an oven."', 'It suggests it was extremely, uncomfortably hot.', 'In the exam, always say what the comparison suggests, not just its name.')}`,
  make: fromBank([
    ['"He ran like the wind." This is a…', 'simile', 'metaphor', 'fact', 'question', 'It uses "like".'],
    ['"The classroom was a zoo." This is a…', 'metaphor', 'simile', 'fact', 'statistic', 'It says the room IS a zoo.'],
    ['"The kettle screamed." This is…', 'personification', 'a simile', 'a fact', 'alliteration', 'Kettles can’t really scream; it’s given a human action.'],
    ['"As cold as ice" is a…', 'simile', 'metaphor', 'personification', 'command', 'It uses "as".'],
    ['"Her words were daggers." What does this suggest?', 'Her words were hurtful', 'She was holding knives', 'She spoke quietly', 'She was happy', 'Daggers cause pain, so the words hurt.'],
    ['"The lake was a mirror." What does this suggest?', 'The water was very still and calm', 'The lake was made of glass', 'It was raining', 'The lake was dirty', 'Mirrors are smooth and reflect, like still water.'],
    ['Which is a metaphor?', 'Time is money.', 'He swam like a fish.', 'It was as hot as the sun.', 'The cable is 2 metres long.', 'It says time IS money, without "like" or "as".'],
    ['"The old house groaned in the wind." This is…', 'personification', 'a simile', 'alliteration', 'a fact', 'Groaning is a human sound given to a house.'],
    ['In the exam, after naming a simile you should…', 'explain what it suggests', 'write it out again in full', 'count the words in it', 'move straight on', 'Marks come from explaining the effect.'],
  ]),
},
{
  id: 's13', title: 'Persuasive techniques', sub: 'How writers win you over',
  lesson: `${ul(['<b>Rhetorical question:</b> "Who wouldn’t want a safe home?"', '<b>Rule of three:</b> "fast, friendly and fair"', '<b>Statistics:</b> "9 out of 10 customers…"', '<b>Direct address:</b> talking to "you"', '<b>Emotive language:</b> words that stir feelings: "devastating", "heartbroken"', '<b>Expert opinion:</b> "Fire officers warn that…"'])}
${slip('In Paper 2, you’ll write your own persuasive piece. Use two or three of these, not all of them.')}`,
  make: fromBank([
    ['"Don’t you want your family to be safe?" This is a…', 'rhetorical question', 'statistic', 'rule of three', 'simile', 'A question asked for effect, not for an answer.'],
    ['"Quick, clean and reliable." This is the…', 'rule of three', 'rhetorical question', 'statistic', 'metaphor', 'Three ideas in a row stick in the mind.'],
    ['"9 out of 10 customers would recommend us." This is a…', 'statistic', 'rhetorical question', 'simile', 'opinion only', 'A number used as evidence.'],
    ['"You deserve a home you can trust." This uses…', 'direct address', 'a statistic', 'a simile', 'alliteration', 'It speaks directly to "you".'],
    ['"The devastating fire left families heartbroken." This uses…', 'emotive language', 'a statistic', 'a rhetorical question', 'direct address', 'Words chosen to make you feel something.'],
    ['"Fire officers warn that old wiring is dangerous." This is…', 'expert opinion', 'a simile', 'rule of three', 'a fact about fishing', 'Quoting experts makes a point more convincing.'],
    ['Why do writers use statistics?', 'They make an argument seem proven', 'To fill space and make it longer', 'Because the law says they must', 'To confuse the reader on purpose', 'Numbers sound factual and reliable.'],
    ['Why use a rhetorical question?', 'To make the reader think and agree', 'To get a written answer back', 'To end the text quickly', 'To list facts in order', 'It nudges the reader towards the writer’s view.'],
  ]),
},
{
  id: 's14', title: 'Finding the main idea', sub: 'Summarising what you read',
  lesson: `<p>To find the main idea, ask: <b>what is the writer mostly telling me?</b> Ignore small details and examples.</p>
${ex('Example', '"Many apprentices find the first year tough. Early starts, cold sites and new skills can be tiring. But most say it gets easier, and they’re proud of what they learn."', 'Main idea: the first year is hard, but it gets better and is worth it.')}
${slip('A good summary uses your own words and is much shorter than the original.')}`,
  make: fromBank([
    ['"Fishing teaches patience. You might wait hours for a bite. Anglers learn to stay calm and focused." Main idea?', 'Fishing teaches patience', 'Fish bite after hours', 'Anglers wear hats', 'Fishing is expensive', 'Everything supports the first sentence.'],
    ['"Smart meters show how much energy you use. They can help families spot waste and cut bills." Main idea?', 'Smart meters can help reduce energy bills', 'Families waste far too much energy at home', 'Meters are smart and show lots of numbers', 'Energy bills are high for every family', 'The text explains a benefit of smart meters.'],
    ['"Electric cars are growing fast. Sales doubled last year, and more chargers are being fitted every day." Main idea?', 'Electric cars are becoming more popular', 'New chargers are being fitted every day', 'Car sales in the UK are low this year', 'Electric cars are faster than petrol cars', 'The details all show growth.'],
    ['"Some people think homework is pointless. Others say it builds good habits. Studies give mixed results." Main idea?', 'People disagree about whether homework helps', 'Homework is pointless and should be stopped', 'Studies about homework are all mixed up', 'Homework builds good habits for students', 'Both sides are given; the point is the disagreement.'],
    ['"Ladders cause many workplace injuries. Most falls happen because ladders are used at the wrong angle or for too long." Main idea?', 'Ladder misuse causes many injuries', 'Ladders are long', 'Most injuries are at home', 'Angles are important in maths', 'It’s about injuries from using ladders wrongly.'],
    ['A good summary should be…', 'shorter, in your own words', 'longer than the original text', 'copied out word for word', 'only the first line of the text', 'Summaries are short and in your own words.'],
    ['Which detail is LEAST important to the main idea? "Recycling saves energy. Making cans from old ones uses 95% less energy. My neighbour has a blue bin."', 'My neighbour has a blue bin', 'Recycling saves energy', 'Making cans from old ones uses 95% less energy', 'They’re all equally important', 'The neighbour’s bin doesn’t support the point.'],
    ['"The storm knocked out power to 3,000 homes. Engineers worked through the night, and by morning most were reconnected." Main idea?', 'Engineers quickly restored power after a storm', 'There were 3,000 homes in the area that night', 'Storms usually happen in the middle of the night', 'Engineers sleep in the morning after night work', 'The text is about the repair work after the storm.'],
  ]),
},
{
  id: 's15', title: 'Commas', sub: 'Lists, openers and extra information',
  lesson: `${ul(['<b>Lists:</b> "I need cable, screws, tape and a drill." (no comma before "and" is fine)', '<b>After an opener:</b> "After lunch, we fitted the sockets."', '<b>Around extra information:</b> "My dad, who is a mechanic, fixed it."'])}
${slip('A comma can’t join two full sentences on its own. That’s a comma splice (from Week 1).')}`,
  make: fromBank([
    ['Which list is punctuated correctly?', 'I packed rods, bait, hooks and a flask.', 'I packed rods bait hooks and a flask.', 'I packed, rods, bait, hooks, and, a flask.', 'I packed rods, bait hooks and, a flask.', 'Commas separate the items.'],
    ['Which is correct?', 'After work, we went fishing.', 'After work we, went fishing.', 'After, work we went fishing.', 'After work we went, fishing.', 'Put the comma after the opening phrase.'],
    ['Which is correct?', 'My brother, who loves cars, wants to be a mechanic.', 'My brother who loves cars, wants to be a mechanic.', 'My brother, who loves cars wants to be a mechanic.', 'My, brother who loves cars wants to be a mechanic.', 'Extra information needs a comma on both sides.'],
    ['Which is a comma splice (wrong)?', 'It was late, we went home.', 'It was late, so we went home.', 'It was late. We went home.', 'Because it was late, we went home.', 'Two full sentences joined only by a comma.'],
    ['Which is correct?', 'However, the job took longer than planned.', 'However the job, took longer than planned.', 'However the job took, longer than planned.', 'However the, job took longer than planned.', 'Put a comma after "However" at the start.'],
    ['Where should the comma go? "When the power came back on the lights flickered."', 'after "on"', 'after "When"', 'after "lights"', 'nowhere', 'After the opening part: "When the power came back on, the lights…"'],
    ['Which list is correct?', 'We need red, blue and green wires.', 'We need red blue, and green wires.', 'We need, red, blue, and green wires.', 'We need red blue and green, wires.', 'Commas between list items.'],
    ['Which is correct?', 'Mr Patel, our neighbour, is an electrician.', 'Mr Patel our neighbour, is an electrician.', 'Mr Patel, our neighbour is an electrician.', 'Mr, Patel our neighbour is an electrician.', 'Extra information sits between two commas.'],
  ]),
},
];
