import React, { useState, useEffect } from 'react';
import { SUPPLEMENTS, SUPPLEMENT_GROUPS } from '../data/supplements';
import { getDailyLog, saveDailyLog, getWaterGlasses, setWaterGlasses, isTaskCompleted, toggleTask } from '../utils/storage';

const MEALS = [
  { id: 'meal_preworkout', time: '6:05 AM', icon: '🍌', label: 'Pre-Workout Snack', kcal: '100–150', protein: '—', note: 'Banana OR soaked almonds', gymOnly: true },
  { id: 'meal_breakfast', time: '8:30 AM', icon: '🍳', label: 'Breakfast', kcal: '500–600', protein: '35–40g', note: '2 eggs + wholegrain + yogurt OR oats + milk + nuts' },
  { id: 'meal_snack1', time: '10:30 AM', icon: '🍎', label: 'Morning Snack', kcal: '150–200', protein: '~5g', note: '1 fruit + 8–10 nuts' },
  { id: 'meal_lunch', time: '12:00 PM', icon: '🥗', label: 'Lunch', kcal: '550–650', protein: '35–40g', note: '40% protein · 35% veg · 25% carbs' },
  { id: 'meal_preteaching', time: '3:00 PM', icon: '⚡', label: 'Pre-Teaching Snack', kcal: '250–300', protein: '15g+', note: 'Greek yogurt + fruit OR peanut butter on bread', critical: true },
  { id: 'meal_dinner', time: '7:00 PM', icon: '🍽️', label: 'Dinner', kcal: '450–550', protein: '30–35g', note: 'Grilled protein + salad + soup — LIGHT' },
];

const WATER_TARGET = 12; // glasses (12 × 250ml = 3L)

const WATER_CHECKPOINTS = [
  { glasses: 1.6, label: '6:00 AM', note: '400ml lemon water' },
  { glasses: 3.6, label: '7:15 AM', note: '500ml gym' },
  { glasses: 5.6, label: '11:30 AM', note: '500ml desk' },
  { glasses: 6.8, label: '12:00 PM', note: '300ml lunch' },
  { glasses: 8.4, label: '3:00 PM', note: '400ml pre-teaching' },
  { glasses: 9.6, label: '7:00 PM', note: '300ml dinner' },
  { glasses: 12, label: 'End of day', note: 'Total 3,000ml+' },
];

