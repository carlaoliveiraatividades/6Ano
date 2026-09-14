import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  Firestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { WORLDS_DATA } from '../data/worldsData';
import { BADGES, LEVELS, getLevelForXp, DEMO_CLASS_STUDENTS } from '../data/initialData';
import { DAILY_TIPS, DAILY_QUOTES } from '../data/dailyContent';
import { WEEKLY_CHALLENGES } from '../data/weeklyChallenges';

// Initialize Firebase client in server environment
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db: Firestore = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Interfaces
export interface ServerUser {
  id: string;
  username: string;
  email?: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
  avatar: string;
  classId?: string;
  className?: string;
  xp: number;
  level: number;
  levelTitle: string;
  badges: string[];
  createdAt: string;
  isDemo?: boolean;
}

export interface ServerStudentProgress {
  userId: string;
  name: string;
  classId: string;
  unlockedWorlds: string[];
  completedActivities: string[];
  completedSimulators: string[];
  completedMissions: string[];
  completedAssessments: Record<string, number>; // worldId -> scorePercent
  claimedWeeklyChallenges: string[];
  world1Progress: number;
  world2Progress: number;
  world3Progress: number;
  world4Progress: number;
  world5Progress: number;
  grandMissionCompleted: boolean;
  needsHelp: boolean;
  helpReason?: string;
  lastActive: string;
}

export interface ServerXpTransaction {
  id: string;
  userId: string;
  amount: number;
  reason: string;
  source: 'activity' | 'simulator' | 'assessment' | 'mission' | 'weekly-challenge' | 'grand-mission' | 'manual';
  timestamp: string;
}

export interface ServerAuditLog {
  id: string;
  timestamp: string;
  action: string;
  actorId: string;
  details: string;
}

// ----------------------------------------------------
// SEEDING AND DATABASE INITIALIZATION
// ----------------------------------------------------
let isInitialized = false;

