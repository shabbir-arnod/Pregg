import { useCallback, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { store, defaultSettings } from '../lib/storage';
import type { BPReading, Reminder, ReminderLog, Settings, WeightReading } from '../types';

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
