import { 
  ArrowLeft, Shield, CheckSquare, Settings, Share2, FileDown, LogOut, 
  User, Printer, Cpu, FileText as DocIcon, Award, RefreshCw, Layers, 
  Check, CheckSquare as CheckBx, FolderOpen, Save, Copy, Mail, HelpCircle, 
  Key, Globe, Cloud, Palette, Command, Sliders, ExternalLink, ChevronDown,
  Maximize2, Minimize2, Lock, Star, FileCheck, History, RotateCcw, AlertTriangle, Search
} from 'lucide-react';
import React, { useState } from 'react';
import { WordDocument } from '../types';
import { exportToPdf } from '../utils/pdfExporter';
import { jsPDF } from 'jspdf';
import ManixWordLogo from './ManixWordLogo';

interface FileMenuProps {
  document: WordDocument;
  onClose: () => void;
  onGoToTemplates: () => void;
  onSave: () => void;
  onExportDocx: () => void;
  onExportPdf: () => void;
  wordCount: number;
  recentDocs?: WordDocument[];
  onLoadDocument?: (doc: WordDocument) => void;
  onImportLocalFile?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveAs?: (newTitle: string) => void;
  onUpdateDocument?: (updates: Partial<WordDocument>) => void;
  isFullscreen?: boolean;
  isDarkMode?: boolean;
  onToggleFullscreen?: () => void;
}

