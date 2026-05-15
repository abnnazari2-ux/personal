import React, { useState, useEffect } from 'react';
import { getKabulTimeString, getKabulDateString, calcBMI, weeksToGoal } from '../utils/time';
import { getDailyLog, getUser, getStreaks, getWaterGlasses } from '../utils/storage';
import { DAY_TYPES } from '../data/schedule';
import { WORKOUTS } from '../data/workouts';
import { getTodayQuote } from '../data/quotes';

function ProgressRing({ value, max, size = 60, color, label, icon }) {
  const pct = Math.min(100, (value / max) * 100);
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1a2235" strokeWidth="4"/>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="4"
            strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round" className="progress-ring-circle"
            style={{ transform: 'rotate(-90deg)', transformOrigin: `${size/2}px ${size/2}px` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span style={{ fontSize: 18 }}>{icon}</span>
        </div>
      </div>
      <span style={{ fontSize: 10, color: '#6b7a99', fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: 11, color: pct >= 100 ? color : '#f0f4f8', fontWeight: 700 }}>
        {value}/{max}
      </span>
    </div>
  );
}

function WeightBar({ current, start = 93, target = 83 }) {
  const total = start - target;
  const done = start - current;
  const pct = Math.max(0, Math.min(100, (done / total) * 100));
  const remaining = (current - target).toFixed(1);

  return (
    <div className="health-card">
      <div className="flex justify-between items-center mb-2">
        <span style={{ fontSize: 12, color: '#6b7a99', fontWeight: 600 }}>WEIGHT JOURNEY</span>
        <span style={{ fontSize: 12, color: '#b8f53a', fontWeight: 700 }}>{remaining} kg to goal</span>
      </div>
      <div className="relative h-3 rounded-full overflow-hidden" style={{ background: '#1a2235' }}>
        <div className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #b8f53a, #2dd4bf)' }} />
      </div>
      <div className="flex justify-between mt-2">
        <div className="text-center">
          <div style={{ fontSize: 13, color: '#6b7a99' }}>Start</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#f0f4f8' }}>{start} kg</div>
        </div>
        <div className="text-center">
          <div style={{ fontSize: 13, color: '#b8f53a' }}>Now</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#b8f53a' }}>{current} kg</div>
          <div style={{ fontSize: 11, color: '#6b7a99' }}>BMI {calcBMI(current)}</div>
        </div>
        <div className="text-center">
          <div style={{ fontSize: 13, color: '#6b7a99' }}>Goal</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#2dd4bf' }}>{target} kg</div>
        </div>
      </div>
      <div style={{ fontSize: 11, color: '#6b7a99', marginTop: 8, textAlign: 'center' }}>
        Est. {weeksToGoal(current)} weeks at current rate · BMI target: 26.2 (Normal)
      </div>
    </div>
  );
}

export default function Dashboard({ dateKey, dayOfWeek, user, updateUser, onNav }) {
  const [time, setTime] = useState(getKabulTimeString());
  const [log, setLog] = useState(getDailyLog(dateKey));
  const [streaks, setStreaks] = useState(getStreaks());
  const quote = getTodayQuote();
  const dayInfo = DAY_TYPES[dayOfWeek];
  const workout = WORKOUTS[dayOfWeek];
  const isSaturday = dayOfWeek === 6;
  const [showWeighIn, setShowWeighIn] = useState(false);
  const [weightInput, setWeightInput] = useState(user.currentWeight || 93);

  useEffect(() => {
    const t = setInterval(() => setTime(getKabulTimeString()), 30000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    setLog(getDailyLog(dateKey));
    setStreaks(getStreaks());
  }, [dateKey]);

  const tasks = log.tasksCompleted || [];
  const waterGlasses = getWaterGlasses(dateKey);
  const supplementsTaken = [
    'probiotic', 'vitamin_d3', 'breakfast', 'lunch_zinc', 'eve_supps', 'eve_supps_mtg'
  ].filter(id => tasks.includes(id)).length;

  function handleLogWeight() {
    const { logWeight } = require('../utils/storage');
    logWeight(dateKey, weightInput);
    updateUser({ currentWeight: parseFloat(weightInput) });
    setShowWeighIn(false);
  }

  return (
    <div className="space-y-4 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div style={{ fontSize: 26, fontFamily: 'Bebas Neue', color: '#f0f4f8', letterSpacing: 1 }}>
            {getKabulDateString().split(',')[0]}
          </div>
          <div style={{ fontSize: 13, color: '#6b7a99' }}>{getKabulDateString().split(',').slice(1).join(',').trim()}</div>
        </div>
        <div style={{ fontSize: 28, fontFamily: 'Bebas Neue', color: '#b8f53a' }}>{time}</div>
      </div>

      {/* Day type badge + workout */}
      <div className="health-card">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`day-badge text-black`} style={{ background: '#b8f53a', fontSize: 10 }}>
                {workout?.badgeText || dayInfo?.label?.toUpperCase()}
              </span>
              {[1,2].includes(dayOfWeek) && (
                <span className="day-badge" style={{ background: '#ff7b2c', color: '#fff', fontSize: 10 }}>⚠️ MEETING 7PM</span>
              )}
            </div>
            <div style={{ fontSize: 20, fontFamily: 'Bebas Neue', color: '#f0f4f8' }}>{workout?.name || 'Rest Day'}</div>
            <div style={{ fontSize: 12, color: '#6b7a99' }}>{workout?.muscles || dayInfo?.sub}</div>
          </div>
          <button onClick={() => onNav('workout')} className="flex flex-col items-center gap-1 p-3 rounded-xl"
            style={{ background: '#1a2235' }}>
            <span style={{ fontSize: 24 }}>💪</span>
            <span style={{ fontSize: 10, color: '#b8f53a', fontWeight: 600 }}>VIEW</span>
          </button>
        </div>
        {workout?.calBurn && workout.calBurn !== '—' && (
          <div style={{ fontSize: 12, color: '#2dd4bf', marginTop: 8 }}>🔥 Est. {workout.calBurn} · {workout.duration}</div>
        )}
      </div>

      {/* Saturday weigh-in prompt */}
      {isSaturday && (
        <div className="health-card" style={{ border: '1px solid #b8f53a40', background: '#0c1a0a' }}>
          <div className="flex items-center justify-between">
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#b8f53a' }}>⚖️ Saturday Weigh-In</div>
              <div style={{ fontSize: 12, color: '#6b7a99' }}>Log your weight for accurate tracking</div>
            </div>
            <button onClick={() => setShowWeighIn(true)}
              className="px-4 py-2 rounded-lg font-bold text-sm"
              style={{ background: '#b8f53a', color: '#06080b' }}>
              Log Weight
            </button>
          </div>
          {showWeighIn && (
            <div className="mt-3 flex items-center gap-3">
              <input type="number" value={weightInput} step="0.1" min="50" max="200"
                onChange={e => setWeightInput(e.target.value)}
                className="flex-1" style={{ background: '#1a2235', border: '1px solid #b8f53a', color: '#f0f4f8', padding: '8px 12px', borderRadius: 8, fontSize: 16, outline: 'none' }}
                placeholder="kg" />
              <button onClick={handleLogWeight} className="px-4 py-2 rounded-lg font-bold"
                style={{ background: '#b8f53a', color: '#06080b' }}>Save</button>
              <button onClick={() => setShowWeighIn(false)} className="px-3 py-2 rounded-lg"
                style={{ background: '#1a2235', color: '#6b7a99' }}>✕</button>
            </div>
          )}
        </div>
      )}

      {/* Progress rings */}
      <div className="health-card">
        <div style={{ fontSize: 11, color: '#6b7a99', fontWeight: 600, marginBottom: 12, letterSpacing: 1 }}>TODAY'S COMPLETION</div>
        <div className="flex justify-around">
          <ProgressRing value={log.workoutCompleted ? 1 : (tasks.includes('arrive_gym') || tasks.includes('gym_cooldown') ? 1 : 0)} max={1}
            color="#b8f53a" label="Workout" icon="💪" size={68} />
          <ProgressRing value={supplementsTaken} max={4}
            color="#a78bfa" label="Supps" icon="💊" size={68} />
          <ProgressRing value={waterGlasses} max={12}
            color="#38b6ff" label="Water" icon="💧" size={68} />
          <ProgressRing value={tasks.includes('lunch_zinc') && tasks.includes('breakfast') ? 1 : 0} max={1}
            color="#2dd4bf" label="Meals" icon="🥗" size={68} />
        </div>
      </div>

      {/* Weight journey */}
      <WeightBar current={user.currentWeight || 93} start={93} target={83} />

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="health-card text-center">
          <div style={{ fontSize: 28, fontFamily: 'Bebas Neue', color: '#b8f53a' }}>
            {streaks.currentStreak || 0}
          </div>
          <div style={{ fontSize: 10, color: '#6b7a99', fontWeight: 600 }}>DAY STREAK</div>
          {streaks.currentStreak > 0 && <div className="streak-fire text-lg mt-1">🔥</div>}
        </div>
        <div className="health-card text-center">
          <div style={{ fontSize: 28, fontFamily: 'Bebas Neue', color: '#2dd4bf' }}>
            {((user.startWeight || 93) - (user.currentWeight || 93)).toFixed(1)}
          </div>
          <div style={{ fontSize: 10, color: '#6b7a99', fontWeight: 600 }}>KG LOST</div>
        </div>
        <div className="health-card text-center">
          <div style={{ fontSize: 28, fontFamily: 'Bebas Neue', color: '#38b6ff' }}>
            {waterGlasses}
          </div>
          <div style={{ fontSize: 10, color: '#6b7a99', fontWeight: 600 }}>GLASSES</div>
        </div>
      </div>

      {/* Today's schedule preview */}
      <button onClick={() => onNav('schedule')} className="w-full health-card flex items-center justify-between"
        style={{ border: '1px solid #1a3a60' }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#f0f4f8' }}>📋 Today's Schedule</div>
          <div style={{ fontSize: 12, color: '#6b7a99' }}>
            {tasks.length} tasks completed today
          </div>
        </div>
        <span style={{ color: '#b8f53a', fontSize: 20 }}>→</span>
      </button>

      {/* Supplement alert */}
      {!tasks.includes('breakfast') && (() => {
        const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kabul' }));
        const hour = now.getHours();
        return hour >= 9 && hour < 13;
      })() && (
        <div className="health-card" style={{ border: '1px solid #ff3b3b40', background: '#1a00000a' }}>
          <div style={{ color: '#ff3b3b', fontWeight: 700, fontSize: 13 }}>
            🌿 REMINDER: Milk Thistle not logged yet
          </div>
          <div style={{ color: '#6b7a99', fontSize: 12, marginTop: 4 }}>
            HBV liver protection — take with breakfast NOW
          </div>
        </div>
      )}

      {/* Quote */}
      <div className="quote-card rounded-xl p-4">
        <div style={{ fontSize: 13, color: '#b8f53a', fontWeight: 600, marginBottom: 6 }}>"</div>
        <div style={{ fontSize: 13, color: '#e2e8f0', lineHeight: 1.6 }}>{quote.text}</div>
        <div style={{ fontSize: 11, color: '#6b7a99', marginTop: 8 }}>— {quote.author}</div>
      </div>
    </div>
  );
}
