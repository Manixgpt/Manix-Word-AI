import React from 'react';
import { Sparkles, Loader, CheckCircle2, FileText, Wand2 } from 'lucide-react';

interface GenerationProgressOverlayProps {
  isVisible: boolean;
  promptTitle?: string;
  currentStep: number; // 0 to totalSteps - 1
  totalSteps?: number;
  stepMessages?: string[];
  isDarkMode?: boolean;
  accentColor?: string;
}

export default function GenerationProgressOverlay({
  isVisible,
  promptTitle = 'Génération du document en cours...',
  currentStep = 0,
  totalSteps = 4,
  stepMessages = [
    'Analyse du sujet et définition de la structure générale...',
    'Rédaction approfondie des sous-titres et arguments...',
    'Optimisation typographique, styles et mise en page...',
    'Auto-vérification de cohérence et finalisation...'
  ],
  isDarkMode = false,
  accentColor = '#1d4ed8',
}: GenerationProgressOverlayProps) {
  if (!isVisible) return null;

  const percentage = Math.min(100, Math.round(((currentStep + 1) / totalSteps) * 100));

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-slideUp">
      <div
        className={`p-5 rounded-2xl shadow-2xl border backdrop-blur-md transition-all ${
          isDarkMode
            ? 'bg-slate-900/95 border-slate-700 text-slate-100 shadow-slate-950/80'
            : 'bg-white/95 border-slate-200 text-slate-800 shadow-slate-400/40'
        }`}
      >
        <div className="flex items-center space-x-3 mb-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 animate-pulse shadow-md"
            style={{ backgroundColor: accentColor }}
          >
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-sm truncate">{promptTitle}</h4>
            <p className="text-xs text-slate-400 font-medium">ManixGPT rédige votre document en direct</p>
          </div>
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full text-white shrink-0 shadow-xs"
            style={{ backgroundColor: accentColor }}
          >
            {percentage}%
          </span>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mb-3">
          <div
            className="h-full transition-all duration-500 ease-out rounded-full relative overflow-hidden"
            style={{ width: `${percentage}%`, backgroundColor: accentColor }}
          >
            <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
          </div>
        </div>

        {/* Live Step Message */}
        <div className="flex items-center space-x-2 text-xs font-medium text-slate-600 dark:text-slate-300">
          <Loader className="w-3.5 h-3.5 text-blue-500 animate-spin shrink-0" />
          <span className="truncate">{stepMessages[currentStep] || 'Finalisation en cours...'}</span>
        </div>
      </div>
    </div>
  );
}
