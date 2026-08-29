import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { authService } from './server/services/AuthService';
import { candidateProfileService } from './server/services/CandidateProfileService';
import { vacancyService } from './server/services/VacancyService';
import { searchRunService } from './server/services/SearchRunService';
import { paymentService } from './server/services/PaymentService';
import { adminService, notificationService, analyticsService } from './server/services/AdminAndAnalyticsServices';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '15mb' }));

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// 1. Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'MASHCOOL API', time: new Date().toISOString() });
});

// 2. Auth & Identities
app.get('/api/auth/me', (req, res) => {
  const userId = (req.headers['x-user-id'] as string) || 'usr-kamil-dadashov';
  const user = authService.getUserById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ user });
});

app.post('/api/auth/email-login', (req, res) => {
  const { email, name, locale } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });
  const result = authService.registerOrLoginWithEmail(email, name, locale);
  analyticsService.track({
    userId: result.user.id,
    eventName: result.isNew ? 'account_created' : 'user_login',
    origin: 'WEB',
    locale: result.user.preferredLocale,
  });
  res.json(result);
});

app.post('/api/auth/google-login', (req, res) => {
  const { email, name, googleId, avatarUrl } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });
  const result = authService.loginWithGoogle(email, name || 'Google User', googleId || `g-${Date.now()}`, avatarUrl);
  analyticsService.track({
    userId: result.user.id,
    eventName: 'google_login',
    origin: 'WEB',
    locale: result.user.preferredLocale,
  });
  res.json(result);
});

