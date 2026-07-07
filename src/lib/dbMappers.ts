import type {
  BPReading,
  BumpPhoto,
  KickSession,
  Reminder,
  ReminderLog,
  ReminderType,
  Settings,
  SymptomKey,
  SymptomLog,
  WeightReading,
} from '../types';
import { defaultSettings } from './storage';

export function reminderFromRow(row: Record<string, unknown>): Reminder {
  return {
    id: row.id as string,
    title: row.title as string,
    type: row.type as ReminderType,
    time: row.time as string,
    days: (row.days as number[]) ?? [],
    notes: (row.notes as string | null) ?? undefined,
    createdAt: row.created_at as string,
  };
}

export function reminderLogFromRow(row: Record<string, unknown>): ReminderLog {
  return {
    id: row.id as string,
    reminderId: row.reminder_id as string,
    date: row.date as string,
    completedAt: row.completed_at as string,
  };
}

export function bpReadingFromRow(row: Record<string, unknown>): BPReading {
  return {
    id: row.id as string,
    date: row.date as string,
    time: row.time as string,
    systolic: row.systolic as number,
    diastolic: row.diastolic as number,
    pulse: (row.pulse as number | null) ?? undefined,
    notes: (row.notes as string | null) ?? undefined,
  };
}

export function weightReadingFromRow(row: Record<string, unknown>): WeightReading {
  return {
    id: row.id as string,
    date: row.date as string,
    weight: Number(row.weight),
    notes: (row.notes as string | null) ?? undefined,
  };
}

export function symptomLogFromRow(row: Record<string, unknown>): SymptomLog {
  return {
    id: row.id as string,
    date: row.date as string,
    symptoms: (row.symptoms as SymptomKey[]) ?? [],
    notes: (row.notes as string | null) ?? undefined,
  };
}

export function kickSessionFromRow(row: Record<string, unknown>): KickSession {
  return {
    id: row.id as string,
    date: row.date as string,
    startedAt: row.started_at as string,
    durationSeconds: row.duration_seconds as number,
    kickCount: row.kick_count as number,
  };
}

export function bumpPhotoFromRow(row: Record<string, unknown>): BumpPhoto {
  return {
    id: row.id as string,
    date: row.date as string,
    storagePath: row.storage_path as string,
    notes: (row.notes as string | null) ?? undefined,
    createdAt: row.created_at as string,
  };
}

export function settingsFromRow(row: Record<string, unknown> | null): Settings {
  if (!row) return defaultSettings;
  return {
    weightUnit: row.weight_unit as Settings['weightUnit'],
    dueDate: (row.due_date as string | null) ?? undefined,
    notificationsEnabled: Boolean(row.notifications_enabled),
  };
}

// Reverse mappers, used when importing a JSON backup: preserve original ids
// so cross-references (e.g. a reminder log's reminderId) keep working.
export function reminderToRow(r: Reminder, userId: string) {
  return { id: r.id, user_id: userId, title: r.title, type: r.type, time: r.time, days: r.days, notes: r.notes ?? null, created_at: r.createdAt };
}

export function reminderLogToRow(l: ReminderLog, userId: string) {
  return { id: l.id, user_id: userId, reminder_id: l.reminderId, date: l.date, completed_at: l.completedAt };
}

export function bpReadingToRow(r: BPReading, userId: string) {
  return {
    id: r.id,
    user_id: userId,
    date: r.date,
    time: r.time,
    systolic: r.systolic,
    diastolic: r.diastolic,
    pulse: r.pulse ?? null,
    notes: r.notes ?? null,
  };
}

export function weightReadingToRow(r: WeightReading, userId: string) {
  return { id: r.id, user_id: userId, date: r.date, weight: r.weight, notes: r.notes ?? null };
}

export function symptomLogToRow(l: SymptomLog, userId: string) {
  return { id: l.id, user_id: userId, date: l.date, symptoms: l.symptoms, notes: l.notes ?? null };
}

export function kickSessionToRow(s: KickSession, userId: string) {
  return { id: s.id, user_id: userId, date: s.date, started_at: s.startedAt, duration_seconds: s.durationSeconds, kick_count: s.kickCount };
}

export function settingsToRow(s: Settings, userId: string) {
  return { user_id: userId, weight_unit: s.weightUnit, due_date: s.dueDate ?? null, notifications_enabled: s.notificationsEnabled };
}
