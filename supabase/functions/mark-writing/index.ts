import { admin, callClaude, cors, isWeekend, json, requireStudent, takeQuota } from '../_shared/common.ts';
import { classify, raiseAlert } from '../_shared/wellbeing.ts';

const MODEL = Deno.env.get('MARKING_MODEL') ?? 'claude-sonnet-5-5';
const DAILY_LIMIT = Number(Deno.env.get('MARKING_DAILY_LIMIT') ?? 6);

const SYSTEM = `You are an experienced GCSE English Language teacher in England marking a short piece of writing by a 15-year-old home-educated student.
He is currently around GCSE grade 1-2 and is aiming for grade 4 (Foundation). Mark against the spirit of GCSE English Language Paper 2 Section B:
- Content and organisation (ideas, purpose, paragraphs, linking)
- Technical accuracy (sentence demarcation, punctuation, spelling, grammar, vocabulary range)

Be honest but encouraging: he must be able to act on your feedback. Write to him directly ("you"), in plain words a struggling reader can follow.
Estimate the grade conservatively for a piece this short. Pick at most 6 corrections, the most useful ones, quoting his exact words.
Targets must be specific and doable in his next piece (e.g. "Start a new paragraph each time you give a new reason"), not vague ("improve punctuation").
The parent note is 1-2 sentences for a parent who is not confident marking English: what he did well and what to practise at home.
Always respond by calling the record_feedback tool.`;

const TOOL = {
  name: 'record_feedback',
  description: 'Record marking feedback for the student.',
  input_schema: {
    type: 'object',
    required: ['grade_estimate', 'score_out_of_10', 'summary', 'strengths', 'targets', 'corrections', 'parent_note'],
    properties: {
      grade_estimate: { type: 'string', description: 'e.g. "Around GCSE grade 2"' },
      score_out_of_10: { type: 'integer', minimum: 0, maximum: 10 },
      content_and_organisation: { type: 'string', description: 'One or two sentences.' },
      technical_accuracy: { type: 'string', description: 'One or two sentences.' },
      summary: { type: 'string', description: 'One encouraging sentence to the student.' },
      strengths: { type: 'array', items: { type: 'string' }, maxItems: 3 },
      targets: { type: 'array', items: { type: 'string' }, minItems: 1, maxItems: 3 },
      corrections: {
        type: 'array', maxItems: 6,
        items: { type: 'object', required: ['original', 'corrected', 'why'], properties: {
          original: { type: 'string' }, corrected: { type: 'string' }, why: { type: 'string' } } },
      },
      parent_note: { type: 'string' },
    },
  },
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  let id: string | undefined;
  try {
    const auth = await requireStudent(req);
    if (auth.error) return auth.error;
    const { profile } = auth;
    ({ submission_id: id } = await req.json());

    const { data: sub } = await admin.from('writing_submissions').select('*').eq('id', id).single();
    if (!sub || sub.user_id !== profile.id) return json({ error: 'Writing not found.' }, 404);
    if (sub.status === 'marked') return json({ feedback: sub.feedback });

    // Wellbeing check once per piece (first marking attempt), whatever happens with marking.
    const alerted = sub.status !== 'pending' ? Promise.resolve(null) : classify(sub.body).then(c => c.level === 'none' ? null
      : raiseAlert(profile, { level: c.level, reason: c.reason || 'Seemed upset', excerpt: sub.body, source: 'writing' }));

    if (isWeekend()) {
      await alerted;
      return json({ error: 'Marking is off at weekends. Your writing is saved and can be marked on Monday.' }, 403);
    }
    if (!(await takeQuota(profile.id, 'marking', DAILY_LIMIT))) {
      await alerted;
      return json({ error: 'That\u2019s enough marking for today. Your writing is saved; try again tomorrow.' }, 429);
    }

    let out;
    try {
      out = await callClaude({
        model: MODEL, max_tokens: 2000, system: SYSTEM,
        tools: [TOOL], tool_choice: { type: 'tool', name: 'record_feedback' },
        messages: [{ role: 'user', content: `Title: ${sub.title}\nWord count: ${sub.word_count}\n\n<writing>\n${sub.body}\n</writing>` }],
      });
    } finally { await alerted; }
    const fb = (out.content ?? []).find((b: { type: string }) => b.type === 'tool_use')?.input;
    if (!fb) throw new Error('Marking did not finish. Try again.');

    await admin.from('writing_submissions').update({ status: 'marked', feedback: fb }).eq('id', sub.id);
    return json({ feedback: fb });
  } catch (e) {
    console.error(e);
    if (id) await admin.from('writing_submissions').update({ status: 'failed' }).eq('id', id).neq('status', 'marked');
    return json({ error: e instanceof Error ? e.message : 'Something went wrong.' }, 500);
  }
});
