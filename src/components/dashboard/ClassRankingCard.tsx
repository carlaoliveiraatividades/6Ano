import React, { useState, useEffect } from 'react';
import { ArrowRight, Trophy } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { UserAvatar } from '../common/UserAvatar';

export const ClassRankingCard: React.FC = () => {
  const { setCurrentView } = useApp();
  const { user } = useAuth();
  const [topStudents, setTopStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/rankings')
      .then(res => res.json())
      .then(data => {
        if (isMounted) {
          if (data.rankings && Array.isArray(data.rankings)) {
            setTopStudents(data.rankings.slice(0, 3));
          }
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, [user?.xp]);

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

      {loading ? (
        <div className="py-6 text-center text-xs text-slate-400">
          A carregar ranking...
        </div>
      ) : topStudents.length === 0 ? (
        <div className="py-6 text-center text-xs text-slate-400 flex flex-col items-center gap-1">
          <Trophy className="w-5 h-5 text-slate-300" />
          <span>Ainda sem alunos classificados</span>
        </div>
      ) : (
        <div className="space-y-2.5">
          {topStudents.map((student, index) => {
            const isCurrentUser = user && student.id === user.id;

            return (
              <div
                key={student.id || index}
                className={`flex items-center justify-between p-2 rounded-2xl transition-colors ${
                  isCurrentUser
                    ? 'bg-sky-50 border border-sky-200/80 font-bold'
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-base font-black ${rankColors[index] || 'text-slate-400'}`}>
                    {rankIcons[index] || '🏅'}
                  </span>
                  <UserAvatar avatarId={student.avatar} size="sm" />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-800">
                      {student.nickname || student.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {student.levelTitle || 'Explorador Digital'}
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
      )}
    </div>
  );
};