export default function NutritionLog({ dateKey, dayOfWeek }) {
  const [log, setLog] = useState(getDailyLog(dateKey));
  const [water, setWater] = useState(getWaterGlasses(dateKey));
  const [suppDone, setSuppDone] = useState({});
  const [energyDrinks, setEnergyDrinks] = useState(0);
  const [showEDWarning, setShowEDWarning] = useState(false);
  const [activeTab, setActiveTab] = useState('meals');

  useEffect(() => {
    const l = getDailyLog(dateKey);
    setLog(l);
    setWater(l.waterGlasses || 0);
    setEnergyDrinks(l.energyDrinks || 0);
    const suppState = {};
    SUPPLEMENTS.forEach(s => { suppState[s.id] = (l.tasksCompleted || []).includes(s.id); });
    setSuppDone(suppState);
  }, [dateKey]);

  function updateWater(val) {
    const newVal = Math.max(0, Math.min(WATER_TARGET + 4, val));
    setWater(newVal);
    setWaterGlasses(dateKey, newVal);
  }

  function toggleSupp(suppId) {
    toggleTask(dateKey, suppId);
    setSuppDone(prev => ({ ...prev, [suppId]: !prev[suppId] }));
  }

  function toggleMeal(mealId) {
    toggleTask(dateKey, mealId);
    setLog(getDailyLog(dateKey));
  }

  function isMealDone(mealId) {
    return (getDailyLog(dateKey).tasksCompleted || []).includes(mealId);
  }

  function handleEnergyDrink() {
    const newCount = energyDrinks + 1;
    setEnergyDrinks(newCount);
    saveDailyLog(dateKey, { energyDrinks: newCount });
    setShowEDWarning(true);
    setTimeout(() => setShowEDWarning(false), 8000);
  }

  const waterPct = Math.min(100, (water / WATER_TARGET) * 100);
  const totalKcal = MEALS.filter(m => isMealDone(m.id)).reduce((sum, m) => {
    const avg = m.kcal.includes('–') ? parseInt(m.kcal.split('–')[0]) + 50 : parseInt(m.kcal);
    return sum + (isNaN(avg) ? 0 : avg);
  }, 0);

  const gymDay = [0,1,2,3,4].includes(dayOfWeek);
  const meals = MEALS.filter(m => !m.gymOnly || gymDay);

  return (
    <div className="space-y-4 pb-4">
      <div style={{ fontSize: 22, fontFamily: 'Bebas Neue', color: '#f0f4f8' }}>NUTRITION & SUPPLEMENTS</div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[['meals','🥗 Meals'],['water','💧 Water'],['supplements','💊 Supps']].map(([tab, label]) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className="flex-1 py-2 rounded-lg text-xs font-bold transition-smooth"
            style={{
              background: activeTab === tab ? '#b8f53a' : '#0c0f14',
              color: activeTab === tab ? '#06080b' : '#6b7a99',
              border: `1px solid ${activeTab === tab ? '#b8f53a' : '#1a2235'}`,
            }}>{label}</button>
        ))}
      </div>

      {/* ─── MEALS TAB ─── */}
      {activeTab === 'meals' && (
        <div className="space-y-3">
          {/* Daily targets */}
          <div className="health-card" style={{ background: '#0a1628', border: '1px solid #1a3a60' }}>
            <div style={{ fontSize: 11, color: '#38b6ff', fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>DAILY TARGETS</div>
            <div className="grid grid-cols-2 gap-2">
              {[['2,200–2,300 kcal','Calories','#b8f53a'],['150–160g','Protein','#2dd4bf'],['200–220g','Carbs','#38b6ff'],['65–75g','Fats','#a78bfa']].map(([val, label, color]) => (
                <div key={label} style={{ background: '#0c0f14', padding: '8px 10px', borderRadius: 8, border: '1px solid #1a2235' }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color }}>{val}</div>
                  <div style={{ fontSize: 11, color: '#6b7a99' }}>{label}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12, color: '#6b7a99', marginTop: 8 }}>
              Est. logged today: ~{totalKcal} kcal from {meals.filter(m => isMealDone(m.id)).length} meals
            </div>
          </div>

          {meals.map(meal => {
            const done = isMealDone(meal.id);
            return (
              <div key={meal.id} className="health-card" style={{ borderColor: done ? '#b8f53a30' : meal.critical ? '#ff7b2c30' : '#1a2235', background: done ? '#0a1a0a' : '#0c0f14' }}>
                <div className="flex items-start gap-3">
                  <button onClick={() => toggleMeal(meal.id)}
                    className="flex-shrink-0 w-6 h-6 rounded-md mt-0.5 flex items-center justify-center"
                    style={{ background: done ? '#b8f53a' : 'transparent', border: `2px solid ${done ? '#b8f53a' : '#1a2235'}` }}>
                    {done && <span style={{ color: '#06080b', fontWeight: 900, fontSize: 12 }}>✓</span>}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: 16 }}>{meal.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: done ? '#6b7a99' : '#f0f4f8', textDecoration: done ? 'line-through' : 'none' }}>
                        {meal.label}
                      </span>
                      {meal.critical && !done && <span style={{ fontSize: 9, background: '#ff7b2c', color: '#fff', padding: '1px 6px', borderRadius: 10, fontWeight: 700 }}>CRITICAL</span>}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span style={{ fontSize: 11, color: '#b8f53a' }}>{meal.kcal} kcal</span>
                      {meal.protein !== '—' && <span style={{ fontSize: 11, color: '#2dd4bf' }}>{meal.protein} protein</span>}
                      <span style={{ fontSize: 11, color: '#6b7a99' }}>{meal.time}</span>
                    </div>
                    {!done && <div style={{ fontSize: 12, color: '#6b7a99', marginTop: 3 }}>{meal.note}</div>}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Rules */}
          <div className="health-card" style={{ background: '#0a0a00', border: '1px solid #ff7b2c20' }}>
            <div style={{ fontSize: 11, color: '#ff7b2c', fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>FAT LOSS RULES</div>
            {['✅ Protein at every meal','✅ Never skip breakfast','✅ No eating after 8 PM (regular nights)','✅ Very light dinner on meeting nights (Mon/Tue)','🚫 ZERO energy drinks — liver + 300 empty kcal','🚫 No heavy fried food at night','🚫 No refined white carbs at night'].map(r => (
              <div key={r} style={{ fontSize: 12, color: '#6b7a99', marginBottom: 3 }}>{r}</div>
            ))}
          </div>

          {/* Energy drink button */}
          <div className="health-card text-center">
            <div style={{ fontSize: 13, color: '#6b7a99', marginBottom: 8 }}>Did you drink an energy drink today?</div>
            <button onClick={handleEnergyDrink}
              className="px-6 py-2 rounded-lg font-bold text-sm"
              style={{ background: '#1a0000', border: '1px solid #ff3b3b', color: '#ff3b3b' }}>
              😔 Log Energy Drink {energyDrinks > 0 && `(${energyDrinks} today)`}
            </button>
            {showEDWarning && (
              <div style={{ marginTop: 12, padding: 12, background: '#1a0000', border: '1px solid #ff3b3b', borderRadius: 8, fontSize: 13, color: '#ff3b3b', textAlign: 'left' }}>
                ❌ Energy drinks damage your HBV liver and contain 150–300 empty calories that directly block fat loss. You are 93 kg trying to reach 83 kg. This drink is working against you.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── WATER TAB ─── */}
      {activeTab === 'water' && (
        <div className="space-y-4">
          {/* Visual water bottle */}
          <div className="health-card text-center">
            <div style={{ fontSize: 16, fontWeight: 700, color: '#38b6ff', marginBottom: 8 }}>
              💧 {(water * 250 / 1000).toFixed(2)}L / 3.0L
            </div>
            <div style={{ fontSize: 28, fontFamily: 'Bebas Neue', color: '#38b6ff' }}>{water}/12 glasses</div>

            {/* Water bottle visual */}
            <div className="relative mx-auto my-4" style={{ width: 80, height: 160 }}>
              <div className="absolute inset-0 rounded-xl overflow-hidden" style={{ border: '2px solid #38b6ff30', background: '#0c0f14' }}>
                <div className="absolute bottom-0 left-0 right-0 transition-all duration-700 rounded-b-xl"
                  style={{ height: `${waterPct}%`, background: 'linear-gradient(180deg,#38b6ff60,#38b6ff)' }} />
              </div>
              {waterPct >= 100 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span style={{ fontSize: 24 }}>✓</span>
                </div>
              )}
            </div>

            <div style={{ fontSize: 13, color: waterPct >= 100 ? '#b8f53a' : '#6b7a99' }}>
              {waterPct >= 100 ? '🎉 Daily goal reached! Great hydration.' : `${12 - water} more glasses to reach 3L goal`}
            </div>

            {/* +/- controls */}
            <div className="flex items-center justify-center gap-6 mt-4">
              <button onClick={() => updateWater(water - 1)}
                className="w-12 h-12 rounded-full text-2xl font-bold"
                style={{ background: '#1a2235', color: '#f0f4f8' }}>−</button>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#38b6ff', minWidth: 40, textAlign: 'center' }}>{water}</div>
              <button onClick={() => updateWater(water + 1)}
                className="w-12 h-12 rounded-full text-2xl font-bold"
                style={{ background: '#38b6ff', color: '#fff' }}>+</button>
            </div>
            <div style={{ fontSize: 11, color: '#6b7a99', marginTop: 8 }}>Each glass = 250ml</div>
          </div>

          {/* Glass grid */}
          <div className="health-card">
            <div style={{ fontSize: 11, color: '#6b7a99', fontWeight: 600, marginBottom: 12, letterSpacing: 1 }}>TAP TO LOG GLASSES</div>
            <div className="grid grid-cols-6 gap-2">
              {Array.from({ length: WATER_TARGET }).map((_, i) => (
                <button key={i} onClick={() => updateWater(i < water ? i : i + 1)}
                  className="rounded-xl flex items-center justify-center transition-smooth"
                  style={{ height: 44, fontSize: 20, background: i < water ? '#38b6ff20' : '#1a2235', border: `1px solid ${i < water ? '#38b6ff60' : '#1a2235'}` }}>
                  {i < water ? '💧' : '○'}
                </button>
              ))}
            </div>
          </div>

          {/* Checkpoints */}
          <div className="health-card">
            <div style={{ fontSize: 11, color: '#6b7a99', fontWeight: 600, marginBottom: 10, letterSpacing: 1 }}>DAILY CHECKPOINTS</div>
            {WATER_CHECKPOINTS.map((cp, idx) => {
              const reached = water >= cp.glasses;
              return (
                <div key={idx} className="flex items-center gap-3 mb-2">
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: reached ? '#38b6ff' : '#1a2235', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {reached && <span style={{ color: '#fff', fontSize: 11, fontWeight: 900 }}>✓</span>}
                  </div>
                  <div>
                    <span style={{ fontSize: 12, color: reached ? '#38b6ff' : '#6b7a99', fontWeight: 600 }}>{cp.label}</span>
                    <span style={{ fontSize: 11, color: '#6b7a99' }}> — {cp.note}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── SUPPLEMENTS TAB ─── */}
      {activeTab === 'supplements' && (
        <div className="space-y-4">
          {SUPPLEMENT_GROUPS.map(group => {
            const groupSupps = SUPPLEMENTS.filter(s => s.group === group.id);
            return (
              <div key={group.id}>
                <div className="flex items-center gap-2 mb-2">
                  <span style={{ fontSize: 14 }}>{group.icon}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#6b7a99', letterSpacing: 1, textTransform: 'uppercase' }}>{group.label}</span>
                  <span style={{ fontSize: 11, color: '#6b7a99' }}>· {group.time}</span>
                </div>
                <div className="space-y-2">
                  {groupSupps.map(supp => {
                    const done = suppDone[supp.id];
                    return (
                      <div key={supp.id} className="health-card" style={{ borderColor: done ? '#b8f53a30' : supp.critical ? '#ff3b3b30' : '#1a2235', background: done ? '#0a1a0a' : '#0c0f14' }}>
                        <div className="flex items-start gap-3">
                          <button onClick={() => toggleSupp(supp.id)}
                            className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center mt-0.5"
                            style={{ background: done ? '#b8f53a' : 'transparent', border: `2px solid ${done ? '#b8f53a' : supp.critical ? '#ff3b3b' : '#1a2235'}` }}>
                            {done && <span style={{ color: '#06080b', fontWeight: 900, fontSize: 13 }}>✓</span>}
                          </button>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span style={{ fontSize: 16 }}>{supp.icon}</span>
                              <span style={{ fontSize: 13, fontWeight: 700, color: done ? '#6b7a99' : '#f0f4f8', textDecoration: done ? 'line-through' : 'none' }}>
                                {supp.name}
                              </span>
                              <span style={{ fontSize: 12, color: '#a78bfa' }}>{supp.dose}</span>
                              {supp.critical && !done && <span style={{ fontSize: 9, background: '#ff3b3b', color: '#fff', padding: '1px 6px', borderRadius: 10, fontWeight: 700 }}>CRITICAL</span>}
                            </div>
                            <div style={{ fontSize: 11, color: '#6b7a99', marginTop: 2 }}>{supp.rule}</div>
                            {!done && <div style={{ fontSize: 11, color: '#38b6ff', marginTop: 3, lineHeight: 1.4 }}>{supp.why}</div>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
