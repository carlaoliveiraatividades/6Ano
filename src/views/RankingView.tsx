import React, { useState } from 'react';
import { Trophy, Search, Medal, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DEMO_CLASS_STUDENTS } from '../data/initialData';
import { UserAvatar } from '../components/common/UserAvatar';

export const RankingView: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  // Merge live user XP if student
  const students = DEMO_CLASS_STUDENTS.map(s => {
    if (s.userId === 'aluno-alex' && user) {
      return {
        ...s,
        xp: user.xp,
        level: user.level,
        levelTitle: user.levelTitle,
        badgesCount: user.badges.length
      };
    }
    return {
      ...s,
      badgesCount: Math.max(1, Math.floor(s.level * 0.8))
    };
  }).sort((a, b) => b.xp - a.xp);

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-6 sm:p-8 text-white shadow-md">
        <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
          Comunidade Escolar • Turma 6.º A
        </span>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl mt-2">
          Classificação da Turma
        </h1>
        <p className="text-xs sm:text-sm text-amber-100 mt-1 max-w-xl">
          Aprender em conjunto é mais divertido! Participa nas missões para elevares a tua turma e desbloqueares recompensas coletivas.
        </p>
      </div>

      {/* Leaderboard card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-extrabold text-xl text-slate-900">
              Tabela de Mestres Digitais
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Atualização contínua com base no XP acumulado em todas as atividades.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Pesquisar colega..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Top 3 Podium Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {students.slice(0, 3).map((st, idx) => {
            const podiumColors = [
              'bg-gradient-to-b from-amber-100/70 to-amber-50/20 border-amber-300 ring-2 ring-amber-200',
              'bg-gradient-to-b from-slate-100 to-slate-50 border-slate-300',
              'bg-gradient-to-b from-orange-100/60 to-orange-50/20 border-orange-300'
            ];
            const badges = ['👑 1.º Lugar', '🥈 2.º Lugar', '🥉 3.º Lugar'];

            return (
              <div
                key={st.userId}
                className={`rounded-3xl p-5 border text-center flex flex-col items-center justify-between ${podiumColors[idx]}`}
              >
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-2">
                  {badges[idx]}
                </span>
                <UserAvatar avatarId={st.avatar} size="lg" />
                <div className="mt-3">
                  <h3 className="font-display font-bold text-sm text-slate-900">{st.name}</h3>
                  <span className="text-[11px] text-slate-500 font-medium">{st.levelTitle}</span>
                </div>
                <div className="mt-3 px-3 py-1 rounded-xl bg-white border border-slate-200 font-mono font-bold text-xs text-amber-800 shadow-2xs">
                  {st.xp} XP
                </div>
              </div>
            );
          })}
        </div>

        {/* Full Table */}
        <div className="rounded-2xl border border-slate-200 overflow-hidden mt-6">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-3.5 text-center w-14">Pos.</th>
                <th className="p-3.5">Aluno</th>
                <th className="p-3.5">Nível</th>
                <th className="p-3.5 text-center">Distintivos</th>
                <th className="p-3.5 text-right font-mono">Experiência (XP)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s, idx) => {
                const isUser = s.userId === 'aluno-alex';

                return (
                  <tr
                    key={s.userId}
                    className={`transition-colors ${
                      isUser ? 'bg-amber-50/50 font-bold' : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <td className="p-3.5 text-center font-mono font-bold text-slate-700">
                      #{idx + 1}
                    </td>
                    <td className="p-3.5 flex items-center gap-3">
                      <UserAvatar avatarId={s.avatar} size="sm" />
                      <div>
                        <span className="font-semibold text-slate-900 block">
                          {s.name} {isUser && '(Tu)'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {s.userId}
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-700">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                        {s.levelTitle}
                      </span>
                    </td>
                    <td className="p-3.5 text-center font-mono text-slate-700">
                      {s.badgesCount} 🏅
                    </td>
                    <td className="p-3.5 text-right font-mono font-bold text-amber-800 text-sm">
                      {s.xp} XP
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
