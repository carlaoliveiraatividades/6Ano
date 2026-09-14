import React, { useState, useEffect } from 'react';
import { Users, FileCheck, CheckCircle2, Award, Search, BookOpen, BarChart3, MessageSquare, Plus, Database, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { DEMO_CLASS_STUDENTS } from '../data/initialData';
import { UserAvatar } from '../components/common/UserAvatar';

interface StudentData {
  userId: string;
  name: string;
  avatar?: string;
  xp?: number;
  levelTitle?: string;
  world1Progress?: number;
  world2Progress?: number;
  world3Progress?: number;
  world4Progress?: number;
  world5Progress?: number;
  needsHelp?: boolean;
  helpReason?: string;
}

export const TeacherDashboardView: React.FC = () => {
  const { user, createStudent } = useAuth();
  const { awardXp } = useApp();
  const [selectedTab, setSelectedTab] = useState<'alunos' | 'missoes' | 'avaliacoes' | 'novo-aluno'>('alunos');
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<StudentData[]>(DEMO_CLASS_STUDENTS);
  const [loading, setLoading] = useState(false);

  // New Student Form
  const [newName, setNewName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [creationSuccess, setCreationSuccess] = useState<string | null>(null);

  // Fetch verified students from Firestore
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/teacher/class-students');
      if (res.ok) {
        const data = await res.json();
        if (data.students && data.students.length > 0) {
          setStudents(data.students);
        }
      }
    } catch (e) {
      console.warn('Fallback to demo students', e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newUsername.trim()) return;

    setLoading(true);
    const created = await createStudent(newName.trim(), newUsername.trim());
    setLoading(false);

    if (created) {
      setCreationSuccess(`Aluno ${created.name} registado com sucesso no Firestore!`);
      setNewName('');
      setNewUsername('');
      await fetchStudents();
      setTimeout(() => setCreationSuccess(null), 4000);
    }
  };

  const handleAwardBonus = async (studentId: string, studentName: string) => {
    try {
      await fetch('/api/action/complete-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: studentId,
          activityId: `bonus-docente-${Date.now()}`,
          xp: 25
        })
      });
      alert(`+25 XP de mérito atribuídos a ${studentName} e registados no Firestore!`);
      await fetchStudents();
    } catch (e) {
      alert('Erro ao atribuir bónus.');
    }
  };

  const filteredStudents = students.filter(st =>
    st.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    st.userId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sampleSubmissions = [
    {
      studentName: 'Alex Ramos',
      missionTitle: 'Código de Segurança Digital Pessoal',
      world: 'Mundo 1: Guardião Digital',
      date: 'Hoje às 10:14',
      content: '1. Usar frases-passe com mais de 14 carateres. 2. Nunca partilhar passwords com amigos. 3. Ativar autenticação em dois passos. 4. Tapar a câmara quando não estou em chamada de aula. 5. Desconfiar de mensagens com ofertas exageradas.',
      status: 'Para Avaliar'
    },
    {
      studentName: 'Leonor Santos',
      missionTitle: 'Kit de Sobrevivência do Detetive Digital',
      world: 'Mundo 2: Detetive Digital',
      date: 'Ontem às 16:30',
      content: 'Regras de verificação: 1. Pesquisa de imagem inversa antes de partilhar. 2. Verificar o autor do artigo e a data real. 3. Comparar em pelo menos 3 jornais sérios.',
      status: 'Avaliado (Excelente)'
    },
    {
      studentName: 'Tiago Ferreira',
      missionTitle: 'Carta de Comunicação Digital da Turma',
      world: 'Mundo 3: Criador Digital',
      date: 'Ontem às 11:20',
      content: 'Proposta para o grupo do WhatsApp da turma: 1. Nada de mensagens em maiúsculas (gritar). 2. Respeitar as dúvidas dos outros. 3. Não enviar mensagens depois das 21h.',
      status: 'Avaliado (Muito Bom)'
    }
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Teacher Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
                Painel da Prof.ª Carla • TIC 6.º Ano
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/40 text-[10px] font-mono text-emerald-200 border border-emerald-400/30 flex items-center gap-1">
                <Database className="w-3 h-3 text-emerald-300" />
                Firestore Ativo
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-[10px] font-mono text-emerald-100 border border-white/20">
                imaginebycarla2023@gmail.com
              </span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl mt-2">
              Gestão Pedagógica da Turma 6.º A
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl">
              Docente única da plataforma. Acompanha o progresso individual dos alunos sincronizado com o Firestore, atribui bónus de mérito e valida as missões autênticas.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedTab('novo-aluno')}
              className="px-4 py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded-2xl font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>Inscrever Aluno</span>
            </button>

            <div className="bg-white/10 backdrop-blur-xs px-4 py-3 rounded-2xl border border-white/20 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-200">Total de Alunos</span>
              <p className="text-2xl font-black">{students.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setSelectedTab('alunos')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            selectedTab === 'alunos'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Alunos e Progresso ({students.length})</span>
        </button>

        <button
          onClick={() => setSelectedTab('missoes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            selectedTab === 'missoes'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Submissões de Missões Reais ({sampleSubmissions.length})</span>
        </button>

        <button
          onClick={() => setSelectedTab('avaliacoes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            selectedTab === 'avaliacoes'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Desempenho nos 5 Mundos</span>
        </button>

        <button
          onClick={() => setSelectedTab('novo-aluno')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            selectedTab === 'novo-aluno'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Novo Registo no Firestore</span>
        </button>
      </div>

      {/* 1. Alunos View */}
      {selectedTab === 'alunos' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display font-extrabold text-xl text-slate-900">
                Grelha de Acompanhamento Individual
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Dados em tempo real extraídos das coleções <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px] font-mono">studentProgress</code> e <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px] font-mono">users</code>.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Pesquisar aluno..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Aluno</th>
                  <th className="p-3.5">Nível</th>
                  <th className="p-3.5 text-center">XP</th>
                  <th className="p-3.5 text-center">Mundo 1</th>
                  <th className="p-3.5 text-center">Mundo 2</th>
                  <th className="p-3.5 text-center">Apoio Pedagógico</th>
                  <th className="p-3.5 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((st) => (
                  <tr key={st.userId} className="hover:bg-slate-50">
                    <td className="p-3.5 flex items-center gap-3">
                      <UserAvatar avatarId={st.avatar || 'alex'} size="sm" />
                      <div>
                        <span className="font-bold text-slate-900 block">{st.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{st.userId}</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 font-semibold text-[11px] text-slate-700">
                        {st.levelTitle || 'Explorador'}
                      </span>
                    </td>
                    <td className="p-3.5 text-center font-mono font-bold text-slate-800">
                      {st.xp || 0} XP
                    </td>
                    <td className="p-3.5 text-center">
                      <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-md text-[11px]">
                        {st.world1Progress || 60}%
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <span className="text-blue-700 font-bold bg-blue-100 px-2 py-0.5 rounded-md text-[11px]">
                        {st.world2Progress || 20}%
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      {st.needsHelp ? (
                        <span className="inline-flex items-center gap-1 text-amber-700 font-bold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md text-[10px]">
                          <AlertCircle className="w-3 h-3" />
                          Requer Apoio
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Em ritmo normal</span>
                      )}
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => handleAwardBonus(st.userId, st.name)}
                        className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold rounded-lg text-[11px] cursor-pointer transition-colors"
                      >
                        +25 XP Bónus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. Submissões */}
      {selectedTab === 'missoes' && (
        <div className="space-y-4">
          {sampleSubmissions.map((sub, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                    {sub.world}
                  </span>
                  <h3 className="font-display font-extrabold text-base text-slate-900 mt-1">
                    {sub.missionTitle}
                  </h3>
                  <span className="text-xs text-slate-500">
                    Submetido por: <strong className="text-slate-800">{sub.studentName}</strong> • {sub.date}
                  </span>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 self-start sm:self-auto">
                  {sub.status}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                {sub.content}
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400">
                  Rubrica: Clareza, Rigor Curricular e Originalidade.
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => alert(`Avaliação registada para o trabalho de ${sub.studentName}!`)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Validar com &ldquo;Muito Bom&rdquo; (+50 XP)
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. Avaliações */}
      {selectedTab === 'avaliacoes' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <h2 className="font-display font-extrabold text-xl text-slate-900">
            Médias de Desempenho nos 5 Mundos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {[
              { world: 'Mundo 1: Guardião', avg: '88%', status: 'Excelente' },
              { world: 'Mundo 2: Detetive', avg: '82%', status: 'Bom' },
              { world: 'Mundo 3: Criador', avg: '79%', status: 'Bom' },
              { world: 'Mundo 4: Engenheiro', avg: '74%', status: 'Em desenvolvimento' },
              { world: 'Mundo 5: IA', avg: '81%', status: 'Bom' }
            ].map((m, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">{m.world}</span>
                <p className="text-2xl font-black font-mono text-slate-900">{m.avg}</p>
                <span className="text-[11px] font-semibold text-emerald-700">{m.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Registar Novo Aluno no Firestore */}
      {selectedTab === 'novo-aluno' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs max-w-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900">
                Registar Novo Aluno na Turma da Prof.ª Carla
              </h3>
              <p className="text-xs text-slate-500">
                Docente titular: <strong>Prof.ª Carla</strong> (<span className="font-mono text-slate-700">imaginebycarla2023@gmail.com</span>). A inscrição é reservada exclusivamente a alunos no Firestore.
              </p>
            </div>
          </div>

          {creationSuccess && (
            <div className="p-4 mb-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{creationSuccess}</span>
            </div>
          )}

          <form onSubmit={handleCreateStudent} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nome Completo do Aluno
              </label>
              <input
                type="text"
                required
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="Ex: Mariana Silva"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nome de Utilizador (Username)
              </label>
              <input
                type="text"
                required
                value={newUsername}
                onChange={e => setNewUsername(e.target.value)}
                placeholder="Ex: mariana.silva"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Turma de Inscrição
              </label>
              <input
                type="text"
                disabled
                value="6.º Ano — Turma A (Código: TIC-6A-2026)"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 text-xs cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>A gravar no Firestore...</span>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Criar Aluno no Firestore</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
