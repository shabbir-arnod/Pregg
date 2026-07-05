import { differenceInCalendarDays, parseISO } from 'date-fns';
import type { SymptomKey } from '../types';

const FULL_TERM_DAYS = 280; // 40 weeks

export function getGestationDays(dueDate: string, today: Date = new Date()): number {
  const daysUntilDue = differenceInCalendarDays(parseISO(dueDate), today);
  return FULL_TERM_DAYS - daysUntilDue;
}

export function getPregnancyWeek(dueDate: string, today: Date = new Date()): number {
  const days = getGestationDays(dueDate, today);
  return Math.min(42, Math.max(1, Math.floor(days / 7)));
}

export function getTrimester(week: number): 1 | 2 | 3 {
  if (week <= 13) return 1;
  if (week <= 27) return 2;
  return 3;
}

export function getDaysUntilDue(dueDate: string, today: Date = new Date()): number {
  return Math.max(0, differenceInCalendarDays(parseISO(dueDate), today));
}

const BABY_SIZE_BY_WEEK: Record<number, string> = {
  4: 'a poppy seed',
  5: 'a sesame seed',
  6: 'a lentil',
  7: 'a blueberry',
  8: 'a raspberry',
  9: 'a grape',
  10: 'a kumquat',
  11: 'a fig',
  12: 'a lime',
  13: 'a lemon',
  14: 'a peach',
  15: 'an apple',
  16: 'an avocado',
  17: 'a turnip',
  18: 'a bell pepper',
  19: 'a mango',
  20: 'a banana',
  21: 'a carrot',
  22: 'a papaya',
  23: 'a grapefruit',
  24: 'a cantaloupe',
  25: 'a cauliflower',
  26: 'a lettuce head',
  27: 'a rutabaga',
  28: 'an eggplant',
  29: 'a butternut squash',
  30: 'a cabbage',
  31: 'a coconut',
  32: 'a jicama',
  33: 'a pineapple',
  34: 'a cantaloupe',
  35: 'a honeydew melon',
  36: 'a romaine lettuce',
  37: 'a bunch of Swiss chard',
  38: 'a leek',
  39: 'a mini watermelon',
  40: 'a small pumpkin',
  41: 'a small pumpkin',
  42: 'a watermelon',
};

export function getBabySize(week: number): string {
  const clamped = Math.min(42, Math.max(4, week));
  return BABY_SIZE_BY_WEEK[clamped] ?? BABY_SIZE_BY_WEEK[4];
}

// Closest available emoji per week — some are approximations where no exact
// match exists (e.g. no "fig" or "rutabaga" emoji).
const BABY_EMOJI_BY_WEEK: Record<number, string> = {
  4: '🟤',
  5: '🟤',
  6: '🫘',
  7: '🫐',
  8: '🍓',
  9: '🍇',
  10: '🍊',
  11: '🟣',
  12: '🍋',
  13: '🍋',
  14: '🍑',
  15: '🍎',
  16: '🥑',
  17: '🥔',
  18: '🫑',
  19: '🥭',
  20: '🍌',
  21: '🥕',
  22: '🍈',
  23: '🍊',
  24: '🍈',
  25: '🥦',
  26: '🥬',
  27: '🥔',
  28: '🍆',
  29: '🎃',
  30: '🥬',
  31: '🥥',
  32: '🥔',
  33: '🍍',
  34: '🍈',
  35: '🍈',
  36: '🥬',
  37: '🥬',
  38: '🧅',
  39: '🍉',
  40: '🎃',
  41: '🎃',
  42: '🍉',
};

export function getBabyEmoji(week: number): string {
  const clamped = Math.min(42, Math.max(4, week));
  return BABY_EMOJI_BY_WEEK[clamped] ?? BABY_EMOJI_BY_WEEK[4];
}

export const SYMPTOM_LABELS: Record<SymptomKey, string> = {
  nausea: 'Nausea',
  fatigue: 'Fatigue',
  headache: 'Headache',
  cramping: 'Cramping',
  moodSwings: 'Mood swings',
  cravings: 'Cravings',
  heartburn: 'Heartburn',
  backache: 'Backache',
  swelling: 'Swelling',
  insomnia: 'Insomnia',
  constipation: 'Constipation',
  spotting: 'Spotting',
};
