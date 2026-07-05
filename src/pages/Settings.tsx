import { useRef } from 'react';
import { Bell, Download, Upload } from 'lucide-react';
import { useSettings } from '../hooks/useAppData';
import { store } from '../lib/storage';
import { isSupported, requestPermission } from '../lib/notifications';

export function Settings() {
  const { settings, updateSettings } = useSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleEnableNotifications() {
    const permission = await requestPermission();
    updateSettings({ notificationsEnabled: permission === 'granted' });
  }

  function handleExport() {
    const backup = {
      reminders: store.getReminders(),
      reminderLogs: store.getReminderLogs(),
      bpReadings: store.getBPReadings(),
      weightReadings: store.getWeightReadings(),
      settings: store.getSettings(),
      symptomLogs: store.getSymptomLogs(),
      kickSessions: store.getKickSessions(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pregg-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        if (data.reminders) store.setReminders(data.reminders);
        if (data.reminderLogs) store.setReminderLogs(data.reminderLogs);
        if (data.bpReadings) store.setBPReadings(data.bpReadings);
        if (data.weightReadings) store.setWeightReadings(data.weightReadings);
        if (data.settings) store.setSettings(data.settings);
        if (data.symptomLogs) store.setSymptomLogs(data.symptomLogs);
        if (data.kickSessions) store.setKickSessions(data.kickSessions);
        window.location.reload();
      } catch {
        alert('Could not read that file — make sure it is a Pregg backup file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-800">Settings</h1>

      <section className="rounded-xl border border-rose-100 bg-white p-5">
        <h2 className="text-sm font-medium text-slate-600 mb-3 flex items-center gap-2">
          <Bell size={16} className="text-rose-400" /> Notifications
        </h2>
        {!isSupported() ? (
          <p className="text-sm text-slate-400">Your browser doesn't support notifications.</p>
        ) : settings.notificationsEnabled ? (
          <p className="text-sm text-emerald-600">Notifications are enabled. You'll be alerted while the app is open.</p>
        ) : (
          <button
            type="button"
            onClick={handleEnableNotifications}
            className="bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium px-4 py-2 rounded-lg"
          >
            Enable notifications
          </button>
        )}
      </section>

      <section className="rounded-xl border border-rose-100 bg-white p-5">
        <h2 className="text-sm font-medium text-slate-600 mb-1">Weight unit</h2>
        <div className="flex gap-2 mt-2">
          {(['kg', 'lb'] as const).map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => updateSettings({ weightUnit: u })}
              className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                settings.weightUnit === u ? 'bg-rose-500 text-white' : 'bg-rose-50 text-rose-500'
              }`}
            >
              {u}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-rose-100 bg-white p-5">
        <h2 className="text-sm font-medium text-slate-600 mb-1">Backup & restore</h2>
        <p className="text-xs text-slate-400 mb-3">
          All data is stored only on this device. Export a backup regularly, or before switching devices/browsers.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-1.5 border border-rose-200 text-rose-600 text-sm font-medium px-4 py-2 rounded-lg"
          >
            <Download size={16} /> Export
          </button>
          <button
            type="button"
            onClick={handleImportClick}
            className="flex items-center gap-1.5 border border-rose-200 text-rose-600 text-sm font-medium px-4 py-2 rounded-lg"
          >
            <Upload size={16} /> Import
          </button>
          <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleImportFile} />
        </div>
      </section>
    </div>
  );
}
