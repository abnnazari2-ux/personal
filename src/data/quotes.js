export const DAILY_QUOTES = [
  { text: "Every rep you do, every supplement you take, every meal you track — it all compounds. You are building the healthiest version of yourself.", author: "Health Command" },
  { text: "10 kg is not a number. It's energy for your students, presence for your fiancée, and decades of a healthier life.", author: "Health Command" },
  { text: "You manage finance for a firm, teach ACCA to professionals, and run HR. Managing your health is the highest-ROI investment of all.", author: "Health Command" },
  { text: "Discipline is not restriction — it's the freedom to perform at your best every single day.", author: "Health Command" },
  { text: "Your liver fights every day without you noticing. Milk Thistle is how you fight back for it.", author: "Health Command" },
  { text: "The 3 PM snack prevents the 6 PM crash that ruins the 7 PM meeting. Nutrition is strategy.", author: "Health Command" },
  { text: "Sleep is not lost time. It is when your fat actually burns and your muscles actually grow.", author: "Health Command" },
  { text: "Thursday is legs day. Not because it's easy — because the testosterone spike burns fat for 48 hours after.", author: "Health Command" },
  { text: "When you drink your 3L of water today, you are one of the most hydrated people in your city.", author: "Health Command" },
  { text: "83 kg is not the destination — it's the proof that you showed up consistently when it was hard.", author: "Health Command" },
  { text: "HBV does not define your future. Your daily choices do. Today is another day you protected your liver.", author: "Health Command" },
  { text: "Your fiancée deserves the most energetic, healthy version of you. Every healthy choice is a love letter to your future.", author: "Health Command" },
  { text: "Stress is high, demands are many. But the man who sleeps 7 hours, eats clean, and trains hard handles it all better.", author: "Health Command" },
  { text: "You are 93 kg becoming 83 kg — but more importantly, you are someone who kept showing up.", author: "Health Command" },
  { text: "One week of consistency is greater than one day of perfection.", author: "Health Command" },
  { text: "The cooldown stretch takes 5 minutes. The injury from skipping it takes 5 weeks.", author: "Health Command" },
  { text: "Protein at every meal is not optional. Muscle is the engine that burns your fat.", author: "Health Command" },
  { text: "The energy drink you didn't drink today preserved 200–300 kcal AND protected your liver. Double win.", author: "Health Command" },
  { text: "Teaching ACCA while cutting weight while managing a firm — if you can do all that, you can do anything.", author: "Health Command" },
  { text: "The scale doesn't define your day. Your habits do. Trust the process.", author: "Health Command" },
  { text: "You started at 93. Every Saturday morning weigh-in is a reminder of how far you've come.", author: "Health Command" },
  { text: "Water is not boring. It's the medium in which every biochemical reaction in your body takes place.", author: "Health Command" },
  { text: "Meal prep on Saturday protects 3 days of your nutrition. That's 80% of fat loss.", author: "Health Command" },
  { text: "Strong legs are the foundation of a strong body. Thursday never lies.", author: "Health Command" },
  { text: "Your headaches decrease with hydration, sleep, and magnesium. Today, you're addressing all three.", author: "Health Command" },
  { text: "Each checkbox you tick today is a vote for who you are becoming.", author: "Health Command" },
  { text: "The gym leaves your body 45 minutes later. The discipline stays forever.", author: "Health Command" },
  { text: "Kabul 6:47 AM — the city is waking up. You are already going to the gym.", author: "Health Command" },
  { text: "Family history of diabetes means this isn't vanity — it's prevention. You're protecting your future self.", author: "Health Command" },
  { text: "Progress is not linear. But consistency is. Keep going.", author: "Health Command" },
];

export function getTodayQuote() {
  const day = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kabul' });
  const dayOfYear = Math.floor((new Date(day) - new Date(new Date(day).getFullYear(), 0, 0)) / 86400000);
  return DAILY_QUOTES[dayOfYear % DAILY_QUOTES.length];
}
