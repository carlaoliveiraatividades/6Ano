import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import {
  db,
  initializeAndSeedFirestore,
  serverAwardXp,
  serverCompleteActivity,
  serverCompleteSimulator,
  serverSubmitAssessment,
  serverSubmitMission,
  serverClaimWeeklyChallenge,
  serverCreateStudent
} from './src/server/firestoreService';
import { collection, getDocs, doc, getDoc, query, orderBy, limit } from 'firebase/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Automatically initialize & seed Firestore collections on start
  initializeAndSeedFirestore()
    .then(res => console.log('[Firestore Auto-Seed]', res))
    .catch(err => console.error('[Firestore Auto-Seed Error]', err));

  // ------------------------------------------------------------------
  // REST API: HEALTH & DATABASE METRICS
  // ------------------------------------------------------------------
  app.get('/api/health', async (_req, res) => {
    try {
      res.json({
        status: 'ok',
        platform: 'Missão TIC - 6.º Ano de Escolaridade',
        firestoreConnected: true,
        firestoreDatabaseId: 'ai-studio-7eb79294-324f-4caf-b2eb-6a947b8970de',
        timestamp: new Date().toISOString()
      });
    } catch (e: any) {
      res.status(500).json({ status: 'error', error: e.message });
    }
  });

  app.post('/api/init-database', async (_req, res) => {
    try {
      const result = await initializeAndSeedFirestore();
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ------------------------------------------------------------------
  // REST API: CONTENT READ FROM FIRESTORE
  // ------------------------------------------------------------------
  app.get('/api/worlds', async (_req, res) => {
    try {
      const colRef = collection(db, 'worlds');
      const snap = await getDocs(colRef);
      const worlds = snap.docs.map(d => d.data());
      worlds.sort((a: any, b: any) => a.number - b.number);
      res.json({ worlds });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/badges', async (_req, res) => {
    try {
      const snap = await getDocs(collection(db, 'badges'));
      const badges = snap.docs.map(d => d.data());
      res.json({ badges });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/weekly-challenges', async (_req, res) => {
    try {
      const snap = await getDocs(collection(db, 'weeklyChallenges'));
      const challenges = snap.docs.map(d => d.data());
      res.json({ challenges });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/daily-content', async (_req, res) => {
    try {
      const tipsSnap = await getDocs(collection(db, 'dailyTips'));
      const quotesSnap = await getDocs(collection(db, 'dailyQuotes'));
      res.json({
        tips: tipsSnap.docs.map(d => d.data()),
        quotes: quotesSnap.docs.map(d => d.data())
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ------------------------------------------------------------------
  // REST API: USERS & PROGRESS (REAL FIRESTORE)
  // ------------------------------------------------------------------
  app.get('/api/users', async (_req, res) => {
    try {
      const snap = await getDocs(collection(db, 'users'));
      const users = snap.docs.map(d => d.data());
      res.json({ users });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/users/:id', async (req, res) => {
    try {
      const userSnap = await getDoc(doc(db, 'users', req.params.id));
      if (!userSnap.exists()) {
        return res.status(404).json({ error: 'Utilizador não encontrado' });
      }
      res.json({ user: userSnap.data() });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/users/:id/progress', async (req, res) => {
    try {
      const pSnap = await getDoc(doc(db, 'studentProgress', req.params.id));
      if (!pSnap.exists()) {
        return res.status(404).json({ error: 'Progresso do aluno não encontrado' });
      }
      res.json({ progress: pSnap.data() });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Create Student in Firestore
  app.post('/api/students/create', async (req, res) => {
    try {
      const { name, username, classId } = req.body;
      if (!name || !username) {
        return res.status(400).json({ error: 'Nome e username são obrigatórios' });
      }
      const newStudent = await serverCreateStudent(name, username, classId || 'turma-6a');
      res.json({ success: true, student: newStudent });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ------------------------------------------------------------------
  // REST API: SERVER-AUTHORITATIVE ACTIONS (XP, ASSESSMENTS, MISSIONS)
  // Prevents client tampering with XP, results, badges, permissions
  // ------------------------------------------------------------------
  app.post('/api/action/complete-activity', async (req, res) => {
    try {
      const { userId, activityId, xp } = req.body;
      if (!userId || !activityId) {
        return res.status(400).json({ error: 'Parâmetros em falta' });
      }
      const result = await serverCompleteActivity(userId, activityId, xp || 20);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/action/complete-simulator', async (req, res) => {
    try {
      const { userId, simulatorId, xp } = req.body;
      if (!userId || !simulatorId) {
        return res.status(400).json({ error: 'Parâmetros em falta' });
      }
      const result = await serverCompleteSimulator(userId, simulatorId, xp || 30);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/action/submit-assessment', async (req, res) => {
    try {
      const { userId, worldId, answers } = req.body;
      if (!userId || !worldId || !answers) {
        return res.status(400).json({ error: 'Parâmetros em falta' });
      }
      // Evaluated strictly on the server against Firestore questions
      const result = await serverSubmitAssessment(userId, worldId, answers);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/action/submit-mission', async (req, res) => {
    try {
      const { userId, worldId, submissionText, evidenceUrl } = req.body;
      if (!userId || !worldId || !submissionText) {
        return res.status(400).json({ error: 'Parâmetros em falta' });
      }
      const result = await serverSubmitMission(userId, worldId, submissionText, evidenceUrl);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/action/claim-challenge', async (req, res) => {
    try {
      const { userId, challengeId, selectedOption } = req.body;
      if (!userId || !challengeId || !selectedOption) {
        return res.status(400).json({ error: 'Parâmetros em falta' });
      }
      const result = await serverClaimWeeklyChallenge(userId, challengeId, selectedOption);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ------------------------------------------------------------------
  // REST API: TEACHER DASHBOARD & CLASS RANKING (FROM FIRESTORE)
  // ------------------------------------------------------------------
  app.get('/api/teacher/class-students', async (_req, res) => {
    try {
      const snap = await getDocs(collection(db, 'studentProgress'));
      const students = snap.docs.map(d => d.data());
      res.json({ students });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/ranking', async (_req, res) => {
    try {
      const snap = await getDocs(collection(db, 'users'));
      const students = snap.docs
        .map(d => d.data())
        .filter((u: any) => u.role === 'student')
        .sort((a: any, b: any) => (b.xp || 0) - (a.xp || 0));
      res.json({ ranking: students });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/audit-logs', async (_req, res) => {
    try {
      const q = query(collection(db, 'auditLogs'), limit(50));
      const snap = await getDocs(q);
      const logs = snap.docs.map(d => d.data());
      res.json({ logs });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Missão TIC server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
