// Daily schedule tasks
// JS getDay(): 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
// Afghan week: Sat=start, Fri=rest

// Day type helpers
export const isGymDay = (d) => [0, 1, 2, 3, 4].includes(d);   // Sun-Thu
export const isMeetingDay = (d) => [1, 2].includes(d);          // Mon, Tue
export const isRegularEvening = (d) => [6, 0, 3, 4].includes(d); // Sat,Sun,Wed,Thu
export const isSaturday = (d) => d === 6;
export const isFriday = (d) => d === 5;
export const isWorkDay = (d) => d !== 5; // All except Friday

export const DAY_TYPES = {
  0: { label: 'Push Day', sub: 'Sunday — Gym Day 1', color: 'text-blue-400', type: 'gym' },
  1: { label: 'HIIT + Meeting', sub: 'Monday — Gym + 7PM Meeting', color: 'text-orange-400', type: 'gym_meeting' },
  2: { label: 'Pull + Meeting', sub: 'Tuesday — Gym + 7PM Meeting', color: 'text-emerald-400', type: 'gym_meeting' },
  3: { label: 'Cardio Day', sub: 'Wednesday — Gym Day 4', color: 'text-cyan-400', type: 'gym' },
  4: { label: 'LEGS DAY ⭐', sub: 'Thursday — Most Important Workout', color: 'text-yellow-400', type: 'gym' },
  5: { label: 'Rest Day 🕌', sub: 'Friday — Weekly Holiday', color: 'text-slate-400', type: 'rest' },
  6: { label: 'Active Recovery', sub: 'Saturday — Start of Week', color: 'text-teal-400', type: 'recovery' },
};

export const CATEGORIES = {
  morning:     { label: 'Morning Routine', icon: '🌅', color: 'border-amber-500/30 bg-amber-500/5' },
  gym:         { label: 'Gym & Training', icon: '💪', color: 'border-lime-500/30 bg-lime-500/5' },
  breakfast:   { label: 'Breakfast & Supplements', icon: '🍳', color: 'border-green-500/30 bg-green-500/5' },
  work:        { label: 'Work & Productivity', icon: '💼', color: 'border-blue-500/30 bg-blue-500/5' },
  nutrition:   { label: 'Nutrition & Hydration', icon: '🥗', color: 'border-emerald-500/30 bg-emerald-500/5' },
  teaching:    { label: 'ACCA Teaching', icon: '📚', color: 'border-violet-500/30 bg-violet-500/5' },
  evening:     { label: 'Evening & Recovery', icon: '🌙', color: 'border-indigo-500/30 bg-indigo-500/5' },
  sleep:       { label: 'Wind Down & Sleep', icon: '😴', color: 'border-slate-500/30 bg-slate-500/5' },
};

