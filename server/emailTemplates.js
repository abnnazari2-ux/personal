// HTML email templates for Basit's Health Command

function baseTemplate(content, subject) {
  const kabulTime = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Kabul',
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#06080b;font-family:'DM Sans',Arial,sans-serif;color:#f0f4f8;">
  <div style="max-width:600px;margin:0 auto;background:#06080b;">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#0a1628 0%,#0c1a35 100%);padding:24px 28px;border-bottom:2px solid #b8f53a;">
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <div>
          <div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#b8f53a;font-weight:700;">BASIT'S HEALTH COMMAND</div>
          <div style="font-size:22px;font-weight:700;color:#f0f4f8;margin-top:4px;">Basit Nazari</div>
        </div>
        <div style="width:12px;height:12px;background:#b8f53a;border-radius:50%;box-shadow:0 0 8px #b8f53a;"></div>
      </div>
      <div style="font-size:12px;color:#6b7a99;margin-top:8px;">📍 ${kabulTime} — Kabul, Afghanistan</div>
    </div>

    <!-- Content -->
    <div style="padding:24px 28px;">
      ${content}
    </div>

    <!-- Progress Footer -->
    <div style="background:#0c0f14;border-top:1px solid #1a2235;padding:16px 28px;">
      <div style="font-size:11px;color:#6b7a99;text-align:center;">
        <a href="${process.env.APP_URL || 'https://your-app.replit.app'}" style="color:#b8f53a;text-decoration:none;font-weight:600;">Open Health Command App →</a>
      </div>
      <div style="font-size:11px;color:#4a5568;text-align:center;margin-top:8px;">
        Sent by Basit's Health Command | Alliance Associates, Kabul
      </div>
    </div>
  </div>
</body>
</html>`;
}

function progressBar(current, start = 93, target = 83) {
  const total = start - target;
  const done = start - current;
  const pct = Math.max(0, Math.min(100, (done / total) * 100));
  const remaining = (current - target).toFixed(1);
  const weeks = Math.ceil((current - target) / 0.6);
  return `
<div style="background:#0c0f14;border:1px solid #1a2235;border-radius:8px;padding:16px;margin-top:16px;">
  <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
    <span style="color:#6b7a99;font-size:12px;">Weight Journey</span>
    <span style="color:#b8f53a;font-size:12px;font-weight:700;">${remaining} kg to go</span>
  </div>
  <div style="background:#1a2235;border-radius:4px;height:8px;overflow:hidden;">
    <div style="background:linear-gradient(90deg,#b8f53a,#2dd4bf);height:100%;width:${pct.toFixed(1)}%;border-radius:4px;"></div>
  </div>
  <div style="display:flex;justify-content:space-between;margin-top:6px;">
    <span style="color:#6b7a99;font-size:11px;">Start: ${start} kg</span>
    <span style="color:#f0f4f8;font-size:11px;font-weight:600;">Now: ${current} kg</span>
    <span style="color:#6b7a99;font-size:11px;">Target: ${target} kg</span>
  </div>
  <div style="text-align:center;margin-top:8px;font-size:11px;color:#6b7a99;">Est. ~${weeks} weeks to goal at current rate</div>
</div>`;
}

function checklistItem(text, critical = false) {
  const color = critical ? '#ff7b2c' : '#b8f53a';
  return `<div style="display:flex;align-items:flex-start;margin:8px 0;font-size:14px;">
    <span style="color:${color};margin-right:10px;font-weight:700;">→</span>
    <span style="color:#f0f4f8;">${text}</span>
  </div>`;
}

function alertBox(text, type = 'warning') {
  const colors = {
    warning: { bg: '#1a1000', border: '#ff7b2c', text: '#ff7b2c' },
    critical: { bg: '#1a0000', border: '#ff3b3b', text: '#ff3b3b' },
    success: { bg: '#001a12', border: '#2dd4bf', text: '#2dd4bf' },
    info: { bg: '#001020', border: '#38b6ff', text: '#38b6ff' },
  };
  const c = colors[type] || colors.warning;
  return `<div style="background:${c.bg};border-left:3px solid ${c.border};padding:12px 16px;border-radius:4px;margin:12px 0;">
    <span style="color:${c.text};font-size:14px;">${text}</span>
  </div>`;
}

// ─── Email Templates ───

function morningEmail(user, workout) {
  const w = workout || {};
  const content = `
    <h2 style="color:#b8f53a;font-size:20px;margin:0 0 4px;">🌅 Good Morning, Basit</h2>
    <p style="color:#6b7a99;font-size:14px;margin:0 0 20px;">Your day is fully planned. Execute.</p>

    ${alertBox(`Today: <strong>${w.name || 'Check App'}</strong> — ${w.type || ''} | Est. burn: ${w.calBurn || ''}`, 'info')}

    <h3 style="color:#f0f4f8;font-size:14px;letter-spacing:1px;text-transform:uppercase;">Morning Checklist</h3>
    ${checklistItem('400ml warm lemon water immediately')}
    ${checklistItem('Probiotic + Vitamin D3 (empty stomach)', false)}
    ${checklistItem('Pre-workout snack at 6:05 AM — banana or almonds', true)}
    ${checklistItem('Leave for gym at exactly 6:47 AM', true)}

    <h3 style="color:#f0f4f8;font-size:14px;letter-spacing:1px;text-transform:uppercase;margin-top:16px;">Today's Supplement Schedule</h3>
    ${checklistItem('6:00 AM — Probiotic + Vitamin D3 (empty stomach)')}
    ${checklistItem('8:30 AM — Milk Thistle 150mg + Vitamin C 500mg + Omega-3 1000mg WITH breakfast', true)}
    ${checklistItem('12:00 PM — Zinc 15–25mg WITH lunch (never empty stomach)')}
    ${checklistItem('9:30 PM — Magnesium 300mg + Milk Thistle 2nd dose before bed', true)}

    <h3 style="color:#f0f4f8;font-size:14px;letter-spacing:1px;text-transform:uppercase;margin-top:16px;">Water Targets</h3>
    ${checklistItem('By 7:15 AM: 900ml | By 11:30: 1,400ml | By 2:50 PM: 1,800ml | Total: 3,000ml+')}

    ${progressBar(user.currentWeight || 93)}`;
  return { subject: '🌅 Good Morning Basit — Your Day Starts Now', html: baseTemplate(content, 'Good Morning') };
}

function gymLeaveEmail(user, workout) {
  const w = workout || {};
  const exercises = (w.exercises || []).slice(0, 5).map(e =>
    `<tr><td style="color:#f0f4f8;padding:4px 8px;">${e.name}</td><td style="color:#b8f53a;padding:4px 8px;">${e.sets}×${e.reps}</td></tr>`
  ).join('');

  const content = `
    <h2 style="color:#b8f53a;font-size:20px;margin:0 0 4px;">🏋️ Leave for Gym NOW</h2>
    <p style="color:#f0f4f8;font-size:16px;font-weight:600;margin:0 0 16px;">6:47 AM — Leave home. Today: <strong>${w.name || 'Workout'}</strong></p>

    ${alertBox('⏰ Leave at exactly 6:47 AM → Arrive 7:15 AM → 5 min warm-up BEFORE touching any weight', 'critical')}

    <h3 style="color:#f0f4f8;font-size:14px;letter-spacing:1px;text-transform:uppercase;">Today's Exercises</h3>
    <table style="width:100%;border-collapse:collapse;font-size:13px;">${exercises}</table>
    <p style="color:#6b7a99;font-size:12px;">+ warmup, cooldown. Estimated burn: ${w.calBurn || '—'}</p>

    ${progressBar(user.currentWeight || 93)}`;
  return { subject: `🏋️ Leave for Gym NOW — ${w.name || 'Workout'}`, html: baseTemplate(content, 'Leave for Gym') };
}

function breakfastSupplementEmail(user) {
  const content = `
    <h2 style="color:#b8f53a;font-size:20px;margin:0 0 4px;">💊 Breakfast Supplement Time</h2>
    <p style="color:#f0f4f8;font-size:14px;margin:0 0 16px;">8:25 AM — Take these WITH your breakfast NOW.</p>

    ${alertBox('🌿 MILK THISTLE IS NON-NEGOTIABLE. You are an HBV carrier. Silymarin protects your liver cells from viral damage every single day. Take it now.', 'critical')}

    ${checklistItem('🌿 Milk Thistle (Silymarin) 150–200mg — liver protection', true)}
    ${checklistItem('🍊 Vitamin C 500mg — immune support', false)}
    ${checklistItem('🐟 Omega-3 Fish Oil 1000mg — anti-inflammatory (refrigerate bottle)', false)}

    <p style="color:#6b7a99;font-size:12px;margin-top:12px;">Take all three WITH food, not on empty stomach.</p>
    ${progressBar(user.currentWeight || 93)}`;
  return { subject: '💊 Breakfast Supplements — Milk Thistle + Vitamin C + Omega-3', html: baseTemplate(content, 'Breakfast Supplements') };
}

function morningSnackEmail(user) {
  const content = `
    <h2 style="color:#b8f53a;font-size:20px;margin:0 0 4px;">🍎 Snack Time + Screen Break</h2>
    <p style="color:#f0f4f8;font-size:14px;margin:0 0 16px;">10:28 AM — Two things to do right now.</p>

    ${checklistItem('Eat: 1 fruit + 8–10 nuts + 300ml water (150–200 kcal)')}
    ${checklistItem('Stand up — 20-20-20 eye rule: look 20 feet away for 20 seconds')}
    ${checklistItem('Neck rolls, shoulder stretch — 2 minutes')}
    ${checklistItem('Check water: should be at 900ml+ by now')}

    ${alertBox('No processed snacks. No energy drinks. Your liver and weight loss goals depend on clean fuel.', 'warning')}
    ${progressBar(user.currentWeight || 93)}`;
  return { subject: '🍎 Snack Time + Screen Break — 10:30 AM', html: baseTemplate(content, 'Snack Time') };
}

function lunchReminderEmail(user) {
  const content = `
    <h2 style="color:#b8f53a;font-size:20px;margin:0 0 4px;">💧 Water Check + Zinc Reminder</h2>
    <p style="color:#f0f4f8;font-size:14px;margin:0 0 16px;">11:55 AM — Almost lunch time.</p>

    ${alertBox('💧 Are you at 1,400ml water yet? If not, drink a full glass right now.', 'warning')}

    <h3 style="color:#f0f4f8;font-size:14px;text-transform:uppercase;">Lunch Rules (12:00 PM)</h3>
    ${checklistItem('💊 Zinc 15–25mg WITH food — NEVER on empty stomach', true)}
    ${checklistItem('Plate: 40% protein · 35% vegetables · 25% complex carbs')}
    ${checklistItem('Eat slowly — minimum 20 minutes')}
    ${checklistItem('Post-lunch: 10-minute walk at 12:45 PM (blood sugar control)')}
    ${progressBar(user.currentWeight || 93)}`;
  return { subject: '💧 Water Check — Are You at 1,400ml? + Zinc Reminder', html: baseTemplate(content, 'Water + Zinc') };
}

function criticalSnackEmail(user, isMeetingDay = false) {
  const extraMsg = isMeetingDay
    ? alertBox('🚨 MEETING NIGHT: This snack replaces dinner for 6+ hours. You have gym tomorrow. Treat this as a meal, not a snack.', 'critical')
    : '';
  const content = `
    <h2 style="color:#ff7b2c;font-size:20px;margin:0 0 4px;">⚡ CRITICAL: 3 PM Snack</h2>
    <p style="color:#f0f4f8;font-size:14px;margin:0 0 16px;">3:00 PM Kabul — Eat before you leave for teaching.</p>

    ${alertBox("You have ACCA class in 90 minutes. If you skip this snack, you'll be running on empty for the next 4–6 hours. Your students deserve your full focus. EAT NOW.", 'critical')}
    ${extraMsg}

    <h3 style="color:#f0f4f8;font-size:14px;text-transform:uppercase;">Options (250–300 kcal | 15g+ protein)</h3>
    ${checklistItem('Greek yogurt + fruit')}
    ${checklistItem('Peanut butter on wholegrain bread')}
    ${checklistItem('2 boiled eggs + fruit')}

    ${checklistItem('💧 Drink 400ml water now — you\'ll be talking for 1.5 hours', true)}
    ${checklistItem('☕ Last coffee or green tea if needed')}
    ${progressBar(user.currentWeight || 93)}`;
  return { subject: '⚡ CRITICAL: 3 PM Snack — Eat Before Teaching', html: baseTemplate(content, '3 PM Critical Snack') };
}

function preMeetingEmail(user) {
  const content = `
    <h2 style="color:#ff7b2c;font-size:20px;margin:0 0 4px;">🥤 Pre-Meeting Snack — 5 Minutes</h2>
    <p style="color:#f0f4f8;font-size:14px;margin:0 0 16px;">Meeting starts now. Eat immediately.</p>

    ${alertBox('Next proper food is 2.5+ hours away. You cannot focus on meeting content with empty stomach.', 'critical')}

    ${checklistItem('Fruit + yogurt + nuts — eat in the next 5 minutes')}
    ${checklistItem('Fill water bottle for the meeting')}
    ${checklistItem('Phone on silent (not DND — you need to hear the meeting)')}
    ${progressBar(user.currentWeight || 93)}`;
  return { subject: '🥤 Pre-Meeting Snack — Eat in the Next 5 Minutes', html: baseTemplate(content, 'Pre-Meeting Snack') };
}

function postMeetingDinnerEmail(user) {
  const content = `
    <h2 style="color:#b8f53a;font-size:20px;margin:0 0 4px;">🍽️ Light Dinner — Meeting Night</h2>
    <p style="color:#f0f4f8;font-size:14px;margin:0 0 16px;">Meeting ended. Eat something light NOW.</p>

    ${alertBox('STRICT RULE: Soup + bread, OR small lentils, OR yogurt ONLY. No heavy rice, biryani, or fried food. Late eating spikes blood sugar — keep it minimal.', 'critical')}

    ${checklistItem('🌿 Milk Thistle 2nd dose 150mg', true)}
    ${checklistItem('💤 Magnesium Glycinate 300–400mg', false)}
    ${checklistItem('Call fiancée — aim for 45–60 min tonight')}
    ${checklistItem('End call by 11:00–11:15 PM — gym tomorrow at 7:15 AM', true)}
    ${progressBar(user.currentWeight || 93)}`;
  return { subject: '🍽️ Light Dinner Only Tonight — Meeting Night', html: baseTemplate(content, 'Post-Meeting Dinner') };
}

function eveningSupplementEmail(user) {
  const content = `
    <h2 style="color:#b8f53a;font-size:20px;margin:0 0 4px;">🌿 Evening Supplements</h2>
    <p style="color:#f0f4f8;font-size:14px;margin:0 0 16px;">9:28 PM — Before-bed supplement window.</p>

    ${alertBox('🌿 Your liver does most of its repair during sleep. Milk Thistle 2nd dose ensures 24-hour HBV protection overnight.', 'info')}

    ${checklistItem('🌿 Milk Thistle 2nd dose — 150mg (liver overnight repair)', true)}
    ${checklistItem('💤 Magnesium Glycinate 300–400mg (deep sleep, muscle recovery, headache relief)', false)}
    ${checklistItem('No eating after 8:00 PM')}
    ${checklistItem('Finish call with fiancée by 10:45 PM', true)}
    ${progressBar(user.currentWeight || 93)}`;
  return { subject: '🌿 Evening Supplements — Magnesium + Milk Thistle', html: baseTemplate(content, 'Evening Supplements') };
}

function sleepReminderEmail(user, isMeetingDay = false, tomorrowWorkout = null) {
  const gymMsg = tomorrowWorkout
    ? `Tomorrow: <strong>${tomorrowWorkout.name}</strong> — gym alarm in ${isMeetingDay ? '7' : '7'} hours 17 minutes.`
    : 'Gym starts tomorrow. Sleep now.';
  const remaining = ((user.currentWeight || 93) - 83).toFixed(1);
  const content = `
    <h2 style="color:#a78bfa;font-size:20px;margin:0 0 4px;">😴 End Your Call — Sleep Now</h2>
    <p style="color:#f0f4f8;font-size:14px;margin:0 0 16px;">10:43 PM — 30 minutes to sleep target.</p>

    ${alertBox(`${gymMsg}\nYou are ${remaining} kg away from your 83 kg goal. Sleep is where fat actually burns.`, 'info')}

    ${checklistItem('End call — now', true)}
    ${checklistItem('Phone on Do Not Disturb')}
    ${checklistItem('No screens — let melatonin rise')}
    ${checklistItem('Sleep target: 11:15 PM → wake 6:00 AM = 6h 45min', true)}
    ${progressBar(user.currentWeight || 93)}`;
  return { subject: '😴 End Your Call — Sleep in 30 Minutes', html: baseTemplate(content, 'Sleep Reminder') };
}

function weighInReminderEmail(user) {
  const content = `
    <h2 style="color:#b8f53a;font-size:20px;margin:0 0 4px;">⚖️ Weekly Weigh-In — Saturday Morning</h2>
    <p style="color:#f0f4f8;font-size:14px;margin:0 0 16px;">New week starts today. Log your weight.</p>

    ${alertBox('Weigh yourself now — same conditions: morning, after bathroom, before food. Consistent conditions = accurate tracking.', 'info')}

    ${checklistItem('Step on scale — record your weight')}
    ${checklistItem('Log it in the Health Command app')}
    ${checklistItem('Remember: weight fluctuates 0.5–2 kg daily — trend matters, not single reading')}

    <h3 style="color:#f0f4f8;font-size:14px;text-transform:uppercase;">This Week's Plan</h3>
    ${checklistItem('Sunday: Push Day (Chest/Shoulders/Triceps)')}
    ${checklistItem('Monday: HIIT Fat Burn + 7PM Meeting')}
    ${checklistItem('Tuesday: Pull Day + 7PM Meeting')}
    ${checklistItem('Wednesday: Cardio')}
    ${checklistItem('Thursday: LEGS DAY ⭐ (most important)')}
    ${progressBar(user.currentWeight || 93)}`;
  return { subject: '⚖️ Weekly Weigh-In — Log Your Weight Today', html: baseTemplate(content, 'Weekly Weigh-In') };
}

function mealPrepEmail(user) {
  const content = `
    <h2 style="color:#b8f53a;font-size:20px;margin:0 0 4px;">🥗 Meal Prep — Sunday Reminder</h2>
    <p style="color:#f0f4f8;font-size:14px;margin:0 0 16px;">Prepare meals for Sunday, Monday, Tuesday now.</p>

    ${alertBox('Meal prep = 80% of your fat loss success. When food is ready, you eat right. When it\'s not, you eat whatever is convenient. Convenient is almost never 2,200 kcal.', 'warning')}

    <h3 style="color:#f0f4f8;font-size:14px;text-transform:uppercase;">Prep Checklist</h3>
    ${checklistItem('Cook protein for 3 days (grilled chicken / eggs / fish)')}
    ${checklistItem('Prepare complex carbs (oats, wholegrain bread, lentils)')}
    ${checklistItem('Chop vegetables for easy lunch salads')}
    ${checklistItem('Portion pre-workout snacks (bananas, almonds)')}
    ${checklistItem('Pre-measure supplement doses for the week')}
    ${progressBar(user.currentWeight || 93)}`;
  return { subject: '🥗 Meal Prep Reminder — Prepare for Sunday, Monday, Tuesday', html: baseTemplate(content, 'Meal Prep') };
}

function weeklySummaryEmail(user, stats = {}) {
  const workouts = stats.workoutsCompleted || 0;
  const supps = stats.supplementDays || 0;
  const water = stats.waterGoalDays || 0;
  const lost = stats.weightLost || 0;
  const streak = stats.streak || 0;

  const content = `
    <h2 style="color:#b8f53a;font-size:20px;margin:0 0 4px;">📊 Weekly Health Report</h2>
    <p style="color:#f0f4f8;font-size:14px;margin:0 0 16px;">Thursday wrap-up — here's how your week went.</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:16px 0;">
      <div style="background:#0c0f14;border:1px solid #1a2235;border-radius:8px;padding:16px;text-align:center;">
        <div style="font-size:28px;font-weight:700;color:#b8f53a;">${workouts}/5</div>
        <div style="font-size:12px;color:#6b7a99;">Workouts Done</div>
      </div>
      <div style="background:#0c0f14;border:1px solid #1a2235;border-radius:8px;padding:16px;text-align:center;">
        <div style="font-size:28px;font-weight:700;color:#2dd4bf;">${supps}/6</div>
        <div style="font-size:12px;color:#6b7a99;">Supplement Days</div>
      </div>
      <div style="background:#0c0f14;border:1px solid #1a2235;border-radius:8px;padding:16px;text-align:center;">
        <div style="font-size:28px;font-weight:700;color:#38b6ff;">${water}/6</div>
        <div style="font-size:12px;color:#6b7a99;">Water Goal Days</div>
      </div>
      <div style="background:#0c0f14;border:1px solid #1a2235;border-radius:8px;padding:16px;text-align:center;">
        <div style="font-size:28px;font-weight:700;color:#a78bfa;">${streak}</div>
        <div style="font-size:12px;color:#6b7a99;">Day Streak</div>
      </div>
    </div>

    ${lost > 0 ? alertBox(`🎉 You lost ${lost.toFixed(1)} kg this week. Keep going — you are ${((user.currentWeight || 93) - 83).toFixed(1)} kg from your goal.`, 'success') : ''}

    <p style="color:#6b7a99;font-size:14px;margin-top:16px;">New week starts Saturday. Weigh in Saturday morning. Push Day on Sunday. Keep the streak alive.</p>
    ${progressBar(user.currentWeight || 93)}`;
  return { subject: `📊 Weekly Health Report — Week Summary`, html: baseTemplate(content, 'Weekly Report') };
}

module.exports = {
  morningEmail,
  gymLeaveEmail,
  breakfastSupplementEmail,
  morningSnackEmail,
  lunchReminderEmail,
  criticalSnackEmail,
  preMeetingEmail,
  postMeetingDinnerEmail,
  eveningSupplementEmail,
  sleepReminderEmail,
  weighInReminderEmail,
  mealPrepEmail,
  weeklySummaryEmail,
};
