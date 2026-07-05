import { useEffect, useState } from 'react';
import { NavBar } from './components/NavBar';
import { Dashboard } from './pages/Dashboard';
import { Reminders } from './pages/Reminders';
import { BloodPressure } from './pages/BloodPressure';
import { Weight } from './pages/Weight';
import { Baby } from './pages/Baby';
import { Settings } from './pages/Settings';
import { useReminderLogs, useReminders } from './hooks/useAppData';
import { checkDueReminders } from './lib/notifications';

export type Page = 'dashboard' | 'reminders' | 'bp' | 'weight' | 'baby' | 'settings';

function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const { reminders } = useReminders();
  const { isDone } = useReminderLogs();

  useEffect(() => {
    const interval = setInterval(() => checkDueReminders(reminders, isDone), 30_000);
    return () => clearInterval(interval);
  }, [reminders, isDone]);

  return (
    <div className="min-h-svh bg-rose-50/40 flex flex-col">
      <header className="sm:hidden flex items-center gap-2 px-4 py-3 bg-white border-b border-rose-100">
        <span className="text-lg font-semibold text-rose-500">Pregg</span>
      </header>
      <div className="flex-1 w-full max-w-2xl mx-auto px-4 py-6 pb-24 sm:pb-6">
        {page === 'dashboard' && <Dashboard onNavigate={setPage} />}
        {page === 'reminders' && <Reminders />}
        {page === 'bp' && <BloodPressure />}
        {page === 'weight' && <Weight />}
        {page === 'baby' && <Baby />}
        {page === 'settings' && <Settings />}
      </div>
      <div className="max-w-2xl mx-auto w-full px-4">
        <NavBar active={page} onChange={setPage} />
      </div>
    </div>
  );
}

export default App;
