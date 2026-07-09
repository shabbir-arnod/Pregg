# Pregg App — UI Kit

Click-through recreation of the real app's 7 screens, composed from this design system's
components (`../../components/`) and tokens (`../../styles.css`). Fake in-memory data lives in
`data.js` — no backend, but Sign in, toggling reminders, logging BP/weight readings, toggling
symptoms, and the kick counter all update real component state.

Screens: `Auth.jsx`, `Dashboard.jsx`, `Reminders.jsx`, `BloodPressure.jsx`, `Weight.jsx`,
`Baby.jsx`, `Settings.jsx`, wired together by `index.html`.
