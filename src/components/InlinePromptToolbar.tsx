import React, { useState } from 'react';
import { Sparkles, FileText, Languages, Briefcase, Wand2, Send, X, AlignLeft } from 'lucide-react';

interface InlinePromptToolbarProps {
  position: { top: number; left: number };
  selectedText: string;
  isDarkMode?: boolean;
  accentColor?: string;
  onExecuteAction: (actionType: string, customPrompt?: string) => void;
  onClose: () => void;
}

export default function InlinePromptToolbar({
  position,
  selectedText,
  isDarkMode = false,
  accentColor = '#1d4ed8',
  onExecuteAction,
  onClose,
}: InlinePromptToolbarProps) {
  const [customInput, setCustomInput] = useState('');
  const [showInput, setShowInput] = useState(false);

  const quickActions = [
    { id: 'reformat', label: 'Reformatter', icon: AlignLeft },
    { id: 'summarize', label: 'Résumer', icon: FileText },
    { id: 'translate', label: 'Traduire', icon: Languages },
    { id: 'formal', label: 'Rendre formel', icon: Briefcase },
    { id: 'style', label: 'Corriger le style', icon: Wand2 },
  ];

  const handleSubmitCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    onExecuteAction('custom', customInput.trim());
    setCustomInput('');
    setShowInput(false);
  };

  return (
    <div
      className={`fixed z-50 transform -translate-x-1/2 -translate-y-full mb-3 rounded-2xl shadow-2xl border backdrop-blur-md p-2 transition-all duration-200 animate-scaleUp ${
        isDarkMode
          ? 'bg-slate-900/95 border-slate-700 text-slate-100 shadow-slate-950/80'
          : 'bg-white/95 border-slate-200 text-slate-800 shadow-slate-300/80'
      }`}
      style={{
        top: Math.max(70, position.top),
        left: Math.max(160, Math.min(window.innerWidth - 160, position.left)),
      }}
    >
      <div className="flex items-center space-x-1.5 px-1 py-0.5">
        {/* Main ManixGPT Brand Badge */}
        <div
          className="flex items-center space-x-1 px-2.5 py-1 rounded-xl text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs"
          style={{ backgroundColor: accentColor }}
          onClick={() => setShowInput(!showInput)}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Demander à ManixGPT</span>
        </div>

        {/* Quick Action Buttons */}
        {!showInput && (
          <div className="flex items-center space-x-1 overflow-x-auto max-w-md scrollbar-none">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => onExecuteAction(action.id)}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl text-xs font-medium transition cursor-pointer shrink-0 ${
                    isDarkMode
                      ? 'bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white'
                      : 'bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700'
                  }`}
                  title={action.label}
                >
                  <Icon className="w-3.5 h-3.5 text-blue-500" />
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Custom Input Field */}
        {showInput && (
          <form onSubmit={handleSubmitCustom} className="flex items-center space-x-1.5 pl-1">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Que voulez-vous faire avec ce texte ?..."
              autoFocus
              className={`w-64 px-3 py-1 text-xs rounded-xl border focus:outline-none focus:ring-2 ${
                isDarkMode
                  ? 'bg-slate-950 border-slate-700 text-slate-100 focus:ring-blue-500'
                  : 'bg-slate-50 border-slate-300 text-slate-800 focus:ring-blue-500'
              }`}
            />
            <button
              type="submit"
              disabled={!customInput.trim()}
              className="p-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 transition cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className={`p-1 rounded-lg transition cursor-pointer ml-1 ${
            isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
          }`}
          title="Fermer la barre d'outils flottante"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
