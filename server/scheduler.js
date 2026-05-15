const cron = require('node-cron');
const templates = require('./emailTemplates');
const { readData } = require('./storage');
const WORKOUTS = require('./workoutData');

let sendEmail;

function init(sendEmailFn) {
  sendEmail = sendEmailFn;
  scheduleAll();
  console.log('[Scheduler] All cron jobs scheduled (Asia/Kabul timezone)');
}

function getUser() {
  return readData().user || {};
}

function getKabulDay() {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kabul' })).getDay();
}

function getTodayWorkout() {
  return WORKOUTS[getKabulDay()] || WORKOUTS[5];
}

function send(templateFn, ...args) {
  try {
    const email = templateFn(...args);
    sendEmail(email.subject, email.html).then(() =>
      console.log(`[Email Sent] ${email.subject}`)
    ).catch(err =>
      console.error(`[Email Error] ${err.message}`)
    );
  } catch (err) {
    console.error(`[Scheduler Error] ${err.message}`);
  }
}

function scheduleAll() {
  const tz = { timezone: 'Asia/Kabul' };

  // 5:55 AM — Morning email (all days Sat-Thu = 0,1,2,3,4,6 = not 5)
  cron.schedule('55 5 * * 0,1,2,3,4,6', () => {
    send(templates.morningEmail, getUser(), getTodayWorkout());
  }, tz);

  // 6:45 AM — Leave for gym (Sun-Thu gym days = 0,1,2,3,4)
  cron.schedule('45 6 * * 0,1,2,3,4', () => {
    send(templates.gymLeaveEmail, getUser(), getTodayWorkout());
  }, tz);

  // 7:12 AM — Gym starting (Sun-Thu)
  cron.schedule('12 7 * * 0,1,2,3,4', () => {
    const user = getUser();
    const w = getTodayWorkout();
    sendEmail(`💪 Gym Starting in 3 Minutes — Warm Up First`, `
      <div style="font-family:Arial;background:#06080b;color:#f0f4f8;padding:20px;max-width:600px;">
        <h2 style="color:#b8f53a;">💪 5 Minute Warm-Up — NOW</h2>
        <p>Today: <strong>${w.name}</strong> | Est. burn: ${w.calBurn}</p>
        <p style="color:#ff7b2c;">5 min treadmill BEFORE touching any weight. No cold muscles.</p>
      </div>`);
  }, tz);

  // 8:25 AM — Breakfast supplements
  cron.schedule('25 8 * * 0,1,2,3,4,6', () => {
    send(templates.breakfastSupplementEmail, getUser());
  }, tz);

  // 8:00 AM Saturday — Weekly weigh-in
  cron.schedule('0 8 * * 6', () => {
    send(templates.weighInReminderEmail, getUser());
  }, tz);

  // 10:28 AM — Morning snack
  cron.schedule('28 10 * * 0,1,2,3,4,6', () => {
    send(templates.morningSnackEmail, getUser());
  }, tz);

  // 11:55 AM — Water + zinc reminder
  cron.schedule('55 11 * * 0,1,2,3,4,6', () => {
    send(templates.lunchReminderEmail, getUser());
  }, tz);

  // 2:58 PM — Critical snack (all work days)
  cron.schedule('58 14 * * 0,1,2,3,4,6', () => {
    const day = getKabulDay();
    send(templates.criticalSnackEmail, getUser(), [1, 2].includes(day));
  }, tz);

  // 6:55 PM Saturday — Meal prep reminder
  cron.schedule('55 18 * * 6', () => {
    send(templates.mealPrepEmail, getUser());
  }, tz);

  // 6:55 PM Mon+Tue — Pre-meeting snack
  cron.schedule('55 18 * * 1,2', () => {
    send(templates.preMeetingEmail, getUser());
  }, tz);

  // 9:28 PM — Post-meeting dinner (Mon+Tue)
  cron.schedule('28 21 * * 1,2', () => {
    send(templates.postMeetingDinnerEmail, getUser());
  }, tz);

  // 9:28 PM — Evening supplements (regular days: Sat,Sun,Wed,Thu = 6,0,3,4)
  cron.schedule('28 21 * * 0,3,4,6', () => {
    send(templates.eveningSupplementEmail, getUser());
  }, tz);

  // 10:43 PM — Sleep reminder (all days)
  cron.schedule('43 22 * * *', () => {
    const day = getKabulDay();
    const nextDay = (day + 1) % 7;
    send(templates.sleepReminderEmail, getUser(), [1, 2].includes(day), WORKOUTS[nextDay]);
  }, tz);

  // 9:00 PM Thursday — Weekly summary
  cron.schedule('0 21 * * 4', () => {
    send(templates.weeklySummaryEmail, getUser(), {});
  }, tz);
}

module.exports = { init };
