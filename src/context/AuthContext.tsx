import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole } from '../types';
import { DEMO_STUDENT, DEMO_TEACHER, DEMO_ADMIN } from '../data/initialData';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, role?: UserRole) => Promise<boolean>;
  loginTeacher: (password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchDemoUser: (role: UserRole) => Promise<void>;
  updateUserProgress: (updater: (prev: User) => User) => void;
  createStudent: (name: string, username: string) => Promise<User | null>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(DEMO_STUDENT);
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
            claimedWeeklyChallenges: progressData?.claimedWeeklyChallenges || []
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
    const savedUserId = localStorage.getItem('missao_tic_user_id') || 'aluno-alex';
    fetchUserFromFirestore(savedUserId).finally(() => {
      setIsLoading(false);
    });
  }, [fetchUserFromFirestore]);

  const login = async (username: string, chosenRole: UserRole = 'student'): Promise<boolean> => {
    setIsLoading(true);
    let targetUserId = 'aluno-alex';
    if (chosenRole === 'teacher') targetUserId = 'prof-carla';
    else if (chosenRole === 'admin') targetUserId = 'admin-1';
    else if (username && username.trim() !== '') {
      targetUserId = username.trim();
    }

    const success = await fetchUserFromFirestore(targetUserId);
    if (!success) {
      if (chosenRole === 'teacher') setUser(DEMO_TEACHER);
      else if (chosenRole === 'admin') setUser(DEMO_ADMIN);
      else setUser({ ...DEMO_STUDENT, id: targetUserId, name: username || 'Alex Ramos' });
    }
    localStorage.removeItem('missao_tic_logged_out');
    localStorage.setItem('missao_tic_user_id', targetUserId);
    setIsLoading(false);
    return true;
  };

  const loginTeacher = async (password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/teacher-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'imaginebycarla2023@gmail.com',
          password
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setIsLoading(false);
        return { success: false, error: data.error || 'Palavra-passe incorreta para a Prof.ª Carla.' };
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
      localStorage.setItem('missao_tic_user_id', 'prof-carla');
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: 'Erro ao validar credenciais do professor no Firestore.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('missao_tic_user_id');
    localStorage.setItem('missao_tic_logged_out', 'true');
    setUser(null);
  };

  const switchDemoUser = async (targetRole: UserRole) => {
    setIsLoading(true);
    let targetId = 'aluno-alex';
    if (targetRole === 'teacher') targetId = 'prof-carla';
    if (targetRole === 'admin') targetId = 'admin-1';

    const ok = await fetchUserFromFirestore(targetId);
    if (!ok) {
      if (targetRole === 'teacher') setUser(DEMO_TEACHER);
      else if (targetRole === 'admin') setUser(DEMO_ADMIN);
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

  const role: UserRole = user?.role || 'student';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isLoading,
        login,
        loginTeacher,
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
