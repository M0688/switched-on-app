import { admin, callClaude, cors, isWeekend, json, requireLearner, takeQuota } from '../_shared/common.ts';
import { classify, raiseAlert } from '../_shared/wellbeing.ts';

const MODEL = Deno.env.get('TUTOR_MODEL') ?? 'claude-haiku-5-5';
const DAILY_LIMIT = Number(Deno.env.get('TUTOR_DAILY_LIMIT') ?? 60);

const SYSTEM = (name: string) => `You are the study helper inside "Switched On", a revision app used by ${name}, a 15-year-old in England who is home educated.
He needs at least 4 GCSEs (grade 2+) including English Language to start a Level 1 Electrical Installation diploma at college. He is studying GCSE Maths and English Language (Foundation, aiming for grade 4), Edexcel International GCSE Science Double Award, GCSE Statistics and GCSE Business, plus entry-level electrical safety and regulations (UK: BS 7671, Electricity at Work Regulations 1989, safe isolation).

How to help:
- Be warm, calm and encouraging. Talk like a good one-to-one tutor, not a textbook.
- Keep replies short: usually 2-5 sentences, never more than about 120 words. Use plain words and short sentences.
- He must always try first. His parent has asked that he never gets hints or answers to a question he hasn't attempted.
  - If he asks about a specific problem or exercise and hasn't shown his own answer or working, don't give a hint, method or answer. Ask him to have a go and tell you what he got and how.
  - Once he has attempted it, explain where he went wrong and the method step by step, then suggest a similar one to try.
  - General explanations of a topic ("what is ratio?", "how do I remember spellings?") are fine.
- Use UK spelling, UK money (£) and metric units. Where it helps, link maths to electrical work (volts, amps, cable lengths, costs).
- Show maths working on separate lines. No LaTeX; write 3 × 4 = 12, not \\times.
- Stay on schoolwork, study skills and college/career questions. If he goes off-topic, gently steer back.
- Never ask for or store personal details (address, school, phone, photos).
- If he says something that suggests he is unsafe, being hurt, or very upset, put schoolwork aside: respond kindly, take him seriously, encourage him to talk to his parent or another trusted adult, and tell him he can call or chat with Childline free and in confidence on 0800 1111 (childline.org.uk). If he is in immediate danger, he should call 999. Do not try to counsel him yourself.
- His parent can read these chats and is alerted if he seems upset. If he asks, be honest about this.`;

// Adult course: circuit board repair. No child-safeguarding checks, no weekend lockout.
const REPAIR_SYSTEM = (name: string) => `You are the tutor inside a training app used by ${name}, who runs an electronics repair business in the UK and is working through a circuit board repair course (component-level repair of phones, tablets, laptops, consoles, TVs and power supplies, and industrial boards).
How to help:
- Be direct and practical, like an experienced bench technician mentoring a capable colleague. Plain text, no markdown headings. Usually under 200 words.
- Answer questions directly. For a lesson question he has answered, explain why the right answer is right and where his reasoning slipped.
- For a live fault, ask for the device and model, symptoms, current draw and readings if they're missing, then suggest the next measurement in a sensible order.
- Be accurate. If something depends on the exact model or schematic, say so rather than guessing a part number or a value.
- Flag real hazards briefly where relevant: mains primaries and bulk capacitors, Li-ion batteries, hot air near flammables, fumes.
- Use UK spelling and SI units. No LaTeX.
- Stay on electronics, repair, tools and running a repair bench.`;

const REPAIR_LIMIT = Number(Deno.env.get('REPAIR_TUTOR_DAILY_LIMIT') ?? 100);

