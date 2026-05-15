import React, { useState, useEffect, useRef } from 'react';
import { WORKOUTS } from '../data/workouts';
import { getWorkoutSets, toggleWorkoutSet, isTaskCompleted, toggleTask } from '../utils/storage';
import { DAY_TYPES } from '../data/schedule';

function RestTimer({ seconds, onDone }) {
  const [remaining, setRemaining] = useState(seconds);
  useEffect(() => {
    if (remaining <= 0) { onDone && onDone(); return; }
    const t = setTimeout(() => setRemaining(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining]);
  const pct = ((seconds - remaining) / seconds) * 100;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.85)' }}>
      <div className="health-card p-8 text-center" style={{ width: 240 }}>
        <div style={{ fontSize: 48, fontFamily: 'Bebas Neue', color: '#b8f53a' }}>{remaining}s</div>
        <div style={{ fontSize: 14, color: '#6b7a99', marginBottom: 16 }}>REST</div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: '#1a2235' }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: '#b8f53a' }} />
        </div>
        <button onClick={onDone} className="mt-4 px-6 py-2 rounded-lg text-sm font-bold"
          style={{ background: '#1a2235', color: '#6b7a99' }}>Skip</button>
      </div>
    </div>
  );
}

function parseRestSeconds(restStr) {
  if (!restStr || restStr === 'None' || restStr === 'Built in') return 0;
  const match = restStr.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

export default function Workout({ dateKey, dayOfWeek }) {
  const workout = WORKOUTS[dayOfWeek] || WORKOUTS[5];
  const [sets, setSets] = useState({});
  const [timer, setTimer] = useState(null); // { seconds, exerciseId }
  const [warmupDone, setWarmupDone] = useState(false);
  const [cooldownDone, setCooldownDone] = useState(false);

  useEffect(() => {
    setSets(getWorkoutSets(dateKey));
  }, [dateKey]);

  function handleSetToggle(exerciseId, setIdx, restStr) {
    const updated = toggleWorkoutSet(dateKey, exerciseId, setIdx);
    setSets(getWorkoutSets(dateKey));
    // Start rest timer when a set is completed (not uncompleted)
    if (updated.includes(setIdx)) {
      const secs = parseRestSeconds(restStr);
      if (secs > 0) setTimer({ seconds: secs, exerciseId });
    }
  }

  function getSetsCompleted(exerciseId, totalSets) {
    const done = sets[exerciseId] || [];
    return done.length;
  }

  if (dayOfWeek === 5) {
    return (
      <div className="space-y-4 pb-4">
        <div style={{ fontSize: 22, fontFamily: 'Bebas Neue', color: '#f0f4f8' }}>WORKOUT</div>
        <div className="health-card text-center py-8">
          <div style={{ fontSize: 48 }}>🕌</div>
          <div style={{ fontSize: 20, fontFamily: 'Bebas Neue', color: '#94a3b8', marginTop: 8 }}>REST DAY</div>
          <div style={{ fontSize: 13, color: '#6b7a99', marginTop: 8 }}>Friday is your weekly holiday.</div>
          <div style={{ fontSize: 13, color: '#6b7a99' }}>Stay hydrated. Take supplements. Recover.</div>
          <div style={{ fontSize: 13, color: '#b8f53a', marginTop: 16 }}>Tomorrow: Saturday Active Recovery</div>
          <div style={{ fontSize: 13, color: '#b8f53a' }}>Sunday: Push Day 💪</div>
        </div>
      </div>
    );
  }

  const totalExercises = workout.exercises.length;
  const completedExercises = workout.exercises.filter(ex =>
    (sets[ex.id] || []).length >= (ex.sets || 1)
  ).length;

  return (
    <div className="space-y-4 pb-4">
      {timer && (
        <RestTimer seconds={timer.seconds} onDone={() => setTimer(null)} />
      )}

      {/* Header */}
      <div>
        <div style={{ fontSize: 22, fontFamily: 'Bebas Neue', color: '#f0f4f8' }}>TODAY'S WORKOUT</div>
        <div style={{ fontSize: 14, color: '#6b7a99' }}>{DAY_TYPES[dayOfWeek]?.sub}</div>
      </div>

      {/* Workout overview */}
      <div className="health-card" style={{ borderColor: '#b8f53a30' }}>
        <div className="flex items-start justify-between">
          <div>
            <div style={{ fontSize: 24, fontFamily: 'Bebas Neue', color: '#b8f53a' }}>{workout.name}</div>
            <div style={{ fontSize: 13, color: '#f0f4f8' }}>{workout.muscles}</div>
            <div style={{ fontSize: 12, color: '#6b7a99', marginTop: 4 }}>
              🔥 {workout.calBurn} · ⏱️ {workout.duration}
            </div>
          </div>
          <div className="text-right">
            <div style={{ fontSize: 22, fontFamily: 'Bebas Neue', color: '#b8f53a' }}>
              {completedExercises}/{totalExercises}
            </div>
            <div style={{ fontSize: 10, color: '#6b7a99' }}>EXERCISES</div>
          </div>
        </div>
        {workout.motivation && (
          <div style={{ marginTop: 10, padding: '8px 12px', background: '#1a1a00', border: '1px solid #b8f53a30', borderRadius: 8, fontSize: 12, color: '#e2c000', lineHeight: 1.5 }}>
            {workout.motivation}
          </div>
        )}
        {workout.note && (
          <div style={{ marginTop: 10, padding: '8px 12px', background: '#1a0a00', border: '1px solid #ff7b2c30', borderRadius: 8, fontSize: 12, color: '#ff7b2c', lineHeight: 1.5 }}>
            {workout.note}
          </div>
        )}
      </div>

      {/* Warm-up */}
      <div className="health-card">
        <div className="flex items-center justify-between">
          <div>
            <div style={{ fontSize: 11, color: '#38b6ff', fontWeight: 700, letterSpacing: 1 }}>WARM-UP</div>
            <div style={{ fontSize: 13, color: '#f0f4f8', marginTop: 2 }}>{workout.warmup}</div>
          </div>
          <button onClick={() => setWarmupDone(d => !d)}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: warmupDone ? '#b8f53a' : '#1a2235', border: `1px solid ${warmupDone ? '#b8f53a' : '#1a2235'}` }}>
            {warmupDone ? <span style={{ color: '#06080b', fontWeight: 900, fontSize: 13 }}>✓</span> : <span style={{ color: '#6b7a99', fontSize: 13 }}>○</span>}
          </button>
        </div>
      </div>

      {/* Exercises */}
      {workout.exercises.map((ex, idx) => {
        const doneSets = sets[ex.id] || [];
        const numSets = ex.isTabata ? 1 : ex.sets;
        const allDone = doneSets.length >= numSets;
        return (
          <div key={ex.id} className="health-card" style={{ borderColor: allDone ? '#b8f53a30' : '#1a2235' }}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: 12, color: '#6b7a99', fontWeight: 700 }}>{idx + 1}</span>
                  {ex.primary && <span style={{ fontSize: 9, background: '#b8f53a', color: '#06080b', padding: '1px 6px', borderRadius: 10, fontWeight: 700 }}>KEY</span>}
                  <span style={{ fontSize: 14, fontWeight: 700, color: allDone ? '#b8f53a' : '#f0f4f8' }}>{ex.name}</span>
                </div>
                <div style={{ fontSize: 12, color: '#6b7a99', marginTop: 2 }}>
                  {ex.isTabata ? ex.reps : `${ex.sets} × ${ex.reps}`} · Rest: {ex.rest}
                </div>
                {ex.note && <div style={{ fontSize: 11, color: '#38b6ff', marginTop: 2 }}>{ex.note}</div>}
              </div>
              <div style={{ fontSize: 20, fontFamily: 'Bebas Neue', color: allDone ? '#b8f53a' : '#6b7a99', marginLeft: 8 }}>
                {doneSets.length}/{numSets}
              </div>
            </div>

            {/* Set buttons */}
            {!ex.isTabata && (
              <div className="flex gap-2 flex-wrap mt-2">
                {Array.from({ length: ex.sets }).map((_, si) => {
                  const done = doneSets.includes(si);
                  return (
                    <button key={si} onClick={() => handleSetToggle(ex.id, si, ex.rest)}
                      className="rounded-lg font-bold transition-smooth"
                      style={{
                        width: 44, height: 36, fontSize: 12,
                        background: done ? '#b8f53a' : '#1a2235',
                        color: done ? '#06080b' : '#6b7a99',
                        border: `1px solid ${done ? '#b8f53a' : '#1a2235'}`,
                      }}>
                      {done ? '✓' : `S${si + 1}`}
                    </button>
                  );
                })}
              </div>
            )}
            {ex.isTabata && (
              <button onClick={() => handleSetToggle(ex.id, 0, '')}
                className="w-full py-2 rounded-lg font-bold text-sm transition-smooth mt-2"
                style={{
                  background: doneSets.includes(0) ? '#b8f53a' : '#1a2235',
                  color: doneSets.includes(0) ? '#06080b' : '#6b7a99',
                  border: `1px solid ${doneSets.includes(0) ? '#b8f53a' : '#1a2235'}`,
                }}>
                {doneSets.includes(0) ? '✓ Block Complete' : 'Mark Block Complete'}
              </button>
            )}
          </div>
        );
      })}

      {/* Cooldown */}
      <div className="health-card" style={{ border: '1px solid #38b6ff30' }}>
        <div className="flex items-center justify-between">
          <div>
            <div style={{ fontSize: 11, color: '#38b6ff', fontWeight: 700, letterSpacing: 1 }}>COOLDOWN</div>
            <div style={{ fontSize: 13, color: '#f0f4f8', marginTop: 2 }}>{workout.cooldown}</div>
          </div>
          <button onClick={() => setCooldownDone(d => !d)}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: cooldownDone ? '#2dd4bf' : '#1a2235', border: `1px solid ${cooldownDone ? '#2dd4bf' : '#1a2235'}` }}>
            {cooldownDone ? <span style={{ color: '#06080b', fontWeight: 900, fontSize: 13 }}>✓</span> : <span style={{ color: '#6b7a99', fontSize: 13 }}>○</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
