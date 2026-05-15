// Kabul timezone utilities (UTC+4:30 — no DST)

export function getKabulNow() {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kabul' }));
}

export function getKabulDateKey() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kabul' });
}

export function getKabulDayOfWeek() {
  return getKabulNow().getDay(); // 0=Sun,1=Mon,...,6=Sat
}

export function getKabulTimeString() {
  return new Date().toLocaleTimeString('en-US', {
    timeZone: 'Asia/Kabul',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function getKabulDateString() {
  return new Date().toLocaleDateString('en-US', {
    timeZone: 'Asia/Kabul',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getKabulShortDate() {
  return new Date().toLocaleDateString('en-US', {
    timeZone: 'Asia/Kabul',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

// Convert "HH:MM" task time to minutes since midnight
export function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

// Get current Kabul minutes since midnight
export function getKabulMinutes() {
  const now = getKabulNow();
  return now.getHours() * 60 + now.getMinutes();
}

// Check if a task time has passed (task is overdue)
export function isOverdue(taskTime) {
  return getKabulMinutes() > timeToMinutes(taskTime) + 30;
}

// Check if task time is imminent (within 15 min)
export function isImminent(taskTime) {
  const diff = timeToMinutes(taskTime) - getKabulMinutes();
  return diff >= 0 && diff <= 15;
}

// Afghan day names
export const AFGHAN_DAYS = {
  6: 'Saturday (شنبه)',
  0: 'Sunday (یک‌شنبه)',
  1: 'Monday (دو‌شنبه)',
  2: 'Tuesday (سه‌شنبه)',
  3: 'Wednesday (چهارشنبه)',
  4: 'Thursday (پنج‌شنبه)',
  5: 'Friday (جمعه)',
};

export const WEEK_DAYS_ORDERED = [6, 0, 1, 2, 3, 4, 5]; // Sat to Fri (Afghan week)

export function getDayLabel(dayNum) {
  const labels = {
    0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat'
  };
  return labels[dayNum];
}

export function formatWeight(kg) {
  return `${kg.toFixed(1)} kg`;
}

export function calcBMI(weight, height = 178) {
  return (weight / ((height / 100) ** 2)).toFixed(1);
}

export function weeksToGoal(current, target = 83, ratePerWeek = 0.6) {
  if (current <= target) return 0;
  return Math.ceil((current - target) / ratePerWeek);
}
