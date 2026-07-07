# Pregg — Pregnancy Health Tracker

A private web app for tracking a pregnancy day-to-day: medicine and exercise
reminders, blood pressure and weight readings with trend graphs, a pregnancy
week/baby-size tracker, a symptom log, and a kick counter.

## Features

- **Accounts** — sign up with email/password (plus first/last name, contact
  number, and address), or sign in on any device to see the same data.
- **Reminders** — schedule medicine or exercise reminders with a time and
  repeat days, check them off for the day, and get a browser notification
  when one is due (while the app is open).
- **Blood pressure tracking** — log systolic/diastolic/pulse readings with a
  trend chart and a simple Normal/Elevated/High badge per reading.
- **Weight tracking** — log weight entries (kg or lb) with a trend chart and
  total change since the first entry.
- **Baby** — set a due date to see the current pregnancy week, trimester,
  days to go, and a weekly baby-size comparison; log daily symptoms; a
  kick counter that keeps running even if you switch tabs mid-session; and
  a weekly bump-photo album, each photo labeled with the week it was taken.
- **Dashboard** — an at-a-glance home screen with the current pregnancy week,
  today's reminders, and the latest BP/weight readings and mini-charts.
- **Backup & restore** — export all of your account's data to a JSON file
  and import it again (e.g. into a fresh account).

Data is stored in a Supabase (Postgres) project scoped to each account via
Row Level Security — no one but the account owner can read or write their
rows.

## Setting up accounts (Supabase)

The app needs a Supabase project to store accounts and data:

1. Create a free project at [supabase.com](https://supabase.com).
2. In the SQL Editor, paste and run [`supabase/schema.sql`](supabase/schema.sql),
   then [`supabase/002_bump_photos.sql`](supabase/002_bump_photos.sql), each
   as its own query — they create all the tables, the bump-photos storage
   bucket, and their access policies.
3. Under **Authentication → Providers → Email**, turn **off** "Confirm
   email" (this is a private app for the two of you, so there's no need for
   email verification — leaving it on means new accounts won't be signed in
   until they click an emailed link).
4. Under **Project Settings → API**, copy the **Project URL** and the
   **anon public** key (never the `service_role` key — that one's secret).
5. Create a `.env` file in the project root (see `.env.example`) with:
   ```
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
6. For the deployed site, add the same two variables under the Vercel
   project's **Settings → Environment Variables**, then redeploy.

Without these set, the app shows a "not connected to a backend yet" screen
instead of the sign-in form.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

## Building for production

```bash
npm run build
npm run preview   # optional: preview the production build locally
```

The build output is a static site in `dist/` that can be deployed to any
static host (Vercel, Netlify, GitHub Pages, etc.).

### Installing as an app

Most mobile and desktop browsers let you "Add to Home Screen" / "Install"
a site once it's deployed, so it opens like a regular app.

## Notes on reminders

Notifications are delivered via the browser's Notification API while the
app tab is open (checked every 30 seconds). Browsers do not allow reliable
background notifications for plain web apps without a server-based push
service, so for reminders you're not actively looking at, keep the app open
in a tab, or rely on the in-app "Today" checklist when you open it.

## Tech stack

React, TypeScript, Vite, Tailwind CSS, Recharts, and Supabase (Postgres +
Auth).
