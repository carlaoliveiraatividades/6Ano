import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Globe, 
  BookOpen, 
  Award, 
  Search, 
  Plus, 
  Database, 
  AlertCircle, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  MessageSquare, 
  Star, 
  Trash2, 
  RotateCcw, 
  TrendingUp, 
  FileText,
  Send,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { UserAvatar } from '../components/common/UserAvatar';

interface StudentData {
  userId: string;
  name: string;
  avatar?: string;
  xp?: number;
  level?: number;
  levelTitle?: string;
  unlockedWorlds?: string[];
  completedActivitiesCount?: number;
  completedSimulatorsCount?: number;
  completedMissionsCount?: number;
  world1Progress?: number;
  world2Progress?: number;
  world3Progress?: number;
  world4Progress?: number;
  world5Progress?: number;
  needsHelp?: boolean;
  helpReason?: string | null;
  badges?: string[];
}

interface WorldData {
  id: string;
  number: number;
  title: string;
  summary: string;
  color: string;
  isPublished?: boolean;
  unlockedForAll?: boolean;
  teacherNotes?: string;
  sections?: any;
}

interface SubmissionData {
  id: string;
  userId: string;
  studentName: string;
  worldId: string;
  worldTitle: string;
  missionTitle: string;
  submissionText: string;
  submittedAt: string;
  status: string;
  grade: string | null;
  teacherFeedback: string | null;
}

