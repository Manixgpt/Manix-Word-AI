import { useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Table,
  Image as ImageIcon,
  FileText,
  ChevronDown,
  Columns2,
  Columns,
  Grid,
  Eye,
  Search,
  Users,
  Sparkles,
  FileDown,
  Bookmark,
  Plus,
  Compass,
  Type,
  FileCode,
  Heading,
  Printer,
  Sparkle,
  TypeIcon,
  HelpCircle,
  Video,
  Link,
  MessageSquare,
  Hash,
  Smile,
  Layers,
  BarChart,
  BarChart2,
  Camera,
  ShoppingBag,
  Package,
  BookOpen,
  Sigma,
  Maximize2,
  Minimize2,
  CheckCircle,
  AlertTriangle,
  Save,
  Undo,
  Redo,
  Scissors,
  Copy,
  Clipboard,
  Shield,
  QrCode,
  Phone,
  X,
  PenTool,
  Check,
  Palette,
  Layout,
  Sliders,
  Send,
  UserCheck,
  Sun,
  Moon,
} from 'lucide-react';
import { RibbonTab, DocumentStyle } from '../types';
import ManixWordLogo from './ManixWordLogo';

interface WordRibbonProps {
  documentTitle?: string;
  activeTab: RibbonTab;
  onTabChange: (tab: RibbonTab) => void;
  docStyle: DocumentStyle;
  onStyleChange: (styleUpdates: Partial<DocumentStyle>) => void;
  onExecuteCommand: (command: string, value?: string) => void;
  onApplyPresetStyle: (preset: 'normal' | 'sans' | 'titre1' | 'titre2' | 'titre' | 'sub') => void;
  onInsertTable: () => void;
  onInsertImage: () => void;
  onTriggerSpellcheck: () => void;
  onTriggerAutoWrite: () => void;
  onTriggerResearch: () => void;
  collabActive: boolean;
  onToggleCollab: () => void;
  rulerVisible: boolean;
  onToggleRuler: () => void;
  gridVisible: boolean;
  onToggleGrid: () => void;
  onInsertWatermark: (text: string) => void;
  onInsertTableOfContents: () => void;
  onInsertFootnote: () => void;
  onOpenPdfExport: () => void;
  wordCount: number;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  onOpenGrammarPanel?: () => void;
  grammarIssuesCount?: number;
  isAnalyzingGrammar?: boolean;
  onOpenSynonyms?: (word?: string) => void;
  isDarkMode?: boolean;
  onReturnToHome?: () => void;
  onOpenVoiceDictation?: () => void;
  onOpenMultimodalOcr?: () => void;
  onOpenRagSearch?: () => void;
  onOpenAutonomousAgent?: () => void;
  onOpenDocumentStructure?: () => void;
  isAiAssistantOpen?: boolean;
  onToggleAiAssistant?: () => void;
}

