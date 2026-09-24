import { useState, ChangeEvent } from 'react';
import { 
  Search, FolderOpen, Mail, Clock, FileText, ChevronRight, User, Moon, Sun, 
  Gift, BarChart3, Megaphone, GraduationCap, Briefcase, Sparkles, Send,
  Layout, PenLine, Table, Crown, Bot, Zap, MoreVertical, FilePlus, 
  LayoutGrid, Settings, Hash, ListOrdered, CheckCheck, Languages, Grid3X3,
  Home, Bell, ArrowRight, X, Check, ShieldCheck, Eye
} from 'lucide-react';
import { TEMPLATES } from '../templatesData';
import { Template, WordDocument } from '../types';
import ManixWordLogo from './ManixWordLogo';
import TemplatePreviewModal from './TemplatePreviewModal';

interface TemplateChooserProps {
  onSelectTemplate: (template: Template) => void;
  recentDocs: WordDocument[];
  onOpenDoc: (doc: WordDocument) => void;
  onImportLocalFile: (event: ChangeEvent<HTMLInputElement>) => void;
  userEmail?: string;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  onStartWithAiPrompt?: (prompt: string) => void;
  onTriggerAction?: (actionId: string, payload?: any) => void;
  onDuplicateDoc?: (doc: WordDocument) => void;
  onDeleteDoc?: (docId: string) => void;
}

