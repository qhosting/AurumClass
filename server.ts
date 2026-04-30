import express from 'express';
import { google } from 'googleapis';
import webpush from 'web-push';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import { prisma } from './src/lib/prisma.js';
import { redis } from './src/lib/redis.js';
import { comparePassword, generateToken, verifyToken } from './src/lib/auth.js';
import { getAuthUrl, oauth2Client, listClassroomCourses } from './src/lib/google.js';
import { generatePedagogicalContent } from './src/lib/gemini.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Web Push
webpush.setVapidDetails(
  'mailto:soporte@aurumclass.pro',
  process.env.VAPID_PUBLIC_KEY || '',
  process.env.VAPID_PRIVATE_KEY || ''
);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

  // API Routes
  app.get('/api/health', async (req, res) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.json({ 
        status: 'ok', 
        database: 'connected',
        timestamp: new Date().toISOString() 
      });
    } catch (error) {
      res.status(500).json({ status: 'error', database: 'disconnected' });
    }
  });

  app.get('/api/dashboard/stats', async (req, res) => {
    try {
      const [studentCount, teacherCount, courseCount] = await Promise.all([
        prisma.user.count({ where: { role: 'STUDENT' } }),
        prisma.user.count({ where: { role: 'TEACHER' } }),
        prisma.course.count(),
      ]);
      res.json({ students: studentCount, teachers: teacherCount, courses: courseCount });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  });

  // Basic Auth API
  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user || !user.password) {
        return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
      }

      const isValid = await comparePassword(password, user.password);
      if (!isValid) {
        return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
      }

      const token = generateToken({ id: user.id, email: user.email, role: user.role });
      
      res.cookie('token', token, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.json({ 
        success: true, 
        user: { id: user.id, role: user.role, name: user.name, email: user.email } 
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
  });

  app.get('/api/auth/me', async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ success: false });
    }

    const decoded: any = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ success: false });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user) {
        return res.status(401).json({ success: false });
      }

      res.json({ 
        success: true, 
        user: { id: user.id, role: user.role, name: user.name, email: user.email } 
      });
    } catch (error) {
      res.status(500).json({ success: false });
    }
  });

  app.get('/api/auth/google/url', (req, res) => {
    res.json({ url: getAuthUrl() });
  });

  app.get('/api/auth/google/callback', async (req, res) => {
    const { code } = req.query;
    
    try {
      const { tokens } = await oauth2Client.getToken(code as string);
      oauth2Client.setCredentials(tokens);

      const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
      const { data: userInfo } = await oauth2.userinfo.get();

      if (!userInfo.email) {
        return res.status(400).send('No email found in Google account');
      }

      // Find or create organization
      let org = await prisma.organization.findUnique({ where: { slug: 'aurum' } });
      if (!org) {
        org = await prisma.organization.create({
          data: { name: 'AurumClass Default', slug: 'aurum' }
        });
      }

      // Upsert user
      const user = await prisma.user.upsert({
        where: { email: userInfo.email },
        update: {
          googleRefreshToken: tokens.refresh_token || undefined,
          name: userInfo.name,
        },
        create: {
          email: userInfo.email,
          name: userInfo.name,
          role: 'STUDENT', // Default role
          organizationId: org.id,
          googleRefreshToken: tokens.refresh_token,
        },
      });

      const token = generateToken({ id: user.id, email: user.email, role: user.role });
      
      res.cookie('token', token, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 
      });

      // Redirect to app
      res.redirect('/?login=success');
    } catch (error) {
      console.error('Google Auth Error:', error);
      res.redirect('/?login=error');
    }
  });
  app.get('/api/courses', async (req, res) => {
    try {
      const courses = await prisma.course.findMany({
        include: { teacher: true }
      });
      res.json(courses);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch courses' });
    }
  });

  app.get('/api/google/courses', async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'No token' });

    const decoded: any = verifyToken(token);
    if (!decoded) return res.status(401).json({ error: 'Invalid token' });

    try {
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user || !user.googleRefreshToken) {
        return res.status(400).json({ error: 'No Google account linked' });
      }

      const courses = await listClassroomCourses(user.googleRefreshToken);
      res.json(courses);
    } catch (error) {
      console.error('Classroom Fetch Error:', error);
      res.status(500).json({ error: 'Failed to fetch Google courses' });
    }
  });

  app.get('/api/users', async (req, res) => {
    const { role } = req.query;
    try {
      const users = await prisma.user.findMany({
        where: role ? { role: role as any } : {},
        orderBy: { createdAt: 'desc' }
      });
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });

  app.post('/api/users', async (req, res) => {
    const { email, name, role, organizationId } = req.body;
    try {
      const user = await prisma.user.create({
        data: {
          email,
          name,
          role: role || 'STUDENT',
          organizationId: organizationId || (await prisma.organization.findFirst())?.id || '',
        }
      });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create user' });
    }
  });

  app.get('/api/events', async (req, res) => {
    try {
      const events = await prisma.systemEvent.findMany({
        orderBy: { date: 'desc' },
        take: 10
      });
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch events' });
    }
  });

  app.post('/api/ai/generate', async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    try {
      const content = await generatePedagogicalContent(prompt);
      res.json({ content });
    } catch (error: any) {
      console.error('AI Generation Error:', error);
      res.status(500).json({ error: error.message || 'Error generating content' });
    }
  });

  app.post('/api/notifications/subscribe', async (req, res) => {
    const { subscription } = req.body;
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'No token' });

    const decoded: any = verifyToken(token);
    if (!decoded) return res.status(401).json({ error: 'Invalid token' });

    try {
      await prisma.pushSubscription.upsert({
        where: { endpoint: subscription.endpoint },
        update: {
          userId: decoded.id,
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
        },
        create: {
          userId: decoded.id,
          endpoint: subscription.endpoint,
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
        }
      });
      res.status(201).json({ success: true });
    } catch (error) {
      console.error('Subscription Error:', error);
      res.status(500).json({ error: 'Failed to subscribe' });
    }
  });

  app.get('/api/notifications/key', (req, res) => {
    res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AurumClass Pro running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
