import { useEffect, useMemo, useState } from 'react';
import { Activity, Baby as BabyIcon, CalendarHeart, Smile, Square, Trash2 } from 'lucide-react';
import { useKickSessions, useSettings, useSymptomLogs } from '../hooks/useAppData';
import { formatDisplayDate, todayISO } from '../lib/date';
import { getBabyEmoji, getBabySize, getDaysUntilDue, getPregnancyWeek, getTrimester, SYMPTOM_LABELS } from '../lib/pregnancy';
import { SYMPTOM_OPTIONS, type SymptomKey } from '../types';

function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function pluralize(count: number, word: string): string {
  return `${count} ${word}${count === 1 ? '' : 's'}`;
}

function DueDateSection() {
  const { settings, updateSettings } = useSettings();
  const [manualEdit, setManualEdit] = useState(false);
  const [dueDateInput, setDueDateInput] = useState('');

  // Keep the input pre-filled with whatever due date is on record, including
  // once it arrives from the (async) settings fetch.
  useEffect(() => {
    if (settings.dueDate) setDueDateInput(settings.dueDate);
  }, [settings.dueDate]);

  const showForm = manualEdit || !settings.dueDate;

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!dueDateInput) return;
    updateSettings({ dueDate: dueDateInput });
    setManualEdit(false);
  }

  if (showForm) {
    return (
      <section className="rounded-xl border border-rose-100 bg-white p-5">
        <h2 className="text-sm font-medium text-slate-600 mb-3 flex items-center gap-2">
          <CalendarHeart size={16} className="text-rose-400" /> Due date
        </h2>
        <form onSubmit={handleSave} className="flex gap-2">
          <input
            type="date"
            required
            value={dueDateInput}
            onChange={(e) => setDueDateInput(e.target.value)}
            className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
          <button type="submit" className="bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium px-4 py-2 rounded-lg">
            Save
          </button>
        </form>
      </section>
    );
  }

  const dueDate = settings.dueDate!;
  const week = getPregnancyWeek(dueDate);
  const trimester = getTrimester(week);
  const daysToGo = getDaysUntilDue(dueDate);
  const progressPct = Math.min(100, Math.max(0, (week / 40) * 100));

  return (
    <section className="rounded-xl border border-rose-100 bg-white p-5">
      <div className="flex items-center justify-center gap-4 mb-4">
        <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center">
          <BabyIcon size={40} className="text-rose-400" />
        </div>
        <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center text-4xl">
          {getBabyEmoji(week)}
        </div>
      </div>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Week {week} · Trimester {trimester}</p>
          <p className="text-lg font-semibold text-slate-800 mt-0.5">
            Baby is about the size of {getBabySize(week)}
          </p>
          <p className="text-sm text-slate-400 mt-1">
            {daysToGo > 0
              ? `${daysToGo} days to go until your due date`
              : 'Your due date has passed — hope all is well!'}
          </p>
          <p className="text-xs text-slate-400">Due {formatDisplayDate(dueDate)}</p>
        </div>
        <button
          type="button"
          onClick={() => setManualEdit(true)}
          className="text-xs text-rose-500 font-medium shrink-0"
        >
          Edit
        </button>
      </div>
      <div className="mt-3 h-2 rounded-full bg-rose-50 overflow-hidden">
        <div className="h-full bg-rose-400 rounded-full" style={{ width: `${progressPct}%` }} />
      </div>
    </section>
  );
}

