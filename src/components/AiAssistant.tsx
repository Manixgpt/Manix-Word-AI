import { useState, useEffect } from 'react';
import { Sparkles, CheckCircle, FilePlus, Copy, ArrowRight, Loader, FileText, ExternalLink, Globe, Check, BookOpen, Brain, Layout, FileEdit, CheckCheck, Send, PanelRight, PanelLeft, Maximize2, Minimize2, History, RotateCcw, Trash2, X, EyeOff } from 'lucide-react';
import { SearchResultItem } from '../types';

export interface AiHistoryItem {
  id: string;
  prompt: string;
  timestamp: string;
  type: string;
  snippet: string;
}

interface AiAssistantProps {
  currentContent: string;
  onUpdateContent: (newContent: string) => void;
  onAppendContent: (htmlToAppend: string) => void;
  onExportPdf: () => void;
  onExportDocx: () => void;
  isDarkMode?: boolean;
  panelMode?: 'right' | 'left' | 'floating';
  onChangePanelMode?: (mode: 'right' | 'left' | 'floating') => void;
  accentColor?: string;
  onClose?: () => void;
}

export default function AiAssistant({
  currentContent,
  onUpdateContent,
  onAppendContent,
  onExportPdf,
  onExportDocx,
  isDarkMode = false,
  panelMode = 'right',
  onChangePanelMode,
  accentColor = '#1d4ed8',
  onClose,
}: AiAssistantProps) {
  // Active Sidebar Sub-Tab: 'outils' | 'historique'
  const [sidebarTab, setSidebarTab] = useState<'outils' | 'historique'>('outils');

  // AI History state persistent in localStorage
  const [aiHistory, setAiHistory] = useState<AiHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('manix_ai_history_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const addToHistory = (prompt: string, type: string, snippet: string) => {
    const newItem: AiHistoryItem = {
      id: `hist-${Date.now()}`,
      prompt,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      type,
      snippet: snippet.slice(0, 150) + (snippet.length > 150 ? '...' : ''),
    };
    const updated = [newItem, ...aiHistory.slice(0, 24)];
    setAiHistory(updated);
    try {
      localStorage.setItem('manix_ai_history_v1', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const clearHistory = () => {
    setAiHistory([]);
    try {
      localStorage.removeItem('manix_ai_history_v1');
    } catch (e) {
      console.error(e);
    }
  };
  // Spellchecking State
  const [spellCheckLoading, setSpellCheckLoading] = useState(false);
  const [spellCheckSuccess, setSpellCheckSuccess] = useState(false);

  // Direct Document Command State
  const [docCommand, setDocCommand] = useState('');
  const [commandLoading, setCommandLoading] = useState(false);
  const [commandSuccess, setCommandSuccess] = useState(false);

  // Internet Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<{
    summary: string;
    fullContentHtml?: string;
    keyPoints?: string[];
    sources: SearchResultItem[];
  } | null>(null);
  const [searchViewMode, setSearchViewMode] = useState<'full' | 'summary' | 'sources'>('full');

  // Document Generator Mode: 'new_doc' vs 'current_doc' (Page en cours)
  const [generatorScope, setGeneratorScope] = useState<'new_doc' | 'current_doc'>('new_doc');

  // Document Auto-generate State (New Doc)
  const [genPrompt, setGenPrompt] = useState('');
  const [genType, setGenType] = useState<string>("Rapport d'activité");
  const [genPagesCount, setGenPagesCount] = useState<number>(3);
  const [genInsertMode, setGenInsertMode] = useState<'replace' | 'append'>('replace');

  // Page en cours modification state
  const [editPrompt, setEditPrompt] = useState('');
  const [editActionType, setEditActionType] = useState<'beautify_layout' | 'add_section' | 'add_pages' | 'custom'>('custom');
  const [editPagesCount, setEditPagesCount] = useState<number>(1);

  // Deep Reflection & Verification State
  const [genLoading, setGenLoading] = useState(false);
  const [thinkingStep, setThinkingStep] = useState<number>(0);

  const thinkingMessages = [
    "Analyse de la demande & cadrage du document...",
    "Réflexion en arrière-plan & construction du plan rigoureux...",
    "Auto-vérification de cohérence, de style et d'absence de contenu générique...",
    "Mise en page typographique et finalisation du document..."
  ];

  // Animated thinking progression when loading
  useEffect(() => {
    let timer: any;
    if (genLoading) {
      setThinkingStep(0);
      timer = setInterval(() => {
        setThinkingStep((prev) => (prev < thinkingMessages.length - 1 ? prev + 1 : prev));
      }, 1800);
    } else {
      setThinkingStep(0);
    }
    return () => clearInterval(timer);
  }, [genLoading]);

  const docTypes = [
    "Décrire ton idée",
    "Rapport d'activité",
    "Lettre d'affaires",
    "Curriculum Vitae (C.V.)",
    "Contrat commercial",
    "Proposition de projet",
    "Cahier des charges",
    "Compte-rendu de réunion",
    "Facture d'honoraires",
    "Note de synthèse",
    "Article scientifique",
    "Flyer publicitaire",
    "Guide d'accueil des employés",
    "Syllabus de formation",
    "Communiqué de presse",
    "Fiche technique produit",
    "Lettre de motivation",
    "Rapport de stage",
    "Plan d'affaires / Business Plan"
  ];

  // 0. Interactive Document AI Control (Modifications chirurgicales)
  const handleDocCommand = async (customCommandStr?: string) => {
    const activeCommand = customCommandStr || docCommand;
    if (!activeCommand.trim()) return;

    setCommandLoading(true);
    setCommandSuccess(false);

    try {
      const response = await fetch('/api/ai/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: currentContent,
          command: activeCommand
        })
      });

      const data = await response.json();
      if (data.success && data.content) {
        onUpdateContent(data.content);
        setCommandSuccess(true);
        if (!customCommandStr) {
          setDocCommand('');
        }
      } else {
        alert("Échec de l'action IA : " + (data.error || "Erreur inconnue"));
      }
    } catch (err: any) {
      console.error(err);
      alert("Erreur lors de la communication de la modification sémantique.");
    } finally {
      setCommandLoading(false);
    }
  };

  // 1. Core AI - Spellcheck document
  const handleSpellcheck = async () => {
    setSpellCheckLoading(true);
    setSpellCheckSuccess(false);

    try {
      const response = await fetch('/api/ai/correct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: currentContent,
          instructions: "Corrige l'orthographe, accorde les temps, augmente la clarté et garde le style formel."
        })
      });

      const data = await response.json();
      if (data.success) {
        onUpdateContent(data.content);
        setSpellCheckSuccess(true);
      } else {
        alert("Echec de la correction : " + (data.error || "Une erreur est survenue."));
      }
    } catch (err: any) {
      console.error(err);
      alert("Erreur de connexion avec le service de correction.");
    } finally {
      setSpellCheckLoading(false);
    }
  };

  // 2. Core AI - Web Grounded Search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    setSearchResult(null);

    try {
      const response = await fetch('/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      });

      const data = await response.json();
      if (data.summary || data.fullContentHtml) {
        setSearchResult({
          summary: data.summary || "",
          fullContentHtml: data.fullContentHtml || "",
          keyPoints: data.keyPoints || [],
          sources: data.sources || []
        });
        setSearchViewMode('full');
      } else {
        alert("Aucun résultat trouvé.");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la recherche internet.");
    } finally {
      setSearchLoading(false);
    }
  };

  // 3. Core AI - Generate full documents
  const handleGenerate = async () => {
    if (!genPrompt.trim()) return;
    setGenLoading(true);

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: genPrompt,
          type: genType,
          pagesCount: genPagesCount,
          detailLevel: "exhaustif"
        })
      });

      const data = await response.json();
      if (data.success && data.content) {
        if (genInsertMode === 'append') {
          onAppendContent(data.content);
        } else {
          onUpdateContent(data.content);
        }
        setGenPrompt('');
      } else {
        alert("Échec de la génération de document : " + (data.error || "Erreur inconnue"));
      }
    } catch (err) {
      console.error(err);
      alert("Erreur serveur lors de la génération automatique.");
    } finally {
      setGenLoading(false);
    }
  };

  // 3b. Core AI - Modify Currently Opened Document (Page en cours)
  const handleEditCurrentDoc = async () => {
    if (!editPrompt.trim() && editActionType === 'custom') return;
    setGenLoading(true);

    const instructionsToSend = editPrompt.trim() || (
      editActionType === 'beautify_layout' ? 'Créer une belle mise en page professionnelle et harmonieuse sans modifier le texte existant.' :
      editActionType === 'add_section' ? 'Ajouter une section complémentaire détaillée et structurée.' :
      editActionType === 'add_pages' ? `Ajouter ${editPagesCount} page(s) supplémentaire(s) cohérente(s) avec le document.` :
      'Améliorer et enrichir le document ouvert.'
    );

    try {
      const response = await fetch('/api/ai/edit-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentContent,
          instructions: instructionsToSend,
          actionType: editActionType,
          targetPages: editActionType === 'add_pages' ? editPagesCount : undefined,
        })
      });

      const data = await response.json();
      if (data.success && data.content) {
        onUpdateContent(data.content);
        setEditPrompt('');
      } else {
        alert("Échec de la modification du document : " + (data.error || "Erreur"));
      }
    } catch (err) {
      console.error(err);
      alert("Erreur de communication lors de la mise à jour de la page en cours.");
    } finally {
      setGenLoading(false);
    }
  };

  // Insert search result into active document sheet
  const handlePasteSearchResult = (mode: 'full' | 'summary' | 'keypoints' = 'full') => {
    if (!searchResult) return;

    if (mode === 'full' && searchResult.fullContentHtml) {
      onAppendContent(searchResult.fullContentHtml);
      return;
    }

    if (mode === 'keypoints' && searchResult.keyPoints && searchResult.keyPoints.length > 0) {
      const kphtml = `
        <div style="background-color: #f8fafc; border-left: 4px solid #2b579a; padding: 14px 18px; margin: 15px 0; border-radius: 0 4px 4px 0; font-family: Calibri, sans-serif;">
          <h3 style="color: #1e3a8a; margin-top: 0; margin-bottom: 8px; font-size: 13pt; font-weight: bold; letter-spacing: -0.2px;">Points Clés de Recherche : « ${searchQuery} »</h3>
          <ul style="margin: 0; padding-left: 20px; line-height: 1.7; font-size: 11pt; color: #1e293b;">
            ${searchResult.keyPoints.map(p => `<li>${p}</li>`).join('')}
          </ul>
        </div>
      `;
      onAppendContent(kphtml);
      return;
    }

    // Create styled summary with cites to insert directly
    const citationHtml = `
      <div style="background-color: #f8fafc; border-left: 4px solid #2b579a; padding: 14px 18px; margin: 15px 0; border-radius: 0 4px 4px 0; font-family: Calibri, sans-serif;">
        <h3 style="color: #1e3a8a; margin-top: 0; margin-bottom: 8px; font-size: 13pt; font-weight: bold; letter-spacing: -0.2px;">Synthèse de Recherche : « ${searchQuery} »</h3>
        <p style="font-size: 11pt; color: #1e293b; line-height: 1.6; margin-bottom: 10px;">${searchResult.summary.replace(/\n/g, '<br/>')}</p>
        <span style="font-size: 9.5pt; color: #64748b;"><strong>Sources consultées :</strong> ${searchResult.sources.map(s => `<a href="${s.url}" style="color: #2b579a; text-decoration: underline;" target="_blank">${s.title}</a>`).join(' • ')}</span>
      </div>
    `;

    onAppendContent(citationHtml);
  };

  return (
    <div
      id="ai-assistant-sidebar"
      className={`${
        panelMode === 'floating'
          ? 'fixed top-20 right-8 z-40 w-96 max-h-[82vh] rounded-2xl shadow-2xl border backdrop-blur-md'
          : 'w-80 h-full shrink-0'
      } ${
        panelMode === 'left' ? 'border-r' : panelMode === 'right' ? 'border-l' : 'border'
      } ${
        isDarkMode ? 'border-slate-800 bg-slate-900 text-slate-200' : 'border-slate-200 bg-white text-slate-800'
      } flex flex-col font-sans select-none overflow-hidden transition-all duration-300`}
    >
      {/* Sidebar Header with Dock Controls */}
      <div className={`p-3.5 border-b ${isDarkMode ? 'border-slate-800 bg-slate-950/80' : 'border-slate-200 bg-slate-50/80'} flex items-center justify-between shrink-0`}>
        <div className="flex items-center space-x-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs"
            style={{ backgroundColor: accentColor }}
          >
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <span className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>ManixGPT</span>
            <div className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-wider">Actif</span>
            </div>
          </div>
        </div>

        {/* Panel Dock Position & Hide Controls */}
        <div className="flex items-center space-x-1.5">
          <div className="flex items-center space-x-0.5 bg-slate-200/60 dark:bg-slate-800/60 p-0.5 rounded-xl">
            <button
              onClick={() => onChangePanelMode && onChangePanelMode('left')}
              className={`p-1 rounded-lg transition cursor-pointer ${
                panelMode === 'left'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="Ancrer à gauche"
            >
              <PanelLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onChangePanelMode && onChangePanelMode('right')}
              className={`p-1 rounded-lg transition cursor-pointer ${
                panelMode === 'right'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="Ancrer à droite"
            >
              <PanelRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onChangePanelMode && onChangePanelMode('floating')}
              className={`p-1 rounded-lg transition cursor-pointer ${
                panelMode === 'floating'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="Fenêtre flottante détachée"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Dedicated Hide / Close Button */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer border border-transparent hover:border-rose-200 dark:hover:border-rose-900"
              title="Masquer le panneau ManixGPT (Raccourci: Ctrl+J)"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Sub-tab Navigation Switcher: Outils vs Historique */}
      <div className={`px-3 py-1.5 border-b flex space-x-1 ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white'}`}>
        <button
          onClick={() => setSidebarTab('outils')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center justify-center space-x-1.5 ${
            sidebarTab === 'outils'
              ? 'text-white shadow-xs'
              : isDarkMode
              ? 'text-slate-400 hover:bg-slate-800'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
          style={sidebarTab === 'outils' ? { backgroundColor: accentColor } : {}}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Outils IA</span>
        </button>

        <button
          onClick={() => setSidebarTab('historique')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center justify-center space-x-1.5 ${
            sidebarTab === 'historique'
              ? 'text-white shadow-xs'
              : isDarkMode
              ? 'text-slate-400 hover:bg-slate-800'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
          style={sidebarTab === 'historique' ? { backgroundColor: accentColor } : {}}
        >
          <History className="w-3.5 h-3.5" />
          <span>Historique ({aiHistory.length})</span>
        </button>
      </div>

      {sidebarTab === 'historique' ? (
        /* History View */
        <div className="p-4 space-y-3 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Générations récentes</span>
            {aiHistory.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-[10px] text-red-500 hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Effacer tout</span>
              </button>
            )}
          </div>

          {aiHistory.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <History className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
              <p className="text-xs text-slate-400">Aucune génération enregistrée pour cette session.</p>
            </div>
          ) : (
            aiHistory.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-xl border space-y-2 text-xs transition ${
                  isDarkMode ? 'bg-slate-950/60 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-600 dark:text-blue-400 truncate max-w-[180px]">{item.prompt}</span>
                  <span className="text-[10px] text-slate-400">{item.timestamp}</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 font-serif leading-relaxed line-clamp-3">
                  {item.snippet.replace(/<[^>]*>/g, '')}
                </p>
                <div className="flex items-center space-x-2 pt-1">
                  <button
                    onClick={() => onAppendContent(item.snippet)}
                    className="flex-1 py-1 px-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[10px] transition flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <FilePlus className="w-3 h-3" />
                    <span>Insérer</span>
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(item.snippet.replace(/<[^>]*>/g, ''));
                      alert("Texte copié dans le presse-papier !");
                    }}
                    className={`py-1 px-2 rounded border font-medium text-[10px] transition flex items-center space-x-1 cursor-pointer ${
                      isDarkMode ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-slate-300 hover:bg-white text-slate-700'
                    }`}
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copier</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Standard AI Tools View */
        <div className={`p-4 space-y-6 flex-1 divide-y overflow-y-auto ${isDarkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
        
        {/* Module 1: Commandes et actions directes IA */}
        <div className="pt-2">
          <h3 className={`text-xs font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} uppercase tracking-wider mb-2`}>1. Actions directes sur le document</h3>
          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mb-3 leading-relaxed`}>
            Consigne vocale/écrite pour appliquer un format sémantique, modifier ou remplacer du texte :
          </p>

          <div className="flex space-x-1.5 mb-3">
            <input
              id="ai-command-input"
              type="text"
              value={docCommand}
              onChange={(e) => setDocCommand(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleDocCommand();
              }}
              placeholder="Ex: Met le titre principal en gras..."
              className={`flex-1 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500' : 'bg-white border-slate-300 text-slate-700'} border rounded-lg px-2.5 py-1.5 outline-none text-xs w-full focus:border-purple-500 focus:ring-1 focus:ring-purple-500`}
            />
            <button
              id="ai-command-submit"
              onClick={() => handleDocCommand()}
              disabled={commandLoading}
              className="bg-purple-600 text-white px-3 rounded-lg hover:bg-purple-700 transition flex items-center justify-center shrink-0 cursor-pointer"
            >
              {commandLoading ? <Loader className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            </button>
          </div>

          <div className="space-y-1.5">
            <span className={`text-[10px] uppercase font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} block mb-1`}>Raccourcis Word IA :</span>
            {[
              "Met le titre principal en gras",
              "Souligne tous les contenus en gras",
              "Remplace le mot 'rapport' par 'bilan'"
            ].map((shortcutCmd) => (
              <button
                key={shortcutCmd}
                onClick={() => handleDocCommand(shortcutCmd)}
                disabled={commandLoading}
                className={`w-full text-left ${isDarkMode ? 'bg-slate-800 hover:bg-slate-750 text-purple-300 border-slate-700' : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-100'} font-medium px-2 py-1.5 rounded-md text-[11px] truncate flex items-center justify-between transition border cursor-pointer`}
              >
                <span>{shortcutCmd}</span>
                <ArrowRight className="h-3 w-3 text-purple-400 font-bold" />
              </button>
            ))}
          </div>

          {commandSuccess && (
            <div className={`mt-2 text-xs ${isDarkMode ? 'text-green-300 bg-green-950/40 border-green-800' : 'text-green-700 bg-green-50 border-green-200'} border p-2 rounded-lg flex items-center space-x-1.5 animate-fade-in`}>
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Modification appliquée par l'IA avec succès !</span>
            </div>
          )}
        </div>

        {/* Module 2: Correction orthographique */}
        <div className="pt-4">
          <h3 className={`text-xs font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} uppercase tracking-wider mb-2`}>2. Correction d'orthographe</h3>
          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mb-3 leading-relaxed`}>
            Corriger automatiquement les fautes grammaticales et stylistiques sur la feuille.
          </p>

          <button
            id="ai-spellcheck"
            onClick={handleSpellcheck}
            disabled={spellCheckLoading}
            className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 border transition cursor-pointer ${
              spellCheckLoading
                ? isDarkMode ? 'bg-slate-800 text-slate-500 border-slate-700' : 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed'
                : isDarkMode ? 'bg-slate-800 text-slate-100 hover:bg-slate-750 border-slate-700' : 'bg-white text-slate-800 hover:bg-slate-50 border-slate-200 hover:border-slate-350 shadow-sm'
            }`}
          >
            {spellCheckLoading ? (
              <>
                <Loader className="h-4 w-4 text-purple-400 animate-spin" />
                <span>Correction en cours...</span>
              </>
            ) : (
              <>
                <Check className="h-4 w-4 text-purple-500" />
                <span>Relire & Corriger la page</span>
              </>
            )}
          </button>

          {spellCheckSuccess && (
            <div className={`mt-2 text-xs ${isDarkMode ? 'text-green-300 bg-green-950/40 border-green-800' : 'text-green-700 bg-green-50 border-green-200'} border p-2 rounded-lg flex items-center space-x-1.5`}>
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Texte reformaté sans faute d'orthographe !</span>
            </div>
          )}
        </div>

        {/* Module 3: Recherches sur internet & copier coller */}
        <div className="pt-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className={`text-xs font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'} uppercase tracking-wider`}>3. Recherche Internet & Dossiers</h3>
            <span className={`text-[10px] ${isDarkMode ? 'bg-blue-950 text-blue-300' : 'bg-blue-50 text-blue-700'} px-1.5 py-0.5 rounded font-medium`}>Google Search</span>
          </div>
          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mb-3 leading-relaxed`}>
            Trouvez un sujet en direct sur le Web et insérez son <strong>contenu complet</strong> (dossier rédigé, chapitres, tableaux, sources) ou sa synthèse dans Word.
          </p>

          <div className="flex space-x-1.5 mb-3">
            <input
              id="search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
              placeholder="Ex: Révolution de l'IA générative 2026..."
              className={`flex-1 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500' : 'bg-white border-slate-300 text-slate-700'} border rounded-lg px-2.5 py-1.5 outline-none text-xs w-full focus:border-purple-500 focus:ring-1 focus:ring-purple-500 shadow-xs`}
            />
            <button
              id="ai-search-submit"
              onClick={handleSearch}
              disabled={searchLoading}
              className="bg-purple-600 text-white px-3 rounded-lg hover:bg-purple-700 transition flex items-center justify-center shrink-0 shadow-xs cursor-pointer"
              title="Lancer la recherche assistée par l'IA"
            >
              {searchLoading ? <Loader className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            </button>
          </div>

          {searchResult && (
            <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} rounded-lg border p-3 space-y-3`}>
              {/* Preview mode toggle */}
              <div className={`flex items-center justify-between border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'} pb-2`}>
                <span className={`text-[11px] font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'} truncate max-w-[160px]`}>
                  « {searchQuery} »
                </span>
                <div className={`flex items-center space-x-1 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-200/80'} p-0.5 rounded text-[10px]`}>
                  <button
                    onClick={() => setSearchViewMode('full')}
                    className={`px-1.5 py-0.5 rounded cursor-pointer ${searchViewMode === 'full' ? isDarkMode ? 'bg-slate-800 text-purple-300 font-bold' : 'bg-white text-purple-700 font-bold shadow-xs' : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-800'}`}
                  >
                    Dossier
                  </button>
                  <button
                    onClick={() => setSearchViewMode('summary')}
                    className={`px-1.5 py-0.5 rounded cursor-pointer ${searchViewMode === 'summary' ? isDarkMode ? 'bg-slate-800 text-purple-300 font-bold' : 'bg-white text-purple-700 font-bold shadow-xs' : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-800'}`}
                  >
                    Résumé
                  </button>
                  <button
                    onClick={() => setSearchViewMode('sources')}
                    className={`px-1.5 py-0.5 rounded cursor-pointer ${searchViewMode === 'sources' ? isDarkMode ? 'bg-slate-800 text-purple-300 font-bold' : 'bg-white text-purple-700 font-bold shadow-xs' : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-800'}`}
                  >
                    Sources ({searchResult.sources.length})
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              {searchViewMode === 'full' && (
                <div className="space-y-2">
                  <div className={`text-[11px] ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-600'} p-2.5 rounded border max-h-[140px] overflow-y-auto leading-relaxed`}>
                    <p className={`font-semibold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'} mb-1 text-xs flex items-center space-x-1`}>
                      <FileText className="h-3.5 w-3.5 text-blue-400 mr-1" />
                      <span>Dossier encyclopédique structuré</span>
                    </p>
                    <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mb-2`}>Comprend introduction, chapitres thématiques développés, tableau comparatif des données clés, recommandations et bibliographie web.</p>
                    {searchResult.keyPoints && searchResult.keyPoints.length > 0 && (
                      <ul className="list-disc list-inside space-y-0.5 text-[10.5px]">
                        {searchResult.keyPoints.slice(0, 3).map((kp, idx) => (
                          <li key={idx} className="truncate">{kp}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <button
                    id="ai-paste-search-full"
                    onClick={() => handlePasteSearchResult('full')}
                    className="w-full bg-[#1e3a8a] hover:bg-[#2b579a] text-white font-semibold py-2 px-3 rounded-md text-xs flex items-center justify-center space-x-1.5 shadow-sm transition cursor-pointer"
                  >
                    <FilePlus className="h-3.5 w-3.5 text-blue-200" />
                    <span>Insérer le dossier complet (multi-sections)</span>
                  </button>
                </div>
              )}

              {searchViewMode === 'summary' && (
                <div className="space-y-2">
                  <div className={`text-xs ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-700'} p-2.5 rounded border max-h-[140px] overflow-y-auto leading-relaxed whitespace-pre-line`}>
                    {searchResult.summary}
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => handlePasteSearchResult('summary')}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-1.5 px-2 rounded text-[11px] flex items-center justify-center space-x-1 shadow-xs transition cursor-pointer"
                    >
                      <Copy className="h-3 w-3" />
                      <span>Insérer résumé</span>
                    </button>
                    <button
                      onClick={() => handlePasteSearchResult('keypoints')}
                      className={`${isDarkMode ? 'bg-slate-700 hover:bg-slate-650 text-slate-200 border-slate-600' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'} font-medium py-1.5 px-2 rounded text-[11px] flex items-center justify-center space-x-1 border transition cursor-pointer`}
                    >
                      <span>Insérer points clés</span>
                    </button>
                  </div>
                </div>
              )}

              {searchViewMode === 'sources' && (
                <div className="space-y-2">
                  <div className={`${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'} p-2.5 rounded border max-h-[140px] overflow-y-auto`}>
                    <ul className="space-y-1.5 text-[11px]">
                      {searchResult.sources.map((src, idx) => (
                        <li key={idx} className={`border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-100'} pb-1 last:border-0 last:pb-0`}>
                          <a href={src.url} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline font-semibold flex items-center space-x-1 truncate">
                            <ExternalLink className="h-3 w-3 inline mr-1 shrink-0" />
                            <span className="truncate">{src.title}</span>
                          </a>
                          <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'} text-[10px] truncate`}>{src.snippet}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    onClick={() => handlePasteSearchResult('full')}
                    className={`w-full ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-700 hover:bg-slate-800'} text-white font-medium py-1.5 px-3 rounded text-[11px] flex items-center justify-center space-x-1.5 transition cursor-pointer`}
                  >
                    <span>Insérer tout le dossier avec ces sources</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Module 4: Générateur de pages & Metteur en page IA */}
        <div className="pt-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className={`text-xs font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'} uppercase tracking-wider`}>4. Générateur & Éditeur IA</h3>
            <span className={`text-[10px] ${isDarkMode ? 'bg-purple-950 text-purple-300' : 'bg-purple-50 text-purple-700'} px-1.5 py-0.5 rounded font-medium flex items-center space-x-1`}>
              <Brain className="w-2.5 h-2.5 inline mr-0.5 text-purple-400" />
              <span>Raisonnement IA</span>
            </span>
          </div>

          {/* Scope Selector: Nouveau document vs Page en cours */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg mb-3">
            <button
              type="button"
              onClick={() => setGeneratorScope('new_doc')}
              className={`py-1.5 px-2 rounded-md text-xs font-semibold flex items-center justify-center space-x-1 transition cursor-pointer ${
                generatorScope === 'new_doc'
                  ? isDarkMode
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-white text-purple-700 shadow-xs font-bold'
                  : isDarkMode
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FilePlus className="w-3.5 h-3.5" />
              <span>Nouveau doc</span>
            </button>
            <button
              type="button"
              id="generator-tab-current-page"
              onClick={() => setGeneratorScope('current_doc')}
              className={`py-1.5 px-2 rounded-md text-xs font-semibold flex items-center justify-center space-x-1 transition cursor-pointer ${
                generatorScope === 'current_doc'
                  ? isDarkMode
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-white text-purple-700 shadow-xs font-bold'
                  : isDarkMode
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileEdit className="w-3.5 h-3.5" />
              <span>Page en cours</span>
            </button>
          </div>

          {/* Thinking & Self-Verification Animation Banner */}
          {genLoading && (
            <div className={`mb-3 p-3 rounded-xl border ${isDarkMode ? 'bg-purple-950/40 border-purple-800 text-purple-200' : 'bg-purple-50/80 border-purple-200 text-purple-900'} animate-in fade-in duration-200 shadow-sm`}>
              <div className="flex items-center space-x-2 mb-2">
                <div className="relative">
                  <Brain className="w-5 h-5 text-purple-600 animate-pulse" />
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span>Réflexion & Auto-contrôle IA</span>
                    <span className="text-[10px] opacity-75">{thinkingStep + 1} / 4</span>
                  </div>
                  <p className="text-[10.5px] font-medium truncate mt-0.5 text-purple-700 dark:text-purple-300">
                    {thinkingMessages[thinkingStep]}
                  </p>
                </div>
              </div>

              {/* Fluid Progress Bar */}
              <div className="w-full bg-purple-200 dark:bg-purple-900/60 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-purple-600 h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${((thinkingStep + 1) / 4) * 100}%` }}
                ></div>
              </div>

              <div className="mt-2 flex items-center justify-between text-[9.5px] text-purple-600 dark:text-purple-400 font-medium">
                <span className="flex items-center">
                  <CheckCheck className="w-3 h-3 mr-1 text-emerald-500" />
                  Zéro texte générique
                </span>
                <span>Vérification de format active</span>
              </div>
            </div>
          )}

          {/* Mode 1: Nouveau document complet */}
          {generatorScope === 'new_doc' && (
            <div className="space-y-3">
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} leading-relaxed`}>
                Rédigez des documents <strong>exhaustifs et authentiques</strong> (analyses, tableaux, bilans) sans texte de remplissage.
              </p>

              <div>
                <label htmlFor="doc-type-select" className={`block text-[10px] font-bold uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mb-1`}>
                  Type de document ({docTypes.length} formats) :
                </label>
                <select
                  id="doc-type-select"
                  value={genType}
                  onChange={(e) => setGenType(e.target.value)}
                  className={`w-full ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-700'} border rounded-lg px-2.5 py-1.5 outline-none text-xs font-medium focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition shadow-xs`}
                >
                  {docTypes.map((type) => (
                    <option key={type} value={type} className={isDarkMode ? 'bg-slate-800 text-slate-100' : ''}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Target length / volume selector */}
              <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} p-2.5 rounded-lg border space-y-2`}>
                <div className="flex items-center justify-between">
                  <label className={`text-[10.5px] font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Volume & Pages cibles :</label>
                  <span className={`text-[10.5px] font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-700'}`}>{genPagesCount} page{genPagesCount > 1 ? 's' : ''} entière{genPagesCount > 1 ? 's' : ''}</span>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {[1, 3, 5, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setGenPagesCount(num)}
                      className={`py-1 rounded text-xs font-semibold border transition cursor-pointer ${
                        genPagesCount === num
                          ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                          : isDarkMode
                          ? 'bg-slate-700 text-slate-200 border-slate-600 hover:bg-slate-650'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {num} p.
                    </button>
                  ))}
                </div>

                <div className={`flex items-center justify-between pt-1 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'} text-[10.5px]`}>
                  <label className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Mode d'insertion :</label>
                  <div className="flex items-center space-x-2">
                    <label className="flex items-center space-x-1 cursor-pointer">
                      <input
                        type="radio"
                        name="genMode"
                        checked={genInsertMode === 'replace'}
                        onChange={() => setGenInsertMode('replace')}
                        className="text-purple-600 focus:ring-purple-500 h-3 w-3"
                      />
                      <span className={isDarkMode ? 'text-slate-200' : 'text-slate-700'}>Remplacer</span>
                    </label>
                    <label className="flex items-center space-x-1 cursor-pointer">
                      <input
                        type="radio"
                        name="genMode"
                        checked={genInsertMode === 'append'}
                        onChange={() => setGenInsertMode('append')}
                        className="text-purple-600 focus:ring-purple-500 h-3 w-3"
                      />
                      <span className={isDarkMode ? 'text-slate-200' : 'text-slate-700'}>Ajouter</span>
                    </label>
                  </div>
                </div>
              </div>

              <textarea
                id="ai-prompt-input"
                value={genPrompt}
                onChange={(e) => setGenPrompt(e.target.value)}
                placeholder="Ex: Plan d'action pour le déploiement de l'ERP avec calendrier prévisionnel et matrice des risques..."
                rows={3}
                className={`w-full ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500' : 'bg-white border-slate-300 text-slate-700'} border rounded-lg px-2.5 py-1.5 outline-none text-xs focus:border-purple-500 focus:ring-1 focus:ring-purple-500 shadow-xs`}
              />

              <button
                id="ai-generate-submit"
                onClick={handleGenerate}
                disabled={genLoading || !genPrompt.trim()}
                className={`w-full py-2.5 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition ${
                  genLoading || !genPrompt.trim()
                    ? isDarkMode ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed' : 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm cursor-pointer'
                }`}
              >
                {genLoading ? (
                  <>
                    <Loader className="h-4 w-4 text-white animate-spin" />
                    <span>Raisonnement & Rédaction des {genPagesCount} p...</span>
                  </>
                ) : (
                  <>
                    <FilePlus className="h-4 w-4" />
                    <span>Rédiger {genPagesCount} page{genPagesCount > 1 ? 's' : ''} entière{genPagesCount > 1 ? 's' : ''}</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Mode 2: Modifier uniquement le document / la page en cours */}
          {generatorScope === 'current_doc' && (
            <div className="space-y-3">
              <div className={`p-2 rounded-md ${isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-blue-50/70 border-blue-200'} border text-[11px] leading-relaxed`}>
                <span className={`font-semibold ${isDarkMode ? 'text-blue-300' : 'text-blue-900'} block mb-0.5`}>
                  Cible : Document actuellement ouvert
                </span>
                <p className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                  Indiquez une description pour modifier uniquement le document affiché sans repartir de zéro.
                </p>
              </div>

              {/* Action Presets */}
              <div className="space-y-1.5">
                <label className={`block text-[10px] font-bold uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Objectif de modification :
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setEditActionType('beautify_layout');
                      if (!editPrompt) setEditPrompt("Créer une belle mise en page professionnelle et harmonieuse sans modifier le texte.");
                    }}
                    className={`p-2 rounded-lg text-left text-[11px] font-medium border transition cursor-pointer ${
                      editActionType === 'beautify_layout'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : isDarkMode
                        ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-750'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold flex items-center">
                      <Layout className="w-3 h-3 mr-1" />
                      <span>Mise en page</span>
                    </div>
                    <div className="text-[9.5px] opacity-80 mt-0.5 truncate">Sans changer le texte</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditActionType('add_section');
                      if (!editPrompt) setEditPrompt("Ajouter une section complémentaire détaillée.");
                    }}
                    className={`p-2 rounded-lg text-left text-[11px] font-medium border transition cursor-pointer ${
                      editActionType === 'add_section'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : isDarkMode
                        ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-750'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold flex items-center">
                      <FilePlus className="w-3 h-3 mr-1" />
                      <span>Ajout section</span>
                    </div>
                    <div className="text-[9.5px] opacity-80 mt-0.5 truncate">Description spécifique</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditActionType('add_pages')}
                    className={`p-2 rounded-lg text-left text-[11px] font-medium border transition cursor-pointer ${
                      editActionType === 'add_pages'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : isDarkMode
                        ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-750'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold flex items-center">
                      <FileText className="w-3 h-3 mr-1" />
                      <span>Ajouter pages</span>
                    </div>
                    <div className="text-[9.5px] opacity-80 mt-0.5 truncate">+1, 2 ou 3 pages</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditActionType('custom')}
                    className={`p-2 rounded-lg text-left text-[11px] font-medium border transition cursor-pointer ${
                      editActionType === 'custom'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : isDarkMode
                        ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-750'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold flex items-center">
                      <FileEdit className="w-3 h-3 mr-1" />
                      <span>Consigne libre</span>
                    </div>
                    <div className="text-[9.5px] opacity-80 mt-0.5 truncate">Instruction sur-mesure</div>
                  </button>
                </div>
              </div>

              {/* Selector for pages count if add_pages is chosen */}
              {editActionType === 'add_pages' && (
                <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} p-2.5 rounded-lg border space-y-1.5`}>
                  <div className="flex items-center justify-between text-[10.5px] font-bold">
                    <span className={isDarkMode ? 'text-slate-200' : 'text-slate-700'}>Nombre de pages à ajouter :</span>
                    <span className={isDarkMode ? 'text-purple-400' : 'text-purple-700'}>+{editPagesCount} page{editPagesCount > 1 ? 's' : ''}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    {[1, 2, 3, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setEditPagesCount(num)}
                        className={`py-1 rounded text-xs font-semibold border transition cursor-pointer ${
                          editPagesCount === num
                            ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                            : isDarkMode
                            ? 'bg-slate-700 text-slate-200 border-slate-600 hover:bg-slate-650'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        +{num} p.
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Instructions description textarea */}
              <div>
                <label className={`block text-[10px] font-bold uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mb-1`}>
                  Description de la modification :
                </label>
                <textarea
                  id="ai-edit-prompt-input"
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  placeholder={
                    editActionType === 'beautify_layout'
                      ? "Ex: Créer une belle mise en page aérée sans modifier le texte, avec titres élégants et encadrés..."
                      : editActionType === 'add_pages'
                      ? "Ex: Rajouter 2 pages avec la description détaillée du bilan financier et des perspectives..."
                      : editActionType === 'add_section'
                      ? "Ex: Rajouter une section spécifique sur les mesures de sécurité et plan de reprise d'activité..."
                      : "Ex: Reformuler avec un ton très solennel et créer des tableaux pour les chiffres..."
                  }
                  rows={3}
                  className={`w-full ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500' : 'bg-white border-slate-300 text-slate-700'} border rounded-lg px-2.5 py-1.5 outline-none text-xs focus:border-purple-500 focus:ring-1 focus:ring-purple-500 shadow-xs`}
                />
              </div>

              <button
                id="ai-edit-current-submit"
                onClick={handleEditCurrentDoc}
                disabled={genLoading || (!editPrompt.trim() && editActionType === 'custom')}
                className={`w-full py-2.5 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition ${
                  genLoading || (!editPrompt.trim() && editActionType === 'custom')
                    ? isDarkMode ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed' : 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm cursor-pointer'
                }`}
              >
                {genLoading ? (
                  <>
                    <Loader className="h-4 w-4 text-white animate-spin" />
                    <span>Raisonnement & Mise à jour de la page...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Appliquer à la page en cours</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Module 5: Conversion & Export réel PDF / DOCX */}
        <div className="pt-4 pb-4">
          <h3 className={`text-xs font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} uppercase tracking-wider mb-2`}>5. Convertisseur de Document</h3>
          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mb-3 leading-relaxed`}>
            Téléchargez le document de travail actuel sous forme de vrai fichier PDF officiel ou document Word.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onExportPdf}
              className="py-2 px-3 bg-[#c23b22]/10 hover:bg-[#c23b22]/20 text-[#c23b22] hover:text-white hover:bg-[#c23b22] rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition border border-[#c23b22]/20 cursor-pointer shadow-xs font-medium"
            >
              <span>Créer PDF</span>
            </button>
            <button
              onClick={onExportDocx}
              className="py-2 px-3 bg-[#2b579a]/10 hover:bg-[#2b579a]/20 text-[#2b579a] hover:text-white hover:bg-[#2b579a] rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition border border-[#2b579a]/20 cursor-pointer shadow-xs font-medium"
            >
              <span>Créer DOCX</span>
            </button>
          </div>
        </div>

        </div>
      )}
    </div>
  );
}
