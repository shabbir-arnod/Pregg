import type { BPReading, Reminder, ReminderLog, Settings, WeightReading } from '../types';

const KEYS = {
  reminders: 'pregg.reminders',
  reminderLogs: 'pregg.reminderLogs',
  bpReadings: 'pregg.bpReadings',
  weightReadings: 'pregg.weightReadings',
  settings: 'pregg.settings',
} as const;

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export const defaultSettings: Settings = {
  weightUnit: 'kg',
  notificationsEnabled: false,
};

export const store = {
  getReminders: (): Reminder[] => load(KEYS.reminders, []),
  setReminders: (v: Reminder[]) => save(KEYS.reminders, v),

  getReminderLogs: (): ReminderLog[] => load(KEYS.reminderLogs, []),
  setReminderLogs: (v: ReminderLog[]) => save(KEYS.reminderLogs, v),

  getBPReadings: (): BPReading[] => load(KEYS.bpReadings, []),
  setBPReadings: (v: BPReading[]) => save(KEYS.bpReadings, v),

  getWeightReadings: (): WeightReading[] => load(KEYS.weightReadings, []),
  setWeightReadings: (v: WeightReading[]) => save(KEYS.weightReadings, v),

  getSettings: (): Settings => load(KEYS.settings, defaultSettings),
  setSettings: (v: Settings) => save(KEYS.settings, v),
};
