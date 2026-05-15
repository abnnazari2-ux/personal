import React, { useState } from 'react';
import { getUser, saveUser } from '../utils/storage';

export default function Settings({ user, updateUser, onBack }) {
  const [email, setEmail] = useState(user.email || '');
  const [currentWeight, setCurrentWeight] = useState(user.currentWeight || 93);
  const [saved, setSaved] = useState(false);
  const [testStatus, setTestStatus] = useState('');
  const [sending, setSending] = useState(false);
  const [emailType, setEmailType] = useState('morning');

  function handleSave() {
    updateUser({ email, currentWeight: parseFloat(currentWeight) });
    // Also update server settings
    fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, currentWeight: parseFloat(currentWeight) }),
    }).catch(() => {});
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  async function sendTestEmail() {
    setSending(true);
    setTestStatus('');
    try {
      const res = await fetch('/api/send-test-email', { method: 'POST' });
      const data = await res.json();
      if (data.ok) setTestStatus('✅ ' + data.message);
      else setTestStatus('❌ ' + data.error);
    } catch (e) {
      setTestStatus('❌ Could not reach server. Make sure backend is running.');
    }
    setSending(false);
  }

  async function sendEmail(type) {
    setSending(true);
    setTestStatus('');
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      const data = await res.json();
      if (data.ok) setTestStatus('✅ Sent: ' + data.subject);
      else setTestStatus('❌ ' + data.error);
    } catch (e) {
      setTestStatus('❌ Server error');
    }
    setSending(false);
  }

  const EMAIL_TYPES = [
    { value: 'morning', label: '🌅 Morning Email' },
    { value: 'breakfast_supp', label: '💊 Breakfast Supplements' },
    { value: 'morning_snack', label: '🍎 Morning Snack' },
    { value: 'lunch', label: '💧 Lunch + Zinc' },
    { value: 'critical_snack', label: '⚡ Critical 3PM Snack' },
    { value: 'pre_meeting', label: '🥤 Pre-Meeting Snack' },
    { value: 'post_meeting', label: '🍽️ Post-Meeting Dinner' },
    { value: 'eve_supps', label: '🌿 Evening Supplements' },
    { value: 'sleep', label: '😴 Sleep Reminder' },
    { value: 'weigh_in', label: '⚖️ Weekly Weigh-In' },
    { value: 'weekly_summary', label: '📊 Weekly Summary' },
  ];

  return (
    <div className="space-y-4 pb-4">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full"
          style={{ background: '#1a2235', color: '#6b7a99' }}>←</button>
        <div style={{ fontSize: 22, fontFamily: 'Bebas Neue', color: '#f0f4f8' }}>SETTINGS</div>
      </div>

      {/* Profile */}
      <div className="health-card">
        <div style={{ fontSize: 11, color: '#6b7a99', fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>PROFILE</div>
        <div style={{ fontSize: 14, color: '#f0f4f8', marginBottom: 4 }}>Basit Nazari</div>
        <div style={{ fontSize: 12, color: '#6b7a99' }}>Head of Finance & Administration · ACCA Teacher</div>
        <div style={{ fontSize: 12, color: '#6b7a99' }}>Alliance Associates · Kabul, Afghanistan</div>
        <div style={{ fontSize: 12, color: '#b8f53a', marginTop: 4 }}>Timezone: Asia/Kabul (UTC+4:30)</div>
      </div>

      {/* Email settings */}
      <div className="health-card">
        <div style={{ fontSize: 11, color: '#6b7a99', fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>EMAIL NOTIFICATIONS</div>
        <label style={{ fontSize: 12, color: '#6b7a99', display: 'block', marginBottom: 6 }}>Your Email Address</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
          placeholder="basit@example.com" />
        <div style={{ fontSize: 11, color: '#6b7a99', marginTop: 6 }}>
          Reminders are sent by the server at Kabul times. Requires backend running with EMAIL_USER and EMAIL_PASS in .env
        </div>
      </div>

      {/* Weight */}
      <div className="health-card">
        <div style={{ fontSize: 11, color: '#6b7a99', fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>WEIGHT TRACKING</div>
        <label style={{ fontSize: 12, color: '#6b7a99', display: 'block', marginBottom: 6 }}>Current Weight (kg)</label>
        <input type="number" value={currentWeight} step="0.1" min="50" max="200"
          onChange={e => setCurrentWeight(e.target.value)} />
        <div className="flex gap-3 mt-3 text-sm" style={{ color: '#6b7a99', fontSize: 12 }}>
          <span>Start: 93 kg</span><span>·</span>
          <span>Goal: 83 kg</span><span>·</span>
          <span>To go: {(parseFloat(currentWeight || 93) - 83).toFixed(1)} kg</span>
        </div>
      </div>

      {/* Save */}
      <button onClick={handleSave} className="w-full py-3 rounded-xl font-bold text-base"
        style={{ background: '#b8f53a', color: '#06080b' }}>
        {saved ? '✅ Saved!' : 'Save Settings'}
      </button>

      {/* Email tester */}
      <div className="health-card">
        <div style={{ fontSize: 11, color: '#6b7a99', fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>EMAIL TESTER</div>
        <div style={{ fontSize: 12, color: '#6b7a99', marginBottom: 8 }}>
          Use these buttons to preview and test each email. Requires backend + email credentials.
        </div>

        <button onClick={sendTestEmail} disabled={sending}
          className="w-full py-3 rounded-xl font-bold text-sm mb-3"
          style={{ background: '#1a3a60', color: '#38b6ff', border: '1px solid #38b6ff30' }}>
          {sending ? '⏳ Sending...' : '📧 Send Test Morning Email'}
        </button>

        <label style={{ fontSize: 12, color: '#6b7a99', display: 'block', marginBottom: 6 }}>Send specific email now:</label>
        <select value={emailType} onChange={e => setEmailType(e.target.value)} style={{ marginBottom: 8 }}>
          {EMAIL_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <button onClick={() => sendEmail(emailType)} disabled={sending}
          className="w-full py-2 rounded-xl font-bold text-sm"
          style={{ background: '#0c1a0a', color: '#b8f53a', border: '1px solid #b8f53a30' }}>
          {sending ? '⏳ Sending...' : `Send ${EMAIL_TYPES.find(t => t.value === emailType)?.label}`}
        </button>

        {testStatus && (
          <div style={{ marginTop: 10, padding: '10px 12px', background: '#0c0f14', border: '1px solid #1a2235', borderRadius: 8, fontSize: 12, color: testStatus.startsWith('✅') ? '#b8f53a' : '#ff3b3b' }}>
            {testStatus}
          </div>
        )}
      </div>

      {/* Setup instructions */}
      <div className="health-card" style={{ background: '#0a1628', border: '1px solid #1a3a60' }}>
        <div style={{ fontSize: 11, color: '#38b6ff', fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>SETUP GUIDE</div>
        {[
          '1. Copy .env.example to .env',
          '2. Fill in EMAIL_USER with your Gmail address',
          '3. Enable 2FA on Gmail → myaccount.google.com/apppasswords',
          '4. Generate App Password → paste as EMAIL_PASS',
          '5. Set RECIPIENT_EMAIL to where reminders should go',
          '6. Run: npm start (builds React + starts Express)',
          '7. On Replit: set env vars in Secrets tab',
          '8. Use UptimeRobot to ping /api/ping every 5 min to keep alive',
        ].map((step, i) => (
          <div key={i} style={{ fontSize: 12, color: '#6b7a99', marginBottom: 4, lineHeight: 1.5 }}>{step}</div>
        ))}
      </div>

      {/* App info */}
      <div className="health-card text-center">
        <div style={{ fontSize: 14, fontFamily: 'Bebas Neue', color: '#6b7a99' }}>BASIT'S HEALTH COMMAND</div>
        <div style={{ fontSize: 11, color: '#4a5568', marginTop: 4 }}>Alliance Associates · Kabul, Afghanistan</div>
        <div style={{ fontSize: 11, color: '#4a5568' }}>93 kg → 83 kg · 14–20 weeks</div>
        <div className="flex items-center justify-center gap-2 mt-3">
          <div className="w-2 h-2 rounded-full" style={{ background: '#b8f53a', boxShadow: '0 0 6px #b8f53a' }} />
          <span style={{ fontSize: 11, color: '#b8f53a' }}>Live</span>
        </div>
      </div>
    </div>
  );
}
