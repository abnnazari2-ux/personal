import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { getWeightHistory, getStreaks, getUser, getWeeklyWeights } from '../utils/storage';
import { calcBMI, weeksToGoal, WEEK_DAYS_ORDERED, getDayLabel } from '../utils/time';
import { DAY_TYPES } from '../data/schedule';

const MONTHLY_MILESTONES = [
  { month: 'Month 1', target: 90.0, loss: -3.0, note: 'Water + early fat loss' },
  { month: 'Month 2', target: 87.5, loss: -2.5, note: 'Visible belly reduction' },
  { month: 'Month 3', target: 85.5, loss: -2.0, note: 'Clothes fitting differently' },
  { month: 'Month 4–5', target: 83.0, loss: -2.5, note: '✅ TARGET REACHED' },
];

export default function Progress({ user }) {
  const [weights, setWeights] = useState([]);
  const [streaks, setStreaks] = useState({ currentStreak: 0, bestStreak: 0 });

  useEffect(() => {
    const history = getWeightHistory();
    const u = getUser();
    // Ensure we have a start point
    const data = [];
    if (history.length === 0 || history[0]?.date > '2025-06-01') {
      data.push({ date: 'Start', weight: u.startWeight || 93, label: 'Start' });
    }
    history.forEach(h => {
      const d = new Date(h.date);
      data.push({ date: `${d.getMonth()+1}/${d.getDate()}`, weight: h.weight, label: `${d.getMonth()+1}/${d.getDate()}` });
    });
    setWeights(data);
    setStreaks(getStreaks());
  }, []);

  const current = user.currentWeight || 93;
  const start = user.startWeight || 93;
  const target = user.targetWeight || 83;
  const lost = (start - current).toFixed(1);
  const remaining = (current - target).toFixed(1);
  const weeks = weeksToGoal(current);
  const bmi = calcBMI(current);

  const chartData = weights.length > 0 ? weights : [
    { date: 'Start', weight: 93 },
    { date: 'Now', weight: current },
  ];

  return (
    <div className="space-y-4 pb-4">
      <div style={{ fontSize: 22, fontFamily: 'Bebas Neue', color: '#f0f4f8' }}>PROGRESS & JOURNEY</div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Lost So Far', value: `${lost} kg`, color: '#b8f53a', sub: 'of 10 kg total goal' },
          { label: 'Still To Go', value: `${remaining} kg`, color: '#ff7b2c', sub: `~${weeks} weeks at pace` },
          { label: 'Current BMI', value: bmi, color: calcBMI(current) < 27 ? '#2dd4bf' : '#38b6ff', sub: `${current} kg · 178 cm` },
          { label: 'Streak', value: `${streaks.currentStreak || 0} days`, color: '#a78bfa', sub: `Best: ${streaks.bestStreak || 0} days` },
        ].map(m => (
          <div key={m.label} className="health-card text-center">
            <div style={{ fontSize: 24, fontFamily: 'Bebas Neue', color: m.color }}>{m.value}</div>
            <div style={{ fontSize: 11, color: '#f0f4f8', fontWeight: 600 }}>{m.label}</div>
            <div style={{ fontSize: 10, color: '#6b7a99', marginTop: 2 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Weight chart */}
      <div className="health-card">
        <div style={{ fontSize: 12, color: '#6b7a99', fontWeight: 600, letterSpacing: 1, marginBottom: 12 }}>WEIGHT HISTORY</div>
        {chartData.length >= 2 ? (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2235" />
              <XAxis dataKey="date" tick={{ fill: '#6b7a99', fontSize: 11 }} />
              <YAxis domain={[80, 95]} tick={{ fill: '#6b7a99', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: '#0c0f14', border: '1px solid #1a2235', borderRadius: 8, color: '#f0f4f8' }}
                formatter={(val) => [`${val} kg`, 'Weight']}
              />
              <ReferenceLine y={83} stroke="#b8f53a" strokeDasharray="4 4" label={{ value: 'Goal', fill: '#b8f53a', fontSize: 11 }} />
              <ReferenceLine y={93} stroke="#ff3b3b" strokeDasharray="4 4" label={{ value: 'Start', fill: '#ff3b3b', fontSize: 11 }} />
              <Line type="monotone" dataKey="weight" stroke="#38b6ff" strokeWidth={2.5}
                dot={{ fill: '#38b6ff', strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: '#b8f53a' }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7a99', fontSize: 13 }}>
            Log weight every Saturday to build your chart
          </div>
        )}
      </div>

      {/* Monthly milestones */}
      <div className="health-card">
        <div style={{ fontSize: 12, color: '#6b7a99', fontWeight: 600, letterSpacing: 1, marginBottom: 12 }}>MONTHLY MILESTONES</div>
        {MONTHLY_MILESTONES.map((m, idx) => {
          const reached = current <= m.target + 0.1;
          return (
            <div key={idx} className="flex items-center gap-3 mb-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: reached ? '#b8f53a' : '#1a2235', border: `1px solid ${reached ? '#b8f53a' : '#1a2235'}` }}>
                {reached ? <span style={{ color: '#06080b', fontWeight: 900, fontSize: 13 }}>✓</span> : <span style={{ color: '#6b7a99', fontSize: 12 }}>{idx+1}</span>}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <span style={{ fontSize: 13, fontWeight: 600, color: reached ? '#b8f53a' : '#f0f4f8' }}>{m.month}: {m.target} kg</span>
                  <span style={{ fontSize: 12, color: '#2dd4bf' }}>{m.loss} kg</span>
                </div>
                <div style={{ fontSize: 11, color: '#6b7a99' }}>{m.note}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* BMI tracker */}
      <div className="health-card">
        <div style={{ fontSize: 12, color: '#6b7a99', fontWeight: 600, letterSpacing: 1, marginBottom: 12 }}>BMI TRACKER</div>
        <div className="relative h-6 rounded-full overflow-hidden" style={{ background: '#1a2235' }}>
          {/* BMI zones */}
          <div className="absolute top-0 bottom-0" style={{ left: '0%', width: '30%', background: '#38b6ff20' }} />
          <div className="absolute top-0 bottom-0" style={{ left: '30%', width: '35%', background: '#b8f53a20' }} />
          <div className="absolute top-0 bottom-0" style={{ left: '65%', width: '20%', background: '#ff7b2c20' }} />
          <div className="absolute top-0 bottom-0" style={{ left: '85%', width: '15%', background: '#ff3b3b20' }} />
          {/* Marker */}
          <div className="absolute top-0 bottom-0 flex items-center" style={{ left: `${Math.max(0, Math.min(95, (parseFloat(bmi) - 15) / 25 * 100))}%` }}>
            <div style={{ width: 4, height: 24, background: '#b8f53a', borderRadius: 2 }} />
          </div>
        </div>
        <div className="flex justify-between mt-2">
          {[['18.5','Underweight'],['25','Normal'],['30','Overweight'],['35','Obese']].map(([val,label]) => (
            <div key={val} className="text-center">
              <div style={{ fontSize: 10, color: '#6b7a99' }}>{val}</div>
              <div style={{ fontSize: 9, color: '#4a5568' }}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: parseFloat(bmi) < 27 ? '#b8f53a' : '#ff7b2c' }}>BMI {bmi}</span>
          <span style={{ fontSize: 12, color: '#6b7a99' }}> → Target BMI 26.2 at 83 kg</span>
        </div>
      </div>

      {/* Streaks & Stats */}
      <div className="health-card">
        <div style={{ fontSize: 12, color: '#6b7a99', fontWeight: 600, letterSpacing: 1, marginBottom: 12 }}>STREAKS</div>
        <div className="grid grid-cols-2 gap-3">
          <div style={{ background: '#1a2235', padding: '12px', borderRadius: 8, textAlign: 'center' }}>
            <div style={{ fontSize: 32, fontFamily: 'Bebas Neue', color: '#b8f53a' }}>{streaks.currentStreak || 0}</div>
            <div style={{ fontSize: 11, color: '#6b7a99' }}>Current Streak</div>
            {(streaks.currentStreak || 0) > 0 && <div className="streak-fire text-xl">🔥</div>}
          </div>
          <div style={{ background: '#1a2235', padding: '12px', borderRadius: 8, textAlign: 'center' }}>
            <div style={{ fontSize: 32, fontFamily: 'Bebas Neue', color: '#a78bfa' }}>{streaks.bestStreak || 0}</div>
            <div style={{ fontSize: 11, color: '#6b7a99' }}>Best Streak</div>
            <div style={{ fontSize: 18 }}>⭐</div>
          </div>
        </div>
      </div>
    </div>
  );
}