export default function TemplateChooser({
  onSelectTemplate,
  recentDocs,
  onOpenDoc,
  onImportLocalFile,
  userEmail = '23iw064si@esisalama.org',
  isDarkMode = false,
  onToggleDarkMode,
  onStartWithAiPrompt,
  onTriggerAction,
  onDuplicateDoc,
  onDeleteDoc,
}: TemplateChooserProps) {
  // Navigation tabs in the left sidebar: 'accueil' | 'nouveau' | 'documents' | 'modeles' | 'assistant' | 'historique' | 'parametres'
  const [activeNav, setActiveNav] = useState<'accueil' | 'documents' | 'modeles' | 'historique' | 'parametres'>('accueil');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [heroPrompt, setHeroPrompt] = useState('');
  const [showProModal, setShowProModal] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  // Template Quick View Modal state
  const [previewingTemplate, setPreviewingTemplate] = useState<Template | null>(null);

  // Default mock docs matching the exact screenshot if user has no recent docs
  const defaultRecentDocs = [
    { title: 'Rapport_de_stage.docx', date: "Aujourd'hui • 14:32", id: 'rapport_stage' },
    { title: 'Mémoire_UDA_2025.docx', date: 'Hier • 10:21', id: 'memoire_universitaire' },
    { title: 'Lettre_motivation.docx', date: '26/05/2026 • 16:45', id: 'lette_motivation' },
    { title: 'CV_Manix.docx', date: '24/05/2026 • 09:17', id: 'cv' }
  ];

  // Helper to trigger opening or creating blank
  const handleOpenBlank = () => {
    const blank = TEMPLATES.find(t => t.id === 'blank') || TEMPLATES[0];
    onSelectTemplate(blank);
  };

  // Helper to open specific popular model
  const handleOpenPopularModel = (key: string) => {
    let match = TEMPLATES.find(t => t.id === key);
    if (!match) {
      if (key === 'rapport_stage') match = TEMPLATES.find(t => t.id === 'rapport_stage' || t.title.toLowerCase().includes('stage'));
      else if (key === 'memoire_universitaire') match = TEMPLATES.find(t => t.id === 'memoire_universitaire' || t.title.toLowerCase().includes('mémoire'));
      else if (key === 'lettre_motivation') match = TEMPLATES.find(t => t.id === 'lette_motivation' || t.title.toLowerCase().includes('motivation'));
      else if (key === 'cv') match = TEMPLATES.find(t => t.id === 'cv' || t.title.toLowerCase().includes('cv'));
      else if (key === 'facture') match = TEMPLATES.find(t => t.id === 'facture' || t.title.toLowerCase().includes('facture'));
    }
    if (match) {
      onSelectTemplate(match);
    } else {
      handleOpenBlank();
    }
  };

  // Quick Action triggers
  const handleQuickAction = (actionName: string) => {
    if (onTriggerAction) {
      if (actionName === 'En-tête et pied de page') {
        onTriggerAction('header_footer');
        return;
      }
      if (actionName === 'Numérotation des pages') {
        onTriggerAction('page_numbering');
        return;
      }
      if (actionName === 'Table des matières') {
        onTriggerAction('table_of_contents');
        return;
      }
      if (actionName === 'Correction orthographique') {
        onTriggerAction('grammar_check');
        return;
      }
      if (actionName === 'Traduction') {
        onTriggerAction('translate');
        return;
      }
      if (actionName === 'Créer un tableau') {
        onTriggerAction('insert_table');
        return;
      }
    }
    if (actionName === 'Correction orthographique') {
      const blank = TEMPLATES.find(t => t.id === 'blank') || TEMPLATES[0];
      onSelectTemplate(blank);
      onStartWithAiPrompt?.('Corrige et vérifie les fautes d\'orthographe de ce texte.');
    } else if (actionName === 'Table des matières') {
      const memoire = TEMPLATES.find(t => t.id === 'memoire_universitaire') || TEMPLATES[0];
      onSelectTemplate(memoire);
    } else if (actionName === 'Créer un tableau') {
      const blank = TEMPLATES.find(t => t.id === 'blank') || TEMPLATES[0];
      onSelectTemplate(blank);
      onStartWithAiPrompt?.('Insère un tableau comparatif avec 4 colonnes et 5 lignes.');
    } else if (actionName === 'Traduction') {
      const blank = TEMPLATES.find(t => t.id === 'blank') || TEMPLATES[0];
      onSelectTemplate(blank);
      onStartWithAiPrompt?.('Traduis ce document en anglais professionnel.');
    } else {
      handleOpenBlank();
    }
  };

  // Submit AI prompt from the hero bar
  const handleSendPrompt = (promptText?: string) => {
    const text = promptText || heroPrompt;
    if (!text.trim()) {
      handleOpenBlank();
      return;
    }
    if (onStartWithAiPrompt) {
      onStartWithAiPrompt(text);
    } else {
      handleOpenBlank();
    }
  };

  const categories = ['Tous', 'Rapports', 'Entreprise', 'Lettres', 'CV', 'Marketing', 'Éducation', 'Événements'];

  const filteredTemplates = TEMPLATES.filter((t) => {
    const matchesCat = selectedCategory === 'Tous' || t.category === selectedCategory;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div id="word-home-dashboard" className={`flex h-screen w-full font-sans overflow-hidden select-none ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-[#f4f7fb] text-slate-800'}`}>
      
      {/* ======================================================== */}
      {/* 1. LEFT SIDEBAR NAVIGATION (Matching WhatsApp Image)    */}
      {/* ======================================================== */}
      <aside className="w-60 shrink-0 bg-[#0c192c] text-slate-300 flex flex-col justify-between border-r border-slate-800/80 z-20">
        
        {/* Top: Logo & Main Navigation */}
        <div className="flex flex-col">
          {/* Brand Logo with 3D Blue Ribbon 'W' and Manix Word */}
          <div className="p-5 pb-6 flex items-center">
            <ManixWordLogo size="md" textColor="text-white" showText={true} />
          </div>

          {/* Navigation Items */}
          <nav className="px-3 space-y-1">
            <button
              onClick={() => setActiveNav('accueil')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                activeNav === 'accueil'
                  ? 'bg-[#1d4ed8] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Home className="w-4 h-4 shrink-0" />
              <span>Accueil</span>
            </button>

            <button
              onClick={handleOpenBlank}
              className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition cursor-pointer"
            >
              <FilePlus className="w-4 h-4 shrink-0" />
              <span>Nouveau document</span>
            </button>

            <button
              onClick={() => setActiveNav('documents')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                activeNav === 'documents'
                  ? 'bg-[#1d4ed8] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FolderOpen className="w-4 h-4 shrink-0" />
              <span>Mes documents</span>
            </button>

            <button
              onClick={() => setActiveNav('modeles')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                activeNav === 'modeles'
                  ? 'bg-[#1d4ed8] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <LayoutGrid className="w-4 h-4 shrink-0" />
              <span>Modèles</span>
            </button>

            <button
              onClick={() => {
                handleOpenBlank();
                onStartWithAiPrompt?.('Assistant IA ManixGPT activé');
              }}
              className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Assistant IA</span>
            </button>

            <button
              onClick={() => setActiveNav('historique')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                activeNav === 'historique'
                  ? 'bg-[#1d4ed8] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Clock className="w-4 h-4 shrink-0" />
              <span>Historique</span>
            </button>

            <button
              onClick={() => setActiveNav('parametres')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                activeNav === 'parametres'
                  ? 'bg-[#1d4ed8] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Settings className="w-4 h-4 shrink-0" />
              <span>Paramètres</span>
            </button>
          </nav>
        </div>

        {/* Bottom: Pro Card & User Profile */}
        <div className="p-3 space-y-3">
          {/* Manix Word Pro Card */}
          <div className="bg-[#132742] border border-blue-500/20 rounded-2xl p-3.5 text-left relative overflow-hidden">
            <div className="flex items-center space-x-2 mb-1.5">
              <Crown className="w-4 h-4 text-amber-400 shrink-0" />
              <h4 className="text-xs font-bold text-white tracking-wide">Manix Word Pro</h4>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              Fonctionnalités avancées, plus de puissance pour votre productivité.
            </p>
            <button
              onClick={() => setShowProModal(true)}
              className="w-full py-1.5 px-3 bg-[#2563eb] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer shadow-xs"
            >
              <span>Passer en Pro</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* User Profile Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 px-1">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-white leading-tight">Utilisateur</span>
                <div className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[10px] text-slate-400">En ligne</span>
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 cursor-pointer hover:text-white transition" />
          </div>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* 2. MAIN CENTER PANE                                      */}
      {/* ======================================================== */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header Bar */}
        <header className={`h-16 px-8 flex items-center justify-between shrink-0 border-b ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80'}`}>
          {/* Search bar matching screenshot */}
          <div className="relative w-96 max-w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un modèle, une fonctionnalité..."
              className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs outline-none transition border ${
                isDarkMode
                  ? 'bg-slate-800/80 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-blue-500'
                  : 'bg-slate-50 border-slate-200/80 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-400'
              }`}
            />
          </div>

          {/* Right Controls: Theme switch, notifications, avatar */}
          <div className="flex items-center space-x-4">
            {/* Sun / Moon Switcher matching the screenshot */}
            <div className="flex items-center space-x-2">
              <Sun className={`w-4 h-4 ${isDarkMode ? 'text-slate-500' : 'text-amber-500'}`} />
              <button
                onClick={onToggleDarkMode}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer p-0.5 ${
                  isDarkMode ? 'bg-blue-600' : 'bg-slate-300'
                }`}
                title={isDarkMode ? 'Passer en mode clair' : 'Passer en mode sombre'}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform ${
                    isDarkMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
              <Moon className={`w-4 h-4 ${isDarkMode ? 'text-blue-400' : 'text-slate-400'}`} />
            </div>

            {/* Notification Bell */}
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className={`p-2 rounded-xl transition cursor-pointer relative ${
                isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-blue-600 absolute top-2 right-2"></span>
            </button>

            {/* User Initial Avatar "M" */}
            <div className="w-8 h-8 rounded-full bg-[#1d4ed8] text-white flex items-center justify-center font-bold text-xs shadow-xs cursor-pointer">
              M
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        {activeNav === 'accueil' && (
          <div className="p-8 space-y-8 flex-1">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
              
              {/* === LEFT ZONE (8 cols): Hero + Popular Models + Quick Actions === */}
              <div className="xl:col-span-8 space-y-8">
                
                {/* HERO CARD (Matching exact screenshot with greeting, illustration, prompt, chips) */}
                <div className={`rounded-3xl p-7 border relative overflow-hidden shadow-xs transition ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/40 border-slate-800' 
                    : 'bg-gradient-to-br from-white via-white to-blue-50/40 border-blue-100/80'
                }`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    {/* Left text */}
                    <div className="max-w-xl text-left">
                      <div className="flex items-center space-x-2 text-2xl font-bold tracking-tight">
                        <span className={isDarkMode ? 'text-white' : 'text-slate-900'}>Bonjour !</span>
                        <span className="inline-block hover:animate-bounce">👋</span>
                      </div>
                      <h2 className={`text-xl sm:text-2xl font-extrabold mt-1 tracking-tight ${isDarkMode ? 'text-blue-400' : 'text-[#0c192c]'}`}>
                        Que souhaitez-vous faire aujourd'hui ?
                      </h2>
                      <p className={`text-xs mt-2 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Dites simplement ce que vous voulez, Manix Word s'occupe du reste. Créez, modifiez, formatez et gérez vos documents en un seul endroit.
                      </p>
                    </div>

                    {/* Right decorative 3D document card illustration matching the screenshot */}
                    <div className="relative shrink-0 flex items-center justify-center self-center pr-2">
                      <div className="w-28 h-28 relative">
                        {/* Soft blue glow backdrop */}
                        <div className="absolute inset-0 bg-blue-500/15 rounded-3xl blur-xl"></div>
                        {/* Folded Document Card */}
                        <div className="absolute inset-2 bg-gradient-to-tr from-blue-600 via-blue-500 to-sky-400 rounded-2xl shadow-lg border border-blue-300/40 flex flex-col items-center justify-center p-3 transform rotate-6 hover:rotate-0 transition duration-300">
                          <span className="text-white font-extrabold text-3xl tracking-tighter">W</span>
                          <div className="w-8 h-1 bg-white/40 rounded mt-1.5"></div>
                          <div className="w-5 h-1 bg-white/40 rounded mt-1"></div>
                        </div>
                        {/* Floating mini sheet in front */}
                        <div className="absolute -bottom-1 -left-2 w-16 h-14 bg-white/95 rounded-xl shadow-md border border-slate-200/80 p-2 flex flex-col justify-between transform -rotate-6">
                          <div className="w-6 h-1 bg-blue-500 rounded"></div>
                          <div className="w-10 h-0.5 bg-slate-300 rounded"></div>
                          <div className="w-8 h-0.5 bg-slate-300 rounded"></div>
                        </div>
                        {/* Sparkles icon accent */}
                        <Sparkles className="w-5 h-5 text-sky-400 absolute -top-1 -right-1 animate-pulse" />
                      </div>
                    </div>
                  </div>

                  {/* Prompt Bar inside Hero */}
                  <div className={`mt-6 p-2 pl-4 rounded-2xl border flex items-center space-x-3 shadow-xs transition ${
                    isDarkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-white border-blue-200/90'
                  }`}>
                    <Sparkles className="w-4 h-4 text-purple-500 shrink-0" />
                    <input
                      type="text"
                      value={heroPrompt}
                      onChange={(e) => setHeroPrompt(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendPrompt();
                      }}
                      placeholder="Ex : Crée une lettre de motivation professionnelle, ajoute une table des matières..."
                      className={`flex-1 text-xs outline-none bg-transparent ${
                        isDarkMode ? 'text-slate-100 placeholder-slate-500' : 'text-slate-700 placeholder-slate-400'
                      }`}
                    />
                    <button
                      onClick={() => handleSendPrompt()}
                      className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shrink-0 transition shadow-xs cursor-pointer"
                      title="Envoyer la consigne à Manix Word"
                    >
                      <Send className="w-3.5 h-3.5 -ml-0.5" />
                    </button>
                  </div>

                  {/* Quick Filter/Action Pills right below prompt */}
                  <div className="flex flex-wrap items-center gap-2 mt-3.5">
                    {[
                      { label: 'Créer un document', icon: <FileText className="w-3.5 h-3.5" />, prompt: 'Crée un nouveau document bien structuré avec titre et paragraphes' },
                      { label: 'Mise en page', icon: <Layout className="w-3.5 h-3.5" />, prompt: 'Applique une belle mise en page professionnelle avec marges et police soignée' },
                      { label: 'Correction', icon: <PenLine className="w-3.5 h-3.5" />, prompt: 'Corrige les fautes d\'orthographe et améliore le style' },
                      { label: 'Tableau', icon: <Table className="w-3.5 h-3.5" />, prompt: 'Insère un tableau clair avec 3 colonnes et 4 lignes' },
                      { label: 'Graphique', icon: <BarChart3 className="w-3.5 h-3.5" />, prompt: 'Ajoute une synthèse chiffrée avec liste à puces structurée' },
                    ].map((pill, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendPrompt(pill.prompt)}
                        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer ${
                          isDarkMode
                            ? 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-blue-500 hover:text-white'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 shadow-2xs'
                        }`}
                      >
                        <span className="text-slate-400">{pill.icon}</span>
                        <span>{pill.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* MODÈLES POPULAIRES (Matching exact 5 cards from screenshot) */}
                <div className="space-y-3.5 text-left">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-sm font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      Modèles populaires
                    </h3>
                    <button
                      onClick={() => setActiveNav('modeles')}
                      className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline flex items-center space-x-1 cursor-pointer"
                    >
                      <span>Voir tous les modèles</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* 5 Cards Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
                    {[
                      {
                        id: 'rapport_stage',
                        title: 'Rapport de stage',
                        desc: 'Structure complète et mise en page pro',
                        icon: <FileText className="w-4 h-4 text-blue-600" />,
                        bg: 'bg-blue-50'
                      },
                      {
                        id: 'memoire_universitaire',
                        title: 'Mémoire universitaire',
                        desc: 'Avec table des matières et bibliographie',
                        icon: <GraduationCap className="w-4 h-4 text-purple-600" />,
                        bg: 'bg-purple-50'
                      },
                      {
                        id: 'lettre_motivation',
                        title: 'Lettre de motivation',
                        desc: 'Modèle professionnel et personnalisé',
                        icon: <Briefcase className="w-4 h-4 text-emerald-600" />,
                        bg: 'bg-emerald-50'
                      },
                      {
                        id: 'cv',
                        title: 'CV moderne',
                        desc: 'Design élégant et professionnel',
                        icon: <User className="w-4 h-4 text-orange-600" />,
                        bg: 'bg-orange-50'
                      },
                      {
                        id: 'facture',
                        title: 'Facture',
                        desc: 'Prête à l\'emploi et personnalisable',
                        icon: <FileText className="w-4 h-4 text-pink-600" />,
                        bg: 'bg-pink-50'
                      }
                    ].map((model) => (
                      <div
                        key={model.id}
                        onClick={() => handleOpenPopularModel(model.id)}
                        className={`rounded-2xl p-4 border flex flex-col justify-between transition cursor-pointer hover:-translate-y-0.5 hover:shadow-md ${
                          isDarkMode
                            ? 'bg-slate-900 border-slate-800 hover:border-blue-500'
                            : 'bg-white border-slate-200/90 hover:border-blue-300 shadow-2xs'
                        }`}
                      >
                        <div>
                          <div className={`w-8 h-8 rounded-xl ${model.bg} flex items-center justify-center mb-3`}>
                            {model.icon}
                          </div>
                          <h4 className={`text-xs font-bold leading-snug line-clamp-1 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                            {model.title}
                          </h4>
                          <p className={`text-[11px] mt-1 line-clamp-2 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            {model.desc}
                          </p>
                        </div>
                        <div className="pt-3 flex items-center text-blue-600 text-xs font-medium">
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ACTIONS RAPIDES (Matching exact 6 cards from screenshot) */}
                <div className="space-y-3.5 text-left">
                  <h3 className={`text-sm font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    Actions rapides
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3.5">
                    {[
                      { title: 'En-tête et pied de page', icon: <FileText className="w-4 h-4 text-blue-600" />, bg: 'bg-blue-50' },
                      { title: 'Numérotation des pages', icon: <Hash className="w-4 h-4 text-blue-600" />, bg: 'bg-blue-50' },
                      { title: 'Table des matières', icon: <ListOrdered className="w-4 h-4 text-blue-600" />, bg: 'bg-blue-50' },
                      { title: 'Correction orthographique', icon: <CheckCheck className="w-4 h-4 text-pink-600" />, bg: 'bg-pink-50' },
                      { title: 'Traduction', icon: <Languages className="w-4 h-4 text-blue-600" />, bg: 'bg-blue-50' },
                      { title: 'Créer un tableau', icon: <Grid3X3 className="w-4 h-4 text-blue-600" />, bg: 'bg-blue-50' }
                    ].map((action, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleQuickAction(action.title)}
                        className={`rounded-2xl p-3.5 border flex flex-col justify-between transition cursor-pointer hover:shadow-md ${
                          isDarkMode
                            ? 'bg-slate-900 border-slate-800 hover:border-blue-500'
                            : 'bg-white border-slate-200/90 hover:border-blue-300 shadow-2xs'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-xl ${action.bg} flex items-center justify-center mb-2.5`}>
                          {action.icon}
                        </div>
                        <h4 className={`text-xs font-semibold leading-tight line-clamp-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                          {action.title}
                        </h4>
                        <div className="pt-2 flex items-center text-blue-600 text-xs font-medium">
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* === RIGHT ZONE (4 cols): ManixGPT + Raccourcis + Documents récents === */}
              <div className="xl:col-span-4 space-y-4">
                
                {/* 1. MANIXGPT ASSISTANT CARD (Matching exact screenshot) */}
                <div className={`rounded-2xl p-4 border text-left transition ${
                  isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90 shadow-2xs'
                }`}>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 flex items-center justify-center">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">ManixGPT</h4>
                        <span className="text-[10px] text-slate-400">Votre assistant IA intégré</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>

                  <div className="mt-3.5 flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className={`p-2.5 rounded-2xl text-[11px] leading-relaxed flex-1 ${
                      isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-blue-50/70 text-slate-700 border border-blue-100/60'
                    }`}>
                      <p className="font-semibold text-blue-600 dark:text-blue-400 mb-0.5">Je suis Manix Word !</p>
                      Dites-moi ce que vous voulez faire avec votre document, et je m'en occupe automatiquement.
                    </div>
                  </div>
                </div>

                {/* 2. RACCOURCIS CARD (Matching exact screenshot) */}
                <div className={`rounded-2xl p-4 border text-left transition ${
                  isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90 shadow-2xs'
                }`}>
                  <div className="flex items-center space-x-2 mb-3">
                    <Zap className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Raccourcis</h4>
                  </div>

                  <div className="space-y-1">
                    {[
                      { label: 'Créer un rapport complet', prompt: 'Génère un rapport professionnel complet avec table des matières, introduction et conclusion.' },
                      { label: 'Ajouter une table des matières', prompt: 'Ajoute une table des matières automatique au début du document.' },
                      { label: 'Corriger les fautes d\'orthographe', prompt: 'Relis et corrige toutes les fautes d\'orthographe en rouge.' },
                      { label: 'Mettre en forme le document', prompt: 'Harmonise les titres, polices et marges avec un design épuré.' },
                      { label: 'Créer une page de garde', prompt: 'Insère une page de garde élégante avec logo et coordonnées.' }
                    ].map((shortcut, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendPrompt(shortcut.prompt)}
                        className={`w-full flex items-center justify-between py-2 px-2.5 rounded-xl text-xs transition cursor-pointer ${
                          isDarkMode
                            ? 'hover:bg-slate-800 text-slate-300 hover:text-white'
                            : 'hover:bg-slate-50 text-slate-700 hover:text-blue-600'
                        }`}
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <span className="text-blue-500 font-bold text-[10px]">▷</span>
                          <span className="truncate">{shortcut.label}</span>
                        </div>
                        <ArrowRight className="w-3 h-3 text-slate-400 shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. DOCUMENTS RÉCENTS CARD (Matching exact screenshot) */}
                <div className={`rounded-2xl p-4 border text-left transition ${
                  isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90 shadow-2xs'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">Documents récents</h4>
                    </div>
                    <button
                      onClick={() => setActiveNav('documents')}
                      className="text-[11px] font-medium text-blue-600 hover:underline cursor-pointer"
                    >
                      Voir tout
                    </button>
                  </div>

                  <div className="space-y-1">
                    {/* If recentDocs has items, use them, otherwise use the 4 default mock docs from the screenshot */}
                    {(recentDocs && recentDocs.length > 0 ? recentDocs.slice(0, 4) : defaultRecentDocs).map((doc: any, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          if (doc.content) {
                            onOpenDoc(doc as WordDocument);
                          } else {
                            handleOpenPopularModel(doc.id || 'rapport_stage');
                          }
                        }}
                        className={`flex items-center justify-between p-2 rounded-xl transition cursor-pointer ${
                          isDarkMode
                            ? 'hover:bg-slate-800'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 truncate">
                          {/* Microsoft Word Document Icon */}
                          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                            W
                          </div>
                          <div className="flex flex-col truncate">
                            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                              {doc.title}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {doc.lastModified || doc.date || "Aujourd'hui"}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* Full Models Gallery View when 'Modèles' is selected or 'Voir tous les modèles' is clicked */}
        {activeNav === 'modeles' && (
          <div className="p-8 space-y-6 text-left">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Catalogue complet des modèles Word</h2>
                <p className="text-xs text-slate-500 mt-1">Choisissez un modèle prêt à l'emploi ou importez vos propres documents Word (.docx).</p>
              </div>
              <label className="flex items-center space-x-2 px-4 py-2 bg-[#2563eb] text-white rounded-xl text-xs font-semibold cursor-pointer hover:bg-blue-600 transition shadow-xs">
                <FolderOpen className="w-4 h-4" />
                <span>Importer un fichier .docx</span>
                <input type="file" accept=".docx,.txt,.html" onChange={onImportLocalFile} className="hidden" />
              </label>
            </div>

            {/* Category tabs */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`p-4 rounded-2xl border transition hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between ${
                    isDarkMode
                      ? 'bg-slate-900 border-slate-800 hover:border-blue-500'
                      : 'bg-white border-slate-200 hover:border-blue-400'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewingTemplate(template);
                        }}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-500 hover:text-blue-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-white transition text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                        title="Aperçu rapide du modèle"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Aperçu</span>
                      </button>
                    </div>
                    <h4 className="text-xs font-bold">{template.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-3 leading-relaxed">{template.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => onSelectTemplate(template)}
                      className="w-full py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer"
                    >
                      <span>Créer ce document</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mes documents view */}
        {activeNav === 'documents' && (
          <div className="p-8 space-y-6 text-left">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Mes documents Word</h2>
                <p className="text-xs text-slate-500 mt-1">Tous vos fichiers enregistrés localement et synchronisés dans le Cloud.</p>
              </div>
              <button
                onClick={handleOpenBlank}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold cursor-pointer hover:bg-blue-700 transition"
              >
                <FilePlus className="w-4 h-4" />
                <span>Nouveau document</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(recentDocs && recentDocs.length > 0 ? recentDocs : defaultRecentDocs).map((doc: any, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    if (doc.content) onOpenDoc(doc as WordDocument);
                    else handleOpenPopularModel(doc.id || 'rapport_stage');
                  }}
                  className={`p-4 rounded-2xl border transition cursor-pointer hover:shadow-md ${
                    isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center mb-3 shadow-xs">
                    W
                  </div>
                  <h4 className="text-xs font-bold truncate">{doc.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-1">{doc.lastModified || doc.date || "Modifié récemment"}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Historique View */}
        {activeNav === 'historique' && (
          <div className="p-8 space-y-6 text-left">
            <h2 className="text-xl font-bold">Historique des versions et révisions</h2>
            <p className="text-xs text-slate-500">Consultez les sauvegardes automatiques de vos séances de rédaction.</p>
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold">Session actuelle Manix Word</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Enregistrement automatique sécurisé en temps réel</p>
                </div>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded-full">Actif</span>
              </div>
            </div>
          </div>
        )}

        {/* Paramètres View */}
        {activeNav === 'parametres' && (
          <div className="p-8 space-y-6 text-left max-w-xl">
            <h2 className="text-xl font-bold">Paramètres de l'application</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold">Thème de l'interface</h4>
                  <p className="text-[11px] text-slate-400">Basculer entre le mode clair et le mode sombre</p>
                </div>
                <button
                  onClick={onToggleDarkMode}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold cursor-pointer"
                >
                  {isDarkMode ? 'Mode Sombre' : 'Mode Clair'}
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold">Compte Utilisateur</h4>
                  <p className="text-[11px] text-slate-400">{userEmail}</p>
                </div>
                <span className="text-[11px] text-blue-600 font-semibold">Connecté</span>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ======================================================== */}
      {/* 3. PRO MODAL UPGRADE                                     */}
      {/* ======================================================== */}
      {showProModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 text-left shadow-2xl relative">
            <button
              onClick={() => setShowProModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center space-x-2 text-amber-500 mb-2">
              <Crown className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Formule Professionnelle</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Débloquez la puissance Manix Word Pro</h3>
            <p className="text-xs text-slate-500 mt-1">Conçu pour les créateurs de documents et équipes exigeantes.</p>

            <div className="space-y-2.5 my-5">
              {[
                'Génération IA illimitée de documents multi-pages avec vérification sémantique',
                'Exportation PDF haute fidélité avec signature électronique certifiée',
                'Correcteur orthographique en temps réel sans restriction de volume',
                'Accès illimité à l\'ensemble des modèles d\'entreprise certifiés'
              ].map((feat, i) => (
                <div key={i} className="flex items-start space-x-2 text-xs text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowProModal(false)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
            >
              Activer Manix Word Pro
            </button>
          </div>
        </div>
      )}

      {/* Template Quick View Modal */}
      <TemplatePreviewModal
        isOpen={Boolean(previewingTemplate)}
        template={previewingTemplate}
        isDarkMode={isDarkMode}
        onClose={() => setPreviewingTemplate(null)}
        onSelectTemplate={onSelectTemplate}
      />

    </div>
  );
}
