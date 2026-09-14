import React, { useState, useEffect } from 'react';
import { Trophy, Search, Medal, Star, ShieldCheck, Filter, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DEMO_CLASS_STUDENTS } from '../data/initialData';
import { UserAvatar } from '../components/common/UserAvatar';

export const RankingView: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [rankings, setRankings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRankings = async () => {
    setLoading(true);
    try {
      const url = selectedClass === 'all' ? '/api/rankings' : `/api/rankings?classId=${selectedClass}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.rankings && Array.isArray(data.rankings) && data.rankings.length > 0) {
          setRankings(data.rankings);
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Fallback to local rankings:', e);
    }

    // Fallback if offline / server loading
    const fallback = DEMO_CLASS_STUDENTS.map(s => {
      if (s.userId === user?.id && user) {
        return {
          id: user.id,
          nickname: user.nickname || user.name,
          avatar: user.avatar,
          className: user.className || '6.º A',
          classId: user.classId || 'turma-6a',
          xp: user.xp,
          level: user.level,
          levelTitle: user.levelTitle,
          badgesCount: user.badges.length
        };
      }
      return {
        id: s.userId,
        nickname: s.nickname || s.name,
        avatar: s.avatar,
        className: s.className || '6.º A',
        classId: 'turma-6a',
        xp: s.xp,
        level: s.level,
        levelTitle: s.levelTitle,
        badgesCount: Math.max(1, Math.floor(s.level * 0.8))
      };
    }).sort((a, b) => b.xp - a.xp);

    setRankings(fallback);
    setLoading(false);
  };

  useEffect(() => {
    fetchRankings();
  }, [selectedClass]);

  // Apply search filter
  const filtered = rankings.filter(s => {
    const nick = (s.nickname || s.name || '').toLowerCase();
    const query = searchTerm.toLowerCase();
    return nick.includes(query);
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
            Comunidade Escolar • Mestres Digitais TIC
          </span>
          <div className="flex items-center gap-1.5 text-xs text-amber-100 bg-black/20 px-3 py-1 rounded-full">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>Privacidade Ativa: Apenas Nicknames Públicos</span>
          </div>
        </div>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl mt-2">
          Classificação de Alunos & Mestres TIC
        </h1>
        <p className="text-xs sm:text-sm text-amber-100 mt-1 max-w-xl">
          Ganha XP ao completar mundos, simuladores e missões. O teu Nickname único representa-te perante a comunidade escolar.
        </p>
      </div>

      {/* Leaderboard Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-extrabold text-xl text-slate-900">
              Tabela de Mestres Digitais
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Atualização contínua com base no XP acumulado em todas as atividades formativas.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
            {/* Class Filter */}
            <div className="relative w-full sm:w-40">
              <select
                value={selectedClass}
                onChange={e => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-slate-50 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-hidden cursor-pointer"
              >
                <option value="all">Todas as Turmas</option>
                <option value="turma-6a">Turma 6.º A</option>
                <option value="turma-6b">Turma 6.º B</option>
                <option value="turma-6c">Turma 6.º C</option>
                <option value="turma-6d">Turma 6.º D</option>
                <option value="turma-6e">Turma 6.º E</option>
                <option value="turma-6f">Turma 6.º F</option>
              </select>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-56">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Pesquisar por Nickname..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchRankings}
              disabled={loading}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
              title="Atualizar ranking"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Top 3 Podium Cards */}
        {filtered.length >= 3 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {filtered.slice(0, 3).map((st, idx) => {
              const podiumColors = [
                'bg-gradient-to-b from-amber-100/70 to-amber-50/20 border-amber-300 ring-2 ring-amber-200',
                'bg-gradient-to-b from-slate-100 to-slate-50 border-slate-300',
                'bg-gradient-to-b from-orange-100/60 to-orange-50/20 border-orange-300'
              ];
              const badges = ['👑 1.º Lugar', '🥈 2.º Lugar', '🥉 3.º Lugar'];
              const isCurrentUser = user && (st.id === user.id || st.nickname === user.nickname);

              return (
                <div
                  key={st.id || idx}
                  className={`rounded-3xl p-5 border text-center flex flex-col items-center justify-between ${podiumColors[idx]}`}
                >
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-2">
                    {badges[idx]}
                  </span>
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-md overflow-hidden flex items-center justify-center">
                    <UserAvatar avatar={st.avatar} name={st.nickname} size="lg" />
                  </div>
                  <div className="mt-3">
                    <h3 className="font-display font-bold text-sm text-slate-900 flex items-center justify-center gap-1">
                      <span>{st.nickname}</span>
                      {isCurrentUser && <span className="text-[10px] text-amber-600 font-extrabold">(Tu)</span>}
                    </h3>
                    <span className="text-[11px] text-slate-500 font-medium block">{st.levelTitle || 'Mestre Digital'}</span>
                    <span className="text-[10px] text-slate-400">{st.className || '6.º Ano'}</span>
                  </div>
                  <div className="mt-3 px-3 py-1 rounded-xl bg-white border border-slate-200 font-mono font-bold text-xs text-amber-800 shadow-2xs">
                    {st.xp} XP
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Full Table */}
        <div className="rounded-2xl border border-slate-200 overflow-hidden mt-6">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-3.5 text-center w-14">Pos.</th>
                <th className="p-3.5">Nickname do Aluno</th>
                <th className="p-3.5">Turma</th>
                <th className="p-3.5">Nível</th>
                <th className="p-3.5 text-center">Distintivos</th>
                <th className="p-3.5 text-right font-mono">Experiência (XP)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s, idx) => {
                const isUser = user && (s.id === user.id || s.nickname === user.nickname);

                return (
                  <tr
                    key={s.id || idx}
                    className={`transition-colors ${
                      isUser ? 'bg-amber-50/70 font-bold' : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <td className="p-3.5 text-center font-mono font-bold text-slate-700">
                      #{idx + 1}
                    </td>
                    <td className="p-3.5 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                        <UserAvatar avatar={s.avatar} name={s.nickname} size="sm" />
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900 block">
                          {s.nickname} {isUser && <span className="text-amber-600 font-extrabold">(Tu)</span>}
                        </span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          Mestre TIC
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-600 font-medium">
                      {s.className || '6.º Ano'}
                    </td>
                    <td className="p-3.5 text-slate-700">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                        {s.levelTitle || `Nível ${s.level || 1}`}
                      </span>
                    </td>
                    <td className="p-3.5 text-center font-mono text-slate-700">
                      {s.badgesCount || 1} 🏅
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
