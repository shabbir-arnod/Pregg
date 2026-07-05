import { useCallback, useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '../lib/supabaseClient';
import { store, defaultSettings } from '../lib/storage';
import { todayISO } from '../lib/date';
import {
  bpReadingFromRow,
  kickSessionFromRow,
  reminderFromRow,
  reminderLogFromRow,
  settingsFromRow,
  symptomLogFromRow,
  weightReadingFromRow,
} from '../lib/dbMappers';
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

function useUserId(): string | undefined {
  const { session } = useAuth();
  return session?.user.id;
}

export function useReminders() {
  const userId = useUserId();
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    if (!userId) {
      setReminders([]);
      return;
    }
    let cancelled = false;
    supabase
      .from('reminders')
      .select('*')
      .eq('user_id', userId)
      .then(({ data }) => {
        if (!cancelled && data) setReminders(data.map(reminderFromRow));
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const addReminder = useCallback(
    async (data: Omit<Reminder, 'id' | 'createdAt'>) => {
      if (!userId) return;
      const { data: row, error } = await supabase
        .from('reminders')
        .insert({ user_id: userId, title: data.title, type: data.type, time: data.time, days: data.days, notes: data.notes ?? null })
        .select()
        .single();
      if (!error && row) setReminders((prev) => [...prev, reminderFromRow(row)]);
    },
    [userId],
  );

  const updateReminder = useCallback(async (id: string, data: Omit<Reminder, 'id' | 'createdAt'>) => {
    const { error } = await supabase
      .from('reminders')
      .update({ title: data.title, type: data.type, time: data.time, days: data.days, notes: data.notes ?? null })
      .eq('id', id);
    if (!error) setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));
  }, []);

  const removeReminder = useCallback(async (id: string) => {
    const { error } = await supabase.from('reminders').delete().eq('id', id);
    if (!error) setReminders((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return { reminders, addReminder, updateReminder, removeReminder };
}

export function useReminderLogs() {
  const userId = useUserId();
  const [logs, setLogs] = useState<ReminderLog[]>([]);

  useEffect(() => {
    if (!userId) {
      setLogs([]);
      return;
    }
    let cancelled = false;
    supabase
      .from('reminder_logs')
      .select('*')
      .eq('user_id', userId)
      .then(({ data }) => {
        if (!cancelled && data) setLogs(data.map(reminderLogFromRow));
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const toggleDone = useCallback(
    async (reminderId: string, date: string) => {
      if (!userId) return;
      const existing = logs.find((l) => l.reminderId === reminderId && l.date === date);
      if (existing) {
        const { error } = await supabase.from('reminder_logs').delete().eq('id', existing.id);
        if (!error) setLogs((prev) => prev.filter((l) => l.id !== existing.id));
      } else {
        const { data, error } = await supabase
          .from('reminder_logs')
          .insert({ user_id: userId, reminder_id: reminderId, date })
          .select()
          .single();
        if (!error && data) setLogs((prev) => [...prev, reminderLogFromRow(data)]);
      }
    },
    [userId, logs],
  );

  const isDone = useCallback(
    (reminderId: string, date: string) => logs.some((l) => l.reminderId === reminderId && l.date === date),
    [logs],
  );

  return { logs, toggleDone, isDone };
}

function sortBPReadings(readings: BPReading[]): BPReading[] {
  return [...readings].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
}

export function useBPReadings() {
  const userId = useUserId();
  const [readings, setReadings] = useState<BPReading[]>([]);

  useEffect(() => {
    if (!userId) {
      setReadings([]);
      return;
    }
    let cancelled = false;
    supabase
      .from('bp_readings')
      .select('*')
      .eq('user_id', userId)
      .then(({ data }) => {
        if (!cancelled && data) setReadings(sortBPReadings(data.map(bpReadingFromRow)));
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const addReading = useCallback(
    async (data: Omit<BPReading, 'id'>) => {
      if (!userId) return;
      const { data: row, error } = await supabase
        .from('bp_readings')
        .insert({
          user_id: userId,
          date: data.date,
          time: data.time,
          systolic: data.systolic,
          diastolic: data.diastolic,
          pulse: data.pulse ?? null,
          notes: data.notes ?? null,
        })
        .select()
        .single();
      if (!error && row) setReadings((prev) => sortBPReadings([...prev, bpReadingFromRow(row)]));
    },
    [userId],
  );

  const removeReading = useCallback(async (id: string) => {
    const { error } = await supabase.from('bp_readings').delete().eq('id', id);
    if (!error) setReadings((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return { readings, addReading, removeReading };
}

function sortWeightReadings(readings: WeightReading[]): WeightReading[] {
  return [...readings].sort((a, b) => a.date.localeCompare(b.date));
}

export function useWeightReadings() {
  const userId = useUserId();
  const [readings, setReadings] = useState<WeightReading[]>([]);

  useEffect(() => {
    if (!userId) {
      setReadings([]);
      return;
    }
    let cancelled = false;
    supabase
      .from('weight_readings')
      .select('*')
      .eq('user_id', userId)
      .then(({ data }) => {
        if (!cancelled && data) setReadings(sortWeightReadings(data.map(weightReadingFromRow)));
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const addReading = useCallback(
    async (data: Omit<WeightReading, 'id'>) => {
      if (!userId) return;
      const { data: row, error } = await supabase
        .from('weight_readings')
        .insert({ user_id: userId, date: data.date, weight: data.weight, notes: data.notes ?? null })
        .select()
        .single();
      if (!error && row) setReadings((prev) => sortWeightReadings([...prev, weightReadingFromRow(row)]));
    },
    [userId],
  );

  const removeReading = useCallback(async (id: string) => {
    const { error } = await supabase.from('weight_readings').delete().eq('id', id);
    if (!error) setReadings((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return { readings, addReading, removeReading };
}

export function useSettings() {
  const userId = useUserId();
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    if (!userId) {
      setSettings(defaultSettings);
      return;
    }
    let cancelled = false;
    supabase
      .from('settings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setSettings(settingsFromRow(data));
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const updateSettings = useCallback(
    async (data: Partial<Settings>) => {
      if (!userId) return;
      const next = { ...defaultSettings, ...settings, ...data };
      setSettings(next);
      await supabase.from('settings').upsert({
        user_id: userId,
        weight_unit: next.weightUnit,
        due_date: next.dueDate ?? null,
        notifications_enabled: next.notificationsEnabled,
      });
    },
    [userId, settings],
  );

  return { settings, updateSettings };
}

export function useSymptomLogs() {
  const userId = useUserId();
  const [logs, setLogs] = useState<SymptomLog[]>([]);

  useEffect(() => {
    if (!userId) {
      setLogs([]);
      return;
    }
    let cancelled = false;
    supabase
      .from('symptom_logs')
      .select('*')
      .eq('user_id', userId)
      .then(({ data }) => {
        if (!cancelled && data) setLogs(data.map(symptomLogFromRow).sort((a, b) => a.date.localeCompare(b.date)));
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const saveForDate = useCallback(
    async (date: string, symptoms: SymptomKey[], notes?: string) => {
      if (!userId) return;
      if (symptoms.length === 0 && !notes) {
        const { error } = await supabase.from('symptom_logs').delete().eq('user_id', userId).eq('date', date);
        if (!error) setLogs((prev) => prev.filter((l) => l.date !== date));
        return;
      }
      const { data, error } = await supabase
        .from('symptom_logs')
        .upsert({ user_id: userId, date, symptoms, notes: notes ?? null }, { onConflict: 'user_id,date' })
        .select()
        .single();
      if (!error && data) {
        setLogs((prev) => [...prev.filter((l) => l.date !== date), symptomLogFromRow(data)].sort((a, b) => a.date.localeCompare(b.date)));
      }
    },
    [userId],
  );

  const getForDate = useCallback((date: string) => logs.find((l) => l.date === date), [logs]);

  return { logs, saveForDate, getForDate };
}

export function useKickSessions() {
  const userId = useUserId();
  const [sessions, setSessions] = useState<KickSession[]>([]);
  const [activeSession, setActiveSession] = useState<ActiveKickSession | null>(() => store.getActiveKickSession());

  useEffect(() => {
    if (!userId) {
      setSessions([]);
      return;
    }
    let cancelled = false;
    supabase
      .from('kick_sessions')
      .select('*')
      .eq('user_id', userId)
      .then(({ data }) => {
        if (!cancelled && data) setSessions(data.map(kickSessionFromRow).sort((a, b) => a.startedAt.localeCompare(b.startedAt)));
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const persistActive = useCallback((next: ActiveKickSession | null) => {
    setActiveSession(next);
    store.setActiveKickSession(next);
  }, []);

  const startSession = useCallback(() => {
    persistActive({ startedAt: new Date().toISOString(), kickTimestamps: [] });
  }, [persistActive]);

  const recordKick = useCallback(() => {
    setActiveSession((prev) => {
      if (!prev) return prev;
      const next = { ...prev, kickTimestamps: [...prev.kickTimestamps, new Date().toISOString()] };
      store.setActiveKickSession(next);
      return next;
    });
  }, []);

  const endSession = useCallback(async () => {
    if (!activeSession || !userId) return;
    const startedAt = new Date(activeSession.startedAt);
    const durationSeconds = Math.max(0, Math.round((Date.now() - startedAt.getTime()) / 1000));
    const { data, error } = await supabase
      .from('kick_sessions')
      .insert({
        user_id: userId,
        date: todayISO(),
        started_at: activeSession.startedAt,
        duration_seconds: durationSeconds,
        kick_count: activeSession.kickTimestamps.length,
      })
      .select()
      .single();
    if (!error && data) setSessions((prev) => [...prev, kickSessionFromRow(data)]);
    persistActive(null);
  }, [activeSession, userId, persistActive]);

  const discardSession = useCallback(() => persistActive(null), [persistActive]);

  const removeSession = useCallback(async (id: string) => {
    const { error } = await supabase.from('kick_sessions').delete().eq('id', id);
    if (!error) setSessions((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return { sessions, activeSession, startSession, recordKick, endSession, discardSession, removeSession };
}
