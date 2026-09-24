import React from 'react';
import { Sparkles, Check, X, RefreshCw, ArrowRight, FileEdit, ShieldCheck } from 'lucide-react';

interface DiffPreviewModalProps {
  isOpen: boolean;
  originalText: string;
  proposedText: string;
  promptUsed?: string;
  isDarkMode?: boolean;
  accentColor?: string;
  onAccept: () => void;
  onReject: () => void;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
}

export default function DiffPreviewModal({
  isOpen,
  originalText,
  proposedText,
  promptUsed = 'Modification demandée à ManixGPT',
  isDarkMode = false,
  accentColor = '#1d4ed8',
  onAccept,
  onReject,
  onRegenerate,
  isRegenerating = false,
}: DiffPreviewModalProps) {
  if (!isOpen) return null;

  // Simple HTML clean display for text preview
  const cleanOriginal = originalText.replace(/<[^>]*>?/gm, '');
  const cleanProposed = proposedText.replace(/<[^>]*>?/gm, '');

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div
        className={`w-full max-w-3xl rounded-2xl shadow-2xl border flex flex-col overflow-hidden max-h-[85vh] transition-all ${
          isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Header */}
        <div
          className="px-6 py-4 flex items-center justify-between border-b text-white shrink-0"
          style={{ backgroundColor: accentColor }}
        >
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide">Aperçu avant modification (Diff Preview)</h3>
              <p className="text-xs text-white/80 font-medium truncate max-w-md">
                Consigne : <span className="italic">"{promptUsed}"</span>
              </p>
            </div>
          </div>
          <button
            onClick={onReject}
            className="p-1.5 rounded-lg hover:bg-white/20 text-white transition cursor-pointer"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Comparison Container */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400 border-b pb-2">
            <span>Comparaison des versions</span>
            <span className="flex items-center space-x-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500"></span>
              <span>Supprimé</span>
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 ml-2"></span>
              <span>Ajouté</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original Text Box */}
            <div
              className={`p-4 rounded-xl border text-sm font-sans flex flex-col ${
                isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-red-500 uppercase tracking-wide flex items-center">
                  <X className="w-3.5 h-3.5 mr-1" /> Version Origine
                </span>
                <span className="text-[10px] text-slate-400">Texte actuel</span>
              </div>
              <div className="flex-1 overflow-y-auto max-h-56 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-300 line-through decoration-red-400/60 leading-relaxed font-serif text-xs sm:text-sm">
                {cleanOriginal || <em>(Aucun texte sélectionné)</em>}
              </div>
            </div>

            {/* Proposed Text Box */}
            <div
              className={`p-4 rounded-xl border text-sm font-sans flex flex-col ${
                isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide flex items-center">
                  <Check className="w-3.5 h-3.5 mr-1" /> Proposition ManixGPT
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  Nouveau
                </span>
              </div>
              <div className="flex-1 overflow-y-auto max-h-56 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-200 font-semibold leading-relaxed font-serif text-xs sm:text-sm">
                {cleanProposed}
              </div>
            </div>
          </div>

          <div
            className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
              isDarkMode ? 'bg-slate-800/60 border-slate-700 text-slate-300' : 'bg-blue-50/70 border-blue-100 text-blue-900'
            }`}
          >
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                Examiner et valider la proposition. Cliquez sur <strong>Accepter</strong> pour remplacer instantanément le texte dans le document.
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div
          className={`px-6 py-4 border-t flex items-center justify-between shrink-0 ${
            isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          {onRegenerate ? (
            <button
              onClick={onRegenerate}
              disabled={isRegenerating}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                isDarkMode
                  ? 'border-slate-700 hover:bg-slate-800 text-slate-300'
                  : 'border-slate-300 hover:bg-white text-slate-700 shadow-xs'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin text-blue-500' : ''}`} />
              <span>{isRegenerating ? 'Régénération...' : 'Régénérer'}</span>
            </button>
          ) : (
            <div></div>
          )}

          <div className="flex items-center space-x-3">
            <button
              onClick={onReject}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition border cursor-pointer ${
                isDarkMode
                  ? 'border-slate-700 hover:bg-slate-800 text-slate-300'
                  : 'border-slate-300 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Conserver l'original
            </button>
            <button
              onClick={onAccept}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 flex items-center space-x-2 cursor-pointer"
              style={{ backgroundColor: accentColor }}
            >
              <Check className="w-4 h-4" />
              <span>Accepter la modification</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
