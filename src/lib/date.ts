import { format, parseISO } from 'date-fns';

export function todayISO(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function nowHHMM(): string {
  return format(new Date(), 'HH:mm');
}

export function formatDisplayDate(iso: string): string {
  return format(parseISO(iso), 'MMM d, yyyy');
}

export function formatDisplayTime(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return format(d, 'h:mm a');
}

export const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
