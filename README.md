# Pregg — Pregnancy Health Tracker

A simple, private web app for tracking a pregnancy day-to-day: medicine and
exercise reminders, blood pressure readings, and weight, with trend graphs.

## Features

- **Reminders** — schedule medicine or exercise reminders with a time and
  repeat days, check them off for the day, and get a browser notification
  when one is due (while the app is open).
- **Blood pressure tracking** — log systolic/diastolic/pulse readings with a
  trend chart and a simple Normal/Elevated/High badge per reading.
- **Weight tracking** — log weight entries (kg or lb) with a trend chart and
  total change since the first entry.
- **Dashboard** — an at-a-glance home screen with today's reminders and the
  latest BP/weight readings and mini-charts.
- **Backup & restore** — export all data to a JSON file and import it again,
  since everything is stored only on this device.

All data stays in the browser's local storage on the device you use — there
is no server or account, so nothing is uploaded anywhere.

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
static host (Vercel, Netlify, GitHub Pages, etc.) — no backend required.

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

React, TypeScript, Vite, Tailwind CSS, and Recharts. No backend — state is
persisted with `localStorage`.