async function repairTutor(profile: { id: string; display_name: string }, body: { thread_id: string; session_key?: string; context?: string; message: string }) {
  const { thread_id, session_key, context, message } = body;
  if (!(await takeQuota(profile.id, 'tutor', REPAIR_LIMIT))) return json({ error: "You've used today's tutor messages. They reset tomorrow." }, 429);
  const { data: history } = await admin.from('tutor_messages')
    .select('role, content').eq('thread_id', thread_id).eq('user_id', profile.id)
    .order('created_at').limit(20);
  const ctx = typeof context === 'string' ? context.slice(0, 3000) : '';
  const messages = [
    ...(history ?? []).map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: message.trim() },
  ];
  if (!history?.length && ctx) messages[0] = { role: 'user', content: `${ctx}\n\nMy question: ${message.trim()}` };
  const out = await callClaude({ model: MODEL, max_tokens: 700, system: REPAIR_SYSTEM(profile.display_name), messages });
  const reply = (out.content ?? []).filter((b: { type: string }) => b.type === 'text').map((b: { text: string }) => b.text).join('\n').trim()
    || "Sorry, I couldn't come up with a good answer. Try asking another way.";
  await admin.from('tutor_messages').insert([
    { user_id: profile.id, thread_id, session_key: session_key ?? null, role: 'user', content: messages[messages.length - 1].content },
    { user_id: profile.id, thread_id, session_key: session_key ?? null, role: 'assistant', content: reply },
  ]);
  return json({ reply });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const auth = await requireLearner(req);
    if (auth.error) return auth.error;
    const { profile } = auth;

    const body = await req.json();
    const { thread_id, session_key, context, message } = body;
    if (typeof message !== 'string' || !message.trim() || message.length > 1500)
      return json({ error: 'Type a question first (under 1500 characters).' }, 400);
    if (typeof thread_id !== 'string' || !/^[0-9a-f-]{36}$/.test(thread_id))
      return json({ error: 'Bad request.' }, 400);
    if (profile.role !== 'student') return await repairTutor(profile, body);

    // Wellbeing check runs on every message, even if the tutor itself fails or the daily limit is hit.
    const text = message.trim();
    const alerted = classify(text, typeof context === 'string' ? context : '').then(c => c.level === 'none' ? null
      : raiseAlert(profile, { level: c.level, reason: c.reason || 'Seemed upset', excerpt: text, source: 'tutor', thread_id }));

    if (isWeekend()) {
      await alerted;
      return json({ error: "It's the weekend, so the tutor is off until Monday. If you need to talk to someone, Childline is free on 0800 1111." }, 403);
    }
    if (!(await takeQuota(profile.id, 'tutor', DAILY_LIMIT))) {
      await alerted;
      return json({ error: "You've used today's help messages. They reset tomorrow. If you need to talk to someone, Childline is free on 0800 1111." }, 429);
    }

    // Earlier messages in this thread (only this student's).
    const { data: history } = await admin.from('tutor_messages')
      .select('role, content').eq('thread_id', thread_id).eq('user_id', profile.id)
      .order('created_at').limit(20);

    const ctx = typeof context === 'string' ? context.slice(0, 3000) : '';
    const messages = [
      ...(history ?? []).map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: message.trim() },
    ];
    if (!history?.length && ctx) messages[0] = { role: 'user', content: `${ctx}\n\nMy question: ${message.trim()}` };

    let out;
    try { out = await callClaude({ model: MODEL, max_tokens: 400, system: SYSTEM(profile.display_name), messages }); }
    finally { await alerted; }
    const reply = (out.content ?? []).filter((b: { type: string }) => b.type === 'text').map((b: { text: string }) => b.text).join('\n').trim()
      || "Sorry, I couldn't think of a good answer. Try asking another way.";

    await admin.from('tutor_messages').insert([
      { user_id: profile.id, thread_id, session_key: session_key ?? null, role: 'user', content: messages[messages.length - 1].content },
      { user_id: profile.id, thread_id, session_key: session_key ?? null, role: 'assistant', content: reply },
    ]);
    return json({ reply });
  } catch (e) {
    console.error(e);
    return json({ error: e instanceof Error ? e.message : 'Something went wrong.' }, 500);
  }
});