export async function initializeAndSeedFirestore() {
  if (isInitialized) return { status: 'already_initialized' };

  try {
    console.log('[Firestore] Checking collections and seeding initial data if necessary...');

    // 1. Seed WORLDS & ASSESSMENTS
    for (const world of WORLDS_DATA) {
      const worldRef = doc(db, 'worlds', world.id);
      const worldSnap = await getDoc(worldRef);

      if (!worldSnap.exists()) {
        await setDoc(worldRef, {
          id: world.id,
          number: world.number,
          title: world.title,
          theme: world.theme,
          icon: world.icon,
          color: world.color,
          bgGradient: world.bgGradient,
          description: world.description,
          summary: world.summary,
          activitiesCount: world.activitiesCount,
          badgeId: world.badgeId,
          badgeName: world.badgeName,
          badgeIcon: world.badgeIcon,
          sections: world.sections,
          isDemo: true,
          updatedAt: new Date().toISOString()
        });

        // Seed separate lesson docs
        for (let i = 0; i < world.sections.descobre.length; i++) {
          const sec = world.sections.descobre[i];
          const lessonId = `${world.id}-lesson-${i + 1}`;
          await setDoc(doc(db, 'lessons', lessonId), {
            id: lessonId,
            worldId: world.id,
            index: i,
            title: sec.title,
            content: sec.content,
            examples: sec.examples || null,
            importantNote: sec.importantNote || null,
            quickQuiz: sec.quickQuiz || null
          });
        }

        // Seed separate assessment definition doc with secure answers
        const assessmentRef = doc(db, 'assessments', `assessment-${world.id}`);
        await setDoc(assessmentRef, {
          id: `assessment-${world.id}`,
          worldId: world.id,
          title: world.sections.avaliacao.title,
          description: world.sections.avaliacao.description,
          passingScore: world.sections.avaliacao.passingScore,
          questions: world.sections.avaliacao.questions,
          xpReward: 100,
          badgeRewardId: world.badgeId
        });

        // Seed simulator metadata
        for (const sim of world.sections.experimenta) {
          await setDoc(doc(db, 'simulators', sim.id), {
            ...sim,
            worldId: world.id
          });
        }
      }
    }

    // 2. Seed BADGES
    for (const badge of BADGES) {
      const badgeRef = doc(db, 'badges', badge.id);
      const bSnap = await getDoc(badgeRef);
      if (!bSnap.exists()) {
        await setDoc(badgeRef, {
          ...badge,
          isDemo: true
        });
      }
    }

    // 3. Seed WEEKLY CHALLENGES
    for (const ch of WEEKLY_CHALLENGES) {
      const chRef = doc(db, 'weeklyChallenges', ch.id);
      const cSnap = await getDoc(chRef);
      if (!cSnap.exists()) {
        await setDoc(chRef, {
          ...ch,
          isDemo: true
        });
      }
    }

    // 4. Seed DAILY TIPS & QUOTES
    for (const tip of DAILY_TIPS) {
      const tipRef = doc(db, 'dailyTips', tip.id);
      const tSnap = await getDoc(tipRef);
      if (!tSnap.exists()) {
        await setDoc(tipRef, { ...tip, isDemo: true });
      }
    }

    for (const quote of DAILY_QUOTES) {
      const qRef = doc(db, 'dailyQuotes', quote.id);
      const qSnap = await getDoc(qRef);
      if (!qSnap.exists()) {
        await setDoc(qRef, { ...quote, isDemo: true });
      }
    }

    // 5. Seed CLASSES & CLASS MEMBERS
    const class6ARef = doc(db, 'classes', 'turma-6a');
    const class6ASnap = await getDoc(class6ARef);
    if (!class6ASnap.exists()) {
      await setDoc(class6ARef, {
        id: 'turma-6a',
        name: '6.º Ano — Turma A',
        code: 'TIC-6A-2026',
        teacherId: 'prof-carla',
        teacherName: 'Prof.ª Carla',
        teacherEmail: 'imaginebycarla2023@gmail.com',
        studentsCount: 8,
        rankingEnabled: true,
        createdAt: '2026-09-01T08:00:00Z',
        isDemo: true
      });
    }

    // 6. Seed USERS & STUDENT PROGRESS
    const demoUsers: ServerUser[] = [
      {
        id: 'aluno-alex',
        username: 'alex.silva',
        name: 'Alex Ramos',
        role: 'student',
        avatar: 'alex',
        classId: 'turma-6a',
        className: '6.º Ano — Turma A',
        xp: 320,
        level: 3,
        levelTitle: 'Explorador Digital',
        badges: ['badge-guardiao'],
        createdAt: '2026-09-05T10:00:00Z',
        isDemo: true
      },
      {
        id: 'prof-carla',
        email: 'imaginebycarla2023@gmail.com',
        username: 'imaginebycarla2023@gmail.com',
        name: 'Prof.ª Carla',
        role: 'teacher',
        avatar: 'teacher-helena',
        classId: 'turma-6a',
        className: '6.º Ano — Turma A',
        xp: 2500,
        level: 8,
        levelTitle: 'Mestre da Missão TIC',
        badges: ['badge-guardiao', 'badge-detetive', 'badge-criador', 'badge-engenheiro', 'badge-ia', 'badge-mestre'],
        createdAt: '2026-09-01T08:00:00Z',
        isDemo: true
      },
      {
        id: 'admin-1',
        username: 'admin.tic',
        name: 'Administrador TIC',
        role: 'admin',
        avatar: 'admin',
        xp: 5000,
        level: 8,
        levelTitle: 'Mestre da Missão TIC',
        badges: ['badge-guardiao', 'badge-detetive', 'badge-criador', 'badge-engenheiro', 'badge-ia', 'badge-mestre'],
        createdAt: '2026-09-01T08:00:00Z',
        isDemo: true
      }
    ];

    for (const u of demoUsers) {
      const uRef = doc(db, 'users', u.id);
      const uSnap = await getDoc(uRef);
      if (!uSnap.exists()) {
        await setDoc(uRef, u);
      }
    }

    // Seed class members
    for (const std of DEMO_CLASS_STUDENTS) {
      // User doc for classmate
      const sUserRef = doc(db, 'users', std.userId);
      const sUserSnap = await getDoc(sUserRef);
      if (!sUserSnap.exists()) {
        await setDoc(sUserRef, {
          id: std.userId,
          username: `${std.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.aluno`,
          name: std.name,
          role: 'student',
          avatar: std.avatar,
          classId: 'turma-6a',
          className: '6.º Ano — Turma A',
          xp: std.xp,
          level: std.level,
          levelTitle: std.levelTitle,
          badges: ['badge-guardiao'],
          createdAt: '2026-09-05T09:00:00Z',
          isDemo: true
        });
      }

      // ClassMember doc
      const cmRef = doc(db, 'classMembers', `turma-6a_${std.userId}`);
      await setDoc(cmRef, {
        id: `turma-6a_${std.userId}`,
        classId: 'turma-6a',
        userId: std.userId,
        role: 'student',
        joinedAt: '2026-09-01T08:00:00Z'
      });

      // StudentProgress doc
      const spRef = doc(db, 'studentProgress', std.userId);
      const spSnap = await getDoc(spRef);
      if (!spSnap.exists()) {
        await setDoc(spRef, {
          userId: std.userId,
          name: std.name,
          classId: 'turma-6a',
          unlockedWorlds: std.world1Progress >= 100 ? ['mundo-1', 'mundo-2', 'mundo-3'] : ['mundo-1', 'mundo-2'],
          completedActivities: ['desc-mundo-1-passwords', 'desc-mundo-1-phishing'],
          completedSimulators: ['sim-phishing'],
          completedMissions: [],
          completedAssessments: std.world1Progress >= 100 ? { 'mundo-1': 80 } : {},
          claimedWeeklyChallenges: ['desafio-semana-1'],
          world1Progress: std.world1Progress,
          world2Progress: std.world2Progress,
          world3Progress: std.world3Progress,
          world4Progress: std.world4Progress,
          world5Progress: std.world5Progress,
          grandMissionCompleted: std.grandMissionCompleted,
          needsHelp: std.needsHelp,
          helpReason: std.helpReason || null,
          lastActive: std.lastActive
        });
      }
    }

    // 7. Seed initial audit log & XP transaction
    const initialLogRef = doc(db, 'auditLogs', 'init-seed-log');
    await setDoc(initialLogRef, {
      id: 'init-seed-log',
      timestamp: new Date().toISOString(),
      action: 'PLATFORM_INITIALIZATION',
      actorId: 'system',
      details: 'Base de dados Firestore inicializada com os 5 Mundos curriculares, turmas e utilizadores de demonstração.'
    });

    isInitialized = true;
    console.log('[Firestore] Successfully initialized and seeded all Firestore collections!');
    return { status: 'success', initialized: true };
  } catch (error) {
    console.error('[Firestore] Error initializing and seeding:', error);
    throw error;
  }
}

