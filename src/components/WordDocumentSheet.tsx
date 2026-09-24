import { useEffect, useRef, useState, RefObject, MouseEvent as ReactMouseEvent } from 'react';
import { BookOpen, Sparkles, Scissors, Copy, Clipboard, CheckSquare, Check, AlertTriangle, SpellCheck, Image as ImageIcon, Table as TableIcon, Plus, Minus, RotateCw, AlignLeft, AlignCenter, AlignRight, ChevronUp, ChevronDown, Trash2, Edit3, Palette } from 'lucide-react';
import { DocumentStyle, CoEditor, GrammarIssue } from '../types';
import InlinePromptToolbar from './InlinePromptToolbar';

interface WordDocumentSheetProps {
  content: string;
  onContentChange: (html: string) => void;
  style: DocumentStyle;
  watermark: string;
  gridVisible: boolean;
  rulerVisible: boolean;
  collabActive: boolean;
  editableRef: RefObject<HTMLDivElement | null>;
  zoom: number;
  isReadOnly?: boolean;
  isDarkMode?: boolean;
  accentColor?: string;
  onOpenSynonyms?: (word: string, contextSentence?: string) => void;
  onOpenGrammarPanel?: () => void;
  grammarIssues?: GrammarIssue[];
  onFixGrammarIssue?: (issue: GrammarIssue) => void;
  onOpenAiAssistant?: () => void;
  onInlinePromptAction?: (selectedText: string, actionType: string, customPrompt?: string) => void;
}

// Quick French instant spell-check dictionary for on-the-fly right-click suggestions and red underlines
const QUICK_SPELL_DICT: Record<string, string> = {
  'acceuil': 'accueil',
  'acceuillir': 'accueillir',
  'aparament': 'apparemment',
  'aparamment': 'apparemment',
  'bientot': 'bientôt',
  'connexion': 'connexion',
  'developper': 'développer',
  'developpement': 'développement',
  'deja': 'déjà',
  'daccord': "d'accord",
  'evenement': 'événement',
  'existance': 'existence',
  'facon': 'façon',
  'francais': 'français',
  'langague': 'langage',
  'letre': 'lettre',
  'lettre de motivation': 'lettre de motivation',
  'maintenent': 'maintenant',
  'meme': 'même',
  'orthografe': 'orthographe',
  'orthographe': 'orthographe',
  'parfoit': 'parfois',
  'peut etre': 'peut-être',
  'peut-etre': 'peut-être',
  'plupart': 'plupart',
  'professionel': 'professionnel',
  'professionelle': 'professionnelle',
  'rapport de stage': 'rapport de stage',
  'recommandation': 'recommandation',
  'reussir': 'réussir',
  'societé': 'société',
  'societe': 'société',
  'stage': 'stage',
  'toujour': 'toujours',
  'tres': 'très',
  'travailer': 'travailler',
  'detre': "d'être",
  'davoir': "d'avoir",
  'cest': "c'est",
  'quil': "qu'il",
  'quils': "qu'ils",
  'quon': "qu'on",
  'dune': "d'une",
  'dun': "d'un",
  'quun': "qu'un",
  'quune': "qu'une",
  'parceque': 'parce que',
  'jusqua': "jusqu'à",
  'aujourdhui': "aujourd'hui",
  'dorthographe': "d'orthographe",
  'lia': "l'IA",
  'loption': "l'option",
  'nimporte': "n'importe",
  'interet': 'intérêt',
  'cout': 'coût',
  'systeme': 'système',
  'modele': 'modèle',
  'modeles': 'modèles',
  'creer': 'créer',
  'idee': 'idée',
  'comencer': 'commencer',
  'probleme': 'problème',
  'problemes': 'problèmes',
  'differant': 'différent',
  'differents': 'différents',
  'activite': 'activité',
  'activites': 'activités',
  'qualite': 'qualité',
  'securite': 'sécurité',
  'strategie': 'stratégie',
  'priorite': 'priorité',
  'resultat': 'résultat',
  'resultats': 'résultats',
  'realiser': 'réaliser',
  'realise': 'réalisé',
  'presenter': 'présenter',
  'presente': 'présenté',
  'rediger': 'rédiger',
  'redige': 'rédigé',
  'definir': 'définir',
  'defini': 'défini',
  'reunion': 'réunion',
  'reunions': 'réunions',
  'decision': 'décision',
  'decisions': 'décisions',
  'equipe': 'équipe',
  'equipes': 'équipes',
  'etape': 'étape',
  'etapes': 'étapes',
  'periode': 'période',
  'general': 'général',
  'generale': 'générale',
  'special': 'spécial',
  'speciale': 'spéciale',
  'specifique': 'spécifique',
  'specifiques': 'spécifiques',
  'technique': 'technique',
  'numerique': 'numérique',
  'numeriques': 'numériques',
  'electronique': 'électronique',
  'donnees': 'données',
  'acces': 'accès',
  'succes': 'succès',
  'progres': 'progrès',
  'apres': 'après',
  'pres': 'près',
  'voila': 'voilà',
  'ca': 'ça',
  'cour': 'cours',
  'existents': 'existants',
  'existent': 'existant',
};

