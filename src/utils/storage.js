// localStorage utilities for task completion and progress data

const STORAGE_KEYS = {
  DAILY_LOGS: 'bhc_daily_logs',
  WEEKLY_WEIGHTS: 'bhc_weekly_weights',
  STREAKS: 'bhc_streaks',
  USER: 'bhc_user',
  WORKOUT_SETS: 'bhc_workout_sets',
};

// ─── User ───
export function getUser() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER);
    if (stored) return JSON.parse(stored);
  } catch {}
  return {
    name: 'Basit Nazari',
    email: '',
    startWeight: 93,
    currentWeight: 93,
    targetWeight: 83,
    timezone: 'Asia/Kabul',
    weekStart: 'Saturday',
    theme: 'dark',
    notificationsEnabled: true,
  };
}

export function saveUser(user) {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

// ─── Daily Logs ───
export function getDailyLog(dateKey) {
  try {
    const logs = JSON.parse(localStorage.getItem(STORAGE_KEYS.DAILY_LOGS) || '{}');
    return logs[dateKey] || {
      tasksCompleted: [],
      tasksMissed: [],
      waterGlasses: 0,
      energyDrinks: 0,
      workoutCompleted: false,
      supplementsComplete: false,
      notes: '',
      weight: null,
    };
  } catch {
    return { tasksCompleted: [], waterGlasses: 0, energyDrinks: 0 };
  }
}

export function saveDailyLog(dateKey, log) {
  try {
    const logs = JSON.parse(localStorage.getItem(STORAGE_KEYS.DAILY_LOGS) || '{}');
    logs[dateKey] = { ...logs[dateKey], ...log };
    localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(logs));
  } catch {}
}

export function toggleTask(dateKey, taskId) {
  const log = getDailyLog(dateKey);
  const completed = log.tasksCompleted || [];
  const idx = completed.indexOf(taskId);
  if (idx >= 0) {
    completed.splice(idx, 1);
  } else {
    completed.push(taskId);
  }
  saveDailyLog(dateKey, { tasksCompleted: completed });
  return completed.includes(taskId);
}

export function isTaskCompleted(dateKey, taskId) {
  const log = getDailyLog(dateKey);
  return (log.tasksCompleted || []).includes(taskId);
}

// ─── Water ───
export function getWaterGlasses(dateKey) {
  return getDailyLog(dateKey).waterGlasses || 0;
}

export function setWaterGlasses(dateKey, glasses) {
  saveDailyLog(dateKey, { waterGlasses: glasses });
}

// ─── Workout Sets ───
export function getWorkoutSets(dateKey) {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEYS.WORKOUT_SETS) || '{}');
    return data[dateKey] || {};
  } catch {
    return {};
  }
}

export function toggleWorkoutSet(dateKey, exerciseId, setIndex) {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEYS.WORKOUT_SETS) || '{}');
    if (!data[dateKey]) data[dateKey] = {};
    if (!data[dateKey][exerciseId]) data[dateKey][exerciseId] = [];
    const sets = data[dateKey][exerciseId];
    const idx = sets.indexOf(setIndex);
    if (idx >= 0) sets.splice(idx, 1);
    else sets.push(setIndex);
    localStorage.setItem(STORAGE_KEYS.WORKOUT_SETS, JSON.stringify(data));
    return data[dateKey][exerciseId];
  } catch {
    return [];
  }
}

// ─── Weights ───
export function getWeeklyWeights() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.WEEKLY_WEIGHTS) || '{}');
  } catch {
    return {};
  }
}

export function logWeight(dateKey, weight) {
  try {
    const weights = getWeeklyWeights();
    weights[dateKey] = parseFloat(weight);
    localStorage.setItem(STORAGE_KEYS.WEEKLY_WEIGHTS, JSON.stringify(weights));
    // Also update user current weight
    const user = getUser();
    user.currentWeight = parseFloat(weight);
    saveUser(user);
  } catch {}
}

export function getWeightHistory() {
  const weights = getWeeklyWeights();
  const entries = Object.entries(weights)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, weight]) => ({ date, weight }));

  // Always include start point
  const user = getUser();
  if (entries.length === 0 || entries[0].date > '2025-01-01') {
    // Add a synthetic start if we have no data
  }
  return entries;
}

// ─── Streaks ───
export function getStreaks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.STREAKS) || '{"currentStreak":0,"bestStreak":0,"lastCompleteDay":null}');
  } catch {
    return { currentStreak: 0, bestStreak: 0, lastCompleteDay: null };
  }
}

export function updateStreak(dateKey, isComplete) {
  const streaks = getStreaks();
  if (isComplete) {
    const yesterday = new Date(dateKey);
    yesterday.setDate(yesterday.getDate() - 1);
    const yKey = yesterday.toISOString().split('T')[0];
    if (streaks.lastCompleteDay === yKey || streaks.lastCompleteDay === dateKey) {
      if (streaks.lastCompleteDay !== dateKey) {
        streaks.currentStreak = (streaks.currentStreak || 0) + 1;
      }
    } else {
      streaks.currentStreak = 1;
    }
    streaks.lastCompleteDay = dateKey;
    if (streaks.currentStreak > (streaks.bestStreak || 0)) {
      streaks.bestStreak = streaks.currentStreak;
    }
  }
  localStorage.setItem(STORAGE_KEYS.STREAKS, JSON.stringify(streaks));
  return streaks;
}

// ─── Weekly Stats ───
export function getWeeklyStats(weekStartDate) {
  try {
    const logs = JSON.parse(localStorage.getItem(STORAGE_KEYS.DAILY_LOGS) || '{}');
    const stats = { workoutsCompleted: 0, supplementDays: 0, waterGoalDays: 0, energyDrinkDays: 0 };
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStartDate);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().split('T')[0];
      const log = logs[key];
      if (!log) continue;
      if (log.workoutCompleted) stats.workoutsCompleted++;
      if (log.supplementsComplete) stats.supplementDays++;
      if ((log.waterGlasses || 0) >= 12) stats.waterGoalDays++;
      if ((log.energyDrinks || 0) > 0) stats.energyDrinkDays++;
    }
    return stats;
  } catch {
    return { workoutsCompleted: 0, supplementDays: 0, waterGoalDays: 0, energyDrinkDays: 0 };
  }
}
