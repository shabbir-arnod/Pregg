// Fake in-memory data + helpers for the UI kit — no backend, just enough state to click through.
function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function formatDisplayDate(iso) {
  return new Date(iso + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

const BABY_SIZES = ['a poppy seed', 'a blueberry', 'a lime', 'an avocado', 'a mango', 'a papaya', 'a pineapple'];
const BABY_EMOJI = ['🫐', '🍋', '🥑', '🥭', '🍍', '🍉'];

function getPregnancyWeek() {
  return 24;
}
function getBabySize() {
  return BABY_SIZES[3];
}
function getBabyEmoji() {
  return BABY_EMOJI[3];
}

const initialState = {
  page: 'dashboard',
  dueDate: '2026-11-02',
  reminders: [
    { id: 'r1', title: 'Prenatal vitamin', type: 'medicine', time: '09:00', days: [], done: true },
    { id: 'r2', title: 'Prenatal yoga', type: 'exercise', time: '18:00', days: [1, 3, 5], done: false },
    { id: 'r3', title: 'Iron supplement', type: 'medicine', time: '20:00', days: [], done: false },
  ],
  bp: [
    { id: 'b1', date: '2026-06-01', time: '08:00', systolic: 118, diastolic: 76, pulse: 72 },
    { id: 'b2', date: '2026-06-08', time: '08:10', systolic: 121, diastolic: 78, pulse: 74 },
    { id: 'b3', date: '2026-06-15', time: '08:05', systolic: 117, diastolic: 74, pulse: 70 },
    { id: 'b4', date: '2026-06-22', time: '08:00', systolic: 124, diastolic: 80, pulse: 76 },
  ],
  weight: [
    { id: 'w1', date: '2026-06-01', weight: 63.2 },
    { id: 'w2', date: '2026-06-08', weight: 63.6 },
    { id: 'w3', date: '2026-06-15', weight: 64.1 },
    { id: 'w4', date: '2026-06-22', weight: 64.7 },
  ],
  weightUnit: 'kg',
  symptoms: ['Fatigue', 'Nausea'],
  symptomNotes: '',
  kickCount: 0,
  kickActive: false,
  photos: [
    { id: 'p1', week: 12, date: '2026-04-10' },
    { id: 'p2', week: 20, date: '2026-06-05' },
  ],
};

window.PreggKit = { todayISO, formatDisplayDate, getPregnancyWeek, getBabySize, getBabyEmoji, initialState };