app.post('/api/auth/telegram-link', (req, res) => {
  const { userId, telegramId, telegramUsername } = req.body;
  if (!userId || !telegramId) return res.status(400).json({ error: 'userId and telegramId are required' });
  try {
    const user = authService.linkTelegramIdentity(userId, telegramId, telegramUsername || 'tg_user');
    analyticsService.track({
      userId: user.id,
      eventName: 'telegram_linked',
      origin: 'TELEGRAM',
      locale: user.preferredLocale,
    });
    res.json({ user });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/auth/connect-email', (req, res) => {
  const { userId, provider, email } = req.body;
  if (!userId || !email) return res.status(400).json({ error: 'userId and email are required' });
  const user = authService.connectEmailProvider(userId, provider || 'GMAIL', email);
  res.json({ user });
});

app.post('/api/auth/disconnect-email', (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId is required' });
  const user = authService.disconnectEmailProvider(userId);
  res.json({ user });
});

app.post('/api/auth/locale', (req, res) => {
  const { userId, locale } = req.body;
  if (!userId || !locale) return res.status(400).json({ error: 'userId and locale are required' });
  const user = authService.updatePreferredLocale(userId, locale);
  res.json({ user });
});

// 3. Profile & CV Documents
app.get('/api/profile', (req, res) => {
  const userId = (req.headers['x-user-id'] as string) || 'usr-kamil-dadashov';
  const profile = candidateProfileService.getProfile(userId);
  const preferences = candidateProfileService.getPreferences(userId);
  const documents = candidateProfileService.getDocuments(userId);
  res.json({ profile, preferences, documents });
});

app.put('/api/profile', (req, res) => {
  const userId = (req.headers['x-user-id'] as string) || 'usr-kamil-dadashov';
  const updated = candidateProfileService.saveProfile(userId, req.body);
  analyticsService.track({
    userId,
    eventName: 'profile_confirmed',
    origin: 'WEB',
    locale: 'az',
  });
  res.json({ profile: updated });
});

app.put('/api/profile/preferences', (req, res) => {
  const userId = (req.headers['x-user-id'] as string) || 'usr-kamil-dadashov';
  const updated = candidateProfileService.savePreferences(userId, req.body);
  analyticsService.track({
    userId,
    eventName: 'preferences_completed',
    origin: 'WEB',
    locale: 'az',
  });
  res.json({ preferences: updated });
});

app.post('/api/profile/upload-cv', async (req, res) => {
  const userId = (req.headers['x-user-id'] as string) || 'usr-kamil-dadashov';
  const { filename, rawText } = req.body;
  if (!filename || !rawText) {
    return res.status(400).json({ error: 'filename and rawText are required' });
  }

  analyticsService.track({
    userId,
    eventName: 'cv_uploaded',
    origin: 'WEB',
    locale: 'az',
  });

  try {
    const result = await candidateProfileService.parseCvDocument(userId, filename, rawText);
    analyticsService.track({
      userId,
      eventName: 'cv_parsed',
      origin: 'WEB',
      locale: 'az',
    });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Vacancy Database
app.get('/api/vacancies', (req, res) => {
  const vacancies = vacancyService.getAllVacancies();
  const sourcesHealth = vacancyService.getSourcesHealth();
  res.json({ vacancies, sourcesHealth, total: vacancies.length });
});

app.get('/api/vacancies/:id', (req, res) => {
  const vacancy = vacancyService.getVacancyById(req.params.id);
  if (!vacancy) return res.status(404).json({ error: 'Vacancy not found' });
  res.json({ vacancy });
});

// 5. Search Runs & AI Matching
app.post('/api/search/create', async (req, res) => {
  const userId = (req.headers['x-user-id'] as string) || 'usr-kamil-dadashov';
  const { packageType, origin } = req.body;
  try {
    const run = await searchRunService.createSearchRun(userId, packageType || 'JOB_LUCK', origin || 'WEB');
    analyticsService.track({
      userId,
      eventName: 'checkout_started',
      origin: origin || 'WEB',
      locale: 'az',
      package: packageType || 'JOB_LUCK',
    });
    res.json({ run });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/search/pay', async (req, res) => {
  const userId = (req.headers['x-user-id'] as string) || 'usr-kamil-dadashov';
  const { searchRunId, packageType } = req.body;
  try {
    const payment = await paymentService.createCheckout(userId, packageType);
    const completed = await paymentService.completePayment(payment.id);

    analyticsService.track({
      userId,
      eventName: 'payment_completed',
      origin: 'WEB',
      locale: 'az',
      package: packageType,
      metadata: { amount: completed.amount, currency: completed.currency },
    });

    res.json({ payment: completed });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/search/:id/execute', async (req, res) => {
  try {
    const run = await searchRunService.executeSearch(req.params.id);
    analyticsService.track({
      userId: run.userId,
      eventName: 'search_completed',
      origin: run.origin,
      locale: 'az',
      package: run.packageType,
      metadata: { scanned: run.vacanciesScanned, matched: run.vacanciesMatched },
    });
    res.json({ run });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/search/:id/dispatch', async (req, res) => {
  const { senderEmail, approvedMatchIds } = req.body;
  try {
    const apps = await searchRunService.dispatchApplications(req.params.id, senderEmail || 'candidate@gmail.com', approvedMatchIds);
    analyticsService.track({
      eventName: 'applications_sent',
      origin: 'WEB',
      locale: 'az',
      metadata: { count: apps.length },
    });
    res.json({ applications: apps });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/search/:id/update-letter', (req, res) => {
  const { matchId, newLetter } = req.body;
  try {
    const match = searchRunService.updateCoverLetter(req.params.id, matchId, newLetter);
    res.json({ match });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/search/:id/exclude-match', (req, res) => {
  const { matchId, isExcluded } = req.body;
  try {
    const match = searchRunService.excludeMatch(req.params.id, matchId, isExcluded);
    res.json({ match });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/search/runs', (req, res) => {
  const userId = (req.headers['x-user-id'] as string) || 'usr-kamil-dadashov';
  const runs = searchRunService.getUserSearchRuns(userId);
  res.json({ runs });
});

app.get('/api/search/run/:id', (req, res) => {
  const run = searchRunService.getSearchRunById(req.params.id);
  if (!run) return res.status(404).json({ error: 'Search run not found' });
  res.json({ run });
});

// 6. Applications & Replies
app.get('/api/applications', (req, res) => {
  const userId = (req.headers['x-user-id'] as string) || 'usr-kamil-dadashov';
  const applications = searchRunService.getUserApplications(userId);
  res.json({ applications });
});

app.post('/api/applications/:id/outcome', (req, res) => {
  const { outcome } = req.body;
  try {
    const app = searchRunService.updateManualOutcome(req.params.id, outcome);
    res.json({ application: app });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/applications/:id/simulate-reply', (req, res) => {
  const { replyType, text } = req.body;
  try {
    const updated = searchRunService.simulateEmployerReply(req.params.id, replyType, text);
    notificationService.addNotification(updated.userId, 'APPLICATION_REPLY_RECEIVED', {
      companyName: updated.vacancy.companyName,
      position: updated.vacancy.titleNormalized,
      replyType,
    });
    analyticsService.track({
      userId: updated.userId,
      eventName: replyType === 'INTERVIEW' ? 'interview_detected' : 'reply_received',
      origin: 'WEB',
      locale: 'az',
    });
    res.json({ application: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 7. Notifications
app.get('/api/notifications', (req, res) => {
  const userId = (req.headers['x-user-id'] as string) || 'usr-kamil-dadashov';
  const notifications = notificationService.getUserNotifications(userId);
  res.json({ notifications });
});

app.post('/api/notifications/:id/read', (req, res) => {
  notificationService.markRead(req.params.id);
  res.json({ success: true });
});

// 8. Admin & Source Health
app.get('/api/admin/metrics', (req, res) => {
  const metrics = adminService.getMetrics();
  res.json({ metrics });
});

app.post('/api/admin/sources/toggle', (req, res) => {
  const { sourceName, enabled } = req.body;
  const ok = vacancyService.toggleSource(sourceName, enabled);
  res.json({ success: ok, sources: vacancyService.getSourcesHealth() });
});

// 9. Telegram Webhook / Simulator endpoint
app.post('/api/telegram/webhook', async (req, res) => {
  const { telegramId, username, command, text } = req.body;
  const user = authService.getUserByTelegramId(telegramId) || authService.getUserById('usr-kamil-dadashov');
  
  if (!user) {
    return res.json({ text: 'Xoş gəlmisiniz! Zəhmət olmasa CV-nizi göndərin və ya mash.cool üzərindən daxil olun.' });
  }

  if (command === '/status') {
    const runs = searchRunService.getUserSearchRuns(user.id);
    const apps = searchRunService.getUserApplications(user.id);
    const replies = apps.filter(a => a.replyStatus !== 'PENDING').length;
    return res.json({
      text: `📊 *MASHCOOL Status*:\n• Göndərilən müraciətlər: ${apps.length}\n• Gələn cavablar: ${replies}\n• Son axtarış: ${runs[0]?.packageType || 'Yoxdur'}`
    });
  }

  if (command === '/search') {
    const run = await searchRunService.createSearchRun(user.id, 'JOB_LUCK', 'TELEGRAM');
    return res.json({
      text: `🚀 *Yeni Axtarış Yaradıldı* (JOB LUCK — 5 AZN).\n300 vakansiya skan edilməyə hazırdır. Təsdiqləmək üçün ödənişi tamamlayın.`,
      runId: run.id
    });
  }

  res.json({
    text: `Salam ${user.name}! @mashcoolbot aktivdir. Sayt və bot vahid baza ilə sinxronlaşdırılıb.`
  });
});

// ----------------------------------------------------
// VITE MIDDLEWARE & SERVER START
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    // Fallback for HTML serving in development
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        const indexPath = path.resolve(process.cwd(), 'index.html');
        if (fs.existsSync(indexPath)) {
          let template = fs.readFileSync(indexPath, 'utf-8');
          template = await vite.transformIndexHtml(url, template);
          res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
        } else {
          next();
        }
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MASHCOOL Core Engine running on http://localhost:${PORT}`);
  });
}

startServer();
