import { admin, cors, json } from '../_shared/common.ts';
import { pushTo } from '../_shared/wellbeing.ts';

// Lets a parent check that alerts reach their phone.
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
  const { data } = await admin.auth.getUser(token);
  if (!data.user) return json({ error: 'Please sign in again.' }, 401);
  const { data: prof } = await admin.from('profiles').select('role').eq('id', data.user.id).single();
  if (prof?.role !== 'parent') return json({ error: 'Only parents can do this.' }, 403);
  const n = await pushTo([data.user.id], { title: 'Alerts are working', body: 'You’ll get a notification like this if he seems upset.', tag: 'test', url: './#/alerts' });
  return n ? json({ sent: n }) : json({ error: 'No phone is set up for alerts yet, or sending failed.' }, 400);
});