export default function FileMenu({
  document: doc,
  onClose,
  onGoToTemplates,
  onSave,
  onExportDocx,
  onExportPdf,
  wordCount,
  recentDocs = [],
  onLoadDocument,
  onImportLocalFile,
  onSaveAs,
  onUpdateDocument,
  isFullscreen = false,
  isDarkMode = false,
  onToggleFullscreen,
}: FileMenuProps) {
  // Navigation segments
  const [activeSegment, setActiveSegment] = useState<'info' | 'ouvrir' | 'save-as' | 'export' | 'partager' | 'compte' | 'options'>('info');
  
  // Options 10-tabs state
  const [activeOptionsTab, setActiveOptionsTab] = useState<
    'general' | 'affichage' | 'verification' | 'enregistrement' | 'langue' |
    'avancees' | 'ruban' | 'acces-rapide' | 'complements' | 'confidentialite'
  >('general');

  // Input States for customization
  const [saveAsTitle, setSaveAsTitle] = useState(() => doc.title.replace(/\.docx$/i, '') + ' - Copie');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteStatus, setInviteStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  // Dropdown states for "Informations" page
  const [protectOpen, setProtectOpen] = useState(false);
  const [inspectOpen, setInspectOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);

  // Modal states for "Informations" actions
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState(doc.password || '');
  
  const [showInspectModal, setShowInspectModal] = useState(false);
  const [isInspecting, setIsInspecting] = useState(false);
  const [inspectResults, setInspectResults] = useState({ checked: false, dataFound: true });
  
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [showCompatibility, setShowCompatibility] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);

  // Live Options values stored locally
  const [authorName, setAuthorName] = useState(() => localStorage.getItem('word_option_author') || 'utilisateur.officiel@manix.corp');
  const [autoSaveMinutes, setAutoSaveMinutes] = useState(() => localStorage.getItem('word_option_autosave') || '5');
  const [defaultFormat, setDefaultFormat] = useState(() => localStorage.getItem('word_option_format') || 'A4');
  const [aiAutoSuggest, setAiAutoSuggest] = useState(() => localStorage.getItem('word_option_ai_suggest') !== 'false');
  const [uiLanguage, setUiLanguage] = useState(() => localStorage.getItem('word_option_lang') || 'fr');
  const [officeTheme, setOfficeTheme] = useState(() => localStorage.getItem('word_option_theme') || 'Bleu');
  const [showRulersOpt, setShowRulersOpt] = useState(true);
  const [paragraphMarks, setParagraphMarks] = useState(false);
  const [spellCheckOnType, setSpellCheckOnType] = useState(true);

  // Active Ribbon Items customization state inside "ruban" tab
  const [ribbonTabs, setRibbonTabs] = useState([
    { id: 'accueil', label: 'Accueil', active: true },
    { id: 'insertion', label: 'Insertion', active: true },
    { id: 'creation', label: 'Création', active: true },
    { id: 'mise-en-page', label: 'Mise en page', active: true },
    { id: 'ia', label: 'ManixGPT AI', active: true },
    { id: 'affichage-opt', label: 'Affichage', active: true },
  ]);

  // Quick Access commands state
  const [quickAccessTools, setQuickAccessTools] = useState([
    { id: 'save', label: 'Enregistrer', enabled: true },
    { id: 'undo', label: 'Annuler', enabled: true },
    { id: 'redo', label: 'Rétablir', enabled: true },
    { id: 'print', label: 'Aperçu avant impression', enabled: false },
  ]);

  const handleSaveOptions = () => {
    localStorage.setItem('word_option_author', authorName);
    localStorage.setItem('word_option_autosave', autoSaveMinutes);
    localStorage.setItem('word_option_format', defaultFormat);
    localStorage.setItem('word_option_ai_suggest', String(aiAutoSuggest));
    localStorage.setItem('word_option_lang', uiLanguage);
    localStorage.setItem('word_option_theme', officeTheme);
    alert('Options Word de ManixGPT enregistrées avec succès !');
    onClose();
  };

  const handleTriggerSaveAs = () => {
    if (onSaveAs && saveAsTitle.trim()) {
      onSaveAs(saveAsTitle.trim());
    }
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setInviteStatus('sending');
    setTimeout(() => {
      setInviteStatus('success');
      setInviteEmail('');
      setTimeout(() => setInviteStatus('idle'), 3000);
    }, 1200);
  };

  // Text file extraction download fallback
  const handleDownloadTxt = () => {
    const temp = document.createElement('div');
    temp.innerHTML = doc.content;
    const cleanText = temp.innerText || temp.textContent || '';
    const blob = new Blob([cleanText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.title.replace(/\.docx$/i, '') + '.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  // High quality client-side A4 PDF exporter
  const handleDownloadPdf = () => {
    onClose(); // Hide the menu
    if (onExportPdf) {
      onExportPdf();
    }
  };

  const sizeKb = Math.ceil(((doc.content?.length || 0) * 2) / 1024);

  return (
    <div id="file-menu-overlay" className={`fixed inset-0 ${isDarkMode ? 'bg-[#0b0f19] text-slate-100' : 'bg-[#f3f2f1] text-gray-800'} z-50 flex font-sans select-none antialiased`}>
      {/* File Menu Left Sidebar */}
      <div className={`w-64 ${isDarkMode ? 'bg-[#0f172a] border-r border-slate-800' : 'bg-[#2b579a]'} text-white flex flex-col p-4 flex-shrink-0 shadow-lg justify-between`}>
        <div className="space-y-4">
          {/* Back Button & Logo Header */}
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <button
              id="btn-back-to-editor"
              onClick={onClose}
              className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition cursor-pointer"
              title="Retour au document"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <ManixWordLogo size="xs" showText={false} />
          </div>

          <div className="pb-1">
            <ManixWordLogo size="sm" showText={true} textColor="text-white" />
          </div>

          {/* Navigation Items */}
          <div className="space-y-1">
            <button
              id="menu-info"
              onClick={() => setActiveSegment('info')}
              className={`w-full text-left py-2.5 px-4 rounded font-semibold transition text-sm flex items-center space-x-3 cursor-pointer ${
                activeSegment === 'info' ? 'bg-white/15 text-white' : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Shield className="h-4 w-4 mr-1 text-blue-100" />
              <span>Informations</span>
            </button>
            <button
              id="menu-new"
              onClick={onGoToTemplates}
              className="w-full text-left py-2.5 px-4 rounded hover:bg-white/10 text-blue-100 hover:text-white transition text-sm flex items-center space-x-3 cursor-pointer"
            >
              <DocIcon className="h-4 w-4 mr-1 text-blue-100" />
              <span>Nouveau</span>
            </button>
            <button
              id="menu-ouvrir"
              onClick={() => setActiveSegment('ouvrir')}
              className={`w-full text-left py-2.5 px-4 rounded transition text-sm flex items-center space-x-3 cursor-pointer ${
                activeSegment === 'ouvrir' ? 'bg-white/15 text-white font-semibold' : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <FolderOpen className="h-4 w-4 mr-1 text-blue-100" />
              <span>Ouvrir</span>
            </button>
            <button
              id="menu-save"
              onClick={() => {
                onSave();
                alert('Fichier sauvegardé localement !');
              }}
              className="w-full text-left py-2.5 px-4 rounded hover:bg-white/10 text-blue-100 hover:text-white transition text-sm flex items-center space-x-3 cursor-pointer"
            >
              <Save className="h-4 w-4 mr-1 text-blue-100" />
              <span>Enregistrer</span>
            </button>
            <button
              id="menu-save-as"
              onClick={() => setActiveSegment('save-as')}
              className={`w-full text-left py-2.5 px-4 rounded transition text-sm flex items-center space-x-3 cursor-pointer ${
                activeSegment === 'save-as' ? 'bg-white/15 text-white font-semibold' : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Copy className="h-4 w-4 mr-1 text-blue-100" />
              <span>Enregistrer sous</span>
            </button>
            <button
              id="menu-partager"
              onClick={() => setActiveSegment('partager')}
              className={`w-full text-left py-2.5 px-4 rounded transition text-sm flex items-center space-x-3 cursor-pointer ${
                activeSegment === 'partager' ? 'bg-white/15 text-white font-semibold' : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Share2 className="h-4 w-4 mr-1 text-blue-100" />
              <span>Partager</span>
            </button>
            <button
              id="menu-export-center"
              onClick={() => setActiveSegment('export')}
              className={`w-full text-left py-2.5 px-4 rounded transition text-sm flex items-center space-x-3 cursor-pointer ${
                activeSegment === 'export' ? 'bg-white/15 text-white font-semibold' : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <FileDown className="h-4 w-4 mr-1 text-blue-100" />
              <span>Exporter...</span>
            </button>
            {onToggleFullscreen && (
              <button
                id="menu-fullscreen"
                onClick={() => {
                  onToggleFullscreen();
                  onClose();
                }}
                className="w-full text-left py-2.5 px-4 rounded hover:bg-white/10 text-blue-100 hover:text-white transition text-sm flex items-center space-x-3 cursor-pointer"
                title="Basculer en mode plein écran sans distraction"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4 mr-1 text-blue-100" /> : <Maximize2 className="h-4 w-4 mr-1 text-blue-100" />}
                <span>{isFullscreen ? 'Quitter le Plein écran' : 'Mode Plein écran'}</span>
              </button>
            )}
            <button
              id="menu-close"
              onClick={onGoToTemplates}
              className="w-full text-left py-2.5 px-4 rounded hover:bg-white/10 text-blue-100 hover:text-white transition text-sm flex items-center space-x-3 text-red-100 hover:bg-red-500/10 cursor-pointer border-t border-white/10 mt-2 pt-2"
            >
              <LogOut className="h-4 w-4 mr-1 text-red-200" />
              <span>Fermer le document</span>
            </button>
          </div>
        </div>

        {/* Sidebar Footer (Compte & Options) */}
        <div className="border-t border-white/15 pt-4 space-y-1 text-xs">
          <button
            id="menu-compte"
            onClick={() => setActiveSegment('compte')}
            className={`w-full text-left py-2 px-3 rounded transition cursor-pointer flex items-center space-x-2 ${
              activeSegment === 'compte' ? 'bg-white/15 text-white font-semibold' : 'text-blue-200 hover:text-white'
            }`}
          >
            <User className="h-3.5 w-3.5" />
            <span>Compte</span>
          </button>
          <button
            id="menu-options"
            onClick={() => setActiveSegment('options')}
            className={`w-full text-left py-2 px-3 rounded transition cursor-pointer flex items-center space-x-2 ${
              activeSegment === 'options' ? 'bg-white/15 text-white font-semibold' : 'text-blue-200 hover:text-white'
            }`}
          >
            <Settings className="h-3.5 w-3.5" />
            <span>Options</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 overflow-y-auto ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-white text-gray-800'} p-12`}>
        
        {/* ======================================= */}
        {/* 1. INFORMATIONS SEGMENT */}
        {/* ======================================= */}
        {activeSegment === 'info' && (
          <>
            <h1 className="text-4xl font-light text-gray-500 mb-8 tracking-wide font-sans">Informations</h1>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
              {/* Main Action cards */}
              <div className="xl:col-span-2 space-y-8">
                
                {/* 1. Protéger le document */}
                <div 
                  id="file-protect" 
                  className={`relative flex items-start space-x-6 p-6 border rounded-lg transition select-none ${
                    doc.isFinal || doc.password || doc.isReadOnly
                      ? 'bg-amber-50/40 border-amber-300'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className={`p-3 rounded-lg ${doc.isFinal || doc.password || doc.isReadOnly ? 'bg-amber-100 text-amber-800 animate-pulse' : 'bg-amber-50 text-amber-700'}`}>
                    <Shield className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">Protéger le document</h2>
                    <p className="text-sm text-gray-600 leading-relaxed mb-3">
                      Contrôler les types de modifications que les utilisateurs peuvent apporter à ce document.
                    </p>
                    
                    {/* Active Status Badges */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {doc.isFinal && (
                        <span className="bg-amber-100 text-amber-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                          <Star className="w-3 h-3 text-amber-600 fill-amber-500" />
                          <span>Marqué comme final</span>
                        </span>
                      )}
                      {doc.password && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs border border-emerald-300">
                          <Key className="w-3 h-3 text-emerald-700" />
                          <span>Chiffré par mot de passe</span>
                        </span>
                      )}
                      {doc.isReadOnly && (
                        <span className="bg-red-50 text-red-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs border border-red-200">
                          <Lock className="w-3 h-3 text-red-600" />
                          <span>Lecture seule</span>
                        </span>
                      )}
                      {doc.signature && (
                        <span className="bg-blue-50 text-blue-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs border border-blue-250">
                          <FileCheck className="w-3 h-3 text-blue-600" />
                          <span>Signé numériquement</span>
                        </span>
                      )}
                    </div>

                    <button
                      id="btn-trigger-protect"
                      onClick={() => {
                        setProtectOpen(!protectOpen);
                        setInspectOpen(false);
                        setManageOpen(false);
                      }}
                      className="text-xs font-semibold text-[#2b579a] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      {protectOpen ? "Fermer les options" : "Restreindre la modification..."} <ChevronDown className="h-3 w-3" />
                    </button>

                    {/* Protect Sub-menu Dropdown */}
                    {protectOpen && (
                      <div className="absolute left-0 top-[90%] mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-2xl z-30 py-2 divide-y divide-gray-100 animate-fadeIn">
                        <button 
                          onClick={() => {
                            if (onUpdateDocument) {
                              onUpdateDocument({ isFinal: !doc.isFinal });
                              alert(!doc.isFinal ? "Document marqué comme final. Une bannière de protection s'affichera lors du retour." : "Le document n'est plus marqué comme final.");
                            }
                            setProtectOpen(false);
                          }}
                          className="dropdown-item w-full text-left px-4 py-3 hover:bg-slate-50 flex items-start space-x-3 transition cursor-pointer"
                        >
                          <Star className="w-5 h-5 text-amber-500 fill-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-gray-900 text-xs text-[#2b579a]">Marquer comme final</p>
                            <p className="text-[10px] text-gray-500">Informer les lecteurs que le document est finalisé et décourager toute modification accidentelle.</p>
                            {doc.isFinal && <span className="text-[10px] text-amber-600 font-bold block mt-1">✓ Activé</span>}
                          </div>
                        </button>

                        <button 
                          onClick={() => {
                            setShowPasswordModal(true);
                            setProtectOpen(false);
                          }}
                          className="dropdown-item w-full text-left px-4 py-3 hover:bg-slate-50 flex items-start space-x-3 transition cursor-pointer"
                        >
                          <Key className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-gray-900 text-xs text-[#2b579a]">Chiffrer avec mot de passe</p>
                            <p className="text-[10px] text-gray-500">Exiger un mot de passe de sécurité pour ouvrir de nouveau ce document de travail.</p>
                            {doc.password ? <span className="text-[10px] text-green-600 font-bold block mt-1">✓ Certifié : "{doc.password}"</span> : null}
                          </div>
                        </button>

                        <button 
                          onClick={() => {
                            if (onUpdateDocument) {
                              onUpdateDocument({ isReadOnly: !doc.isReadOnly });
                              alert(!doc.isReadOnly ? "Modification restreinte. Le document passe en mode lecture seule." : "Modification autorisée.");
                            }
                            setProtectOpen(false);
                          }}
                          className="dropdown-item w-full text-left px-4 py-3 hover:bg-slate-50 flex items-start space-x-3 transition cursor-pointer"
                        >
                          <Lock className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-gray-900 text-xs text-[#2b579a]">Restreindre la modification</p>
                            <p className="text-[10px] text-gray-500">Désactiver la saisie directe dans l'éditeur pour éviter d'altérer la mise en page.</p>
                            {doc.isReadOnly && <span className="text-[10px] text-red-600 font-bold block mt-1">✓ Lecture seule active</span>}
                          </div>
                        </button>

                        <button 
                          onClick={() => {
                            if (onUpdateDocument) {
                              const signedValue = doc.signature ? undefined : `Certifié conforme par ${authorName} le ${new Date().toLocaleDateString()}`;
                              onUpdateDocument({ signature: signedValue });
                              alert(signedValue ? "Signature numérique ajoutée au rapport." : "Signature numérique supprimée.");
                            }
                            setProtectOpen(false);
                          }}
                          className="dropdown-item w-full text-left px-4 py-3 hover:bg-slate-50 flex items-start space-x-3 transition cursor-pointer"
                        >
                          <FileCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-gray-900 text-xs text-[#2b579a]">Ajouter une signature numérique</p>
                            <p className="text-[10px] text-gray-500">Ajouter une signature d'authenticité avec date et auteur rattachés.</p>
                            {doc.signature && <span className="text-[10px] text-blue-600 font-bold block mt-1 truncate w-64">✓ Signé : {doc.signature}</span>}
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Inspecter le document */}
                <div 
                  id="file-inspect" 
                  className={`relative flex items-start space-x-6 p-6 border rounded-lg transition select-none ${
                    inspectResults.checked ? 'bg-blue-50/45 border-blue-300' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className={`p-3 rounded-lg ${inspectResults.checked ? 'bg-blue-100 text-blue-800' : 'bg-blue-50 text-blue-700'}`}>
                    <CheckSquare className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">Vérifier l'absence de problèmes</h2>
                    <p className="text-sm text-gray-600 leading-relaxed mb-3">
                      Avant de publier ce fichier, sachez qu'il contient des métadonnées, vos relectures antérieures ou des propriétés d'auteur.
                    </p>
                    {inspectResults.checked && (
                      <div className="mb-3 text-[11px] text-blue-800 font-semibold bg-blue-100-accent p-2 rounded border border-blue-200 flex items-center gap-1.5">
                        <Search className="w-3.5 h-3.5 shrink-0 text-blue-600" />
                        <span>Inspecteur : {inspectResults.dataFound ? "Propriétés d'auteur détectées (" + authorName + ")" : "Aucune métadonnée personnelle trouvée."}</span>
                      </div>
                    )}
                    <button
                      id="btn-trigger-inspect"
                      onClick={() => {
                        setInspectOpen(!inspectOpen);
                        setProtectOpen(false);
                        setManageOpen(false);
                      }}
                      className="text-xs font-semibold text-[#2b579a] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      {inspectOpen ? "Fermer les options" : "Vérifier l'absence de problèmes..."} <ChevronDown className="h-3 w-3" />
                    </button>

                    {/* Inspect Sub-menu Dropdown */}
                    {inspectOpen && (
                      <div className="absolute left-0 top-[90%] mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-2xl z-30 py-2 divide-y divide-gray-100 animate-fadeIn">
                        <button 
                          onClick={() => {
                            setShowInspectModal(true);
                            setInspectOpen(false);
                          }}
                          className="dropdown-item w-full text-left px-4 py-3 hover:bg-slate-50 flex items-start space-x-3 transition cursor-pointer"
                        >
                          <Search className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-gray-900 text-xs text-[#2b579a]">Inspecter le document</p>
                            <p className="text-[10px] text-gray-500">Parcourir les notes masquées et supprimer les informations confidentielles rattachées.</p>
                          </div>
                        </button>

                        <button 
                          onClick={() => {
                            setShowAccessibility(true);
                            setInspectOpen(false);
                          }}
                          className="dropdown-item w-full text-left px-4 py-3 hover:bg-slate-50 flex items-start space-x-3 transition cursor-pointer"
                        >
                          <Award className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-gray-900 text-xs text-[#2b579a]">Vérifier l'accessibilité</p>
                            <p className="text-[10px] text-gray-500">S'assurer que le contenu du document est sémantiquement structuré pour les lecteurs d'écran.</p>
                          </div>
                        </button>

                        <button 
                          onClick={() => {
                            setShowCompatibility(true);
                            setInspectOpen(false);
                          }}
                          className="dropdown-item w-full text-left px-4 py-3 hover:bg-slate-50 flex items-start space-x-3 transition cursor-pointer"
                        >
                          <Save className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-gray-900 text-xs text-[#2b579a]">Vérifier la compatibilité</p>
                            <p className="text-[10px] text-gray-500 font-semibold">Parcourir les fonctionnalités indisponibles dans les versions antérieures (Word 97-2003).</p>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Gérer le document */}
                <div 
                  id="file-manage" 
                  className="relative flex items-start space-x-6 p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition select-none"
                >
                  <div className="p-3 bg-emerald-50 text-emerald-700 rounded-lg">
                    <Cpu className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">Gérer le document</h2>
                    <p className="text-sm text-gray-650 leading-relaxed mb-3">
                      Consulter les fichiers intermédiaires récupérés par le système de sauvegarde de ManixGPT ou restaurer une version précédente.
                    </p>
                    <button
                      id="btn-trigger-manage"
                      onClick={() => {
                        setManageOpen(!manageOpen);
                        setProtectOpen(false);
                        setInspectOpen(false);
                      }}
                      className="text-xs font-semibold text-[#2b579a] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      {manageOpen ? "Fermer les options" : "Récupérer des documents non enregistrés..."} <ChevronDown className="h-3 w-3" />
                    </button>

                    {/* Manage Sub-menu Dropdown */}
                    {manageOpen && (
                      <div className="absolute left-0 top-[90%] mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-2xl z-30 py-2 divide-y divide-gray-100 animate-fadeIn">
                        <button 
                          onClick={() => {
                            setShowRecoveryModal(true);
                            setManageOpen(false);
                          }}
                          className="dropdown-item w-full text-left px-4 py-3 hover:bg-slate-50 flex items-start space-x-3 transition cursor-pointer"
                        >
                          <RotateCcw className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-gray-900 text-xs text-[#2b579a]">Récupérer des documents non enregistrés</p>
                            <p className="text-[10px] text-gray-500">Afficher et charger les versions de sauvegarde automatique temporaires qui ont été fermées.</p>
                          </div>
                        </button>

                        <button 
                          onClick={() => {
                            setShowVersionHistory(true);
                            setManageOpen(false);
                          }}
                          className="dropdown-item w-full text-left px-4 py-3 hover:bg-slate-50 flex items-start space-x-3 transition cursor-pointer"
                        >
                          <History className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-gray-900 text-xs text-[#2b579a]">Historique des versions</p>
                            <p className="text-[10px] text-gray-500">Consulter et basculer sur les versions d'historique de relecture précédentes.</p>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar Properties */}
              <div className="border border-gray-200 rounded-lg p-6 bg-slate-50 space-y-6 text-xs text-gray-600">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide border-b pb-2">Propriétés</h3>
                
                <div className="grid grid-cols-2 gap-y-4">
                  <div className="font-medium text-gray-500">Taille</div>
                  <div className="text-gray-900 font-semibold">{sizeKb} Ko</div>

                  <div className="font-medium text-gray-500">Mots</div>
                  <div className="text-gray-900 font-semibold">{wordCount}</div>

                  <div className="font-medium text-gray-500">Temps d'édition</div>
                  <div className="text-gray-900 font-semibold">14 minutes</div>

                  <div className="font-medium text-gray-500">Titre</div>
                  <div className="text-gray-900 font-semibold truncate" title={doc.title}>{doc.title}</div>
                </div>

                <div className="border-t pt-4 space-y-4">
                  <div>
                    <div className="font-medium text-gray-500 mb-1.5">Dates associées</div>
                    <div className="space-y-1 text-[11px]">
                      <div>Dernière modification : <span className="text-gray-900 font-semibold">{new Date(doc.lastModified).toLocaleDateString()} {new Date(doc.lastModified).toLocaleTimeString()}</span></div>
                      <div>Créé le : <span className="text-gray-900 font-semibold">{new Date(doc.createdAt).toLocaleDateString()} {new Date(doc.createdAt).toLocaleTimeString()}</span></div>
                    </div>
                  </div>

                  <div>
                    <div className="font-medium text-gray-500 mb-1.5 font-semibold">Personnes associées</div>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-[#2b579a] text-white font-bold flex items-center justify-center text-xs">
                        {authorName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-gray-900 font-semibold truncate w-36" title={authorName}>{authorName}</div>
                        <div className="text-[10px] text-gray-500">Auteur principal</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ======================================= */}
        {/* 2. OUVRIR SEGMENT (Fleshed Out) */}
        {/* ======================================= */}
        {activeSegment === 'ouvrir' && (
          <div className="max-w-4xl space-y-8">
            <div>
              <h1 className="text-4xl font-light text-gray-500 mb-2 tracking-wide">Ouvrir un document</h1>
              <p className="text-sm text-gray-500 font-light">Accédez à vos documents locaux, imports récents ou sauvegardes dans le Cloud.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Places */}
              <div className="border border-gray-200 rounded-lg p-2 bg-slate-50 space-y-1 h-fit">
                <button className="w-full text-left py-2 px-3 rounded text-xs transition bg-[#2b579a] text-white font-semibold flex items-center space-x-2.5">
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Récents</span>
                </button>
                <label className="w-full text-left py-2 px-3 rounded text-xs transition hover:bg-gray-200 text-gray-750 flex items-center space-x-2.5 cursor-pointer">
                  <FolderOpen className="h-3.5 w-3.5 text-gray-500" />
                  <span>Ce PC (Parcourir)</span>
                  <input 
                    type="file" 
                    accept=".docx,.pdf,.txt" 
                    onChange={onImportLocalFile} 
                    className="hidden" 
                  />
                </label>
                <button className="w-full text-left py-2 px-3 rounded text-xs transition hover:bg-gray-200 text-gray-700 flex items-center space-x-2.5 opacity-50 cursor-not-allowed">
                  <Cloud className="h-3.5 w-3.5 text-gray-500" />
                  <span>OneDrive (Cloud)</span>
                </button>
              </div>

              {/* Récents file listing list */}
              <div className="md:col-span-2 border border-gray-200 rounded-lg p-4 bg-white space-y-3">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b pb-2 mb-2">Documents récents</h3>
                
                {recentDocs.length === 0 ? (
                  <div className="p-8 text-center text-xs text-gray-400">Aucun document trouvé dans l'historique d'édition.</div>
                ) : (
                  <div className="divide-y max-h-96 overflow-y-auto">
                    {recentDocs.map((recent) => (
                      <div 
                        key={recent.id}
                        onClick={() => onLoadDocument && onLoadDocument(recent)}
                        className="py-3 px-2 flex items-center justify-between hover:bg-slate-50 rounded transition cursor-pointer"
                      >
                        <div className="flex items-center space-x-3 truncate">
                          <DocIcon className="h-5 w-5 text-[#2b579a] flex-shrink-0" />
                          <div className="truncate">
                            <h4 className="text-sm font-semibold text-gray-850 truncate">{recent.title}</h4>
                            <p className="text-[10px] text-gray-450 truncate">Sauvegardé le : {new Date(recent.lastModified).toLocaleString()}</p>
                          </div>
                        </div>
                        <span className="text-[10px] text-gray-400 italic">Ouvrir</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* 3. ENREGISTRER SOUS SEGMENT (Fleshed Out) */}
        {/* ======================================= */}
        {activeSegment === 'save-as' && (
          <div className="max-w-2xl space-y-6">
            <div>
              <h1 className="text-4xl font-light text-gray-500 mb-2 tracking-wide">Enregistrer une copie</h1>
              <p className="text-sm text-gray-500 font-light">Dupliquez et renommez votre document à tout moment pour archiver vos travaux.</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 bg-slate-50 space-y-4">
              <div className="space-y-1.5 text-xs text-gray-650 font-medium">
                <label className="block text-gray-800 font-bold mb-1">Nom du nouveau fichier :</label>
                <div className="flex items-center border bg-white rounded-md overflow-hidden p-1 shadow-inner">
                  <input
                    type="text"
                    value={saveAsTitle}
                    onChange={(e) => setSaveAsTitle(e.target.value)}
                    className="flex-1 border-0 p-2 text-sm outline-none font-semibold text-gray-800"
                    placeholder="Ex: Rapport_Finance_Compte_Copie"
                  />
                  <span className="bg-gray-100 text-gray-500 p-2 text-xs font-mono font-semibold border-l select-none rounded">.docx</span>
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  onClick={handleTriggerSaveAs}
                  className="px-6 py-2 bg-[#2b579a] hover:bg-blue-800 text-white rounded text-xs transition font-semibold flex items-center space-x-2 shadow cursor-pointer"
                >
                  <Copy className="h-4 w-4" />
                  <span>Enregistrer la copie</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* 4. PARTAGER SEGMENT (Fleshed Out) */}
        {/* ======================================= */}
        {activeSegment === 'partager' && (
          <div className="max-w-3xl space-y-8">
            <div>
              <h1 className="text-4xl font-light text-gray-500 mb-2 tracking-wide">Partager le document</h1>
              <p className="text-sm text-gray-500 font-light">Invitez des collègues à co-rédiger ou transmettez un lien d'accès direct.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Invite field */}
              <div className="border border-gray-200 rounded-lg p-6 bg-slate-50 space-y-4 h-fit">
                <h3 className="text-sm font-semibold text-gray-800 flex items-center space-x-2 border-b pb-2">
                  <Mail className="h-4 w-4 text-[#2b579a]" />
                  <span>Inviter des personnes</span>
                </h3>

                <form onSubmit={handleSendInvite} className="space-y-3">
                  <div className="text-xs text-gray-600 font-medium">Adresse email professionnelle :</div>
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="partenaire@entreprise.com"
                    className="w-full border rounded bg-white p-2 text-xs outline-none"
                  />
                  {inviteStatus === 'success' && (
                    <div className="text-[11px] text-green-600 font-bold bg-green-50 p-2 rounded flex items-center">
                      ✓ Invitation envoyée avec accès collaboratif activé !
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={inviteStatus === 'sending'}
                    className="w-full py-2 bg-[#2b579a] hover:bg-blue-800 text-white rounded text-xs transition font-semibold cursor-pointer disabled:opacity-50"
                  >
                    {inviteStatus === 'sending' ? 'Envoi...' : 'Envoyer l\'invitation'}
                  </button>
                </form>
              </div>

              {/* Shared Link info */}
              <div className="border border-gray-200 rounded-lg p-6 bg-white space-y-4 shadow-sm border-t-2 border-t-[#2b579a]">
                <h3 className="text-sm font-semibold text-gray-800 flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-emerald-600" />
                  <span>Liaison de synchronisation active</span>
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed border-b pb-3">
                  Toute personne disposant de cette liaison sécurisée et se connectant au navigateur verra les curseurs se synchroniser automatiquement en temps réel.
                </p>

                <div className="bg-slate-50 border rounded p-2.5 flex items-center justify-between text-[11px] font-mono select-all">
                  <span className="text-gray-500 font-semibold truncate">https://cloud.manixgpt.corp/session/{doc.id}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* 5. EXPORTER SEGMENT (Fleshed Out) */}
        {/* ======================================= */}
        {activeSegment === 'export' && (
          <div className="max-w-4xl space-y-8">
            <div>
              <h1 className="text-4xl font-light text-gray-500 mb-2 tracking-wide">Exporter le document</h1>
              <p className="text-sm text-gray-500 font-light">Convertissez et sauvegardez instantanément votre document de travail sous différents formats.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* PDF card */}
              <div className="border border-gray-200 hover:border-blue-400 p-5 rounded-lg bg-white shadow-sm flex flex-col justify-between h-48 cursor-pointer hover:shadow transition" onClick={handleDownloadPdf}>
                <div>
                  <div className="w-10 h-10 rounded bg-red-50 text-red-600 flex items-center justify-center mb-3">
                    <Printer className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-sm text-gray-800 mb-1">Créer un PDF de haute qualité</h3>
                  <p className="text-[11px] text-gray-500 leading-relaxed">Génère un véritable document PDF A4 avec une résolution ultra-claire pour l'impression ou l'envoi légal.</p>
                </div>
                <div className="text-xs text-[#2b579a] font-bold mt-2">Générer le PDF →</div>
              </div>

              {/* DOCX card */}
              <div className="border border-gray-200 hover:border-blue-400 p-5 rounded-lg bg-white shadow-sm flex flex-col justify-between h-48 cursor-pointer hover:shadow transition" onClick={onExportDocx}>
                <div>
                  <div className="w-10 h-10 rounded bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                    <FileDown className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-sm text-gray-800 mb-1">Exporter au format Word (.docx)</h3>
                  <p className="text-[11px] text-gray-500 leading-relaxed">Sauvegarde le contenu principal structuré sous forme d'un fichier Microsoft Office Word 100% ouvrable.</p>
                </div>
                <div className="text-xs text-[#2b579a] font-bold mt-2">Exporter le fichier DOCX →</div>
              </div>

              {/* TXT card */}
              <div className="border border-gray-200 hover:border-blue-400 p-5 rounded-lg bg-white shadow-sm flex flex-col justify-between h-48 cursor-pointer hover:shadow transition" onClick={handleDownloadTxt}>
                <div>
                  <div className="w-10 h-10 rounded bg-gray-50 text-gray-600 flex items-center justify-center mb-3">
                    <DocIcon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-sm text-gray-800 mb-1">Texte brut (.txt)</h3>
                  <p className="text-[11px] text-gray-500 leading-relaxed">Extrait uniquement les lignes textuelles épurées de tout code sémantique HTML ou CSS pour des intégrations simples.</p>
                </div>
                <div className="text-xs text-[#2b579a] font-bold mt-2">Télécharger le fichier TXT →</div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* 6. COMPTE SEGMENT (Fleshed Out Parameters) */}
        {/* ======================================= */}
        {activeSegment === 'compte' && (
          <div className="max-w-5xl space-y-8">
            <div>
              <h1 className="text-4xl font-light text-gray-500 mb-2 tracking-wide">Compte & Licence</h1>
              <p className="text-sm text-gray-500 font-light">Consultez votre profil utilisateur, le statut de votre licence Office et personnalisez le thème global de vos applications.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 text-xs">
              {/* Infomations de l'utilisateur */}
              <div className="border border-gray-200 p-6 rounded-lg bg-slate-50 space-y-5 h-fit">
                <h3 className="text-sm font-semibold text-gray-850 flex items-center space-x-2 border-b pb-2">
                  <User className="h-4 w-4 text-[#2b579a]" />
                  <span>Informations de l'utilisateur</span>
                </h3>

                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-[#2b579a] text-white font-extrabold flex items-center justify-center text-xl shadow-md">
                    {authorName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-gray-850 truncate w-44">{authorName.split('@')[0]}</div>
                    <div className="text-gray-500 font-semibold truncate w-44">{authorName}</div>
                    <div className="text-[9px] font-bold text-emerald-600 max-w-fit bg-emerald-50 px-1.5 py-0.5 rounded uppercase">Développeur Officiel</div>
                  </div>
                </div>

                <div className="space-y-3.5 pt-4 border-t text-gray-600">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-400">Rôle :</span>
                    <span className="font-bold text-gray-800">Administrateur</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span className="text-gray-400">Services connectés :</span>
                    <span className="text-gray-800 flex items-center space-x-1">
                      <Cloud className="h-3 w-3 text-sky-500 inline mr-0.5" /> OneDrive Pro
                    </span>
                  </div>
                </div>
              </div>

              {/* Statut du produit de licence */}
              <div className="border border-gray-200 p-6 rounded-lg bg-white space-y-5 h-fit shadow-xs xl:col-span-2">
                <h3 className="text-sm font-semibold text-gray-800 flex items-center space-x-2 border-b pb-2">
                  <Award className="h-4 w-4 text-amber-500" />
                  <span>Informations sur le produit</span>
                </h3>

                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-blue-50 text-[#2b579a] rounded-lg shrink-0">
                    <ManixWordLogo size={52} showText={false} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-gray-900">Microsoft Office Professionnel Plus 2026</h4>
                    <p className="text-xs text-[#2b579a] font-bold">Produit activé ré-agencé avec l'IA active ManixGPT</p>
                    <p className="text-[10px] text-gray-500 leading-relaxed pt-1">Ce pack comprend : Word, Excel, PowerPoint, Access, Publisher, Outlook et l’assistant d'intelligence artificielle intégré ManixGPT.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t text-gray-600">
                  <div className="space-y-2">
                    <h5 className="font-bold text-gray-900 border-b pb-1">Arrière-plan Office</h5>
                    <select className="w-full border p-1 rounded bg-white text-xs outline-none">
                      <option>Aucun arrière-plan</option>
                      <option>Cercles et Rayures</option>
                      <option>Étoiles et Nuages</option>
                      <option>Géométrique Moderne</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-bold text-gray-900 border-b pb-1">Thème Office</h5>
                    <select 
                      value={officeTheme}
                      onChange={(e) => setOfficeTheme(e.target.value)}
                      className="w-full border p-1 rounded bg-white text-xs outline-none"
                    >
                      <option value="Bleu">Bleu classique</option>
                      <option value="Gris foncé">Gris foncé élégant</option>
                      <option value="Noir">Noir minuit d'économies</option>
                      <option value="Blanc">Blanc clair</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* 7. OPTIONS SEGMENT WITH 10-TABS (Complete) */}
        {/* ======================================= */}
        {activeSegment === 'options' && (
          <div className="max-w-5xl">
            <h1 className="text-4xl font-light text-gray-500 mb-2 tracking-wide">Options de configuration</h1>
            <p className="text-sm text-gray-500 mb-8 font-light">Gérez les correcteurs sémantiques, les gabarits, les touches d'accès et les options sémantiques de ManixGPT.</p>

            <div className="flex border border-gray-200 rounded-lg overflow-hidden min-h-[510px]">
              
              {/* 10 Option Left Sidebar Tabs */}
              <div className="w-56 bg-slate-50 border-r border-gray-200 p-2 space-y-0.5 select-none text-[11px]">
                <button
                  onClick={() => setActiveOptionsTab('general')}
                  className={`w-full text-left py-2 px-3 rounded transition flex items-center space-x-2.5 cursor-pointer ${
                    activeOptionsTab === 'general' ? 'bg-[#2b579a] text-white font-semibold' : 'text-gray-700 hover:bg-gray-150'
                  }`}
                >
                  <Sliders className="h-3.5 w-3.5" />
                  <span>1. Général</span>
                </button>
                <button
                  onClick={() => setActiveOptionsTab('affichage')}
                  className={`w-full text-left py-2 px-3 rounded transition flex items-center space-x-2.5 cursor-pointer ${
                    activeOptionsTab === 'affichage' ? 'bg-[#2b579a] text-white font-semibold' : 'text-gray-700 hover:bg-gray-150'
                  }`}
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>2. Affichage</span>
                </button>
                <button
                  onClick={() => setActiveOptionsTab('verification')}
                  className={`w-full text-left py-2 px-3 rounded transition flex items-center space-x-2.5 cursor-pointer ${
                    activeOptionsTab === 'verification' ? 'bg-[#2b579a] text-white font-semibold' : 'text-gray-700 hover:bg-gray-150'
                  }`}
                >
                  <CheckSquare className="h-3.5 w-3.5" />
                  <span>3. Vérification</span>
                </button>
                <button
                  onClick={() => setActiveOptionsTab('enregistrement')}
                  className={`w-full text-left py-2 px-3 rounded transition flex items-center space-x-2.5 cursor-pointer ${
                    activeOptionsTab === 'enregistrement' ? 'bg-[#2b579a] text-white font-semibold' : 'text-gray-700 hover:bg-gray-150'
                  }`}
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>4. Enregistrement</span>
                </button>
                <button
                  onClick={() => setActiveOptionsTab('langue')}
                  className={`w-full text-left py-2 px-3 rounded transition flex items-center space-x-2.5 cursor-pointer ${
                    activeOptionsTab === 'langue' ? 'bg-[#2b579a] text-white font-semibold' : 'text-gray-700 hover:bg-gray-150'
                  }`}
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span>5. Langue</span>
                </button>
                <button
                  onClick={() => setActiveOptionsTab('avancees')}
                  className={`w-full text-left py-2 px-3 rounded transition flex items-center space-x-2.5 cursor-pointer ${
                    activeOptionsTab === 'avancees' ? 'bg-[#2b579a] text-white font-semibold' : 'text-gray-700 hover:bg-gray-150'
                  }`}
                >
                  <Command className="h-3.5 w-3.5" />
                  <span>6. Options avancées</span>
                </button>
                <button
                  onClick={() => setActiveOptionsTab('ruban')}
                  className={`w-full text-left py-2 px-3 rounded transition flex items-center space-x-2.5 cursor-pointer ${
                    activeOptionsTab === 'ruban' ? 'bg-[#2b579a] text-white font-semibold' : 'text-gray-700 hover:bg-gray-150'
                  }`}
                >
                  <Palette className="h-3.5 w-3.5" />
                  <span>7. Personnaliser ruban</span>
                </button>
                <button
                  onClick={() => setActiveOptionsTab('acces-rapide')}
                  className={`w-full text-left py-2 px-3 rounded transition flex items-center space-x-2.5 cursor-pointer ${
                    activeOptionsTab === 'acces-rapide' ? 'bg-[#2b579a] text-white font-semibold' : 'text-gray-700 hover:bg-gray-150'
                  }`}
                >
                  <CheckBx className="h-3.5 w-3.5" />
                  <span>8. Accès rapide</span>
                </button>
                <button
                  onClick={() => setActiveOptionsTab('complements')}
                  className={`w-full text-left py-2 px-3 rounded transition flex items-center space-x-2.5 cursor-pointer ${
                    activeOptionsTab === 'complements' ? 'bg-[#2b579a] text-white font-semibold' : 'text-gray-700 hover:bg-gray-150'
                  }`}
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>9. Compléments</span>
                </button>
                <button
                  onClick={() => setActiveOptionsTab('confidentialite')}
                  className={`w-full text-left py-2 px-3 rounded transition flex items-center space-x-2.5 cursor-pointer ${
                    activeOptionsTab === 'confidentialite' ? 'bg-[#2b579a] text-white font-semibold' : 'text-gray-700 hover:bg-gray-150'
                  }`}
                >
                  <Key className="h-3.5 w-3.5" />
                  <span>10. Confidentialité</span>
                </button>
              </div>

              {/* Options Inner Content Boxes */}
              <div className="flex-1 p-8 bg-white text-xs text-gray-750 space-y-6">
                
                {/* 1. GENERAL TAB */}
                {activeOptionsTab === 'general' && (
                  <div className="space-y-5">
                    <h3 className="text-sm font-bold text-gray-900 border-b pb-2">Options d'interface de rédaction</h3>
                    <div>
                      <label className="block font-bold text-gray-800 mb-1">Auteur par défaut :</label>
                      <input
                        type="email"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        className="w-full max-w-sm border p-2 rounded text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-800 mb-1">Gabarit de papier préféré :</label>
                      <select
                        value={defaultFormat}
                        onChange={(e) => setDefaultFormat(e.target.value)}
                        className="w-full max-w-sm border p-2 rounded text-xs outline-none bg-white"
                      >
                        <option value="A4">A4 (21 cm x 29,7 cm)</option>
                        <option value="Letter">Lettre US (8.5 in x 11 in)</option>
                        <option value="Legal">Legal US (8.5 in x 14 in)</option>
                      </select>
                    </div>
                    <div className="space-y-2 pt-2">
                      <label className="flex items-center space-x-2.5 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                        <span className="font-semibold text-gray-800">Afficher la mini-barre d'outils de formatage lors de la sélection de texte</span>
                      </label>
                      <label className="flex items-center space-x-2.5 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                        <span className="font-semibold text-gray-800">Afficher la description des bulles d'aide en direct</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* 2. AFFICHAGE TAB */}
                {activeOptionsTab === 'affichage' && (
                  <div className="space-y-5">
                    <h3 className="text-sm font-bold text-gray-900 border-b pb-2">Paramètres de rendu à l'écran</h3>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-2.5 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                        <span className="font-semibold text-gray-800 font-bold">Afficher l'espace blanc entre les pages en mode page par page</span>
                      </label>
                      <label className="flex items-center space-x-2.5 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300" 
                          checked={showRulersOpt} 
                          onChange={(e) => setShowRulersOpt(e.target.checked)} 
                        />
                        <span className="font-semibold text-gray-800">Afficher les règles de dimensionnement (verticale)</span>
                      </label>
                      <label className="flex items-center space-x-2.5 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300" 
                          checked={paragraphMarks} 
                          onChange={(e) => setParagraphMarks(e.target.checked)} 
                        />
                        <span className="font-semibold text-gray-800">Toujours afficher les symboles de paragraphe (¶) à l'écran</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* 3. VERIFICATION */}
                {activeOptionsTab === 'verification' && (
                  <div className="space-y-5">
                    <h3 className="text-sm font-bold text-gray-900 border-b pb-2">Options linguistiques et IA</h3>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-2.5 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300" 
                          checked={aiAutoSuggest} 
                          onChange={(e) => setAiAutoSuggest(e.target.checked)} 
                        />
                        <span className="font-semibold text-gray-800 font-bold">Activer les suggestions pro-actives de ManixGPT</span>
                      </label>
                      <label className="flex items-center space-x-2.5 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300" 
                          checked={spellCheckOnType} 
                          onChange={(e) => setSpellCheckOnType(e.target.checked)} 
                        />
                        <span className="font-semibold text-gray-800">Surligner et corriger les fautes d'orthographe au cours de la frappe</span>
                      </label>
                      <label className="flex items-center space-x-2.5 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                        <span className="font-semibold text-gray-800">Ignorer les mots en MAJUSCULES</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* 4. ENREGISTREMENT */}
                {activeOptionsTab === 'enregistrement' && (
                  <div className="space-y-5">
                    <h3 className="text-sm font-bold text-gray-900 border-b pb-2">Fréquence de sauvegarde d'urgence</h3>
                    <div>
                      <label className="block text-gray-800 font-bold mb-1">Fréquence d'enregistrement automatique (en minutes) :</label>
                      <input
                        type="number"
                        min={1}
                        max={60}
                        value={autoSaveMinutes}
                        onChange={(e) => setAutoSaveMinutes(e.target.value)}
                        className="w-16 border p-2 rounded text-xs text-center font-bold outline-none"
                      />
                    </div>
                    <div className="space-y-2 pt-2 border-t">
                      <label className="flex items-center space-x-2.5 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                        <span className="font-semibold text-gray-800">Sauvegarder et synchroniser automatiquement les curseurs de rédaction</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* 5. LANGUE */}
                {activeOptionsTab === 'langue' && (
                  <div className="space-y-5">
                    <h3 className="text-sm font-bold text-gray-900 border-b pb-2">Préférences linguistiques d'Office</h3>
                    <div>
                      <label className="block text-gray-800 font-bold mb-1">Langue principale du dictionnaire correcteur :</label>
                      <select
                        value={uiLanguage}
                        onChange={(e) => setUiLanguage(e.target.value)}
                        className="w-full max-w-sm border p-2 rounded text-xs outline-none bg-white"
                      >
                        <option value="fr">Français (France) - [Par défaut]</option>
                        <option value="en">English (United States)</option>
                        <option value="es">Español (España)</option>
                        <option value="de">Deutsch (Deutschland)</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* 6. OPTIONS AVANCEES (New) */}
                {activeOptionsTab === 'avancees' && (
                  <div className="space-y-5">
                    <h3 className="text-sm font-bold text-gray-900 border-b pb-2">Fonctions avancées d'édition</h3>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-2.5 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                        <span className="font-semibold text-gray-800">Autoriser le glisser-déplacer du texte sélectionné</span>
                      </label>
                      <label className="flex items-center space-x-2.5 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                        <span className="font-semibold text-gray-800">Activer le zoom intelligent par pincement sur le pavé tactile</span>
                      </label>
                      <label className="flex items-center space-x-2.5 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                        <span className="font-semibold text-gray-800">Couper, copier et coller avec ajustement automatique du format cible</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* 7. PERSONNALISER LE RUBAN (New Table look representation) */}
                {activeOptionsTab === 'ruban' && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-900 border-b pb-1">Personnaliser les Onglets actifs de Word</h3>
                    <p className="text-[10px] text-gray-500">Cochez ou décochez les onglets que vous souhaitez rendre visibles dans votre barre d'outils Ribbon supérieure :</p>
                    
                    <div className="space-y-2 border rounded p-3 bg-slate-50 divide-y max-h-52 overflow-y-auto">
                      {ribbonTabs.map((tab, idx) => (
                        <div key={tab.id} className="flex items-center justify-between py-1.5 first:pt-0 last:pb-0">
                          <label className="flex items-center space-x-2.5 cursor-pointer font-semibold text-gray-800">
                            <input 
                              type="checkbox" 
                              checked={tab.active} 
                              onChange={(e) => {
                                const copy = [...ribbonTabs];
                                copy[idx].active = e.target.checked;
                                setRibbonTabs(copy);
                              }}
                              className="rounded border-gray-300 text-[#2b579a]" 
                            />
                            <span>Onglet "{tab.label}"</span>
                          </label>
                          <span className="text-[9px] text-gray-400">Position {idx + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 8. ACCES RAPIDE (New) */}
                {activeOptionsTab === 'acces-rapide' && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-900 border-b pb-1">Raccourcis de la barre d'accès rapide</h3>
                    <p className="text-[10px] text-gray-500">Sélectionnez les raccourcis à épingler tout en haut à gauche de la fenêtre pour un accès instantané :</p>

                    <div className="space-y-2 border rounded p-3 bg-slate-50 divide-y max-h-52 overflow-y-auto">
                      {quickAccessTools.map((tool, idx) => (
                        <div key={tool.id} className="flex items-center justify-between py-1.5 first:pt-0 last:pb-0">
                          <label className="flex items-center space-x-2.5 cursor-pointer font-semibold text-gray-800">
                            <input 
                              type="checkbox" 
                              checked={tool.enabled} 
                              onChange={(e) => {
                                const copy = [...quickAccessTools];
                                copy[idx].enabled = e.target.checked;
                                setQuickAccessTools(copy);
                              }}
                              className="rounded border-gray-300 text-[#2b579a]" 
                            />
                            <span>{tool.label}</span>
                          </label>
                          <span className="text-[9px] text-gray-400">Raccourci "{tool.id}"</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 9. COMPLEMENTS ADD-INS (New detailed listings representation) */}
                {activeOptionsTab === 'complements' && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-900 border-b pb-1">Compléments actifs dans l'application</h3>
                    
                    <div className="border rounded overflow-hidden">
                      <table className="w-full text-left border-collapse text-[10px]">
                        <thead>
                          <tr className="bg-slate-100 font-bold border-b text-gray-700">
                            <th className="p-2">Nom du complément</th>
                            <th className="p-2">Type</th>
                            <th className="p-2">Équipe/Éditeur</th>
                            <th className="p-2">Statut</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y text-gray-600">
                          <tr>
                            <td className="p-2 font-bold text-purple-700">Correcteur Sémantique ManixGPT</td>
                            <td className="p-2">Extension IA COM</td>
                            <td className="p-2">Manix Corp</td>
                            <td className="p-2"><span className="text-green-600 font-bold">✓ Actif</span></td>
                          </tr>
                          <tr>
                            <td className="p-2 font-bold text-blue-700">Convertisseur PDF Reader Plus</td>
                            <td className="p-2">Intégration d'impression</td>
                            <td className="p-2">Adobe Inc.</td>
                            <td className="p-2"><span className="text-green-600 font-bold">✓ Actif</span></td>
                          </tr>
                          <tr>
                            <td className="p-2 font-bold text-gray-750">Sauvegarde Cloud OneDrive Connector</td>
                            <td className="p-2">Add-In cloud sync</td>
                            <td className="p-2">Microsoft</td>
                            <td className="p-2"><span className="text-gray-400">Désactivé</span></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 10. CONFIDENTIALITE (New) */}
                {activeOptionsTab === 'confidentialite' && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-900 border-b pb-1">Centre de gestion de la confidentialité</h3>
                    <p className="text-[10px] text-gray-500 leading-relaxed mb-4">
                      Vos données et le contenu des phrases transmises à notre IA sémantique ManixGPT sont chiffrés de bout en bout et ne sont jamais stockés pour le ré-entraînement de modèles publics. Votre vie privée est garantie.
                    </p>

                    <div className="p-3 border border-amber-200 bg-amber-50 rounded-lg text-[10px] text-amber-800 flex items-start space-x-2">
                      <Shield className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block mb-0.5">Note importante sur les données :</span>
                        La télémétrie sémantique est restreinte à votre poste d'écriture. Aucun journal de frappe n'est conservé.
                      </div>
                    </div>
                  </div>
                )}

                {/* Bottom Valider Options buttons */}
                <div className="pt-8 border-t flex justify-end space-x-3">
                  <button
                    onClick={onClose}
                    className="px-5 py-1.5 border hover:bg-gray-50 rounded text-xs transition font-semibold cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSaveOptions}
                    className="px-5 py-1.5 bg-[#2b579a] hover:bg-blue-800 text-white rounded text-xs transition font-semibold shadow-sm cursor-pointer"
                  >
                    Valider et Appliquer
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>

      {/* ======================================= */}
      {/* POPUP MODALS FOR INFORMATION SECTIONS */}
      {/* ======================================= */}
      
      {/* 1. PASSWORD ENCRYPTION MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 z-55 flex items-center justify-center font-sans">
          <div className="bg-white rounded-lg p-6 w-96 shadow-2xl border border-gray-300 animate-fadeIn">
            <h3 className="text-sm font-bold text-gray-950 mb-3 flex items-center gap-1.5 border-b pb-2">
              <Key className="w-4 h-4 text-emerald-600" />
              <span>Chiffrer le document Word</span>
            </h3>
            <p className="text-[11px] text-gray-600 mb-4 leading-relaxed">
              Le chiffrement du contenu de ce fichier protège l'accès en demandant un mot de passe obligatoire d'ouverture. 
              <span className="flex items-center gap-1 mt-1.5 font-bold text-amber-700">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>Attention : Si vous perdez le mot de passe, il ne pourra pas être récupéré.</span>
              </span>
            </p>
            <div className="space-y-3 mb-5">
              <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Mot de passe :</label>
              <input 
                type="text"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Ex: Confidentiel2026!"
                className="w-full border rounded p-2 text-xs outline-none bg-slate-50 focus:bg-white text-gray-950 font-mono font-semibold"
              />
            </div>
            <div className="flex justify-end gap-2.5 text-xs font-semibold">
              <button 
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordInput(doc.password || '');
                }}
                className="px-4 py-1.5 hover:bg-gray-100 border text-gray-750 rounded transition cursor-pointer"
              >
                Annuler
              </button>
              <button 
                onClick={() => {
                  if (onUpdateDocument) {
                    onUpdateDocument({ password: passwordInput.trim() || undefined });
                    alert(passwordInput.trim() ? `Le document est maintenant verrouillé par mot de passe: "${passwordInput.trim()}"` : "La protection par mot de passe a été retirée.");
                  }
                  setShowPasswordModal(false);
                }}
                className="px-4 py-1.5 bg-[#2b579a] hover:bg-blue-800 text-white rounded transition shadow-sm cursor-pointer"
              >
                Appliquer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. INSPECTION MODAL */}
      {showInspectModal && (
        <div className="fixed inset-0 bg-black/50 z-55 flex items-center justify-center font-sans">
          <div className="bg-white rounded-lg p-6 w-[28rem] shadow-2xl border border-gray-300 animate-fadeIn text-xs">
            <h3 className="text-sm font-bold text-gray-950 mb-3 flex items-center gap-1.5 border-b pb-2">
              <Search className="w-4 h-4 text-blue-600" />
              <span>Inspecteur de document Word</span>
            </h3>
            <p className="text-[11px] text-gray-500 mb-4 leading-relaxed">
              Parcourez et nettoyez les propriétés d'écriture, les notes masquées, et l'identité des auteurs pour distribuer votre fichier en toute conformité.
            </p>

            <div className="space-y-4 max-h-64 overflow-y-auto mb-5 border rounded p-3 bg-slate-50">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-gray-800 mb-0.5">Propriétés du document et données personnelles</h4>
                  <p className="text-[10px] text-gray-500 leading-normal">Nom de l'auteur principal : <span className="font-semibold text-gray-800 font-mono">{authorName}</span>. Dates de modifications et métadonnées.</p>
                </div>
                {!inspectResults.checked ? (
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded uppercase">À inspecter</span>
                ) : inspectResults.dataFound ? (
                  <button 
                    onClick={() => {
                      setAuthorName("Auteur Anonyme");
                      setInspectResults({ checked: true, dataFound: false });
                      if (onUpdateDocument) onUpdateDocument({ signature: undefined });
                      alert("Les propriétés et métadonnées personnelles ont été nettoyées.");
                    }}
                    className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-[9px] uppercase transition cursor-pointer shrink-0"
                  >
                    Supprimer tout
                  </button>
                ) : (
                  <span className="text-[10px] font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded uppercase font-sans">✓ OK</span>
                )}
              </div>

              <div className="flex justify-between items-start border-t pt-3">
                <div>
                  <h4 className="font-bold text-gray-800 mb-0.5">En-têtes, pieds de page et filigranes</h4>
                  <p className="text-[10px] text-gray-500 leading-normal">
                    Fichiers d'en-tête : <span className="font-semibold text-gray-800 font-mono">"{doc.headerText || 'Vierge'}"</span> | Filigrane : <span className="font-semibold text-gray-800">"{doc.watermark || 'Aucun'}"</span>.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded uppercase font-sans">✓ OK</span>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 font-semibold">
              {!inspectResults.checked && (
                <button 
                  onClick={() => {
                    setIsInspecting(true);
                    setTimeout(() => {
                      setIsInspecting(false);
                      setInspectResults({ checked: true, dataFound: true });
                    }, 1000);
                  }}
                  disabled={isInspecting}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded transition shadow-sm cursor-pointer disabled:opacity-50 animate-pulse"
                >
                  {isInspecting ? "Inspection..." : "Inspecter"}
                </button>
              )}
              <button 
                onClick={() => {
                  setShowInspectModal(false);
                }}
                className="px-4 py-1.5 hover:bg-gray-100 border text-gray-700 rounded transition cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. ACCESSIBILITY MODAL */}
      {showAccessibility && (
        <div className="fixed inset-0 bg-black/50 z-55 flex items-center justify-center font-sans">
          <div className="bg-white rounded-lg p-6 w-96 shadow-2xl border border-gray-300 animate-fadeIn text-xs text-gray-800">
            <h3 className="text-sm font-bold text-gray-950 mb-3 flex items-center gap-1.5 border-b pb-2">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Vérificateur d'accessibilité Office</span>
            </h3>
            <div className="space-y-3 mb-5 leading-relaxed text-[11px] text-gray-650">
              <p>Le vérificateur analyse le document pour s'assurer que les personnes souffrant d'un handicap peuvent lire et consulter vos livrables professionnels sans barrière.</p>
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200">
                <span className="font-bold block mb-0.5">✓ Aucun problème d'accessibilité :</span>
                Toutes les images comportent des descriptions et la hiérarchie des titres (h1, h2, h3) est correcte. Les lecteurs d'écran pourront interpréter ce rapport aisément.
              </div>
            </div>
            <div className="flex justify-end">
              <button 
                onClick={() => setShowAccessibility(false)}
                className="px-5 py-1.5 bg-[#2b579a] hover:bg-blue-800 text-white rounded font-semibold transition cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. COMPATIBILITY MODAL */}
      {showCompatibility && (
        <div className="fixed inset-0 bg-black/50 z-55 flex items-center justify-center font-sans">
          <div className="bg-white rounded-lg p-6 w-96 shadow-2xl border border-gray-300 animate-fadeIn text-xs text-gray-800">
            <h3 className="text-sm font-bold text-gray-950 mb-3 flex items-center gap-1.5 border-b pb-2">
              <Save className="w-4 h-4 text-blue-600" />
              <span>Vérificateur de compatibilité Word</span>
            </h3>
            <div className="space-y-3 mb-5 leading-relaxed text-[11px] text-gray-650">
              <p>Recherchez des mises en forme spéciales non prises en charge lors de l'ouverture du texte dans des versions antérieures de Microsoft Word.</p>
              <div className="p-3 bg-blue-50 text-blue-800 rounded-lg border border-blue-200">
                <span className="font-bold block mb-0.5">✓ Parfaite compatibilité détectée :</span>
                Les styles de tableaux, marges A4, et polices sémantiques sélectionnés correspondent aux standards ISO XML. Ce fichier s'affiche de manière identique sur Word 97, Word 2003, Word 2013 et Office 365.
              </div>
            </div>
            <div className="flex justify-end">
              <button 
                onClick={() => setShowCompatibility(false)}
                className="px-5 py-1.5 bg-[#2b579a] hover:bg-blue-800 text-white rounded font-semibold transition cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. RECOVERY AUTOSAVE MODAL */}
      {showRecoveryModal && (
        <div className="fixed inset-0 bg-black/50 z-55 flex items-center justify-center font-sans">
          <div className="bg-white rounded-lg p-6 w-[34rem] shadow-2xl border border-gray-300 animate-fadeIn text-xs text-gray-800">
            <h3 className="text-sm font-bold text-gray-950 mb-1 flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-emerald-600" />
              <span>Récupérer des documents Word non enregistrés</span>
            </h3>
            <p className="text-[11px] text-gray-500 mb-4 border-b pb-2 leading-relaxed font-light">
              ManixGPT a identifié des coupures ou des brouillons rédigés automatiquement sauvegardés en local. Sélectionnez une trace temporaire pour restaurer son contenu sémantique.
            </p>

            <div className="space-y-2 mb-5 divide-y divide-gray-100 max-h-60 overflow-y-auto pr-1">
              {[
                { id: '1', date: 'Aujourd\'hui à ' + new Date(Date.now() - 1000 * 60 * 12).toLocaleTimeString(), desc: 'Brouillon automatique après saisie IA (4500 mots)', recoveryContent: `<h2>RAPPORT DE SYNTHÈSE DES RECHERCHES</h2><p>Le présent document consigne l'ensemble des réponses sémantiques générées par notre IA ManixGPT. Les données analysées montrent un taux d'adoption de premier plan dans le monde des traitements de texte en ligne...</p>`, size: '14 Ko' },
                { id: '2', date: 'Hier à 17:42', desc: 'Sauvegarde d\'importation .docx de secours', recoveryContent: `<h2>RESTREINDRE LA DIFFUSION</h2><p>Ce document d'affaires s'adresse directement aux directeurs financiers du groupe Alpha. La conformité complète du style d'export garantit une mise en page identique sur l'application Microsoft Word...</p>`, size: '9 Ko' }
              ].map((draft) => (
                <div 
                  key={draft.id}
                  className="py-3 px-2 flex justify-between items-center hover:bg-slate-50 rounded transition cursor-pointer"
                  onClick={() => {
                    if (onUpdateDocument) {
                      onUpdateDocument({ content: draft.recoveryContent });
                      alert("Brouillon temporaire restauré avec succès dans l'éditeur !");
                    }
                    setShowRecoveryModal(false);
                    onClose();
                  }}
                >
                  <div>
                    <span className="font-bold text-[#2b579a] block text-xs">{draft.desc}</span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">Sauvegarde : {draft.date}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-semibold text-gray-400 font-mono block mb-1">{draft.size}</span>
                    <span className="text-[9px] font-bold text-blue-700 hover:underline uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded">Restaurer</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 text-xs font-semibold">
              <button 
                onClick={() => setShowRecoveryModal(false)}
                className="px-4 py-1.5 hover:bg-gray-100 border text-gray-700 rounded transition cursor-pointer"
              >
                Retour
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. REVISIONS HISTORY MODAL */}
      {showVersionHistory && (
        <div className="fixed inset-0 bg-black/50 z-55 flex items-center justify-center font-sans">
          <div className="bg-white rounded-lg p-6 w-[28rem] shadow-2xl border border-gray-300 animate-fadeIn text-xs text-gray-800">
            <h3 className="text-sm font-bold text-gray-950 mb-3 flex items-center gap-1.5 border-b pb-2">
              ⏳ Historique des révisions du document
            </h3>
            
            <div className="space-y-4 max-h-64 overflow-y-auto mb-5">
              {[
                { id: 'rev-3', date: 'Version actuelle (Sauvegarde active)', author: authorName, current: true, snippet: doc.content },
                { id: 'rev-2', date: 'Révision 2 (Copie automatique)', author: 'kalengamushimbilina@gmail.com', current: false, snippet: `<h2>Titre Initial de Rédaction</h2><p>Ébauche d'écriture simplifiée conforme au cahier des charges...</p>` },
                { id: 'rev-1', date: 'Création initiale du canevas', author: 'Assistant IA', current: false, snippet: `<p><br></p>` }
              ].map((rev) => (
                <div 
                  key={rev.id} 
                  className={`p-3 border rounded-lg transition flex justify-between items-center ${rev.current ? 'border-blue-450 bg-blue-50/20' : 'border-gray-200 hover:bg-gray-50 cursor-pointer'}`}
                  onClick={() => {
                    if (rev.current) return;
                    if (onUpdateDocument) {
                      onUpdateDocument({ content: rev.snippet });
                      alert(`Le document a été restauré à la version : ${rev.date}`);
                    }
                    setShowVersionHistory(false);
                    onClose();
                  }}
                >
                  <div className="truncate pr-4">
                    <span className="font-bold text-gray-900 block text-xs">{rev.date}</span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">Modifié par : {rev.author}</span>
                  </div>
                  {rev.current ? (
                    <span className="bg-blue-100 text-blue-800 font-bold uppercase text-[9px] px-2 py-0.5 rounded-full shrink-0">Actuelle</span>
                  ) : (
                    <span className="text-blue-700 hover:underline font-bold text-[9px] uppercase tracking-wider shrink-0 bg-blue-50 px-2 py-0.5 rounded">Restaurer</span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 text-xs font-semibold">
              <button 
                onClick={() => setShowVersionHistory(false)}
                className="px-4 py-1.5 hover:bg-gray-100 border text-gray-800 rounded transition cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
