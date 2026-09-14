import React, { useState } from 'react';
import { Sparkles, Dices, Check, X, Palette, Smile, Glasses, Crown, Shirt } from 'lucide-react';
import { AvatarConfig } from '../../types';
import { CustomAvatar } from './CustomAvatar';
import {
  SKIN_OPTIONS,
  HAIR_OPTIONS,
  HAIR_COLOR_OPTIONS,
  EXPRESSION_OPTIONS,
  GLASSES_OPTIONS,
  HEADWEAR_OPTIONS,
  OUTFIT_OPTIONS,
  OUTFIT_COLOR_OPTIONS,
  BG_COLOR_OPTIONS,
  generateRandomAvatar
} from '../../utils/avatarUtils';

interface AvatarCreatorModalProps {
  isOpen: boolean;
  initialConfig: AvatarConfig;
  onSave: (config: AvatarConfig) => void;
  onClose: () => void;
}

type TabType = 'face' | 'hair' | 'expression' | 'glasses' | 'headwear' | 'outfit' | 'bg';

export const AvatarCreatorModal: React.FC<AvatarCreatorModalProps> = ({
  isOpen,
  initialConfig,
  onSave,
  onClose
}) => {
  const [currentConfig, setCurrentConfig] = useState<AvatarConfig>(initialConfig);
  const [activeTab, setActiveTab] = useState<TabType>('face');

  if (!isOpen) return null;

  const handleShuffle = () => {
    const randomCfg = generateRandomAvatar();
    setCurrentConfig(randomCfg);
  };

  const handleSave = () => {
    onSave(currentConfig);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-slate-900 text-base">
                Criador & Personalizador de Avatar
              </h3>
              <p className="text-xs text-slate-500">
                Personaliza a tua identidade visual para a Missão TIC
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShuffle}
              type="button"
              className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border border-amber-200"
            >
              <Dices className="w-4 h-4" />
              <span>Baralhar</span>
            </button>
            <button
              onClick={onClose}
              type="button"
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Avatar Live Preview */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <CustomAvatar config={currentConfig} size="2xl" className="shadow-lg ring-4 ring-white" />
            <span className="text-xs font-bold text-slate-700 mt-4">Pré-visualização</span>
            <span className="text-[11px] text-slate-400 text-center">
              Visível no ranking e nas missões
            </span>
          </div>

          {/* Controls & Options */}
          <div className="md:col-span-8 space-y-4">
            {/* Tabs */}
            <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('face')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  activeTab === 'face'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Pele</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('hair')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  activeTab === 'hair'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Cabelo</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('expression')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  activeTab === 'expression'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smile className="w-3.5 h-3.5" />
                <span>Expressão</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('glasses')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  activeTab === 'glasses'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Glasses className="w-3.5 h-3.5" />
                <span>Óculos</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('headwear')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  activeTab === 'headwear'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Acessório</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('outfit')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  activeTab === 'outfit'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Shirt className="w-3.5 h-3.5" />
                <span>Roupa</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('bg')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  activeTab === 'bg'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Fundo</span>
              </button>
            </div>

            {/* Tab: Skin / Pele */}
            {activeTab === 'face' && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 block">Tom de Pele / Tema</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {SKIN_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setCurrentConfig(prev => ({ ...prev, skin: opt.id }))}
                      className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                        currentConfig.skin === opt.id
                          ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-400 font-bold'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span
                        className="w-6 h-6 rounded-full border border-slate-300 shadow-xs shrink-0"
                        style={{ backgroundColor: opt.color }}
                      />
                      <span className="text-xs text-slate-800">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Hair / Cabelo */}
            {activeTab === 'hair' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-2">Estilo de Cabelo</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {HAIR_OPTIONS.map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setCurrentConfig(prev => ({ ...prev, hair: opt.id }))}
                        className={`p-2.5 rounded-xl border text-center text-xs transition-all cursor-pointer ${
                          currentConfig.hair === opt.id
                            ? 'border-blue-500 bg-blue-50 font-bold text-blue-700 ring-2 ring-blue-400'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-2">Cor do Cabelo</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {HAIR_COLOR_OPTIONS.map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setCurrentConfig(prev => ({ ...prev, hairColor: opt.id }))}
                        className={`p-2 rounded-xl border flex items-center gap-2 text-xs transition-all cursor-pointer ${
                          currentConfig.hairColor === opt.id
                            ? 'border-blue-500 bg-blue-50 font-bold text-blue-700 ring-2 ring-blue-400'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs shrink-0"
                          style={{ backgroundColor: opt.color }}
                        />
                        <span className="truncate">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Expression / Expressão */}
            {activeTab === 'expression' && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 block">Expressão Facial</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {EXPRESSION_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setCurrentConfig(prev => ({ ...prev, expression: opt.id }))}
                      className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                        currentConfig.expression === opt.id
                          ? 'border-blue-500 bg-blue-50 font-bold text-blue-700 ring-2 ring-blue-400'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-xl">{opt.emoji}</span>
                      <span className="text-xs">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Glasses / Óculos */}
            {activeTab === 'glasses' && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 block">Óculos / Headset</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {GLASSES_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setCurrentConfig(prev => ({ ...prev, glasses: opt.id }))}
                      className={`p-3 rounded-xl border text-center text-xs transition-all cursor-pointer ${
                        currentConfig.glasses === opt.id
                          ? 'border-blue-500 bg-blue-50 font-bold text-blue-700 ring-2 ring-blue-400'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Headwear / Acessório na cabeça */}
            {activeTab === 'headwear' && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 block">Acessório de Cabeça</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {HEADWEAR_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setCurrentConfig(prev => ({ ...prev, headwear: opt.id }))}
                      className={`p-3 rounded-xl border text-center text-xs transition-all cursor-pointer ${
                        currentConfig.headwear === opt.id
                          ? 'border-blue-500 bg-blue-50 font-bold text-blue-700 ring-2 ring-blue-400'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Outfit / Roupa */}
            {activeTab === 'outfit' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-2">Estilo de Roupa</label>
                  <div className="grid grid-cols-2 gap-2">
                    {OUTFIT_OPTIONS.map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setCurrentConfig(prev => ({ ...prev, outfit: opt.id }))}
                        className={`p-2.5 rounded-xl border text-center text-xs transition-all cursor-pointer ${
                          currentConfig.outfit === opt.id
                            ? 'border-blue-500 bg-blue-50 font-bold text-blue-700 ring-2 ring-blue-400'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-2">Cor da Roupa</label>
                  <div className="grid grid-cols-3 gap-2">
                    {OUTFIT_COLOR_OPTIONS.map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setCurrentConfig(prev => ({ ...prev, outfitColor: opt.id }))}
                        className={`p-2 rounded-xl border flex items-center gap-2 text-xs transition-all cursor-pointer ${
                          currentConfig.outfitColor === opt.id
                            ? 'border-blue-500 bg-blue-50 font-bold text-blue-700 ring-2 ring-blue-400'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs shrink-0"
                          style={{ backgroundColor: opt.color }}
                        />
                        <span className="truncate">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Background / Fundo */}
            {activeTab === 'bg' && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 block">Gradiente de Fundo</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {BG_COLOR_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setCurrentConfig(prev => ({ ...prev, bgColor: opt.id }))}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                        currentConfig.bgColor === opt.id
                          ? 'border-blue-500 bg-blue-50 font-bold text-blue-700 ring-2 ring-blue-400'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-full bg-gradient-to-tr ${opt.gradient} shadow-2xs shrink-0`} />
                      <span className="text-xs">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Guardar Avatar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