// Task definitions — id must be unique per day (some share IDs for shared tasks)
const COMMON_TASKS = [
  // ─── MORNING (all non-Friday days) ───
  {
    id: 'wake_water', time: '06:00', sortMin: 360, category: 'morning', icon: '💧',
    title: 'Wake Up + Lemon Water',
    desc: 'Drink 400ml warm water with lemon immediately upon waking. No phone for 5 minutes — this is your sacred morning window.',
    critical: false,
  },
  {
    id: 'probiotic', time: '06:00', sortMin: 361, category: 'morning', icon: '🦠',
    title: 'Probiotic Supplement',
    desc: 'Take Probiotic 10–20B CFU on empty stomach — before any food for maximum absorption. Sets up gut health for the day.',
    critical: false,
  },
  {
    id: 'vitamin_d3', time: '06:00', sortMin: 362, category: 'morning', icon: '☀️',
    title: 'Vitamin D3 2000 IU',
    desc: 'Take Vitamin D3 2000 IU with a tiny bite of food. Immune support, mood, bone health.',
    critical: false,
  },
  // ─── BREAKFAST ───
  {
    id: 'breakfast', time: '08:30', sortMin: 510, category: 'breakfast', icon: '🍳',
    title: 'Breakfast + Morning Supplements',
    desc: 'Target: 35–40g protein. Options: 2 eggs + wholegrain toast + yogurt OR oats + milk + nuts.\n\nTake WITH food: Milk Thistle 150–200mg 🌿 · Vitamin C 500mg 🍊 · Omega-3 1000mg 🐟',
    critical: true,
    supplement: true,
  },
  // ─── WORK ───
  {
    id: 'work_begins', time: '09:00', sortMin: 540, category: 'work', icon: '💼',
    title: 'Work Begins — Head of Finance & HR',
    desc: 'Start work. Set 500ml water bottle on desk — finish by 11:30 AM. Begin with most important tasks first.',
    critical: false,
  },
  {
    id: 'screen_break_1', time: '09:50', sortMin: 590, category: 'work', icon: '👁️',
    title: 'Screen Break #1 — 20-20-20 Rule',
    desc: 'Look 20 feet away for 20 seconds. Stand up, neck rolls, shoulder stretch — 2 minutes. Non-negotiable for headache prevention.',
    critical: false,
  },
  {
    id: 'morning_snack', time: '10:30', sortMin: 630, category: 'nutrition', icon: '🍎',
    title: 'Mid-Morning Snack',
    desc: '1 fruit + 8–10 nuts + 300ml water. No processed snacks. 150–200 kcal.',
    critical: false,
  },
  {
    id: 'screen_break_2', time: '10:50', sortMin: 650, category: 'work', icon: '👁️',
    title: 'Screen Break #2',
    desc: 'Stand up, stretch, drink water. 2 minutes away from screen.',
    critical: false,
  },
  {
    id: 'screen_break_3', time: '11:50', sortMin: 710, category: 'work', icon: '💧',
    title: 'Screen Break #3 + Water Check',
    desc: 'Should be at 900ml+ water by now. Stand up, stretch. Prepare for lunch.',
    critical: false,
  },
  {
    id: 'lunch_zinc', time: '12:00', sortMin: 720, category: 'nutrition', icon: '🥗',
    title: 'Lunch + Zinc Supplement',
    desc: 'Balanced plate: 40% protein · 35% veg · 25% carbs. Eat slowly — minimum 20 minutes.\nTake Zinc 15–25mg WITH food (NEVER empty stomach — causes nausea).',
    critical: false,
    supplement: true,
  },
  {
    id: 'post_lunch_walk', time: '12:45', sortMin: 765, category: 'nutrition', icon: '🚶',
    title: 'Post-Lunch Walk — 10 Min',
    desc: 'Light 10-minute walk after lunch. Controls blood sugar spike, aids digestion, reduces afternoon fatigue.',
    critical: false,
  },
  {
    id: 'resume_work', time: '13:00', sortMin: 780, category: 'work', icon: '💼',
    title: 'Resume Work',
    desc: 'Alliance Associates tasks, finance, HR administration.',
    critical: false,
  },
  {
    id: 'screen_break_4', time: '13:50', sortMin: 830, category: 'work', icon: '👁️',
    title: 'Screen Break #4',
    desc: 'Every 50 minutes — non-negotiable. 2 minutes of movement.',
    critical: false,
  },
  {
    id: 'screen_break_5', time: '14:50', sortMin: 890, category: 'work', icon: '💧',
    title: 'Screen Break #5 + Water Check',
    desc: 'Should be at 1,800ml+ water by now. If not, drink a full glass now.',
    critical: false,
  },
  {
    id: 'preteaching_snack', time: '15:00', sortMin: 900, category: 'nutrition', icon: '⚡',
    title: '⚡ CRITICAL: Pre-Teaching Snack',
    desc: 'EAT NOW — you won\'t eat properly for 4+ hours. Options:\n• Greek yogurt + fruit\n• Peanut butter on wholegrain bread\n• 2 boiled eggs + fruit\n\nLast coffee or green tea if needed. Drink 400ml water — you\'ll be talking for 1.5 hours.',
    critical: true,
  },
  {
    id: 'leave_office', time: '15:30', sortMin: 930, category: 'teaching', icon: '🚗',
    title: 'Leave Office → Teaching Centre',
    desc: 'Leave office for ACCA teaching. Allow travel time.',
    critical: false,
  },
  {
    id: 'arrive_teaching', time: '16:00', sortMin: 960, category: 'teaching', icon: '📚',
    title: 'Arrive Teaching Centre',
    desc: 'Settle and prepare before class. Review today\'s ACCA material.',
    critical: false,
  },
  {
    id: 'acca_class', time: '16:30', sortMin: 990, category: 'teaching', icon: '🎓',
    title: 'ACCA Class Begins',
    desc: 'Keep water bottle — sip throughout. Teach ACCA papers. You\'re shaping the next generation of accountants in Afghanistan.',
    critical: false,
  },
  {
    id: 'midclass_break', time: '17:15', sortMin: 1035, category: 'teaching', icon: '🧘',
    title: 'Mid-Class Break',
    desc: '2-minute movement/stretch break for students and yourself. Drink water.',
    critical: false,
  },
  {
    id: 'class_ends', time: '18:00', sortMin: 1080, category: 'teaching', icon: '🏠',
    title: 'Class Ends — Leave for Home',
    desc: 'Class finished. Head home.',
    critical: false,
  },
];

