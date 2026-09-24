import React, { useState } from 'react';
import { Sparkles, Wand2, CheckCircle2, ArrowRight, ShieldCheck, X } from 'lucide-react';

interface ProactiveSuggestionsPopoverProps {
  content: string;
  isDarkMode?: boolean;
  accentColor?: string;
  onApplyFix: (fixType: string, promptInstruction: string) => void;
}

export default function ProactiveSuggestionsPopover({
  content,
  isDarkMode = false,
  accentColor = '#1d4ed8',
  onApplyFix,
}: ProactiveSuggestionsPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Analyze content for proactive style suggestions
  const plainText = content.replace(/<[^>]*>?/gm, ' ');
  const sentences = plainText.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const longSentences = sentences.filter((s) => s.split(/\s+/).length > 25);
  const passiveWords = plainText.match(/\b(été|sont|furent|été faits|a été)\b/gi) || [];

  const suggestions = [];

  if (longSentences.length > 0) {
    suggestions.push({
      id: 'shorten',
      title: `${longSentences.length} phrase${longSentences.length > 1 ? 's' : ''} trop longue${longSentences.length > 1 ? 's' : ''}`,
      desc: 'Les phrases de plus de 25 mots réduisent la fluidité de lecture.',
      btnLabel: 'Raccourcir & scinder',
      instruction: 'Divise et raccourcis les phrases de plus de 25 mots pour rendre la lecture plus fluide.',
    });
  }

  if (passiveWords.length > 2) {
    suggestions.push({
      id: 'active_voice',
      title: 'Emploi fréquent de la voix passive',
      desc: 'Privilégier la voix active renforce l\'impact et l\'autorité du texte.',
      btnLabel: 'Passer en voix active',
      instruction: 'Reformule les tournures passives à la voix active directe.',
    });
  }

  suggestions.push({
    id: 'fluidity',
    title: 'Harmonisation du style et du vocabulaire',
    desc: 'Lisser le niveau de langue pour un rendu professionnel.',
    btnLabel: 'Optimiser le style',
    instruction: 'Améliore le style général, élimine la redondance et renforce le vocabulaire professionnel.',
  });

  return (
    <div className="relative inline-block">
      {/* Dynamic Status Chip */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-1.5 px-2 py-0.5 rounded transition cursor-pointer text-[11px] font-semibold ${
          suggestions.length > 1
            ? 'bg-purple-500/10 text-purple-600 dark:text-purple-300 hover:bg-purple-500/20'
            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
        }`}
        title="Suggestions proactives de style par ManixGPT"
      >
        <Sparkles className="w-3 h-3 text-purple-500 animate-pulse" />
        <span>
          {suggestions.length > 1 ? `💡 ${suggestions.length} optimisations style` : '✨ Lisibilité Impeccable'}
        </span>
      </button>

      {/* Popover Panel */}
      {isOpen && (
        <div
          className={`absolute bottom-8 left-0 z-50 w-80 rounded-2xl shadow-2xl border p-4 transition-all animate-scaleUp ${
            isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-100 shadow-slate-950/80' : 'bg-white border-slate-200 text-slate-800 shadow-slate-300/80'
          }`}
        >
          <div className="flex items-center justify-between border-b pb-2 mb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <h4 className="font-bold text-xs uppercase tracking-wide">Suggestions Proactives</h4>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {suggestions.map((sug) => (
              <div
                key={sug.id}
                className={`p-3 rounded-xl border space-y-2 ${
                  isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200">{sug.title}</h5>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">{sug.desc}</p>

                <button
                  onClick={() => {
                    onApplyFix(sug.id, sug.instruction);
                    setIsOpen(false);
                  }}
                  className="w-full py-1.5 px-3 rounded-lg text-xs font-bold text-white shadow-xs transition flex items-center justify-center space-x-1.5 cursor-pointer hover:opacity-90"
                  style={{ backgroundColor: accentColor }}
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>{sug.btnLabel}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
