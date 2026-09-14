import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole } from '../types';
import { DEMO_STUDENT, DEMO_TEACHER } from '../data/initialData';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  isGuest?: boolean;
  login: (username: string, role?: UserRole, password?: string) => Promise<boolean>;
  loginTeacher: (password: string, identifier?: string) => Promise<{ success: boolean; error?: string }>;
  unifiedLogin: (identifier: string, password?: string) => Promise<{ success: boolean; error?: string; role?: UserRole }>;
  registerStudent: (params: {
    name: string;
    email: string;
    password: string;
    classId: string;
    className: string;
    nickname?: string;
    avatar?: any;
  }) => Promise<{ success: boolean; error?: string; user?: User }>;
  loginGuest: () => Promise<{ success: boolean; error?: string; user?: User }>;
  logout: () => void;
  switchDemoUser: (role: UserRole) => Promise<void>;
  updateUserProgress: (updater: (prev: User) => User) => void;
  createStudent: (name: string, username: string) => Promise<User | null>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch verified user from Firestore on initial mount
  const fetchUserFromFirestore = useCallback(async (userId: string) => {
    try {
      const res = await fetch(`/api/users/${userId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          // Also fetch progress
          const pRes = await fetch(`/api/users/${userId}/progress`);
          let progressData = null;
          if (pRes.ok) {
            const p = await pRes.json();
            progressData = p.progress;
          }

          setUser({
            ...data.user,
            completedActivities: progressData?.completedActivities || data.user.completedActivities || [],
            completedSimulators: progressData?.completedSimulators || data.user.completedSimulators || [],
            completedMissions: progressData?.completedMissions || data.user.completedMissions || [],
            completedAssessments: progressData?.completedAssessments || data.user.completedAssessments || {},
            claimedWeeklyChallenges: progressData?.claimedWeeklyChallenges || [],
            unlockedWorlds: progressData?.unlockedWorlds || data.user.unlockedWorlds || ['mundo-1', 'mundo-2']
          });
          return true;
        }
      }
    } catch (e) {
      console.warn('[AuthContext] Firestore fetch error, fallback to initial state', e);
    }
    return false;
  }, []);

  useEffect(() => {
    const isLoggedOut = localStorage.getItem('missao_tic_logged_out') === 'true';
    if (isLoggedOut) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    const savedUserId = localStorage.getItem('missao_tic_user_id');
    if (savedUserId) {
      if (savedUserId.startsWith('visitante')) {
        loginGuest().finally(() => setIsLoading(false));
      } else {
        fetchUserFromFirestore(savedUserId).finally(() => {
          setIsLoading(false);
        });
      }
    } else {
      // Default to null so user sees the initial landing/login page with Visitor button
      setUser(null);
      setIsLoading(false);
    }
  }, [fetchUserFromFirestore]);

  const login = async (username: string, chosenRole: UserRole = 'student', password?: string): Promise<boolean> => {
    setIsLoading(true);
    let targetUserId = username && username.trim() !== '' ? username.trim() : 'aluno-alex';

    try {
      if (chosenRole === 'student') {
        const res = await fetch('/api/auth/student-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier: targetUserId, password })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            await fetchUserFromFirestore(data.user.id);
            localStorage.removeItem('missao_tic_logged_out');
            localStorage.setItem('missao_tic_user_id', data.user.id);
            setIsLoading(false);
            return true;
          }
        }
      }
    } catch (e) {
      console.warn('[AuthContext] Session login error:', e);
    }

    const success = await fetchUserFromFirestore(targetUserId);
    if (!success) {
      if (chosenRole === 'teacher') setUser(DEMO_TEACHER);
      else setUser({ ...DEMO_STUDENT, id: targetUserId, name: username || 'Alex Ramos' });
    }
    localStorage.removeItem('missao_tic_logged_out');
    localStorage.setItem('missao_tic_user_id', targetUserId);
    setIsLoading(false);
    return true;
  };

  const loginTeacher = async (password: string, identifier: string = 'imaginebycarla2023@gmail.com'): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/teacher-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: identifier,
          password
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setIsLoading(false);
        return { success: false, error: data.error || 'Credenciais inválidas para o professor.' };
      }

      setUser({
        ...data.teacher,
        completedActivities: [],
        completedSimulators: [],
        completedMissions: [],
        completedAssessments: {},
        claimedWeeklyChallenges: []
      });
      localStorage.removeItem('missao_tic_logged_out');
      localStorage.setItem('missao_tic_user_id', data.teacher.id);
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: 'Erro ao validar credenciais do professor no Firestore.' };
    }
  };

  const unifiedLogin = async (identifier: string, password?: string): Promise<{ success: boolean; error?: string; role?: UserRole }> => {
    setIsLoading(true);
    const cleanId = identifier.trim().toLowerCase();

    // Teacher check
    if (
      cleanId === 'imaginebycarla2023@gmail.com' ||
      cleanId === 'prof-carla' ||
      cleanId === 'carla' ||
      cleanId === 'prof.ª carla' ||
      cleanId === 'prof carla' ||
      cleanId.startsWith('prof')
    ) {
      if (!password || password.trim() === '') {
        setIsLoading(false);
        return {
          success: false,
          error: 'Por favor, insere a palavra-passe do professor.'
        };
      }
      const res = await loginTeacher(password, identifier.trim());
      if (res.success) {
        return { success: true, role: 'teacher' };
      }
      return { success: false, error: res.error || 'Palavra-passe incorreta para o docente.' };
    }

    // Student login via server API
    try {
      const res = await fetch('/api/auth/student-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim(), password })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setIsLoading(false);
        return { success: false, error: data.error || 'Email, Nickname ou palavra-passe incorretos.' };
      }

      await fetchUserFromFirestore(data.user.id);
      localStorage.removeItem('missao_tic_logged_out');
      localStorage.setItem('missao_tic_user_id', data.user.id);
      setIsLoading(false);
      return { success: true, role: 'student' };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: 'Erro de comunicação ao validar a conta.' };
    }
  };

  const logout = () => {
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    localStorage.removeItem('missao_tic_user_id');
    localStorage.setItem('missao_tic_logged_out', 'true');
    setUser(null);
  };

  const switchDemoUser = async (targetRole: UserRole) => {
    setIsLoading(true);
    if (targetRole === 'visitor') {
      await loginGuest();
      setIsLoading(false);
      return;
    }

    let targetId = 'aluno-alex';
    if (targetRole === 'teacher') targetId = 'prof-carla';

    const ok = await fetchUserFromFirestore(targetId);
    if (!ok) {
      if (targetRole === 'teacher') setUser(DEMO_TEACHER);
      else setUser(DEMO_STUDENT);
    }
    localStorage.removeItem('missao_tic_logged_out');
    localStorage.setItem('missao_tic_user_id', targetId);
    setIsLoading(false);
  };

  const updateUserProgress = (updater: (prev: User) => User) => {
    setUser(prev => {
      if (!prev) return prev;
      return updater(prev);
    });
  };

  const refreshUser = async () => {
    if (user?.id) {
      await fetchUserFromFirestore(user.id);
    }
  };

  const createStudent = async (name: string, username: string): Promise<User | null> => {
    try {
      const res = await fetch('/api/students/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, classId: 'turma-6a' })
      });
      if (res.ok) {
        const data = await res.json();
        return data.student;
      }
    } catch (e) {
      console.error('[AuthContext] Error creating student in Firestore:', e);
    }
    return null;
  };

  const registerStudent = async (params: {
    name: string;
    email: string;
    password: string;
    classId: string;
    className: string;
    nickname?: string;
    avatar?: any;
  }): Promise<{ success: boolean; error?: string; user?: User }> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/student-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setIsLoading(false);
        return { success: false, error: data.error || 'Erro ao criar conta de aluno.' };
      }

      const newUser: User = {
        ...data.user,
        completedActivities: [],
        completedSimulators: [],
        completedMissions: [],
        completedAssessments: {},
        claimedWeeklyChallenges: [],
        unlockedWorlds: ['mundo-1', 'mundo-2']
      };

      setUser(newUser);
      localStorage.removeItem('missao_tic_logged_out');
      localStorage.setItem('missao_tic_user_id', newUser.id);
      setIsLoading(false);
      return { success: true, user: newUser };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Erro de ligação ao servidor.' };
    }
  };

  const loginGuest = async (): Promise<{ success: boolean; error?: string; user?: User }> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/guest-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setIsLoading(false);
        // Fallback local guest
        const fallbackGuest: User = {
          id: `visitante_${Date.now()}`,
          username: 'visitante',
          name: 'Explorador Convidado',
          role: 'visitor',
          avatar: 'alex',
          classId: 'visitantes',
          className: 'Visitante / Convidado',
          xp: 150,
          level: 1,
          levelTitle: 'Explorador Convidado',
          badges: ['badge-guardiao'],
          completedActivities: [],
          completedSimulators: [],
          completedMissions: [],
          completedAssessments: {},
          claimedWeeklyChallenges: [],
          unlockedWorlds: ['mundo-1', 'mundo-2', 'mundo-3', 'mundo-4', 'mundo-5'],
          createdAt: new Date().toISOString()
        };
        setUser(fallbackGuest);
        localStorage.removeItem('missao_tic_logged_out');
        localStorage.setItem('missao_tic_user_id', fallbackGuest.id);
        return { success: true, user: fallbackGuest };
      }

      const guestUser: User = {
        ...data.user,
        role: 'visitor',
        completedActivities: [],
        completedSimulators: [],
        completedMissions: [],
        completedAssessments: {},
        claimedWeeklyChallenges: [],
        unlockedWorlds: ['mundo-1', 'mundo-2', 'mundo-3', 'mundo-4', 'mundo-5']
      };

      setUser(guestUser);
      localStorage.removeItem('missao_tic_logged_out');
      localStorage.setItem('missao_tic_user_id', guestUser.id);
      setIsLoading(false);
      return { success: true, user: guestUser };
    } catch (err: any) {
      setIsLoading(false);
      const fallbackGuest: User = {
        id: `visitante_${Date.now()}`,
        username: 'visitante',
        name: 'Explorador Convidado',
        role: 'visitor',
        avatar: 'alex',
        classId: 'visitantes',
        className: 'Visitante / Convidado',
        xp: 150,
        level: 1,
        levelTitle: 'Explorador Convidado',
        badges: ['badge-guardiao'],
        completedActivities: [],
        completedSimulators: [],
        completedMissions: [],
        completedAssessments: {},
        claimedWeeklyChallenges: [],
        unlockedWorlds: ['mundo-1', 'mundo-2', 'mundo-3', 'mundo-4', 'mundo-5'],
        createdAt: new Date().toISOString()
      };
      setUser(fallbackGuest);
      localStorage.removeItem('missao_tic_logged_out');
      localStorage.setItem('missao_tic_user_id', fallbackGuest.id);
      return { success: true, user: fallbackGuest };
    }
  };

  const role: UserRole = user?.role || 'student';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isLoading,
        isGuest: user?.role === 'visitor',
        login,
        loginTeacher,
        unifiedLogin,
        registerStudent,
        loginGuest,
        logout,
        switchDemoUser,
        updateUserProgress,
        createStudent,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
