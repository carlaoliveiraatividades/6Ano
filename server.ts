import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
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
  serverCreateStudent,
  serverRegisterStudent,
  serverTeacherLogin,
  serverStudentLogin,
  serverCheckNicknameUnique,
  serverGenerateUniqueNickname,
  serverGetPublicRankings,
  serverGetTeacherClassStudents,
  ServerUser
} from './src/server/firestoreService';
import {
  createSession,
  getSession,
  invalidateSession,
  requireAuth,
  requireTeacher,
  requireStudent,
  verifyClassOwnership,
  verifyStudentBelongsToTeacher,
  createRateLimiter,
  extractSessionId,
  AuthenticatedRequest
} from './src/server/authSecurity';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middlewares
  app.use(express.json());
  app.use(cookieParser());

  // Rate limiters
  const authLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: 'Demasiadas tentativas de autenticação. Por favor aguarde 15 minutos.'
  });

  const actionLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    max: 120,
    message: 'Frequência de pedidos excedida. Aguarde alguns segundos.'
  });

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
        securityModel: 'Server-Authoritative RBAC (student & teacher only)',
        timestamp: new Date().toISOString()
      });
    } catch (e: any) {
      res.status(500).json({ status: 'error', error: e.message });
    }
  });

  app.post('/api/init-database', async (req, res) => {
    try {
      const force = req.query.force === 'true' || req.body?.force === true;
      const result = await initializeAndSeedFirestore(force);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ------------------------------------------------------------------
  // REST API: AUTHENTICATION & SESSIONS (SERVER-SIDE WITH HTTPONLY COOKIES)
  // ------------------------------------------------------------------

  // Teacher Login (Dynamic credentials lookup & scrypt verification)
  app.post('/api/auth/teacher-login', authLimiter, async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email / identificador e palavra-passe são obrigatórios.' });
      }

      const teacher = await serverTeacherLogin(email, password);

      // Create secure server session
      const session = createSession({
        id: teacher.id,
        username: teacher.username,
        name: teacher.name,
        role: 'teacher',
        classId: teacher.classId
      });

      // Set HttpOnly, SameSite cookie
      res.cookie('missao_tic_session', session.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 24h
      });

      res.json({
        success: true,
        teacher: {
          id: teacher.id,
          username: teacher.username,
          name: teacher.name,
          role: 'teacher',
          avatar: teacher.avatar,
          classId: teacher.classId,
          className: teacher.className,
          xp: teacher.xp,
          level: teacher.level,
          levelTitle: teacher.levelTitle,
          badges: teacher.badges
        },
        sessionId: session.id
      });
    } catch (err: any) {
      res.status(401).json({ error: err.message || 'Credenciais inválidas.' });
    }
  });

  // Generate unique random nickname
  app.get('/api/auth/generate-nickname', async (_req: Request, res: Response) => {
    try {
      const nickname = await serverGenerateUniqueNickname();
      res.json({ success: true, nickname });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Erro ao gerar nickname.' });
    }
  });

  // Check if nickname is unique
  app.post('/api/auth/check-nickname', async (req: Request, res: Response) => {
    try {
      const { nickname } = req.body;
      if (!nickname) {
        return res.status(400).json({ available: false, error: 'Nickname é obrigatório.' });
      }
      const result = await serverCheckNicknameUnique(nickname);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Erro ao verificar nickname.' });
    }
  });

  // Student Login (Accepts Email or Nickname + Password)
  app.post('/api/auth/student-login', authLimiter, async (req: Request, res: Response) => {
    try {
      const { identifier, password } = req.body;
      if (!identifier) {
        return res.status(400).json({ error: 'Email ou Nickname de aluno é obrigatório.' });
      }

      const student = await serverStudentLogin(identifier, password);

      const session = createSession({
        id: student.id,
        username: student.username,
        name: student.name,
        role: 'student',
        classId: student.classId
      });

      res.cookie('missao_tic_session', session.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000
      });

      res.json({
        success: true,
        user: {
          id: student.id,
          nickname: student.nickname || student.name,
          username: student.username,
          email: student.email,
          name: student.name,
          role: 'student',
          avatar: student.avatar,
          classId: student.classId,
          className: student.className,
          xp: student.xp,
          level: student.level,
          levelTitle: student.levelTitle,
          badges: student.badges
        },
        sessionId: session.id
      });
    } catch (err: any) {
      res.status(401).json({ error: err.message || 'Aluno não encontrado ou credenciais incorretas.' });
    }
  });

  // Student Self-Registration (Criar Conta de Aluno com Nome, Email, Palavra-passe, Turma, Nickname, Avatar)
  app.post('/api/auth/student-register', authLimiter, async (req: Request, res: Response) => {
    try {
      const { name, email, password, classId, className, nickname, avatar } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Nome real, email e palavra-passe são obrigatórios.' });
      }

      const newStudent = await serverRegisterStudent({
        name,
        email,
        password,
        classId: classId || 'turma-6a',
        className: className || '6.º A',
        nickname,
        avatar
      });

      const session = createSession({
        id: newStudent.id,
        username: newStudent.username,
        name: newStudent.name,
        role: 'student',
        classId: newStudent.classId
      });

      res.cookie('missao_tic_session', session.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000
      });

      res.json({
        success: true,
        user: {
          id: newStudent.id,
          nickname: newStudent.nickname,
          username: newStudent.username,
          email: newStudent.email,
          name: newStudent.name,
          role: 'student',
          avatar: newStudent.avatar,
          classId: newStudent.classId,
          className: newStudent.className,
          xp: newStudent.xp,
          level: newStudent.level,
          levelTitle: newStudent.levelTitle,
          badges: newStudent.badges
        },
        sessionId: session.id
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Erro ao criar conta de aluno.' });
    }
  });

  // Guest/Visitor Login (Página visível para visitantes explorarem)
  app.post('/api/auth/guest-login', authLimiter, async (_req: Request, res: Response) => {
    try {
      const guestId = `visitante-${Math.random().toString(36).substring(2, 7)}`;
      const guestUser: ServerUser = {
        id: guestId,
        username: 'visitante',
        nickname: 'Explorador Convidado',
        name: 'Explorador Convidado',
        role: 'student',
        avatar: 'alex',
        classId: 'visitantes',
        className: 'Visitante / Convidado',
        xp: 150,
        level: 1,
        levelTitle: 'Explorador Convidado',
        badges: ['badge-guardiao'],
        createdAt: new Date().toISOString()
      };

      const session = createSession({
        id: guestUser.id,
        username: guestUser.username,
        name: guestUser.name,
        role: 'student',
        classId: guestUser.classId
      });

      res.cookie('missao_tic_session', session.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 4 * 60 * 60 * 1000 // 4h
      });

      res.json({
        success: true,
        user: guestUser,
        sessionId: session.id,
        isGuest: true
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Erro ao entrar como visitante.' });
    }
  });

  // Check Current Authenticated Session
  app.get('/api/auth/me', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const sessionUser = req.user!;
      const userRef = doc(db, 'users', sessionUser.userId);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        return res.status(404).json({ error: 'Utilizador não encontrado.' });
      }

      const userData = snap.data() as ServerUser;
      res.json({
        user: {
          id: userData.id,
          username: userData.username,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          avatar: userData.avatar,
          classId: userData.classId,
          className: userData.className,
          xp: userData.xp,
          level: userData.level,
          levelTitle: userData.levelTitle,
          badges: userData.badges
        },
        session: {
          id: req.sessionId,
          role: sessionUser.role,
          expiresAt: sessionUser.expiresAt
        }
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Logout
  app.post('/api/auth/logout', async (req: AuthenticatedRequest, res: Response) => {
    try {
      const sessionId = extractSessionId(req);
      if (sessionId) {
        const session = getSession(sessionId);
        if (session) {
          await setDoc(doc(db, 'auditLogs', `log_${Date.now()}`), {
            id: `log_${Date.now()}`,
            timestamp: new Date().toISOString(),
            action: 'USER_LOGOUT',
            actorId: session.userId,
            details: `Utilizador ${session.name} (${session.role}) encerrou a sessão.`
          });
        }
        invalidateSession(sessionId);
      }
      res.clearCookie('missao_tic_session');
      res.json({ success: true, message: 'Sessão terminada.' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ------------------------------------------------------------------
  // REST API: CONTENT READ (PUBLIC/AUTHENTICATED)
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
  // REST API: USERS & PROGRESS & PUBLIC RANKINGS
  // ------------------------------------------------------------------
  // Public Rankings Endpoint (Returns Nicknames & Stats ONLY - No Private Real Names or Emails)
  app.get('/api/rankings', async (req: Request, res: Response) => {
    try {
      const classId = req.query.classId as string | undefined;
      const rankings = await serverGetPublicRankings(classId);
      res.json({ rankings });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Erro ao carregar ranking público.' });
    }
  });

  app.get('/api/users', async (_req, res) => {
    try {
      const snap = await getDocs(collection(db, 'users'));
      const users = snap.docs.map(d => {
        const u = d.data();
        return {
          id: u.id,
          username: u.username,
          name: u.name,
          role: u.role,
          avatar: u.avatar,
          classId: u.classId,
          className: u.className,
          xp: u.xp,
          level: u.level,
          levelTitle: u.levelTitle,
          badges: u.badges
        };
      });
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
      const u = userSnap.data();
      res.json({
        user: {
          id: u.id,
          username: u.username,
          name: u.name,
          role: u.role,
          avatar: u.avatar,
          classId: u.classId,
          className: u.className,
          xp: u.xp,
          level: u.level,
          levelTitle: u.levelTitle,
          badges: u.badges
        }
      });
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

  // ------------------------------------------------------------------
  // REST API: SERVER-AUTHORITATIVE ACTIONS (XP, ASSESSMENTS, MISSIONS)
  // Identity is taken EXCLUSIVELY from req.user (authenticated session).
  // Any req.body.xp or req.body.userId is strictly ignored.
  // ------------------------------------------------------------------
  app.post('/api/action/complete-activity', requireAuth, actionLimiter, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const actorUserId = req.user!.userId;
      const { activityId } = req.body;

      if (!activityId) {
        return res.status(400).json({ error: 'Identificador da atividade em falta.' });
      }

      // Calls server-authoritative method with canonical XP
      const result = await serverCompleteActivity(actorUserId, activityId);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/action/complete-simulator', requireAuth, actionLimiter, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const actorUserId = req.user!.userId;
      const { simulatorId } = req.body;

      if (!simulatorId) {
        return res.status(400).json({ error: 'Identificador do simulador em falta.' });
      }

      const result = await serverCompleteSimulator(actorUserId, simulatorId);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/action/submit-assessment', requireAuth, actionLimiter, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const actorUserId = req.user!.userId;
      const { worldId, answers } = req.body;

      if (!worldId || !answers || typeof answers !== 'object') {
        return res.status(400).json({ error: 'Dados da avaliação incompletos.' });
      }

      // Evaluated strictly on the server against Firestore questions
      const result = await serverSubmitAssessment(actorUserId, worldId, answers);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/action/submit-mission', requireAuth, actionLimiter, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const actorUserId = req.user!.userId;
      const { worldId, submissionText, evidenceUrl } = req.body;

      if (!worldId || !submissionText || submissionText.trim().length < 5) {
        return res.status(400).json({ error: 'O texto da submissão deve conter pelo menos 5 carateres.' });
      }

      const result = await serverSubmitMission(actorUserId, worldId, submissionText.trim(), evidenceUrl);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/action/claim-challenge', requireAuth, actionLimiter, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const actorUserId = req.user!.userId;
      const { challengeId, selectedOption } = req.body;

      if (!challengeId || !selectedOption) {
        return res.status(400).json({ error: 'Identificador do desafio ou opção em falta.' });
      }

      const result = await serverClaimWeeklyChallenge(actorUserId, challengeId, selectedOption);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ------------------------------------------------------------------
  // REST API: TEACHER DASHBOARD & PEDAGOGICAL MANAGEMENT
  // Protected with requireAuth + requireTeacher and Class Isolation
  // ------------------------------------------------------------------

  // 1. GESTÃO DE MUNDOS NO FIRESTORE
  app.get('/api/teacher/worlds', requireAuth, requireTeacher, async (_req: AuthenticatedRequest, res: Response) => {
    try {
      const snap = await getDocs(collection(db, 'worlds'));
      const worlds = snap.docs.map(d => {
        const data = d.data();
        return {
          ...data,
          isPublished: data.isPublished !== false,
          unlockedForAll: data.unlockedForAll === true,
          teacherNotes: data.teacherNotes || ''
        };
      });
      worlds.sort((a: any, b: any) => a.number - b.number);
      res.json({ worlds });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/teacher/worlds/:id/toggle-visibility', requireAuth, requireTeacher, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const worldRef = doc(db, 'worlds', req.params.id);
      const snap = await getDoc(worldRef);
      if (!snap.exists()) {
        return res.status(404).json({ error: 'Mundo não encontrado' });
      }
      const current = snap.data();
      const newStatus = current.isPublished === false ? true : false;
      await updateDoc(worldRef, {
        isPublished: newStatus,
        updatedAt: new Date().toISOString()
      });

      await setDoc(doc(db, 'auditLogs', `log_${Date.now()}`), {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: 'WORLD_VISIBILITY_TOGGLED',
        actorId: req.user!.userId,
        details: `Mundo ${req.params.id} visibilidade alterada para: ${newStatus ? 'Publicado' : 'Oculto'}.`
      });

      res.json({ success: true, isPublished: newStatus });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/teacher/worlds/:id/toggle-unlock', requireAuth, requireTeacher, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const worldRef = doc(db, 'worlds', req.params.id);
      const snap = await getDoc(worldRef);
      if (!snap.exists()) {
        return res.status(404).json({ error: 'Mundo não encontrado' });
      }
      const current = snap.data();
      const newUnlock = current.unlockedForAll ? false : true;
      await updateDoc(worldRef, {
        unlockedForAll: newUnlock,
        updatedAt: new Date().toISOString()
      });

      // Se desbloqueado para todos, atualizar alunos das turmas deste professor
      if (newUnlock) {
        const teacherClassStudents = await serverGetTeacherClassStudents(req.user!.userId);
        for (const s of teacherClassStudents) {
          const spRef = doc(db, 'studentProgress', s.userId);
          const spSnap = await getDoc(spRef);
          if (spSnap.exists()) {
            const unlocked = spSnap.data().unlockedWorlds || [];
            if (!unlocked.includes(req.params.id)) {
              await updateDoc(spRef, {
                unlockedWorlds: [...unlocked, req.params.id]
              });
            }
          }
        }
      }

      await setDoc(doc(db, 'auditLogs', `log_${Date.now()}`), {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: 'WORLD_UNLOCK_TOGGLED',
        actorId: req.user!.userId,
        details: `Mundo ${req.params.id} desbloqueio geral alterado para: ${newUnlock}.`
      });

      res.json({ success: true, unlockedForAll: newUnlock });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/teacher/worlds/:id/notes', requireAuth, requireTeacher, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { notes } = req.body;
      const worldRef = doc(db, 'worlds', req.params.id);
      await updateDoc(worldRef, {
        teacherNotes: notes || '',
        updatedAt: new Date().toISOString()
      });
      res.json({ success: true, notes });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/teacher/worlds/unlock-all', requireAuth, requireTeacher, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const allWorlds = ['mundo-1', 'mundo-2', 'mundo-3', 'mundo-4', 'mundo-5'];
      for (const wId of allWorlds) {
        await updateDoc(doc(db, 'worlds', wId), {
          unlockedForAll: true,
          isPublished: true,
          updatedAt: new Date().toISOString()
        });
      }

      const teacherStudents = await serverGetTeacherClassStudents(req.user!.userId);
      for (const s of teacherStudents) {
        await updateDoc(doc(db, 'studentProgress', s.userId), {
          unlockedWorlds: allWorlds
        });
      }

      await setDoc(doc(db, 'auditLogs', `log_${Date.now()}`), {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: 'ALL_WORLDS_UNLOCKED',
        actorId: req.user!.userId,
        details: `Todos os 5 mundos foram desbloqueados para as turmas do professor.`
      });

      res.json({ success: true, message: 'Todos os 5 mundos foram desbloqueados para a turma!' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 2. GESTÃO DE ATIVIDADES E SUBMISSÕES NO FIRESTORE
  app.get('/api/teacher/activities', requireAuth, requireTeacher, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const teacherStudents = await serverGetTeacherClassStudents(req.user!.userId);
      const studentIds = new Set(teacherStudents.map(s => s.userId));

      const spSnap = await getDocs(collection(db, 'studentProgress'));
      const allProgress = spSnap.docs
        .map(d => d.data())
        .filter((p: any) => studentIds.has(p.userId));

      const wSnap = await getDocs(collection(db, 'worlds'));
      const worlds = wSnap.docs.map(d => d.data());
      worlds.sort((a: any, b: any) => a.number - b.number);

      const activitiesByWorld = worlds.map((w: any) => {
        const sections = w.sections || {};
        const lessons = (sections.descobre || []).map((l: any, i: number) => {
          const actId = `${w.id}-lesson-${i + 1}`;
          const count = allProgress.filter(p => p.completedActivities?.includes(actId)).length;
          return { id: actId, title: l.title, type: 'descobre', completions: count };
        });

        const sims = (sections.experimenta || []).map((s: any) => {
          const count = allProgress.filter(p => p.completedSimulators?.includes(s.id)).length;
          return { id: s.id, title: s.title, type: 'simulador', xp: s.xpReward, completions: count };
        });

        const missionCount = allProgress.filter(p => p.completedMissions?.includes(w.id)).length;
        const testCount = allProgress.filter(p => p.completedAssessments?.[w.id] !== undefined).length;

        return {
          worldId: w.id,
          worldNumber: w.number,
          worldTitle: w.title,
          lessons,
          simulators: sims,
          mission: { id: `mission-${w.id}`, title: sections.cria?.title || 'Missão no Mundo Real', completions: missionCount },
          assessment: { id: `assessment-${w.id}`, title: sections.avaliacao?.title || 'Avaliação Sumativa', completions: testCount }
        };
      });

      res.json({ activities: activitiesByWorld, totalStudents: teacherStudents.length });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Submissões de trabalhos reais dos alunos para avaliação da Professora (filtrado pela turma do professor)
  app.get('/api/teacher/submissions', requireAuth, requireTeacher, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const teacherStudents = await serverGetTeacherClassStudents(req.user!.userId);
      const studentIds = new Set(teacherStudents.map(s => s.userId));

      const snap = await getDocs(collection(db, 'missions'));
      let submissions = snap.docs
        .map(d => d.data())
        .filter((m: any) => studentIds.has(m.userId));

      // Se ainda não existirem submissões, semear 3 trabalhos autênticos
      if (submissions.length === 0 && teacherStudents.length > 0) {
        const sampleMissions = [
          {
            id: 'sub_alex_m1',
            userId: 'aluno-alex',
            studentName: 'Alex Ramos',
            worldId: 'mundo-1',
            worldTitle: 'Mundo 1: Guardião Digital',
            missionTitle: 'Código de Segurança Digital Pessoal',
            submissionText: '1. Usar frases-passe com mais de 14 carateres. 2. Nunca partilhar passwords com colegas. 3. Ativar autenticação em dois passos. 4. Tapar a webcam quando não está a ser usada. 5. Desconfiar de ofertas e links suspeitos.',
            submittedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
            status: 'submitted',
            grade: null,
            teacherFeedback: null
          },
          {
            id: 'sub_leonor_m2',
            userId: 'aluno-leonor',
            studentName: 'Leonor Santos',
            worldId: 'mundo-2',
            worldTitle: 'Mundo 2: Detetive Digital',
            missionTitle: 'Kit de Sobrevivência do Detetive de Notícias Falsas',
            submissionText: 'Regras de verificação: 1. Fazer pesquisa de imagem inversa antes de partilhar. 2. Confirmar o autor e a data da notícia. 3. Comparar pelo menos em 3 jornais sérios portugueses.',
            submittedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
            status: 'submitted',
            grade: null,
            teacherFeedback: null
          },
          {
            id: 'sub_tiago_m3',
            userId: 'aluno-tiago',
            studentName: 'Tiago Ferreira',
            worldId: 'mundo-3',
            worldTitle: 'Mundo 3: Criador Digital',
            missionTitle: 'Carta de Comunicação e Netiqueta da Turma',
            submissionText: 'Proposta para os grupos de estudo: 1. Proibido usar maiúsculas para não parecer que estamos a gritar. 2. Respeitar as dúvidas dos colegas. 3. Não enviar mensagens no grupo depois das 21h.',
            submittedAt: new Date(Date.now() - 3600000 * 28).toISOString(),
            status: 'submitted',
            grade: null,
            teacherFeedback: null
          }
        ];

        for (const sm of sampleMissions) {
          await setDoc(doc(db, 'missions', sm.id), sm);
        }
        submissions = sampleMissions.filter(m => studentIds.has(m.userId));
      }

      res.json({ submissions });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/teacher/submissions/:id/grade', requireAuth, requireTeacher, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { grade, feedback, xpBonus } = req.body;
      const subRef = doc(db, 'missions', req.params.id);
      const snap = await getDoc(subRef);
      if (!snap.exists()) {
        return res.status(404).json({ error: 'Submissão não encontrada' });
      }

      const subData = snap.data();

      // Authorization verification: student must belong to teacher's class
      const belongs = await verifyStudentBelongsToTeacher(req.user!.userId, subData.userId);
      if (!belongs) {
        return res.status(403).json({ error: 'Não autorizado a avaliar trabalhos de alunos fora das suas turmas.' });
      }

      const awardedXp = Math.min(Math.max(Number(xpBonus) || 50, 10), 100);

      await updateDoc(subRef, {
        status: 'graded',
        grade: grade || 'Muito Bom',
        teacherFeedback: feedback || 'Excelente reflexão e aplicação das regras curriculares.',
        gradedAt: new Date().toISOString()
      });

      if (subData.userId) {
        await serverAwardXp(
          subData.userId,
          awardedXp,
          `Avaliação da Missão Real (${subData.worldTitle || 'Trabalho'}) pela Prof.ª Carla: ${grade || 'Muito Bom'}`,
          'mission'
        );
      }

      await setDoc(doc(db, 'auditLogs', `log_${Date.now()}`), {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: 'MISSION_GRADED',
        actorId: req.user!.userId,
        details: `Submissão ${req.params.id} do aluno ${subData.userId} avaliada com '${grade}' (+${awardedXp} XP).`
      });

      res.json({ success: true, message: `Trabalho avaliado com sucesso! +${awardedXp} XP atribuídos ao aluno.` });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 3. GESTÃO DE ALUNOS NO FIRESTORE
  app.get('/api/teacher/class-students', requireAuth, requireTeacher, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const students = await serverGetTeacherClassStudents(req.user!.userId);
      res.json({ students });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Create student under teacher's class
  app.post('/api/teacher/students/create', requireAuth, requireTeacher, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { name, username, classId } = req.body;
      if (!name || !username) {
        return res.status(400).json({ error: 'Nome e username são obrigatórios.' });
      }

      const targetClassId = classId || 'turma-6a';
      const isOwner = await verifyClassOwnership(req.user!.userId, targetClassId);
      if (!isOwner) {
        return res.status(403).json({ error: 'Não autorizado a criar alunos numa turma que não lhe pertence.' });
      }

      const newStudent = await serverCreateStudent(name.trim(), username.trim(), targetClassId);
      res.json({ success: true, student: newStudent });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Atribuir XP de Mérito pela Professora
  app.post('/api/teacher/students/:id/award-xp', requireAuth, requireTeacher, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const studentId = req.params.id;
      const { amount, reason } = req.body;

      const isTeacherOfStudent = await verifyStudentBelongsToTeacher(req.user!.userId, studentId);
      if (!isTeacherOfStudent) {
        return res.status(403).json({ error: 'Não autorizado a atribuir XP a alunos fora das suas turmas.' });
      }

      const xpAmount = Math.min(Math.max(Number(amount) || 25, 1), 200);
      const result = await serverAwardXp(
        studentId,
        xpAmount,
        reason || 'Bónus de Mérito atribuído pela Prof.ª Carla',
        'teacher_bonus'
      );
      res.json({ success: true, result });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Atribuir Medalha de Mérito pela Professora
  app.post('/api/teacher/students/:id/award-badge', requireAuth, requireTeacher, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const studentId = req.params.id;
      const { badgeId } = req.body;

      const isTeacherOfStudent = await verifyStudentBelongsToTeacher(req.user!.userId, studentId);
      if (!isTeacherOfStudent) {
        return res.status(403).json({ error: 'Não autorizado a atribuir medalhas a alunos fora das suas turmas.' });
      }

      const userRef = doc(db, 'users', studentId);
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        return res.status(404).json({ error: 'Aluno não encontrado.' });
      }

      const u = snap.data();
      const currentBadges = u.badges || [];
      if (!currentBadges.includes(badgeId)) {
        await updateDoc(userRef, {
          badges: [...currentBadges, badgeId]
        });

        await setDoc(doc(db, 'studentBadges', `sb_${studentId}_${badgeId}`), {
          id: `sb_${studentId}_${badgeId}`,
          userId: studentId,
          badgeId,
          unlockedAt: new Date().toISOString()
        });
      }

      res.json({ success: true, badges: [...currentBadges, badgeId] });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Desbloquear todos os mundos para um aluno específico
  app.post('/api/teacher/students/:id/unlock-worlds', requireAuth, requireTeacher, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const studentId = req.params.id;
      const isTeacherOfStudent = await verifyStudentBelongsToTeacher(req.user!.userId, studentId);
      if (!isTeacherOfStudent) {
        return res.status(403).json({ error: 'Não autorizado a desbloquear mundos para alunos fora das suas turmas.' });
      }

      const spRef = doc(db, 'studentProgress', studentId);
      const allWorlds = ['mundo-1', 'mundo-2', 'mundo-3', 'mundo-4', 'mundo-5'];
      await updateDoc(spRef, {
        unlockedWorlds: allWorlds
      });
      res.json({ success: true, unlockedWorlds: allWorlds });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Repor progresso de um aluno (Reset progress)
  app.post('/api/teacher/students/:id/reset-progress', requireAuth, requireTeacher, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const studentId = req.params.id;
      const isTeacherOfStudent = await verifyStudentBelongsToTeacher(req.user!.userId, studentId);
      if (!isTeacherOfStudent) {
        return res.status(403).json({ error: 'Não autorizado a reiniciar o progresso de alunos fora das suas turmas.' });
      }

      const spRef = doc(db, 'studentProgress', studentId);
      await updateDoc(spRef, {
        completedActivities: [],
        completedSimulators: [],
        completedMissions: [],
        completedAssessments: {},
        claimedWeeklyChallenges: [],
        world1Progress: 0,
        world2Progress: 0,
        world3Progress: 0,
        world4Progress: 0,
        world5Progress: 0,
        needsHelp: false,
        helpReason: null
      });

      const uRef = doc(db, 'users', studentId);
      await updateDoc(uRef, {
        xp: 0,
        level: 1,
        levelTitle: 'Novato Digital'
      });

      await setDoc(doc(db, 'auditLogs', `log_${Date.now()}`), {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: 'STUDENT_PROGRESS_RESET',
        actorId: req.user!.userId,
        details: `Progresso do aluno ${studentId} reiniciado pelo professor.`
      });

      res.json({ success: true, message: 'Progresso do aluno reiniciado com sucesso.' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Alternar estado de apoio pedagógico (Needs Help)
  app.post('/api/teacher/students/:id/toggle-help', requireAuth, requireTeacher, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const studentId = req.params.id;
      const isTeacherOfStudent = await verifyStudentBelongsToTeacher(req.user!.userId, studentId);
      if (!isTeacherOfStudent) {
        return res.status(403).json({ error: 'Não autorizado.' });
      }

      const { needsHelp, helpReason } = req.body;
      const spRef = doc(db, 'studentProgress', studentId);
      await updateDoc(spRef, {
        needsHelp: !!needsHelp,
        helpReason: helpReason || null
      });
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Eliminar aluno no Firestore
  app.delete('/api/teacher/students/:id', requireAuth, requireTeacher, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const studentId = req.params.id;
      const isTeacherOfStudent = await verifyStudentBelongsToTeacher(req.user!.userId, studentId);
      if (!isTeacherOfStudent) {
        return res.status(403).json({ error: 'Não autorizado a remover alunos fora das suas turmas.' });
      }

      const uRef = doc(db, 'users', studentId);
      const uSnap = await getDoc(uRef);
      const uData = uSnap.exists() ? uSnap.data() : null;

      await deleteDoc(doc(db, 'users', studentId));
      await deleteDoc(doc(db, 'studentProgress', studentId));
      if (uData?.classId) {
        await deleteDoc(doc(db, 'classMembers', `${uData.classId}_${studentId}`));
      }

      await setDoc(doc(db, 'auditLogs', `log_${Date.now()}`), {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: 'STUDENT_DELETED',
        actorId: req.user!.userId,
        details: `Aluno ${studentId} removido da plataforma pelo professor.`
      });

      res.json({ success: true, message: 'Aluno removido do Firestore com sucesso.' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Obter turmas do professor
  app.get('/api/teacher/classes', requireAuth, requireTeacher, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const classesQ = query(collection(db, 'classes'), where('teacherId', '==', req.user!.userId));
      const snap = await getDocs(classesQ);
      const classes = snap.docs.map(d => d.data());
      res.json({ classes });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Criar nova turma
  app.post('/api/teacher/classes/create', requireAuth, requireTeacher, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { name, schoolYear } = req.body;
      if (!name) {
        return res.status(400).json({ error: 'Nome da turma é obrigatório.' });
      }

      const classId = `turma-${name.toLowerCase().replace(/[^a-z0-9]/g, '')}_${Date.now().toString(36)}`;
      const newClass = {
        id: classId,
        name: name.trim(),
        schoolYear: schoolYear || '2026/2027',
        teacherId: req.user!.userId,
        rankingVisible: true,
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'classes', classId), newClass);

      await setDoc(doc(db, 'auditLogs', `log_${Date.now()}`), {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: 'CLASS_CREATED',
        actorId: req.user!.userId,
        details: `Nova turma ${name} criada pelo professor.`
      });

      res.json({ success: true, class: newClass });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Ranking geral
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

  // Audit Logs (Restricted to Teacher)
  app.get('/api/teacher/audit-logs', requireAuth, requireTeacher, async (_req: AuthenticatedRequest, res: Response) => {
    try {
      const q = query(collection(db, 'auditLogs'), limit(50));
      const snap = await getDocs(q);
      const logs = snap.docs.map(d => d.data());
      res.json({ logs });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Legacy route redirect/fallback
  app.get('/api/audit-logs', requireAuth, requireTeacher, async (_req: AuthenticatedRequest, res: Response) => {
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
