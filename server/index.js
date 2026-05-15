require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');
const apiRoutes = require('./routes');
const scheduler = require('./scheduler');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api', apiRoutes);

// Serve React build in production
const distPath = path.join(__dirname, '../dist');
const fs = require('fs');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send(`
      <html><body style="background:#06080b;color:#b8f53a;font-family:Arial;padding:40px;text-align:center;">
        <h1>Basit's Health Command — Backend Running</h1>
        <p style="color:#6b7a99;">Run <code>npm run build</code> to build the React frontend, or <code>npm run dev</code> for development.</p>
        <p><a href="/api/ping" style="color:#38b6ff;">API Health Check →</a></p>
      </body></html>`);
  });
}

// Set up email sender for scheduler
function getTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return null;
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
}

async function sendEmail(subject, html) {
  const transporter = getTransporter();
  if (!transporter) {
    console.log(`[Email Skipped — no credentials] ${subject}`);
    return;
  }
  return transporter.sendMail({
    from: `"Basit's Health Command" <${process.env.EMAIL_USER}>`,
    to: process.env.RECIPIENT_EMAIL || process.env.EMAIL_USER,
    subject,
    html,
  });
}

app.listen(PORT, () => {
  console.log(`\n🟢 Basit's Health Command backend running on port ${PORT}`);
  console.log(`   API: http://localhost:${PORT}/api`);
  console.log(`   Ping: http://localhost:${PORT}/api/ping`);
  console.log(`   Timezone: Asia/Kabul (UTC+4:30)\n`);

  // Start email scheduler
  try {
    scheduler.init(sendEmail);
  } catch (err) {
    console.error('[Scheduler Init Error]', err.message);
  }
});
