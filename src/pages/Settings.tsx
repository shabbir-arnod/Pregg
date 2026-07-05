import { useRef, useState } from 'react';
import { Bell, Download, LogOut, Upload } from 'lucide-react';
import { useSettings } from '../hooks/useAppData';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabaseClient';
import {
  bpReadingFromRow,
  bpReadingToRow,
  kickSessionFromRow,
  kickSessionToRow,
  reminderFromRow,
  reminderLogFromRow,
  reminderLogToRow,
  reminderToRow,
  settingsFromRow,
  settingsToRow,
  symptomLogFromRow,
  symptomLogToRow,
  weightReadingFromRow,
  weightReadingToRow,
} from '../lib/dbMappers';
import { isSupported, requestPermission } from '../lib/notifications';

export function Settings() {
  const { settings, updateSettings } = useSettings();
  const { session, signOut } = useAuth();
  const userId = session?.user.id;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function handleEnableNotifications() {
    const permission = await requestPermission();
    updateSettings({ notificationsEnabled: permission === 'granted' });
  }

  async function handleExport() {
    if (!userId) return;
    setBusy(true);
    const [reminders, reminderLogs, bpReadings, weightReadings, symptomLogs, kickSessions, settingsRow] = await Promise.all([
      supabase.from('reminders').select('*').eq('user_id', userId).then((r) => (r.data ?? []).map(reminderFromRow)),
      supabase.from('reminder_logs').select('*').eq('user_id', userId).then((r) => (r.data ?? []).map(reminderLogFromRow)),
      supabase.from('bp_readings').select('*').eq('user_id', userId).then((r) => (r.data ?? []).map(bpReadingFromRow)),
      supabase.from('weight_readings').select('*').eq('user_id', userId).then((r) => (r.data ?? []).map(weightReadingFromRow)),
      supabase.from('symptom_logs').select('*').eq('user_id', userId).then((r) => (r.data ?? []).map(symptomLogFromRow)),
      supabase.from('kick_sessions').select('*').eq('user_id', userId).then((r) => (r.data ?? []).map(kickSessionFromRow)),
      supabase
        .from('settings')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()
        .then((r) => settingsFromRow(r.data)),
    ]);
    setBusy(false);

    const backup = { reminders, reminderLogs, bpReadings, weightReadings, symptomLogs, kickSessions, settings: settingsRow };
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
    if (!file || !userId) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const data = JSON.parse(String(reader.result));
        setBusy(true);
        if (data.reminders?.length) await supabase.from('reminders').upsert(data.reminders.map((r: Parameters<typeof reminderToRow>[0]) => reminderToRow(r, userId)));
        if (data.reminderLogs?.length)
          await supabase.from('reminder_logs').upsert(data.reminderLogs.map((r: Parameters<typeof reminderLogToRow>[0]) => reminderLogToRow(r, userId)));
        if (data.bpReadings?.length)
          await supabase.from('bp_readings').upsert(data.bpReadings.map((r: Parameters<typeof bpReadingToRow>[0]) => bpReadingToRow(r, userId)));
        if (data.weightReadings?.length)
          await supabase.from('weight_readings').upsert(data.weightReadings.map((r: Parameters<typeof weightReadingToRow>[0]) => weightReadingToRow(r, userId)));
        if (data.symptomLogs?.length)
          await supabase.from('symptom_logs').upsert(data.symptomLogs.map((r: Parameters<typeof symptomLogToRow>[0]) => symptomLogToRow(r, userId)));
        if (data.kickSessions?.length)
          await supabase.from('kick_sessions').upsert(data.kickSessions.map((r: Parameters<typeof kickSessionToRow>[0]) => kickSessionToRow(r, userId)));
        if (data.settings) await supabase.from('settings').upsert(settingsToRow(data.settings, userId));
        setBusy(false);
        window.location.reload();
      } catch {
        setBusy(false);
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
          Your data is saved to your account and follows you when you sign in elsewhere. Export a copy anytime as an
          extra backup, or to bring data into another account.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleExport}
            disabled={busy}
            className="flex items-center gap-1.5 border border-rose-200 text-rose-600 text-sm font-medium px-4 py-2 rounded-lg disabled:opacity-60"
          >
            <Download size={16} /> Export
          </button>
          <button
            type="button"
            onClick={handleImportClick}
            disabled={busy}
            className="flex items-center gap-1.5 border border-rose-200 text-rose-600 text-sm font-medium px-4 py-2 rounded-lg disabled:opacity-60"
          >
            <Upload size={16} /> Import
          </button>
          <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleImportFile} />
        </div>
      </section>

      <section className="rounded-xl border border-rose-100 bg-white p-5">
        <h2 className="text-sm font-medium text-slate-600 mb-1">Account</h2>
        <p className="text-xs text-slate-400 mb-3">Signed in as {session?.user.email}</p>
        <button
          type="button"
          onClick={() => signOut()}
          className="flex items-center gap-1.5 border border-rose-200 text-rose-600 text-sm font-medium px-4 py-2 rounded-lg"
        >
          <LogOut size={16} /> Log out
        </button>
      </section>
    </div>
  );
}
