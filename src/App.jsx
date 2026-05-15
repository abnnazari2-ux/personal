import React, { useState, useEffect } from 'react';
import NavBar from './components/NavBar';
import Dashboard from './components/Dashboard';
import TodaySchedule from './components/TodaySchedule';
import Workout from './components/Workout';
import NutritionLog from './components/NutritionLog';
import Progress from './components/Progress';
import Settings from './components/Settings';
import { getKabulDateKey, getKabulDayOfWeek } from './utils/time';
import { getUser, saveUser } from './utils/storage';

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [dateKey, setDateKey] = useState(getKabulDateKey());
  const [dayOfWeek, setDayOfWeek] = useState(getKabulDayOfWeek());
  const [user, setUser] = useState(getUser());

  // Update date/time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const newKey = getKabulDateKey();
      const newDay = getKabulDayOfWeek();
      setDateKey(newKey);
      setDayOfWeek(newDay);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  function updateUser(updates) {
    const updated = { ...user, ...updates };
    setUser(updated);
    saveUser(updated);
  }

  const commonProps = { dateKey, dayOfWeek, user, updateUser };

  return (
    <div className="min-h-screen" style={{ background: '#06080b', paddingBottom: 80 }}>
      {/* Top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between px-4 py-3"
        style={{ background: 'rgba(6,8,11,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #1a2235' }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: '#b8f53a', boxShadow: '0 0 6px #b8f53a' }} />
          <span style={{ fontFamily: 'Bebas Neue', fontSize: 18, color: '#f0f4f8', letterSpacing: 1 }}>
            BASIT'S HEALTH COMMAND
          </span>
        </div>
        <button
          onClick={() => setPage('settings')}
          className="w-9 h-9 flex items-center justify-center rounded-full"
          style={{ background: '#1a2235' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7a99" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
          </svg>
        </button>
      </div>

      {/* Page content */}
      <div className="max-w-lg mx-auto px-4 pt-4">
        {page === 'dashboard' && <Dashboard {...commonProps} onNav={setPage} />}
        {page === 'schedule' && <TodaySchedule {...commonProps} />}
        {page === 'workout' && <Workout {...commonProps} />}
        {page === 'nutrition' && <NutritionLog {...commonProps} />}
        {page === 'progress' && <Progress {...commonProps} />}
        {page === 'settings' && <Settings {...commonProps} onBack={() => setPage('dashboard')} />}
      </div>

      <NavBar active={page} onNav={setPage} />
    </div>
  );
}
