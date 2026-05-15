// Server-side file-based JSON storage
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/progress.json');

function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({
      user: {
        name: 'Basit Nazari',
        email: process.env.RECIPIENT_EMAIL || '',
        startWeight: 93,
        currentWeight: 93,
        targetWeight: 83,
        timezone: 'Asia/Kabul',
      },
      dailyLogs: {},
      weeklyWeights: {},
      streaks: { currentStreak: 0, bestStreak: 0, lastCompleteDay: null },
    }, null, 2));
  }
}

function readData() {
  ensureDataFile();
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return { user: {}, dailyLogs: {}, weeklyWeights: {}, streaks: {} };
  }
}

function writeData(data) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

module.exports = { readData, writeData, ensureDataFile };
