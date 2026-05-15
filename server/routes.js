const express = require('express');
const nodemailer = require('nodemailer');
const { readData, writeData } = require('./storage');
const templates = require('./emailTemplates');
const WORKOUTS = require('./workoutData');

const router = express.Router();

function getTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return null;
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
}

async function sendEmail(subject, html) {
  const transporter = getTransporter();
  if (!transporter) {
    console.log('[Email] No credentials configured — skipping send');
    return { skipped: true };
  }
  const info = await transporter.sendMail({
    from: `"Basit's Health Command" <${process.env.EMAIL_USER}>`,
    to: process.env.RECIPIENT_EMAIL || process.env.EMAIL_USER,
    subject,
    html,
  });
  return info;
}

function getKabulDayOfWeek() {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kabul' })).getDay();
}

function getTodayWorkout() {
  const day = getKabulDayOfWeek();
  return WORKOUTS[day] || WORKOUTS[5];
}

// ─── Ping / Health ───
router.get('/ping', (req, res) => res.json({ status: 'alive', time: new Date().toISOString() }));

// ─── Today's schedule info ───
router.get('/today', (req, res) => {
  const day = getKabulDayOfWeek();
  const workout = getTodayWorkout();
  const kabulTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kabul' });
  res.json({ day, workout, kabulTime, isGymDay: [0,1,2,3,4].includes(day), isMeetingDay: [1,2].includes(day) });
});

// ─── Progress ───
router.get('/progress', (req, res) => {
  res.json(readData());
});

// ─── Log task ───
router.post('/log-task', (req, res) => {
  const { dateKey, taskId, completed } = req.body;
  const data = readData();
  if (!data.dailyLogs[dateKey]) data.dailyLogs[dateKey] = { tasksCompleted: [], tasksMissed: [], waterGlasses: 0, energyDrinks: 0 };
  const log = data.dailyLogs[dateKey];
  if (completed) {
    if (!log.tasksCompleted.includes(taskId)) log.tasksCompleted.push(taskId);
    log.tasksMissed = (log.tasksMissed || []).filter(id => id !== taskId);
  } else {
    log.tasksCompleted = log.tasksCompleted.filter(id => id !== taskId);
  }
  writeData(data);
  res.json({ ok: true });
});

// ─── Log weight ───
router.post('/log-weight', (req, res) => {
  const { dateKey, weight } = req.body;
  if (!weight || isNaN(weight)) return res.status(400).json({ error: 'Invalid weight' });
  const data = readData();
  data.weeklyWeights[dateKey] = parseFloat(weight);
  data.user.currentWeight = parseFloat(weight);
  writeData(data);
  res.json({ ok: true, currentWeight: data.user.currentWeight });
});

// ─── Get/update settings ───
router.get('/settings', (req, res) => {
  const data = readData();
  res.json(data.user);
});

router.post('/settings', (req, res) => {
  const data = readData();
  data.user = { ...data.user, ...req.body };
  writeData(data);
  res.json({ ok: true });
});

// ─── Streak ───
router.get('/streak', (req, res) => {
  res.json(readData().streaks || {});
});

// ─── Send test email ───
router.post('/send-test-email', async (req, res) => {
  try {
    const data = readData();
    const { subject, html } = templates.morningEmail(data.user, getTodayWorkout());
    await sendEmail('[TEST] ' + subject, html);
    res.json({ ok: true, message: 'Test email sent to ' + (process.env.RECIPIENT_EMAIL || process.env.EMAIL_USER) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Send immediate email by type ───
router.post('/send-email', async (req, res) => {
  try {
    const { type } = req.body;
    const data = readData();
    const workout = getTodayWorkout();
    const day = getKabulDayOfWeek();
    const isMeeting = [1, 2].includes(day);

    let email;
    switch (type) {
      case 'morning': email = templates.morningEmail(data.user, workout); break;
      case 'gym_leave': email = templates.gymLeaveEmail(data.user, workout); break;
      case 'breakfast_supp': email = templates.breakfastSupplementEmail(data.user); break;
      case 'morning_snack': email = templates.morningSnackEmail(data.user); break;
      case 'lunch': email = templates.lunchReminderEmail(data.user); break;
      case 'critical_snack': email = templates.criticalSnackEmail(data.user, isMeeting); break;
      case 'pre_meeting': email = templates.preMeetingEmail(data.user); break;
      case 'post_meeting': email = templates.postMeetingDinnerEmail(data.user); break;
      case 'eve_supps': email = templates.eveningSupplementEmail(data.user); break;
      case 'sleep': email = templates.sleepReminderEmail(data.user, isMeeting, workout); break;
      case 'weigh_in': email = templates.weighInReminderEmail(data.user); break;
      case 'meal_prep': email = templates.mealPrepEmail(data.user); break;
      case 'weekly_summary': email = templates.weeklySummaryEmail(data.user, {}); break;
      default: return res.status(400).json({ error: 'Unknown email type' });
    }

    await sendEmail(email.subject, email.html);
    res.json({ ok: true, subject: email.subject });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
module.exports.sendEmail = sendEmail;
module.exports.getTodayWorkout = getTodayWorkout;
module.exports.getKabulDayOfWeek = getKabulDayOfWeek;
