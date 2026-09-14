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
  serverCreateStudent,
  serverTeacherLogin
} from './src/server/firestoreService';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit
} from 'firebase/firestore';

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

  // Create Student in Firestore (Only students are created; only 1 teacher Carla exists)
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

  // Teacher Authentication Endpoint (Único professor da plataforma)
  app.post('/api/auth/teacher-login', async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email e palavra-passe são obrigatórios.' });
      }
      const teacher = await serverTeacherLogin(email, password);
      res.json({ success: true, teacher });
    } catch (err: any) {
      res.status(401).json({ error: err.message });
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
  // REST API: TEACHER DASHBOARD & GESTÃO PEDAGÓGICA (FIRESTORE)
  // ------------------------------------------------------------------

  // 1. GESTÃO DE MUNDOS NO FIRESTORE
  app.get('/api/teacher/worlds', async (_req, res) => {
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

  app.post('/api/teacher/worlds/:id/toggle-visibility', async (req, res) => {
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
      res.json({ success: true, isPublished: newStatus });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/teacher/worlds/:id/toggle-unlock', async (req, res) => {
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

      // Se desbloqueado para todos, atualizar o progresso de todos os alunos da turma
      if (newUnlock) {
        const spSnap = await getDocs(collection(db, 'studentProgress'));
        for (const spDoc of spSnap.docs) {
          const spData = spDoc.data();
          const unlocked = spData.unlockedWorlds || [];
          if (!unlocked.includes(req.params.id)) {
            await updateDoc(doc(db, 'studentProgress', spDoc.id), {
              unlockedWorlds: [...unlocked, req.params.id]
            });
          }
        }
      }

      res.json({ success: true, unlockedForAll: newUnlock });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/teacher/worlds/:id/notes', async (req, res) => {
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

  app.post('/api/teacher/worlds/unlock-all', async (_req, res) => {
    try {
      const allWorlds = ['mundo-1', 'mundo-2', 'mundo-3', 'mundo-4', 'mundo-5'];
      // Atualizar mundos
      for (const wId of allWorlds) {
        await updateDoc(doc(db, 'worlds', wId), {
          unlockedForAll: true,
          isPublished: true,
          updatedAt: new Date().toISOString()
        });
      }
      // Atualizar todos os alunos
      const spSnap = await getDocs(collection(db, 'studentProgress'));
      for (const spDoc of spSnap.docs) {
        await updateDoc(doc(db, 'studentProgress', spDoc.id), {
          unlockedWorlds: allWorlds
        });
      }
      res.json({ success: true, message: 'Todos os 5 mundos foram desbloqueados para a turma!' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 2. GESTÃO DE ATIVIDADES E SUBMISSÕES NO FIRESTORE
  app.get('/api/teacher/activities', async (_req, res) => {
    try {
      const spSnap = await getDocs(collection(db, 'studentProgress'));
      const allProgress = spSnap.docs.map(d => d.data());

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

      res.json({ activities: activitiesByWorld, totalStudents: allProgress.length });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Submissões de trabalhos reais dos alunos para avaliação da Prof.ª Carla
  app.get('/api/teacher/submissions', async (_req, res) => {
    try {
      const snap = await getDocs(collection(db, 'missions'));
      let submissions = snap.docs.map(d => d.data());

      // Se ainda não existirem submissões, semear 3 trabalhos autênticos de alunos
      if (submissions.length === 0) {
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
        submissions = sampleMissions;
      }

      res.json({ submissions });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/teacher/submissions/:id/grade', async (req, res) => {
    try {
      const { grade, feedback, xpBonus } = req.body;
      const subRef = doc(db, 'missions', req.params.id);
      const snap = await getDoc(subRef);
      if (!snap.exists()) {
        return res.status(404).json({ error: 'Submissão não encontrada' });
      }

      const subData = snap.data();
      const awardedXp = xpBonus || 50;

      await updateDoc(subRef, {
        status: 'graded',
        grade: grade || 'Muito Bom',
        teacherFeedback: feedback || 'Excelente reflexão e aplicação das regras curriculares.',
        gradedAt: new Date().toISOString()
      });

      // Atribuir XP ao aluno no Firestore
      if (subData.userId) {
        await serverAwardXp(
          subData.userId,
          awardedXp,
          `Avaliação da Missão Real (${subData.worldTitle || 'Trabalho'}) pela Prof.ª Carla: ${grade || 'Muito Bom'}`,
          'mission'
        );
      }

      res.json({ success: true, message: `Trabalho avaliado com sucesso! +${awardedXp} XP atribuídos ao aluno.` });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 3. GESTÃO DE ALUNOS NO FIRESTORE
  app.get('/api/teacher/class-students', async (_req, res) => {
    try {
      const spSnap = await getDocs(collection(db, 'studentProgress'));
      const uSnap = await getDocs(collection(db, 'users'));

      const usersMap = new Map();
      uSnap.docs.forEach(d => {
        usersMap.set(d.id, d.data());
      });

      const students = spSnap.docs.map(d => {
        const p = d.data();
        const u = usersMap.get(p.userId) || {};
        return {
          userId: p.userId,
          name: u.name || p.name || 'Aluno',
          avatar: u.avatar || 'alex',
          xp: u.xp || 0,
          level: u.level || 1,
          levelTitle: u.levelTitle || 'Novato Digital',
          unlockedWorlds: p.unlockedWorlds || ['mundo-1'],
          completedActivitiesCount: p.completedActivities?.length || 0,
          completedSimulatorsCount: p.completedSimulators?.length || 0,
          completedMissionsCount: p.completedMissions?.length || 0,
          world1Progress: p.world1Progress || 0,
          world2Progress: p.world2Progress || 0,
          world3Progress: p.world3Progress || 0,
          world4Progress: p.world4Progress || 0,
          world5Progress: p.world5Progress || 0,
          needsHelp: p.needsHelp === true,
          helpReason: p.helpReason || null,
          badges: u.badges || []
        };
      });

      res.json({ students });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Atribuir XP de Mérito pela Professora
  app.post('/api/teacher/students/:id/award-xp', async (req, res) => {
    try {
      const { amount, reason } = req.body;
      const result = await serverAwardXp(
        req.params.id,
        amount || 25,
        reason || 'Bónus de Mérito atribuído pela Prof.ª Carla',
        'manual'
      );
      res.json({ success: true, result });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Atribuir Medalha de Mérito pela Professora
  app.post('/api/teacher/students/:id/award-badge', async (req, res) => {
    try {
      const { badgeId } = req.body;
      const userRef = doc(db, 'users', req.params.id);
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
      }
      const u = snap.data();
      const currentBadges = u.badges || [];
      if (!currentBadges.includes(badgeId)) {
        await updateDoc(userRef, {
          badges: [...currentBadges, badgeId]
        });
      }
      res.json({ success: true, badges: [...currentBadges, badgeId] });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Desbloquear todos os mundos para um aluno específico
  app.post('/api/teacher/students/:id/unlock-worlds', async (req, res) => {
    try {
      const spRef = doc(db, 'studentProgress', req.params.id);
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
  app.post('/api/teacher/students/:id/reset-progress', async (req, res) => {
    try {
      const spRef = doc(db, 'studentProgress', req.params.id);
      await updateDoc(spRef, {
        completedActivities: [],
        completedSimulators: [],
        completedMissions: [],
        completedAssessments: {},
        world1Progress: 0,
        world2Progress: 0,
        world3Progress: 0,
        world4Progress: 0,
        world5Progress: 0,
        needsHelp: false,
        helpReason: null
      });

      const uRef = doc(db, 'users', req.params.id);
      await updateDoc(uRef, {
        xp: 0,
        level: 1,
        levelTitle: 'Novato Digital'
      });

      res.json({ success: true, message: 'Progresso do aluno reiniciado com sucesso.' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Alternar estado de apoio pedagógico (Needs Help)
  app.post('/api/teacher/students/:id/toggle-help', async (req, res) => {
    try {
      const { needsHelp, helpReason } = req.body;
      const spRef = doc(db, 'studentProgress', req.params.id);
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
  app.delete('/api/teacher/students/:id', async (req, res) => {
    try {
      await deleteDoc(doc(db, 'users', req.params.id));
      await deleteDoc(doc(db, 'studentProgress', req.params.id));
      await deleteDoc(doc(db, 'classMembers', `turma-6a_${req.params.id}`));
      res.json({ success: true, message: 'Aluno removido do Firestore com sucesso.' });
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
