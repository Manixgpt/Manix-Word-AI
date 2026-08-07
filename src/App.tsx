import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { Sparkles, Grid, Eye, Search, Table, Image as ImageIcon, CheckCircle, Save, FileText, ChevronDown, List, ListOrdered, FileDown } from 'lucide-react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, isFirebaseEnabled } from './firebase';
import TemplateChooser from './components/TemplateChooser';
import AuthPage from './components/AuthPage';
import WordRibbon from './components/WordRibbon';
import WordDocumentSheet from './components/WordDocumentSheet';
import FileMenu from './components/FileMenu';
import AiAssistant from './components/AiAssistant';
import { WordDocument, RibbonTab, Template, DocumentStyle } from './types';
import { TEMPLATES } from './templatesData';
import { exportToDocx } from './utils/docxExporter';
import { exportToPdf } from './utils/pdfExporter';
import mammoth from 'mammoth';

export default function App() {
  // Auth State
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Navigation State
  const [isTemplateChooser, setIsTemplateChooser] = useState(true);
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<RibbonTab>('Accueil');

  // Document State
  const [activeDoc, setActiveDoc] = useState<WordDocument | null>(null);
  const [recentDocs, setRecentDocs] = useState<WordDocument[]>([]);

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
  };

  const handleOpenDoc = (doc: WordDocument) => {
    setActiveDoc(doc);
    setIsTemplateChooser(false);
    updateWordCount(doc.content);
    if (doc.watermark) {
      setWatermarkText(doc.watermark);
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

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
      setIsFileMenuOpen(false);
    }
  };

  // 6. Exporter: Secure PDF Simulation
  const handleExportPdfFile = () => {
    if (!activeDoc) return;
    window.print();
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
      
      {/* Save Notify Bubble Toast */}
      <div
        id="save-bubble"
        className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg z-50 flex items-center space-x-2 transition duration-300 opacity-0 pointer-events-none"
      >
        <span className="text-green-400">●</span>
        <span>Enregistré avec succès dans votre coffre Cloud Office</span>
      </div>

      {isTemplateChooser ? (
        <TemplateChooser
          onSelectTemplate={handleSelectTemplate}
          recentDocs={recentDocs}
          onOpenDoc={handleOpenDoc}
          onImportLocalFile={handleImportLocalFile}
        />
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Main Workspace Ribbon */}
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
              const spellBtn = document.getElementById('ai-spellcheck');
              if (spellBtn) spellBtn.click();
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
          />

          {/* Core sheet editor + sidepanel */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Navigation Rail themed with Geometric Balance */}
            <nav className="w-14 bg-white border-r border-slate-200 flex flex-col items-center py-4 space-y-6 shrink-0 z-10">
              <div className="relative group">
                <button
                  onClick={() => setIsTemplateChooser(true)}
                  className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
                  title="Retour aux Modèles"
                >
                  <Grid className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={() => setIsTemplateChooser(true)}
                className="w-10 h-10 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 flex items-center justify-center transition-all cursor-pointer"
                title="Liste des Documents"
              >
                <FileText className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  const s = document.getElementById('ai-spellcheck');
                  if (s) s.click();
                }}
                className="w-10 h-10 rounded-xl text-slate-400 hover:text-purple-600 hover:bg-purple-50 flex items-center justify-center transition-all cursor-pointer"
                title="Correction Automatique"
              >
                <Sparkles className="w-5 h-5" />
              </button>
            </nav>

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
                }}
                style={activeDoc.style}
                watermark={watermarkText}
                gridVisible={gridVisible}
                rulerVisible={rulerVisible}
                collabActive={collabActive}
                editableRef={editableRef}
                zoom={zoom}
                isReadOnly={activeDoc.isFinal || activeDoc.isReadOnly}
              />
            )}

            <AiAssistant
              currentContent={activeDoc?.content || ''}
              onUpdateContent={handleUpdateContentDirectly}
              onAppendContent={handleAppendHtmlAtSelection}
              onExportPdf={handleExportPdfFile}
              onExportDocx={handleExportDocxFile}
            />
          </div>

          {/* Microsoft Standard bottom status bar caption */}
          <div className="bg-[#f3f2f1] text-[#2b579a] h-6 px-4 flex items-center justify-between text-[11px] border-t border-gray-300 flex-shrink-0 relative z-10 select-none">
            <div className="flex items-center space-x-4">
              <span id="stat-pages" className="font-medium">
                Page 1 sur {activeDoc ? Math.max(1, activeDoc.content.split('data-page-break="true"').length) : 1}
              </span>
              <span id="stat-words">{wordCount} mots</span>
              <span id="stat-chars">{charCount} caractères</span>
              <span className="text-gray-400">|</span>
              <span className="flex items-center text-slate-600">
                <span className="text-green-600 mr-1 font-bold">✓</span> Vérification orthographique activée
              </span>
            </div>
            
            <div className="flex items-center space-x-3 text-slate-700">
              <span>Français (France)</span>
              <span className="text-gray-300">|</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setZoom(Math.max(50, zoom - 10))}
                  className="px-1.5 bg-gray-200 hover:bg-gray-300 rounded font-bold cursor-pointer transition select-none text-[10px]"
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
                  className="px-1.5 bg-gray-200 hover:bg-gray-300 rounded font-bold cursor-pointer transition select-none text-[10px]"
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
          isFirebaseEnabled={isFirebaseEnabled}
          auth={auth}
          onSignOut={handleSignOut}
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
                className={`flex-1 pb-2 border-b-[3px] text-center transition-all ${
                  tableModalTab === 'manual'
                    ? 'border-[#2b579a] text-[#2b579a]'
                    : 'border-transparent text-gray-400 hover:text-gray-700'
                }`}
              >
                🎛️ Création Manuelle
              </button>
              <button
                type="button"
                onClick={() => setTableModalTab('auto')}
                className={`flex-1 pb-2 border-b-[3px] text-center transition-all ${
                  tableModalTab === 'auto'
                    ? 'border-[#2b579a] text-[#2b579a]'
                    : 'border-transparent text-gray-400 hover:text-gray-700'
                }`}
              >
                🤖 IA Automatique
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
    </div>
    </>
  );
}
