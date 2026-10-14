/* GCSE Business, Week 1 foundations. */
import { r, pick, fromBank, mixed, ex, slip, ul, table } from './kit.js';

function moneyQ() {
  const t = r(0, 3);
  const biz = pick([['An electrician does', 'jobs'], ['A café sells', 'coffees'], ['A phone repair shop does', 'repairs'], ['A mobile car wash does', 'washes']]);
  if (t === 0) { const p = r(3, 40), q = r(10, 90); return { q: `${biz[0]} ${q} ${biz[1]} at £${p} each. What is the revenue?`, a: p * q, u: '£', pre: true, s: `Revenue = price × quantity = ${p} × ${q} = £${p * q}` }; }
  if (t === 1) { const f = r(2, 20) * 100, v = r(1, 30) * 50; return { q: `Fixed costs are £${f} and variable costs are £${v}. What are the total costs?`, a: f + v, u: '£', pre: true, s: `Total costs = fixed + variable = ${f} + ${v} = £${f + v}` }; }
  if (t === 2) { const rev = r(20, 90) * 100, c = r(10, 80) * 100; return { q: `Revenue is £${rev} and total costs are £${c}. What is the profit? (Use a minus sign for a loss.)`, a: rev - c, u: '£', pre: true, s: `Profit = revenue − costs = ${rev} − ${c} = ${rev < c ? `−£${c - rev} (a loss of £${c - rev})` : `£${rev - c}`}` }; }
  const vc = r(2, 9), q = r(10, 60); return { q: `Each item costs £${vc} to make. ${q} are made. What are the total variable costs?`, a: vc * q, u: '£', pre: true, s: `Variable cost per unit × quantity = ${vc} × ${q} = £${vc * q}` };
}