// ----------------------------------------------------
// SERVER-SIDE AUTHORITATIVE USER & XP OPERATIONS
// ----------------------------------------------------

/**
 * Server-authoritative XP award function.
 * Calculates new level, logs transaction, and updates user profile and progress.
 */
export async function serverAwardXp(
  userId: string,
  amount: number,
  reason: string,
  source: ServerXpTransaction['source']
): Promise<{ newXp: number; newLevel: number; newLevelTitle: string; leveledUp: boolean }> {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    throw new Error(`Utilizador ${userId} não encontrado no Firestore.`);
  }

  const userData = userSnap.data() as ServerUser;
  const oldLevel = userData.level;
  const newXp = userData.xp + amount;
  const levelInfo = getLevelForXp(newXp);
  const leveledUp = levelInfo.level > oldLevel;

  // 1. Create XP transaction record
  const txId = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  await setDoc(doc(db, 'xpTransactions', txId), {
    id: txId,
    userId,
    amount,
    reason,
    source,
    timestamp: new Date().toISOString()
  });

  // 2. Update user doc
  await updateDoc(userRef, {
    xp: newXp,
    level: levelInfo.level,
    levelTitle: levelInfo.title,
    updatedAt: new Date().toISOString()
  });

  // 3. Log audit event
  await setDoc(doc(db, 'auditLogs', `log_${Date.now()}`), {
    id: `log_${Date.now()}`,
    timestamp: new Date().toISOString(),
    action: 'XP_AWARDED',
    actorId: userId,
    details: `Ganhou +${amount} XP (${reason}) via ${source}. Novo total: ${newXp} XP.`
  });

  return {
    newXp,
    newLevel: levelInfo.level,
    newLevelTitle: levelInfo.title,
    leveledUp
  };
}

/**
 * Server-authoritative Activity Completion
 */
