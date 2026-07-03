import { HeartPulse, Home, ListChecks, Scale, Settings as SettingsIcon } from 'lucide-react';
import type { Page } from '../App';

const TABS: { id: Page; label: string; icon: typeof Home }[] = [
  { id: 'dashboard', label: 'Home', icon: Home },
  { id: 'reminders', label: 'Reminders', icon: ListChecks },
  { id: 'bp', label: 'BP', icon: HeartPulse },
  { id: 'weight', label: 'Weight', icon: Scale },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

interface NavBarProps {
  active: Page;
  onChange: (page: Page) => void;
}

export function NavBar({ active, onChange }: NavBarProps) {
  return (
    <nav className="fixed bottom-0 inset-x-0 sm:static sm:mt-8 bg-white border-t sm:border sm:rounded-2xl border-rose-100 shadow-[0_-2px_10px_rgba(0,0,0,0.04)] sm:shadow-sm z-40">
      <ul className="flex justify-around sm:justify-center sm:gap-2 max-w-2xl mx-auto px-2 py-1 sm:py-2">
        {TABS.map(({ id, label, icon: Icon }) => (
          <li key={id} className="flex-1 sm:flex-none">
            <button
              type="button"
              onClick={() => onChange(id)}
              className={`w-full flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 rounded-xl px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors ${
                active === id
                  ? 'text-rose-600 bg-rose-50'
                  : 'text-slate-500 hover:text-rose-500 hover:bg-rose-50/60'
              }`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
