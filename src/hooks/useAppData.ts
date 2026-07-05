import { useCallback, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { store, defaultSettings } from '../lib/storage';
import { todayISO } from '../lib/date';
import type {
  ActiveKickSession,
  BPReading,
  KickSession,
  Reminder,
  ReminderLog,
  Settings,
  SymptomKey,
  SymptomLog,
  WeightReading,
} from '../types';

export function useReminders() {
  const [reminders, setReminders] = useState<Reminder[]>(() => store.getReminders());

  const persist = useCallback((next: Reminder[]) => {
    setReminders(next);
    store.setReminders(next);
  }, []);

  const addReminder = useCallback(
    (data: Omit<Reminder, 'id' | 'createdAt'>) => {
      const reminder: Reminder = { ...data, id: uuid(), createdAt: new Date().toISOString() };
      persist([...store.getReminders(), reminder]);
    },
    [persist],
  );

  const updateReminder = useCallback(
    (id: string, data: Omit<Reminder, 'id' | 'createdAt'>) => {
      persist(store.getReminders().map((r) => (r.id === id ? { ...r, ...data } : r)));
    },
    [persist],
  );

  const removeReminder = useCallback(
    (id: string) => {
      persist(store.getReminders().filter((r) => r.id !== id));
    },
    [persist],
  );

  return { reminders, addReminder, updateReminder, removeReminder };
}

export function useReminderLogs() {
  const [logs, setLogs] = useState<ReminderLog[]>(() => store.getReminderLogs());

  const persist = useCallback((next: ReminderLog[]) => {
    setLogs(next);
    store.setReminderLogs(next);
  }, []);

  const toggleDone = useCallback(
    (reminderId: string, date: string) => {
      const id = `${reminderId}_${date}`;
      const current = store.getReminderLogs();
      const exists = current.some((l) => l.id === id);
      if (exists) {
        persist(current.filter((l) => l.id !== id));
      } else {
        persist([...current, { id, reminderId, date, completedAt: new Date().toISOString() }]);
      }
    },
    [persist],
  );

  const isDone = useCallback(
    (reminderId: string, date: string) => logs.some((l) => l.id === `${reminderId}_${date}`),
    [logs],
  );

  return { logs, toggleDone, isDone };
}

export function useBPReadings() {
  const [readings, setReadings] = useState<BPReading[]>(() =>
    store.getBPReadings().sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)),
  );

  const persist = useCallback((next: BPReading[]) => {
    const sorted = [...next].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    setReadings(sorted);
    store.setBPReadings(sorted);
  }, []);

  const addReading = useCallback(
    (data: Omit<BPReading, 'id'>) => {
      persist([...store.getBPReadings(), { ...data, id: uuid() }]);
    },
    [persist],
  );

  const removeReading = useCallback(
    (id: string) => {
      persist(store.getBPReadings().filter((r) => r.id !== id));
    },
    [persist],
  );

  return { readings, addReading, removeReading };
}

export function useWeightReadings() {
  const [readings, setReadings] = useState<WeightReading[]>(() =>
    store.getWeightReadings().sort((a, b) => a.date.localeCompare(b.date)),
  );

  const persist = useCallback((next: WeightReading[]) => {
    const sorted = [...next].sort((a, b) => a.date.localeCompare(b.date));
    setReadings(sorted);
    store.setWeightReadings(sorted);
  }, []);

  const addReading = useCallback(
    (data: Omit<WeightReading, 'id'>) => {
      persist([...store.getWeightReadings(), { ...data, id: uuid() }]);
    },
    [persist],
  );

  const removeReading = useCallback(
    (id: string) => {
      persist(store.getWeightReadings().filter((r) => r.id !== id));
    },
    [persist],
  );

  return { readings, addReading, removeReading };
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => store.getSettings());

  const updateSettings = useCallback((data: Partial<Settings>) => {
    const next = { ...defaultSettings, ...store.getSettings(), ...data };
    setSettings(next);
    store.setSettings(next);
  }, []);

  return { settings, updateSettings };
}

export function useSymptomLogs() {
  const [logs, setLogs] = useState<SymptomLog[]>(() =>
    store.getSymptomLogs().sort((a, b) => a.date.localeCompare(b.date)),
  );

  const persist = useCallback((next: SymptomLog[]) => {
    const sorted = [...next].sort((a, b) => a.date.localeCompare(b.date));
    setLogs(sorted);
    store.setSymptomLogs(sorted);
  }, []);

  const saveForDate = useCallback(
    (date: string, symptoms: SymptomKey[], notes?: string) => {
      const current = store.getSymptomLogs();
      const withoutDate = current.filter((l) => l.date !== date);
      if (symptoms.length === 0 && !notes) {
        persist(withoutDate);
        return;
      }
      persist([...withoutDate, { id: date, date, symptoms, notes }]);
    },
    [persist],
  );

  const getForDate = useCallback((date: string) => logs.find((l) => l.date === date), [logs]);

  return { logs, saveForDate, getForDate };
}

export function useKickSessions() {
  const [sessions, setSessions] = useState<KickSession[]>(() =>
    store.getKickSessions().sort((a, b) => a.startedAt.localeCompare(b.startedAt)),
  );
  const [activeSession, setActiveSession] = useState<ActiveKickSession | null>(() => store.getActiveKickSession());

  const persistSessions = useCallback((next: KickSession[]) => {
    const sorted = [...next].sort((a, b) => a.startedAt.localeCompare(b.startedAt));
    setSessions(sorted);
    store.setKickSessions(sorted);
  }, []);

  const persistActive = useCallback((next: ActiveKickSession | null) => {
    setActiveSession(next);
    store.setActiveKickSession(next);
  }, []);

  const startSession = useCallback(() => {
    persistActive({ startedAt: new Date().toISOString(), kickTimestamps: [] });
  }, [persistActive]);

  const recordKick = useCallback(() => {
    const current = store.getActiveKickSession();
    if (!current) return;
    persistActive({ ...current, kickTimestamps: [...current.kickTimestamps, new Date().toISOString()] });
  }, [persistActive]);

  const endSession = useCallback(() => {
    const current = store.getActiveKickSession();
    if (!current) return;
    const startedAt = new Date(current.startedAt);
    const durationSeconds = Math.max(0, Math.round((Date.now() - startedAt.getTime()) / 1000));
    persistSessions([
      ...store.getKickSessions(),
      {
        id: uuid(),
        date: todayISO(),
        startedAt: current.startedAt,
        durationSeconds,
        kickCount: current.kickTimestamps.length,
      },
    ]);
    persistActive(null);
  }, [persistSessions, persistActive]);

  const discardSession = useCallback(() => {
    persistActive(null);
  }, [persistActive]);

  const removeSession = useCallback(
    (id: string) => {
      persistSessions(store.getKickSessions().filter((s) => s.id !== id));
    },
    [persistSessions],
  );

  return { sessions, activeSession, startSession, recordKick, endSession, discardSession, removeSession };
}
