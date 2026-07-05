export type ReminderType = 'medicine' | 'exercise';

export interface Reminder {
  id: string;
  title: string;
  type: ReminderType;
  time: string; // "HH:MM", 24-hour
  days: number[]; // 0=Sun..6=Sat; empty array means every day
  notes?: string;
  createdAt: string;
}

// One row per reminder marked done on a given date.
export interface ReminderLog {
  id: string; // `${reminderId}_${date}`
  reminderId: string;
  date: string; // YYYY-MM-DD
  completedAt: string;
}

export interface BPReading {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  systolic: number;
  diastolic: number;
  pulse?: number;
  notes?: string;
}

export interface WeightReading {
  id: string;
  date: string; // YYYY-MM-DD
  weight: number;
  notes?: string;
}

export type WeightUnit = 'kg' | 'lb';

export interface Settings {
  weightUnit: WeightUnit;
  dueDate?: string; // YYYY-MM-DD
  notificationsEnabled: boolean;
}

export const SYMPTOM_OPTIONS = [
  'nausea',
  'fatigue',
  'headache',
  'cramping',
  'moodSwings',
  'cravings',
  'heartburn',
  'backache',
  'swelling',
  'insomnia',
  'constipation',
  'spotting',
] as const;

export type SymptomKey = (typeof SYMPTOM_OPTIONS)[number];

// One entry per day.
export interface SymptomLog {
  id: string; // = date
  date: string; // YYYY-MM-DD
  symptoms: SymptomKey[];
  notes?: string;
}

export interface KickSession {
  id: string;
  date: string; // YYYY-MM-DD
  startedAt: string; // ISO timestamp
  durationSeconds: number;
  kickCount: number;
}

// An in-progress kick-counting session, persisted so it survives tab switches.
export interface ActiveKickSession {
  startedAt: string; // ISO timestamp
  kickTimestamps: string[]; // ISO timestamps, one per kick
}