const GYM_TASKS = [
  {
    id: 'preworkout_snack', time: '06:05', sortMin: 365, category: 'morning', icon: '🍌',
    title: 'Pre-Workout Snack',
    desc: '1 banana OR 5–6 soaked almonds. Do NOT train on empty stomach — you need glucose for performance.',
    critical: false,
  },
  {
    id: 'get_ready_gym', time: '06:10', sortMin: 370, category: 'gym', icon: '🎽',
    title: 'Get Ready for Gym',
    desc: 'Light neck/shoulder stretches. Pack 500ml water bottle. Gym clothes ready.',
    critical: false,
  },
  {
    id: 'leave_gym', time: '06:47', sortMin: 407, category: 'gym', icon: '🚀',
    title: 'Leave for Gym — 6:47 AM',
    desc: 'Leave home at exactly 6:47 AM to arrive by 7:15 AM.',
    critical: true,
  },
  {
    id: 'arrive_gym', time: '07:15', sortMin: 435, category: 'gym', icon: '💪',
    title: 'Arrive Gym — Begin Workout',
    desc: '5 min warm-up BEFORE any exercises — mandatory. No cold muscles.',
    critical: false,
  },
  {
    id: 'gym_cooldown', time: '08:00', sortMin: 480, category: 'gym', icon: '🚿',
    title: 'Gym Cooldown + Shower',
    desc: '5–7 min mandatory cooldown stretching. Cold/lukewarm shower for recovery.',
    critical: false,
  },
];

const SATURDAY_TASKS = [
  {
    id: 'sat_walk', time: '07:00', sortMin: 420, category: 'gym', icon: '🌤️',
    title: 'Outdoor Walk — 30–45 Min',
    desc: 'Morning walk in fresh air. Sunlight + movement = cortisol reduction. No gym today — active recovery.',
    critical: false,
  },
  {
    id: 'sat_foam_roll', time: '09:00', sortMin: 540, category: 'gym', icon: '🧘',
    title: 'Foam Rolling + Stretching',
    desc: '10 min foam roll: quads, IT band, upper back.\n15–20 min full body stretching. This prepares your body for the week ahead.',
    critical: false,
  },
  {
    id: 'sat_meal_prep', time: '19:00', sortMin: 1140, category: 'nutrition', icon: '🥗',
    title: '⭐ Meal Prep for Week',
    desc: 'Prepare meals for Sunday, Monday, Tuesday in advance. This is 80% of fat loss success. Pre-cooked food = you stay on plan.',
    critical: true,
  },
  {
    id: 'sat_weigh_in', time: '08:00', sortMin: 480, category: 'morning', icon: '⚖️',
    title: 'Weekly Weigh-In',
    desc: 'Log your weight every Saturday morning — same conditions: morning, after bathroom, before food. Track your journey to 83 kg.',
    critical: false,
  },
];

const REGULAR_EVENING_TASKS = [
  {
    id: 'arrive_home', time: '19:00', sortMin: 1140, category: 'evening', icon: '🏠',
    title: 'Arrive Home — Decompress',
    desc: 'No screens for 15 minutes. Let the teaching day settle. You\'ve done a lot today.',
    critical: false,
  },
  {
    id: 'dinner', time: '19:00', sortMin: 1141, category: 'nutrition', icon: '🍽️',
    title: 'Dinner — Fat Loss Rules',
    desc: 'Light high-protein meal — under 600 kcal. Options:\n• Grilled chicken/fish + salad + soup\n• Daal + vegetables + 1 roti\n\nNO heavy rice at night. Eat before 7:30 PM.',
    critical: false,
  },
  {
    id: 'eve_supps', time: '19:30', sortMin: 1170, category: 'evening', icon: '🌿',
    title: 'Evening Supplements',
    desc: 'Milk Thistle 2nd dose 150mg 🌿 (liver repairs overnight)\nMagnesium Glycinate 300–400mg 💤 (deep sleep + headache relief)',
    critical: true,
    supplement: true,
  },
  {
    id: 'last_food', time: '20:00', sortMin: 1200, category: 'nutrition', icon: '🚫',
    title: 'Last Food of the Day',
    desc: 'No eating after 8:00 PM. Fat loss rule. Your body needs time to process dinner before sleep.',
    critical: false,
  },
  {
    id: 'fiance_call', time: '21:00', sortMin: 1260, category: 'evening', icon: '❤️',
    title: 'Call with Fiancée',
    desc: 'Personal time — dim screen brightness. She\'s 4.5 hours behind you in Germany.',
    critical: false,
  },
  {
    id: 'end_call', time: '22:45', sortMin: 1365, category: 'sleep', icon: '😴',
    title: 'End Call — 10:45 PM',
    desc: 'End call by 10:45 PM. Magnesium should be taking effect. You need 7 hours of sleep for gym tomorrow.',
    critical: true,
  },
  {
    id: 'wind_down', time: '23:00', sortMin: 1380, category: 'sleep', icon: '📵',
    title: 'Wind Down',
    desc: 'Phone on Do Not Disturb. No screens. Let melatonin rise naturally.',
    critical: false,
  },
  {
    id: 'sleep', time: '23:15', sortMin: 1395, category: 'sleep', icon: '🛌',
    title: 'Sleep — 11:15 PM Target',
    desc: '11:15 PM → 6:00 AM = 6 hrs 45 min minimum. Sleep is where fat actually burns.',
    critical: true,
  },
];

