import { useMemo } from 'react';
import { ArrowRight, Baby, HeartPulse, ListChecks, Scale } from 'lucide-react';
import { useBPReadings, useReminderLogs, useReminders, useSettings, useWeightReadings } from '../hooks/useAppData';
import { TrendChart } from '../components/TrendChart';
import { formatDisplayDate, todayISO } from '../lib/date';
import { getBabyEmoji, getBabySize, getDaysUntilDue, getPregnancyWeek, getTrimester } from '../lib/pregnancy';
import { fromKg, roundWeight } from '../lib/units';
import type { Page } from '../App';

interface DashboardProps {
  onNavigate: (page: Page) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { reminders } = useReminders();
  const { isDone } = useReminderLogs();
  const { readings: bpReadings } = useBPReadings();
  const { readings: weightReadings } = useWeightReadings();
  const { settings } = useSettings();

  const today = todayISO();
  const todayWeekday = new Date().getDay();

  const todaysReminders = useMemo(
    () => reminders.filter((r) => r.days.length === 0 || r.days.includes(todayWeekday)),
    [reminders, todayWeekday],
  );
  const doneCount = todaysReminders.filter((r) => isDone(r.id, today)).length;

  const latestBP = bpReadings[bpReadings.length - 1];
  const latestWeight = weightReadings[weightReadings.length - 1];

  const bpChartData = useMemo(() => bpReadings.slice(-10).map((r) => ({ date: r.date, systolic: r.systolic, diastolic: r.diastolic })), [bpReadings]);
  const weightChartData = useMemo(
    () => weightReadings.slice(-10).map((r) => ({ date: r.date, weight: roundWeight(fromKg(r.weight, settings.weightUnit)) })),
    [weightReadings, settings.weightUnit],
  );
  const latestWeightDisplay = latestWeight ? roundWeight(fromKg(latestWeight.weight, settings.weightUnit)) : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">Hello 👋</h1>
        <p className="text-sm text-slate-400">{formatDisplayDate(today)}</p>
      </div>

      {settings.dueDate ? (
        <button
          type="button"
          onClick={() => onNavigate('baby')}
          className="w-full flex items-center gap-4 rounded-xl border border-rose-100 bg-white px-5 py-4 text-left hover:shadow-sm"
        >
          <span className="w-11 h-11 rounded-full bg-amber-50 flex items-center justify-center text-xl shrink-0">
            {getBabyEmoji(getPregnancyWeek(settings.dueDate))}
          </span>
          <div className="flex-1">
            <p className="font-medium text-slate-800">
              Week {getPregnancyWeek(settings.dueDate)} · Trimester {getTrimester(getPregnancyWeek(settings.dueDate))}
            </p>
            <p className="text-xs text-slate-400">
              About the size of {getBabySize(getPregnancyWeek(settings.dueDate))} · {getDaysUntilDue(settings.dueDate)} days to go
            </p>
          </div>
          <ArrowRight size={18} className="text-slate-300" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => onNavigate('baby')}
          className="w-full flex items-center gap-4 rounded-xl border border-dashed border-rose-200 bg-white px-5 py-4 text-left"
        >
          <Baby size={26} className="text-rose-300 shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-slate-800">Set your due date</p>
            <p className="text-xs text-slate-400">Track your pregnancy week and baby's size</p>
          </div>
          <ArrowRight size={18} className="text-slate-300" />
        </button>
      )}

      <button
        type="button"
        onClick={() => onNavigate('reminders')}
        className="w-full flex items-center gap-4 rounded-xl border border-rose-100 bg-white px-5 py-4 text-left hover:shadow-sm"
      >
        <ListChecks size={26} className="text-rose-400 shrink-0" />
        <div className="flex-1">
          <p className="font-medium text-slate-800">Today's reminders</p>
          <p className="text-xs text-slate-400">
            {todaysReminders.length === 0 ? 'Nothing scheduled today' : `${doneCount} of ${todaysReminders.length} done`}
          </p>
        </div>
        <ArrowRight size={18} className="text-slate-300" />
      </button>

      <div className="grid sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onNavigate('bp')}
          className="rounded-xl border border-rose-100 bg-white p-4 text-left hover:shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <HeartPulse size={20} className="text-rose-400" />
            <span className="text-sm font-medium text-slate-600">Blood Pressure</span>
          </div>
          {latestBP ? (
            <p className="text-2xl font-semibold text-slate-800">
              {latestBP.systolic}/{latestBP.diastolic} <span className="text-xs font-normal text-slate-400">mmHg</span>
            </p>
          ) : (
            <p className="text-sm text-slate-400">No readings yet</p>
          )}
          <div className="mt-3">
            <TrendChart
              data={bpChartData}
              series={[
                { key: 'systolic', label: 'Systolic', color: '#ec4a7a' },
                { key: 'diastolic', label: 'Diastolic', color: '#8b5cf6' },
              ]}
              height={120}
            />
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('weight')}
          className="rounded-xl border border-rose-100 bg-white p-4 text-left hover:shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <Scale size={20} className="text-rose-400" />
            <span className="text-sm font-medium text-slate-600">Weight</span>
          </div>
          {latestWeightDisplay !== null ? (
            <p className="text-2xl font-semibold text-slate-800">
              {latestWeightDisplay} <span className="text-xs font-normal text-slate-400">{settings.weightUnit}</span>
            </p>
          ) : (
            <p className="text-sm text-slate-400">No entries yet</p>
          )}
          <div className="mt-3">
            <TrendChart data={weightChartData} series={[{ key: 'weight', label: 'Weight', color: '#ec4a7a' }]} height={120} />
          </div>
        </button>
      </div>
    </div>
  );
}
