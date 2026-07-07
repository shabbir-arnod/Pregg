import { useMemo, useState } from 'react';
import { Plus, Scale, Trash2 } from 'lucide-react';
import { useSettings, useWeightReadings } from '../hooks/useAppData';
import { Modal } from '../components/Modal';
import { TrendChart } from '../components/TrendChart';
import { formatDisplayDate, todayISO } from '../lib/date';
import { fromKg, roundWeight, toKg } from '../lib/units';

const emptyForm = { date: todayISO(), weight: '', notes: '' };

export function Weight() {
  const { readings, addReading, removeReading } = useWeightReadings();
  const { settings, updateSettings } = useSettings();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  // Readings are stored in kg; convert to the currently selected unit for display.
  const displayReadings = useMemo(
    () => readings.map((r) => ({ ...r, weight: roundWeight(fromKg(r.weight, settings.weightUnit)) })),
    [readings, settings.weightUnit],
  );

  const chartData = useMemo(() => displayReadings.map((r) => ({ date: r.date, weight: r.weight })), [displayReadings]);

  const first = displayReadings[0];
  const latest = displayReadings[displayReadings.length - 1];
  const change = displayReadings.length > 1 && first && latest ? roundWeight(latest.weight - first.weight) : null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const weightInput = Number(form.weight);
    if (!weightInput) return;
    addReading({ date: form.date, weight: toKg(weightInput, settings.weightUnit), notes: form.notes.trim() || undefined });
    setForm(emptyForm);
    setModalOpen(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-800">Weight</h1>
        <button
          type="button"
          onClick={() => {
            setForm(emptyForm);
            setModalOpen(true);
          }}
          className="flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium px-4 py-2 rounded-xl shadow-sm"
        >
          <Plus size={16} /> Log weight
        </button>
      </div>

      <div className="flex items-center justify-end gap-2 text-sm text-slate-500">
        <span>Units:</span>
        {(['kg', 'lb'] as const).map((u) => (
          <button
            key={u}
            type="button"
            onClick={() => updateSettings({ weightUnit: u })}
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              settings.weightUnit === u ? 'bg-rose-500 text-white' : 'bg-rose-50 text-rose-500'
            }`}
          >
            {u}
          </button>
        ))}
      </div>

      {latest && (
        <div className="flex items-center gap-4 rounded-xl border border-rose-100 bg-white px-5 py-4">
          <Scale size={28} className="text-rose-400 shrink-0" />
          <div>
            <p className="text-2xl font-semibold text-slate-800">
              {latest.weight} <span className="text-sm font-normal text-slate-400">{settings.weightUnit}</span>
            </p>
            <p className="text-xs text-slate-400">Latest · {formatDisplayDate(latest.date)}</p>
          </div>
          {change !== null && (
            <span
              className={`ml-auto text-xs font-medium px-2.5 py-1 rounded-full ${
                change > 0 ? 'bg-amber-50 text-amber-600' : change < 0 ? 'bg-sky-50 text-sky-600' : 'bg-slate-50 text-slate-500'
              }`}
            >
              {change > 0 ? '+' : ''}
              {change.toFixed(1)} {settings.weightUnit} total
            </span>
          )}
        </div>
      )}

      <section className="rounded-xl border border-rose-100 bg-white p-4">
        <h2 className="text-sm font-medium text-slate-500 mb-3">Trend</h2>
        <TrendChart data={chartData} series={[{ key: 'weight', label: `Weight (${settings.weightUnit})`, color: '#ec4a7a' }]} unit={settings.weightUnit} />
      </section>

      <section>
        <h2 className="text-sm font-medium text-slate-500 mb-2">History</h2>
        {displayReadings.length === 0 ? (
          <p className="text-sm text-slate-400">No entries yet.</p>
        ) : (
          <ul className="space-y-2">
            {displayReadings
              .slice()
              .reverse()
              .map((r) => (
                <li key={r.id} className="flex items-center gap-3 rounded-xl border border-rose-100 bg-white px-4 py-3">
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">
                      {r.weight} {settings.weightUnit}
                    </p>
                    <p className="text-xs text-slate-400">{formatDisplayDate(r.date)}</p>
                    {r.notes && <p className="text-xs text-slate-500 mt-1">{r.notes}</p>}
                  </div>
                  <button type="button" onClick={() => removeReading(r.id)} className="p-2 text-slate-400 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
          </ul>
        )}
      </section>

      {modalOpen && (
        <Modal title="Log weight" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Date</label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Weight ({settings.weightUnit})</label>
              <input
                type="number"
                required
                step="0.1"
                min={0}
                value={form.weight}
                onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
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
            <button type="submit" className="w-full bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium py-2 rounded-lg">
              Save entry
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