export const TeacherDashboardView: React.FC = () => {
  const { user, createStudent } = useAuth();
  const { addToast } = useApp();

  const [activeTab, setActiveTab] = useState<'mundos' | 'atividades' | 'alunos' | 'novo-aluno'>('mundos');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Data states
  const [students, setStudents] = useState<StudentData[]>([]);
  const [worlds, setWorlds] = useState<WorldData[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const [activityStats, setActivityStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // New Student Form
  const [newName, setNewName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [creationSuccess, setCreationSuccess] = useState<string | null>(null);

  // Notes editing state
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});

  // Grading Modal/State
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionData | null>(null);
  const [gradeInput, setGradeInput] = useState('Excelente');
  const [feedbackInput, setFeedbackInput] = useState('');
  const [xpBonusInput, setXpBonusInput] = useState(50);

  // Manual Award XP Modal/State
  const [xpModalStudent, setXpModalStudent] = useState<StudentData | null>(null);
  const [customXpAmount, setCustomXpAmount] = useState(25);
  const [customXpReason, setCustomXpReason] = useState('Participação excelente na aula de TIC');

  // Fetch all teacher data from Firestore
  const loadTeacherData = async () => {
    setLoading(true);
    try {
      // 1. Fetch worlds
      const wRes = await fetch('/api/teacher/worlds');
      if (wRes.ok) {
        const wData = await wRes.json();
        setWorlds(wData.worlds || []);
        const notesMap: Record<string, string> = {};
        (wData.worlds || []).forEach((w: WorldData) => {
          notesMap[w.id] = w.teacherNotes || '';
        });
        setEditingNotes(notesMap);
      }

      // 2. Fetch students
      const sRes = await fetch('/api/teacher/class-students');
      if (sRes.ok) {
        const sData = await sRes.json();
        setStudents(sData.students || []);
      }

      // 3. Fetch submissions
      const subRes = await fetch('/api/teacher/submissions');
      if (subRes.ok) {
        const subData = await subRes.json();
        setSubmissions(subData.submissions || []);
      }

      // 4. Fetch activity stats
      const actRes = await fetch('/api/teacher/activities');
      if (actRes.ok) {
        const actData = await actRes.json();
        setActivityStats(actData.activities || []);
      }
    } catch (e) {
      console.error('Error fetching teacher data from Firestore:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeacherData();
  }, []);

  // --- World Management Handlers ---
  const handleToggleWorldVisibility = async (worldId: string) => {
    try {
      const res = await fetch(`/api/teacher/worlds/${worldId}/toggle-visibility`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        addToast({
          title: 'Visibilidade Atualizada',
          message: `Mundo ${data.isPublished ? 'agora visível' : 'ocultado'} para os alunos no Firestore.`,
          type: 'success'
        });
        loadTeacherData();
      }
    } catch (e) {
      addToast({ title: 'Erro', message: 'Falha ao atualizar visibilidade.', type: 'error' });
    }
  };

  const handleToggleWorldUnlock = async (worldId: string) => {
    try {
      const res = await fetch(`/api/teacher/worlds/${worldId}/toggle-unlock`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        addToast({
          title: 'Estado de Desbloqueio',
          message: `Mundo ${data.unlockedForAll ? 'desbloqueado para toda a turma' : 'bloqueado por pré-requisitos'}.`,
          type: 'success'
        });
        loadTeacherData();
      }
    } catch (e) {
      addToast({ title: 'Erro', message: 'Falha ao alterar desbloqueio.', type: 'error' });
    }
  };

  const handleUnlockAllWorlds = async () => {
    if (!confirm('Desejas desbloquear os 5 Mundos para todos os alunos da turma no Firestore?')) return;
    try {
      const res = await fetch('/api/teacher/worlds/unlock-all', { method: 'POST' });
      if (res.ok) {
        addToast({
          title: 'Mundos Desbloqueados',
          message: 'Todos os 5 Mundos foram desbloqueados para a Turma 6.º A!',
          type: 'success'
        });
        loadTeacherData();
      }
    } catch (e) {
      addToast({ title: 'Erro', message: 'Falha ao desbloquear mundos.', type: 'error' });
    }
  };

  const handleSaveNotes = async (worldId: string) => {
    try {
      const notes = editingNotes[worldId] || '';
      const res = await fetch(`/api/teacher/worlds/${worldId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes })
      });
      if (res.ok) {
        addToast({
          title: 'Notas Guardadas',
          message: 'Orientações pedagógicas guardadas no Firestore.',
          type: 'success'
        });
      }
    } catch (e) {
      addToast({ title: 'Erro', message: 'Falha ao guardar notas.', type: 'error' });
    }
  };

  // --- Student Management Handlers ---
  const handleAwardXpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!xpModalStudent) return;
    try {
      const res = await fetch(`/api/teacher/students/${xpModalStudent.userId}/award-xp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: customXpAmount, reason: customXpReason })
      });
      if (res.ok) {
        addToast({
          title: 'XP Atribuído!',
          message: `+${customXpAmount} XP atribuídos a ${xpModalStudent.name} no Firestore.`,
          type: 'success'
        });
        setXpModalStudent(null);
        loadTeacherData();
      }
    } catch (e) {
      addToast({ title: 'Erro', message: 'Falha ao atribuir XP.', type: 'error' });
    }
  };

  const handleAwardBadge = async (studentId: string, studentName: string, badgeId: string, badgeName: string) => {
    try {
      const res = await fetch(`/api/teacher/students/${studentId}/award-badge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ badgeId })
      });
      if (res.ok) {
        addToast({
          title: 'Medalha Atribuída!',
          message: `Medalha "${badgeName}" concedida a ${studentName}.`,
          type: 'success'
        });
        loadTeacherData();
      }
    } catch (e) {
      addToast({ title: 'Erro', message: 'Falha ao atribuir medalha.', type: 'error' });
    }
  };

  const handleUnlockWorldsForStudent = async (studentId: string, studentName: string) => {
    try {
      const res = await fetch(`/api/teacher/students/${studentId}/unlock-worlds`, { method: 'POST' });
      if (res.ok) {
        addToast({
          title: 'Mundos Desbloqueados',
          message: `Todos os mundos foram desbloqueados para ${studentName}.`,
          type: 'success'
        });
        loadTeacherData();
      }
    } catch (e) {
      addToast({ title: 'Erro', message: 'Falha ao desbloquear mundos.', type: 'error' });
    }
  };

  const handleResetStudentProgress = async (studentId: string, studentName: string) => {
    if (!confirm(`Tens a certeza de que queres reiniciar o progresso de ${studentName}? Esta ação é guardada no Firestore.`)) return;
    try {
      const res = await fetch(`/api/teacher/students/${studentId}/reset-progress`, { method: 'POST' });
      if (res.ok) {
        addToast({
          title: 'Progresso Reiniciado',
          message: `O progresso de ${studentName} foi reposto no Firestore.`,
          type: 'info'
        });
        loadTeacherData();
      }
    } catch (e) {
      addToast({ title: 'Erro', message: 'Falha ao reiniciar progresso.', type: 'error' });
    }
  };

  const handleToggleHelp = async (student: StudentData) => {
    const newStatus = !student.needsHelp;
    const reason = newStatus ? prompt('Indica o motivo do apoio pedagógico:', student.helpReason || 'Necessita de consolidação na aula') : null;
    if (newStatus && !reason) return;

    try {
      const res = await fetch(`/api/teacher/students/${student.userId}/toggle-help`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ needsHelp: newStatus, helpReason: reason })
      });
      if (res.ok) {
        addToast({
          title: newStatus ? 'Apoio Sinalizado' : 'Apoio Concluído',
          message: `Estado pedagógico de ${student.name} atualizado no Firestore.`,
          type: 'info'
        });
        loadTeacherData();
      }
    } catch (e) {
      addToast({ title: 'Erro', message: 'Falha ao atualizar apoio.', type: 'error' });
    }
  };

  const handleDeleteStudent = async (studentId: string, studentName: string) => {
    if (!confirm(`Remover definitivamente o aluno ${studentName} do Firestore?`)) return;
    try {
      const res = await fetch(`/api/teacher/students/${studentId}`, { method: 'DELETE' });
      if (res.ok) {
        addToast({
          title: 'Aluno Removido',
          message: `${studentName} foi removido do Firestore.`,
          type: 'info'
        });
        loadTeacherData();
      }
    } catch (e) {
      addToast({ title: 'Erro', message: 'Falha ao remover aluno.', type: 'error' });
    }
  };

  // --- Submissions Grading Handler ---
  const handleGradeSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    try {
      const res = await fetch(`/api/teacher/submissions/${selectedSubmission.id}/grade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: gradeInput,
          feedback: feedbackInput || 'Excelente trabalho e dedicação aos princípios de TIC.',
          xpBonus: xpBonusInput
        })
      });
      if (res.ok) {
        addToast({
          title: 'Trabalho Avaliado!',
          message: `Classificação atribuída e +${xpBonusInput} XP creditados ao aluno no Firestore.`,
          type: 'success'
        });
        setSelectedSubmission(null);
        loadTeacherData();
      }
    } catch (e) {
      addToast({ title: 'Erro', message: 'Falha ao avaliar submissão.', type: 'error' });
    }
  };

  // --- New Student Handler ---
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
      loadTeacherData();
      setTimeout(() => setCreationSuccess(null), 4000);
    }
  };

  const filteredStudents = students.filter(st =>
    st.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    st.userId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-16">
      {/* Teacher Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
                Painel da Prof.ª Carla • TIC 6.º Ano
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-[10px] font-mono text-emerald-200 border border-emerald-400/30 flex items-center gap-1">
                <Database className="w-3 h-3 text-emerald-300" />
                Base de Dados Firestore Ativa
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-[10px] font-mono text-emerald-100 border border-white/20">
                imaginebycarla2023@gmail.com
              </span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl mt-2 tracking-tight">
              Gestão Pedagógica da Turma 6.º A
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-2xl leading-relaxed">
              Controlo total sobre os Mundos curriculares, monitorização das atividades dos alunos, avaliação de trabalhos práticos e atribuição de recompensas de mérito na base de dados Firestore.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleUnlockAllWorlds}
              className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
              title="Desbloqueia os 5 mundos para todos os alunos da turma"
            >
              <Unlock className="w-4 h-4 text-slate-900" />
              <span>Desbloquear Todos os Mundos</span>
            </button>
            <button
              onClick={loadTeacherData}
              disabled={loading}
              className="px-3.5 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Atualizar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('mundos')}
          className={`flex items-center gap-2 px-5 py-3 font-bold text-sm border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'mundos'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Gestão de Mundos ({worlds.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('atividades')}
          className={`flex items-center gap-2 px-5 py-3 font-bold text-sm border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'atividades'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Atividades & Trabalhos ({submissions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('alunos')}
          className={`flex items-center gap-2 px-5 py-3 font-bold text-sm border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'alunos'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Gestão de Alunos ({students.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('novo-aluno')}
          className={`flex items-center gap-2 px-5 py-3 font-bold text-sm border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'novo-aluno'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar Aluno</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: GESTÃO DE MUNDOS */}
      {/* ========================================================================= */}
      {activeTab === 'mundos' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-display">
                  Controlo de Visibilidade e Desbloqueio dos Mundos
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Define quais os mundos visíveis para os alunos e insere orientações pedagógicas para a aula.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  {worlds.filter(w => w.isPublished).length} / {worlds.length} Mundos Publicados
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {worlds.map(w => {
                const isPub = w.isPublished !== false;
                const isUnlockedAll = w.unlockedForAll === true;

                return (
                  <div
                    key={w.id}
                    className={`rounded-2xl border p-5 transition-all flex flex-col justify-between ${
                      isPub ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-50 border-slate-200 opacity-75'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Top Badges & Number */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-xl bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center">
                            {w.number}
                          </span>
                          <h3 className="font-display font-extrabold text-slate-900 text-base">
                            {w.title}
                          </h3>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                            isPub 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : 'bg-slate-100 text-slate-500 border-slate-200'
                          }`}>
                            {isPub ? 'Visível' : 'Oculto'}
                          </span>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                            isUnlockedAll 
                              ? 'bg-amber-50 text-amber-800 border-amber-200' 
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}>
                            {isUnlockedAll ? 'Desbloqueado p/ Todos' : 'Por Requisitos'}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {w.summary}
                      </p>

                      {/* Controls */}
                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => handleToggleWorldVisibility(w.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors border ${
                            isPub 
                              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200' 
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600'
                          }`}
                        >
                          {isPub ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          <span>{isPub ? 'Ocultar aos Alunos' : 'Tornar Visível'}</span>
                        </button>

                        <button
                          onClick={() => handleToggleWorldUnlock(w.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors border ${
                            isUnlockedAll
                              ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-200'
                              : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
                          }`}
                        >
                          {isUnlockedAll ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                          <span>{isUnlockedAll ? 'Restringir por Teste' : 'Desbloquear p/ Turma'}</span>
                        </button>
                      </div>

                      {/* Teacher Notes */}
                      <div className="pt-2">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Notas e Orientações da Prof.ª Carla:
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editingNotes[w.id] || ''}
                            onChange={e => setEditingNotes({ ...editingNotes, [w.id]: e.target.value })}
                            placeholder="ex: Resolver em pares na aula de 3.ª feira..."
                            className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-emerald-500 text-slate-800"
                          />
                          <button
                            onClick={() => handleSaveNotes(w.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                          >
                            Guardar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ATIVIDADES & TRABALHOS */}
      {/* ========================================================================= */}
      {activeTab === 'atividades' && (
        <div className="space-y-6">
          {/* Submissions to grade */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  <span>Trabalhos & Missões Submetidas pelos Alunos</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Avalia as produções reais dos alunos, atribui menção qualitativa e bónus de XP guardados no Firestore.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
                {submissions.length} Submissões Registadas
              </span>
            </div>

            <div className="space-y-4">
              {submissions.map(sub => (
                <div
                  key={sub.id}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-sm">{sub.studentName}</span>
                      <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold">
                        {sub.worldTitle}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(sub.submittedAt).toLocaleDateString('pt-PT')}
                      </span>
                      {sub.status === 'graded' ? (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          ✓ Avaliado ({sub.grade})
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold animate-pulse">
                          Pendente de Avaliação
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-xs text-slate-800">
                      {sub.missionTitle}
                    </h4>

                    <p className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200/80 font-mono text-[11px] leading-relaxed">
                      &ldquo;{sub.submissionText}&rdquo;
                    </p>

                    {sub.teacherFeedback && (
                      <p className="text-xs text-emerald-800 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                        💬 <strong>Feedback da Prof.ª Carla:</strong> {sub.teacherFeedback}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 flex items-center gap-2 self-end md:self-center">
                    <button
                      onClick={() => {
                        setSelectedSubmission(sub);
                        setGradeInput(sub.grade || 'Excelente');
                        setFeedbackInput(sub.teacherFeedback || '');
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>{sub.status === 'graded' ? 'Reavaliar' : 'Avaliar Trabalho'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Statistics per World */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 font-display mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <span>Adesão Curricular por Atividade (Turma 6.º A)</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activityStats.map((wAct: any) => (
                <div key={wAct.worldId} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-xs text-slate-900 font-display">
                      Mundo {wAct.worldNumber}: {wAct.worldTitle}
                    </h3>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Simuladores Concluídos:</span>
                      <strong className="text-slate-800">
                        {wAct.simulators?.reduce((acc: number, s: any) => acc + s.completions, 0) || 0}
                      </strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Missões Práticas:</span>
                      <strong className="text-slate-800">{wAct.mission?.completions || 0}</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Testes Sumativos:</span>
                      <strong className="text-slate-800">{wAct.assessment?.completions || 0}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: GESTÃO DE ALUNOS */}
      {/* ========================================================================= */}
      {activeTab === 'alunos' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-display">
                  Alunos da Turma 6.º A ({filteredStudents.length})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Dados sincronizados em tempo real com o Firestore. Atribui bónus de mérito, desbloqueia mundos ou sinaliza apoio pedagógico.
                </p>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Pesquisar aluno..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-emerald-500 w-full sm:w-64"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredStudents.map(st => (
                <div
                  key={st.userId}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:shadow-md transition-all space-y-4"
                >
                  {/* Top student header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <UserAvatar name={st.name} avatarId={st.avatar || 'alex'} size="lg" />
                      <div>
                        <h3 className="font-display font-bold text-slate-900 text-sm">
                          {st.name}
                        </h3>
                        <p className="text-[11px] text-slate-500 font-mono">
                          Nível {st.level || 1} • {st.levelTitle || 'Novato Digital'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                        {st.xp || 0} XP
                      </span>
                    </div>
                  </div>

                  {/* Progress bars for Worlds */}
                  <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100 text-[11px]">
                    <div className="flex justify-between font-semibold text-slate-700">
                      <span>Progresso Curricular:</span>
                      <span className="text-blue-600 font-bold">
                        {Math.round(((st.world1Progress || 0) + (st.world2Progress || 0) + (st.world3Progress || 0) + (st.world4Progress || 0) + (st.world5Progress || 0)) / 5)}% Geral
                      </span>
                    </div>
                    <div className="grid grid-cols-5 gap-1 pt-1">
                      {[st.world1Progress || 0, st.world2Progress || 0, st.world3Progress || 0, st.world4Progress || 0, st.world5Progress || 0].map((pr, idx) => (
                        <div key={idx} className="space-y-0.5 text-center">
                          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${pr}%` }} />
                          </div>
                          <span className="text-[9px] text-slate-500">M{idx + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Needs Help Banner */}
                  {st.needsHelp && (
                    <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Apoio Solicitado:</strong> {st.helpReason || 'Necessita de acompanhamento na matéria.'}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setXpModalStudent(st);
                        setCustomXpAmount(25);
                      }}
                      className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      title="Atribuir bónus de mérito"
                    >
                      <Star className="w-3.5 h-3.5 text-amber-600" />
                      <span>+XP Mérito</span>
                    </button>

                    <button
                      onClick={() => handleAwardBadge(st.userId, st.name, 'badge-mestre', 'Mestre de TIC')}
                      className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      title="Conceder medalha"
                    >
                      <Award className="w-3.5 h-3.5 text-purple-600" />
                      <span>Medalha</span>
                    </button>

                    <button
                      onClick={() => handleUnlockWorldsForStudent(st.userId, st.name)}
                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      title="Desbloquear mundos para este aluno"
                    >
                      <Unlock className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Desbloquear</span>
                    </button>

                    <button
                      onClick={() => handleToggleHelp(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors border ${
                        st.needsHelp 
                          ? 'bg-rose-100 text-rose-900 border-rose-300' 
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                      title="Alternar sinalizador de apoio"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{st.needsHelp ? 'Concluir Apoio' : 'Sinalizar Apoio'}</span>
                    </button>

                    <button
                      onClick={() => handleResetStudentProgress(st.userId, st.name)}
                      className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                      title="Reiniciar progresso do aluno"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDeleteStudent(st.userId, st.name)}
                      className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold cursor-pointer transition-colors ml-auto"
                      title="Remover aluno"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: ADICIONAR NOVO ALUNO */}
      {/* ========================================================================= */}
      {activeTab === 'novo-aluno' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-xl mx-auto shadow-xs">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
              <Plus className="w-6 h-6" />
            </div>
            <h2 className="font-display font-extrabold text-xl text-slate-900">
              Registar Novo Aluno na Turma 6.º A
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              O novo aluno será gravado diretamente no Firestore e ficará imediatamente disponível para entrar na plataforma.
            </p>
          </div>

          {creationSuccess && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2">
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
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="ex: Mariana Silva"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Identificador / Nome de Utilizador
              </label>
              <input
                type="text"
                value={newUsername}
                onChange={e => setNewUsername(e.target.value)}
                placeholder="ex: mariana.silva"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !newName.trim() || !newUsername.trim()}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Gravar Aluno no Firestore</span>
            </button>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: AVALIAR TRABALHO / SUBMISSÃO */}
      {/* ========================================================================= */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 animate-in fade-in">
            <h3 className="font-display font-extrabold text-lg text-slate-900 mb-1">
              Avaliar Missão: {selectedSubmission.studentName}
            </h3>
            <p className="text-xs text-slate-500 mb-4 font-mono">
              {selectedSubmission.worldTitle} • {selectedSubmission.missionTitle}
            </p>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-700 mb-4 max-h-36 overflow-y-auto">
              <strong>Trabalho submetido pelo aluno:</strong>
              <p className="mt-1 font-mono text-[11px] leading-relaxed">&ldquo;{selectedSubmission.submissionText}&rdquo;</p>
            </div>

            <form onSubmit={handleGradeSubmission} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Classificação Qualitativa
                </label>
                <select
                  value={gradeInput}
                  onChange={e => setGradeInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-800"
                >
                  <option value="Excelente">Excelente (Domínio Pleno)</option>
                  <option value="Muito Bom">Muito Bom (Acima da Média)</option>
                  <option value="Bom">Bom (Cumpre os Objetivos)</option>
                  <option value="Suficiente">Suficiente (A Necessitar de Ajustes)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Bónus de Experiência (XP)
                </label>
                <input
                  type="number"
                  value={xpBonusInput}
                  onChange={e => setXpBonusInput(Number(e.target.value))}
                  min={10}
                  max={200}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Comentário / Feedback da Professora
                </label>
                <textarea
                  value={feedbackInput}
                  onChange={e => setFeedbackInput(e.target.value)}
                  rows={3}
                  placeholder="Escreve uma mensagem de incentivo ou sugestão de melhoria..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedSubmission(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Gravar Avaliação</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ATRIBUIR XP DE MÉRITO */}
      {/* ========================================================================= */}
      {xpModalStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-in fade-in">
            <h3 className="font-display font-extrabold text-base text-slate-900 mb-1 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500" />
              <span>Atribuir XP de Mérito: {xpModalStudent.name}</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Recompensa o aluno por dedicação, cooperação ou participação na aula de TIC.
            </p>

            <form onSubmit={handleAwardXpSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Quantidade de XP
                </label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {[25, 50, 100].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setCustomXpAmount(amt)}
                      className={`py-2 rounded-xl text-xs font-mono font-bold border transition-colors cursor-pointer ${
                        customXpAmount === amt 
                          ? 'bg-amber-100 border-amber-400 text-amber-900' 
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      +{amt} XP
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={customXpAmount}
                  onChange={e => setCustomXpAmount(Number(e.target.value))}
                  min={5}
                  max={500}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Motivo / Observação Pedagógica
                </label>
                <input
                  type="text"
                  value={customXpReason}
                  onChange={e => setCustomXpReason(e.target.value)}
                  placeholder="ex: Apoio prestado ao colega de grupo..."
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setXpModalStudent(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Star className="w-3.5 h-3.5" />
                  <span>Atribuir Bónus</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
