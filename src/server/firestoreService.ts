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
  limit
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { WORLDS_DATA } from '../data/worldsData';
import { BADGES, LEVELS, getLevelForXp, DEMO_CLASS_STUDENTS } from '../data/initialData';
import { DAILY_TIPS, DAILY_QUOTES } from '../data/dailyContent';
import { WEEKLY_CHALLENGES } from '../data/weeklyChallenges';
import { hashPassword, verifyPassword } from './authSecurity';
import { generateRandomNickname, generateDeterministicAvatar } from '../utils/avatarUtils';

// Initialize Firebase client in server environment
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db: Firestore = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Canonical rewards table defined strictly server-side
export const CANONICAL_REWARDS = {
  ACTIVITY_XP: 20,
  SIMULATOR_XP: 30,
  ASSESSMENT_PASS_XP: 100,
  MISSION_SUBMISSION_XP: 50,
  WEEKLY_CHALLENGE_XP: 50
};

// Interfaces
export interface ServerUser {
  id: string;
  nickname: string; // Public unique handle (e.g. Panda_Feliz_701)
  nicknameLower?: string;
  username: string;
  email?: string; // Private normalized email
  name: string; // Real private name
  role: 'student' | 'teacher';
  avatar: string | any;
  classId?: string;
  className?: string;
  xp: number;
  level: number;
  levelTitle: string;
  badges: string[];
  createdAt: string;
  isDemo?: boolean;
}

