import { useEffect, useRef, useState, RefObject } from 'react';
import { DocumentStyle, CoEditor } from '../types';

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
}

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
}: WordDocumentSheetProps) {
  // Setup fake co-editors cursors
  const [coEditors, setCoEditors] = useState<CoEditor[]>([
    { id: '1', name: 'Marie L. (IA Tech)', color: '#e64980', avatar: 'ML', cursorPosition: { line: 120, ch: 150 }, status: 'writing' },
    { id: '2', name: 'Jean Dupont', color: '#12b886', avatar: 'JD', cursorPosition: { line: 420, ch: 300 }, status: 'idle' },
  ]);

  // Mini floating toolbar for text selections (Word-style auto formatting)
  const [miniToolbarPos, setMiniToolbarPos] = useState<{ x: number; y: number } | null>(null);

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
      return;
    }

    const range = selection.getRangeAt(0);
    const contentArea = document.getElementById('word-content-area');
    
    if (contentArea && contentArea.contains(range.commonAncestorContainer)) {
      const rect = range.getBoundingClientRect();
      setMiniToolbarPos({
        x: rect.left + rect.width / 2,
        y: rect.top - 48 + window.scrollY,
      });
    } else {
      setMiniToolbarPos(null);
    }
  };

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionCheck);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionCheck);
    };
  }, []);

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
    if (editableRef.current && content !== editableRef.current.innerHTML) {
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
    <div className="flex-1 flex bg-slate-100 overflow-auto select-none relative" style={{ minHeight: 'calc(100vh - 12rem)' }}>
      {/* LEFT RULER MAPS FOR HEIGHT (Image 2 & 9 style) */}
      {rulerVisible && (
        <div id="vertical-ruler" className="w-6 bg-white border-r border-slate-200 flex flex-col pt-8 text-[8px] text-slate-400 select-none flex-shrink-0 h-full">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="h-12 border-b border-slate-100 flex flex-col justify-end pr-1 text-right">
              {i % 2 === 0 && <span>{i}</span>}
            </div>
          ))}
        </div>
      )}

      {/* CENTER DESK SPACE RENDER */}
      <div className="flex-1 flex flex-col items-center p-4 relative overflow-y-auto">
        
        {/* TOP HORIZONTAL RULER MAPS (Image 2 & 9 style) */}
        {rulerVisible && (
          <div id="horizontal-ruler" className="w-[816px] h-6 bg-white border-b border-slate-200 flex items-end text-[8px] text-slate-400 select-none mb-2 flex-shrink-0 relative">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="flex-1 border-r border-slate-150 h-3 flex flex-col justify-end pl-0.5 first:border-l">
                {i % 2 === 0 && <span>{i}</span>}
              </div>
            ))}
          </div>
        )}

        {/* PAPER CONTAINER SHEET WRAPPER FOR ZOOM SCALING */}
        <div 
          className="flex-shrink-0 transition-all duration-150 origin-top flex items-center justify-center"
          style={{
            width: style.orientation === 'portrait' ? `${816 * (zoom / 100)}px` : `${1056 * (zoom / 100)}px`,
            minHeight: style.orientation === 'portrait' ? `${1056 * (zoom / 100)}px` : `${816 * (zoom / 100)}px`,
            height: 'auto',
            position: 'relative'
          }}
        >
          <div
            id="word-paper-sheet"
            className="relative transition duration-300 flex-shrink-0 origin-top-left"
            style={{
              width: style.orientation === 'portrait' ? '816px' : '1056px',
              minHeight: style.orientation === 'portrait' ? '1056px' : '816px',
              height: 'auto',
              transform: `scale(${zoom / 100})`,
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
                  backgroundImage: 'radial-gradient(#cfd8dc 1px, transparent 1px)',
                  backgroundSize: '16px 16px',
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
                    className="rounded px-1.5 py-0.5 text-[8px] font-semibold text-white truncate shadow-sm absolute left-1 top-4 whitespace-nowrap"
                    style={{ backgroundColor: cursor.color }}
                  >
                    {cursor.name} {cursor.status === 'writing' && '✍️'}
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
                  <span className="text-[10px] text-gray-300 font-bold px-1.5 py-0.5 uppercase bg-slate-800 rounded mr-0.5">
                    {elementOverlayPos.type === 'img' ? 'Image 📸' : 'Tableau 📊'}
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
                        className="hover:bg-slate-700 active:bg-slate-600 px-2 py-1 rounded text-[11px]"
                        title="Agrandir l'image"
                      >
                        ➕ Agrandir
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
                        className="hover:bg-slate-700 active:bg-slate-600 px-2 py-1 rounded text-[11px]"
                        title="Réduire l'image"
                      >
                        ➖ Réduire
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
                        ◀️
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
                        ⏺️
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
                        ▶️
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
                        className="hover:bg-slate-700 p-1 px-1.5 rounded text-[11px]"
                        title="Pivoter de 90°"
                      >
                        🔄 Pivoter
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
                        className="hover:bg-slate-700 px-1.5 py-0.5 rounded text-[11px]"
                        title="Ajouter une ligne en bas"
                      >
                        ➕ Ligne
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
                        className="hover:bg-slate-700 px-1.5 py-0.5 rounded text-[11px]"
                        title="Ajouter une colonne à droite"
                      >
                        ➕ Col
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
                        className="hover:bg-slate-700 px-1.5 py-0.5 rounded text-[11px] text-orange-400"
                        title="Supprimer la dernière ligne"
                      >
                        ➖ Ligne
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
                        className="hover:bg-slate-700 px-1.5 py-0.5 rounded text-[11px] text-sky-400"
                        title="Bandes colorées alternées"
                      >
                        🎨 Style
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
                    className="hover:bg-slate-700 active:bg-slate-600 px-1.5 py-0.5 rounded text-yellow-300"
                    title="Copier cet élément"
                  >
                    📋 Copier
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
                    className="hover:bg-slate-700 active:bg-slate-600 px-1.5 py-0.5 rounded text-emerald-400"
                    title="Coller après cet élément"
                  >
                    📥 Coller
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
                    🔼
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
                    🔽
                  </button>

                  <button
                    onClick={() => {
                      const wrapper = selectedElement.closest('.inserted-image-wrapper') || selectedElement;
                      wrapper.remove();
                      setSelectedElement(null);
                      setElementOverlayPos(null);
                      onContentChange(editableRef.current?.innerHTML || '');
                    }}
                    className="hover:bg-red-800 text-red-100 px-2 py-1 rounded font-bold"
                    title="Supprimer l'élément"
                  >
                    🗑️ Supprimer
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
          className="fixed z-50 bg-white/95 backdrop-blur-xs border border-gray-300 shadow-xl rounded px-2.5 py-1.5 flex items-center space-x-2 text-xs select-none"
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
    </div>
  );
}