function SymptomsSection() {
  const { getForDate, saveForDate, logs } = useSymptomLogs();
  const today = todayISO();
  const todayLog = getForDate(today);
  const [selected, setSelected] = useState<SymptomKey[]>(todayLog?.symptoms ?? []);
  const [notes, setNotes] = useState(todayLog?.notes ?? '');
  const [saved, setSaved] = useState(false);

  function toggle(key: SymptomKey) {
    setSaved(false);
    setSelected((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }

  function handleSave() {
    saveForDate(today, selected, notes.trim() || undefined);
    setSaved(true);
  }

  const recentLogs = useMemo(
    () =>
      logs
        .filter((l) => l.date !== today)
        .slice(-6)
        .reverse(),
    [logs, today],
  );

  return (
    <section className="rounded-xl border border-rose-100 bg-white p-5">
      <h2 className="text-sm font-medium text-slate-600 mb-3 flex items-center gap-2">
        <Smile size={16} className="text-rose-400" /> How are you feeling today?
      </h2>
      <div className="flex flex-wrap gap-2">
        {SYMPTOM_OPTIONS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => toggle(key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
              selected.includes(key) ? 'bg-rose-500 border-rose-500 text-white' : 'border-slate-200 text-slate-600'
            }`}
          >
            {SYMPTOM_LABELS[key]}
          </button>
        ))}
      </div>
      <textarea
        value={notes}
        onChange={(e) => {
          setNotes(e.target.value);
          setSaved(false);
        }}
        placeholder="Notes (optional)"
        rows={2}
        className="w-full mt-3 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
      />
      <button
        type="button"
        onClick={handleSave}
        className="mt-3 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium px-4 py-2 rounded-lg"
      >
        {saved ? 'Saved ✓' : "Save today's log"}
      </button>

      {recentLogs.length > 0 && (
        <div className="mt-4 pt-4 border-t border-rose-50 space-y-2">
          {recentLogs.map((log) => (
            <div key={log.id} className="text-sm">
              <p className="text-xs text-slate-400">{formatDisplayDate(log.date)}</p>
              <p className="text-slate-600">
                {log.symptoms.length > 0 ? log.symptoms.map((s) => SYMPTOM_LABELS[s]).join(', ') : 'No symptoms logged'}
              </p>
              {log.notes && <p className="text-xs text-slate-400 mt-0.5">{log.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function KickCounterSection() {
  const { sessions, activeSession, startSession, recordKick, endSession, discardSession, removeSession } = useKickSessions();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!activeSession) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [activeSession]);

  const elapsedSeconds = activeSession ? Math.max(0, Math.round((now - new Date(activeSession.startedAt).getTime()) / 1000)) : 0;

  return (
    <section className="rounded-xl border border-rose-100 bg-white p-5">
      <h2 className="text-sm font-medium text-slate-600 mb-3 flex items-center gap-2">
        <Activity size={16} className="text-rose-400" /> Kick counter
      </h2>

      {!activeSession ? (
        <>
          <p className="text-sm text-slate-400 mb-3">
            Start a session, then tap "I felt a kick" each time baby moves. Many count to 10 kicks as a check-in.
          </p>
          <button
            type="button"
            onClick={startSession}
            className="bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium px-4 py-2 rounded-lg"
          >
            Start session
          </button>
        </>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-2xl font-semibold text-slate-800">{pluralize(activeSession.kickTimestamps.length, 'kick')}</p>
              <p className="text-xs text-slate-400">{formatDuration(elapsedSeconds)} elapsed</p>
            </div>
            <button
              type="button"
              onClick={discardSession}
              className="p-2 text-slate-400 hover:text-red-500"
              aria-label="Discard session"
            >
              <Trash2 size={18} />
            </button>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={recordKick}
              className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-semibold py-4 rounded-xl text-base"
            >
              I felt a kick
            </button>
            <button
              type="button"
              onClick={endSession}
              className="flex items-center gap-1.5 border border-rose-200 text-rose-600 text-sm font-medium px-4 rounded-xl"
            >
              <Square size={14} /> End
            </button>
          </div>
        </div>
      )}

      {sessions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-rose-50 space-y-2">
          {sessions
            .slice()
            .reverse()
            .slice(0, 6)
            .map((s) => (
              <div key={s.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="text-slate-700">
                    {pluralize(s.kickCount, 'kick')} in {formatDuration(s.durationSeconds)}
                  </p>
                  <p className="text-xs text-slate-400">{formatDisplayDate(s.date)}</p>
                </div>
                <button type="button" onClick={() => removeSession(s.id)} className="p-2 text-slate-400 hover:text-red-500">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
        </div>
      )}
    </section>
  );
}

export function Baby() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
        <BabyIcon size={22} className="text-rose-400" /> Baby
      </h1>
      <DueDateSection />
      <SymptomsSection />
      <KickCounterSection />
    </div>
  );
}