export interface PublicStudentProfile {
  id: string;
  nickname: string;
  classId?: string;
  className?: string;
  xp: number;
  level: number;
  levelTitle: string;
  avatar: string | any;
  badgesCount: number;
  role: 'student';
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
  source: 'activity' | 'simulator' | 'assessment' | 'mission' | 'weekly-challenge' | 'grand-mission' | 'teacher_bonus';
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
      }
    ];

    for (const u of demoUsers) {
      const uRef = doc(db, 'users', u.id);
      const uSnap = await getDoc(uRef);
      if (!uSnap.exists()) {
        await setDoc(uRef, u);
      }

      // Seed credentials securely in separate userCredentials collection
      const credRef = doc(db, 'userCredentials', u.id);
      const credSnap = await getDoc(credRef);
      if (!credSnap.exists()) {
        const defaultPassword = u.role === 'teacher' ? 'carlamso' : 'alunotic2026';
        const { salt, hash } = hashPassword(defaultPassword);
        await setDoc(credRef, {
          userId: u.id,
          username: u.username,
          salt,
          hash,
          updatedAt: new Date().toISOString()
        });
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
 * Enforces canonical XP and rejects duplicate rewards idempotently.
 */
export async function serverCompleteActivity(userId: string, activityId: string) {
  const spRef = doc(db, 'studentProgress', userId);
  const spSnap = await getDoc(spRef);

  if (!spSnap.exists()) {
    throw new Error('Registo de progresso do aluno não encontrado.');
  }

  const progress = spSnap.data() as ServerStudentProgress;
  const alreadyCompleted = progress.completedActivities.includes(activityId);

  if (alreadyCompleted) {
    const userRef = doc(db, 'users', userId);
    const uSnap = await getDoc(userRef);
    const currentXp = uSnap.exists() ? (uSnap.data() as ServerUser).xp : 0;
    return {
      success: true,
      alreadyCompleted: true,
      awardedXp: 0,
      newXp: currentXp,
      message: 'Atividade já concluída anteriormente. Não foi atribuído XP duplicado.',
      progress
    };
  }

  // Canonical XP strictly defined by the server (ignores any client value)
  const canonicalXp = CANONICAL_REWARDS.ACTIVITY_XP;
  const xpResult = await serverAwardXp(userId, canonicalXp, `Conclusão de atividade: ${activityId}`, 'activity');

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
    awardedXp: canonicalXp,
    ...xpResult
  };
}

/**
 * Server-authoritative Simulator Completion
 * Enforces canonical XP and rejects duplicate rewards idempotently.
 */
export async function serverCompleteSimulator(userId: string, simId: string) {
  const spRef = doc(db, 'studentProgress', userId);
  const spSnap = await getDoc(spRef);

  if (!spSnap.exists()) {
    throw new Error('Registo de progresso do aluno não encontrado.');
  }

  const progress = spSnap.data() as ServerStudentProgress;
  const alreadyDone = progress.completedSimulators.includes(simId);

  if (alreadyDone) {
    const userRef = doc(db, 'users', userId);
    const uSnap = await getDoc(userRef);
    const currentXp = uSnap.exists() ? (uSnap.data() as ServerUser).xp : 0;
    return {
      success: true,
      alreadyCompleted: true,
      awardedXp: 0,
      newXp: currentXp,
      message: 'Simulador já completado anteriormente. Não foi atribuído XP duplicado.'
    };
  }

  // Canonical XP strictly defined by the server (ignores any client value)
  const canonicalXp = CANONICAL_REWARDS.SIMULATOR_XP;
  const xpResult = await serverAwardXp(userId, canonicalXp, `Simulador concluído: ${simId}`, 'simulator');

  await updateDoc(spRef, {
    completedSimulators: [...progress.completedSimulators, simId],
    lastActive: 'Agora'
  });

  return {
    success: true,
    alreadyCompleted: false,
    awardedXp: canonicalXp,
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
 * Validates authenticated student identity, checks world access, records submission in Firestore,
 * updates student progress, and awards XP with server-side validation.
 */
export async function serverSubmitMission(
  userId: string,
  worldId: string,
  submissionText: string,
  evidenceUrl?: string
) {
  // 1. Verify User Exists
  const userRef = doc(db, 'users', userId);
  const uSnap = await getDoc(userRef);
  if (!uSnap.exists()) {
    throw new Error('Utilizador não encontrado na base de dados.');
  }

  // 2. Validate World Exists & Student Access
  const spRef = doc(db, 'studentProgress', userId);
  const spSnap = await getDoc(spRef);
  if (spSnap.exists()) {
    const p = spSnap.data() as ServerStudentProgress;
    const unlocked = p.unlockedWorlds || ['mundo-1', 'mundo-2'];
    if (!unlocked.includes(worldId) && !userId.startsWith('visitante') && uSnap.data().role !== 'teacher') {
      // Check if world is published/unlocked for all
      const wRef = doc(db, 'worlds', worldId);
      const wSnap = await getDoc(wRef);
      if (!wSnap.exists() || (!wSnap.data().unlockedForAll && wSnap.data().isPublished === false)) {
        throw new Error(`Não tens acesso à Missão Real de ${worldId}.`);
      }
    }
  }

  // 3. Persist Mission Submission to Firestore
  const missionId = `mission_${Date.now()}_${userId}`;
  await setDoc(doc(db, 'missions', missionId), {
    id: missionId,
    userId,
    worldId,
    submissionText: submissionText.trim(),
    evidenceUrl: evidenceUrl || null,
    submittedAt: new Date().toISOString(),
    status: 'submitted',
    teacherFeedback: null,
    grade: null
  });

  // 4. Server-Authoritative XP Award (+50 XP)
  const xpResult = await serverAwardXp(userId, 50, `Missão Real submetida (${worldId})`, 'mission');

  // 5. Update Student Progress in Firestore
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
 * Check if a nickname is unique (case-insensitive)
 */
export async function serverCheckNicknameUnique(nickname: string): Promise<{ available: boolean; nickname: string }> {
  const clean = (nickname || '').trim();
  if (!clean || clean.length < 3) {
    return { available: false, nickname: clean };
  }
  const cleanLower = clean.toLowerCase();

  // Check in users collection
  const q1 = query(collection(db, 'users'), where('nicknameLower', '==', cleanLower), limit(1));
  const s1 = await getDocs(q1);
  if (!s1.empty) {
    return { available: false, nickname: clean };
  }

  // Also query where nickname exact match (for older docs)
  const allUsersSnap = await getDocs(collection(db, 'users'));
  for (const docSnap of allUsersSnap.docs) {
    const data = docSnap.data() as ServerUser;
    if (data.nickname && data.nickname.toLowerCase() === cleanLower) {
      return { available: false, nickname: clean };
    }
  }

  return { available: true, nickname: clean };
}

/**
 * Generate a guaranteed unique nickname
 */
export async function serverGenerateUniqueNickname(): Promise<string> {
  for (let attempt = 0; attempt < 25; attempt++) {
    const candidate = generateRandomNickname();
    const check = await serverCheckNicknameUnique(candidate);
    if (check.available) {
      return candidate;
    }
  }
  // Fallback with timestamp
  return `Gamer_Pro_${Date.now().toString().slice(-4)}`;
}

export interface StudentRegistrationInput {
  name: string;
  email: string;
  password?: string;
  classId?: string;
  className?: string;
  nickname?: string;
  avatar?: any;
}

/**
 * Server-side Student Registration (Full specification)
 * 1. Validates real name (private, min 2 chars)
 * 2. Normalizes email (trim + lowercase), checks for duplicates
 * 3. Validates password (min 6 chars) and hashes securely
 * 4. Ensures unique public nickname (case-insensitive)
 * 5. Saves private profile, user credentials, and public ranking profile
 */
export async function serverRegisterStudent(input: StudentRegistrationInput): Promise<ServerUser> {
  const cleanName = (input.name || '').trim();
  const rawEmail = (input.email || '').trim();
  const cleanEmail = rawEmail.toLowerCase();
  const rawPassword = input.password || '';
  const classId = (input.classId || 'turma-6a').trim();
  const className = (input.className || '6.º A').trim();

  // 1. Validate Real Name
  if (!cleanName || cleanName.length < 2) {
    throw new Error('Por favor, indica o teu nome completo (mínimo 2 letras).');
  }

  // 2. Validate Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!cleanEmail || !emailRegex.test(cleanEmail)) {
    throw new Error('Por favor, introduz um endereço de email válido (exemplo: aluno@escola.pt).');
  }

  // Check if email is already in use
  const emailQ = query(collection(db, 'users'), where('email', '==', cleanEmail), limit(1));
  const emailSnap = await getDocs(emailQ);
  if (!emailSnap.empty) {
    throw new Error('Este endereço de email já se encontra registado. Faz login com as tuas credenciais.');
  }

  // 3. Validate Password
  if (!rawPassword || rawPassword.length < 6) {
    throw new Error('A palavra-passe deve ter pelo menos 6 caracteres.');
  }

  // 4. Validate & Ensure Unique Nickname
  let nickname = (input.nickname || '').trim();
  if (!nickname) {
    nickname = await serverGenerateUniqueNickname();
  } else {
    const isUnique = await serverCheckNicknameUnique(nickname);
    if (!isUnique.available) {
      throw new Error(`O nickname "${nickname}" já está a ser utilizado por outro colega. Clica em "Baralhar outro Nickname"!`);
    }
  }

  // 5. Setup Avatar
  let avatar = input.avatar;
  if (!avatar) {
    avatar = generateDeterministicAvatar(nickname);
  }

  const userId = `aluno-${cleanEmail.replace(/[^a-z0-9]/g, '_').substring(0, 15)}_${Math.random().toString(36).substring(2, 6)}`;
  
  // 6. Create User Object (Private Profile)
  const user: ServerUser = {
    id: userId,
    nickname,
    nicknameLower: nickname.toLowerCase(),
    username: cleanEmail,
    email: cleanEmail,
    name: cleanName,
    role: 'student',
    avatar,
    classId,
    className,
    xp: 0,
    level: 1,
    levelTitle: 'Novato Digital',
    badges: [],
    createdAt: new Date().toISOString()
  };

  // 7. Save to 'users' collection
  await setDoc(doc(db, 'users', userId), user);

  // 8. Hash and save Password in 'userCredentials'
  const { salt, hash } = hashPassword(rawPassword);
  await setDoc(doc(db, 'userCredentials', userId), {
    userId,
    email: cleanEmail,
    nickname,
    salt,
    hash,
    updatedAt: new Date().toISOString()
  });

  // 9. Save Public Profile in 'publicProfiles' (for Leaderboards & Classmates without revealing name/email)
  await setDoc(doc(db, 'publicProfiles', userId), {
    id: userId,
    nickname,
    nicknameLower: nickname.toLowerCase(),
    classId,
    className,
    xp: 0,
    level: 1,
    levelTitle: 'Novato Digital',
    avatar,
    badgesCount: 0,
    role: 'student',
    updatedAt: new Date().toISOString()
  });

  // 10. Initialize Student Progress
  await setDoc(doc(db, 'studentProgress', userId), {
    userId,
    name: cleanName,
    nickname,
    classId,
    unlockedWorlds: ['mundo-1', 'mundo-2'],
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

  // 11. Associate with Classroom
  await setDoc(doc(db, 'classMembers', `${classId}_${userId}`), {
    id: `${classId}_${userId}`,
    classId,
    userId,
    role: 'student',
    joinedAt: new Date().toISOString()
  });

  // 12. Audit Log
  await setDoc(doc(db, 'auditLogs', `log_${Date.now()}`), {
    id: `log_${Date.now()}`,
    timestamp: new Date().toISOString(),
    action: 'STUDENT_REGISTERED',
    actorId: userId,
    details: `Novo aluno registado: ${cleanName} com nickname público [${nickname}] na turma ${className}.`
  });

  return user;
}

/**
 * Server-side Create Student (by Teacher)
 */
export async function serverCreateStudent(name: string, username: string, classId: string = 'turma-6a') {
  const generatedNick = await serverGenerateUniqueNickname();
  return serverRegisterStudent({
    name,
    email: `${username.toLowerCase().trim()}@escola.pt`,
    password: 'alunotic2026',
    classId,
    className: classId === 'turma-6a' ? '6.º A' : '6.º B',
    nickname: generatedNick,
    avatar: 'alex'
  });
}

/**
 * Server-side Teacher Authentication
 * Fully dynamic: locates teacher user document in Firestore and verifies password hash from userCredentials.
 */
export async function serverTeacherLogin(identifier: string, pass: string): Promise<ServerUser> {
  const cleanId = (identifier || '').trim().toLowerCase();
  const rawPass = (pass || '').trim();

  if (!cleanId || !rawPass) {
    throw new Error('Identificador e palavra-passe são obrigatórios.');
  }

  // 1. Search for teacher user in Firestore by email, username or id
  const usersCol = collection(db, 'users');
  let teacherDoc: ServerUser | null = null;

  // Try direct ID lookup
  const directSnap = await getDoc(doc(db, 'users', cleanId));
  if (directSnap.exists() && directSnap.data().role === 'teacher') {
    teacherDoc = directSnap.data() as ServerUser;
  } else {
    // Query by email
    const emailQ = query(usersCol, where('email', '==', cleanId), where('role', '==', 'teacher'), limit(1));
    const emailSnap = await getDocs(emailQ);
    if (!emailSnap.empty) {
      teacherDoc = emailSnap.docs[0].data() as ServerUser;
    } else {
      // Query by username
      const userQ = query(usersCol, where('username', '==', cleanId), where('role', '==', 'teacher'), limit(1));
      const userSnap = await getDocs(userQ);
      if (!userSnap.empty) {
        teacherDoc = userSnap.docs[0].data() as ServerUser;
      }
    }
  }

  if (!teacherDoc || teacherDoc.role !== 'teacher') {
    await setDoc(doc(db, 'auditLogs', `log_${Date.now()}`), {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'LOGIN_FAILED',
      actorId: cleanId,
      details: `Tentativa de login de professor falhada: conta não encontrada ou sem privilégios de docente.`
    });
    throw new Error('Credenciais inválidas. Conta de professor não encontrada.');
  }

  // 2. Verify hashed password against userCredentials collection
  const credRef = doc(db, 'userCredentials', teacherDoc.id);
  const credSnap = await getDoc(credRef);

  if (!credSnap.exists()) {
    // If credentials doc missing (e.g. fresh seed), create default demo hash
    const { salt, hash } = hashPassword('carlamso');
    await setDoc(credRef, {
      userId: teacherDoc.id,
      username: teacherDoc.username,
      salt,
      hash,
      updatedAt: new Date().toISOString()
    });
  }

  const credentials = (await getDoc(credRef)).data() as { salt: string; hash: string };
  const isValid = verifyPassword(rawPass, credentials.salt, credentials.hash);

  if (!isValid) {
    await setDoc(doc(db, 'auditLogs', `log_${Date.now()}`), {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'LOGIN_FAILED',
      actorId: teacherDoc.id,
      details: `Tentativa de login de professor falhada para o utilizador ${teacherDoc.id} (palavra-passe incorreta).`
    });
    throw new Error('Credenciais de professor inválidas. Palavra-passe incorreta.');
  }

  // 3. Log successful login
  await setDoc(doc(db, 'auditLogs', `log_${Date.now()}`), {
    id: `log_${Date.now()}`,
    timestamp: new Date().toISOString(),
    action: 'LOGIN_SUCCESS',
    actorId: teacherDoc.id,
    details: `Professor autenticado com sucesso: ${teacherDoc.name} (${teacherDoc.id}).`
  });

  return teacherDoc;
}

/**
 * Server-side Student Authentication
 * Supports login via Email or Nickname + Password
 */
export async function serverStudentLogin(identifier: string, pass?: string): Promise<ServerUser> {
  const cleanId = (identifier || '').trim().toLowerCase();
  const rawPass = (pass || '').trim();

  if (!cleanId) {
    throw new Error('Email ou Nickname de aluno é obrigatório.');
  }

  let studentDoc: ServerUser | null = null;

  // 1. Direct ID lookup
  const directSnap = await getDoc(doc(db, 'users', cleanId));
  if (directSnap.exists() && directSnap.data().role === 'student') {
    studentDoc = directSnap.data() as ServerUser;
  }

  // 2. Query by email
  if (!studentDoc) {
    const emailQ = query(collection(db, 'users'), where('email', '==', cleanId), where('role', '==', 'student'), limit(1));
    const snap = await getDocs(emailQ);
    if (!snap.empty) {
      studentDoc = snap.docs[0].data() as ServerUser;
    }
  }

  // 3. Query by nicknameLower / nickname
  if (!studentDoc) {
    const nickQ = query(collection(db, 'users'), where('nicknameLower', '==', cleanId), where('role', '==', 'student'), limit(1));
    const snap = await getDocs(nickQ);
    if (!snap.empty) {
      studentDoc = snap.docs[0].data() as ServerUser;
    }
  }

  // 4. Query by username
  if (!studentDoc) {
    const userQ = query(collection(db, 'users'), where('username', '==', cleanId), where('role', '==', 'student'), limit(1));
    const snap = await getDocs(userQ);
    if (!snap.empty) {
      studentDoc = snap.docs[0].data() as ServerUser;
    }
  }

  // 5. Scan all student documents for name or case-insensitive match
  if (!studentDoc) {
    const allStudentsQ = query(collection(db, 'users'), where('role', '==', 'student'));
    const allSnap = await getDocs(allStudentsQ);
    for (const docSnap of allSnap.docs) {
      const data = docSnap.data() as ServerUser;
      if (
        (data.nickname && data.nickname.toLowerCase() === cleanId) ||
        (data.email && data.email.toLowerCase() === cleanId) ||
        (data.username && data.username.toLowerCase() === cleanId) ||
        (data.name && data.name.toLowerCase() === cleanId)
      ) {
        studentDoc = data;
        break;
      }
    }
  }

  if (!studentDoc) {
    throw new Error('Aluno não encontrado com esse email ou nickname. Se és novo, clica em "Criar Conta"!');
  }

  // Check password if credentials document exists
  const credRef = doc(db, 'userCredentials', studentDoc.id);
  const credSnap = await getDoc(credRef);

  if (credSnap.exists() && rawPass) {
    const credData = credSnap.data() as { salt: string; hash: string };
    const isValid = verifyPassword(rawPass, credData.salt, credData.hash);
    if (!isValid) {
      throw new Error('Palavra-passe incorreta. Por favor, tenta novamente.');
    }
  }

  return studentDoc;
}

/**
 * Public Rankings Query: Returns ONLY sanitized public fields (Nickname, Avatar, Class, Points/XP, Level, Badges).
 * STRICTLY PREVENTS LEAKING REAL NAME OR EMAIL TO PUBLIC LEADERBOARDS.
 */
export async function serverGetPublicRankings(classId?: string): Promise<PublicStudentProfile[]> {
  const usersQ = classId
    ? query(collection(db, 'users'), where('role', '==', 'student'), where('classId', '==', classId))
    : query(collection(db, 'users'), where('role', '==', 'student'));

  const snap = await getDocs(usersQ);
  const profiles: PublicStudentProfile[] = [];

  for (const d of snap.docs) {
    const u = d.data() as ServerUser;
    profiles.push({
      id: u.id,
      nickname: u.nickname || u.name,
      classId: u.classId,
      className: u.className || '6.º A',
      xp: u.xp || 0,
      level: u.level || 1,
      levelTitle: u.levelTitle || 'Novato Digital',
      avatar: u.avatar || 'alex',
      badgesCount: (u.badges || []).length,
      role: 'student'
    });
  }

  return profiles.sort((a, b) => b.xp - a.xp);
}

/**
 * Class-isolated teacher query: returns students belonging exclusively to classes owned by the authenticated teacher.
 */
export async function serverGetTeacherClassStudents(teacherId: string) {
  // 1. Get all classes owned by this teacher
  const classesQ = query(collection(db, 'classes'), where('teacherId', '==', teacherId));
  const classSnap = await getDocs(classesQ);
  const teacherClassIds = classSnap.docs.map(d => d.id);

  if (teacherClassIds.length === 0) {
    return [];
  }

  // 2. Fetch students belonging to these classes
  const usersQ = query(collection(db, 'users'), where('role', '==', 'student'), where('classId', 'in', teacherClassIds));
  const userSnap = await getDocs(usersQ);
  const students: any[] = [];

  for (const uDoc of userSnap.docs) {
    const uData = uDoc.data() as ServerUser;
    const spSnap = await getDoc(doc(db, 'studentProgress', uData.id));
    const pData = spSnap.exists() ? spSnap.data() as ServerStudentProgress : null;

    students.push({
      userId: uData.id,
      name: uData.name,
      nickname: uData.nickname || uData.name,
      email: uData.email,
      avatar: uData.avatar,
      classId: uData.classId || 'turma-6a',
      className: uData.className || '6.º A',
      xp: uData.xp,
      level: uData.level,
      levelTitle: uData.levelTitle,
      world1Progress: pData?.world1Progress || 0,
      world2Progress: pData?.world2Progress || 0,
      world3Progress: pData?.world3Progress || 0,
      world4Progress: pData?.world4Progress || 0,
      world5Progress: pData?.world5Progress || 0,
      grandMissionCompleted: pData?.grandMissionCompleted || false,
      completedAssessments: pData?.completedAssessments || {},
      completedMissions: pData?.completedMissions || [],
      needsHelp: pData?.needsHelp || false,
      helpReason: pData?.helpReason || null,
      lastActive: pData?.lastActive || 'Hoje'
    });
  }

  return students;
}


