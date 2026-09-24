import React, { useState, useEffect } from 'react';
import { Search, Sparkles, FileText, Table, Layout, Moon, Sun, Download, CheckCircle, Wand2, Shield, X, ArrowRight, Grid, FilePlus } from 'lucide-react';

export interface CommandItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'word' | 'ai';
  icon: React.ElementType;
  badge?: string;
  action: () => void;
}

interface CommandPaletteModalProps {
  isOpen: boolean;
  isDarkMode?: boolean;
  accentColor?: string;
  onClose: () => void;
  onSelectTemplate?: (template: any) => void;
  onOpenDoc?: (doc: any) => void;
  onExecuteAiAction?: (command: string) => void;
  onTriggerRibbonAction?: (actionId: string) => void;
  recentDocs?: any[];
}

export default function CommandPaletteModal({
  isOpen,
  isDarkMode = false,
  accentColor = '#1d4ed8',
  onClose,
  onSelectTemplate,
  onOpenDoc,
  onExecuteAiAction,
  onTriggerRibbonAction,
  recentDocs = [],
}: CommandPaletteModalProps) {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: CommandItem[] = [
    // Word commands
    {
      id: 'new_doc',
      title: 'Nouveau document / Choisir un modèle',
      subtitle: 'Ouvrir la galerie de modèles professionnels',
      category: 'word',
      icon: FilePlus,
      action: () => {
        onTriggerRibbonAction?.('new_doc');
        onClose();
      },
    },
    {
      id: 'insert_table',
      title: 'Insérer un tableau',
      subtitle: 'Configurer un tableau de données sur mesure',
      category: 'word',
      icon: Table,
      action: () => {
        onTriggerRibbonAction?.('insert_table');
        onClose();
      },
    },
    {
      id: 'toc',
      title: 'Insérer une table des matières',
      subtitle: 'Sommaire automatique basé sur la structure des titres',
      category: 'word',
      icon: FileText,
      badge: 'Sommaire',
      action: () => {
        onTriggerRibbonAction?.('table_of_contents');
        onClose();
      },
    },
    {
      id: 'export_pdf',
      title: 'Exporter en PDF',
      subtitle: 'Générer un fichier PDF haute fidélité prêt pour impression',
      category: 'word',
      icon: Download,
      action: () => {
        onTriggerRibbonAction?.('export_pdf');
        onClose();
      },
    },
    {
      id: 'export_docx',
      title: 'Exporter en DOCX',
      subtitle: 'Enregistrer le document au format Word (.docx)',
      category: 'word',
      icon: Download,
      action: () => {
        onTriggerRibbonAction?.('export_docx');
        onClose();
      },
    },
    {
      id: 'dark_mode',
      title: 'Basculer le mode Sombre / Clair',
      subtitle: 'Changer le thème d\'affichage de l\'application',
      category: 'word',
      icon: isDarkMode ? Sun : Moon,
      action: () => {
        onTriggerRibbonAction?.('dark_mode');
        onClose();
      },
    },
    {
      id: 'grammar_check',
      title: 'Analyser l\'orthographe et la grammaire',
      subtitle: 'Vérification linguistique intégrale en temps réel',
      category: 'word',
      icon: CheckCircle,
      action: () => {
        onTriggerRibbonAction?.('open_grammar');
        onClose();
      },
    },
    // AI commands
    {
      id: 'ai_reformat',
      title: 'Reformater la page avec ManixGPT',
      subtitle: 'Mise en page aérée et titres élégants',
      category: 'ai',
      icon: Wand2,
      badge: 'ManixGPT',
      action: () => {
        onExecuteAiAction?.('Reformate la page en gardant les titres très élégants');
        onClose();
      },
    },
    {
      id: 'ai_summarize',
      title: 'Résumer l\'ensemble du document',
      subtitle: 'Créer un résumé exécutif structuré en puces',
      category: 'ai',
      icon: Sparkles,
      badge: 'ManixGPT',
      action: () => {
        onExecuteAiAction?.('Fais une synthèse résumée en points clés');
        onClose();
      },
    },
    {
      id: 'ai_formal_tone',
      title: 'Rendre le ton plus professionnel',
      subtitle: 'Soutenir le niveau de langue et la rigueur du vocabulaire',
      category: 'ai',
      icon: Shield,
      badge: 'ManixGPT',
      action: () => {
        onExecuteAiAction?.('Reformule tout le texte dans un style formel et percutant');
        onClose();
      },
    },
    {
      id: 'ai_translate_en',
      title: 'Traduire le document en anglais',
      subtitle: 'Traduction fluide et fidèle avec terminologie exacte',
      category: 'ai',
      icon: Sparkles,
      badge: 'ManixGPT',
      action: () => {
        onExecuteAiAction?.('Traduis le texte en anglais professionnel');
        onClose();
      },
    },
  ];

  const filtered = commands.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.subtitle.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].action();
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-start justify-center pt-20 p-4 animate-fadeIn">
      <div
        className={`w-full max-w-2xl rounded-2xl shadow-2xl border flex flex-col overflow-hidden transition-all duration-200 ${
          isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Search Header Input */}
        <div className={`p-4 border-b flex items-center space-x-3 ${isDarkMode ? 'border-slate-800 bg-slate-950/60' : 'border-slate-100 bg-slate-50/50'}`}>
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une commande Word ou ManixGPT... (ex: Tableau, Résumer, PDF)"
            autoFocus
            className={`w-full bg-transparent text-sm focus:outline-none ${isDarkMode ? 'text-slate-100 placeholder-slate-500' : 'text-slate-800 placeholder-slate-400'}`}
          />
          <span className="text-[10px] font-mono font-semibold px-2 py-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
            ESC
          </span>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Commands List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-400">
              Aucune commande trouvée pour "{search}"
            </div>
          ) : (
            filtered.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={() => {
                    cmd.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-xl transition cursor-pointer ${
                    isSelected
                      ? isDarkMode
                        ? 'bg-slate-800 text-white'
                        : 'bg-blue-50/80 text-blue-900'
                      : isDarkMode
                      ? 'hover:bg-slate-800/50 text-slate-300'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                  style={isSelected ? { borderLeft: `3px solid ${accentColor}` } : { borderLeft: '3px solid transparent' }}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        cmd.category === 'ai'
                          ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                          : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-sm truncate">{cmd.title}</span>
                        {cmd.badge && (
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              cmd.category === 'ai'
                                ? 'bg-purple-500/20 text-purple-600 dark:text-purple-300'
                                : 'bg-blue-500/20 text-blue-600 dark:text-blue-300'
                            }`}
                          >
                            {cmd.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{cmd.subtitle}</p>
                    </div>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isSelected ? 'translate-x-1 opacity-100 text-blue-500' : 'opacity-0'
                    }`}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts info */}
        <div
          className={`px-4 py-2.5 border-t text-[11px] flex items-center justify-between ${
            isDarkMode ? 'border-slate-800 bg-slate-950/80 text-slate-400' : 'border-slate-100 bg-slate-50 text-slate-500'
          }`}
        >
          <div className="flex items-center space-x-3">
            <span><strong className="font-mono bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">↑↓</strong> Naviguer</span>
            <span><strong className="font-mono bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">Enter</strong> Exécuter</span>
          </div>
          <span className="text-slate-400">Commandes Manix Word & Intelligence Artificielle</span>
        </div>
      </div>
    </div>
  );
}
