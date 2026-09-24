import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { 
  Sparkles, Grid, Eye, Search, Table, Image as ImageIcon, CheckCircle, 
  Save, FileText, ChevronDown, List, ListOrdered, FileDown, Maximize2, 
  Minimize2, AlertTriangle, RefreshCw, PanelTopClose, PanelTopOpen,
  Moon, Sun 
} from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, isFirebaseEnabled } from './firebase';
import TemplateChooser from './components/TemplateChooser';
import AuthPage from './components/AuthPage';
import WordRibbon from './components/WordRibbon';
import WordDocumentSheet from './components/WordDocumentSheet';
import FileMenu from './components/FileMenu';
import AiAssistant from './components/AiAssistant';
import GrammarPanel from './components/GrammarPanel';
import SynonymDrawer from './components/SynonymDrawer';
import SplashScreen from './components/SplashScreen';
import CommandPaletteModal from './components/CommandPaletteModal';
import DiffPreviewModal from './components/DiffPreviewModal';
import GenerationProgressOverlay from './components/GenerationProgressOverlay';
import ProactiveSuggestionsPopover from './components/ProactiveSuggestionsPopover';
import VoiceDictationModal from './components/VoiceDictationModal';
import MultimodalOcrModal from './components/MultimodalOcrModal';
import RagSearchModal from './components/RagSearchModal';
import AutonomousAgentModal from './components/AutonomousAgentModal';
import DocumentStructureModal from './components/DocumentStructureModal';
import { WordDocument, RibbonTab, Template, DocumentStyle, GrammarIssue, GrammarCheckResult } from './types';
import { TEMPLATES } from './templatesData';
import { exportToDocx } from './utils/docxExporter';
import { exportToPdf } from './utils/pdfExporter';
import mammoth from 'mammoth';

