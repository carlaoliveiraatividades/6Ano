import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { DEMO_CLASS_STUDENTS } from '../../data/initialData';
import { UserAvatar } from '../common/UserAvatar';

export const ClassRankingCard: React.FC = () => {
  const { setCurrentView } = useApp();
  const { user } = useAuth();

  // Sort students by XP, with current user dynamically updated if Alex has more XP
  const sortedStudents = [...DEMO_CLASS_STUDENTS].map(s => {
    if (s.userId === 'aluno-alex' && user) {
      return { ...s, xp: user.xp, level: user.level, levelTitle: user.levelTitle };
    }
    return s;
  }).sort((a, b) => b.xp - a.xp);

  const top3 = sortedStudents.slice(0, 3);

  const rankIcons = ['👑', '🥈', '🥉'];
  const rankColors = ['text-amber-500', 'text-slate-400', 'text-amber-700'];

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-bold text-slate-900 text-sm">
          Ranking da Turma
        </h3>
        <button
          onClick={() => setCurrentView('ranking' as any)}
          className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer flex items-center gap-1"
        >
          <span>Ver todos</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-2.5">
        {top3.map((student, index) => {
          const isCurrentUser = student.userId === 'aluno-alex';

          return (
            <div
              key={student.userId}
              className={`flex items-center justify-between p-2 rounded-2xl transition-colors ${
                isCurrentUser
                  ? 'bg-sky-50 border border-sky-200/80 font-bold'
                  : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`text-base font-black ${rankColors[index]}`}>
                  {rankIcons[index]}
                </span>
                <UserAvatar avatarId={student.avatar} size="sm" />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-800">
                    {student.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {student.levelTitle}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold font-mono text-slate-700">
                  {student.xp} XP
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