export default function WordRibbon({
  documentTitle,
  activeTab,
  onTabChange,
  docStyle,
  onStyleChange,
  onExecuteCommand,
  onApplyPresetStyle,
  onInsertTable,
  onInsertImage,
  onTriggerSpellcheck,
  onTriggerAutoWrite,
  onTriggerResearch,
  collabActive,
  onToggleCollab,
  rulerVisible,
  onToggleRuler,
  gridVisible,
  onToggleGrid,
  onInsertWatermark,
  onInsertTableOfContents,
  onInsertFootnote,
  onOpenPdfExport,
  wordCount,
  isFullscreen = false,
  onToggleFullscreen,
  onOpenGrammarPanel,
  grammarIssuesCount = 0,
  isAnalyzingGrammar = false,
  onOpenSynonyms,
  isDarkMode = false,
  onReturnToHome,
  onOpenVoiceDictation,
  onOpenMultimodalOcr,
  onOpenRagSearch,
  onOpenAutonomousAgent,
  onOpenDocumentStructure,
  isAiAssistantOpen = true,
  onToggleAiAssistant,
}: WordRibbonProps) {
  const tabs: RibbonTab[] = [
    'Accueil',
    'Insertion',
    'Dessin',
    'Création',
    'Disposition',
    'Références',
    'Publipostage',
    'Révision',
    'Affichage',
    'Extensions',
    'Aide',
  ];

  const fontFamilies = ['Calibri', 'Arial', 'Times New Roman', 'Georgia', 'Courier New', 'Trebuchet MS'];
  const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 36, 48];

  const stylePresets = [
    { id: 'normal', name: 'AaBbCcDd', label: 'Normal' },
    { id: 'sans', name: 'AaBbCcDd', label: 'Sans int...' },
    { id: 'titre1', name: 'AaBbCcDd', label: 'Titre 1' },
    { id: 'titre2', name: 'AaBbCcDd', label: 'Titre 2' },
    { id: 'titre', name: 'AaBbCcDd', label: 'Titre' },
    { id: 'sub', name: 'AaBbCcDd', label: 'Sous-titre' },
  ];

  return (
    <div className={`${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-slate-100 border-slate-200 text-slate-800'} border-b flex flex-col flex-shrink-0 select-none antialiased`}>
      {/* App Header themed */}
      <header className={`h-12 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'} border-b flex items-center justify-between px-4 shrink-0`}>
        <div className="flex items-center space-x-4">
          <div
            id="quick-logo"
            onClick={onReturnToHome}
            className="cursor-pointer hover:opacity-80 transition transform hover:scale-105"
            title="Retour au tableau d'accueil Manix Word"
          >
            <ManixWordLogo size="sm" showText={false} />
          </div>
          
          <div
            className="flex flex-col text-left cursor-pointer group"
            onClick={onReturnToHome}
            title="Retour au tableau d'accueil Manix Word"
          >
            <span className={`text-[10px] font-bold ${isDarkMode ? 'text-blue-400' : 'text-slate-400'} uppercase tracking-widest leading-none group-hover:text-blue-500 transition`}>
              Manix Word
            </span>
            <div className="flex items-center space-x-2 mt-0.5">
              <h1 className={`text-xs font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{documentTitle || 'Rapport_Strategique_2024.docx'}</h1>
              <span className={`text-[9px] ${isDarkMode ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-500 border-slate-200'} px-1.5 py-0.5 rounded border`}>Enregistré</span>
            </div>
          </div>

          <div className={`h-6 w-px ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'} hidden sm:block`}></div>

          {/* Quick Access Actions unified with header */}
          <div className={`hidden sm:flex items-center space-x-2 ${isDarkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-slate-50 border-slate-200'} px-2 py-1 rounded border`}>
            <button
              id="quick-save"
              onClick={() => onExecuteCommand('save')}
              className={`${isDarkMode ? 'hover:bg-slate-700 text-slate-300 hover:text-white' : 'hover:bg-slate-200 text-slate-700'} p-1 rounded group transition text-xs`}
              title="Enregistrer (Ctrl+S)"
            >
              <Save className="w-3.5 h-3.5 text-blue-500 group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={() => onExecuteCommand('undo')}
              className={`${isDarkMode ? 'hover:bg-slate-700 text-slate-300 hover:text-white' : 'hover:bg-slate-200 text-slate-700'} p-1 rounded group transition text-xs`}
              title="Annuler (Ctrl+Z)"
            >
              <Undo className="w-3.5 h-3.5 text-slate-400 group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={() => onExecuteCommand('redo')}
              className={`${isDarkMode ? 'hover:bg-slate-700 text-slate-300 hover:text-white' : 'hover:bg-slate-200 text-slate-700'} p-1 rounded group transition text-xs`}
              title="Rétablir (Ctrl+Y)"
            >
              <Redo className="w-3.5 h-3.5 text-slate-400 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right tools matching mockup */}
        <div className="flex items-center space-x-2">
          {/* Voice Dictation Button */}
          {onOpenVoiceDictation && (
            <button
              onClick={onOpenVoiceDictation}
              className={`flex items-center space-x-1 px-2 py-1 text-xs font-semibold rounded border transition ${
                isDarkMode ? 'bg-slate-800 text-blue-300 border-slate-700 hover:bg-slate-700' : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
              }`}
              title="Dictée Vocale Intelligente NLP"
            >
              <PenTool className="h-3.5 w-3.5" />
              <span className="hidden lg:inline text-[11px]">Dictée</span>
            </button>
          )}

          {/* Multimodal OCR Button */}
          {onOpenMultimodalOcr && (
            <button
              onClick={onOpenMultimodalOcr}
              className={`flex items-center space-x-1 px-2 py-1 text-xs font-semibold rounded border transition ${
                isDarkMode ? 'bg-slate-800 text-purple-300 border-slate-700 hover:bg-slate-700' : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
              }`}
              title="Numérisation & OCR Multimodal"
            >
              <Camera className="h-3.5 w-3.5 text-purple-500" />
              <span className="hidden lg:inline text-[11px]">OCR Scan</span>
            </button>
          )}

          {/* Autonomous ReAct Agent Button */}
          {onOpenAutonomousAgent && (
            <button
              onClick={onOpenAutonomousAgent}
              className={`flex items-center space-x-1 px-2 py-1 text-xs font-semibold rounded border transition ${
                isDarkMode ? 'bg-slate-800 text-emerald-300 border-slate-700 hover:bg-slate-700' : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
              title="Agent Autonome ReAct ManixGPT"
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
              <span className="hidden xl:inline text-[11px]">Agent ReAct</span>
            </button>
          )}

          {/* RAG Multi-Doc Button */}
          {onOpenRagSearch && (
            <button
              onClick={onOpenRagSearch}
              className={`flex items-center space-x-1 px-2 py-1 text-xs font-semibold rounded border transition ${
                isDarkMode ? 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700' : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
              }`}
              title="Moteur RAG & Recherche Multi-Documents"
            >
              <Search className="h-3.5 w-3.5 text-amber-500" />
              <span className="hidden xl:inline text-[11px]">RAG Multi-Doc</span>
            </button>
          )}

          {/* Structure NLP & Flesch Score Button */}
          {onOpenDocumentStructure && (
            <button
              onClick={onOpenDocumentStructure}
              className={`flex items-center space-x-1 px-2 py-1 text-xs font-semibold rounded border transition ${
                isDarkMode ? 'bg-slate-800 text-indigo-300 border-slate-700 hover:bg-slate-700' : 'bg-indigo-50 text-indigo-800 border-indigo-200 hover:bg-indigo-100'
              }`}
              title="Analyse Sémantique & Score Flesch"
            >
              <Layers className="h-3.5 w-3.5 text-indigo-500" />
              <span className="hidden xl:inline text-[11px]">Structure NLP</span>
            </button>
          )}

          {onOpenGrammarPanel && (
            <button
              id="btn-quick-grammar"
              onClick={onOpenGrammarPanel}
              className={`flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium rounded border transition ${
                grammarIssuesCount > 0
                  ? isDarkMode ? 'bg-amber-950/60 text-amber-300 border-amber-800 hover:bg-amber-900/60' : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                  : isDarkMode ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800 hover:bg-emerald-900/60' : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
              }`}
              title="Ouvrir l'analyse grammaticale en direct"
            >
              {isAnalyzingGrammar ? (
                <Sparkles className="h-3.5 w-3.5 animate-spin text-[#2b579a]" />
              ) : grammarIssuesCount > 0 ? (
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
              ) : (
                <CheckCircle className="h-3.5 w-3.5 text-green-500" />
              )}
              <span className="text-[11px] font-semibold">
                {isAnalyzingGrammar
                  ? 'Analyse...'
                  : grammarIssuesCount > 0
                  ? `${grammarIssuesCount} faute${grammarIssuesCount > 1 ? 's' : ''}`
                  : 'Grammaire OK'}
              </span>
            </button>
          )}

          {/* ManixGPT Sidebar Toggle Button */}
          {onToggleAiAssistant && (
            <button
              id="btn-quick-toggle-ai"
              onClick={onToggleAiAssistant}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-semibold rounded border transition cursor-pointer ${
                isAiAssistantOpen
                  ? isDarkMode ? 'bg-blue-900/60 text-blue-200 border-blue-700 hover:bg-blue-800/60' : 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 shadow-xs'
                  : isDarkMode ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 shadow-xs'
              }`}
              title={isAiAssistantOpen ? "Masquer le volet ManixGPT (Ctrl+J)" : "Afficher le volet ManixGPT (Ctrl+J)"}
            >
              <Sparkles className={`h-3.5 w-3.5 ${isAiAssistantOpen ? 'text-amber-300' : 'text-blue-600'}`} />
              <span className="text-[11px]">
                {isAiAssistantOpen ? 'Masquer ManixGPT' : 'ManixGPT'}
              </span>
            </button>
          )}

          {onToggleFullscreen && (
            <button
              id="btn-quick-fullscreen"
              onClick={onToggleFullscreen}
              className={`flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium rounded border transition ${
                isFullscreen
                  ? isDarkMode ? 'bg-blue-950/80 text-blue-300 border-blue-800 hover:bg-blue-900/80' : 'bg-blue-50 text-[#2b579a] border-blue-300 hover:bg-blue-100'
                  : isDarkMode ? 'text-slate-300 hover:bg-slate-800 border-slate-700' : 'text-slate-600 hover:bg-slate-100 border-slate-200'
              }`}
              title={isFullscreen ? 'Quitter le Plein écran (Echap)' : 'Plein écran (F11)'}
            >
              {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline text-[11px]">{isFullscreen ? 'Réduire' : 'Plein écran'}</span>
            </button>
          )}

          <button
            id="btn-toggle-collab-header"
            onClick={onToggleCollab}
            className={`flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium rounded border transition-colors ${
              collabActive
                ? isDarkMode ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800 hover:bg-emerald-900/60' : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                : isDarkMode ? 'text-slate-300 hover:bg-slate-800 border-slate-700' : 'text-slate-600 hover:bg-slate-50 border-slate-200'
            }`}
          >
            <Users className="h-3.5 w-3.5 mr-0.5" />
            <span className="hidden sm:inline">{collabActive ? 'Collaboratif Actif' : 'Collaborer'}</span>
          </button>

          <button
            onClick={onOpenPdfExport}
            className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 rounded transition-colors shadow-sm cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5 mr-0.5 text-blue-100" />
            <span>Exporter PDF</span>
          </button>
          
          <div className="hidden md:flex flex-col items-end text-right">
            <span className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} font-medium font-mono`}>kalengamushimbilina@gmail.com</span>
          </div>
          <div className={`w-8 h-8 rounded-full ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-200 border-slate-300 text-slate-700'} border flex items-center justify-center text-xs font-bold`}>
            JD
          </div>
        </div>
      </header>

      {/* Ribbon Tabs Row (including FILE menu tab on left) */}
      <div className={`flex items-end ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'} border-b px-1 relative`}>
        <button
          id="tab-fichier"
          onClick={() => onTabChange('Fichier')}
          className="bg-blue-600 text-white text-xs font-medium px-5 py-2 hover:bg-blue-700 active:bg-blue-800 transition cursor-pointer font-semibold shadow-xs"
        >
          Fichier
        </button>

        <div className="flex space-x-0.5 ml-1">
          {tabs.map((tab) => {
            const isSelected = activeTab === tab;
            return (
              <button
                id={`tab-${tab.toLowerCase()}`}
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`text-xs px-4 py-2 transition font-medium cursor-pointer duration-100 ${
                  isSelected
                    ? isDarkMode
                      ? 'border-b-2 border-blue-500 text-blue-400 font-semibold bg-slate-900'
                      : 'border-b-2 border-blue-600 text-blue-600 font-semibold bg-blue-50/10'
                    : isDarkMode
                      ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Tell me what to do Search Bar */}
        <div className={`absolute right-4 bottom-1.5 hidden lg:flex items-center ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-400'} border rounded px-2.5 py-1 text-xs group focus-within:border-blue-500`}>
          <Sparkle className="h-3 w-3 text-purple-500 mr-1 animate-pulse" />
          <input
            id="tell-me-doing"
            type="text"
            placeholder="Dites-nous ce que vous voulez faire..."
            className={`outline-none ${isDarkMode ? 'text-slate-200 placeholder-slate-500' : 'text-slate-700 placeholder-slate-400'} w-52 bg-transparent text-xs`}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onTriggerResearch();
              }
            }}
          />
        </div>
      </div>

      {/* Active Tab's Ribbon content bar */}
      <div className={`${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-200 divide-slate-800' : 'bg-slate-50 border-slate-200 text-slate-800 divide-slate-200'} h-28 px-4 flex items-center space-x-6 overflow-x-auto overflow-y-hidden border-b select-none`}>
        
        {/* ======================================= */}
        {/* TAB: ACCUEIL */}
        {/* ======================================= */}
        {activeTab === 'Accueil' && (
          <>
            {/* Presse-papiers Group */}
            <div className="flex flex-col items-center h-full pt-2">
              <div className="flex space-x-2 flex-grow items-center">
                <button
                  id="btn-coller"
                  onClick={() => onExecuteCommand('paste')}
                  className={`p-1 w-12 ${isDarkMode ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-200 hover:text-slate-900'} rounded flex flex-col items-center justify-center text-center transition group cursor-pointer`}
                  title="Coller le texte"
                >
                  <Clipboard className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
                  <span className={`text-[9px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mt-0.5`}>Coller</span>
                </button>
                <div className="flex flex-col space-y-1">
                  <button onClick={() => onExecuteCommand('cut')} className={`${isDarkMode ? 'hover:bg-slate-800 text-slate-300 hover:text-white' : 'hover:bg-slate-200 text-slate-700 hover:text-black'} flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] transition`}>
                    <Scissors className="w-3 h-3 text-slate-400" />
                    <span>Couper</span>
                  </button>
                  <button onClick={() => onExecuteCommand('copy')} className={`${isDarkMode ? 'hover:bg-slate-800 text-slate-300 hover:text-white' : 'hover:bg-slate-200 text-slate-700 hover:text-black'} flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] transition`}>
                    <Copy className="w-3 h-3 text-slate-400" />
                    <span>Copier</span>
                  </button>
                </div>
              </div>
              <span className={`text-[10px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} mt-1 uppercase tracking-wider font-light`}>Presse-papiers</span>
            </div>

            <div className={`w-px h-16 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'} flex-shrink-0 self-center`}></div>

            {/* Police Group */}
            <div className="flex flex-col items-center h-full pt-1">
              <div className="flex-grow flex flex-col justify-center space-y-1.5">
                {/* Font Selector & Size */}
                <div className="flex items-center space-x-2">
                  <select
                    id="font-family"
                    value={docStyle.fontFamily}
                    onChange={(e) => onStyleChange({ fontFamily: e.target.value })}
                    className={`border ${isDarkMode ? 'border-slate-700 bg-slate-800 text-slate-200' : 'border-slate-300 bg-white text-slate-800'} rounded text-xs px-2 py-0.5 outline-none font-sans focus:border-blue-500 w-[110px]`}
                  >
                    {fontFamilies.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>

                  <select
                    id="font-size"
                    value={docStyle.fontSize}
                    onChange={(e) => onStyleChange({ fontSize: parseInt(e.target.value) })}
                    className={`border ${isDarkMode ? 'border-slate-700 bg-slate-800 text-slate-200' : 'border-slate-300 bg-white text-slate-800'} rounded text-xs px-2 py-0.5 outline-none font-sans focus:border-blue-500`}
                  >
                    {fontSizes.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Direct text styles */}
                <div className="flex items-center space-x-1.5">
                  <button
                    id="btn-bold"
                    onClick={() => onExecuteCommand('bold')}
                    className={`${isDarkMode ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-200 text-slate-700'} p-1 rounded transition text-xs font-semibold`}
                    title="Gras"
                  >
                    <Bold className="h-3.5 w-3.5" />
                  </button>
                  <button
                    id="btn-italic"
                    onClick={() => onExecuteCommand('italic')}
                    className={`${isDarkMode ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-200 text-slate-700'} p-1 rounded transition`}
                    title="Italique"
                  >
                    <Italic className="h-3.5 w-3.5" />
                  </button>
                  <button
                    id="btn-underline"
                    onClick={() => onExecuteCommand('underline')}
                    className={`${isDarkMode ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-200 text-slate-700'} p-1 rounded transition`}
                    title="Souligné"
                  >
                    <Underline className="h-3.5 w-3.5" />
                  </button>
                  <div className={`w-px h-4 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-300'} mx-1`}></div>

                  {/* Highlights and colors */}
                  <Palette className="h-3.5 w-3.5 text-blue-500" />
                  <input
                    id="text-color"
                    type="color"
                    value={docStyle.textColor}
                    onChange={(e) => onStyleChange({ textColor: e.target.value })}
                    className="w-4 h-4 rounded border border-gray-300 cursor-pointer overflow-hidden p-0 bg-transparent"
                    title="Couleur de police"
                  />
                  
                  <PenTool className="h-3.5 w-3.5 text-amber-500 ml-1" />
                  <button
                    onClick={() => onExecuteCommand('backColor', '#fff2b2')}
                    className="w-3.5 h-3.5 bg-[#fff2b2] border border-gray-400 rounded cursor-pointer"
                    title="Surlignage"
                  />
                </div>
              </div>
              <span className={`text-[10px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} mt-1 uppercase tracking-wider font-light`}>Police</span>
            </div>

            <div className={`w-px h-16 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'} flex-shrink-0 self-center`}></div>

            {/* Paragraphe Group */}
            <div className="flex flex-col items-center h-full pt-2">
              <div className="flex-grow flex flex-col justify-center space-y-1.5">
                {/* Lists & alignments */}
                <div className="flex items-center space-x-1.5">
                  <button onClick={() => onExecuteCommand('insertUnorderedList')} className={`${isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-200 text-slate-600'} p-1 rounded transition`} title="Liste à puces">
                    <List className="h-4 w-4" />
                  </button>
                  <button onClick={() => onExecuteCommand('insertOrderedList')} className={`${isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-200 text-slate-600'} p-1 rounded transition`} title="Liste numérotée">
                    <ListOrdered className="h-4 w-4" />
                  </button>
                  <div className={`w-px h-4 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-300'} mx-1`}></div>
                  
                  <button onClick={() => onExecuteCommand('justifyLeft')} className={`${isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-200 text-slate-600'} p-1 rounded transition`} title="Aligner à gauche">
                    <AlignLeft className="h-4 w-4" />
                  </button>
                  <button onClick={() => onExecuteCommand('justifyCenter')} className={`${isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-200 text-slate-600'} p-1 rounded transition`} title="Centrer">
                    <AlignCenter className="h-4 w-4" />
                  </button>
                  <button onClick={() => onExecuteCommand('justifyRight')} className={`${isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-200 text-slate-600'} p-1 rounded transition`} title="Aligner à droite">
                    <AlignRight className="h-4 w-4" />
                  </button>
                  <button onClick={() => onExecuteCommand('justifyFull')} className={`${isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-200 text-slate-600'} p-1 rounded transition`} title="Justifier">
                    <AlignJustify className="h-4 w-4" />
                  </button>
                </div>

                {/* Line Spacing selector */}
                <div className={`flex items-center space-x-2 text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'} justify-center`}>
                  <span>Interligne :</span>
                  <select
                    id="line-spacing"
                    value={docStyle.lineSpacing}
                    onChange={(e) => onStyleChange({ lineSpacing: parseFloat(e.target.value) })}
                    className={`border ${isDarkMode ? 'border-slate-700 bg-slate-800 text-slate-200' : 'border-slate-300 bg-white text-slate-800'} rounded text-[10px] outline-none`}
                  >
                    <option value="1">1.0</option>
                    <option value="1.15">1.15</option>
                    <option value="1.5">1.5 (Standard)</option>
                    <option value="2">2.0</option>
                  </select>
                </div>
              </div>
              <span className={`text-[10px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} mt-1 uppercase tracking-wider font-light`}>Paragraphe</span>
            </div>

            <div className={`w-px h-16 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'} flex-shrink-0 self-center hidden md:block`}></div>

            {/* Styles presets */}
            <div className="flex-col items-center h-full pt-1.5 hidden md:flex">
              <div className="flex-grow flex items-center space-x-2 overflow-x-auto max-w-[280px] lg:max-w-[380px] pr-1">
                {stylePresets.map((preset) => (
                  <button
                    id={`preset-${preset.id}`}
                    key={preset.id}
                    onClick={() => onApplyPresetStyle(preset.id as any)}
                    className={`w-14 h-16 ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:border-blue-500 text-slate-200' : 'bg-white border-slate-200 hover:border-blue-600 text-slate-800'} border rounded p-1 flex flex-col items-center justify-between text-center transition flex-shrink-0 cursor-pointer text-[10px]`}
                  >
                    <span className={`${isDarkMode ? 'text-slate-300' : 'text-slate-500'} font-serif leading-none text-xs block mt-1`}>{preset.name}</span>
                    <span className={`text-[8px] ${isDarkMode ? 'text-slate-400 border-slate-700' : 'text-slate-600 border-slate-100'} font-semibold truncate w-full border-t pt-0.5`}>{preset.label}</span>
                  </button>
                ))}
              </div>
              <span className={`text-[10px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} mt-1 uppercase tracking-wider font-light`}>Style de document</span>
            </div>
          </>
        )}

        {/* ======================================= */}
        {/* TAB: INSERTION */}
        {/* ======================================= */}
        {activeTab === 'Insertion' && (
          <div className={`flex h-16 divide-x ${isDarkMode ? 'divide-slate-800' : 'divide-gray-200'} overflow-x-auto select-none items-center pr-4`}>
            {/* hidden file input for local images */}
            <input
              type="file"
              id="word-local-image-selector"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const base64 = event.target?.result as string;
                    onExecuteCommand('insertHTML', `
                      <div style="text-align: center; margin: 20px 0;" contenteditable="false" class="inserted-image-wrapper">
                        <img src="${base64}" alt="${file.name}" style="max-width: 80%; border: 1px solid #cbd5e1; border-radius: 4px; padding: 4px; display: inline-block;" />
                        <p style="font-size: 10px; color: #64748b; font-style: italic; margin-top: 4px;">Figure : ${file.name}</p>
                      </div>
                      <p><br></p>
                    `);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />

            {/* 1. Pages Section */}
            <div className="flex flex-col items-center justify-between h-full px-3 py-1 flex-shrink-0">
              <div className="flex space-x-1.5 items-center">
                <button
                  id="btn-cover-page"
                  onClick={() => onExecuteCommand('insertHTML', '<div style="background-color:#1e3a8a;color:white;padding:50px;text-align:center;border-radius:6px;margin-bottom:60px;" class="word-cover-page"><h1>PAGE DE GARDE</h1><p style="font-size:14px;color:#93c5fd;margin-top:10px;">Générée avec Manix Word</p></div>')}
                  className={`${isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-gray-100 text-gray-700'} p-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition`}
                  title="Page de garde"
                >
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span className={`text-[9px] ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mt-0.5`}>Page garde</span>
                </button>
                <button
                  onClick={() => onExecuteCommand('insertHTML', '<hr style="border: 0; border-top: 1px solid #dae1e7; margin: 40px 0;"/>')}
                  className={`${isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-gray-100 text-gray-700'} p-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition`}
                  title="Page vierge"
                >
                  <Plus className="h-4 w-4 text-blue-500" />
                  <span className={`text-[9px] ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mt-0.5`}>Page vierge</span>
                </button>
                <button
                  onClick={() => onExecuteCommand('insertHTML', '<div class="word-page-break" data-page-break="true" contenteditable="false"></div><p><br></p>')}
                  className={`${isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-gray-100 text-gray-700'} p-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition`}
                  title="Insérer un saut de page"
                >
                  <Columns2 className="h-4 w-4 text-blue-500" />
                  <span className={`text-[9px] ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mt-0.5`}>Saut page</span>
                </button>
              </div>
              <span className={`text-[9px] ${isDarkMode ? 'text-slate-500' : 'text-gray-400'} mt-0.5 uppercase tracking-wider font-light`}>Pages</span>
            </div>

            {/* 2. Tableaux Section */}
            <div className="flex flex-col items-center justify-between h-full px-3 py-1 flex-shrink-0">
              <button
                id="btn-insert-table"
                onClick={onInsertTable}
                className={`${isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-gray-100 text-gray-750'} p-2 rounded text-center flex flex-col items-center justify-center transition cursor-pointer`}
                title="Insérer Tableau"
              >
                <Table className="h-5 w-5 text-blue-500" />
                <span className={`text-[9px] ${isDarkMode ? 'text-slate-300' : 'text-gray-750'} mt-0.5 font-medium`}>Tableau</span>
              </button>
              <span className={`text-[9px] ${isDarkMode ? 'text-slate-500' : 'text-gray-400'} mt-0.5 uppercase tracking-wider font-light`}>Tableaux</span>
            </div>

            {/* 3. Illustrations Section */}
            <div className="flex flex-col items-center justify-between h-full px-3 py-1 flex-shrink-0">
              <div className="flex space-x-1.5 items-center">
                <button
                  onClick={() => document.getElementById('word-local-image-selector')?.click()}
                  className={`${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100'} p-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition text-emerald-500`}
                  title="Cet appareil (Importer localement)"
                >
                  <Camera className="h-4.5 w-4.5" />
                  <span className={`text-[9px] ${isDarkMode ? 'text-slate-300' : 'text-gray-650'} mt-0.5 font-semibold`}>Cet appareil</span>
                </button>
                <button
                  onClick={onInsertImage}
                  className={`${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100'} p-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition text-sky-500`}
                  title="Image en ligne (URL)"
                >
                  <ImageIcon className="h-4.5 w-4.5" />
                  <span className={`text-[9px] ${isDarkMode ? 'text-slate-400' : 'text-gray-650'} mt-0.5`}>En ligne</span>
                </button>
                <button
                  onClick={() => onExecuteCommand('insertHTML', '<div style="background-color:#d0ebff; width:120px; height:60px; border-radius:10px; border:2px solid #228be6; display:flex; align-items:center; justify-content:center; text-align:center; padding:5px; font-size:11px; color:#1864ab; margin: 15px auto;" contenteditable="false">Forme géométrique</div>')}
                  className={`${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100'} p-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition text-indigo-400`}
                  title="Insérer des formes"
                >
                  <Compass className="h-4.5 w-4.5" />
                  <span className={`text-[9px] ${isDarkMode ? 'text-slate-400' : 'text-gray-650'} mt-0.5`}>Formes</span>
                </button>
                <button
                  onClick={() => onExecuteCommand('insertHTML', '<span style="font-size: 24px; color: #3b82f6;">★</span>')}
                  className={`${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100'} p-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition text-amber-500`}
                  title="Insérer des icônes"
                >
                  <Smile className="h-4.5 w-4.5" />
                  <span className={`text-[9px] ${isDarkMode ? 'text-slate-400' : 'text-gray-650'} mt-0.5`}>Icônes</span>
                </button>
                <button
                  onClick={() => onExecuteCommand('insertHTML', '<div style="display:flex; flex-direction:column; gap:8px; border:2px solid #0984e3; border-radius:5px; padding:10px; background-color:#e1f5fe; max-width:220px; margin: 15px auto;" contenteditable="false"><div style="background:#0984e3; color:white; padding:4px; font-weight:bold; font-size:10px; border-radius:3px; text-align:center;">DIRECTION</div><div style="background:#54a0ff; color:white; padding:4px; font-size:10px; border-radius:3px; text-align:center; margin-left:15px;">Étape 1</div><div style="background:#54a0ff; color:white; padding:4px; font-size:10px; border-radius:3px; text-align:center; margin-left:30px;">Étape 2</div></div>')}
                  className={`${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100'} p-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition text-purple-400`}
                  title="SmartArt"
                >
                  <Layers className="h-4.5 w-4.5" />
                  <span className={`text-[9px] ${isDarkMode ? 'text-slate-400' : 'text-gray-650'} mt-0.5`}>SmartArt</span>
                </button>
                <button
                  onClick={() => onExecuteCommand('insertHTML', '<div style="background-color:#f1f5f9; border:1px solid #cbd5e1; border-radius:4px; padding:12px; margin:15px auto; max-width:280px;" contenteditable="false"><h5 style="margin:0 0 8px 0; font-size:11px; color:#3b5998;">Graphes de ventes</h5><div style="display:flex; gap:4px; align-items:flex-end; height:60px;"><div style="background-color:#2b579a; width:20px; height:80%;"></div><div style="background-color:#2b579a; width:20px; height:45%;"></div><div style="background-color:#2b579a; width:20px; height:100%;"></div><div style="background-color:#2b579a; width:20px; height:65%;"></div></div></div>')}
                  className={`${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100'} p-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition text-rose-500`}
                  title="Graphique"
                >
                  <BarChart2 className="h-4.5 w-4.5" />
                  <span className={`text-[9px] ${isDarkMode ? 'text-slate-400' : 'text-gray-650'} mt-0.5`}>Graphique</span>
                </button>
              </div>
              <span className={`text-[9px] ${isDarkMode ? 'text-slate-500' : 'text-gray-400'} mt-0.5 uppercase tracking-wider font-light`}>Illustrations</span>
            </div>

            {/* 4. Compléments Section */}
            <div className="flex flex-col items-center justify-between h-full px-3 py-1 flex-shrink-0">
              <div className="flex space-x-1.5 items-center">
                <button
                  onClick={() => onExecuteCommand('insertHTML', '<div style="background-color:#eff6ff; border:1px solid #bfdbfe; color:#1e3a8a; padding:10px; margin:10px 0; font-size:10px;" contenteditable="false">Complément Manix Word connecté avec succès.</div>')}
                  className={`${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100'} p-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition text-sky-400`}
                  title="Boutique d extensions"
                >
                  <ShoppingBag className="h-4.5 w-4.5" />
                  <span className={`text-[9px] ${isDarkMode ? 'text-slate-400' : 'text-gray-650'} mt-0.5`}>Boutique</span>
                </button>
                <button
                  onClick={onTriggerResearch}
                  className={`${isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-gray-100 text-slate-700'} p-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition`}
                  title="Rechercher sur Wikipédia"
                >
                  <BookOpen className="h-4.5 w-4.5 text-blue-400" />
                  <span className={`text-[9px] ${isDarkMode ? 'text-slate-400' : 'text-gray-650'} mt-0.5`}>Wikipédia</span>
                </button>
              </div>
              <span className={`text-[9px] ${isDarkMode ? 'text-slate-500' : 'text-gray-400'} mt-0.5 uppercase tracking-wider font-light`}>Compléments</span>
            </div>

            {/* 5. Média Section */}
            <div className="flex flex-col items-center justify-between h-full px-3 py-1 flex-shrink-0">
              <button
                onClick={() => onExecuteCommand('insertHTML', '<div style="background-color:#0f172a; color:white; width:280px; height:150px; display:flex; flex-direction:column; align-items:center; justify-content:center; margin:15px auto; border-radius:6px; font-size:12px;" contenteditable="false">[Lecteur Vidéo Multimédia]<p style="font-size:9px; color:#94a3b8; margin-top:5px;">Manix Word Media</p></div>')}
                className={`${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100'} p-2 rounded text-center flex flex-col items-center justify-center transition cursor-pointer text-red-500`}
                title="Insérer Vidéo en ligne"
              >
                <Video className="h-5 w-5" />
                <span className={`text-[9px] ${isDarkMode ? 'text-slate-300' : 'text-gray-750'} mt-0.5 font-medium`}>Vidéo</span>
              </button>
              <span className={`text-[9px] ${isDarkMode ? 'text-slate-500' : 'text-gray-400'} mt-0.5 uppercase tracking-wider font-light`}>Médias</span>
            </div>

            {/* 6. Liens Section */}
            <div className="flex flex-col items-center justify-between h-full px-3 py-1 flex-shrink-0">
              <div className="flex space-x-1.5 items-center">
                <button
                  onClick={() => {
                    const u = prompt('Saisir l\'URL du lien hypertexte :', 'https://');
                    if (u) {
                      onExecuteCommand('createLink', u);
                    }
                  }}
                  className={`${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100'} p-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition text-blue-500`}
                  title="Lien hypertexte"
                >
                  <Link className="h-4.5 w-4.5" />
                  <span className={`text-[9px] ${isDarkMode ? 'text-slate-400' : 'text-gray-650'} mt-0.5`}>Lien</span>
                </button>
                <button
                  onClick={() => onExecuteCommand('insertHTML', '<span class="manix-bookmark">[Signet]</span>')}
                  className={`${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100'} p-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition text-amber-500`}
                  title="Créer Signet"
                >
                  <Bookmark className="h-4.5 w-4.5" />
                  <span className={`text-[9px] ${isDarkMode ? 'text-slate-400' : 'text-gray-650'} mt-0.5`}>Signet</span>
                </button>
              </div>
              <span className={`text-[9px] ${isDarkMode ? 'text-slate-500' : 'text-gray-400'} mt-0.5 uppercase tracking-wider font-light`}>Liens</span>
            </div>

            {/* 7. Commentaires Section */}
            <div className="flex flex-col items-center justify-between h-full px-3 py-1 flex-shrink-0">
              <button
                onClick={() => onExecuteCommand('insertHTML', '<span style="background-color: #fffae6; border-bottom: 2px solid #e1b12c; font-weight:500;">[Commentaire : Réviser cette section]</span>')}
                className={`${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100'} p-2 rounded text-center flex flex-col items-center justify-center transition cursor-pointer text-amber-500`}
                title="Insérer Commentaire"
              >
                <MessageSquare className="h-4.5 w-4.5" />
                <span className={`text-[9px] ${isDarkMode ? 'text-slate-300' : 'text-gray-750'} mt-0.5 font-medium`}>Commenter</span>
              </button>
              <span className={`text-[9px] ${isDarkMode ? 'text-slate-500' : 'text-gray-400'} mt-0.5 uppercase tracking-wider font-light`}>Commentaire</span>
            </div>

            {/* 8. En-tête / Pied de page */}
            <div className="flex flex-col items-center justify-between h-full px-3 py-1 flex-shrink-0">
              <div className="flex flex-col space-y-0.5 justify-center flex-grow">
                <button
                  onClick={() => onExecuteCommand('insertHTML', '<div style="text-align: right; color: #777; font-size: 11px; font-style: italic; border-bottom: 1px solid #ddd; padding-bottom: 2px;">Document Confidentiel - Manix Word</div>')}
                  className={`${isDarkMode ? 'hover:bg-slate-800 text-slate-300 border-slate-700' : 'hover:bg-gray-100 text-gray-750 border-gray-200'} px-2 py-0.5 text-left rounded text-[9px] border flex items-center space-x-1 shrink-0 transition`}
                >
                  <FileText className="w-2.5 h-2.5 text-blue-400" />
                  <span>En-tête</span>
                </button>
                <button
                  onClick={() => onExecuteCommand('insertHTML', '<div style="text-align: center; color: #777; font-size: 11px; border-top: 1px solid #ddd; padding-top: 4px; margin-top: 30px;">Page 1 - Rédigé avec Manix Word</div>')}
                  className={`${isDarkMode ? 'hover:bg-slate-800 text-slate-300 border-slate-700' : 'hover:bg-gray-100 text-gray-750 border-gray-200'} px-2 py-0.5 text-left rounded text-[9px] border flex items-center space-x-1 shrink-0 transition`}
                >
                  <Hash className="w-2.5 h-2.5 text-blue-400" />
                  <span>Pied de page</span>
                </button>
              </div>
              <span className={`text-[9px] ${isDarkMode ? 'text-slate-500' : 'text-gray-400'} mt-0.5 uppercase tracking-wider font-light`}>En-tête & Pied</span>
            </div>

            {/* 9. Texte Section */}
            <div className="flex flex-col items-center justify-between h-full px-3 py-1 flex-shrink-0">
              <div className="flex space-x-1.5 items-center">
                <button
                  onClick={() => onExecuteCommand('insertHTML', '<div style="float: right; width: 180px; border: 2px solid #2b579a; padding: 10px; margin: 10px; background-color: #f8fafc; border-radius: 4px; font-size: 11px; color: #333;" contenteditable="true"><strong>Encadré de texte</strong><br/>Tapez votre note ici...</div>')}
                  className={`${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100'} p-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition`}
                  title="Zone de texte"
                >
                  <Type className="h-4.5 w-4.5 text-blue-500" />
                  <span className={`text-[9px] ${isDarkMode ? 'text-slate-400' : 'text-gray-650'} mt-0.5`}>Zone texte</span>
                </button>
                <button
                  onClick={() => onExecuteCommand('insertHTML', '<span style="font-size: 28px; font-family: Impact, sans-serif; background-image: linear-gradient(to right, #f39c12, #d35400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-shadow: 2px 2px 4px rgba(0,0,0,0.2); font-weight: bold;">WordArt</span>')}
                  className={`${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100'} p-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition`}
                  title="WordArt Manix"
                >
                  <Sparkles className="h-4.5 w-4.5 text-amber-500" />
                  <span className={`text-[9px] ${isDarkMode ? 'text-slate-400' : 'text-gray-650'} mt-0.5`}>WordArt</span>
                </button>
              </div>
              <span className={`text-[9px] ${isDarkMode ? 'text-slate-500' : 'text-gray-400'} mt-0.5 uppercase tracking-wider font-light`}>Texte</span>
            </div>

            {/* 10. Symboles Section */}
            <div className="flex flex-col items-center justify-between h-full px-3 py-1 flex-shrink-0">
              <div className="flex space-x-1.5 items-center">
                <button
                  onClick={() => onExecuteCommand('insertHTML', '<span style="font-family: Cambria, serif; font-style: italic; background-color:#f1f5f9; padding: 2px 6px; border-radius:3px;">$$\\int_a^b f(x)dx = F(b) - F(a)$$</span>')}
                  className={`${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100'} p-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition text-violet-500`}
                  title="Insérer Équation"
                >
                  <Sigma className="h-4.5 w-4.5" />
                  <span className={`text-[9px] ${isDarkMode ? 'text-slate-400' : 'text-gray-650'} mt-0.5`}>Équation</span>
                </button>
                <button
                  onClick={() => onExecuteCommand('insertHTML', '<span> © ® ™ € </span>')}
                  className={`${isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-gray-100 text-slate-700'} p-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition`}
                  title="Caractères spéciaux"
                >
                  <Heading className="h-4.5 w-4.5 text-blue-400" />
                  <span className={`text-[9px] ${isDarkMode ? 'text-slate-400' : 'text-gray-650'} mt-0.5`}>Symbole</span>
                </button>
              </div>
              <span className={`text-[9px] ${isDarkMode ? 'text-slate-500' : 'text-gray-400'} mt-0.5 uppercase tracking-wider font-light`}>Symboles</span>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* TAB: CRÉATION */}
        {/* ======================================= */}
        {activeTab === 'Création' && (
          <div className={`flex h-16 divide-x ${isDarkMode ? 'divide-slate-800' : 'divide-gray-200'} overflow-x-auto select-none items-center pr-4`}>
            
            {/* 1. Thèmes & Jeux de styles */}
            <div className="flex flex-col items-center justify-between h-full px-3 py-1 flex-shrink-0">
              <div className="flex space-x-2 items-center flex-grow">
                <select
                  id="word-theme-picker"
                  value={docStyle.theme}
                  onChange={(e) => onStyleChange({ theme: e.target.value })}
                  className={`border rounded text-[11px] px-2 py-1 outline-none font-sans w-[140px] ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200 focus:border-blue-500' : 'bg-white border-gray-300 text-gray-700 focus:border-[#2b579a]'
                  }`}
                >
                  <option value="Office">Sélection : Standard Office (Bleu)</option>
                  <option value="Créatif">Sélection : Créatif Académique</option>
                  <option value="Officiel">Sélection : Lettre Administrative</option>
                  <option value="Moderne">Sélection : Moderne Épuré</option>
                </select>
                <div className="flex space-x-1">
                  <button 
                    onClick={() => onStyleChange({ fontFamily: 'Georgia', fontSize: 13, textColor: '#1a1a1a' })} 
                    className={`${isDarkMode ? 'hover:bg-slate-800 border-slate-700 text-slate-300' : 'hover:bg-gray-100 border-gray-300 text-gray-600'} px-1.5 py-1 rounded border text-[9px] font-serif`}
                    title="Jeu de style formel classique"
                  >
                    Chic
                  </button>
                  <button 
                    onClick={() => onStyleChange({ fontFamily: 'Calibri', fontSize: 11, textColor: '#334155' })} 
                    className={`${isDarkMode ? 'hover:bg-slate-800 border-slate-700 text-slate-300' : 'hover:bg-gray-100 border-gray-300 text-gray-600'} px-1.5 py-1 rounded border text-[9px] font-sans`}
                    title="Jeu de style corporatif"
                  >
                    Tech
                  </button>
                </div>
              </div>
              <span className={`text-[9px] ${isDarkMode ? 'text-slate-500' : 'text-gray-400'} mt-0.5 uppercase tracking-wider font-light`}>Thèmes Généraux</span>
            </div>

            {/* 2. Couleur de Titre & Palette Accent */}
            <div className="flex flex-col items-center justify-between h-full px-3 py-1 flex-shrink-0">
              <div className="flex items-center flex-grow space-x-1 px-1">
                <button onClick={() => onStyleChange({ textColor: '#1e3b8a' })} className="w-3.5 h-3.5 rounded bg-blue-800 border border-gray-300 hover:scale-110 transition" title="Bleu Corporate" />
                <button onClick={() => onStyleChange({ textColor: '#7f1d1d' })} className="w-3.5 h-3.5 rounded bg-red-900 border border-gray-300 hover:scale-110 transition" title="Rouge Cardinal" />
                <button onClick={() => onStyleChange({ textColor: '#064e3b' })} className="w-3.5 h-3.5 rounded bg-emerald-950 border border-gray-300 hover:scale-110 transition" title="Vert Anglais" />
                <button onClick={() => onStyleChange({ textColor: '#111827' })} className="w-3.5 h-3.5 rounded bg-gray-905 border border-gray-305 hover:scale-110 transition" title="Charbon" />
              </div>
              <span className={`text-[9px] ${isDarkMode ? 'text-slate-500' : 'text-gray-400'} mt-0.5 uppercase tracking-wider font-light`}>Couleurs du Thème</span>
            </div>

            {/* 3. Arrière-plan de Page (Watermarks & Page Backgrounds) */}
            <div className="flex flex-col items-center justify-between h-full px-3 py-1 flex-shrink-0">
              <div className="flex space-x-2.5 items-center flex-grow">
                <div className="flex space-x-1 items-center">
                  <button
                    onClick={() => onInsertWatermark('URGENT')}
                    className="hover:bg-red-500/10 px-1.5 py-0.5 rounded text-[10px] text-red-500 font-bold border border-red-400/40 flex items-center space-x-1"
                    title="Filigrane Urgent"
                  >
                    <AlertTriangle className="w-3 h-3 text-red-500" />
                    <span>URGENT</span>
                  </button>
                  <button
                    onClick={() => onInsertWatermark('CONFIDENTIEL')}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-medium border flex items-center space-x-1 ${
                      isDarkMode ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-gray-200 text-gray-500 hover:bg-slate-100'
                    }`}
                    title="Filigrane Confidentiel"
                  >
                    <Shield className="w-3 h-3 text-slate-400" />
                    <span>CONFIDENTIEL</span>
                  </button>
                  <button
                    onClick={() => onInsertWatermark('')}
                    className={`p-1 rounded ${isDarkMode ? 'hover:bg-slate-800 text-slate-500' : 'hover:bg-slate-100 text-gray-400'}`}
                    title="Effacer le filigrane actuel"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>

                <div className={`h-6 w-px ${isDarkMode ? 'bg-slate-800' : 'bg-gray-200'}`}></div>

                {/* Couleur de page background selector */}
                <div className="flex space-x-1 items-center">
                  <button onClick={() => onStyleChange({ backgroundColor: '#ffffff' })} className="w-4 h-4 rounded-full bg-white border border-gray-400 hover:scale-110 transition" title="Blanc standard" />
                  <button onClick={() => onStyleChange({ backgroundColor: '#fdfbf7' })} className="w-4 h-4 rounded-full bg-[#fdfbf7] border border-gray-400 hover:scale-110 transition" title="Sépia crème" />
                  <button onClick={() => onStyleChange({ backgroundColor: '#f1f5f9' })} className="w-4 h-4 rounded-full bg-[#f1f5f9] border border-gray-400 hover:scale-110 transition" title="Gris bleuté épuré" />
                </div>
              </div>
              <span className={`text-[9px] ${isDarkMode ? 'text-slate-500' : 'text-gray-400'} mt-0.5 uppercase tracking-wider font-light`}>Arrière-Plan & Filigranes</span>
            </div>

            {/* 4. Bordure Décorative active */}
            <div className="flex flex-col items-center justify-between h-full px-3 py-1 flex-shrink-0">
              <div className="flex space-x-1 items-center flex-grow">
                <button
                  onClick={() => onExecuteCommand('insertHTML', '<div style="border: 3px double #2b579a; padding: 25px; margin: 15px 0; border-radius: 6px; background:#fafbfd;" contenteditable="true" class="page-borders-chic"><p style="font-size:12px; font-weight:bold; color:#2b579a; text-align:center; margin-bottom:10px;">CADRE DE PRÉSENTATION OFFICIEL</p><p style="font-size:11px; color:#475569; margin:0;" class="page-body-insert-chic">Double-cliquez pour saisir le contenu de cette zone de page encadrée de styles Manix Word.</p></div>')}
                  className={`${isDarkMode ? 'hover:bg-slate-800 text-blue-400' : 'hover:bg-gray-100 text-blue-700'} px-2 py-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition`}
                  title="Ajouter une bordure de paragraphe doublée"
                >
                  <Layout className="w-4 h-4" />
                  <span className={`text-[9px] ${isDarkMode ? 'text-slate-300' : 'text-gray-700'} mt-0.5`}>Bordure double</span>
                </button>
              </div>
              <span className={`text-[9px] ${isDarkMode ? 'text-slate-500' : 'text-gray-400'} mt-0.5 uppercase tracking-wider font-light`}>Bordures de page</span>
            </div>

          </div>
        )}

        {/* ======================================= */}
        {/* TAB: DISPOSITION */}
        {/* ======================================= */}
        {activeTab === 'Disposition' && (
          <div className={`flex h-16 divide-x ${isDarkMode ? 'divide-slate-800' : 'divide-gray-200'} overflow-x-auto select-none items-center pr-4`}>
            
            {/* 1. Mise en Page (Marges & Orientation) */}
            <div className="flex flex-col items-center justify-between h-full px-3 py-1 flex-shrink-0">
              <div className="flex space-x-3 items-center flex-grow">
                {/* Marges setup */}
                <div className={`flex flex-col text-[10px] ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                  <span className="font-semibold mb-0.5">Marges</span>
                  <select
                    id="page-margins"
                    value={docStyle.margin}
                    onChange={(e) => onStyleChange({ margin: e.target.value as any })}
                    className={`border rounded text-[10px] p-0.5 ${
                      isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  >
                    <option value="normal">Normal (2.5cm)</option>
                    <option value="narrow">Étroit (1.27cm)</option>
                    <option value="moderate">Moyen (1.91cm)</option>
                    <option value="wide">Large (5.08cm)</option>
                  </select>
                </div>

                {/* Orientation setup */}
                <div className={`flex flex-col text-[10px] ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                  <span className="font-semibold mb-0.5">Orientation</span>
                  <div className="flex space-x-1">
                    <button
                      id="orientation-portrait"
                      onClick={() => onStyleChange({ orientation: 'portrait' })}
                      className={`px-1.5 py-0.5 text-[10px] rounded border ${
                        docStyle.orientation === 'portrait'
                          ? 'bg-[#2b579a] text-white font-medium border-[#2b579a]'
                          : isDarkMode
                          ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      Portrait
                    </button>
                    <button
                      id="orientation-landscape"
                      onClick={() => onStyleChange({ orientation: 'landscape' })}
                      className={`px-1.5 py-0.5 text-[10px] rounded border ${
                        docStyle.orientation === 'landscape'
                          ? 'bg-[#2b579a] text-white font-medium border-[#2b579a]'
                          : isDarkMode
                          ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      Paysage
                    </button>
                  </div>
                </div>
              </div>
              <span className={`text-[9px] ${isDarkMode ? 'text-slate-500' : 'text-gray-400'} mt-0.5 uppercase tracking-wider font-light`}>Mise En Page</span>
            </div>

            {/* 2. Sauts de Page & Sections */}
            <div className="flex flex-col items-center justify-between h-full px-3 py-1 flex-shrink-0">
              <div className="flex space-x-2 items-center flex-grow">
                <button
                  onClick={() => onExecuteCommand('insertHTML', '<hr class="rich-page-break" style="border:none; border-top: 2px dashed #3b82f6; height:1px; margin: 30px 0; position:relative; text-align:center;" />')}
                  className={`${isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-gray-100 text-gray-700'} px-2 py-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition`}
                  title="Insérer un saut de page pour l'édition"
                >
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span className={`text-[9px] ${isDarkMode ? 'text-slate-300' : 'text-gray-700'} mt-0.5`}>Saut de Page</span>
                </button>
                <button
                  onClick={() => onExecuteCommand('insertHTML', '<div style="clear:both; margin:15px 0; border-top:1px dotted #94a3b8;" class="section-break"></div>')}
                  className={`${isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-gray-100 text-gray-700'} px-2 py-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition`}
                  title="Insérer une séparation de section"
                >
                  <Columns2 className="w-4 h-4 text-amber-500" />
                  <span className={`text-[9px] ${isDarkMode ? 'text-slate-300' : 'text-gray-700'} mt-0.5`}>Saut Section</span>
                </button>
              </div>
              <span className={`text-[9px] ${isDarkMode ? 'text-slate-500' : 'text-gray-400'} mt-0.5 uppercase tracking-wider font-light`}>Sauts</span>
            </div>

            {/* 3. Retraits de Paragraphe */}
            <div className="flex flex-col items-center justify-between h-full px-3 py-1 flex-shrink-0">
              <div className={`flex space-x-2 items-center flex-grow text-[10px] ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                <button
                  onClick={() => onExecuteCommand('indent')}
                  className={`${isDarkMode ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-gray-200 hover:bg-gray-100 text-gray-700'} border px-2 py-1 rounded flex items-center space-x-1`}
                  title="Augmenter le retrait du paragraphe actif"
                >
                  <AlignRight className="w-3.5 h-3.5 text-blue-400" />
                  <span>Retrait +</span>
                </button>
                <button
                  onClick={() => onExecuteCommand('outdent')}
                  className={`${isDarkMode ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-gray-200 hover:bg-gray-100 text-gray-700'} border px-2 py-1 rounded flex items-center space-x-1`}
                  title="Diminuer le retrait du paragraphe actif"
                >
                  <AlignLeft className="w-3.5 h-3.5 text-blue-400" />
                  <span>Retrait -</span>
                </button>
              </div>
              <span className={`text-[9px] ${isDarkMode ? 'text-slate-500' : 'text-gray-400'} mt-0.5 uppercase tracking-wider font-light`}>Paragraphe (Retraits)</span>
            </div>

            {/* 4. Organisation des Objets */}
            <div className="flex flex-col items-center justify-between h-full px-3 py-1 flex-shrink-0">
              <div className={`flex items-center flex-grow space-x-1.5 text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                <button onClick={() => onExecuteCommand('justifyLeft')} className={`${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100'} p-1.5 rounded transition`} title="Aligner à gauche">
                  <AlignLeft className="w-4 h-4" />
                </button>
                <button onClick={() => onExecuteCommand('justifyCenter')} className={`${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100'} p-1.5 rounded transition`} title="Centrer">
                  <AlignCenter className="w-4 h-4" />
                </button>
                <button onClick={() => onExecuteCommand('justifyRight')} className={`${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100'} p-1.5 rounded transition`} title="Aligner à droite">
                  <AlignRight className="w-4 h-4" />
                </button>
              </div>
              <span className={`text-[9px] ${isDarkMode ? 'text-slate-500' : 'text-gray-400'} mt-0.5 uppercase tracking-wider font-light`}>Organiser</span>
            </div>

          </div>
        )}

        {/* ======================================= */}
        {/* TAB: RÉFÉRENCES */}
        {/* ======================================= */}
        {activeTab === 'Références' && (
          <div className="flex items-center h-full">
            <div className="flex flex-col items-center h-full justify-between py-1 px-3">
              <div className="flex space-x-3 flex-grow items-center">
                <button
                  id="btn-contents-table"
                  onClick={onInsertTableOfContents}
                  className={`${isDarkMode ? 'hover:bg-slate-800 text-slate-200 border-slate-700' : 'hover:bg-gray-100 text-gray-700 border-gray-200'} px-3 py-1.5 rounded text-center flex items-center space-x-2 border cursor-pointer transition`}
                >
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span className="text-[11px] font-semibold">Table des Matières</span>
                </button>

                <button
                  id="btn-footnote"
                  onClick={onInsertFootnote}
                  className={`${isDarkMode ? 'hover:bg-slate-800 text-slate-200 border-slate-700' : 'hover:bg-gray-100 text-gray-700 border-gray-200'} px-3 py-1.5 rounded text-center flex items-center space-x-2 border cursor-pointer transition`}
                >
                  <Bookmark className="h-4 w-4 text-blue-500" />
                  <span className="text-[11px]">Note de bas de page</span>
                </button>
              </div>
              <span className={`text-[9px] ${isDarkMode ? 'text-slate-500' : 'text-gray-400'} uppercase tracking-wider font-light`}>Table des matières & Notes</span>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* TAB: PUBLIPOSTAGE */}
        {/* ======================================= */}
        {activeTab === 'Publipostage' && (
          <div className="flex flex-col items-center h-full justify-between py-1 px-4">
            <div className="flex space-x-3 text-xs items-center flex-grow">
              <button
                onClick={() => onExecuteCommand('insertHTML', '<div style="border: 2px dashed #999; padding: 20px; background-color: #fafafa; margin: 10px 0;"><h3>[ENVELOPPE PUBLIPOSTAGE]</h3><p>Destinataire : {{Nom_Client}}<br/>Adresse : {{Adresse}}</p></div>')}
                className={`${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-750' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'} px-3 py-1.5 border rounded shadow-sm transition flex items-center space-x-1.5`}
              >
                <Send className="w-3.5 h-3.5 text-blue-500" />
                <span>Créer Enveloppes</span>
              </button>
              <button
                onClick={() => onExecuteCommand('insertHTML', '<span style="background-color: #e3faf2; border: 1px solid #12b886; padding: 2px 4px; border-radius: 4px; font-weight: bold; font-family: Courier; font-size: 11px;">&lt;&lt;Placeholder_Client&gt;&gt;</span>')}
                className={`${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-750' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'} px-3 py-1.5 border rounded shadow-sm transition flex items-center space-x-1.5`}
              >
                <Hash className="w-3.5 h-3.5 text-emerald-500" />
                <span>Insérer champ de fusion</span>
              </button>
            </div>
            <span className={`text-[9px] ${isDarkMode ? 'text-slate-500' : 'text-gray-400'} uppercase tracking-wider font-light`}>Démarrer la fusion</span>
          </div>
        )}

        {/* ======================================= */}
        {/* TAB: RÉVISION */}
        {/* ======================================= */}
        {activeTab === 'Révision' && (
          <div className={`flex h-16 divide-x ${isDarkMode ? 'divide-slate-800' : 'divide-gray-200'} overflow-x-auto select-none items-center pr-4`}>
            {/* Integrated spellcheck AI, Grammar Panel */}
            <div className="flex flex-col items-center justify-between h-full px-3 py-1 flex-shrink-0">
              <div className="flex space-x-2.5 flex-grow items-center">
                {onOpenGrammarPanel && (
                  <button
                    id="btn-review-grammar-live"
                    onClick={onOpenGrammarPanel}
                    className="bg-[#2b579a] hover:bg-blue-800 text-white font-semibold py-1.5 px-3 rounded text-center flex items-center space-x-1.5 shadow-sm transition"
                    title="Ouvrir le panneau d'analyse grammaticale en temps réel"
                  >
                    <Sparkles className="h-4 w-4 text-blue-200" />
                    <span className="text-[11px]">
                      Analyse Grammaticale {grammarIssuesCount > 0 && `(${grammarIssuesCount})`}
                    </span>
                  </button>
                )}

                {onOpenSynonyms && (
                  <button
                    id="btn-review-synonyms"
                    onClick={() => onOpenSynonyms()}
                    className="bg-indigo-700 hover:bg-indigo-800 text-white font-semibold py-1.5 px-3 rounded text-center flex items-center space-x-1.5 shadow-sm transition"
                    title="Dictionnaire des Synonymes & Nuances (Shift+F7)"
                  >
                    <BookOpen className="h-4 w-4 text-indigo-200" />
                    <span className="text-[11px]">Synonymes</span>
                  </button>
                )}

                <button
                  id="btn-review-spellcheck"
                  onClick={onTriggerSpellcheck}
                  className="bg-slate-700 hover:bg-slate-800 text-white font-semibold py-1.5 px-3 rounded text-center flex items-center space-x-1.5 shadow-sm transition"
                  title="Correction complète IA"
                >
                  <CheckCircle className="h-4 w-4 text-emerald-300" />
                  <span className="text-[11px]">Corriger Document</span>
                </button>

                <button
                  onClick={onTriggerAutoWrite}
                  className="bg-teal-700 hover:bg-teal-800 text-white font-semibold py-1.5 px-3 rounded text-center flex items-center space-x-1.5 shadow-sm transition"
                  title="Intelligence Artificielle de rédaction"
                >
                  <Sparkle className="h-4 w-4 text-teal-200" />
                  <span className="text-[11px]">Rédiger avec IA</span>
                </button>
              </div>
              <span className={`text-[9px] ${isDarkMode ? 'text-slate-500' : 'text-gray-400'} uppercase tracking-wider font-light`}>Grammaire & IA</span>
            </div>

            {/* Collaborative toggler matching real co-editing requests */}
            <div className="flex flex-col items-center justify-between h-full px-3 py-1 flex-shrink-0">
              <div className="flex items-center flex-grow">
                <button
                  id="btn-toggle-collab"
                  onClick={onToggleCollab}
                  className={`py-1.5 px-3 rounded font-medium flex items-center space-x-2 border transition cursor-pointer ${
                    collabActive
                      ? 'bg-emerald-600 border-emerald-700 text-white shadow-sm hover:bg-emerald-700'
                      : isDarkMode
                      ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Users className="h-4 w-4 flex-shrink-0" />
                  <span className="text-[11px]">{collabActive ? 'Collaboration : Active' : 'Collaboration'}</span>
                </button>
              </div>
              <span className={`text-[9px] ${isDarkMode ? 'text-slate-500' : 'text-gray-400'} uppercase tracking-wider font-light`}>Mode multi-auteur</span>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* TAB: AFFICHAGE */}
        {/* ======================================= */}
        {activeTab === 'Affichage' && (
          <div className={`flex h-16 divide-x ${isDarkMode ? 'divide-slate-800' : 'divide-gray-200'} overflow-x-auto select-none items-center pr-4`}>
            {/* Fullscreen / Focus Mode */}
            <div className="flex flex-col items-center justify-between h-full px-3 py-1 flex-shrink-0">
              <div className="flex space-x-2 flex-grow items-center">
                {onToggleFullscreen && (
                  <button
                    id="btn-ribbon-fullscreen"
                    onClick={onToggleFullscreen}
                    className={`py-1.5 px-3 rounded text-center flex items-center space-x-1.5 shadow-sm border transition ${
                      isFullscreen
                        ? 'bg-blue-600 text-white border-blue-700 font-semibold'
                        : isDarkMode
                        ? 'bg-slate-800 hover:bg-slate-750 text-slate-200 border-slate-700 font-medium'
                        : 'bg-white hover:bg-gray-50 text-gray-800 border-gray-300 font-medium'
                    }`}
                    title="Basculer en mode plein écran sans distraction (F11)"
                  >
                    {isFullscreen ? <Minimize2 className="h-4 w-4 text-blue-100" /> : <Maximize2 className="h-4 w-4 text-[#2b579a]" />}
                    <span className="text-[11px]">{isFullscreen ? 'Quitter Plein écran' : 'Plein écran'}</span>
                  </button>
                )}
              </div>
              <span className={`text-[9px] ${isDarkMode ? 'text-slate-500' : 'text-gray-400'} uppercase tracking-wider font-light`}>Mode de Vue</span>
            </div>

            {/* Rulers, grids representation toggler */}
            <div className="flex flex-col items-center justify-between h-full px-3 py-1 flex-shrink-0">
              <div className="flex space-x-4 flex-grow items-center">
                <label className={`flex items-center space-x-2 text-xs ${isDarkMode ? 'text-slate-300' : 'text-gray-700'} cursor-pointer`}>
                  <input
                    type="checkbox"
                    checked={rulerVisible}
                    onChange={onToggleRuler}
                    className="rounded border-gray-300 text-[#2b579a] focus:ring-[#2b579a]"
                  />
                  <span>Afficher règle</span>
                </label>

                <label className={`flex items-center space-x-2 text-xs ${isDarkMode ? 'text-slate-300' : 'text-gray-700'} cursor-pointer`}>
                  <input
                    type="checkbox"
                    checked={gridVisible}
                    onChange={onToggleGrid}
                    className="rounded border-gray-300 text-[#2b579a] focus:ring-[#2b579a]"
                  />
                  <span>Quadrillage</span>
                </label>
              </div>
              <span className={`text-[9px] ${isDarkMode ? 'text-slate-500' : 'text-gray-400'} uppercase tracking-wider font-light`}>Afficher / Masquer</span>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* TAB: DESSIN */}
        {/* ======================================= */}
        {activeTab === 'Dessin' && (
          <div className={`flex h-16 divide-x ${isDarkMode ? 'divide-slate-800' : 'divide-gray-250'} overflow-x-auto select-none items-center pr-4`}>
            
            {/* 1. Outils de Dessin */}
            <div className="flex flex-col items-center justify-between h-full px-3 py-1 flex-shrink-0">
              <div className="flex space-x-2 items-center flex-grow">
                <button
                  onClick={() => onExecuteCommand('insertHTML', '<span style="font-family:cursive; font-size:14px; color:#2b579a; border-bottom:1px dashed #2b579a;" class="drawing-pen-blue">Stylo Bleu</span>')}
                  className={`${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100'} p-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition text-blue-500`}
                  title="Stylo fin classique"
                >
                  <PenTool className="w-4 h-4" />
                  <span className={`text-[9px] ${isDarkMode ? 'text-slate-300' : 'text-gray-700'} mt-0.5 font-medium`}>Stylo Bleu</span>
                </button>
                <div className="flex flex-col space-y-1">
                  <button
                    onClick={() => onExecuteCommand('backColor', '#ffeb3b')}
                    className={`${isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-gray-200 text-gray-700'} text-left px-1.5 py-0.5 rounded text-[9px] flex items-center space-x-1`}
                    title="Surligner en Jaune"
                  >
                    <span className="w-2 h-2 bg-[#ffeb3b] rounded-full inline-block"></span>
                    <span>Jaune</span>
                  </button>
                  <button
                    onClick={() => onExecuteCommand('backColor', '#ffc0cb')}
                    className={`${isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-gray-200 text-gray-700'} text-left px-1.5 py-0.5 rounded text-[9px] flex items-center space-x-1`}
                    title="Surligner en Rose"
                  >
                    <span className="w-2 h-2 bg-[#ffc0cb] rounded-full inline-block"></span>
                    <span>Rose</span>
                  </button>
                </div>
              </div>
              <span className={`text-[9px] ${isDarkMode ? 'text-slate-500' : 'text-gray-400'} mt-0.5 uppercase tracking-wider font-light`}>Outils de Traçage</span>
            </div>

            {/* 2. Palette de Couleurs */}
            <div className="flex flex-col items-center justify-between h-full px-3 py-1 flex-shrink-0">
              <div className="flex items-center flex-grow space-x-1">
                <button onClick={() => onExecuteCommand('foreColor', '#000000')} className="w-4 h-4 rounded-full bg-black border border-gray-300 hover:scale-110 transition" title="Noir" />
                <button onClick={() => onExecuteCommand('foreColor', '#dc2626')} className="w-4 h-4 rounded-full bg-red-600 border border-gray-300 hover:scale-110 transition" title="Rouge" />
                <button onClick={() => onExecuteCommand('foreColor', '#2b579a')} className="w-4 h-4 rounded-full bg-[#2b579a] border border-gray-300 hover:scale-110 transition" title="Bleu Word" />
                <button onClick={() => onExecuteCommand('foreColor', '#16a34a')} className="w-4 h-4 rounded-full bg-green-600 border border-gray-300 hover:scale-110 transition" title="Vert" />
                <button onClick={() => onExecuteCommand('foreColor', '#ca8a04')} className="w-4 h-4 rounded-full bg-yellow-600 border border-gray-300 hover:scale-110 transition" title="Doré" />
                <button onClick={() => onExecuteCommand('foreColor', '#9333ea')} className="w-4 h-4 rounded-full bg-purple-600 border border-gray-350 hover:scale-110 transition" title="Violet" />
              </div>
              <span className={`text-[9px] ${isDarkMode ? 'text-slate-500' : 'text-gray-400'} mt-0.5 uppercase tracking-wider font-light`}>Palette d'Écriture</span>
            </div>

            {/* 3. Formes Géométriques */}
            <div className="flex flex-col items-center justify-between h-full px-3 py-1 flex-shrink-0">
              <div className="flex space-x-2 items-center flex-grow">
                <button
                  onClick={() => onExecuteCommand('insertHTML', '<div style="border: 2px solid #2b579a; padding: 15px; margin: 10px 0; border-radius: 4px; background: #fdfdfd; min-height: 40px;" contenteditable="true" class="shape-rectangle-box"><p style="font-size:11px; color:#475569; margin:0;">[Rectangle modifiable - Saisissez votre texte ici]</p></div>')}
                  className={`${isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-gray-100 text-gray-800'} p-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition`}
                  title="Rectangle"
                >
                  <div className="w-4 h-3.5 border-2 border-blue-500 rounded-sm"></div>
                  <span className={`text-[9px] ${isDarkMode ? 'text-slate-300' : 'text-gray-700'} mt-0.5`}>Rectangle</span>
                </button>
                <button
                  onClick={() => onExecuteCommand('insertHTML', '<div style="border: 2px solid #ca8a04; border-radius: 50%; width: 90px; height: 90px; margin: 15px auto; display: flex; align-items: center; justify-content: center; text-align: center; background: #fffbeb;" contenteditable="true" class="shape-circle-box"><p style="font-size:10px; color:#ca8a04; margin:0; padding:4px;">Cercle</p></div>')}
                  className={`${isDarkMode ? 'hover:bg-slate-800 text-yellow-500' : 'hover:bg-gray-100 text-yellow-600'} p-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition`}
                  title="Cercle"
                >
                  <div className="w-4 h-4 border-2 border-amber-500 rounded-full"></div>
                  <span className={`text-[9px] ${isDarkMode ? 'text-slate-300' : 'text-gray-700'} mt-0.5`}>Cercle</span>
                </button>
              </div>
              <span className={`text-[9px] ${isDarkMode ? 'text-slate-500' : 'text-gray-400'} mt-0.5 uppercase tracking-wider font-light`}>Formes</span>
            </div>

            {/* 4. Dessin Libre & Signatures */}
            <div className="flex flex-col items-center justify-between h-full px-3 py-1 flex-shrink-0">
              <div className="flex space-x-2 items-center flex-grow">
                <button
                  onClick={() => onExecuteCommand('insertHTML', '<div style="border-bottom: 2px solid #111827; width:220px; height:80px; margin: 15px auto; display:flex; align-items:end; justify-content:center; font-family:\'Brush Script MT\', cursive, sans-serif; font-size:22px; color:#1e3a8a;" contenteditable="true" class="handwritten-signature">Signé : J. Dupont</div>')}
                  className={`${isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-gray-100 text-gray-800'} p-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition`}
                  title="Insérer Signature manuscrite"
                >
                  <PenTool className="w-4 h-4 text-emerald-500" />
                  <span className={`text-[9px] ${isDarkMode ? 'text-slate-300' : 'text-gray-700'} mt-0.5`}>Signature</span>
                </button>
                <button
                  onClick={() => onExecuteCommand('insertHTML', '<div style="border: 2px dashed #9ca3af; padding: 20px; text-align: center; margin: 10px 0; background: #fafafa; border-radius: 8px;" contenteditable="true"><p style="font-size:12px; color:#6b7280; font-style:italic;">[Zone de dessin libre - Double-cliquez pour esquisser]</p></div>')}
                  className={`${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100'} p-1.5 rounded text-center text-xs flex flex-col items-center cursor-pointer transition text-purple-400`}
                  title="Insérer Zone d\'Esquisse"
                >
                  <Palette className="w-4 h-4" />
                  <span className={`text-[9px] ${isDarkMode ? 'text-slate-300' : 'text-gray-700'} mt-0.5`}>Esquisse</span>
                </button>
              </div>
              <span className={`text-[9px] ${isDarkMode ? 'text-slate-500' : 'text-gray-400'} mt-0.5 uppercase tracking-wider font-light`}>Signatures & Canevas</span>
            </div>

          </div>
        )}

        {/* ======================================= */}
        {/* TAB: EXTENSIONS */}
        {/* ======================================= */}
        {activeTab === 'Extensions' && (
          <div className={`flex h-16 divide-x ${isDarkMode ? 'divide-slate-800' : 'divide-gray-200'} overflow-x-auto select-none items-center pr-4`}>
            {/* IA et Outils intelligents Section */}
            <div className="flex flex-col items-center justify-between h-full px-3 py-1 flex-shrink-0">
              <div className="flex space-x-3 items-center flex-grow">
                <button
                  onClick={() => onExecuteCommand('insertHTML', '<div style="background-color:#fef2f2; border-left:4px solid #ef4444; padding:12px; margin:10px 0;" contenteditable="false"><h5>Analyse Anti-Plagiat Manix Word</h5><p style="font-size:11px; margin-top:4px;">0% de contenu dupliqué détecté. Ce document est 100% original !</p></div>')}
                  className={`${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100'} p-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition text-rose-500`}
                  title="Analyse de plagiat"
                >
                  <Shield className="w-4 h-4" />
                  <span className={`text-[9px] ${isDarkMode ? 'text-slate-300' : 'text-gray-650'} mt-0.5`}>Anti-Plagiat</span>
                </button>
                <button
                  onClick={() => onExecuteCommand('insertHTML', '<div style="text-align:center; margin:15px auto;" contenteditable="false"><img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://manix-word.office" alt="QR Code" style="border:1px solid #94a3b8; padding:6px; background:#fff; display:inline-block;" /><p style="font-size:10px; color:#475569; margin-top:4px; font-weight:500;">Scannez pour partager ce document</p></div>')}
                  className={`${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100'} p-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition text-sky-500`}
                  title="Générer QR Code de partage"
                >
                  <QrCode className="w-4 h-4" />
                  <span className={`text-[9px] ${isDarkMode ? 'text-slate-300' : 'text-gray-650'} mt-0.5`}>Générer QR</span>
                </button>
              </div>
              <span className={`text-[9px] ${isDarkMode ? 'text-slate-500' : 'text-gray-400'} mt-0.5 uppercase tracking-wider font-light`}>Extensions Manix AI</span>
            </div>

            {/* Éléments de Données */}
            <div className="flex flex-col items-center justify-between h-full px-3 py-1 flex-shrink-0">
              <div className="flex space-x-2 items-center flex-grow">
                <button
                  onClick={() => onExecuteCommand('insertHTML', '<table style="border-collapse:collapse; width:100%; border:1px solid #cbd5e1; font-family:sans-serif; text-align:center;" contenteditable="true"><tr style="background:#f1f5f9; font-weight:bold;"><td style="border:1px solid #cbd5e1; padding:6px;">PRODUIT</td><td style="border:1px solid #cbd5e1; padding:6px;">UNITÉS</td><td style="border:1px solid #cbd5e1; padding:6px;">PRIX</td></tr><tr><td style="border:1px solid #cbd5e1; padding:6px;">Manix Suite</td><td style="border:1px solid #cbd5e1; padding:6px;">120</td><td style="border:1px solid #cbd5e1; padding:6px;">49.99 €</td></tr></table><p><br></p>')}
                  className={`${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100'} p-1.5 rounded text-center text-xs flex flex-col items-center cursor-pointer transition text-emerald-500`}
                  title="Tableau interactif"
                >
                  <Table className="w-4 h-4" />
                  <span className={`text-[9px] ${isDarkMode ? 'text-slate-300' : 'text-gray-650'} mt-0.5`}>Mini-Tableau</span>
                </button>
              </div>
              <span className={`text-[9px] ${isDarkMode ? 'text-slate-500' : 'text-gray-400'} mt-0.5 uppercase tracking-wider font-light`}>Données & Tableurs</span>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* TAB: AIDE */}
        {/* ======================================= */}
        {activeTab === 'Aide' && (
          <div className={`flex h-16 divide-x ${isDarkMode ? 'divide-slate-800' : 'divide-gray-200'} overflow-x-auto select-none items-center pr-4`}>
            <div className="flex flex-col items-center justify-between h-full px-3 py-1 flex-shrink-0">
              <div className="flex space-x-3 items-center flex-grow">
                <button
                  onClick={() => onExecuteCommand('insertHTML', '<div style="background-color:#eff6ff; border:1px dashed #3b82f6; border-left:4px solid #2563eb; padding:15px; margin:15px 0; border-radius:4px;"><h4 style="margin:0 0 6px 0; color:#1e3a8a;">Centre d Aide Manix Word</h4><p style="font-size:12px; line-height:1.5; color:#1e40af;"><strong>Raccourcis indispensables :</strong><br/>• Ctrl + S : Sauvegarde rapide<br/>• Ctrl + Shift + P : Exporter en PDF d un clic<br/>• Double-cliquer pour éditer librement n importe quelle section !</p></div>')}
                  className={`${isDarkMode ? 'hover:bg-slate-800 text-blue-400' : 'hover:bg-gray-100 text-blue-700'} p-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition`}
                  title="Guide d'aide interactif"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span className={`text-[9px] ${isDarkMode ? 'text-slate-300' : 'text-gray-650'} mt-0.5 font-medium`}>Guide Aide</span>
                </button>
                <button
                  onClick={() => alert("Support technique Manix Word : Contactez-nous à support@manix.corp pour toute assistance relative à l application.")}
                  className={`${isDarkMode ? 'hover:bg-slate-800 text-emerald-400' : 'hover:bg-gray-100 text-emerald-600'} p-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition`}
                  title="Contacter le helpdesk"
                >
                  <Phone className="w-4 h-4" />
                  <span className={`text-[9px] ${isDarkMode ? 'text-slate-300' : 'text-gray-650'} mt-0.5`}>Support</span>
                </button>
              </div>
              <span className={`text-[9px] ${isDarkMode ? 'text-slate-500' : 'text-gray-400'} mt-0.5 uppercase tracking-wider font-light`}>Documentation</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