export default function WordDocumentSheet({
  content,
  onContentChange,
  style,
  watermark,
  gridVisible,
  rulerVisible,
  collabActive,
  editableRef,
  zoom,
  isReadOnly = false,
  isDarkMode = false,
  accentColor = '#1d4ed8',
  onOpenSynonyms,
  onOpenGrammarPanel,
  grammarIssues = [],
  onFixGrammarIssue,
  onOpenAiAssistant,
  onInlinePromptAction,
}: WordDocumentSheetProps) {
  // Floating Inline Prompt Selected Text State
  const [selectedTextForInline, setSelectedTextForInline] = useState('');
  // Spelling-only underline squiggles state
  const [spellingSquiggles, setSpellingSquiggles] = useState<Array<{
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    word: string;
    correction: string;
  }>>([]);
  const squiggleDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Setup fake co-editors cursors
  const [coEditors, setCoEditors] = useState<CoEditor[]>([
    { id: '1', name: 'Marie L. (IA Tech)', color: '#e64980', avatar: 'ML', cursorPosition: { line: 120, ch: 150 }, status: 'writing' },
    { id: '2', name: 'Jean Dupont', color: '#12b886', avatar: 'JD', cursorPosition: { line: 420, ch: 300 }, status: 'idle' },
  ]);

  // Mini floating toolbar for text selections (Word-style auto formatting)
  const [miniToolbarPos, setMiniToolbarPos] = useState<{ x: number; y: number } | null>(null);

  // Right-click context menu (Word style)
  const [contextMenuPos, setContextMenuPos] = useState<{
    x: number;
    y: number;
    selectedText: string;
    contextSentence: string;
  } | null>(null);

  // States for Image and Table interactive overlay
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const [elementOverlayPos, setElementOverlayPos] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
    type: 'img' | 'table';
  } | null>(null);

  const recalculateOverlay = () => {
    if (!selectedElement) {
      setElementOverlayPos(null);
      return;
    }
    const canvasEl = document.getElementById('word-paper-sheet');
    if (!canvasEl) return;
    
    try {
      const rect = selectedElement.getBoundingClientRect();
      const canvasRect = canvasEl.getBoundingClientRect();
      const scale = zoom / 100;
      
      setElementOverlayPos({
        left: (rect.left - canvasRect.left) / scale,
        top: (rect.top - canvasRect.top) / scale,
        width: rect.width / scale,
        height: rect.height / scale,
        type: selectedElement.tagName.toLowerCase() === 'img' ? 'img' : 'table'
      });
    } catch (e) {
      // Ignored
    }
  };

  // Run recalculate whenever content, zoom, style or orientation changes
  useEffect(() => {
    if (selectedElement) {
      const timeout = setTimeout(recalculateOverlay, 80);
      return () => clearTimeout(timeout);
    }
  }, [selectedElement, content, zoom, style.orientation, style.margin]);

  // Compute Word-style red wavy underline positions for SPELLING ERRORS ONLY
  const calculateSpellingSquiggles = () => {
    if (!editableRef.current) return;
    const sheetEl = document.getElementById('word-paper-sheet');
    if (!sheetEl) return;

    // Collect ALL spelling-only errors (ONLY type === 'orthographe' or typos, NEVER grammaire or accord)
    const spellingErrorsMap = new Map<string, string>();

    // 1. From grammarIssues: strictly ONLY 'orthographe'
    if (grammarIssues && grammarIssues.length > 0) {
      grammarIssues.forEach((issue) => {
        if (issue.type === 'orthographe' && issue.original && issue.replacement) {
          spellingErrorsMap.set(issue.original.toLowerCase(), issue.replacement);
        }
      });
    }

    // 2. From local French dictionary
    const plainText = editableRef.current.innerText || '';
    if (plainText) {
      const words = plainText.toLowerCase().match(/[\wÀ-ÿ'-]+/g) || [];
      const checked = new Set<string>();
      for (const w of words) {
        if (checked.has(w)) continue;
        checked.add(w);
        if (QUICK_SPELL_DICT[w] && !spellingErrorsMap.has(w)) {
          spellingErrorsMap.set(w, QUICK_SPELL_DICT[w]);
        }
      }
    }

    if (spellingErrorsMap.size === 0) {
      setSpellingSquiggles([]);
      return;
    }

    const sheetRect = sheetEl.getBoundingClientRect();
    const scale = (zoom || 100) / 100;
    const squiggles: Array<{
      id: string;
      x: number;
      y: number;
      width: number;
      height: number;
      word: string;
      correction: string;
    }> = [];

    const walker = document.createTreeWalker(editableRef.current, NodeFilter.SHOW_TEXT);
    let currentNode = walker.nextNode();

    while (currentNode) {
      const text = currentNode.textContent || '';
      for (const [errWord, correction] of spellingErrorsMap.entries()) {
        const escaped = errWord.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
        let match: RegExpExecArray | null;
        while ((match = regex.exec(text)) !== null) {
          try {
            const range = document.createRange();
            range.setStart(currentNode, match.index);
            range.setEnd(currentNode, match.index + match[0].length);
            const rects = range.getClientRects();
            for (let i = 0; i < rects.length; i++) {
              const r = rects[i];
              if (r.width > 2 && r.height > 2) {
                squiggles.push({
                  id: `${match.index}-${i}-${match[0]}`,
                  x: (r.left - sheetRect.left) / scale,
                  y: (r.bottom - sheetRect.top) / scale - 2,
                  width: r.width / scale,
                  height: 3,
                  word: match[0],
                  correction: correction,
                });
              }
            }
          } catch (e) {
            // Ignore boundary transitions
          }
        }
      }
      currentNode = walker.nextNode();
    }

    setSpellingSquiggles(squiggles);
  };

  useEffect(() => {
    calculateSpellingSquiggles();
    const handleResize = () => calculateSpellingSquiggles();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [content, grammarIssues, zoom]);

  // Handle document click to select tables or images for WYSIWYG editing
  useEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      // Ignore click inside element-control-overlay to avoid losing selection
      if (target.closest('.element-control-overlay')) {
        return;
      }

      const img = target.closest('img');
      const table = target.closest('table');
      const contentComp = document.getElementById('word-content-area');

      if (contentComp && contentComp.contains(target)) {
        if (img) {
          setSelectedElement(img);
        } else if (table) {
          setSelectedElement(table);
        } else {
          setSelectedElement(null);
          setElementOverlayPos(null);
        }
      } else {
        const paperSheet = document.getElementById('word-paper-sheet');
        if (paperSheet && !paperSheet.contains(target)) {
          setSelectedElement(null);
          setElementOverlayPos(null);
        }
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [zoom]);

  const handleSelectionCheck = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
      setMiniToolbarPos(null);
      setSelectedTextForInline('');
      return;
    }

    const text = selection.toString().trim();
    const range = selection.getRangeAt(0);
    const contentArea = document.getElementById('word-content-area');
    
    if (contentArea && contentArea.contains(range.commonAncestorContainer) && text.length > 0) {
      const rect = range.getBoundingClientRect();
      setMiniToolbarPos({
        x: rect.left + rect.width / 2,
        y: rect.top - 12,
      });
      setSelectedTextForInline(text);
    } else {
      setMiniToolbarPos(null);
      setSelectedTextForInline('');
    }
  };

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionCheck);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionCheck);
    };
  }, []);

  // Handle right-click context menu & Shift+F7 shortcut
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#word-context-menu')) {
        setContextMenuPos(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === 'F7') {
        e.preventDefault();
        const selection = window.getSelection();
        const text = selection ? selection.toString().trim() : '';
        if (onOpenSynonyms) {
          onOpenSynonyms(text || '');
        }
      }
      if (e.key === 'Escape') {
        setContextMenuPos(null);
      }
    };

    document.addEventListener('click', handleGlobalClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleGlobalClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onOpenSynonyms]);

  const handleContextMenu = (e: ReactMouseEvent) => {
    const target = e.target as HTMLElement;
    const contentArea = document.getElementById('word-content-area');
    if (!contentArea || !contentArea.contains(target)) {
      return;
    }

    e.preventDefault();
    const selection = window.getSelection();
    let text = selection ? selection.toString().trim() : '';

    // Check if clicked directly on or near any spelling squiggle
    const sheetEl = document.getElementById('word-paper-sheet');
    let squiggleUnderCursor: { id: string; x: number; y: number; width: number; height: number; word: string; correction: string; } | null = null;
    if (sheetEl) {
      const sheetRect = sheetEl.getBoundingClientRect();
      const scale = (zoom || 100) / 100;
      const clickX = (e.clientX - sheetRect.left) / scale;
      const clickY = (e.clientY - sheetRect.top) / scale;
      squiggleUnderCursor = spellingSquiggles.find((sq) =>
        clickX >= sq.x - 6 && clickX <= sq.x + sq.width + 6 &&
        clickY >= sq.y - 18 && clickY <= sq.y + 12
      ) || null;
    }

    if (!text && squiggleUnderCursor) {
      text = squiggleUnderCursor.word;
    }

    // If no text selected and not on squiggle, try to get word under cursor
    if (!text && (document as any).caretRangeFromPoint) {
      const range = (document as any).caretRangeFromPoint(e.clientX, e.clientY);
      if (range && range.startContainer && range.startContainer.nodeType === Node.TEXT_NODE) {
        const full = range.startContainer.textContent || '';
        const offset = range.startOffset;
        const leftMatch = full.slice(0, offset).match(/[\wÀ-ÿ'-]+$/);
        const rightMatch = full.slice(offset).match(/^[\wÀ-ÿ'-]+/);
        const leftPart = leftMatch ? leftMatch[0] : '';
        const rightPart = rightMatch ? rightMatch[0] : '';
        text = (leftPart + rightPart).trim();
      }
    } else if (!text && (document as any).caretPositionFromPoint) {
      const pos = (document as any).caretPositionFromPoint(e.clientX, e.clientY);
      if (pos && pos.offsetNode && pos.offsetNode.nodeType === Node.TEXT_NODE) {
        const full = pos.offsetNode.textContent || '';
        const offset = pos.offset;
        const leftMatch = full.slice(0, offset).match(/[\wÀ-ÿ'-]+$/);
        const rightMatch = full.slice(offset).match(/^[\wÀ-ÿ'-]+/);
        const leftPart = leftMatch ? leftMatch[0] : '';
        const rightPart = rightMatch ? rightMatch[0] : '';
        text = (leftPart + rightPart).trim();
      }
    }

    setContextMenuPos({
      x: Math.min(e.clientX, window.innerWidth - 270),
      y: Math.min(e.clientY, window.innerHeight - 350),
      selectedText: text,
      contextSentence: text ? `... ${text} ...` : '',
    });
  };

  // Simulate movement and typing of co-editors when collaboration is enabled
  useEffect(() => {
    if (!collabActive) return;

    const interval = setInterval(() => {
      setCoEditors((prev) =>
        prev.map((editor) => {
          // Add some jitter to fake movements
          const randomX = Math.max(50, Math.min(760, (editor.cursorPosition?.line || 100) + (Math.random() * 40 - 20)));
          const randomY = Math.max(100, Math.min(950, (editor.cursorPosition?.ch || 200) + (Math.random() * 30 - 15)));
          
          return {
            ...editor,
            cursorPosition: { line: randomX, ch: randomY },
            status: Math.random() > 0.6 ? 'writing' : 'idle',
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [collabActive]);

  // Sync content with contentEditable raw text
  const lastContentRef = useRef(content);
  const repaginateTimeoutRef = useRef<any>(null);

  const handleAutoRepaginate = (el: HTMLDivElement) => {
    if (!el) return;

    // Save caret position safely before any HTML modifications
    const selection = window.getSelection();
    let savedRange: Range | null = null;
    let startNode: Node | null = null;
    let startOffset = 0;

    if (selection && selection.rangeCount > 0) {
      try {
        const range = selection.getRangeAt(0);
        savedRange = range.cloneRange();
        startNode = range.startContainer;
        startOffset = range.startOffset;
      } catch (err) {
        // Safe ignore
      }
    }

    // 1. Remove all old page break elements to run raw calculation
    const childNodes = Array.from(el.childNodes);
    childNodes.forEach((node: any) => {
      if (node && node.nodeType === Node.ELEMENT_NODE) {
        if (node.classList?.contains('word-page-break') || node.getAttribute?.('data-page-break') === 'true') {
          node.parentNode?.removeChild(node);
        }
      }
    });

    // 2. Loop children & group in A4 sizes (height threshold of standard sheet printable area approx. 880px)
    const elements = Array.from(el.children) as HTMLElement[];
    let currentHeightSum = 0;
    const maxPageHeight = 880;

    elements.forEach((child) => {
      // Skip inline/absolute collaborative cursors or active guides
      if (child.classList?.contains('word-page-break') || child.id?.startsWith('collab-cursor-')) return;

      const rect = child.getBoundingClientRect();
      let childH = child.offsetHeight || rect.height;
      if (childH <= 0) {
        childH = 22; // default fallback block line spacing
      }

      currentHeightSum += childH;

      if (currentHeightSum > maxPageHeight) {
        const pageBreak = document.createElement('div');
        pageBreak.className = 'word-page-break';
        pageBreak.setAttribute('data-page-break', 'true');
        pageBreak.setAttribute('contenteditable', 'false');

        el.insertBefore(pageBreak, child);
        currentHeightSum = childH; // reset with current element's height carried over to the new page
      }
    });

    // 3. Restore selection range safely
    if (selection && savedRange && startNode) {
      try {
        selection.removeAllRanges();
        const newRange = document.createRange();
        newRange.setStart(startNode, startOffset);
        newRange.collapse(true);
        selection.addRange(newRange);
      } catch (err) {
        // Safe ignore
      }
    }

    // Save state update
    const repaginatedHtml = el.innerHTML;
    if (lastContentRef.current !== repaginatedHtml) {
      lastContentRef.current = repaginatedHtml;
      onContentChange(repaginatedHtml);
    }
  };

  const triggerRepaginateDebounced = (el: HTMLDivElement) => {
    if (repaginateTimeoutRef.current) {
      clearTimeout(repaginateTimeoutRef.current);
    }
    repaginateTimeoutRef.current = setTimeout(() => {
      handleAutoRepaginate(el);
    }, 450);
  };

  // Run repagination if style or external changes happen
  useEffect(() => {
    if (editableRef.current && content !== lastContentRef.current) {
      editableRef.current.innerHTML = content;
      lastContentRef.current = content;
      // Triggers immediate formatting to split document pages beautifully on loads
      handleAutoRepaginate(editableRef.current);
    }
  }, [content, style.margin, style.orientation]);

  useEffect(() => {
    return () => {
      if (repaginateTimeoutRef.current) {
        clearTimeout(repaginateTimeoutRef.current);
      }
    };
  }, []);

  // Margins padding classes mapping
  const marginClasses = {
    normal: 'p-16',
    narrow: 'p-6',
    moderate: 'p-10',
    wide: 'p-20',
  };

  const selectedFontFamily =
    style.fontFamily === 'Calibri'
      ? 'font-sans'
      : style.fontFamily === 'Times New Roman'
      ? 'serif'
      : style.fontFamily === 'Georgia'
      ? 'serif font-serif'
      : style.fontFamily === 'Courier New'
      ? 'font-mono'
      : 'font-sans';

  return (
    <div 
      className={`flex-1 flex ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-800'} overflow-auto select-none relative justify-center`} 
      style={{ minHeight: 'calc(100vh - 12rem)' }}
      onContextMenu={handleContextMenu}
    >
      {/* LEFT RULER MAPS FOR HEIGHT (Image 2 & 9 style) */}
      {rulerVisible && (
        <div id="vertical-ruler" className={`w-6 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-500' : 'bg-white border-slate-200 text-slate-400'} border-r flex flex-col pt-8 text-[8px] select-none flex-shrink-0 h-full`}>
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className={`h-12 ${isDarkMode ? 'border-slate-800/60' : 'border-slate-100'} border-b flex flex-col justify-end pr-1 text-right`}>
              {i % 2 === 0 && <span>{i}</span>}
            </div>
          ))}
        </div>
      )}

      {/* CENTER DESK SPACE RENDER */}
      <div className="flex-1 flex flex-col items-center justify-start p-6 relative overflow-auto">
        
        {/* TOP HORIZONTAL RULER MAPS */}
        {rulerVisible && (
          <div 
            id="horizontal-ruler" 
            style={{
              width: style.orientation === 'portrait' ? `${816 * (zoom / 100)}px` : `${1056 * (zoom / 100)}px`,
            }}
            className={`h-6 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-500' : 'bg-white border-slate-200 text-slate-400'} border shadow-2xs flex items-end text-[8px] select-none mb-3 flex-shrink-0 relative rounded-t-xs`}
          >
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className={`flex-1 ${isDarkMode ? 'border-slate-800' : 'border-slate-150'} border-r h-3 flex flex-col justify-end pl-0.5 first:border-l`}>
                {i % 2 === 0 && <span>{i}</span>}
              </div>
            ))}
          </div>
        )}

        {/* PAPER CONTAINER SHEET WRAPPER FOR ZOOM SCALING */}
        <div 
          className="flex-shrink-0 transition-all duration-150 origin-top flex items-center justify-center mx-auto"
          style={{
            width: style.orientation === 'portrait' ? `${816 * (zoom / 100)}px` : `${1056 * (zoom / 100)}px`,
            minHeight: style.orientation === 'portrait' ? `${1056 * (zoom / 100)}px` : `${816 * (zoom / 100)}px`,
            height: 'auto',
            position: 'relative'
          }}
        >
          <div
            id="word-paper-sheet"
            className="relative transition duration-300 flex-shrink-0 origin-top shadow-xl"
            style={{
              width: style.orientation === 'portrait' ? '816px' : '1056px',
              minHeight: style.orientation === 'portrait' ? '1056px' : '816px',
              height: 'auto',
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center',
            }}
          >
            {/* Visual Dotted Margin Boundary Guide (Unexceeded margins) */}
            <div 
              className="absolute pointer-events-none z-10 border border-dotted border-blue-400/25 rounded"
              style={{
                top: style.margin === 'normal' ? '64px' : style.margin === 'narrow' ? '24px' : style.margin === 'moderate' ? '40px' : '80px',
                bottom: style.margin === 'normal' ? '64px' : style.margin === 'narrow' ? '24px' : style.margin === 'moderate' ? '40px' : '80px',
                left: style.margin === 'normal' ? '64px' : style.margin === 'narrow' ? '24px' : style.margin === 'moderate' ? '40px' : '80px',
                right: style.margin === 'normal' ? '64px' : style.margin === 'narrow' ? '24px' : style.margin === 'moderate' ? '40px' : '80px',
              }}
            />
            {/* Blueprint Quadrillage Overlay for perfect Alignment guides */}
            {gridVisible && (
              <div
                id="blueprint-grid"
                className="absolute inset-0 z-1 pointer-events-none opacity-40 bg-repeat bg-center"
                style={{
                  backgroundImage: 'radial-gradient(#94a3b8 1.2px, transparent 1.2px)',
                  backgroundSize: '20px 20px',
                  backgroundPosition: 'center center',
                }}
              ></div>
            )}

            {/* Watermark Diagonal text backdrop */}
            {watermark && (
              <div
                id="diag-watermark"
                className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none select-none uppercase text-gray-100 font-bold opacity-30 select-none text-8xl rotate-[-30deg] tracking-wider"
                style={{ fontSize: '7rem' }}
              >
                {watermark}
              </div>
            )}

            {/* COLLABORATIVE FLOATING CURSORS DECORATORS */}
            {collabActive &&
              coEditors.map((cursor) => (
                <div
                  id={`collab-cursor-${cursor.id}`}
                  key={cursor.id}
                  className="absolute z-10 pointer-events-none transition-all duration-[2000ms] ease-out"
                  style={{
                    left: `${cursor.cursorPosition?.line || 150}px`,
                    top: `${cursor.cursorPosition?.ch || 250}px`,
                  }}
                >
                  {/* Fake Blink Selector flag */}
                  <div className="w-0.5 h-5 animate-pulse" style={{ backgroundColor: cursor.color }} />
                  
                  {/* Username label card */}
                  <div
                    className="rounded px-1.5 py-0.5 text-[8px] font-semibold text-white truncate shadow-sm absolute left-1 top-4 whitespace-nowrap flex items-center gap-1"
                    style={{ backgroundColor: cursor.color }}
                  >
                    <span>{cursor.name}</span>
                    {cursor.status === 'writing' && <Edit3 className="w-2 h-2 inline" />}
                  </div>
                </div>
              ))}

            {/* Actual Rich Editable canvas A4 Block */}
            <div
              id="word-content-area"
              ref={editableRef}
              contentEditable={!isReadOnly}
              onInput={(e) => {
                const target = e.currentTarget;
                const html = target.innerHTML;
                if (lastContentRef.current !== html) {
                  lastContentRef.current = html;
                  onContentChange(html);
                }
                triggerRepaginateDebounced(target);
                if (squiggleDebounceRef.current) {
                  clearTimeout(squiggleDebounceRef.current);
                }
                squiggleDebounceRef.current = setTimeout(() => {
                  calculateSpellingSquiggles();
                }, 120);
              }}
              className={`w-full h-full bg-white shadow-xl relative z-2 border border-gray-300 outline-none select-text ${selectedFontFamily} ${
                marginClasses[style.margin]
              }`}
              style={{
                fontSize: `${style.fontSize}pt`,
                lineHeight: style.lineSpacing,
                color: style.textColor,
                backgroundColor: style.backgroundColor,
                minHeight: style.orientation === 'portrait' ? '1056px' : '816px',
              }}
            />

            {/* Microsoft Word Authentic Red Wavy Underline for Spelling Errors ONLY */}
            <svg 
              id="word-spelling-squiggles-svg" 
              className="absolute inset-0 pointer-events-none z-10 w-full h-full overflow-visible"
            >
              <defs>
                <pattern id="wordRedSquiggle" width="4" height="3" patternUnits="userSpaceOnUse">
                  <path d="M 0,2.5 Q 1,0.5 2,2.5 T 4,2.5" fill="none" stroke="#ef4444" strokeWidth="1.2" strokeLinecap="round" />
                </pattern>
              </defs>
              {spellingSquiggles.map((sq, idx) => (
                <rect
                  key={`${sq.id}-${idx}`}
                  x={sq.x}
                  y={sq.y}
                  width={sq.width}
                  height={3}
                  fill="url(#wordRedSquiggle)"
                />
              ))}
            </svg>

            {/* INTERACTIVE IMAGE AND TABLE OVERLAY CONTAINER */}
            {selectedElement && elementOverlayPos && (
              <div 
                className="absolute border-2 border-blue-500 bg-blue-500/5 pointer-events-none z-30 element-control-overlay"
                style={{
                  left: `${elementOverlayPos.left - 2}px`,
                  top: `${elementOverlayPos.top - 2}px`,
                  width: `${elementOverlayPos.width + 4}px`,
                  height: `${elementOverlayPos.height + 4}px`,
                  transition: 'all 0.1s ease',
                }}
              >
                {/* Visual Resizing Handles at corners */}
                <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-sm" />
                <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-sm" />
                <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-sm" />
                <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-blue-600 rounded-sm" />

                {/* Floating controls toolbar relative positioned */}
                <div 
                  className="absolute left-1/2 -top-12 -translate-x-1/2 bg-slate-900/95 text-white p-1 rounded-md shadow-2xl flex items-center space-x-1.5 text-xs font-sans pointer-events-auto select-none whitespace-nowrap z-50 border border-slate-700 hover:opacity-100 transition-opacity"
                  style={{ transform: 'translateX(-50%)' }}
                >
                  <span className="text-[10px] text-gray-300 font-bold px-1.5 py-0.5 uppercase bg-slate-800 rounded mr-0.5 flex items-center gap-1">
                    {elementOverlayPos.type === 'img' ? (
                      <>
                        <ImageIcon className="w-3 h-3 text-blue-400" />
                        <span>Image</span>
                      </>
                    ) : (
                      <>
                        <TableIcon className="w-3 h-3 text-emerald-400" />
                        <span>Tableau</span>
                      </>
                    )}
                  </span>

                  {elementOverlayPos.type === 'img' ? (
                    <>
                      {/* Resize operations */}
                      <button
                        onClick={() => {
                          const currentWidth = selectedElement.style.width || '80%';
                          let percent = parseInt(currentWidth) || 80;
                          percent = Math.min(100, Math.max(10, percent + 10));
                          (selectedElement as HTMLElement).style.width = `${percent}%`;
                          (selectedElement as HTMLElement).style.maxWidth = '100vw';
                          (selectedElement as HTMLElement).style.height = 'auto';
                          onContentChange(editableRef.current?.innerHTML || '');
                          setTimeout(recalculateOverlay, 10);
                        }}
                        className="hover:bg-slate-700 active:bg-slate-600 px-2 py-1 rounded text-[11px] flex items-center gap-1"
                        title="Agrandir l'image"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Agrandir</span>
                      </button>
                      <button
                        onClick={() => {
                          const currentWidth = selectedElement.style.width || '80%';
                          let percent = parseInt(currentWidth) || 80;
                          percent = Math.min(100, Math.max(10, percent - 10));
                          (selectedElement as HTMLElement).style.width = `${percent}%`;
                          (selectedElement as HTMLElement).style.maxWidth = '100vw';
                          (selectedElement as HTMLElement).style.height = 'auto';
                          onContentChange(editableRef.current?.innerHTML || '');
                          setTimeout(recalculateOverlay, 10);
                        }}
                        className="hover:bg-slate-700 active:bg-slate-600 px-2 py-1 rounded text-[11px] flex items-center gap-1"
                        title="Réduire l'image"
                      >
                        <Minus className="w-3 h-3" />
                        <span>Réduire</span>
                      </button>

                      {/* Alignments */}
                      <span className="text-slate-600 font-light">|</span>
                      <button
                        onClick={() => {
                          const p = selectedElement.parentElement;
                          if (p) {
                            p.style.textAlign = 'left';
                            onContentChange(editableRef.current?.innerHTML || '');
                            setTimeout(recalculateOverlay, 50);
                          }
                        }}
                        className="hover:bg-slate-700 p-1 rounded"
                        title="Aligner à gauche"
                      >
                        <AlignLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          const p = selectedElement.parentElement;
                          if (p) {
                            p.style.textAlign = 'center';
                            onContentChange(editableRef.current?.innerHTML || '');
                            setTimeout(recalculateOverlay, 50);
                          }
                        }}
                        className="hover:bg-slate-700 p-1 rounded"
                        title="Centrer"
                      >
                        <AlignCenter className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          const p = selectedElement.parentElement;
                          if (p) {
                            p.style.textAlign = 'right';
                            onContentChange(editableRef.current?.innerHTML || '');
                            setTimeout(recalculateOverlay, 50);
                          }
                        }}
                        className="hover:bg-slate-700 p-1 rounded"
                        title="Aligner à droite"
                      >
                        <AlignRight className="w-3.5 h-3.5" />
                      </button>

                      {/* Transform commands */}
                      <span className="text-slate-600 font-light">|</span>
                      <button
                        onClick={() => {
                          let rot = parseInt(selectedElement.getAttribute('data-rotation') || '0');
                          rot = (rot + 90) % 360;
                          selectedElement.setAttribute('data-rotation', rot.toString());
                          selectedElement.style.transform = `rotate(${rot}deg)`;
                          onContentChange(editableRef.current?.innerHTML || '');
                          setTimeout(recalculateOverlay, 100);
                        }}
                        className="hover:bg-slate-700 p-1 px-1.5 rounded text-[11px] flex items-center gap-1"
                        title="Pivoter de 90°"
                      >
                        <RotateCw className="w-3 h-3" />
                        <span>Pivoter</span>
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Table operations */}
                      <button
                        onClick={() => {
                          const table = selectedElement as HTMLTableElement;
                          const cellsCount = table.rows[0]?.cells.length || 3;
                          const newRow = table.insertRow(-1);
                          for (let i = 0; i < cellsCount; i++) {
                            const newCell = newRow.insertCell(i);
                            newCell.innerHTML = 'Nouveau texte';
                            newCell.setAttribute('style', 'border: 1px solid #cbd5e1; padding: 6px;');
                          }
                          onContentChange(editableRef.current?.innerHTML || '');
                          setTimeout(recalculateOverlay, 10);
                        }}
                        className="hover:bg-slate-700 px-1.5 py-0.5 rounded text-[11px] flex items-center gap-1"
                        title="Ajouter une ligne en bas"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Ligne</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          const table = selectedElement as HTMLTableElement;
                          for (let i = 0; i < table.rows.length; i++) {
                            const row = table.rows[i];
                            const isHeader = i === 0;
                            const cell = isHeader ? document.createElement('th') : document.createElement('td');
                            cell.innerHTML = isHeader ? 'Nouveau' : 'Saisie';
                            cell.setAttribute('style', 'border: 1px solid #cbd5e1; padding: 6px;');
                            row.appendChild(cell);
                          }
                          onContentChange(editableRef.current?.innerHTML || '');
                          setTimeout(recalculateOverlay, 10);
                        }}
                        className="hover:bg-slate-700 px-1.5 py-0.5 rounded text-[11px] flex items-center gap-1"
                        title="Ajouter une colonne à droite"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Col</span>
                      </button>

                      <button
                        onClick={() => {
                          const table = selectedElement as HTMLTableElement;
                          if (table.rows.length > 1) {
                            table.deleteRow(-1);
                            onContentChange(editableRef.current?.innerHTML || '');
                            setTimeout(recalculateOverlay, 10);
                          }
                        }}
                        className="hover:bg-slate-700 px-1.5 py-0.5 rounded text-[11px] text-orange-400 flex items-center gap-1"
                        title="Supprimer la dernière ligne"
                      >
                        <Minus className="w-3 h-3" />
                        <span>Ligne</span>
                      </button>

                      <span className="text-slate-600 font-light">|</span>

                      <button
                        onClick={() => {
                          const table = selectedElement as HTMLTableElement;
                          const isStyled = table.getAttribute('data-striped') === 'true';
                          table.setAttribute('data-striped', isStyled ? 'false' : 'true');

                          for (let i = 1; i < table.rows.length; i++) {
                            const row = table.rows[i];
                            if (i % 2 === 0 && !isStyled) {
                              row.style.backgroundColor = '#f8fafc';
                            } else {
                              row.style.backgroundColor = '';
                            }
                          }
                          onContentChange(editableRef.current?.innerHTML || '');
                        }}
                        className="hover:bg-slate-700 px-1.5 py-0.5 rounded text-[11px] text-sky-400 flex items-center gap-1"
                        title="Bandes colorées alternées"
                      >
                        <Palette className="w-3 h-3" />
                        <span>Style</span>
                      </button>
                    </>
                  )}

                  {/* Shared Copy, Paste, Move, Delete */}
                  <span className="text-slate-600 font-light">|</span>
                  <button
                    onClick={() => {
                      (window as any).__copiedWordElementHtml = selectedElement.outerHTML;
                      alert("Élément copié ! Cliquez sur 'Coller' pour le dupliquer à la suite.");
                    }}
                    className="hover:bg-slate-700 active:bg-slate-600 px-1.5 py-0.5 rounded text-yellow-300 flex items-center gap-1"
                    title="Copier cet élément"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copier</span>
                  </button>

                  <button
                    onClick={() => {
                      const copied = (window as any).__copiedWordElementHtml;
                      if (copied) {
                        const div = document.createElement('div');
                        div.innerHTML = copied;
                        const elToInsert = div.firstElementChild;
                        if (elToInsert) {
                          const targetNode = selectedElement.closest('.inserted-image-wrapper') || selectedElement;
                          targetNode.parentNode?.insertBefore(elToInsert, targetNode.nextSibling);
                          onContentChange(editableRef.current?.innerHTML || '');
                          setTimeout(recalculateOverlay, 10);
                        }
                      } else {
                        alert("Presse-papiers vide. Copiez d'abord un élément !");
                      }
                    }}
                    className="hover:bg-slate-700 active:bg-slate-600 px-1.5 py-0.5 rounded text-emerald-400 flex items-center gap-1"
                    title="Coller après cet élément"
                  >
                    <Clipboard className="w-3 h-3" />
                    <span>Coller</span>
                  </button>

                  <button
                    onClick={() => {
                      const wrapper = selectedElement.closest('.inserted-image-wrapper') || selectedElement;
                      const parent = wrapper.parentNode;
                      if (parent && wrapper.previousSibling) {
                        parent.insertBefore(wrapper, wrapper.previousSibling);
                        onContentChange(editableRef.current?.innerHTML || '');
                        setTimeout(recalculateOverlay, 50);
                      }
                    }}
                    className="hover:bg-slate-700 p-1 rounded text-slate-300"
                    title="Monter"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      const wrapper = selectedElement.closest('.inserted-image-wrapper') || selectedElement;
                      const parent = wrapper.parentNode;
                      if (parent && wrapper.nextSibling) {
                        parent.insertBefore(wrapper, wrapper.nextSibling.nextSibling);
                        onContentChange(editableRef.current?.innerHTML || '');
                        setTimeout(recalculateOverlay, 50);
                      }
                    }}
                    className="hover:bg-slate-700 p-1 rounded text-slate-300"
                    title="Descendre"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      const wrapper = selectedElement.closest('.inserted-image-wrapper') || selectedElement;
                      wrapper.remove();
                      setSelectedElement(null);
                      setElementOverlayPos(null);
                      onContentChange(editableRef.current?.innerHTML || '');
                    }}
                    className="hover:bg-red-800 text-red-100 px-2 py-1 rounded font-bold flex items-center gap-1"
                    title="Supprimer l'élément"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Supprimer</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Selection Mini-Toolbar (Auto Formatting) */}
      {miniToolbarPos && (
        <div 
          className="fixed z-50 bg-white/95 backdrop-blur-xs border border-gray-300 shadow-xl rounded-lg px-2.5 py-1.5 flex items-center space-x-2 text-xs select-none"
          style={{
            left: `${miniToolbarPos.x}px`,
            top: `${miniToolbarPos.y}px`,
            transform: 'translateX(-50%)',
          }}
        >
          <button
            onClick={() => {
              document.execCommand('bold');
              onContentChange(editableRef.current?.innerHTML || '');
            }}
            className="w-6 h-6 hover:bg-gray-150 rounded font-bold text-gray-800 flex items-center justify-center transition-colors border border-gray-100"
            title="Gras"
          >
            G
          </button>
          <button
            onClick={() => {
              document.execCommand('italic');
              onContentChange(editableRef.current?.innerHTML || '');
            }}
            className="w-6 h-6 hover:bg-gray-150 rounded italic text-gray-800 font-serif flex items-center justify-center transition-colors border border-gray-100"
            title="Italique"
          >
            I
          </button>
          <button
            onClick={() => {
              document.execCommand('underline');
              onContentChange(editableRef.current?.innerHTML || '');
            }}
            className="w-6 h-6 hover:bg-gray-150 rounded underline text-gray-800 flex items-center justify-center transition-colors border border-gray-100"
            title="Souligné"
          >
            S
          </button>

          <div className="w-px h-4 bg-gray-250 mx-1"></div>

          {/* Direct Synonyms button on selection */}
          {onOpenSynonyms && (
            <button
              onClick={() => {
                const text = window.getSelection()?.toString().trim() || '';
                onOpenSynonyms(text);
              }}
              className="px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded flex items-center gap-1 text-[11px] border border-indigo-200 transition cursor-pointer"
              title="Dictionnaire des Synonymes (Shift+F7)"
            >
              <BookOpen className="w-3 h-3 text-indigo-600" />
              <span>Synonymes</span>
            </button>
          )}

          <div className="w-px h-4 bg-gray-250 mx-1"></div>
          
          <select
            onChange={(e) => {
              document.execCommand('fontName', false, e.target.value);
              onContentChange(editableRef.current?.innerHTML || '');
            }}
            defaultValue={style.fontFamily}
            className="bg-gray-50 border border-gray-250 text-[10px] rounded px-1.5 py-0.5 outline-none font-sans text-gray-750"
          >
            <option value="Calibri">Calibri</option>
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Georgia">Georgia</option>
            <option value="Courier New">Courier New</option>
            <option value="Trebuchet MS">Trebuchet MS</option>
          </select>

          <select
            onChange={(e) => {
              const selection = window.getSelection();
              if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const span = document.createElement('span');
                span.style.fontSize = `${e.target.value}pt`;
                span.appendChild(range.extractContents());
                range.insertNode(span);
              }
              onContentChange(editableRef.current?.innerHTML || '');
            }}
            defaultValue="11"
            className="bg-gray-50 border border-gray-250 text-[10px] rounded px-1 py-0.5 outline-none font-sans text-gray-750"
          >
            {[8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 36, 48].map(s => (
              <option key={s} value={s}>{s} pt</option>
            ))}
          </select>

          <input
            type="color"
            onChange={(e) => {
              document.execCommand('foreColor', false, e.target.value);
              onContentChange(editableRef.current?.innerHTML || '');
            }}
            defaultValue="#000000"
            className="w-5 h-5 rounded border border-gray-300 cursor-pointer p-0 bg-transparent overflow-hidden"
            title="Couleur"
          />
        </div>
      )}

      {/* Right-Click Context Menu (Word Style) */}
      {contextMenuPos && (() => {
        const cleanWord = contextMenuPos.selectedText.trim().toLowerCase();
        // ONLY match spelling issues (orthographe), NEVER grammaire
        const matchingIssue = grammarIssues.find(
          (issue) =>
            issue.type === 'orthographe' && (
              issue.original.toLowerCase() === cleanWord ||
              (cleanWord.length > 2 && (issue.original.toLowerCase().includes(cleanWord) || cleanWord.includes(issue.original.toLowerCase())))
            )
        );
        const dictSuggestion = !matchingIssue && cleanWord ? QUICK_SPELL_DICT[cleanWord] : null;
        const squiggleMatch = !matchingIssue && !dictSuggestion
          ? spellingSquiggles.find((sq) => sq.word.toLowerCase() === cleanWord)
          : null;
        const effectiveCorrection = matchingIssue?.replacement || dictSuggestion || squiggleMatch?.correction;
        const originalWordToFix = matchingIssue?.original || contextMenuPos.selectedText || squiggleMatch?.word;

        const handleApplyCorrection = (replacementText: string, originalText?: string) => {
          if (!editableRef.current) return;
          const currentHtml = editableRef.current.innerHTML;
          const target = originalText || contextMenuPos.selectedText;
          if (!target) return;

          const escaped = target.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
          const wordRegex = new RegExp(`\\b${escaped}\\b`, 'i');
          const newHtml = wordRegex.test(currentHtml)
            ? currentHtml.replace(wordRegex, replacementText)
            : currentHtml.replace(new RegExp(escaped, 'i'), replacementText);

          editableRef.current.innerHTML = newHtml;
          lastContentRef.current = newHtml;
          onContentChange(newHtml);
          if (matchingIssue && onFixGrammarIssue) {
            onFixGrammarIssue(matchingIssue);
          }
          setSpellingSquiggles((prev) =>
            prev.filter((sq) => sq.word.toLowerCase() !== target.toLowerCase())
          );
          setContextMenuPos(null);
          setTimeout(() => calculateSpellingSquiggles(), 100);
        };

        return (
        <div
          id="word-context-menu"
          className={`fixed z-50 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-100 shadow-2xl' : 'bg-white border-slate-300 text-slate-800 shadow-2xl'} border rounded-lg py-1.5 w-64 text-xs font-sans select-none animate-in fade-in zoom-in-95 duration-100`}
          style={{
            left: `${contextMenuPos.x}px`,
            top: `${contextMenuPos.y}px`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Authentic Word-style Spellcheck Suggestion Banner (Orthographe UNIQUEMENT) */}
          {effectiveCorrection && (
            <div className={`p-2.5 mb-1 rounded-t-lg border-b ${isDarkMode ? 'bg-red-950/40 border-red-800/50' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center space-x-1.5 text-red-600 text-[11px] font-bold mb-1.5">
                <Check className="w-3.5 h-3.5 text-red-500" />
                <span>Correction d'orthographe</span>
              </div>
              <button
                id="btn-apply-spell-fix"
                onClick={() => {
                  handleApplyCorrection(effectiveCorrection, originalWordToFix);
                }}
                className={`w-full px-2.5 py-1.5 rounded-md text-left font-bold flex items-center justify-between transition cursor-pointer border shadow-2xs ${
                  isDarkMode
                    ? 'bg-slate-800 hover:bg-emerald-950/60 border-red-700/60 text-emerald-400'
                    : 'bg-white hover:bg-emerald-50 border-red-300 text-emerald-700'
                }`}
              >
                <div className="flex items-center space-x-1.5 truncate">
                  <Check className="w-3.5 h-3.5 text-emerald-500 font-bold shrink-0" />
                  <span className="text-xs font-bold truncate">{effectiveCorrection}</span>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-medium shrink-0 ml-1">
                  Corriger
                </span>
              </button>
              <p className={`text-[10px] ${isDarkMode ? 'text-red-300' : 'text-red-700'} mt-1 leading-tight`}>
                Remplacer l'orthographe par « {effectiveCorrection} »
              </p>
            </div>
          )}

          {contextMenuPos.selectedText && (
            <div className={`px-3 py-1.5 border-b ${isDarkMode ? 'border-slate-800 bg-slate-800/50 text-slate-400' : 'border-slate-150 bg-slate-50 text-slate-500'} text-[11px] font-medium truncate flex items-center justify-between`}>
              <span className="truncate">Mot : « {contextMenuPos.selectedText} »</span>
            </div>
          )}

          {/* Option: Modifier la page en cours avec l'IA */}
          {onOpenAiAssistant && (
            <button
              id="ctx-menu-ai-page-gen"
              onClick={() => {
                onOpenAiAssistant();
                setContextMenuPos(null);
              }}
              className={`w-full px-3 py-1.5 text-left ${isDarkMode ? 'hover:bg-purple-950/40 text-purple-300' : 'hover:bg-purple-50 text-purple-700'} flex items-center justify-between font-semibold transition cursor-pointer`}
            >
              <div className="flex items-center space-x-2">
                <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                <span>Modifier la page en cours avec l'IA...</span>
              </div>
              <span className="text-[10px] bg-purple-100 text-purple-800 px-1 rounded font-bold">IA</span>
            </button>
          )}

          {/* Synonyms Trigger */}
          {onOpenSynonyms && (
            <button
              onClick={() => {
                onOpenSynonyms(contextMenuPos.selectedText, contextMenuPos.contextSentence);
                setContextMenuPos(null);
              }}
              className={`w-full px-3 py-1.5 text-left ${isDarkMode ? 'hover:bg-slate-800 text-blue-400' : 'hover:bg-indigo-50 text-[#2b579a]'} flex items-center justify-between font-semibold transition cursor-pointer`}
            >
              <div className="flex items-center space-x-2">
                <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                <span>Synonymes IA...</span>
              </div>
              <span className="text-[10px] text-slate-400 font-normal">Shift+F7</span>
            </button>
          )}

          {onOpenGrammarPanel && (
            <button
              onClick={() => {
                onOpenGrammarPanel();
                setContextMenuPos(null);
              }}
              className={`w-full px-3 py-1.5 text-left ${isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'} flex items-center space-x-2 transition cursor-pointer`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              <span>Vérifier la grammaire</span>
            </button>
          )}

          <div className={`h-px ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'} my-1`}></div>

          {/* Standard Clipboard Actions */}
          <button
            onClick={() => {
              document.execCommand('cut');
              onContentChange(editableRef.current?.innerHTML || '');
              setContextMenuPos(null);
            }}
            className={`w-full px-3 py-1.5 text-left ${isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'} flex items-center space-x-2 transition cursor-pointer`}
          >
            <Scissors className="w-3.5 h-3.5 text-slate-500" />
            <span>Couper</span>
          </button>

          <button
            onClick={() => {
              document.execCommand('copy');
              setContextMenuPos(null);
            }}
            className={`w-full px-3 py-1.5 text-left ${isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'} flex items-center space-x-2 transition cursor-pointer`}
          >
            <Copy className="w-3.5 h-3.5 text-slate-500" />
            <span>Copier</span>
          </button>

          <button
            onClick={async () => {
              try {
                const clipText = await navigator.clipboard.readText();
                if (clipText) {
                  document.execCommand('insertText', false, clipText);
                  onContentChange(editableRef.current?.innerHTML || '');
                }
              } catch (err) {
                document.execCommand('paste');
                onContentChange(editableRef.current?.innerHTML || '');
              }
              setContextMenuPos(null);
            }}
            className={`w-full px-3 py-1.5 text-left ${isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'} flex items-center space-x-2 transition cursor-pointer`}
          >
            <Clipboard className="w-3.5 h-3.5 text-slate-500" />
            <span>Coller</span>
          </button>

          {/* Select All */}
          <button
            onClick={() => {
              const contentArea = document.getElementById('word-content-area');
              if (contentArea) {
                const selection = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(contentArea);
                selection?.removeAllRanges();
                selection?.addRange(range);
              }
              setContextMenuPos(null);
            }}
            className={`w-full px-3 py-1.5 text-left ${isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'} flex items-center space-x-2 transition cursor-pointer`}
          >
            <CheckSquare className="w-3.5 h-3.5 text-slate-500" />
            <span>Sélectionner tout</span>
          </button>

          <div className={`h-px ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'} my-1`}></div>

          {/* Quick Formatting */}
          <div className={`px-3 py-1 flex items-center justify-between ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Format</span>
            <div className="flex space-x-1">
              <button
                onClick={() => {
                  document.execCommand('bold');
                  onContentChange(editableRef.current?.innerHTML || '');
                  setContextMenuPos(null);
                }}
                className={`w-6 h-6 ${isDarkMode ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-200 text-slate-800'} rounded font-bold flex items-center justify-center cursor-pointer`}
                title="Gras"
              >
                G
              </button>
              <button
                onClick={() => {
                  document.execCommand('italic');
                  onContentChange(editableRef.current?.innerHTML || '');
                  setContextMenuPos(null);
                }}
                className={`w-6 h-6 ${isDarkMode ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-200 text-slate-800'} rounded italic flex items-center justify-center font-serif cursor-pointer`}
                title="Italique"
              >
                I
              </button>
              <button
                onClick={() => {
                  document.execCommand('underline');
                  onContentChange(editableRef.current?.innerHTML || '');
                  setContextMenuPos(null);
                }}
                className={`w-6 h-6 ${isDarkMode ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-200 text-slate-800'} rounded underline flex items-center justify-center cursor-pointer`}
                title="Souligné"
              >
                S
              </button>
            </div>
          </div>
        </div>
        );
      })()}

      {/* Floating Inline Prompt Toolbar on Text Selection */}
      {miniToolbarPos && selectedTextForInline && onInlinePromptAction && (
        <InlinePromptToolbar
          position={{ top: miniToolbarPos.y, left: miniToolbarPos.x }}
          selectedText={selectedTextForInline}
          isDarkMode={isDarkMode}
          accentColor={accentColor}
          onExecuteAction={(actionType, customPrompt) => {
            onInlinePromptAction(selectedTextForInline, actionType, customPrompt);
            setMiniToolbarPos(null);
          }}
          onClose={() => setMiniToolbarPos(null)}
        />
      )}

    </div>
  );
}