export async function serverCompleteActivity(userId: string, activityId: string, customXp: number = 20) {
  const spRef = doc(db, 'studentProgress', userId);
  const spSnap = await getDoc(spRef);

  if (!spSnap.exists()) {
    throw new Error('Registo de progresso do aluno não encontrado.');
  }

  const progress = spSnap.data() as ServerStudentProgress;
  const alreadyCompleted = progress.completedActivities.includes(activityId);

  if (alreadyCompleted) {
    return {
      success: true,
      alreadyCompleted: true,
      message: 'Atividade já concluída anteriormente.',
      progress
    };
  }

  // Award XP
  const xpResult = await serverAwardXp(userId, customXp, `Conclusão de atividade: ${activityId}`, 'activity');

  // Update activities list and calculate progress
  const updatedActivities = [...progress.completedActivities, activityId];
  const newW1 = Math.min(100, Math.round((updatedActivities.length / 6) * 100));

  await updateDoc(spRef, {
    completedActivities: updatedActivities,
    world1Progress: newW1,
    lastActive: 'Agora'
  });

  return {
    success: true,
    alreadyCompleted: false,
    awardedXp: customXp,
    ...xpResult
  };
}

/**
 * Server-authoritative Simulator Completion
 */
export async function serverCompleteSimulator(userId: string, simId: string, customXp: number = 30) {
  const spRef = doc(db, 'studentProgress', userId);
  const spSnap = await getDoc(spRef);

  if (!spSnap.exists()) {
    throw new Error('Registo de progresso do aluno não encontrado.');
  }

  const progress = spSnap.data() as ServerStudentProgress;
  const alreadyDone = progress.completedSimulators.includes(simId);

  if (alreadyDone) {
    return {
      success: true,
      alreadyCompleted: true,
      message: 'Simulador já completado anteriormente.'
    };
  }

  const xpResult = await serverAwardXp(userId, customXp, `Simulador concluído: ${simId}`, 'simulator');

  await updateDoc(spRef, {
    completedSimulators: [...progress.completedSimulators, simId],
    lastActive: 'Agora'
  });

  return {
    success: true,
    alreadyCompleted: false,
    awardedXp: customXp,
    ...xpResult
  };
}

/**
 * Server-authoritative Assessment Submission & Grading
 * The client sends raw answers. The server compares against official Firestore answers,
 * calculates score, awards badges, and unlocks subsequent worlds.
 */
