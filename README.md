# Switched On

A phone study app (installable PWA) for daily GCSE maths and English practice, built for a home-educated student heading to a Level 1 Electrical Installation course.

- **Student:** a daily maths + English lesson that adapts (7/8 to move on), an AI tutor he can ask about a question only after answering it, writing marked by AI, streaks and progress.
- **Wellbeing alerts:** every tutor message and piece of writing is checked; if he seems upset or unsafe, parents get a phone notification straight away.
- **Parent:** progress, weak topics, every attempt and mistake, writing feedback with a note for the parent, and all tutor chats.

## Stack
- React + Vite, hosted on GitHub Pages from the `docs/` folder (rebuild with `npm run build:pages`)
- Supabase: auth, Postgres with row-level security (`supabase/migrations`), edge functions `tutor` and `mark-writing` (`supabase/functions`) that call the Anthropic API

## Setup
1. Apply the migration in `supabase/migrations` and deploy both edge functions.
2. In Supabase → Edge Functions → Secrets, add `ANTHROPIC_API_KEY`, and `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` for parent alerts.
   Optional: `TUTOR_MODEL`, `MARKING_MODEL`, `TUTOR_DAILY_LIMIT` (default 60), `MARKING_DAILY_LIMIT` (default 6).
3. In Supabase → Authentication → URL Configuration, set the Site URL to the GitHub Pages address.
4. The Supabase URL, anon key and push public key live in `src/config.js` (all safe to publish).
5. In GitHub → Settings → Pages, set Source to **Deploy from a branch**, branch `main`, folder `/docs`. The repository must be called `switched-on`.

## Adding lessons
Lessons live in `src/content/`. Each session has `id`, `title`, `sub`, `lesson` (HTML) and either `gen()` (one random question) or `make()` (a set of 8). Add new sessions to the end of a subject's list; the daily plan picks them up automatically.

## Local dev
```
cp .env.example .env.local   # fill in the Supabase URL and anon key
npm install
npm run dev
npm test
```
