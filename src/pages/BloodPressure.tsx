import { useMemo, useState } from 'react';
import { HeartPulse, Plus, Trash2 } from 'lucide-react';
import { useBPReadings } from '../hooks/useAppData';
import { Modal } from '../components/Modal';
import { TrendChart } from '../components/TrendChart';
import { formatDisplayDate, formatDisplayTime, nowHHMM, todayISO } from '../lib/date';

const emptyForm = { date: todayISO(), time: nowHHMM(), systolic: '', diastolic: '', pulse: '', notes: '' };

function bpCategory(systolic: number, diastolic: number): { label: string; className: string } {
  if (systolic >= 140 || diastolic >= 90) return { label: 'High', className: 'bg-red-50 text-red-600' };
  if (systolic >= 130 || diastolic >= 85) return { label: 'Elevated', className: 'bg-amber-50 text-amber-600' };
  return { label: 'Normal', className: 'bg-emerald-50 text-emerald-600' };
}

export function BloodPressure() {
  const { readings, addReading, removeReading } = useBPReadings();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const chartData = useMemo(
    () =>
      readings.map((r) => ({
        date: r.date,
        systolic: r.systolic,
        diastolic: r.diastolic,
      })),
    [readings],
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const systolic = Number(form.systolic);
    const diastolic = Number(form.diastolic);
    if (!systolic || !diastolic) return;
    addReading({
      date: form.date,
      time: form.time,
      systolic,
      diastolic,
      pulse: form.pulse ? Number(form.pulse) : undefined,
      notes: form.notes.trim() || undefined,
    });
    setForm(emptyForm);
    setModalOpen(false);
  }

  const latest = readings[readings.length - 1];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-800">Blood Pressure</h1>
        <button
          type="button"
          onClick={() => {
            setForm(emptyForm);
            setModalOpen(true);
          }}
          className="flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium px-4 py-2 rounded-xl shadow-sm"
        >
          <Plus size={16} /> Log reading
        </button>
      </div>

      {latest && (
        <div className="flex items-center gap-4 rounded-xl border border-rose-100 bg-white px-5 py-4">
          <HeartPulse size={28} className="text-rose-400 shrink-0" />
          <div>
            <p className="text-2xl font-semibold text-slate-800">
              {latest.systolic}/{latest.diastolic} <span className="text-sm font-normal text-slate-400">mmHg</span>
            </p>
            <p className="text-xs text-slate-400">Latest · {formatDisplayDate(latest.date)}</p>
          </div>
          <span className={`ml-auto text-xs font-medium px-2.5 py-1 rounded-full ${bpCategory(latest.systolic, latest.diastolic).className}`}>
            {bpCategory(latest.systolic, latest.diastolic).label}
          </span>
        </div>
      )}

      <section className="rounded-xl border border-rose-100 bg-white p-4">
        <h2 className="text-sm font-medium text-slate-500 mb-3">Trend</h2>
        <TrendChart
          data={chartData}
          series={[
            { key: 'systolic', label: 'Systolic', color: '#7c4a68' },
            { key: 'diastolic', label: 'Diastolic', color: '#8b5cf6' },
          ]}
        />
      </section>

      <section>
        <h2 className="text-sm font-medium text-slate-500 mb-2">History</h2>
        {readings.length === 0 ? (
          <p className="text-sm text-slate-400">No readings yet.</p>
        ) : (
          <ul className="space-y-2">
            {readings
              .slice()
              .reverse()
              .map((r) => (
                <li key={r.id} className="flex items-center gap-3 rounded-xl border border-rose-100 bg-white px-4 py-3">
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">
                      {r.systolic}/{r.diastolic} mmHg{r.pulse ? ` · ${r.pulse} bpm` : ''}
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatDisplayDate(r.date)} · {formatDisplayTime(r.time)}
                    </p>
                    {r.notes && <p className="text-xs text-slate-500 mt-1">{r.notes}</p>}
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${bpCategory(r.systolic, r.diastolic).className}`}>
                    {bpCategory(r.systolic, r.diastolic).label}
                  </span>
                  <button type="button" onClick={() => removeReading(r.id)} className="p-2 text-slate-400 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
          </ul>
        )}
      </section>

      {modalOpen && (
        <Modal title="Log blood pressure" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
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
                <label className="block text-sm font-medium text-slate-600 mb-1">Time</label>
                <input
                  type="time"
                  required
                  value={form.time}
                  onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Systolic</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={form.systolic}
                  onChange={(e) => setForm((f) => ({ ...f, systolic: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Diastolic</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={form.diastolic}
                  onChange={(e) => setForm((f) => ({ ...f, diastolic: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Pulse</label>
                <input
                  type="number"
                  min={1}
                  value={form.pulse}
                  onChange={(e) => setForm((f) => ({ ...f, pulse: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
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

            <button type="submit" className="w-full bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium py-2 rounded-lg">
              Save reading
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
