import type { ActiveKickSession, Settings } from '../types';

// Only the in-progress kick-counting session lives in localStorage — it's
// ephemeral, device-local state, not tracked health data, so it doesn't need
// to go through Supabase. Everything else is fetched from the account's
// data once signed in (see hooks/useAppData.ts).
const ACTIVE_KICK_SESSION_KEY = 'pregg.activeKickSession';

export const defaultSettings: Settings = {
  weightUnit: 'kg',
  notificationsEnabled: false,
};

export const store = {
  getActiveKickSession: (): ActiveKickSession | null => {
    try {
      const raw = localStorage.getItem(ACTIVE_KICK_SESSION_KEY);
      return raw ? (JSON.parse(raw) as ActiveKickSession) : null;
    } catch {
      return null;
    }
  },
  setActiveKickSession: (v: ActiveKickSession | null) => {
    if (v) {
      localStorage.setItem(ACTIVE_KICK_SESSION_KEY, JSON.stringify(v));
    } else {
      localStorage.removeItem(ACTIVE_KICK_SESSION_KEY);
    }
  },
};