export async function serverSubmitAssessment(
  userId: string,
  worldId: string,
  submittedAnswers: Record<number, string>
) {
  // Fetch official assessment from Firestore
  const assessmentRef = doc(db, 'assessments', `assessment-${worldId}`);
  const aSnap = await getDoc(assessmentRef);

  if (!aSnap.exists()) {
    throw new Error(`Avaliação para ${worldId} não encontrada na base de dados.`);
  }

  const assessment = aSnap.data() as {
    questions: { question: string; correctAnswer: string; explanation: string }[];
    passingScore: number;
    badgeRewardId: string;
  };

  const totalQuestions = assessment.questions.length;
  let correctCount = 0;
  const questionFeedback: { questionIdx: number; correct: boolean; correctAnswer: string; explanation: string }[] = [];

  for (let i = 0; i < totalQuestions; i++) {
    const q = assessment.questions[i];
    const studentAns = submittedAnswers[i] || '';
    const isCorrect = studentAns.trim().toUpperCase() === q.correctAnswer.trim().toUpperCase();

    if (isCorrect) correctCount++;

    questionFeedback.push({
      questionIdx: i,
      correct: isCorrect,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation
    });
  }

  const scorePercent = Math.round((correctCount / totalQuestions) * 100);
  const passed = scorePercent >= (assessment.passingScore || 75);

  // 1. Record attempt in assessmentAttempts collection
  const attemptId = `att_${Date.now()}_${userId}`;
  await setDoc(doc(db, 'assessmentAttempts', attemptId), {
    id: attemptId,
    userId,
    worldId,
    scorePercent,
    correctCount,
    totalQuestions,
    passed,
    submittedAnswers,
    timestamp: new Date().toISOString()
  });

  // 2. Update Student Progress
  const spRef = doc(db, 'studentProgress', userId);
  const spSnap = await getDoc(spRef);
  let newlyUnlockedWorld: string | null = null;
  let awardedBadge: string | null = null;

  if (spSnap.exists()) {
    const pData = spSnap.data() as ServerStudentProgress;
    const currentCompleted = pData.completedAssessments || {};
    const bestScore = Math.max(currentCompleted[worldId] || 0, scorePercent);

    const updatedAssessments = {
      ...currentCompleted,
      [worldId]: bestScore
    };

    const unlocked = new Set(pData.unlockedWorlds || ['mundo-1']);

    if (passed) {
      // Unlock next world
      const worldNum = parseInt(worldId.replace('mundo-', ''), 10);
      if (worldNum < 5) {
        const nextWorldId = `mundo-${worldNum + 1}`;
        if (!unlocked.has(nextWorldId)) {
          unlocked.add(nextWorldId);
          newlyUnlockedWorld = nextWorldId;
        }
      }
    }

    await updateDoc(spRef, {
      completedAssessments: updatedAssessments,
      unlockedWorlds: Array.from(unlocked),
      lastActive: 'Agora'
    });
  }

  // 3. If passed, award XP and Badge
  let xpResult = null;
  if (passed) {
    xpResult = await serverAwardXp(userId, 100, `Avaliação oficial concluída com ${scorePercent}% (${worldId})`, 'assessment');

    // Award badge in user profile and studentBadges collection
    const userRef = doc(db, 'users', userId);
    const uSnap = await getDoc(userRef);
    if (uSnap.exists()) {
      const u = uSnap.data() as ServerUser;
      if (!u.badges.includes(assessment.badgeRewardId)) {
        await updateDoc(userRef, {
          badges: [...u.badges, assessment.badgeRewardId]
        });

        const sbId = `sb_${userId}_${assessment.badgeRewardId}`;
        await setDoc(doc(db, 'studentBadges', sbId), {
          id: sbId,
          userId,
          badgeId: assessment.badgeRewardId,
          unlockedAt: new Date().toISOString()
        });

        awardedBadge = assessment.badgeRewardId;
      }
    }
  }

  return {
    scorePercent,
    correctCount,
    totalQuestions,
    passed,
    passingScore: assessment.passingScore,
    questionFeedback,
    awardedBadge,
    newlyUnlockedWorld,
    xpResult
  };
}

/**
 * Server-authoritative Real Mission Submission
 */
export async function serverSubmitMission(
  userId: string,
  worldId: string,
  submissionText: string,
  evidenceUrl?: string
) {
  const missionId = `mission_${Date.now()}_${userId}`;
  await setDoc(doc(db, 'missions', missionId), {
    id: missionId,
    userId,
    worldId,
    submissionText,
    evidenceUrl: evidenceUrl || null,
    submittedAt: new Date().toISOString(),
    status: 'submitted',
    teacherFeedback: null,
    grade: null
  });

  const xpResult = await serverAwardXp(userId, 50, `Missão Real submetida (${worldId})`, 'mission');

  const spRef = doc(db, 'studentProgress', userId);
  const spSnap = await getDoc(spRef);
  if (spSnap.exists()) {
    const p = spSnap.data() as ServerStudentProgress;
    if (!p.completedMissions.includes(worldId)) {
      await updateDoc(spRef, {
        completedMissions: [...p.completedMissions, worldId],
        lastActive: 'Agora'
      });
    }
  }

  return {
    success: true,
    missionId,
    awardedXp: 50,
    ...xpResult
  };
}

/**
 * Server-authoritative Weekly Challenge
 */
