import React, { useState, useEffect, useRef } from 'react';
import { getTodayTasks, CATEGORIES, DAY_TYPES, getTasksForDay } from '../data/schedule';
import { toggleTask, isTaskCompleted, getDailyLog } from '../utils/storage';
import { getKabulMinutes, getKabulDateString, isOverdue, timeToMinutes } from '../utils/time';

const CATEGORY_COLORS = {
  morning: '#f59e0b',
  gym: '#b8f53a',
  breakfast: '#10b981',
  work: '#38b6ff',
  nutrition: '#2dd4bf',
  teaching: '#a78bfa',
  evening: '#818cf8',
  sleep: '#94a3b8',
};

function TaskItem({ task, dateKey, onToggle, currentMin }) {
  const [completed, setCompleted] = useState(isTaskCompleted(dateKey, task.id));
  const [justDone, setJustDone] = useState(false);
  const taskMin = timeToMinutes(task.time);
  const overdue = !completed && currentMin > taskMin + 30;

  useEffect(() => {
    setCompleted(isTaskCompleted(dateKey, task.id));
  }, [dateKey, task.id]);

  function handleToggle() {
    const newVal = toggleTask(dateKey, task.id);
    setCompleted(newVal);
    if (newVal) {
      setJustDone(true);
      setTimeout(() => setJustDone(false), 500);
    }
    onToggle && onToggle();
  }

  const color = CATEGORY_COLORS[task.category] || '#6b7a99';

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-xl transition-smooth ${justDone ? 'task-just-completed' : ''}`}
      style={{
        background: completed ? '#0a1a0a' : overdue ? '#1a0a00' : '#0c0f14',
        border: `1px solid ${completed ? '#b8f53a30' : overdue ? '#ff7b2c50' : '#1a2235'}`,
        opacity: completed ? 0.7 : 1,
      }}
    >
      {/* Checkbox */}
      <button
        onClick={handleToggle}
        className="flex-shrink-0 w-6 h-6 rounded-md mt-0.5 flex items-center justify-center transition-smooth"
        style={{
          border: `2px solid ${completed ? '#b8f53a' : overdue ? '#ff7b2c' : '#1a2235'}`,
          background: completed ? '#b8f53a' : 'transparent',
          minWidth: 24, minHeight: 24,
        }}
      >
        {completed && <span style={{ color: '#06080b', fontSize: 13, fontWeight: 900 }}>✓</span>}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span style={{ fontSize: 12, color, fontWeight: 700 }}>{task.time}</span>
          <span style={{ fontSize: 14 }}>{task.icon}</span>
          <span style={{
            fontSize: 14, fontWeight: 600,
            color: completed ? '#6b7a99' : '#f0f4f8',
            textDecoration: completed ? 'line-through' : 'none',
          }}>{task.title}</span>
          {task.critical && !completed && (
            <span style={{ fontSize: 9, background: overdue ? '#ff3b3b' : '#ff7b2c', color: '#fff', padding: '1px 6px', borderRadius: 10, fontWeight: 700 }}>
              {overdue ? 'OVERDUE' : 'CRITICAL'}
            </span>
          )}
          {overdue && !task.critical && (
            <span style={{ fontSize: 9, background: '#ff7b2c30', color: '#ff7b2c', padding: '1px 6px', borderRadius: 10, fontWeight: 600 }}>late</span>
          )}
        </div>
        {task.desc && !completed && (
          <div style={{ fontSize: 12, color: '#6b7a99', marginTop: 4, lineHeight: 1.5, whiteSpace: 'pre-line' }}>
            {task.desc}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TodaySchedule({ dateKey, dayOfWeek, user }) {
  const [tasks, setTasks] = useState(() => getTasksForDay(dayOfWeek));
  const [completedIds, setCompletedIds] = useState(() => getDailyLog(dateKey).tasksCompleted || []);
  const [currentMin, setCurrentMin] = useState(getKabulMinutes());
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'done'

  useEffect(() => {
    setTasks(getTasksForDay(dayOfWeek));
  }, [dayOfWeek]);

  useEffect(() => {
    setCompletedIds(getDailyLog(dateKey).tasksCompleted || []);
  }, [dateKey]);

  useEffect(() => {
    const t = setInterval(() => setCurrentMin(getKabulMinutes()), 60000);
    return () => clearInterval(t);
  }, []);

  function refreshCompleted() {
    setCompletedIds(getDailyLog(dateKey).tasksCompleted || []);
  }

  const completed = completedIds.length;
  const total = tasks.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  const filtered = tasks.filter(t => {
    if (filter === 'done') return completedIds.includes(t.id);
    if (filter === 'pending') return !completedIds.includes(t.id);
    return true;
  });

  // Group by category
  const grouped = {};
  filtered.forEach(t => {
    if (!grouped[t.category]) grouped[t.category] = [];
    grouped[t.category].push(t);
  });

  const categoryOrder = ['morning', 'gym', 'breakfast', 'work', 'nutrition', 'teaching', 'evening', 'sleep'];

  return (
    <div className="space-y-4 pb-4">
      {/* Header */}
      <div>
        <div style={{ fontSize: 22, fontFamily: 'Bebas Neue', color: '#f0f4f8' }}>TODAY'S SCHEDULE</div>
        <div style={{ fontSize: 13, color: '#6b7a99' }}>{getKabulDateString()}</div>
      </div>

      {/* Progress */}
      <div className="health-card">
        <div className="flex items-center justify-between mb-2">
          <span style={{ fontSize: 13, fontWeight: 700, color: '#f0f4f8' }}>{completed} of {total} tasks</span>
          <span style={{ fontSize: 18, fontFamily: 'Bebas Neue', color: '#b8f53a' }}>{pct}%</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: '#1a2235' }}>
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: pct === 100 ? '#b8f53a' : 'linear-gradient(90deg,#b8f53a,#2dd4bf)' }} />
        </div>
        {pct === 100 && (
          <div style={{ textAlign: 'center', marginTop: 8, fontSize: 13, color: '#b8f53a', fontWeight: 700 }}>
            🎉 Perfect day! All tasks complete!
          </div>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {[['all','All'], ['pending','Pending'], ['done','Done ✓']].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-smooth"
            style={{
              background: filter === val ? '#b8f53a' : '#0c0f14',
              color: filter === val ? '#06080b' : '#6b7a99',
              border: `1px solid ${filter === val ? '#b8f53a' : '#1a2235'}`,
            }}>
            {label}
          </button>
        ))}
      </div>

      {/* Tasks grouped by category */}
      {categoryOrder.map(cat => {
        const catTasks = grouped[cat];
        if (!catTasks || catTasks.length === 0) return null;
        const catInfo = CATEGORIES[cat];
        return (
          <div key={cat}>
            <div className="flex items-center gap-2 mb-2">
              <span style={{ fontSize: 14 }}>{catInfo?.icon}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: CATEGORY_COLORS[cat] || '#6b7a99', letterSpacing: 0.5, textTransform: 'uppercase' }}>
                {catInfo?.label || cat}
              </span>
            </div>
            <div className="space-y-2">
              {catTasks.map(task => (
                <TaskItem key={task.id} task={task} dateKey={dateKey}
                  currentMin={currentMin} onToggle={refreshCompleted} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
