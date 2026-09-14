import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firestoreService';

export interface UserSession {
  id: string;
  userId: string;
  username: string;
  name: string;
  role: 'student' | 'teacher';
  classId?: string;
  createdAt: number;
  expiresAt: number;
}

export interface AuthenticatedRequest extends Request {
  user?: UserSession;
  sessionId?: string;
}

// In-memory sessions store with expiration
const activeSessions = new Map<string, UserSession>();
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

// Cleanup expired sessions every 15 minutes
setInterval(() => {
  const now = Date.now();
  for (const [id, session] of activeSessions.entries()) {
    if (session.expiresAt < now) {
      activeSessions.delete(id);
    }
  }
}, 15 * 60 * 1000);

// ====================================================================
// PASSWORD HASHING (SCRYPT + CRYPTO RANDOM SALT)
// ====================================================================
export function hashPassword(password: string): { salt: string; hash: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { salt, hash };
}

export function verifyPassword(password: string, salt: string, expectedHash: string): boolean {
  if (!password || !salt || !expectedHash) return false;
  try {
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(expectedHash, 'hex'));
  } catch {
    return false;
  }
}

// ====================================================================
// SESSION MANAGEMENT
// ====================================================================
export function createSession(user: {
  id: string;
  username: string;
  name: string;
  role: 'student' | 'teacher';
  classId?: string;
}): UserSession {
  const sessionId = crypto.randomBytes(32).toString('hex');
  const now = Date.now();
  const session: UserSession = {
    id: sessionId,
    userId: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    classId: user.classId,
    createdAt: now,
    expiresAt: now + SESSION_DURATION_MS
  };

  activeSessions.set(sessionId, session);
  return session;
}

export function getSession(sessionId: string): UserSession | null {
  if (!sessionId) return null;
  const session = activeSessions.get(sessionId);
  if (!session) return null;

  if (session.expiresAt < Date.now()) {
    activeSessions.delete(sessionId);
    return null;
  }

  return session;
}

export function invalidateSession(sessionId: string): boolean {
  return activeSessions.delete(sessionId);
}

export function invalidateAllUserSessions(userId: string): void {
  for (const [id, session] of activeSessions.entries()) {
    if (session.userId === userId) {
      activeSessions.delete(id);
    }
  }
}

// ====================================================================
// RATE LIMITING (IN-MEMORY SLIDING WINDOW)
// ====================================================================
interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

export function createRateLimiter(options: { windowMs: number; max: number; message: string }) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown_ip';
    const key = `${req.path}_${ip}`;
    const now = Date.now();

    const record = rateLimitMap.get(key);
    if (!record || record.resetAt < now) {
      rateLimitMap.set(key, { count: 1, resetAt: now + options.windowMs });
      return next();
    }

    record.count++;
    if (record.count > options.max) {
      return res.status(429).json({
        error: options.message || 'Demasiados pedidos. Por favor aguarde um momento.'
      });
    }

    next();
  };
}

// Clean rate limits every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (record.resetAt < now) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

// ====================================================================
// AUTHENTICATION & AUTHORIZATION MIDDLEWARES
// ====================================================================
export function extractSessionId(req: Request): string | null {
  // 1. Check HttpOnly cookie
  if (req.cookies && req.cookies.missao_tic_session) {
    return req.cookies.missao_tic_session;
  }
  // 2. Check Authorization Bearer header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  return null;
}

export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const sessionId = extractSessionId(req);

  if (!sessionId) {
    return res.status(401).json({
      error: 'Não autenticado. Inicie sessão para aceder a este recurso.'
    });
  }

  const session = getSession(sessionId);
  if (!session) {
    return res.status(401).json({
      error: 'Sessão inválida ou expirada. Inicie sessão novamente.'
    });
  }

  req.user = session;
  req.sessionId = sessionId;
  next();
}

export function requireTeacher(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Não autenticado.' });
  }

  if (req.user.role !== 'teacher') {
    return res.status(403).json({
      error: 'Acesso proibido. Apenas professores autorizados podem executar esta operação.'
    });
  }

  next();
}

export function requireStudent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Não autenticado.' });
  }

  if (req.user.role !== 'student') {
    return res.status(403).json({
      error: 'Acesso proibido. Este recurso destina-se a alunos.'
    });
  }

  next();
}

// Verify Teacher owns the class
export async function verifyClassOwnership(teacherId: string, classId: string): Promise<boolean> {
  if (!teacherId || !classId) return false;
  try {
    const classRef = doc(db, 'classes', classId);
    const snap = await getDoc(classRef);
    if (!snap.exists()) return false;
    const classData = snap.data();
    return classData.teacherId === teacherId;
  } catch {
    return false;
  }
}

// Verify Student belongs to teacher's class
export async function verifyStudentBelongsToTeacher(teacherId: string, studentId: string): Promise<boolean> {
  if (!teacherId || !studentId) return false;
  try {
    const studentRef = doc(db, 'users', studentId);
    const snap = await getDoc(studentRef);
    if (!snap.exists()) return false;
    const studentData = snap.data();
    if (!studentData.classId) return false;
    return await verifyClassOwnership(teacherId, studentData.classId);
  } catch {
    return false;
  }
}
