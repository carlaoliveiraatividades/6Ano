import React from 'react';
import { ShieldCheck, School, Users, Award, Database, Settings } from 'lucide-react';
import { DEMO_CLASS_STUDENTS } from '../data/initialData';
import { WORLDS_DATA } from '../data/worldsData';

export const AdminView: React.FC = () => {
  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-md">
        <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
          Administração Geral do Agrupamento de Escolas
        </span>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl mt-2">
          Painel de Coordenação TIC
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
          Supervisão global das turmas de 6.º ano, configuração de parâmetros letivos e conformidade com as diretrizes do Ministério da Educação e DGE.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold mb-3">
            <School className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase">Turmas Ativas</span>
          <p className="text-2xl font-black text-slate-900 mt-0.5">8 Turmas (6.º Ano)</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold mb-3">
            <Users className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase">Alunos Registados</span>
          <p className="text-2xl font-black text-slate-900 mt-0.5">184 Alunos</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold mb-3">
            <Award className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase">Distintivos Emitidos</span>
          <p className="text-2xl font-black text-slate-900 mt-0.5">642</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase">Segurança e RGPD</span>
          <p className="text-2xl font-black text-emerald-600 mt-0.5">100% Conforme</p>
        </div>
      </div>

      {/* System Settings & Curriculum Status */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
        <h2 className="font-display font-extrabold text-xl text-slate-900">
          Estrutura Curricular e Ativação dos 5 Mundos
        </h2>

        <div className="space-y-3">
          {WORLDS_DATA.map(w => (
            <div key={w.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                  M{w.number}
                </span>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{w.title}</h4>
                  <span className="text-xs text-slate-500">{w.theme} • {w.activitiesCount} atividades formativas</span>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                Ativo em Todas as Turmas
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