const S = [
{
  id: 's1', title: 'What is a business?', sub: 'Enterprise, entrepreneurs, goods and services',
  lesson: `<p>A business provides <b>goods</b> (things you can touch, like cables) or <b>services</b> (things done for you, like rewiring a house) to meet customers’ <b>needs</b> (essentials, like heating) and <b>wants</b> (nice-to-haves, like smart lighting).</p>
<p>An <b>entrepreneur</b> spots an opportunity and starts a business. They take a <b>risk</b> (they could lose money) for a <b>reward</b> (profit, independence, doing something they enjoy).</p>
${ex('Example', 'Jade qualifies as an electrician and starts her own firm.', 'Risk: she buys a van and tools, and may not find enough customers.', 'Reward: she keeps the profit and chooses her own jobs.')}
${slip('Why do businesses start? To make a profit, to fill a gap in the market, or to help others (a social enterprise).')}`,
  make: fromBank([
    ['A plumber fixing a leak is providing a…', 'service', 'good', 'want', 'stakeholder', 'Something done for you is a service.'],
    ['A shop selling a kettle is providing a…', 'good', 'service', 'risk', 'profit', 'Goods are physical products.'],
    ['An entrepreneur is someone who…', 'starts a business and takes a risk', 'works for the government in an office', 'only buys shares in other companies', 'never takes any risks with money', 'They organise resources to start an enterprise.'],
    ['Food and shelter are…', 'needs', 'wants', 'services', 'risks', 'Needs are things we must have to survive.'],
    ['A games console is a…', 'want', 'need', 'service', 'stakeholder', 'Nice to have, but not essential.'],
    ['Which is a risk of starting a business?', 'Losing the money you put in', 'Being your own boss every day', 'Keeping all the profit you make', 'Choosing your own working hours', 'The others are rewards.'],
    ['Which is a reward of starting a business?', 'Keeping the profit', 'Losing savings', 'Working long hours', 'Uncertain income', 'Profit is the main financial reward.'],
    ['A business that spots something customers want that nobody sells has found…', 'a gap in the market', 'a loss', 'a stakeholder', 'a fixed cost', 'Gaps in the market are business opportunities.'],
    ['A social enterprise mainly aims to…', 'help people or the environment', 'make the biggest profit possible', 'avoid all customers', 'pay no staff', 'Profits are reinvested in its social aims.'],
    ['Which is a service an electrician offers?', 'Testing a house’s wiring', 'Selling a lamp from a shop', 'Making copper', 'Printing money', 'It’s work done for a customer.'],
  ]),
},
{
  id: 's2', title: 'Business aims', sub: 'What businesses are trying to achieve',
  lesson: `${ul(['<b>Survival:</b> keeping going, especially in the first year.', '<b>Profit:</b> making more money than it spends.', '<b>Growth:</b> getting bigger: more customers, staff or locations.', '<b>Market share:</b> having a bigger slice of all sales in the market.', '<b>Customer satisfaction:</b> happy customers who come back and recommend you.'])}
<p>Aims change over time. A new business usually aims to survive. An established one aims to grow.</p>
${ex('Example', 'Year 1: a new electrical firm just wants to cover its costs (survival).', 'Year 5: it wants to hire two apprentices and open in a second town (growth).')}
${slip('An aim is the overall goal. An objective is a specific, measurable step towards it ("increase sales by 10% this year").')}`,
  make: fromBank([
    ['A brand-new business is most likely to aim for…', 'survival', 'market domination', 'opening 50 shops', 'buying competitors', 'Many businesses fail in their first year.'],
    ['Making more money than you spend is…', 'profit', 'survival', 'market share', 'growth', 'Profit = revenue minus costs.'],
    ['Opening a second branch is an example of…', 'growth', 'survival', 'a loss', 'a stakeholder', 'The business is getting bigger.'],
    ['Market share means…', 'a business’s percentage of all sales in a market', 'the number of shareholders a business has in total', 'the price of one share in the business today', 'its total costs, both fixed and variable, for a year', 'e.g. 20% of all phones sold.'],
    ['Why might aims change over time?', 'The business grows and its situation changes', 'They never change once the business has started', 'The law forces every business to change them yearly', 'Customers vote to choose the aims each year', 'Survival matters early; growth later.'],
    ['"Increase sales by 10% by December" is an example of…', 'an objective', 'a need', 'a service', 'a loss', 'It’s specific and measurable.'],
    ['Why does customer satisfaction matter?', 'Happy customers return and recommend you', 'It lowers the business’s fixed costs to zero', 'It is a legal requirement for every business', 'It doesn’t matter as long as prices are low', 'Repeat business and word of mouth bring sales.'],
    ['A charity’s main aim is likely to be…', 'helping a cause', 'maximum profit', 'market share', 'paying dividends', 'Not-for-profit organisations put their cause first.'],
  ]),
},
{
  id: 's3', title: 'Stakeholders', sub: 'Everyone affected by a business',
  lesson: `<p>A <b>stakeholder</b> is anyone affected by, or interested in, what a business does.</p>
${table(['Stakeholder', 'What they want'], [['Owners / shareholders', 'Profit (shareholders get their share as dividends)'], ['Employees', 'Fair pay, job security, safe work'], ['Customers', 'Good quality at a fair price'], ['Suppliers', 'Regular orders, paid on time'], ['Local community', 'Jobs, little noise or pollution'], ['Government', 'Taxes paid, laws followed']])}
<p><b>Internal</b> stakeholders are inside the business (owners, employees). <b>External</b> ones are outside (customers, suppliers, community, government).</p>
${ex('Conflict', 'Owners want lower costs to raise profit.', 'Employees want higher pay.', 'They can’t both fully get what they want.')}`,
  make: fromBank([
    ['A stakeholder is…', 'anyone affected by or interested in a business', 'only the owner who started the business', 'only the customers who buy from it', 'a type of loan from a bank', 'Many groups have a "stake".'],
    ['Which is an internal stakeholder?', 'Employees', 'Customers', 'Suppliers', 'Government', 'They work inside the business.'],
    ['Which is an external stakeholder?', 'Suppliers', 'Employees', 'Owners', 'Managers', 'They are outside the business.'],
    ['What do customers mainly want?', 'Good quality at a fair price', 'High profits for owners', 'Taxes paid', 'Long working hours', 'Value for money.'],
    ['What do suppliers mainly want?', 'Regular orders and to be paid on time', 'Low wages for the business’s staff', 'More pollution from the business', 'No orders, so they can rest', 'They’re businesses too.'],
    ['The government mainly wants a business to…', 'pay taxes and follow the law', 'make losses every year', 'cut as many jobs as it can', 'pollute the local area', 'Taxes fund public services.'],
    ['Owners wanting low costs and staff wanting pay rises is an example of…', 'stakeholder conflict', 'business growth', 'market share', 'a service', 'Their aims clash.'],
    ['The local community would probably like a business to…', 'create local jobs', 'make more noise', 'close the park', 'raise prices', 'Jobs help the area.'],
    ['Shareholders mainly want…', 'a share of the profit (dividends)', 'free products from the business', 'lower wages for themselves', 'to become customers of the business', 'They’ve invested money.'],
  ]),
},
{
  id: 's4', title: 'Revenue, costs and profit', sub: 'The money side of a business',
  lesson: `${table(['Term', 'Formula'], [['Revenue', 'price × quantity sold'], ['Total costs', 'fixed costs + variable costs'], ['Profit', 'revenue − total costs']])}
${ul(['<b>Fixed costs</b> stay the same however much you sell (rent, insurance, van lease).', '<b>Variable costs</b> change with how much you sell (materials, cable, fuel per job).', 'If costs are bigger than revenue, the business makes a <b>loss</b>.'])}
${ex('Worked example', 'An electrician does 20 jobs at £150 each. Revenue = 20 × 150 = £3000.', 'Fixed costs £800, variable costs £1200. Total costs = £2000.', 'Profit = 3000 − 2000 = <b>£1000</b>')}`,
  make: mixed([
    ['Rent for a workshop is a…', 'fixed cost', 'variable cost', 'revenue', 'profit', 'It’s the same however many jobs you do.'],
    ['Cable used on each job is a…', 'variable cost', 'fixed cost', 'revenue', 'profit', 'More jobs, more cable.'],
    ['Revenue is…', 'price × quantity sold', 'revenue − costs', 'fixed + variable costs', 'the same as profit', 'It’s the money coming in from sales.'],
    ['If costs are higher than revenue, the business makes a…', 'loss', 'profit', 'revenue', 'dividend', 'It’s spending more than it earns.'],
  ], moneyQ, 5),
},
{
  id: 's5', title: 'Types of business ownership', sub: 'Sole traders, partnerships and limited companies',
  lesson: `${table(['Type', 'Owned by', 'Liability'], [['Sole trader', 'One person', 'Unlimited'], ['Partnership', '2 or more partners', 'Usually unlimited'], ['Private limited company (Ltd)', 'Shareholders (often family/friends)', 'Limited'], ['Franchise', 'A franchisee runs a branch of a known brand', 'Depends on how it’s set up']])}
<p><b>Unlimited liability</b> means the owner is personally responsible for all the business’s debts. They could lose their house or savings.</p>
<p><b>Limited liability</b> means owners can only lose what they invested in the business.</p>
${ex('Example', 'Many electricians start as sole traders: easy to set up, keep all the profit.', 'As they grow and take on risk, many become a Ltd company to protect their personal money.')}`,
  make: fromBank([
    ['A business owned by one person is a…', 'sole trader', 'partnership', 'Ltd company', 'franchise', 'Sole means one.'],
    ['Unlimited liability means…', 'owners are personally responsible for all debts', 'owners can only lose what they invested', 'there are no debts', 'the government pays debts', 'Personal belongings could be at risk.'],
    ['Limited liability means…', 'owners can only lose what they invested', 'owners must pay all debts personally', 'the business can’t borrow', 'there are no owners', 'Personal money is protected.'],
    ['Which type has limited liability?', 'Private limited company (Ltd)', 'Sole trader', 'Partnership', 'None of them', 'That’s what "limited" means.'],
    ['An advantage of being a sole trader is…', 'you keep all the profit', 'limited liability', 'lots of people to share work', 'easy to raise huge amounts of money', 'No one else shares the profit.'],
    ['A disadvantage of a partnership is…', 'partners may disagree', 'only one owner', 'it can’t make profit', 'it must sell shares publicly', 'Decisions are shared, so disputes can happen.'],
    ['Running a branch of a well-known brand under licence is a…', 'franchise', 'sole trader', 'charity', 'partnership', 'e.g. many fast-food outlets.'],
    ['Who owns a private limited company?', 'Shareholders', 'The government', 'Customers', 'Suppliers', 'Shares are not sold to the general public.'],
    ['Why might a sole trader become a Ltd company?', 'To protect personal money with limited liability', 'To pay more tax every single year, always', 'To have unlimited liability for all the debts', 'To stop making a profit and become a charity', 'Limiting risk becomes important as a business grows.'],
  ]),
},
{
  id: 's6', title: 'Market research', sub: 'Finding out what customers want',
  lesson: `${ul(['<b>Primary research</b> is new research you do yourself: surveys, interviews, focus groups, observation. Specific to you, but takes time and money.', '<b>Secondary research</b> uses data that already exists: websites, government statistics, reports, competitors’ prices. Quick and cheap, but may be out of date or not quite fit.'])}
${ul(['<b>Quantitative</b> data is numbers ("62% would pay more for same-day service").', '<b>Qualitative</b> data is opinions and reasons ("I want an electrician who turns up on time").'])}
<p><b>Market segmentation</b> splits customers into groups (by age, location, income, lifestyle) so a business can target them.</p>
${ex('Example', 'An electrician surveys 50 local homeowners (primary).', 'They also check the council website for new housing estates nearby (secondary).')}`,
  make: fromBank([
    ['A survey you carry out yourself is…', 'primary research', 'secondary research', 'segmentation', 'a fixed cost', 'You collected it first-hand.'],
    ['Reading government statistics online is…', 'secondary research', 'primary research', 'a focus group', 'observation', 'Someone else collected it.'],
    ['An advantage of secondary research is…', 'it’s quick and cheap', 'it’s always up to date', 'it’s exactly about your business', 'nobody else has it', 'It already exists.'],
    ['An advantage of primary research is…', 'it’s specific to your business', 'it’s free to carry out', 'it’s instant, with no waiting', 'it’s always completely unbiased', 'You ask exactly what you need.'],
    ['"70% of customers prefer evening appointments" is…', 'quantitative data', 'qualitative data', 'secondary only', 'a want', 'It’s a number.'],
    ['"I like that they explained everything clearly" is…', 'qualitative data', 'quantitative data', 'a fixed cost', 'a census', 'It’s an opinion.'],
    ['A small group discussing a product with a researcher is a…', 'focus group', 'census', 'franchise', 'sole trader', 'It gives detailed opinions.'],
    ['Market segmentation means…', 'splitting customers into groups', 'selling shares to the public', 'cutting prices to win sales', 'merging two businesses together', 'e.g. by age, location or income.'],
    ['Which is a way to segment a market?', 'By location', 'By the colour of your van', 'By your favourite food', 'By the day of the week you were born', 'Location, age, income and lifestyle are common.'],
  ]),
},
];

export default S;
