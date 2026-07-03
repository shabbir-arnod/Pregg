import type { Reminder } from '../types';
import { nowHHMM, todayISO } from './date';

export function isSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export async function requestPermission(): Promise<NotificationPermission> {
  if (!isSupported()) return 'denied';
  return Notification.requestPermission();
}

function isDueToday(reminder: Reminder, weekday: number): boolean {
  return reminder.days.length === 0 || reminder.days.includes(weekday);
}

const notifiedKey = (reminderId: string, date: string) => `pregg.notified.${reminderId}.${date}`;

// Checks every reminder against the current time and fires a browser
// notification once per reminder per day when its time arrives.
export function checkDueReminders(reminders: Reminder[], isDone: (reminderId: string, date: string) => boolean) {
  if (!isSupported() || Notification.permission !== 'granted') return;

  const date = todayISO();
  const time = nowHHMM();
  const weekday = new Date().getDay();

  for (const reminder of reminders) {
    if (!isDueToday(reminder, weekday)) continue;
    if (reminder.time !== time) continue;
    if (isDone(reminder.id, date)) continue;
    if (sessionStorage.getItem(notifiedKey(reminder.id, date))) continue;

    new Notification(reminder.type === 'medicine' ? 'Medicine reminder' : 'Exercise reminder', {
      body: reminder.title,
      tag: notifiedKey(reminder.id, date),
    });
    sessionStorage.setItem(notifiedKey(reminder.id, date), '1');
  }
}
