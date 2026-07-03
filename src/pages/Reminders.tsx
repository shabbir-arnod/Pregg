import { useMemo, useState } from 'react';
import { Bell, BellOff, Check, Pencil, Pill, Plus, Trash2 } from 'lucide-react';
import { useReminderLogs, useReminders, useSettings } from '../hooks/useAppData';
import { Modal } from '../components/Modal';
import { formatDisplayTime, todayISO, WEEKDAY_LABELS } from '../lib/date';
import { isSupported, requestPermission } from '../lib/notifications';
import type { Reminder, ReminderType } from '../types';

const emptyForm = { title: '', type: 'medicine' as ReminderType, time: '09:00', days: [] as number[], notes: '' };

export function Reminders() {
  const { reminders, addReminder, updateReminder, removeReminder } = useReminders();
  const { toggleDone, isDone } = useReminderLogs();
  const { settings, updateSettings } = useSettings();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const today = todayISO();
  const todayWeekday = new Date().getDay();

  const todaysReminders = useMemo(
    () =>
      reminders
        .filter((r) => r.days.length === 0 || r.days.includes(todayWeekday))
        .sort((a, b) => a.time.localeCompare(b.time)),
    [reminders, todayWeekday],
  );

  function openAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(r: Reminder) {
    setEditingId(r.id);
    setForm({ title: r.title, type: r.type, time: r.time, days: r.days, notes: r.notes ?? '' });
    setModalOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    const data = { title: form.title.trim(), type: form.type, time: form.time, days: form.days, notes: form.notes.trim() || undefined };
    if (editingId) {
      updateReminder(editingId, data);
    } else {
      addReminder(data);
    }
    setModalOpen(false);
  }

  function toggleDay(day: number) {
    setForm((f) => ({ ...f, days: f.days.includes(day) ? f.days.filter((d) => d !== day) : [...f.days, day].sort() }));
  }

  async function handleEnableNotifications() {
    const permission = await requestPermission();
    updateSettings({ notificationsEnabled: permission === 'granted' });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-800">Reminders</h1>
        <button
          type="button"
          onClick={openAdd}
          className="flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium px-4 py-2 rounded-xl shadow-sm"
        >
          <Plus size={16} /> Add reminder
        </button>
      </div>

      {isSupported() && !settings.notificationsEnabled && (
        <button
          type="button"
          onClick={handleEnableNotifications}
          className="w-full flex items-center gap-2 text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3"
        >
          <Bell size={16} /> Enable browser notifications so reminders alert you while the app is open
        </button>
      )}

      <section>
        <h2 className="text-sm font-medium text-slate-500 mb-2">Today</h2>
        {todaysReminders.length === 0 ? (
          <p className="text-sm text-slate-400">No reminders scheduled for today.</p>
        ) : (
          <ul className="space-y-2">
            {todaysReminders.map((r) => {
              const done = isDone(r.id, today);
              return (
                <li
                  key={r.id}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
                    done ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-rose-100'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleDone(r.id, today)}
                    className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center border-2 ${
                      done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 text-transparent'
                    }`}
                    aria-label={done ? 'Mark not done' : 'Mark done'}
                  >
                    <Check size={16} />
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-slate-800 ${done ? 'line-through text-slate-400' : ''}`}>{r.title}</p>
                    <p className="text-xs text-slate-400">
                      {formatDisplayTime(r.time)} · {r.type === 'medicine' ? 'Medicine' : 'Exercise'}
                    </p>
                  </div>
                  <button type="button" onClick={() => openEdit(r)} className="p-2 text-slate-400 hover:text-rose-500">
                    <Pencil size={16} />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-sm font-medium text-slate-500 mb-2">All reminders</h2>
        {reminders.length === 0 ? (
          <p className="text-sm text-slate-400">No reminders yet. Add your first one above.</p>
        ) : (
          <ul className="space-y-2">
            {reminders
              .slice()
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((r) => (
                <li key={r.id} className="flex items-center gap-3 rounded-xl border border-rose-100 bg-white px-4 py-3">
                  <Pill size={18} className="text-rose-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800">{r.title}</p>
                    <p className="text-xs text-slate-400">
                      {formatDisplayTime(r.time)} ·{' '}
                      {r.days.length === 0 ? 'Every day' : r.days.map((d) => WEEKDAY_LABELS[d]).join(', ')}
                    </p>
                  </div>
                  <button type="button" onClick={() => openEdit(r)} className="p-2 text-slate-400 hover:text-rose-500">
                    <Pencil size={16} />
                  </button>
                  <button type="button" onClick={() => removeReminder(r.id)} className="p-2 text-slate-400 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
          </ul>
        )}
      </section>

      {settings.notificationsEnabled === false && !isSupported() && (
        <p className="flex items-center gap-2 text-xs text-slate-400">
          <BellOff size={14} /> This browser doesn't support notifications; use the in-app checklist instead.
        </p>
      )}

      {modalOpen && (
        <Modal title={editingId ? 'Edit reminder' : 'Add reminder'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Title</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Prenatal vitamin"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>

            <div className="flex gap-2">
              {(['medicine', 'exercise'] as ReminderType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, type: t }))}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium capitalize ${
                    form.type === t ? 'bg-rose-500 border-rose-500 text-white' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Time</label>
              <input
                type="time"
                required
                value={form.time}
                onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Repeat on (blank = every day)</label>
              <div className="flex gap-1.5 flex-wrap">
                {WEEKDAY_LABELS.map((label, idx) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => toggleDay(idx)}
                    className={`w-10 h-9 rounded-lg text-xs font-medium border ${
                      form.days.includes(idx) ? 'bg-rose-500 border-rose-500 text-white' : 'border-slate-200 text-slate-500'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Notes (optional)</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                rows={2}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>

            <div className="flex gap-2 pt-2">
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    removeReminder(editingId);
                    setModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-red-500 border border-red-100 hover:bg-red-50"
                >
                  Delete
                </button>
              )}
              <button type="submit" className="flex-1 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium py-2 rounded-lg">
                {editingId ? 'Save changes' : 'Add reminder'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