export default function App() {
  // Splash Screen State (2 seconds initial load)
  const [showSplash, setShowSplash] = useState(true);

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('manix_word_dark_mode') === 'true';
    } catch {
      return false;
    }
  });

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('manix_word_dark_mode', String(next));
      } catch {}
      return next;
    });
  };

  // Auth State
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Navigation State
  const [isTemplateChooser, setIsTemplateChooser] = useState(true);
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<RibbonTab>('Accueil');

  // Fullscreen & Distraction-Free States
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isZenRibbonHidden, setIsZenRibbonHidden] = useState(false);

  // Real-time Grammar Analysis States
  const [grammarIssues, setGrammarIssues] = useState<GrammarIssue[]>([]);
  const [isAnalyzingGrammar, setIsAnalyzingGrammar] = useState(false);
  const [isGrammarPanelOpen, setIsGrammarPanelOpen] = useState(false);
  const [autoFixOnType, setAutoFixOnType] = useState(true);
  const grammarTimerRef = useRef<any>(null);

  // Synonym Drawer States
  const [isSynonymDrawerOpen, setIsSynonymDrawerOpen] = useState(false);
  const [synonymTargetWord, setSynonymTargetWord] = useState('');
  const [synonymTargetContext, setSynonymTargetContext] = useState('');

  // Document State
  const [activeDoc, setActiveDoc] = useState<WordDocument | null>(null);
  const [recentDocs, setRecentDocs] = useState<WordDocument[]>([]);

  // Global Accent Color Theme State ('#1d4ed8' | '#7c3aed' | '#059669' | '#d97706' | '#e11d48')
  const [accentColor, setAccentColor] = useState<string>(() => {
    try {
      return localStorage.getItem('manix_accent_color') || '#1d4ed8';
    } catch {
      return '#1d4ed8';
    }
  });

  const changeAccentColor = (color: string) => {
    setAccentColor(color);
    try {
      localStorage.setItem('manix_accent_color', color);
    } catch {}
  };

  // AI Assistant Dock Mode ('right' | 'left' | 'floating')
  const [aiPanelMode, setAiPanelMode] = useState<'right' | 'left' | 'floating'>('right');
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(true);

  // Advanced AI Modals States
  const [isVoiceDictationOpen, setIsVoiceDictationOpen] = useState(false);
  const [isMultimodalOcrOpen, setIsMultimodalOcrOpen] = useState(false);
  const [isRagSearchOpen, setIsRagSearchOpen] = useState(false);
  const [isAutonomousAgentOpen, setIsAutonomousAgentOpen] = useState(false);
  const [isDocumentStructureOpen, setIsDocumentStructureOpen] = useState(false);

  // Command Palette Ctrl+K State
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Diff Preview Modal State
  const [diffPreviewData, setDiffPreviewData] = useState<{
    isOpen: boolean;
    originalText: string;
    proposedText: string;
    promptUsed: string;
  } | null>(null);

  // Generation Progress Overlay State
  const [genProgress, setGenProgress] = useState<{
    isVisible: boolean;
    promptTitle: string;
    currentStep: number;
  }>({
    isVisible: false,
    promptTitle: '',
    currentStep: 0,
  });

  // Keyboard Event Listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  // Ribbon Options
  const [rulerVisible, setRulerVisible] = useState(true);
  const [gridVisible, setGridVisible] = useState(false);
  const [watermarkText, setWatermarkText] = useState('');
  const [collabActive, setCollabActive] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [zoom, setZoom] = useState(100);

  // Modal Overlays
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [tableModalTab, setTableModalTab] = useState<'manual' | 'auto'>('manual');
  const [aiTablePrompt, setAiTablePrompt] = useState('');
  const [isGeneratingTable, setIsGeneratingTable] = useState(false);

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const editableRef = useRef<HTMLDivElement | null>(null);

  // 1. Initial Load - Read simulated cloud documents from LocalStorage
  useEffect(() => {
    let unsubscribe: any = null;
    if (isFirebaseEnabled && auth) {
        unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          setLoading(false);
        });
    } else {
        setLoading(false);
    }
    
    const saved = localStorage.getItem('ms_word_app_docs_sync');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setRecentDocs(parsed);
      } catch (err) {
        console.error("Erreur de décodage des documents locaux:", err);
      }
    }

    return () => unsubscribe && unsubscribe();
  }, []);

  // Fullscreen API handlers and synchronization
  const toggleFullscreen = () => {
    try {
      if (!document.fullscreenElement) {
        const docElem = document.documentElement;
        if (docElem.requestFullscreen) {
          docElem.requestFullscreen().catch(() => {
            setIsFullscreen(true);
          });
        } else {
          setIsFullscreen(true);
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {
            setIsFullscreen(false);
          });
        } else {
          setIsFullscreen(false);
        }
      }
    } catch (err) {
      setIsFullscreen((prev) => !prev);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Real-time Grammar Checker Logic
  const triggerGrammarCheck = async (contentToCheck: string) => {
    if (!contentToCheck || !contentToCheck.trim()) {
      setGrammarIssues([]);
      return;
    }
    setIsAnalyzingGrammar(true);
    try {
      const res = await fetch('/api/ai/grammar-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: contentToCheck })
      });
      const data: GrammarCheckResult = await res.json();
      if (data && Array.isArray(data.issues)) {
        setGrammarIssues(data.issues);
      }
    } catch (err) {
      console.error('Erreur analyse grammaticale temps réel:', err);
    } finally {
      setIsAnalyzingGrammar(false);
    }
  };

  const scheduleGrammarCheck = (newContent: string) => {
    if (!autoFixOnType) return;
    if (grammarTimerRef.current) {
      clearTimeout(grammarTimerRef.current);
    }
    grammarTimerRef.current = setTimeout(() => {
      triggerGrammarCheck(newContent);
    }, 1500);
  };

  const handleFixSingleGrammarIssue = (issue: GrammarIssue) => {
    if (!activeDoc) return;
    const escaped = issue.original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'i');
    const updated = activeDoc.content.replace(regex, issue.replacement);
    
    handleUpdateContentDirectly(updated);
    if (editableRef.current) {
      editableRef.current.innerHTML = updated;
    }
    setGrammarIssues((prev) => prev.filter((item) => item.id !== issue.id));
  };

  const handleFixAllGrammarIssues = async () => {
    if (!activeDoc) return;
    setIsAnalyzingGrammar(true);
    try {
      const res = await fetch('/api/ai/grammar-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: activeDoc.content })
      });
      const data: GrammarCheckResult = await res.json();
      if (data && data.correctedHtml) {
        handleUpdateContentDirectly(data.correctedHtml);
        if (editableRef.current) {
          editableRef.current.innerHTML = data.correctedHtml;
        }
        setGrammarIssues([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzingGrammar(false);
    }
  };

  // Synonym Lookup Handlers
  const handleOpenSynonyms = (word?: string, context?: string) => {
    let selected = word || '';
    if (!selected) {
      const selection = window.getSelection();
      selected = selection ? selection.toString().trim() : '';
    }
    setSynonymTargetWord(selected);
    setSynonymTargetContext(context || '');
    setIsSynonymDrawerOpen(true);
  };

  const handleReplaceSynonymWord = (newWord: string) => {
    if (!activeDoc) return;
    const wordToReplace = synonymTargetWord.trim();
    if (wordToReplace) {
      const escaped = wordToReplace.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'i');
      const updatedHtml = activeDoc.content.replace(regex, newWord);
      handleUpdateContentDirectly(updatedHtml);
      if (editableRef.current) {
        editableRef.current.innerHTML = updatedHtml;
      }
      scheduleGrammarCheck(updatedHtml);
    }
  };

  // Inline Floating AI Prompt Handler with Diff Preview
  const handleInlinePromptAction = async (selectedText: string, actionType: string, customPrompt?: string) => {
    if (!selectedText.trim()) return;

    let promptMessage = customPrompt || '';
    if (actionType === 'reformat') promptMessage = "Reformatte et améliore la présentation de ce texte de manière fluide et professionnelle.";
    else if (actionType === 'summarize') promptMessage = "Résume ce texte de façon claire, synthétique et élégante.";
    else if (actionType === 'translate_en') promptMessage = "Traduis ce texte en anglais fluide et professionnel.";
    else if (actionType === 'formal') promptMessage = "Rends ce texte plus formel, soutenu et percutant.";
    else if (actionType === 'fix_style') promptMessage = "Corrige la grammaire, la syntaxe et le style de ce texte.";

    try {
      const response = await fetch('/api/ai/correct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: selectedText,
          instructions: promptMessage
        })
      });

      const data = await response.json();
      if (data.success && data.content) {
        const cleanProposed = data.content.replace(/^<p>/, '').replace(/<\/p>$/, '');
        setDiffPreviewData({
          isOpen: true,
          originalText: selectedText,
          proposedText: cleanProposed,
          promptUsed: promptMessage
        });
      } else {
        alert("Impossible de traiter la demande IA : " + (data.error || "Erreur"));
      }
    } catch (err) {
      console.error(err);
      alert("Erreur de communication avec ManixGPT.");
    }
  };

  const handleAcceptDiff = () => {
    if (!diffPreviewData || !activeDoc) return;
    const currentHtml = activeDoc.content;
    const updatedHtml = currentHtml.replace(diffPreviewData.originalText, diffPreviewData.proposedText);
    handleUpdateContentDirectly(updatedHtml);
    if (editableRef.current) {
      editableRef.current.innerHTML = updatedHtml;
    }
    setDiffPreviewData(null);
  };

  // Sync recent docs with localStorage
  const saveToLocalStorage = (docs: WordDocument[]) => {
    setRecentDocs(docs);
    localStorage.setItem('ms_word_app_docs_sync', JSON.stringify(docs));
  };

  // 2. Compute Real-time Word count
  const updateWordCount = (htmlContent: string) => {
    const cleanText = htmlContent.replace(/<[^>]*>/g, ' ').trim();
    if (!cleanText) {
      setWordCount(0);
      setCharCount(0);
      return;
    }
    const words = cleanText.split(/\s+/).filter(Boolean);
    setWordCount(words.length);
    setCharCount(cleanText.length);
  };

  // 3. User Selects Template & boots document
  const handleSelectTemplate = (template: Template) => {
    const newDoc: WordDocument = {
      id: `doc-${Date.now()}`,
      title: template.id === 'blank' ? `Nouveau Document.docx` : `${template.title}.docx`,
      content: template.content,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      style: { ...template.style },
      headerText: template.headerText,
      footerText: template.footerText,
      pageNumbering: true,
    };

    setActiveDoc(newDoc);
    setIsTemplateChooser(false);
    updateWordCount(template.content);
    setWatermarkText('');
    scheduleGrammarCheck(template.content);
  };

  const handleOpenDoc = (doc: WordDocument) => {
    setActiveDoc(doc);
    setIsTemplateChooser(false);
    updateWordCount(doc.content);
    if (doc.watermark) {
      setWatermarkText(doc.watermark);
    }
    scheduleGrammarCheck(doc.content);
  };

  const handleUpdateDocProperties = (propsToUpdate: Partial<WordDocument>) => {
    if (!activeDoc) return;
    const updated = { ...activeDoc, ...propsToUpdate, lastModified: new Date().toISOString() };
    setActiveDoc(updated);
    const index = recentDocs.findIndex((d) => d.id === activeDoc.id);
    if (index > -1) {
      const copy = [...recentDocs];
      copy[index] = updated;
      saveToLocalStorage(copy);
    }
  };

  const handleExecuteAiCommand = async (commandPrompt: string) => {
    if (!activeDoc) return;
    const currentHtml = editableRef.current?.innerHTML || activeDoc.content;
    try {
      const res = await fetch('/api/ai/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: commandPrompt, content: currentHtml })
      });
      const data = await res.json();
      if (data.success && data.content) {
        handleUpdateContentDirectly(data.content);
        if (editableRef.current) {
          editableRef.current.innerHTML = data.content;
        }
      }
    } catch (err) {
      console.error('Erreur commande IA:', err);
    }
  };

  const handleInsertCoverPage = () => {
    const today = new Date().toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const coverHtml = `
      <div style="min-height: 800px; display: flex; flex-direction: column; justify-content: space-between; border-bottom: 2px dashed #94a3b8; padding-bottom: 30px; margin-bottom: 40px; font-family: 'Calibri', sans-serif;">
        <div style="border-top: 6px solid #1d4ed8; padding-top: 20px;">
          <span style="font-size: 11pt; font-weight: bold; color: #1d4ed8; text-transform: uppercase; letter-spacing: 2px;">DOCUMENT OFFICIEL MANIX WORD</span>
        </div>
        <div style="margin: 50px 0;">
          <h1 style="font-size: 30pt; font-weight: 800; color: #0f172a; line-height: 1.15; margin: 0 0 16px 0;">${activeDoc?.title?.replace('.docx', '') || 'RAPPORT DE SYNTHÈSE'}</h1>
          <p style="font-size: 14pt; color: #475569; margin: 0; line-height: 1.5;">Sous-titre explicatif, cadrage des objectifs et axes d'analyse</p>
        </div>
        <div style="background-color: #f8fafc; border-left: 4px solid #1d4ed8; padding: 18px; border-radius: 4px; margin-top: auto;">
          <p style="margin: 3px 0; font-size: 11pt; color: #334155;"><strong>Auteur principal :</strong> 23iw064si@esisalama.org</p>
          <p style="margin: 3px 0; font-size: 11pt; color: #334155;"><strong>Organisation :</strong> Manix Word Enterprise Suite</p>
          <p style="margin: 3px 0; font-size: 11pt; color: #334155;"><strong>Date de publication :</strong> ${today}</p>
        </div>
      </div>
    `;
    if (activeDoc) {
      const currentContent = editableRef.current?.innerHTML || activeDoc.content;
      const newContent = coverHtml + currentContent;
      handleUpdateContentDirectly(newContent);
      if (editableRef.current) {
        editableRef.current.innerHTML = newContent;
      }
      const notifyBubble = document.getElementById('save-bubble');
      if (notifyBubble) {
        notifyBubble.innerText = "Page de garde insérée avec succès";
        notifyBubble.classList.remove('opacity-0');
        notifyBubble.classList.add('opacity-100');
        setTimeout(() => notifyBubble.classList.remove('opacity-100'), 2500);
      }
    }
  };

  const handleDuplicateDoc = (doc: WordDocument) => {
    const clone: WordDocument = {
      ...doc,
      id: `doc-${Date.now()}`,
      title: `${doc.title.replace('.docx', '')}_Copie.docx`,
      lastModified: new Date().toISOString(),
    };
    const updated = [clone, ...recentDocs];
    setRecentDocs(updated);
    saveToLocalStorage(updated);
    const notifyBubble = document.getElementById('save-bubble');
    if (notifyBubble) {
      notifyBubble.innerText = "Document dupliqué avec succès";
      notifyBubble.classList.remove('opacity-0');
      notifyBubble.classList.add('opacity-100');
      setTimeout(() => notifyBubble.classList.remove('opacity-100'), 2500);
    }
  };

  const handleDeleteDoc = (docId: string) => {
    const updated = recentDocs.filter(d => d.id !== docId);
    setRecentDocs(updated);
    saveToLocalStorage(updated);
    if (activeDoc?.id === docId) {
      setActiveDoc(null);
    }
  };

  const handleTriggerAction = (actionId: string, payload?: any) => {
    let doc = activeDoc;
    if (!doc) {
      const blank = TEMPLATES.find(t => t.id === 'blank') || TEMPLATES[0];
      doc = {
        id: `doc-${Date.now()}`,
        title: 'Nouveau_Document.docx',
        content: '<p><br></p>',
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        style: { ...blank.style },
        headerText: 'Manix Word - Document Officiel',
        footerText: 'Confidentiel • Page 1',
        pageNumbering: true,
      };
      setActiveDoc(doc);
      updateWordCount(doc.content);
    }

    setIsTemplateChooser(false);

    setTimeout(() => {
      switch (actionId) {
        case 'header_footer': {
          setActiveTab('Insertion');
          const headerText = prompt("Texte pour l'en-tête du document :", doc?.headerText || "Manix Word - Document Officiel");
          if (headerText !== null && doc) {
            const footerText = prompt("Texte pour le pied de page :", doc?.footerText || "Confidentiel • Page 1");
            handleUpdateDocProperties({
              headerText: headerText || '',
              footerText: footerText || '',
            });
            const notifyBubble = document.getElementById('save-bubble');
            if (notifyBubble) {
              notifyBubble.innerText = "En-tête et pied de page appliqués";
              notifyBubble.classList.remove('opacity-0');
              notifyBubble.classList.add('opacity-100');
              setTimeout(() => notifyBubble.classList.remove('opacity-100'), 2500);
            }
          }
          break;
        }
        case 'page_numbering': {
          if (doc) {
            handleUpdateDocProperties({ pageNumbering: true });
            const notifyBubble = document.getElementById('save-bubble');
            if (notifyBubble) {
              notifyBubble.innerText = "Numérotation des pages activée sur tout le document";
              notifyBubble.classList.remove('opacity-0');
              notifyBubble.classList.add('opacity-100');
              setTimeout(() => notifyBubble.classList.remove('opacity-100'), 2500);
            }
          }
          break;
        }
        case 'table_of_contents': {
          handleInsertAutomaticToc();
          const notifyBubble = document.getElementById('save-bubble');
          if (notifyBubble) {
            notifyBubble.innerText = "Table des matières insérée avec succès";
            notifyBubble.classList.remove('opacity-0');
            notifyBubble.classList.add('opacity-100');
            setTimeout(() => notifyBubble.classList.remove('opacity-100'), 2500);
          }
          break;
        }
        case 'grammar_check': {
          setIsGrammarPanelOpen(true);
          if (doc) {
            triggerGrammarCheck(editableRef.current?.innerHTML || doc.content);
          }
          break;
        }
        case 'translate': {
          setIsGrammarPanelOpen(false);
          const aiAssistant = document.getElementById('ai-assistant-sidebar') || document.getElementById('edit-page-prompt-input');
          if (aiAssistant) {
            aiAssistant.scrollIntoView({ behavior: 'smooth' });
            aiAssistant.focus();
          }
          handleStartWithAiPrompt("Traduis l'ensemble de ce document en anglais professionnel avec terminologie exacte.");
          break;
        }
        case 'insert_table': {
          setIsTableModalOpen(true);
          break;
        }
        case 'layout': {
          setActiveTab('Mise en page');
          break;
        }
        case 'insert': {
          setActiveTab('Insertion');
          break;
        }
        case 'cover_page': {
          handleInsertCoverPage();
          break;
        }
        case 'format_document': {
          handleExecuteAiCommand("Harmonise la mise en forme du document : police équilibrée, titres hiérarchisés et interligne fluide.");
          break;
        }
        case 'full_report': {
          handleStartWithAiPrompt("Rédige un rapport complet d'activité avec synthèse exécutive, analyse sectorielle, plan d'action et conclusion.");
          break;
        }
        case 'open_ai': {
          const aiAssistant = document.getElementById('ai-assistant-sidebar') || document.getElementById('edit-page-prompt-input');
          if (aiAssistant) {
            aiAssistant.scrollIntoView({ behavior: 'smooth' });
            aiAssistant.focus();
          }
          break;
        }
        default:
          break;
      }
    }, 150);
  };

  const handleStartWithAiPrompt = async (promptText: string) => {
    const blank = TEMPLATES.find(t => t.id === 'blank') || TEMPLATES[0];
    const initialContent = `<div style="padding: 24px; text-align: center; color: #2563eb; font-family: 'Calibri', sans-serif;"><p><em>Génération de votre document en cours par ManixGPT...</em></p></div>`;
    const cleanTitle = promptText.slice(0, 30).trim().replace(/[\\/:*?"<>|]/g, '') || 'Nouveau Document';
    const newDoc: WordDocument = {
      id: `doc-${Date.now()}`,
      title: `${cleanTitle}.docx`,
      content: initialContent,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      style: { ...blank.style },
      headerText: 'Manix Word - Document Officiel',
      footerText: 'Confidentiel • Page 1',
      pageNumbering: true,
    };
    setActiveDoc(newDoc);
    setIsTemplateChooser(false);
    updateWordCount('');

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          type: "Document professionnel",
          pagesCount: 2,
          detailLevel: "exhaustif"
        })
      });
      const data = await response.json();
      if (data.success && data.content) {
        handleUpdateContentDirectly(data.content);
        if (editableRef.current) {
          editableRef.current.innerHTML = data.content;
        }
        updateWordCount(data.content);
        scheduleGrammarCheck(data.content);
      } else {
        const fallbackHtml = `<h1 style="color: #1e3a8a; font-size: 22pt; margin-bottom: 12px;">${promptText}</h1><p style="font-size: 11pt; line-height: 1.5; color: #334155;">Rédigez ou complétez le contenu de votre document ici...</p>`;
        handleUpdateContentDirectly(fallbackHtml);
        if (editableRef.current) {
          editableRef.current.innerHTML = fallbackHtml;
        }
      }
    } catch (err) {
      console.error('Erreur génération directe:', err);
      const fallbackHtml = `<h1 style="color: #1e3a8a; font-size: 22pt; margin-bottom: 12px;">${promptText}</h1><p style="font-size: 11pt; line-height: 1.5; color: #334155;">Rédigez ou complétez le contenu de votre document ici...</p>`;
      handleUpdateContentDirectly(fallbackHtml);
      if (editableRef.current) {
        editableRef.current.innerHTML = fallbackHtml;
      }
    }
  };

  // Create document import handler from raw device files
  const handleImportLocalFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.name.toLowerCase().endsWith('.docx')) {
      // Handle word document conversion via backend API (mammoth / AI)
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        const base64 = dataUrl.split(',')[1];
        try {
          const response = await fetch('/api/ai/convert-docx', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ base64, filename: file.name })
          });
          const data = await response.json();
          const convertedHtml = data.content || '';
          
          const importedDoc: WordDocument = {
            id: `imported-docx-${Date.now()}`,
            title: file.name,
            content: convertedHtml || `<p>Le document Word est vide ou n'a pas pu être converti.</p>`,
            createdAt: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            style: {
              fontFamily: 'Calibri',
              fontSize: 11,
              textColor: '#000000',
              backgroundColor: '#ffffff',
              margin: 'normal',
              orientation: 'portrait',
              lineSpacing: 1.15,
              theme: 'Office',
            },
            headerText: file.name,
            footerText: 'Page 1',
            pageNumbering: true,
          };
          
          // Save and open
          const updated = [importedDoc, ...recentDocs];
          saveToLocalStorage(updated);
          handleOpenDoc(importedDoc);
        } catch (docxErr: any) {
          console.error("Erreur d'importation DOCX :", docxErr);
          alert(`Erreur d'importation Word: ${docxErr.message || docxErr}`);
        }
      };
      reader.readAsDataURL(file);
      return;
    }

    if (file.name.toLowerCase().endsWith('.pdf')) {
      // Handle PDF conversion using the backend Gemini converter!
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const bytes = new Uint8Array(arrayBuffer);
        let binary = '';
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64 = window.btoa(binary);

        try {
          const response = await fetch('/api/ai/convert-pdf', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              base64,
              filename: file.name
            })
          });
          const data = await response.json();
          if (data.success && data.content) {
            const importedDoc: WordDocument = {
              id: `imported-pdf-${Date.now()}`,
              title: file.name,
              content: data.content,
              createdAt: new Date().toISOString(),
              lastModified: new Date().toISOString(),
              style: {
                fontFamily: 'Calibri',
                fontSize: 11,
                textColor: '#000000',
                backgroundColor: '#ffffff',
                margin: 'normal',
                orientation: 'portrait',
                lineSpacing: 1.15,
                theme: 'Office',
              },
              headerText: file.name,
              footerText: 'Page 1',
              pageNumbering: true,
            };
            
            const updated = [importedDoc, ...recentDocs];
            saveToLocalStorage(updated);
            handleOpenDoc(importedDoc);
          } else {
            alert(`Erreur lors de la conversion du PDF : ${data.error || 'Convertisseur indisponible'}`);
          }
        } catch (apiErr: any) {
          console.error("Erreur de conversion de document de l'IA (PDF) :", apiErr);
          alert(`Échec de connexion au serveur AI : ${apiErr.message}`);
        }
      };
      reader.readAsArrayBuffer(file);
      return;
    }

    // Default loader for pure text
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const importedDoc: WordDocument = {
        id: `imported-${Date.now()}`,
        title: file.name,
        content: `
          <h2>${file.name.replace(/\.[^/.]+$/, '')}</h2>
          <p>${text.replace(/\n/g, '<br/>') || "Fichier importé chargé..."}</p>
        `,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        style: {
          fontFamily: 'Calibri',
          fontSize: 11,
          textColor: '#000000',
          backgroundColor: '#ffffff',
          margin: 'normal',
          orientation: 'portrait',
          lineSpacing: 1.15,
          theme: 'Office',
        },
        headerText: file.name,
        footerText: 'Page 1',
        pageNumbering: true,
      };

      const updated = [importedDoc, ...recentDocs];
      saveToLocalStorage(updated);
      handleOpenDoc(importedDoc);
    };
    reader.readAsText(file);
  };

  // 4. Document Saving
  const handleSaveActiveDoc = async () => {
    if (!activeDoc) return;

    const currentHtml = editableRef.current?.innerHTML || activeDoc.content;
    const nowISO = new Date().toISOString();

    const updatedDoc: WordDocument = {
      ...activeDoc,
      content: currentHtml,
      lastModified: nowISO,
      watermark: watermarkText || undefined,
    };

    // Replace or prepend
    const index = recentDocs.findIndex((d) => d.id === activeDoc.id);
    let updated: WordDocument[] = [];
    if (index > -1) {
      updated = [...recentDocs];
      updated[index] = updatedDoc;
    } else {
      updated = [updatedDoc, ...recentDocs];
    }

    setActiveDoc(updatedDoc);
    saveToLocalStorage(updated);

    // Briefly notify standard Office status
    const notifyBubble = document.getElementById('save-bubble');
    if (notifyBubble) {
      notifyBubble.classList.remove('opacity-0');
      notifyBubble.classList.add('opacity-100');
      setTimeout(() => {
        notifyBubble.classList.remove('opacity-100');
        notifyBubble.classList.add('opacity-0');
      }, 2500);
    }

    // Automatically trigger DOCX download as requested
    try {
      const blob = await exportToDocx(updatedDoc);
      const url = URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = updatedDoc.title.endsWith('.docx') ? updatedDoc.title : `${updatedDoc.title}.docx`;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Auto DOCX export error:', err);
    }
  };

  // 4b. Enregistrer Sous (Save As Copy)
  const handleSaveAs = (newTitle: string) => {
    if (!activeDoc) return;
    const currentHtml = editableRef.current?.innerHTML || activeDoc.content;
    const nowISO = new Date().toISOString();
    const cleanTitle = newTitle.endsWith('.docx') ? newTitle : `${newTitle}.docx`;

    const newDoc: WordDocument = {
      ...activeDoc,
      id: `doc-${Date.now()}`,
      title: cleanTitle,
      content: currentHtml,
      createdAt: nowISO,
      lastModified: nowISO,
      watermark: watermarkText || undefined,
    };

    const updated = [newDoc, ...recentDocs];
    setActiveDoc(newDoc);
    saveToLocalStorage(updated);
  };

  // 5. Exporter: DOCX File Download
  const handleExportDocxFile = async () => {
    if (!activeDoc) return;
    try {
      // Get the latest content from the editable area
      const latestContent = editableRef.current?.innerHTML || activeDoc.content;
      const draftDoc = { ...activeDoc, content: latestContent, watermark: watermarkText };

      const blob = await exportToDocx(draftDoc);
      const url = URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = activeDoc.title.endsWith('.docx') ? activeDoc.title : `${activeDoc.title}.docx`;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la génération du fichier .docx');
    }
  };

  // 6. Exporter: High-quality real A4 PDF Export
  const handleExportPdfFile = () => {
    if (!activeDoc) return;
    const currentContent = editableRef.current?.innerHTML || activeDoc.content;
    exportToPdf({
      ...activeDoc,
      content: currentContent,
    });
  };

  // Auth Loading
  if (loading) return <div className="h-screen flex items-center justify-center">Chargement...</div>;
  if (isFirebaseEnabled && !user) return <AuthPage />;

  // 7. Text Formatting Commands
  const handleExecuteCommand = (command: string, value: string = '') => {
    if (!editableRef.current) return;
    editableRef.current.focus();

    if (command === 'save') {
      handleSaveActiveDoc();
      return;
    }

    // Execute standard native document editor commands
    window.document.execCommand(command, false, value);
    
    // Sync text content and stats
    updateWordCount(editableRef.current.innerHTML);
  };

  const handleApplyPresetStyle = (preset: 'normal' | 'sans' | 'titre1' | 'titre2' | 'titre' | 'sub') => {
    if (!editableRef.current) return;
    
    let htmlToInsert = '';
    const selText = window.getSelection()?.toString() || 'Texte de style';

    switch (preset) {
      case 'titre1':
        htmlToInsert = `<h1 style="color: #2b579a; font-family: 'Trebuchet MS', sans-serif; border-bottom: 1px solid #ddd; padding-bottom: 5px;">${selText}</h1>`;
        break;
      case 'titre2':
        htmlToInsert = `<h2 style="color: #555555; font-family: 'Arial', sans-serif;">${selText}</h2>`;
        break;
      case 'titre':
        htmlToInsert = `<h1 style="text-align: center; color: #111111; font-size: 26pt; font-family: 'Georgia', serif; font-weight: normal; margin-bottom: 10px;">${selText}</h1>`;
        break;
      case 'sub':
        htmlToInsert = `<p style="text-align: center; color: #777777; font-style: italic; font-size: 14pt; margin-top: 0;">${selText}</p>`;
        break;
      case 'sans':
        htmlToInsert = `<p style="margin: 0; padding: 0; line-height: 1.0;">${selText}</p>`;
        break;
      default:
        htmlToInsert = `<p>${selText}</p>`;
    }

    handleExecuteCommand('insertHTML', htmlToInsert);
  };

  // Inline table builder
  const handleInsertTableConfirm = () => {
    setIsTableModalOpen(false);
    let tableHtml = `<table border="1" style="width:100%; border-collapse: collapse; margin: 15px 0; font-size: 11pt;">`;
    
    // Build Header
    tableHtml += `<thead><tr style="background-color: #f1f2f5;">`;
    for (let c = 0; c < tableCols; c++) {
      tableHtml += `<th style="border: 1px solid #ccc; padding: 8px; font-weight: bold; text-align: left;">Colonne ${c + 1}</th>`;
    }
    tableHtml += `</tr></thead><tbody>`;

    // Build Rows
    for (let r = 0; r < tableRows; r++) {
      tableHtml += `<tr>`;
      for (let c = 0; c < tableCols; c++) {
        tableHtml += `<td style="border: 1px solid #ccc; padding: 8px;">Donnée...</td>`;
      }
      tableHtml += `</tr>`;
    }
    tableHtml += `</tbody></table>`;

    handleExecuteCommand('insertHTML', tableHtml);
  };

  // AI Automatic Table Generator
  const handleInsertTableAuto = async () => {
    if (!aiTablePrompt.trim()) {
      alert("Veuillez décrire le tableau à générer !");
      return;
    }
    setIsGeneratingTable(true);
    try {
      const response = await fetch('/api/ai/generate-table', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiTablePrompt }),
      });
      const data = await response.json();
      if (data.success && data.content) {
        handleExecuteCommand('insertHTML', data.content);
        setAiTablePrompt('');
        setIsTableModalOpen(false);
      } else {
        alert("Une erreur est survenue lors de la génération avec ManixGPT.");
      }
    } catch (apiErr) {
      console.error(apiErr);
      alert("Erreur de connexion au service de génération du tableau.");
    } finally {
      setIsGeneratingTable(false);
    }
  };

  // Custom visual illustration insert callback
  const handleInsertImageConfirm = () => {
    setIsImageModalOpen(false);
    const resolvedUrl = imageUrl.trim() || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400';
    
    const imageHtml = `
      <div style="text-align: center; margin: 20px 0;">
        <img src="${resolvedUrl}" alt="Illustration Word" style="max-width: 80%; border: 3px solid #ddd; border-radius: 4px; padding: 4px;" referrerPolicy="no-referrer" />
        <p style="font-size: 10px; color: #777; font-style: italic; margin-top: 4px;">Figure 1: Image insérée professionnellement</p>
      </div>
    `;

    handleExecuteCommand('insertHTML', imageHtml);
    setImageUrl('');
  };

  const handleUpdateContentDirectly = (newHtml: string) => {
    if (!activeDoc) return;
    
    const updated = { ...activeDoc, content: newHtml };
    setActiveDoc(updated);
    updateWordCount(newHtml);
  };

  const handleAppendHtmlAtSelection = (htmlToAppend: string) => {
    handleExecuteCommand('insertHTML', htmlToAppend);
  };

  // Triggering the Sidebar search using ribbon tells
  const handleTriggerGroundedSearch = () => {
    const speakInput = document.getElementById('search-input') as HTMLInputElement;
    if (speakInput) {
      speakInput.focus();
    }
  };

  // Special triggers
  const handleInsertAutomaticToc = () => {
    const tocHtml = `
      <div style="border: 1px solid #e2e8f0; background-color: #f8fafc; padding: 16px; margin-bottom: 30px; border-radius: 6px; font-family: 'Georgia', serif;">
        <h3 style="color: #2b579a; font-size: 16px; border-bottom: 2px solid #2b579a; padding-bottom: 4px; margin-top: 0;">TABLE DES MATIÈRES</h3>
        <table style="width: 100%; font-size: 12px; color: #333; margin-top: 10px;">
          <tr>
            <td style="font-weight: bold;">1. Introduction Générale</td>
            <td style="text-align: right;">........................................................................................... Page 1</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding-top: 5px;">2. Dossier Analytique</td>
            <td style="text-align: right; padding-top: 5px;">........................................................................................... Page 2</td>
          </tr>
          <tr>
            <td style="font-style: italic; padding-left: 15px; padding-top: 3px;">2.1 Revue des sources internet</td>
            <td style="text-align: right; padding-top: 3px;">........................................................................................... Page 2</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding-top: 5px;">3. Directives administratives</td>
            <td style="text-align: right; padding-top: 5px;">........................................................................................... Page 3</td>
          </tr>
        </table>
      </div>
    `;
    handleExecuteCommand('insertHTML', tocHtml);
  };

  const handleInsertFootnoteAtCaret = () => {
    const footnoteHtml = `
      <sup style="color: #2b579a; font-weight: bold; font-size: 10px; cursor: pointer;" title="Note de bas de page">[1]</sup>
    `;
    handleExecuteCommand('insertHTML', footnoteHtml);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: ${activeDoc?.style?.orientation === 'landscape' ? 'landscape' : 'portrait'};
            margin: ${activeDoc?.style?.margin === 'narrow' ? '1.27cm' : activeDoc?.style?.margin === 'wide' ? '5.08cm' : activeDoc?.style?.margin === 'moderate' ? '1.91cm' : '2.54cm'};
          }
        }
      `}} />
      <div id="word-application-root" className="h-screen flex flex-col overflow-hidden">
      
      {/* Splash Screen on Initial Load (2 seconds) */}
      {showSplash && (
        <SplashScreen onFinish={() => setShowSplash(false)} durationMs={2000} />
      )}

      {/* Save Notify Bubble Toast */}
      <div
        id="save-bubble"
        className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg z-50 flex items-center space-x-2 transition duration-300 opacity-0 pointer-events-none"
      >
        <span className="text-green-400">●</span>
        <span>Enregistré avec succès dans votre coffre Cloud Manix Word</span>
      </div>

      {isTemplateChooser ? (
        <TemplateChooser
          onSelectTemplate={handleSelectTemplate}
          recentDocs={recentDocs}
          onOpenDoc={handleOpenDoc}
          onImportLocalFile={handleImportLocalFile}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
          onStartWithAiPrompt={handleStartWithAiPrompt}
          onTriggerAction={handleTriggerAction}
          onDuplicateDoc={handleDuplicateDoc}
          onDeleteDoc={handleDeleteDoc}
        />
      ) : (
        <div className={`flex-1 flex flex-col overflow-hidden ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-[#f9fbfd]'}`}>
          {/* Main Workspace Ribbon */}
          {!isZenRibbonHidden && (
            <WordRibbon
              documentTitle={activeDoc?.title}
              activeTab={activeTab}
              onTabChange={(tab) => {
                if (tab === 'Fichier') {
                  setIsFileMenuOpen(true);
                } else {
                  setActiveTab(tab);
                }
              }}
              onReturnToHome={() => setIsTemplateChooser(true)}
              docStyle={activeDoc?.style || {
                fontFamily: 'Calibri',
                fontSize: 11,
                textColor: '#000000',
                backgroundColor: '#ffffff',
                margin: 'normal',
                orientation: 'portrait',
                lineSpacing: 1.15,
                theme: 'Office'
              }}
              onStyleChange={(updates) => {
                if (activeDoc) {
                  setActiveDoc({
                    ...activeDoc,
                    style: { ...activeDoc.style, ...updates }
                  });
                }
              }}
              onExecuteCommand={handleExecuteCommand}
              onApplyPresetStyle={handleApplyPresetStyle}
              onInsertTable={() => setIsTableModalOpen(true)}
              onInsertImage={() => setIsImageModalOpen(true)}
              onTriggerSpellcheck={() => {
                setIsGrammarPanelOpen(true);
                if (activeDoc) {
                  triggerGrammarCheck(activeDoc.content);
                }
              }}
              onTriggerAutoWrite={() => {
                const area = document.getElementById('ai-prompt-input');
                if (area) area.focus();
              }}
              onTriggerResearch={handleTriggerGroundedSearch}
              collabActive={collabActive}
              onToggleCollab={() => setCollabActive(!collabActive)}
              rulerVisible={rulerVisible}
              onToggleRuler={() => setRulerVisible(!rulerVisible)}
              gridVisible={gridVisible}
              onToggleGrid={() => setGridVisible(!gridVisible)}
              onInsertWatermark={setWatermarkText}
              onInsertTableOfContents={handleInsertAutomaticToc}
              onInsertFootnote={handleInsertFootnoteAtCaret}
              onOpenPdfExport={handleExportPdfFile}
              wordCount={wordCount}
              isFullscreen={isFullscreen}
              onToggleFullscreen={toggleFullscreen}
              onOpenGrammarPanel={() => {
                setIsGrammarPanelOpen(true);
                if (activeDoc) {
                  triggerGrammarCheck(activeDoc.content);
                }
              }}
              onOpenSynonyms={handleOpenSynonyms}
              grammarIssuesCount={grammarIssues.length}
              isAnalyzingGrammar={isAnalyzingGrammar}
              isDarkMode={isDarkMode}
              onOpenVoiceDictation={() => setIsVoiceDictationOpen(true)}
              onOpenMultimodalOcr={() => setIsMultimodalOcrOpen(true)}
              onOpenRagSearch={() => setIsRagSearchOpen(true)}
              onOpenAutonomousAgent={() => setIsAutonomousAgentOpen(true)}
              onOpenDocumentStructure={() => setIsDocumentStructureOpen(true)}
            />
          )}

          {/* Floating Zen Mode Toolbar when in Fullscreen */}
          {isFullscreen && (
            <div className="fixed top-2 right-4 z-40 flex items-center space-x-2 bg-slate-900/80 backdrop-blur text-white px-3 py-1.5 rounded-full shadow-lg border border-slate-700/50 text-xs">
              <span className="text-blue-400 font-semibold text-[11px]">Mode Plein Écran</span>
              <button
                onClick={() => setIsZenRibbonHidden(!isZenRibbonHidden)}
                className="hover:bg-slate-700/80 px-2 py-0.5 rounded transition flex items-center space-x-1 cursor-pointer"
                title={isZenRibbonHidden ? "Afficher le ruban d'outils" : "Masquer le ruban pour un espace de travail 100% épuré"}
              >
                {isZenRibbonHidden ? (
                  <>
                    <PanelTopOpen className="w-3.5 h-3.5" />
                    <span>Afficher le ruban</span>
                  </>
                ) : (
                  <>
                    <PanelTopClose className="w-3.5 h-3.5" />
                    <span>Masquer le ruban</span>
                  </>
                )}
              </button>
              <button
                onClick={toggleFullscreen}
                className="hover:bg-red-600/80 px-2 py-0.5 rounded transition flex items-center space-x-1 text-slate-200 hover:text-white cursor-pointer"
                title="Quitter le plein écran (F11)"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Quitter</span>
              </button>
            </div>
          )}

          {/* Core sheet editor + sidepanel */}
          <div className="flex-1 flex overflow-hidden relative">
            {/* Left Navigation Rail themed with Geometric Balance */}
            {!isZenRibbonHidden && (
              <nav className={`w-14 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border-r flex flex-col items-center py-4 space-y-6 shrink-0 z-10`}>
                <div className="relative group">
                  <button
                    onClick={() => setIsTemplateChooser(true)}
                    className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-500 hover:bg-blue-600/20 flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
                    title="Retour aux Modèles"
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                </div>
                <button
                  onClick={() => setIsTemplateChooser(true)}
                  className={`w-10 h-10 rounded-xl ${isDarkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'} flex items-center justify-center transition-all cursor-pointer`}
                  title="Liste des Documents"
                >
                  <FileText className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    setIsGrammarPanelOpen(true);
                    if (activeDoc) {
                      triggerGrammarCheck(activeDoc.content);
                    }
                  }}
                  className={`w-10 h-10 rounded-xl ${isDarkMode ? 'text-slate-400 hover:text-purple-400 hover:bg-slate-800' : 'text-slate-400 hover:text-purple-600 hover:bg-purple-50'} flex items-center justify-center transition-all cursor-pointer relative`}
                  title="Analyse Grammaticale en Direct"
                >
                  <Sparkles className="w-5 h-5" />
                  {grammarIssues.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                      {grammarIssues.length}
                    </span>
                  )}
                </button>
              </nav>
            )}

            {activeDoc && activeDoc.isFinal && (
              <div className="bg-[#fff2cc] border-b border-[#ffe0b2] text-[#7f6000] px-6 py-2.5 text-xs flex items-center justify-between font-sans flex-shrink-0 animate-fadeIn shadow-xs">
                <div className="flex items-center space-x-2">
                  <span className="font-bold uppercase bg-[#ffe0b2] px-1.5 py-0.5 rounded text-[10px] text-[#7f6000]">MARQUÉ COMME FINAL</span>
                  <span>Un auteur a marqué ce document comme final pour empêcher sa modification accidentelle.</span>
                </div>
                <button 
                  onClick={() => {
                    setActiveDoc({ ...activeDoc, isFinal: false, isReadOnly: false });
                  }} 
                  className="bg-white hover:bg-amber-100 text-[#7f6000] border border-[#ffe0b2] font-bold px-3 py-1 rounded text-[10px] shadow-xs transition cursor-pointer"
                >
                  Modifier quand même
                </button>
              </div>
            )}

            {activeDoc && (
              <WordDocumentSheet
                content={activeDoc.content}
                onContentChange={(html) => {
                  setActiveDoc({ ...activeDoc, content: html });
                  updateWordCount(html);
                  scheduleGrammarCheck(html);
                }}
                style={activeDoc.style}
                watermark={watermarkText}
                gridVisible={gridVisible}
                rulerVisible={rulerVisible}
                collabActive={collabActive}
                editableRef={editableRef}
                zoom={zoom}
                isReadOnly={activeDoc.isFinal || activeDoc.isReadOnly}
                onOpenSynonyms={handleOpenSynonyms}
                onOpenGrammarPanel={() => {
                  setIsGrammarPanelOpen(true);
                  if (activeDoc) {
                    triggerGrammarCheck(activeDoc.content);
                  }
                }}
                grammarIssues={grammarIssues}
                onFixGrammarIssue={handleFixSingleGrammarIssue}
                isDarkMode={isDarkMode}
                accentColor={accentColor}
                onInlinePromptAction={handleInlinePromptAction}
                onOpenAiAssistant={() => {
                  setIsAiAssistantOpen(true);
                }}
              />
            )}

            {/* Grammar Panel side drawer */}
            <GrammarPanel
              isOpen={isGrammarPanelOpen}
              issues={grammarIssues}
              isAnalyzing={isAnalyzingGrammar}
              onFixIssue={handleFixSingleGrammarIssue}
              onFixAllIssues={handleFixAllGrammarIssues}
              onClose={() => setIsGrammarPanelOpen(false)}
              onRecheck={() => {
                if (activeDoc) {
                  triggerGrammarCheck(activeDoc.content);
                }
              }}
              autoFixOnType={autoFixOnType}
              onToggleAutoFix={() => setAutoFixOnType(!autoFixOnType)}
            />

            {/* Synonym AI Dictionary side drawer */}
            <SynonymDrawer
              isOpen={isSynonymDrawerOpen}
              selectedWord={synonymTargetWord}
              contextSentence={synonymTargetContext}
              onClose={() => setIsSynonymDrawerOpen(false)}
              onReplaceWord={handleReplaceSynonymWord}
            />

            {isAiAssistantOpen && (
              <AiAssistant
                currentContent={activeDoc?.content || ''}
                onUpdateContent={handleUpdateContentDirectly}
                onAppendContent={handleAppendHtmlAtSelection}
                onExportPdf={handleExportPdfFile}
                onExportDocx={handleExportDocxFile}
                isDarkMode={isDarkMode}
                panelMode={aiPanelMode}
                onChangePanelMode={setAiPanelMode}
                accentColor={accentColor}
              />
            )}
          </div>

          {/* Microsoft Standard bottom status bar caption */}
          <div className={`${isDarkMode ? 'bg-slate-900 text-slate-300 border-slate-800' : 'bg-[#f3f2f1] text-[#2b579a] border-gray-300'} h-6 px-4 flex items-center justify-between text-[11px] border-t flex-shrink-0 relative z-10 select-none`}>
            <div className="flex items-center space-x-3">
              <span id="stat-pages" className="font-medium">
                Page 1 sur {activeDoc ? Math.max(1, activeDoc.content.split('data-page-break="true"').length) : 1}
              </span>
              <span id="stat-words">{wordCount} mots</span>
              <span id="stat-chars">{charCount} caractères</span>
              <span className={isDarkMode ? 'text-slate-700' : 'text-gray-400'}>|</span>
              
              {/* Interactive Grammar Status Button */}
              <button
                id="stat-grammar-trigger"
                onClick={() => {
                  setIsGrammarPanelOpen(true);
                  if (activeDoc) {
                    triggerGrammarCheck(activeDoc.content);
                  }
                }}
                className={`flex items-center transition cursor-pointer px-1 py-0.5 rounded ${isDarkMode ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-700 hover:text-blue-900 hover:bg-gray-200'}`}
                title="Cliquer pour afficher l'analyse grammaticale en direct"
              >
                {isAnalyzingGrammar ? (
                  <>
                    <RefreshCw className="w-3 h-3 text-blue-400 animate-spin mr-1.5" />
                    <span>Analyse grammaticale en cours...</span>
                  </>
                ) : grammarIssues.length > 0 ? (
                  <>
                    <AlertTriangle className="w-3 h-3 text-amber-500 mr-1.5" />
                    <span className="font-semibold text-amber-500">
                      {grammarIssues.length} faute{grammarIssues.length > 1 ? 's' : ''} de grammaire
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-3 h-3 text-green-500 mr-1.5 font-bold" />
                    <span>Grammaire : Impeccable</span>
                  </>
                )}
              </button>
              {/* Proactive AI Style Suggestions Popover */}
              <ProactiveSuggestionsPopover
                content={activeDoc?.content || ''}
                isDarkMode={isDarkMode}
                accentColor={accentColor}
                onApplyFix={(originalSnippet, fixedSnippet) => {
                  if (activeDoc) {
                    const updated = activeDoc.content.replace(originalSnippet, fixedSnippet);
                    handleUpdateContentDirectly(updated);
                    if (editableRef.current) {
                      editableRef.current.innerHTML = updated;
                    }
                  }
                }}
              />
            </div>
            
            <div className={`flex items-center space-x-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              {/* Accent Color Customization Menu */}
              <div className="flex items-center space-x-1">
                {[
                  { name: 'Bleu Office', color: '#1d4ed8' },
                  { name: 'Violet ManixGPT', color: '#7c3aed' },
                  { name: 'Émeraude Pro', color: '#059669' },
                  { name: 'Ambre Doré', color: '#d97706' },
                  { name: 'Rose Élégant', color: '#e11d48' },
                ].map((item) => (
                  <button
                    key={item.color}
                    onClick={() => changeAccentColor(item.color)}
                    className={`w-3.5 h-3.5 rounded-full border transition-all cursor-pointer ${
                      accentColor === item.color ? 'scale-125 ring-2 ring-white shadow-xs' : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: item.color }}
                    title={`Accent : ${item.name}`}
                  />
                ))}
              </div>

              {/* Dark Mode toggle button in status bar */}
              <button
                id="btn-status-darkmode"
                onClick={toggleDarkMode}
                className={`flex items-center space-x-1.5 px-2 py-0.5 rounded transition cursor-pointer text-[11px] font-medium ${
                  isDarkMode
                    ? 'bg-slate-800 hover:bg-slate-750 text-amber-300 border border-slate-700'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-xs'
                }`}
                title={isDarkMode ? "Basculer en Mode Clair" : "Basculer en Mode Sombre"}
              >
                {isDarkMode ? (
                  <>
                    <Sun className="w-3 h-3 text-amber-400" />
                    <span>Mode Clair</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3 h-3 text-slate-700" />
                    <span>Mode Sombre</span>
                  </>
                )}
              </button>

              <span className={isDarkMode ? 'text-slate-700' : 'text-gray-300'}>|</span>
              <span>Français (France)</span>
              <span className={isDarkMode ? 'text-slate-700' : 'text-gray-300'}>|</span>
              
              {/* Fullscreen status bar quick switch */}
              <button
                id="btn-status-fullscreen"
                onClick={toggleFullscreen}
                className={`flex items-center space-x-1 px-1.5 py-0.5 rounded transition cursor-pointer text-[11px] ${
                  isFullscreen ? 'bg-blue-600/20 text-blue-400 font-semibold' : isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-gray-200 text-slate-700'
                }`}
                title={isFullscreen ? "Quitter le plein écran (F11 ou Échap)" : "Plein écran sans distraction (F11)"}
              >
                {isFullscreen ? <Minimize2 className="w-3 h-3 text-blue-400" /> : <Maximize2 className="w-3 h-3 text-blue-400" />}
                <span>{isFullscreen ? 'Réduire' : 'Plein écran'}</span>
              </button>

              <span className={isDarkMode ? 'text-slate-700' : 'text-gray-300'}>|</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setZoom(Math.max(50, zoom - 10))}
                  className={`px-1.5 ${isDarkMode ? 'bg-slate-800 hover:bg-slate-750 text-slate-200' : 'bg-gray-200 hover:bg-gray-300'} rounded font-bold cursor-pointer transition select-none text-[10px]`}
                  title="Zoom arrière (Ctrl-)"
                >
                  -
                </button>
                <input
                  type="range"
                  min="50"
                  max="150"
                  step="5"
                  value={zoom}
                  onChange={(e) => setZoom(parseInt(e.target.value))}
                  className="w-16 h-1 bg-blue-600 rounded-lg appearance-none cursor-pointer"
                  title="Faire glisser pour zoomer"
                />
                <button
                  onClick={() => setZoom(Math.min(150, zoom + 10))}
                  className={`px-1.5 ${isDarkMode ? 'bg-slate-800 hover:bg-slate-750 text-slate-200' : 'bg-gray-200 hover:bg-gray-300'} rounded font-bold cursor-pointer transition select-none text-[10px]`}
                  title="Zoom avant (Ctrl+)"
                >
                  +
                </button>
                <span
                  className="font-mono font-medium hover:underline cursor-pointer min-w-[36px] text-right"
                  onDoubleClick={() => setZoom(100)}
                  title="Double-cliquez pour restaurer à 100%"
                >
                  {zoom}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================= */}
      {/* 8. FILE MENU FULL OVERLAY (Fichier Tab) */}
      {/* ======================================= */}
      {isFileMenuOpen && activeDoc && (
        <FileMenu
          document={activeDoc}
          onClose={() => setIsFileMenuOpen(false)}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
          onGoToTemplates={() => {
            setIsFileMenuOpen(false);
            setIsTemplateChooser(true);
          }}
          onSave={handleSaveActiveDoc}
          onExportDocx={handleExportDocxFile}
          onExportPdf={handleExportPdfFile}
          wordCount={wordCount}
          recentDocs={recentDocs}
          onLoadDocument={(doc) => {
            handleOpenDoc(doc);
            setIsFileMenuOpen(false);
          }}
          onImportLocalFile={(e) => {
            handleImportLocalFile(e);
            setIsFileMenuOpen(false);
          }}
          onSaveAs={(newTitle) => {
            handleSaveAs(newTitle);
            setIsFileMenuOpen(false);
          }}
          onUpdateDocument={(updates) => {
            setActiveDoc((prev) => prev ? { ...prev, ...updates } : null);
          }}
          isDarkMode={isDarkMode}
        />
      )}

      {/* ======================================= */}
      {/* 9. MODALS BUILDERS */}
      {/* ======================================= */}
      {isTableModalOpen && (
        <div id="modal-table-overlay" className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-5 w-85 shadow-2xl border border-gray-300">
            <h3 className="text-sm font-bold text-gray-950 mb-3 flex items-center">
              <Table className="h-4 w-4 mr-1.5 text-[#2b579a]" /> Gestionnaire de Tableaux
            </h3>

            {/* Sub-tabs for Manual vs Dynamic automatic AI table */}
            <div className="flex border-b border-gray-200 mb-4 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setTableModalTab('manual')}
                className={`flex-1 pb-2 border-b-[3px] text-center transition-all cursor-pointer ${
                  tableModalTab === 'manual'
                    ? 'border-[#2b579a] text-[#2b579a]'
                    : 'border-transparent text-gray-400 hover:text-gray-700'
                }`}
              >
                Création Manuelle
              </button>
              <button
                type="button"
                onClick={() => setTableModalTab('auto')}
                className={`flex-1 pb-2 border-b-[3px] text-center transition-all cursor-pointer ${
                  tableModalTab === 'auto'
                    ? 'border-[#2b579a] text-[#2b579a]'
                    : 'border-transparent text-gray-400 hover:text-gray-700'
                }`}
              >
                Génération IA
              </button>
            </div>
            
            {tableModalTab === 'manual' ? (
              <div className="space-y-3.5 mb-5 text-xs text-gray-700">
                <p className="text-[11px] text-gray-500 mb-2">Configurez la taille du tableau vide à insérer à la position du curseur.</p>
                <div className="flex justify-between items-center">
                  <span>Nombre de colonnes :</span>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={tableCols}
                    onChange={(e) => setTableCols(parseInt(e.target.value) || 3)}
                    className="w-16 border rounded bg-white p-1 text-center font-semibold text-gray-800"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span>Nombre de lignes :</span>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={tableRows}
                    onChange={(e) => setTableRows(parseInt(e.target.value) || 3)}
                    className="w-16 border rounded bg-white p-1 text-center font-semibold text-gray-800"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3 mb-5 text-xs">
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  L'intelligence artificielle <strong>ManixGPT</strong> va concevoir un tableau complet structuré, rempli de vraies données sur la thématique de votre choix.
                </p>
                <textarea
                  value={aiTablePrompt}
                  onChange={(e) => setAiTablePrompt(e.target.value)}
                  placeholder="Décrivez votre besoin (ex: Tableau de bord financier trimestriel, Comparatif de prix d'abonnements cloud, Recettes de cuisine avec temps de cuisson...)"
                  className="w-full text-xs border rounded bg-white p-2 h-24 outline-none focus:border-[#2b579a] resize-none leading-relaxed text-gray-800"
                  disabled={isGeneratingTable}
                />
              </div>
            )}

            <div className="flex justify-end space-x-2 text-xs">
              <button 
                type="button"
                onClick={() => setIsTableModalOpen(false)} 
                className="px-3.5 py-1.5 border hover:bg-gray-50 rounded text-gray-600 font-medium"
                disabled={isGeneratingTable}
              >
                Annuler
              </button>
              
              {tableModalTab === 'manual' ? (
                <button 
                  type="button"
                  onClick={handleInsertTableConfirm} 
                  className="px-3.5 py-1.5 bg-[#2b579a] hover:bg-blue-800 text-white font-semibold rounded shadow-sm transition"
                >
                  Créer le Tableau
                </button>
              ) : (
                <button 
                  type="button"
                  onClick={handleInsertTableAuto} 
                  className={`px-3.5 py-1.5 font-semibold rounded shadow-sm transition flex items-center ${
                    isGeneratingTable ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-[#2b579a] hover:bg-blue-800 text-white'
                  }`}
                  disabled={isGeneratingTable}
                >
                  {isGeneratingTable ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-t-transparent border-white rounded-full animate-spin mr-1.5"></span>
                      Génération...
                    </>
                  ) : "Générer avec ManixGPT"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {isImageModalOpen && (
        <div id="modal-image-overlay" className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96 shadow-2xl border border-gray-300 animate-slide-up">
            <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center">
              <ImageIcon className="h-4 w-4 mr-1.5 text-[#2b579a]" /> Insérer une image dans la feuille
            </h3>
            
            <p className="text-xs text-gray-500 mb-3Leading-relaxed">
              Collez l'URL d'une illustration pour l'ajouter directement ou laissez vide pour charger l'illustration par défaut (Office Mockup).
            </p>

            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full text-xs border rounded bg-white p-2 mb-5 outline-none focus:border-[#2b579a]"
            />

            <div className="flex justify-end space-x-2 text-xs">
              <button onClick={() => setIsImageModalOpen(false)} className="px-3 py-1.5 border hover:bg-gray-50 rounded">Annuler</button>
              <button onClick={handleInsertImageConfirm} className="px-3 py-1.5 bg-[#2b579a] hover:bg-blue-800 text-white font-semibold rounded shadow-sm">Insérer</button>
            </div>
          </div>
        </div>
      )}

      {/* Universal Search Command Palette (Ctrl+K / Cmd+K) */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        isDarkMode={isDarkMode}
        accentColor={accentColor}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTemplate={(template) => {
          handleSelectTemplate(template);
          setIsTemplateChooser(false);
        }}
        onOpenDoc={(doc) => {
          handleOpenDoc(doc);
          setIsTemplateChooser(false);
        }}
        onExecuteAiAction={(command) => {
          if (activeDoc) {
            handleInlinePromptAction(activeDoc.content.replace(/<[^>]*>/g, '').slice(0, 300), 'custom', command);
          }
        }}
        onTriggerRibbonAction={(actionId) => {
          if (actionId === 'new_doc') setIsTemplateChooser(true);
          else if (actionId === 'save') handleSaveActiveDoc();
          else if (actionId === 'export_pdf') handleExportPdfFile();
          else if (actionId === 'export_docx') handleExportDocxFile();
          else if (actionId === 'dark_mode') toggleDarkMode();
          else if (actionId === 'toggle_fullscreen') toggleFullscreen();
          else if (actionId === 'open_grammar') {
            setIsGrammarPanelOpen(true);
            if (activeDoc) triggerGrammarCheck(activeDoc.content);
          }
        }}
        recentDocs={recentDocs}
      />

      {/* Diff Preview Modal (Additions green / Deletions red) */}
      {diffPreviewData && (
        <DiffPreviewModal
          isOpen={diffPreviewData.isOpen}
          originalText={diffPreviewData.originalText}
          proposedText={diffPreviewData.proposedText}
          promptUsed={diffPreviewData.promptUsed}
          isDarkMode={isDarkMode}
          accentColor={accentColor}
          onAccept={handleAcceptDiff}
          onReject={() => setDiffPreviewData(null)}
        />
      )}

      {/* Generation Progress Overlay */}
      <GenerationProgressOverlay
        isVisible={genProgress.isVisible}
        promptTitle={genProgress.promptTitle}
        currentStep={genProgress.currentStep}
        isDarkMode={isDarkMode}
        accentColor={accentColor}
      />

      {/* 1. Voice Dictation Modal */}
      <VoiceDictationModal
        isOpen={isVoiceDictationOpen}
        isDarkMode={isDarkMode}
        accentColor={accentColor}
        onClose={() => setIsVoiceDictationOpen(false)}
        onInsertText={(formattedText) => {
          if (activeDoc) {
            setActiveDoc({
              ...activeDoc,
              content: activeDoc.content + formattedText,
            });
          }
        }}
      />

      {/* 2. Multimodal OCR Scan Modal */}
      <MultimodalOcrModal
        isOpen={isMultimodalOcrOpen}
        isDarkMode={isDarkMode}
        accentColor={accentColor}
        onClose={() => setIsMultimodalOcrOpen(false)}
        onInsertDocumentHtml={(htmlContent) => {
          if (activeDoc) {
            setActiveDoc({
              ...activeDoc,
              content: activeDoc.content + '<br/>' + htmlContent,
            });
          }
        }}
      />

      {/* 3. RAG Multi-Document Search Modal */}
      <RagSearchModal
        isOpen={isRagSearchOpen}
        isDarkMode={isDarkMode}
        accentColor={accentColor}
        onClose={() => setIsRagSearchOpen(false)}
        recentDocs={recentDocs}
        activeDoc={activeDoc}
        onInsertSynthesis={(htmlText) => {
          if (activeDoc) {
            setActiveDoc({
              ...activeDoc,
              content: activeDoc.content + '<br/>' + htmlText,
            });
          }
        }}
      />

      {/* 4. Autonomous ReAct Document Agent Modal */}
      <AutonomousAgentModal
        isOpen={isAutonomousAgentOpen}
        isDarkMode={isDarkMode}
        accentColor={accentColor}
        onClose={() => setIsAutonomousAgentOpen(false)}
        activeDoc={activeDoc}
        onApplyAgentDocumentChange={(newContentHtml) => {
          if (activeDoc) {
            setActiveDoc({
              ...activeDoc,
              content: newContentHtml,
            });
          }
        }}
      />

      {/* 5. Document Structure NLP & Flesch Score Modal */}
      <DocumentStructureModal
        isOpen={isDocumentStructureOpen}
        isDarkMode={isDarkMode}
        accentColor={accentColor}
        onClose={() => setIsDocumentStructureOpen(false)}
        activeDoc={activeDoc}
        onUpdateContentHtml={(newContentHtml) => {
          if (activeDoc) {
            setActiveDoc({
              ...activeDoc,
              content: newContentHtml,
            });
          }
        }}
      />

    </div>
    </>
  );
}