export async function serverClaimWeeklyChallenge(
  userId: string,
  challengeId: string,
  selectedOptionId: string
) {
  const chRef = doc(db, 'weeklyChallenges', challengeId);
  const chSnap = await getDoc(chRef);

  if (!chSnap.exists()) {
    throw new Error('Desafio semanal não encontrado no Firestore.');
  }

  const challenge = chSnap.data() as {
    correctAnswer: string;
    xpReward: number;
    explanation: string;
  };

  const isCorrect = selectedOptionId === challenge.correctAnswer;

  if (!isCorrect) {
    return {
      success: false,
      isCorrect: false,
      explanation: challenge.explanation,
      message: 'Resposta incorreta. Analisa o cenário e tenta novamente!'
    };
  }

  // Check if already claimed
  const spRef = doc(db, 'studentProgress', userId);
  const spSnap = await getDoc(spRef);
  if (!spSnap.exists()) {
    throw new Error('Registo de progresso não encontrado.');
  }

  const p = spSnap.data() as ServerStudentProgress;
  if (p.claimedWeeklyChallenges.includes(challengeId)) {
    return {
      success: true,
      isCorrect: true,
      alreadyClaimed: true,
      explanation: challenge.explanation,
      message: 'Desafio já tinha sido reivindicado!'
    };
  }

  const xpResult = await serverAwardXp(userId, challenge.xpReward, `Desafio Semanal: ${challengeId}`, 'weekly-challenge');

  await updateDoc(spRef, {
    claimedWeeklyChallenges: [...p.claimedWeeklyChallenges, challengeId],
    lastActive: 'Agora'
  });

  return {
    success: true,
    isCorrect: true,
    alreadyClaimed: false,
    explanation: challenge.explanation,
    awardedXp: challenge.xpReward,
    ...xpResult
  };
}

/**
 * Server-side Create Student
 */
export async function serverCreateStudent(name: string, username: string, classId: string = 'turma-6a') {
  const userId = `aluno-${username.toLowerCase().replace(/[^a-z0-9]/g, '')}_${Math.random().toString(36).substring(2, 5)}`;
  
  const user: ServerUser = {
    id: userId,
    username,
    name,
    role: 'student',
    avatar: 'alex',
    classId,
    className: '6.º Ano — Turma A',
    xp: 0,
    level: 1,
    levelTitle: 'Novato Digital',
    badges: [],
    createdAt: new Date().toISOString()
  };

  await setDoc(doc(db, 'users', userId), user);

  await setDoc(doc(db, 'studentProgress', userId), {
    userId,
    name,
    classId,
    unlockedWorlds: ['mundo-1'],
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
    grandMissionCompleted: false,
    needsHelp: false,
    helpReason: null,
    lastActive: 'Agora'
  });

  await setDoc(doc(db, 'classMembers', `${classId}_${userId}`), {
    id: `${classId}_${userId}`,
    classId,
    userId,
    role: 'student',
    joinedAt: new Date().toISOString()
  });

  await setDoc(doc(db, 'auditLogs', `log_${Date.now()}`), {
    id: `log_${Date.now()}`,
    timestamp: new Date().toISOString(),
    action: 'STUDENT_CREATED',
    actorId: 'admin_or_teacher',
    details: `Novo aluno registado no Firestore: ${name} (${username}) na turma ${classId}.`
  });

  return user;
}

/**
 * Server-side Teacher Authentication
 * Valida o único professor autorizado na plataforma: imaginebycarla2023@gmail.com com password carlamso.
 */
export async function serverTeacherLogin(email: string, pass: string): Promise<ServerUser> {
  const normalizedEmail = (email || '').trim().toLowerCase();
  const normalizedPass = (pass || '').trim();

  if (normalizedEmail !== 'imaginebycarla2023@gmail.com' || normalizedPass !== 'carlamso') {
    throw new Error('Credenciais de professor inválidas. Acesso restrito à Prof.ª Carla.');
  }

  const teacherRef = doc(db, 'users', 'prof-carla');
  const teacherSnap = await getDoc(teacherRef);

  if (teacherSnap.exists()) {
    return teacherSnap.data() as ServerUser;
  }

  // Ensure record exists in Firestore
  const teacher: ServerUser = {
    id: 'prof-carla',
    email: 'imaginebycarla2023@gmail.com',
    username: 'imaginebycarla2023@gmail.com',
    name: 'Prof.ª Carla',
    role: 'teacher',
    avatar: 'teacher-helena',
    classId: 'turma-6a',
    className: '6.º Ano — Turma A',
    xp: 2500,
    level: 8,
    levelTitle: 'Mestre da Missão TIC',
    badges: ['badge-guardiao', 'badge-detetive', 'badge-criador', 'badge-engenheiro', 'badge-ia', 'badge-mestre'],
    createdAt: '2026-09-01T08:00:00Z',
    isDemo: true
  };

  await setDoc(teacherRef, teacher);
  return teacher;
}