const MEETING_EVENING_TASKS = [
  {
    id: 'premeet_snack', time: '19:00', sortMin: 1140, category: 'nutrition', icon: '⚡',
    title: '⚡ Pre-Meeting Snack — EAT NOW',
    desc: 'Eat immediately: fruit + yogurt + nuts (5 minutes). CRITICAL — next proper food is 2.5+ hours away. You cannot focus in a meeting on empty stomach.',
    critical: true,
  },
  {
    id: 'meeting_starts', time: '19:00', sortMin: 1141, category: 'work', icon: '💻',
    title: 'Online Meeting Begins — 7:00 PM',
    desc: 'Keep water nearby during the meeting. Meeting runs until 9:30–10:00 PM.',
    critical: false,
  },
  {
    id: 'meeting_ends', time: '21:30', sortMin: 1290, category: 'nutrition', icon: '🍵',
    title: 'Meeting Ends — Very Light Dinner',
    desc: 'STRICT RULE: Soup + bread, OR small lentils, OR yogurt meal ONLY.\nAbsolutely NO heavy rice, biryani, or fried food.\nLate eating affects blood sugar — keep it minimal.',
    critical: true,
  },
  {
    id: 'eve_supps_mtg', time: '22:00', sortMin: 1320, category: 'evening', icon: '🌿',
    title: 'Evening Supplements (Meeting Night)',
    desc: 'Milk Thistle 2nd dose 150mg + Magnesium Glycinate 300–400mg.',
    critical: true,
    supplement: true,
  },
  {
    id: 'fiance_call_mtg', time: '22:00', sortMin: 1321, category: 'evening', icon: '❤️',
    title: 'Call with Fiancée — 45–60 min',
    desc: 'Shorter call tonight — aim for 45–60 minutes max. Meeting night is exhausting.',
    critical: false,
  },
  {
    id: 'end_call_mtg', time: '23:00', sortMin: 1380, category: 'sleep', icon: '😴',
    title: 'End Call — 11:00 PM',
    desc: 'End by 11:00–11:15 PM. Gym alarm in less than 8 hours.',
    critical: true,
  },
  {
    id: 'sleep_mtg', time: '23:15', sortMin: 1395, category: 'sleep', icon: '🛌',
    title: 'Sleep — Meeting Night',
    desc: '6.5 hours minimum tonight. Meeting nights are draining — sleep is how you recover.',
    critical: true,
  },
];

const FRIDAY_TASKS = [
  {
    id: 'friday_morning', time: '09:00', sortMin: 540, category: 'morning', icon: '🕌',
    title: 'Rest Day — Friday Reminder',
    desc: 'Friday is your weekly holiday. No gym, no formal schedule. Stay hydrated, take your supplements (Probiotic, D3, Milk Thistle, Vitamin C, Omega-3, Zinc with lunch, Magnesium at night), enjoy recovery.',
    critical: false,
  },
  {
    id: 'friday_sleep', time: '22:00', sortMin: 1320, category: 'sleep', icon: '🛌',
    title: 'Sleep on Time — Gym Tomorrow',
    desc: 'Sleep on time tonight. Tomorrow is Saturday (Active Recovery + walk), Sunday is PUSH DAY at gym. Start the new week strong.',
    critical: true,
  },
];

// Build task list for a given JS day of week
export function getTasksForDay(dayOfWeek) {
  if (isFriday(dayOfWeek)) return FRIDAY_TASKS;

  let tasks = [...COMMON_TASKS];

  if (isSaturday(dayOfWeek)) {
    // Remove standard morning gym tasks, add saturday-specific
    tasks = tasks.filter(t => t.category !== 'gym');
    tasks = [...tasks, ...SATURDAY_TASKS];
  } else if (isGymDay(dayOfWeek)) {
    tasks = [...tasks, ...GYM_TASKS];
  }

  if (isMeetingDay(dayOfWeek)) {
    tasks = [...tasks, ...MEETING_EVENING_TASKS];
  } else if (isRegularEvening(dayOfWeek)) {
    tasks = [...tasks, ...REGULAR_EVENING_TASKS];
  }

  // Sort by time
  return tasks.sort((a, b) => a.sortMin - b.sortMin);
}

// Get today's tasks using Kabul time
export function getTodayTasks() {
  const kabulDate = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kabul' }));
  return getTasksForDay(kabulDate.getDay());
}

// Get today's date string in Kabul timezone (YYYY-MM-DD)
export function getKabulDateKey() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kabul' });
}
