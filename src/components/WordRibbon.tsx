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
  Camera,
  ShoppingBag,
  Package,
  BookOpen,
  Sigma,
} from 'lucide-react';
import { RibbonTab, DocumentStyle } from '../types';

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
    <div className="bg-slate-100 border-b border-slate-200 flex flex-col flex-shrink-0 select-none antialiased">
      {/* App Header themed exact with 'Geometric Balance' */}
      <header className="h-12 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center space-x-4">
          <button id="quick-logo" className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-base hover:bg-blue-700 transition-colors" title="Manix Word">
            M
          </button>
          
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Manix Word</span>
            <div className="flex items-center space-x-2 mt-0.5">
              <h1 className="text-xs font-semibold text-slate-700">{documentTitle || 'Rapport_Strategique_2024.docx'}</h1>
              <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200">Enregistré</span>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

          {/* Quick Access Actions unified with header */}
          <div className="hidden sm:flex items-center space-x-2 bg-slate-50 px-2 py-1 rounded border border-slate-200">
            <button
              id="quick-save"
              onClick={() => onExecuteCommand('save')}
              className="hover:bg-slate-200 p-1 rounded group transition text-xs"
              title="Enregistrer (Ctrl+S)"
            >
              <span className="block group-hover:scale-105 transition">💾</span>
            </button>
            <button
              onClick={() => onExecuteCommand('undo')}
              className="hover:bg-slate-200 p-1 rounded group transition text-xs"
              title="Annuler (Ctrl+Z)"
            >
              <span>↩️</span>
            </button>
            <button
              onClick={() => onExecuteCommand('redo')}
              className="hover:bg-slate-200 p-1 rounded group transition text-xs"
              title="Rétablir (Ctrl+Y)"
            >
              <span>↪️</span>
            </button>
          </div>
        </div>

        {/* Right tools matching mockup */}
        <div className="flex items-center space-x-3">
          <button
            id="btn-toggle-collab-header"
            onClick={onToggleCollab}
            className={`flex items-center space-x-1 px-3 py-1.5 text-xs font-medium rounded border transition-colors ${
              collabActive
                ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                : 'text-slate-600 hover:bg-slate-50 border-slate-200'
            }`}
          >
            <Users className="h-3.5 w-3.5 mr-0.5" />
            <span>{collabActive ? 'Collaboratif Actif' : 'Collaborer'}</span>
          </button>

          <button
            onClick={onOpenPdfExport}
            className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 rounded transition-colors"
          >
            <Printer className="h-3.5 w-3.5 mr-0.5 text-blue-100" />
            <span>Exporter PDF</span>
          </button>
          
          <div className="hidden md:flex flex-col items-end text-right">
            <span className="text-[10px] text-slate-500 font-medium font-mono">kalengamushimbilina@gmail.com</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-xs font-bold text-slate-700">
            JD
          </div>
        </div>
      </header>

      {/* Ribbon Tabs Row (including FILE menu tab on left) */}
      <div className="flex items-end bg-white border-b border-slate-200 px-1 relative">
        <button
          id="tab-fichier"
          onClick={() => onTabChange('Fichier')}
          className="bg-slate-800 text-white text-xs font-medium px-5 py-2 hover:bg-slate-900 active:bg-slate-950 transition cursor-pointer"
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
                className={`text-xs px-4 py-2 hover:bg-slate-50 hover:text-slate-800 transition font-medium cursor-pointer duration-100 ${
                  isSelected
                    ? 'border-b-2 border-blue-600 text-blue-600 font-semibold bg-blue-50/5'
                    : 'text-slate-500'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Tell me what to do Search Bar */}
        <div className="absolute right-4 bottom-1.5 hidden lg:flex items-center bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-400 group focus-within:border-slate-300">
          <Sparkle className="h-3 w-3 text-purple-600 mr-1 animate-pulse" />
          <input
            id="tell-me-doing"
            type="text"
            placeholder="Dites-nous ce que vous voulez faire..."
            className="outline-none text-slate-700 w-52 bg-transparent text-xs placeholder-slate-400"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onTriggerResearch();
              }
            }}
          />
        </div>
      </div>

      {/* Active Tab's Ribbon content bar with soft clean Slate styling */}
      <div className="bg-slate-50 h-28 px-4 flex items-center space-x-6 overflow-x-auto overflow-y-hidden border-b border-slate-200 select-none">
        
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
                  className="p-1 w-12 hover:bg-gray-200 hover:text-gray-900 rounded flex flex-col items-center justify-center text-center transition group cursor-pointer"
                  title="Coller le texte"
                >
                  <span className="text-xl group-hover:scale-105 transition">📋</span>
                  <span className="text-[9px] text-gray-500 mt-0.5">Coller</span>
                </button>
                <div className="flex flex-col space-y-1">
                  <button onClick={() => onExecuteCommand('cut')} className="hover:bg-gray-200 text-left px-1.5 py-0.5 rounded text-[10px] text-gray-700 hover:text-black transition">✂️ Couper</button>
                  <button onClick={() => onExecuteCommand('copy')} className="hover:bg-gray-200 text-left px-1.5 py-0.5 rounded text-[10px] text-gray-700 hover:text-black transition">📄 Copier</button>
                </div>
              </div>
              <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-light">Presse-papiers</span>
            </div>

            <div className="w-px h-16 bg-gray-200 flex-shrink-0 self-center"></div>

            {/* Police Group */}
            <div className="flex flex-col items-center h-full pt-1">
              <div className="flex-grow flex flex-col justify-center space-y-1.5">
                {/* Font Selector & Size */}
                <div className="flex items-center space-x-2">
                  <select
                    id="font-family"
                    value={docStyle.fontFamily}
                    onChange={(e) => onStyleChange({ fontFamily: e.target.value })}
                    className="border border-gray-300 rounded bg-white text-xs px-2 py-0.5 outline-none font-sans text-gray-800 focus:border-[#2b579a] w-[110px]"
                  >
                    {fontFamilies.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>

                  <select
                    id="font-size"
                    value={docStyle.fontSize}
                    onChange={(e) => onStyleChange({ fontSize: parseInt(e.target.value) })}
                    className="border border-gray-300 rounded bg-white text-xs px-2 py-0.5 outline-none font-sans text-gray-800 focus:border-[#2b579a]"
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
                    className="hover:bg-gray-200 p-1 rounded transition text-xs font-semibold select-all"
                    title="Gras"
                  >
                    <Bold className="h-3.5 w-3.5" />
                  </button>
                  <button
                    id="btn-italic"
                    onClick={() => onExecuteCommand('italic')}
                    className="hover:bg-gray-200 p-1 rounded transition"
                    title="Italique"
                  >
                    <Italic className="h-3.5 w-3.5" />
                  </button>
                  <button
                    id="btn-underline"
                    onClick={() => onExecuteCommand('underline')}
                    className="hover:bg-gray-200 p-1 rounded transition"
                    title="Souligné"
                  >
                    <Underline className="h-3.5 w-3.5" />
                  </button>
                  <div className="w-px h-4 bg-gray-350 mx-1"></div>

                  {/* Highlights and colors */}
                  <span className="text-xs">🎨</span>
                  <input
                    id="text-color"
                    type="color"
                    value={docStyle.textColor}
                    onChange={(e) => onStyleChange({ textColor: e.target.value })}
                    className="w-4 h-4 rounded border border-gray-300 cursor-pointer overflow-hidden p-0 bg-transparent"
                    title="Couleur de police"
                  />
                  
                  <span className="text-xs ml-1">🖊️</span>
                  <button
                    onClick={() => onExecuteCommand('backColor', '#fff2b2')}
                    className="w-3.5 h-3.5 bg-[#fff2b2] border border-gray-300 rounded cursor-pointer"
                    title="Surlignage"
                  />
                </div>
              </div>
              <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-light">Police</span>
            </div>

            <div className="w-px h-16 bg-gray-200 flex-shrink-0 self-center"></div>

            {/* Paragraphe Group */}
            <div className="flex flex-col items-center h-full pt-2">
              <div className="flex-grow flex flex-col justify-center space-y-1.5">
                {/* Lists & alignments */}
                <div className="flex items-center space-x-1.5">
                  <button onClick={() => onExecuteCommand('insertUnorderedList')} className="hover:bg-gray-200 p-1 rounded transition" title="Liste à puces">
                    <List className="h-4 w-4 text-gray-600" />
                  </button>
                  <button onClick={() => onExecuteCommand('insertOrderedList')} className="hover:bg-gray-200 p-1 rounded transition" title="Liste numérotée">
                    <ListOrdered className="h-4 w-4 text-gray-600" />
                  </button>
                  <div className="w-px h-4 bg-gray-350 mx-1"></div>
                  
                  <button onClick={() => onExecuteCommand('justifyLeft')} className="hover:bg-gray-200 p-1 rounded transition" title="Aligner à gauche">
                    <AlignLeft className="h-4 w-4 text-gray-600" />
                  </button>
                  <button onClick={() => onExecuteCommand('justifyCenter')} className="hover:bg-gray-200 p-1 rounded transition" title="Centrer">
                    <AlignCenter className="h-4 w-4 text-gray-600" />
                  </button>
                  <button onClick={() => onExecuteCommand('justifyRight')} className="hover:bg-gray-200 p-1 rounded transition" title="Aligner à droite">
                    <AlignRight className="h-4 w-4 text-gray-600" />
                  </button>
                  <button onClick={() => onExecuteCommand('justifyFull')} className="hover:bg-gray-200 p-1 rounded transition" title="Justifier">
                    <AlignJustify className="h-4 w-4 text-gray-600" />
                  </button>
                </div>

                {/* Line Spacing selector */}
                <div className="flex items-center space-x-2 text-xs text-gray-600 justify-center">
                  <span>Interligne :</span>
                  <select
                    id="line-spacing"
                    value={docStyle.lineSpacing}
                    onChange={(e) => onStyleChange({ lineSpacing: parseFloat(e.target.value) })}
                    className="border border-gray-300 bg-white rounded text-[10px] outline-none"
                  >
                    <option value="1">1.0</option>
                    <option value="1.15">1.15</option>
                    <option value="1.5">1.5 (Standard)</option>
                    <option value="2">2.0</option>
                  </select>
                </div>
              </div>
              <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-light">Paragraphe</span>
            </div>

            <div className="w-px h-16 bg-gray-200 flex-shrink-0 self-center hidden md:block"></div>

            {/* Styles presets matching Image 2 visual squares with AaBbCcDd */}
            <div className="flex-col items-center h-full pt-1.5 hidden md:flex">
              <div className="flex-grow flex items-center space-x-2 overflow-x-auto max-w-[280px] lg:max-w-[380px] pr-1">
                {stylePresets.map((preset) => (
                  <button
                    id={`preset-${preset.id}`}
                    key={preset.id}
                    onClick={() => onApplyPresetStyle(preset.id as any)}
                    className="w-14 h-16 bg-white border border-gray-200 hover:border-[#2b579a] rounded p-1 flex flex-col items-center justify-between text-center transition flex-shrink-0 cursor-pointer text-[10px]"
                  >
                    <span className="text-gray-400 font-serif leading-none text-xs block mt-1">{preset.name}</span>
                    <span className="text-[8px] text-gray-600 font-semibold truncate w-full border-t border-gray-100 pt-0.5">{preset.label}</span>
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-light">Style de document</span>
            </div>
          </>
        )}

        {/* ======================================= */}
        {/* TAB: INSERTION */}
        {/* ======================================= */}
        {activeTab === 'Insertion' && (
          <div className="flex h-16 divide-x divide-gray-200 overflow-x-auto select-none items-center pr-4">
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
                  onClick={() => onExecuteCommand('insertHTML', '<div style="background-color:#1e3a8a;color:white;padding:50px;text-align:center;border-radius:6px;margin-bottom:60px;" class="word-cover-page"><h1>PAGE DE GARDE</h1><p style="font-size:14px;color:#93c5fd;margin-top:10px;">Générée avec ManixGPT Office</p></div>')}
                  className="hover:bg-gray-100 p-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition"
                  title="Page de garde"
                >
                  <FileText className="h-4.5 w-4.5 text-[#2b579a]" />
                  <span className="text-[9px] text-gray-650 mt-0.5">Page garde</span>
                </button>
                <button
                  onClick={() => onExecuteCommand('insertHTML', '<hr style="border: 0; border-top: 1px solid #dae1e7; margin: 40px 0;"/>')}
                  className="hover:bg-gray-100 p-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition"
                  title="Page vierge"
                >
                  <Plus className="h-4.5 w-4.5 text-[#2b579a]" />
                  <span className="text-[9px] text-gray-650 mt-0.5">Page vierge</span>
                </button>
                <button
                  onClick={() => onExecuteCommand('insertHTML', '<div class="word-page-break" data-page-break="true" contenteditable="false"></div><p><br></p>')}
                  className="hover:bg-gray-100 p-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition"
                  title="Insérer un saut de page"
                >
                  <Columns2 className="h-4.5 w-4.5 text-[#2b579a]" />
                  <span className="text-[9px] text-gray-650 mt-0.5">Saut page</span>
                </button>
              </div>
              <span className="text-[9px] text-gray-400 mt-0.5 uppercase tracking-wider font-light">Pages</span>
            </div>

            {/* 2. Tableaux Section */}
            <div className="flex flex-col items-center justify-between h-full px-3 py-1 flex-shrink-0">
              <button
                id="btn-insert-table"
                onClick={onInsertTable}
                className="hover:bg-gray-100 p-2 rounded text-center flex flex-col items-center justify-center transition cursor-pointer"
                title="Insérer Tableau"
              >
                <Table className="h-5 w-5 text-[#2b579a]" />
                <span className="text-[9px] text-gray-750 mt-0.5 font-medium">Tableau</span>
              </button>
              <span className="text-[9px] text-gray-400 mt-0.5 uppercase tracking-wider font-light">Tableaux</span>
            </div>

            {/* 3. Illustrations Section */}
            <div className="flex flex-col items-center justify-between h-full px-3 py-1 flex-shrink-0">
              <div className="flex space-x-1.5 items-center">
                <button
                  onClick={() => document.getElementById('word-local-image-selector')?.click()}
                  className="hover:bg-gray-100 p-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition text-emerald-700"
                  title="Cet appareil (Importer localement)"
                >
                  <Camera className="h-4.5 w-4.5" />
                  <span className="text-[9px] text-gray-650 mt-0.5 font-semibold">Cet appareil</span>
                </button>
                <button
                  onClick={onInsertImage}
                  className="hover:bg-gray-100 p-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition text-sky-700"
                  title="Image en ligne (URL)"
                >
                  <ImageIcon className="h-4.5 w-4.5" />
                  <span className="text-[9px] text-gray-650 mt-0.5">En ligne</span>
                </button>
                <button
                  onClick={() => onExecuteCommand('insertHTML', '<div style="background-color:#d0ebff; width:120px; height:60px; border-radius:10px; border:2px solid #228be6; display:flex; align-items:center; justify-content:center; text-align:center; padding:5px; font-size:11px; color:#1864ab; margin: 15px auto;" contenteditable="false">Forme géométrique</div>')}
                  className="hover:bg-gray-100 p-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition text-indigo-600"
                  title="Insérer des formes"
                >
                  <Compass className="h-4.5 w-4.5" />
                  <span className="text-[9px] text-gray-650 mt-0.5">Formes</span>
                </button>
                <button
                  onClick={() => onExecuteCommand('insertHTML', '<span style="font-size: 24px;">😊</span>')}
                  className="hover:bg-gray-100 p-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition text-amber-500"
                  title="Insérer des icônes"
                >
                  <Smile className="h-4.5 w-4.5" />
                  <span className="text-[9px] text-gray-650 mt-0.5">Icônes</span>
                </button>
                <button
                  onClick={() => onExecuteCommand('insertHTML', '<div style="display:flex; flex-direction:column; gap:8px; border:2px solid #0984e3; border-radius:5px; padding:10px; background-color:#e1f5fe; max-width:220px; margin: 15px auto;" contenteditable="false"><div style="background:#0984e3; color:white; padding:4px; font-weight:bold; font-size:10px; border-radius:3px; text-align:center;">DIRECTION</div><div style="background:#54a0ff; color:white; padding:4px; font-size:10px; border-radius:3px; text-align:center; margin-left:15px;">Étape 1</div><div style="background:#54a0ff; color:white; padding:4px; font-size:10px; border-radius:3px; text-align:center; margin-left:30px;">Étape 2</div></div>')}
                  className="hover:bg-gray-100 p-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition text-purple-600"
                  title="SmartArt"
                >
                  <Layers className="h-4.5 w-4.5" />
                  <span className="text-[9px] text-gray-650 mt-0.5">SmartArt</span>
                </button>
                <button
                  onClick={() => onExecuteCommand('insertHTML', '<div style="background-color:#f1f5f9; border:1px solid #cbd5e1; border-radius:4px; padding:12px; margin:15px auto; max-width:280px;" contenteditable="false"><h5 style="margin:0 0 8px 0; font-size:11px; color:#3b5998;">Graphes de ventes</h5><div style="display:flex; gap:4px; align-items:flex-end; height:60px;"><div style="background-color:#2b579a; width:20px; height:80%;"></div><div style="background-color:#2b579a; width:20px; height:45%;"></div><div style="background-color:#2b579a; width:20px; height:100%;"></div><div style="background-color:#2b579a; width:20px; height:65%;"></div></div></div>')}
                  className="hover:bg-gray-100 p-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition text-red-600"
                  title="Graphique"
                >
                  <BarChart className="h-4.5 w-4.5" />
                  <span className="text-[9px] text-gray-650 mt-0.5">Graphique</span>
                </button>
              </div>
              <span className="text-[9px] text-gray-400 mt-0.5 uppercase tracking-wider font-light">Illustrations</span>
            </div>

            {/* 4. Compléments Section */}
            <div className="flex flex-col items-center justify-between h-full px-3 py-1 flex-shrink-0">
              <div className="flex space-x-1.5 items-center">
                <button
                  onClick={() => onExecuteCommand('insertHTML', '<div style="background-color:#eff6ff; border:1px solid #bfdbfe; color:#1e3a8a; padding:10px; margin:10px 0; font-size:10px;" contenteditable="false">🔌 Complément Office connecté avec succès.</div>')}
                  className="hover:bg-gray-100 p-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition text-sky-600"
                  title="Boutique Office"
                >
                  <ShoppingBag className="h-4.5 w-4.5" />
                  <span className="text-[9px] text-gray-650 mt-0.5">Boutique</span>
                </button>
                <button
                  onClick={onTriggerResearch}
                  className="hover:bg-gray-100 p-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition text-slate-700"
                  title="Rechercher sur Wikipédia"
                >
                  <BookOpen className="h-4.5 w-4.5" />
                  <span className="text-[9px] text-gray-650 mt-0.5">Wikipédia</span>
                </button>
              </div>
              <span className="text-[9px] text-gray-400 mt-0.5 uppercase tracking-wider font-light">Compléments</span>
            </div>

            {/* 5. Média Section */}
            <div className="flex flex-col items-center justify-between h-full px-3 py-1 flex-shrink-0">
              <button
                onClick={() => onExecuteCommand('insertHTML', '<div style="background-color:#000; color:white; width:280px; height:150px; display:flex; flex-direction:column; align-items:center; justify-content:center; margin:15px auto; border-radius:6px; font-size:12px;" contenteditable="false">🎞️ [Lecteur Vidéo YouTube Online Média Mockup]<p style="font-size:9px; color:#aaa; margin-top:5px;">ID: 76219c2b-08bb</p></div>')}
                className="hover:bg-gray-100 p-2 rounded text-center flex flex-col items-center justify-center transition cursor-pointer text-[#c23b22]"
                title="Insérer Vidéo en ligne"
              >
                <Video className="h-5 w-5" />
                <span className="text-[9px] text-gray-750 mt-0.5 font-medium">Vidéo</span>
              </button>
              <span className="text-[9px] text-gray-400 mt-0.5 uppercase tracking-wider font-light">Médias</span>
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
                  className="hover:bg-gray-100 p-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition text-[#2b579a]"
                  title="Lien hypertexte"
                >
                  <Link className="h-4.5 w-4.5" />
                  <span className="text-[9px] text-gray-650 mt-0.5">Lien</span>
                </button>
                <button
                  onClick={() => onExecuteCommand('insertHTML', '🔖')}
                  className="hover:bg-gray-100 p-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition text-orange-600"
                  title="Créer Signet"
                >
                  <Bookmark className="h-4.5 w-4.5" />
                  <span className="text-[9px] text-gray-650 mt-0.5">Signet</span>
                </button>
              </div>
              <span className="text-[9px] text-gray-400 mt-0.5 uppercase tracking-wider font-light">Liens</span>
            </div>

            {/* 7. Commentaires Section */}
            <div className="flex flex-col items-center justify-between h-full px-3 py-1 flex-shrink-0">
              <button
                onClick={() => onExecuteCommand('insertHTML', '<span style="background-color: #fffae6; border-bottom: 2px solid #e1b12c; font-weight:500;">[Commentaire Office : Réviser cette section]</span>')}
                className="hover:bg-gray-100 p-2 rounded text-center flex flex-col items-center justify-center transition cursor-pointer text-[#e1b12c]"
                title="Insérer Commentaire"
              >
                <MessageSquare className="h-4.5 w-4.5" />
                <span className="text-[9px] text-gray-750 mt-0.5 font-medium">Commenter</span>
              </button>
              <span className="text-[9px] text-gray-400 mt-0.5 uppercase tracking-wider font-light">Commentaire</span>
            </div>

            {/* 8. En-tête / Pied de page */}
            <div className="flex flex-col items-center justify-between h-full px-3 py-1 flex-shrink-0">
              <div className="flex flex-col space-y-0.5 justify-center flex-grow">
                <button
                  onClick={() => onExecuteCommand('insertHTML', '<div style="text-align: right; color: #777; font-size: 11px; font-style: italic; border-bottom: 1px solid #ddd; padding-bottom: 2px;">Document Confidentiel - Word</div>')}
                  className="hover:bg-gray-100 px-2 py-0.5 text-left rounded text-[9px] text-gray-750 border border-gray-200 flex items-center shrink-0 transition"
                >
                  📄 En-tête
                </button>
                <button
                  onClick={() => onExecuteCommand('insertHTML', '<div style="text-align: center; color: #777; font-size: 11px; border-top: 1px solid #ddd; padding-top: 4px; margin-top: 30px;">Page 1 - Rédigé avec ManixGPT</div>')}
                  className="hover:bg-gray-100 px-2 py-0.5 text-left rounded text-[9px] text-gray-750 border border-gray-200 flex items-center shrink-0 transition"
                >
                  🔢 Pied de page
                </button>
              </div>
              <span className="text-[9px] text-gray-400 mt-0.5 uppercase tracking-wider font-light">En-tête & Pied</span>
            </div>

            {/* 9. Texte Section */}
            <div className="flex flex-col items-center justify-between h-full px-3 py-1 flex-shrink-0">
              <div className="flex space-x-1.5 items-center">
                <button
                  onClick={() => onExecuteCommand('insertHTML', '<div style="float: right; width: 180px; border: 2px solid #2b579a; padding: 10px; margin: 10px; background-color: #f8fafc; border-radius: 4px; font-size: 11px; color: #333;" contenteditable="true"><strong>Encadré de texte</strong><br/>Tapez votre note ici...</div>')}
                  className="hover:bg-gray-100 p-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition text-gray-650"
                  title="Zone de texte"
                >
                  <Type className="h-4.5 w-4.5 text-[#2b579a]" />
                  <span className="text-[9px] text-gray-650 mt-0.5">Zone texte</span>
                </button>
                <button
                  onClick={() => onExecuteCommand('insertHTML', '<span style="font-size: 28px; font-family: Impact, sans-serif; background-image: linear-gradient(to right, #f39c12, #d35400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-shadow: 2px 2px 4px rgba(0,0,0,0.2); font-weight: bold;">WordArt</span>')}
                  className="hover:bg-gray-100 p-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition text-gray-650"
                  title="WordArt d\'Office"
                >
                  <Sparkle className="h-4.5 w-4.5 text-amber-500 animate-pulse" />
                  <span className="text-[9px] text-gray-650 mt-0.5">WordArt</span>
                </button>
              </div>
              <span className="text-[9px] text-gray-400 mt-0.5 uppercase tracking-wider font-light">Texte</span>
            </div>

            {/* 10. Symboles Section */}
            <div className="flex flex-col items-center justify-between h-full px-3 py-1 flex-shrink-0">
              <div className="flex space-x-1.5 items-center">
                <button
                  onClick={() => onExecuteCommand('insertHTML', '<span style="font-family: Cambria, serif; font-style: italic; background-color:#f1f5f9; padding: 2px 6px; border-radius:3px;">$$\\int_a^b f(x)dx = F(b) - F(a)$$</span>')}
                  className="hover:bg-gray-100 p-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition text-violet-700"
                  title="Insérer Équation"
                >
                  <Sigma className="h-4.5 w-4.5" />
                  <span className="text-[9px] text-gray-650 mt-0.5">Équation</span>
                </button>
                <button
                  onClick={() => onExecuteCommand('insertHTML', '<span> © ® ™ € </span>')}
                  className="hover:bg-gray-100 p-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition text-slate-700"
                  title="Caractères spéciaux"
                >
                  <Heading className="h-4.5 w-4.5" />
                  <span className="text-[9px] text-gray-650 mt-0.5">Symbole</span>
                </button>
              </div>
              <span className="text-[9px] text-gray-400 mt-0.5 uppercase tracking-wider font-light">Symboles</span>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* TAB: CRÉATION */}
        {/* ======================================= */}
        {activeTab === 'Création' && (
          <div className="flex h-16 divide-x divide-gray-200 overflow-x-auto select-none items-center pr-4">
            
            {/* 1. Thèmes & Jeux de styles */}
            <div className="flex flex-col items-center justify-between h-full px-3 py-1 flex-shrink-0">
              <div className="flex space-x-2 items-center flex-grow">
                <select
                  id="word-theme-picker"
                  value={docStyle.theme}
                  onChange={(e) => onStyleChange({ theme: e.target.value })}
                  className="border border-gray-300 rounded bg-white text-[11px] px-2 py-1 outline-none font-sans text-gray-700 focus:border-[#2b579a] w-[140px]"
                >
                  <option value="Office">Sélection : Standard Office (Bleu)</option>
                  <option value="Créatif">Sélection : Créatif Académique</option>
                  <option value="Officiel">Sélection : Lettre Administrative</option>
                  <option value="Moderne">Sélection : Moderne Épuré</option>
                </select>
                <div className="flex space-x-1">
                  <button 
                    onClick={() => onStyleChange({ fontFamily: 'Georgia', fontSize: 13, textColor: '#1a1a1a' })} 
                    className="hover:bg-gray-100 px-1.5 py-1 rounded border text-[9px] text-gray-600 font-serif"
                    title="Jeu de style formel classique"
                  >
                    Chic
                  </button>
                  <button 
                    onClick={() => onStyleChange({ fontFamily: 'Calibri', fontSize: 11, textColor: '#334155' })} 
                    className="hover:bg-gray-100 px-1.5 py-1 rounded border text-[9px] text-gray-600 font-sans"
                    title="Jeu de style corporatif"
                  >
                    Tech
                  </button>
                </div>
              </div>
              <span className="text-[9px] text-gray-400 mt-0.5 uppercase tracking-wider font-light">Thèmes Généraux</span>
            </div>

            {/* 2. Couleur de Titre & Palette Accent */}
            <div className="flex flex-col items-center justify-between h-full px-3 py-1 flex-shrink-0">
              <div className="flex items-center flex-grow space-x-1 px-1">
                <button onClick={() => onStyleChange({ textColor: '#1e3b8a' })} className="w-3.5 h-3.5 rounded bg-blue-800 border border-gray-300 hover:scale-110 transition" title="Bleu Corporate" />
                <button onClick={() => onStyleChange({ textColor: '#7f1d1d' })} className="w-3.5 h-3.5 rounded bg-red-900 border border-gray-300 hover:scale-110 transition" title="Rouge Cardinal" />
                <button onClick={() => onStyleChange({ textColor: '#064e3b' })} className="w-3.5 h-3.5 rounded bg-emerald-950 border border-gray-300 hover:scale-110 transition" title="Vert Anglais" />
                <button onClick={() => onStyleChange({ textColor: '#111827' })} className="w-3.5 h-3.5 rounded bg-gray-905 border border-gray-305 hover:scale-110 transition" title="Charbon" />
              </div>
              <span className="text-[9px] text-gray-400 mt-0.5 uppercase tracking-wider font-light">Couleurs du Thème</span>
            </div>

            {/* 3. Arrière-plan de Page (Watermarks & Page Backgrounds) */}
            <div className="flex flex-col items-center justify-between h-full px-3 py-1 flex-shrink-0">
              <div className="flex space-x-2.5 items-center flex-grow">
                <div className="flex space-x-1 items-center">
                  <button
                    onClick={() => onInsertWatermark('URGENT')}
                    className="hover:bg-slate-100 px-1.5 py-0.5 rounded text-[10px] text-red-650 font-bold border border-red-200"
                    title="Filigrane Urgent"
                  >
                    ⚠ URGENT
                  </button>
                  <button
                    onClick={() => onInsertWatermark('CONFIDENTIEL')}
                    className="hover:bg-slate-100 px-1.5 py-0.5 rounded text-[10px] text-gray-500 font-medium border border-gray-200"
                    title="Filigrane Confidentiel"
                  >
                    🔒 CONFIDENTIEL
                  </button>
                  <button
                    onClick={() => onInsertWatermark('')}
                    className="hover:bg-slate-100 p-0.5 rounded text-gray-400"
                    title="Effacer le filigrane actuel"
                  >
                    ❌
                  </button>
                </div>

                <div className="h-6 w-px bg-gray-200"></div>

                {/* Couleur de page background selector */}
                <div className="flex space-x-1 items-center">
                  <button onClick={() => onStyleChange({ backgroundColor: '#ffffff' })} className="w-4 h-4 rounded-full bg-white border border-gray-400 hover:scale-110 transition" title="Blanc standard" />
                  <button onClick={() => onStyleChange({ backgroundColor: '#fdfbf7' })} className="w-4 h-4 rounded-full bg-[#fdfbf7] border border-gray-400 hover:scale-110 transition" title="Sépia crème" />
                  <button onClick={() => onStyleChange({ backgroundColor: '#f1f5f9' })} className="w-4 h-4 rounded-full bg-[#f1f5f9] border border-gray-400 hover:scale-110 transition" title="Gris bleuté épuré" />
                </div>
              </div>
              <span className="text-[9px] text-gray-400 mt-0.5 uppercase tracking-wider font-light">Arrière-Plan & Filigranes</span>
            </div>

            {/* 4. Bordure Décorative active */}
            <div className="flex flex-col items-center justify-between h-full px-3 py-1 flex-shrink-0">
              <div className="flex space-x-1 items-center flex-grow">
                <button
                  onClick={() => onExecuteCommand('insertHTML', '<div style="border: 3px double #2b579a; padding: 25px; margin: 15px 0; border-radius: 6px; background:#fafbfd;" contenteditable="true" class="page-borders-chic"><p style="font-size:12px; font-weight:bold; color:#2b579a; text-align:center; margin-bottom:10px;">🏆 CADRE DE PRÉSENTATION OFFICIEL</p><p style="font-size:11px; color:#475569; margin:0;" class="page-body-insert-chic">Double-cliquez pour saisir le contenu de cette zone de page encadrée de styles Office.</p></div>')}
                  className="hover:bg-gray-100 px-2 py-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition text-blue-700"
                  title="Ajouter une bordure de paragraphe doublée"
                >
                  <span className="text-sm">🖼️</span>
                  <span className="text-[9px] text-gray-700 mt-0.5">Bordure double</span>
                </button>
              </div>
              <span className="text-[9px] text-gray-400 mt-0.5 uppercase tracking-wider font-light">Bordures de page</span>
            </div>

          </div>
        )}

        {/* ======================================= */}
        {/* TAB: DISPOSITION */}
        {/* ======================================= */}
        {activeTab === 'Disposition' && (
          <div className="flex h-16 divide-x divide-gray-200 overflow-x-auto select-none items-center pr-4">
            
            {/* 1. Mise en Page (Marges & Orientation) */}
            <div className="flex flex-col items-center justify-between h-full px-3 py-1 flex-shrink-0">
              <div className="flex space-x-3 items-center flex-grow">
                {/* Marges setup */}
                <div className="flex flex-col text-[10px] text-gray-700">
                  <span className="font-semibold mb-0.5">Marges</span>
                  <select
                    id="page-margins"
                    value={docStyle.margin}
                    onChange={(e) => onStyleChange({ margin: e.target.value as any })}
                    className="border border-gray-300 rounded bg-white text-[10px] p-0.5 focus:border-[#2b579a]"
                  >
                    <option value="normal">Normal (2.5cm)</option>
                    <option value="narrow">Étroit (1.27cm)</option>
                    <option value="moderate">Moyen (1.91cm)</option>
                    <option value="wide">Large (5.08cm)</option>
                  </select>
                </div>

                {/* Orientation setup */}
                <div className="flex flex-col text-[10px] text-gray-700">
                  <span className="font-semibold mb-0.5">Orientation</span>
                  <div className="flex space-x-1">
                    <button
                      id="orientation-portrait"
                      onClick={() => onStyleChange({ orientation: 'portrait' })}
                      className={`px-1.5 py-0.5 text-[10px] rounded border ${
                        docStyle.orientation === 'portrait' ? 'bg-[#2b579a] text-white font-medium' : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Protrait
                    </button>
                    <button
                      id="orientation-landscape"
                      onClick={() => onStyleChange({ orientation: 'landscape' })}
                      className={`px-1.5 py-0.5 text-[10px] rounded border ${
                        docStyle.orientation === 'landscape' ? 'bg-[#2b579a] text-white font-medium' : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Paysage
                    </button>
                  </div>
                </div>
              </div>
              <span className="text-[9px] text-gray-400 mt-0.5 uppercase tracking-wider font-light">Mise En Page</span>
            </div>

            {/* 2. Sauts de Page & Sections */}
            <div className="flex flex-col items-center justify-between h-full px-3 py-1 flex-shrink-0">
              <div className="flex space-x-2 items-center flex-grow">
                <button
                  onClick={() => onExecuteCommand('insertHTML', '<hr class="rich-page-break" style="border:none; border-top: 2px dashed #3b82f6; height:1px; margin: 30px 0; position:relative; text-align:center; content:\'📖 SAUT DE PAGE (Word)\';" />')}
                  className="hover:bg-gray-100 px-2 py-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition text-gray-700"
                  title="Insérer un saut de page pour l'édition"
                >
                  <span className="text-sm">📄</span>
                  <span className="text-[9px] text-gray-700 mt-0.5">Saut de Page</span>
                </button>
                <button
                  onClick={() => onExecuteCommand('insertHTML', '<div style="clear:both; margin:15px 0; border-top:1px dotted #94a3b8;" class="section-break"></div>')}
                  className="hover:bg-gray-100 px-2 py-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition text-gray-700"
                  title="Insérer une séparation de section"
                >
                  <span className="text-sm">⚡</span>
                  <span className="text-[9px] text-gray-700 mt-0.5">Saut Section</span>
                </button>
              </div>
              <span className="text-[9px] text-gray-400 mt-0.5 uppercase tracking-wider font-light">Sauts</span>
            </div>

            {/* 3. Retraits de Paragraphe */}
            <div className="flex flex-col items-center justify-between h-full px-3 py-1 flex-shrink-0">
              <div className="flex space-x-2 items-center flex-grow text-[10px] text-gray-700">
                <button
                  onClick={() => onExecuteCommand('indent')}
                  className="hover:bg-gray-150 border border-gray-200 px-2 py-1 rounded flex items-center space-x-1"
                  title="Augmenter le retrait du paragraphe actif"
                >
                  <span>➡</span>
                  <span>Retrait +</span>
                </button>
                <button
                  onClick={() => onExecuteCommand('outdent')}
                  className="hover:bg-gray-150 border border-gray-200 px-2 py-1 rounded flex items-center space-x-1"
                  title="Diminuer le retrait du paragraphe actif"
                >
                  <span>⬅</span>
                  <span>Retrait -</span>
                </button>
              </div>
              <span className="text-[9px] text-gray-400 mt-0.5 uppercase tracking-wider font-light">Paragraphe (Retraits)</span>
            </div>

            {/* 4. Organisation des Objets */}
            <div className="flex flex-col items-center justify-between h-full px-3 py-1 flex-shrink-0">
              <div className="flex items-center flex-grow space-x-1.5 text-xs text-slate-700">
                <button onClick={() => onExecuteCommand('justifyLeft')} className="hover:bg-gray-100 p-1.5 rounded transition" title="Aligner à gauche">
                  📊 L
                </button>
                <button onClick={() => onExecuteCommand('justifyCenter')} className="hover:bg-gray-100 p-1.5 rounded transition" title="Centrer">
                  📊 C
                </button>
                <button onClick={() => onExecuteCommand('justifyRight')} className="hover:bg-gray-100 p-1.5 rounded transition" title="Aligner à droite">
                  📊 R
                </button>
              </div>
              <span className="text-[9px] text-gray-400 mt-0.5 uppercase tracking-wider font-light">Organiser</span>
            </div>

          </div>
        )}

        {/* ======================================= */}
        {/* TAB: RÉFÉRENCES */}
        {/* ======================================= */}
        {activeTab === 'Références' && (
          <>
            {/* Table of Contents & Footnotes */}
            <div className="flex flex-col items-center h-full pt-2">
              <div className="flex space-x-4 flex-grow items-center">
                <button
                  id="btn-contents-table"
                  onClick={onInsertTableOfContents}
                  className="hover:bg-gray-200 px-3 py-2 rounded text-center flex items-center space-x-2 border border-gray-200 cursor-pointer"
                >
                  <FileText className="h-5 w-5 text-[#2b579a]" />
                  <span className="text-[11px] text-gray-700 font-semibold">Insérer Table des Matières</span>
                </button>

                <button
                  id="btn-footnote"
                  onClick={onInsertFootnote}
                  className="hover:bg-gray-200 px-3 py-2 rounded text-center flex items-center space-x-2 border border-gray-200 cursor-pointer"
                >
                  <Bookmark className="h-4 w-4 text-[#2b579a]" />
                  <span className="text-[11px] text-gray-700">Note de bas de page</span>
                </button>
              </div>
              <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-light">Table des matières</span>
            </div>
          </>
        )}

        {/* ======================================= */}
        {/* TAB: PUBLIPOSTAGE */}
        {/* ======================================= */}
        {activeTab === 'Publipostage' && (
          <div className="flex flex-col items-center h-full pt-2 justify-center">
            <div className="flex space-x-4 text-xs text-gray-650">
              <button
                onClick={() => onExecuteCommand('insertHTML', '<div style="border: 2px dashed #999; padding: 20px; background-color: #fafafa; margin: 10px 0;"><h3>[ENVELOPPE PUBLIPOSTAGE]</h3><p>Destinataire : {{Nom_Client}}<br/>Adresse : {{Adresse}}</p></div>')}
                className="px-4 py-2 border rounded bg-white shadow-sm hover:translate-y-[-1px] transition"
              >
                ✉️ Créer Enveloppes
              </button>
              <button
                onClick={() => onExecuteCommand('insertHTML', '<span style="background-color: #e3faf2; border: 1px solid #12b886; padding: 2px 4px; border-radius: 4px; font-weight: bold; font-family: Courier; font-size: 11px;">&lt;&lt;Placeholder_Client&gt;&gt;</span>')}
                className="px-4 py-2 border rounded bg-white shadow-sm hover:translate-y-[-1px] transition"
              >
                🏷️ Insérer un champ de fusion
              </button>
            </div>
            <span className="text-[10px] text-gray-400 mt-3 uppercase tracking-wider font-light">Démarrer la fusion</span>
          </div>
        )}

        {/* ======================================= */}
        {/* TAB: RÉVISION */}
        {/* ======================================= */}
        {activeTab === 'Révision' && (
          <>
            {/* Integrated spellcheck AI, Synonyms */}
            <div className="flex flex-col items-center h-full pt-2">
              <div className="flex space-x-3 flex-grow items-center">
                <button
                  id="btn-review-spellcheck"
                  onClick={onTriggerSpellcheck}
                  className="bg-[#2b579a] hover:bg-blue-800 text-white font-semibold py-1.5 px-3 rounded text-center flex items-center space-x-1.5 shadow-sm transition"
                  title="Correcteur orthographique IA"
                >
                  <Sparkles className="h-4 w-4" />
                  <span className="text-[11px]">Vérifier l’Orthographe IA</span>
                </button>

                <button
                  onClick={onTriggerAutoWrite}
                  className="bg-teal-700 hover:bg-teal-800 text-white font-semibold py-1.5 px-3 rounded text-center flex items-center space-x-1.5 shadow-sm transition"
                  title="Intelligence Artificielle de rédaction"
                >
                  <Sparkle className="h-4 w-4 text-teal-200" />
                  <span className="text-[11px]">Rédiger automatiquement</span>
                </button>
              </div>
              <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-light">Vérification & IA</span>
            </div>

            <div className="w-px h-16 bg-gray-200 flex-shrink-0 self-center"></div>

            {/* Collaborative toggler matching real co-editing requests */}
            <div className="flex flex-col items-center h-full pt-2">
              <button
                id="btn-toggle-collab"
                onClick={onToggleCollab}
                className={`py-1.5 px-3 rounded font-medium flex items-center space-x-2 border transition cursor-pointer ${
                  collabActive
                    ? 'bg-green-600 border-green-700 text-white shadow-sm hover:bg-green-700'
                    : 'bg-white border-gray-350 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Users className="h-4 w-4 flex-shrink-0" />
                <span className="text-[11px]">{collabActive ? 'Mode Collaboratif : ACTIF ●' : 'Activer la Collaboration'}</span>
              </button>
              <span className="text-[10px] text-gray-400 mt-2 uppercase tracking-wider font-light">Mode multi-auteur</span>
            </div>
          </>
        )}

        {/* ======================================= */}
        {/* TAB: AFFICHAGE */}
        {/* ======================================= */}
        {activeTab === 'Affichage' && (
          <>
            {/* Rulers, grids representation toggler (Image 9) */}
            <div className="flex flex-col items-center h-full pt-2">
              <div className="flex space-x-4 flex-grow items-center">
                <label className="flex items-center space-x-2 text-xs text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rulerVisible}
                    onChange={onToggleRuler}
                    className="rounded border-gray-300 text-[#2b579a] focus:ring-[#2b579a]"
                  />
                  <span>Afficher la règle</span>
                </label>

                <label className="flex items-center space-x-2 text-xs text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={gridVisible}
                    onChange={onToggleGrid}
                    className="rounded border-gray-300 text-[#2b579a] focus:ring-[#2b579a]"
                  />
                  <span>Afficher quadrillage</span>
                </label>
              </div>
              <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-light">Afficher / Masquer</span>
            </div>
          </>
        )}

        {/* ======================================= */}
        {/* TAB: DESSIN */}
        {/* ======================================= */}
        {activeTab === 'Dessin' && (
          <div className="flex h-16 divide-x divide-gray-250 overflow-x-auto select-none items-center pr-4">
            
            {/* 1. Outils de Dessin (Pens and Markers) */}
            <div className="flex flex-col items-center justify-between h-full px-3 py-1 flex-shrink-0">
              <div className="flex space-x-2 items-center flex-grow">
                <button
                  onClick={() => onExecuteCommand('insertHTML', '<span style="font-family:cursive; font-size:14px; color:#2b579a; border-bottom:1px dashed #2b579a;" class="drawing-pen-blue">✏️ Stylo Bleu</span>')}
                  className="hover:bg-gray-100 p-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition text-blue-700"
                  title="Stylo fin classique"
                >
                  <span className="text-base">✏️</span>
                  <span className="text-[9px] text-gray-700 mt-0.5 font-medium">Stylo Bleu</span>
                </button>
                <div className="flex flex-col space-y-1">
                  <button
                    onClick={() => onExecuteCommand('backColor', '#ffeb3b')}
                    className="hover:bg-gray-200 text-left px-1.5 py-0.5 rounded text-[9px] text-gray-700 flex items-center space-x-1"
                    title="Surligner en Jaune"
                  >
                    <span className="w-2 h-2 bg-[#ffeb3b] rounded-full inline-block"></span>
                    <span>Surligneur Jaune</span>
                  </button>
                  <button
                    onClick={() => onExecuteCommand('backColor', '#ffc0cb')}
                    className="hover:bg-gray-200 text-left px-1.5 py-0.5 rounded text-[9px] text-gray-700 flex items-center space-x-1"
                    title="Surligner en Rose"
                  >
                    <span className="w-2 h-2 bg-[#ffc0cb] rounded-full inline-block"></span>
                    <span>Surligneur Rose</span>
                  </button>
                </div>
              </div>
              <span className="text-[9px] text-gray-400 mt-0.5 uppercase tracking-wider font-light">Outils de Traçage</span>
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
              <span className="text-[9px] text-gray-400 mt-0.5 uppercase tracking-wider font-light">Palette d'Écriture</span>
            </div>

            {/* 3. Formes Géométriques */}
            <div className="flex flex-col items-center justify-between h-full px-3 py-1 flex-shrink-0">
              <div className="flex space-x-2 items-center flex-grow">
                <button
                  onClick={() => onExecuteCommand('insertHTML', '<div style="border: 2px solid #2b579a; padding: 15px; margin: 10px 0; border-radius: 4px; background: #fdfdfd; min-height: 40px;" contenteditable="true" class="shape-rectangle-box"><p style="font-size:11px; color:#475569; margin:0;">[Rectangle modifiable - Saisissez votre texte ici]</p></div>')}
                  className="hover:bg-gray-100 p-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition text-gray-800"
                  title="Rectangle"
                >
                  <span className="text-base">⬜</span>
                  <span className="text-[9px] text-gray-700 mt-0.5">Rectangle</span>
                </button>
                <button
                  onClick={() => onExecuteCommand('insertHTML', '<div style="border: 2px solid #ca8a04; border-radius: 50%; width: 90px; height: 90px; margin: 15px auto; display: flex; align-items: center; justify-content: center; text-align: center; background: #fffbeb;" contenteditable="true" class="shape-circle-box"><p style="font-size:10px; color:#ca8a04; margin:0; padding:4px;">Cercle</p></div>')}
                  className="hover:bg-gray-100 p-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition text-yellow-600"
                  title="Cercle"
                >
                  <span className="text-base">⚪</span>
                  <span className="text-[9px] text-gray-700 mt-0.5">Cercle</span>
                </button>
              </div>
              <span className="text-[9px] text-gray-400 mt-0.5 uppercase tracking-wider font-light">Formes</span>
            </div>

            {/* 4. Dessin Libre & Signatures */}
            <div className="flex flex-col items-center justify-between h-full px-3 py-1 flex-shrink-0">
              <div className="flex space-x-2 items-center flex-grow">
                <button
                  onClick={() => onExecuteCommand('insertHTML', '<div style="border-bottom: 2px solid #111827; width:220px; height:80px; margin: 15px auto; display:flex; align-items:end; justify-content:center; font-family:\'Brush Script MT\', cursive, sans-serif; font-size:22px; color:#1e3a8a;" contenteditable="true" class="handwritten-signature">Signé : J. Dupont</div>')}
                  className="hover:bg-gray-100 p-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition text-gray-800"
                  title="Insérer Signature manuscrite"
                >
                  <span className="text-lg">✒️</span>
                  <span className="text-[9px] text-gray-700 mt-0.5">Signature</span>
                </button>
                <button
                  onClick={() => onExecuteCommand('insertHTML', '<div style="border: 2px dashed #9ca3af; padding: 20px; text-align: center; margin: 10px 0; background: #fafafa; border-radius: 8px;" contenteditable="true"><p style="font-size:12px; color:#6b7280; font-style:italic;">🎨 [Zone de dessin libre - Double-cliquez pour esquisser]</p></div>')}
                  className="hover:bg-gray-100 p-1.5 rounded text-center text-xs flex flex-col items-center cursor-pointer transition text-purple-700"
                  title="Insérer Zone d\'Esquisse"
                >
                  <span className="text-lg">🎨</span>
                  <span className="text-[9px] text-gray-700 mt-0.5">Canevas de Dessin</span>
                </button>
              </div>
              <span className="text-[9px] text-gray-400 mt-0.5 uppercase tracking-wider font-light">Signatures & Canevas</span>
            </div>

          </div>
        )}

        {/* ======================================= */}
        {/* TAB: EXTENSIONS */}
        {/* ======================================= */}
        {activeTab === 'Extensions' && (
          <div className="flex h-16 divide-x divide-gray-200 overflow-x-auto select-none items-center pr-4">
            {/* IA et Outils intelligents Section */}
            <div className="flex flex-col items-center justify-between h-full px-3 py-1 flex-shrink-0">
              <div className="flex space-x-3 items-center flex-grow">
                <button
                  onClick={() => onExecuteCommand('insertHTML', '<div style="background-color:#fef2f2; border-left:4px solid #ef4444; padding:12px; margin:10px 0;" contenteditable="false"><h5>⚠️ Analyse Anti-Plagiat Manix Word</h5><p style="font-size:11px; margin-top:4px;">0% de contenu dupliqué détecté. Ce document est 100% original !</p></div>')}
                  className="hover:bg-gray-100 p-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition text-red-600"
                  title="Analyse de plagiat"
                >
                  <span className="text-lg">🛡️</span>
                  <span className="text-[9px] text-gray-650 mt-0.5">Anti-Plagiat</span>
                </button>
                <button
                  onClick={() => onExecuteCommand('insertHTML', '<div style="text-align:center; margin:15px auto;" contenteditable="false"><img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://manix-word.office" alt="QR Code" style="border:1px solid #94a3b8; padding:6px; background:#fff; display:inline-block;" /><p style="font-size:10px; color:#475569; margin-top:4px; font-weight:500;">Scannez pour partager ce document</p></div>')}
                  className="hover:bg-gray-100 p-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition text-blue-600"
                  title="Générer QR Code de partage"
                >
                  <span className="text-lg">📱</span>
                  <span className="text-[9px] text-gray-650 mt-0.5">Générer QR</span>
                </button>
              </div>
              <span className="text-[9px] text-gray-400 mt-0.5 uppercase tracking-wider font-light">Extensions Manix AI</span>
            </div>

            {/* Éléments de Données */}
            <div className="flex flex-col items-center justify-between h-full px-3 py-1 flex-shrink-0">
              <div className="flex space-x-2 items-center flex-grow">
                <button
                  onClick={() => onExecuteCommand('insertHTML', '<table style="border-collapse:collapse; width:100%; border:1px solid #cbd5e1; font-family:sans-serif; text-align:center;" contenteditable="true"><tr style="background:#f1f5f9; font-weight:bold;"><td style="border:1px solid #cbd5e1; padding:6px;">PRODUIT</td><td style="border:1px solid #cbd5e1; padding:6px;">UNITÉS</td><td style="border:1px solid #cbd5e1; padding:6px;">PRIX</td></tr><tr><td style="border:1px solid #cbd5e1; padding:6px;">Manix Suite</td><td style="border:1px solid #cbd5e1; padding:6px;">120</td><td style="border:1px solid #cbd5e1; padding:6px;">49.99 €</td></tr></table><p><br></p>')}
                  className="hover:bg-gray-100 p-1.5 rounded text-center text-xs flex flex-col items-center cursor-pointer transition text-green-700"
                  title="Tableau interactif"
                >
                  <span className="text-lg">📊</span>
                  <span className="text-[9px] text-gray-650 mt-0.5">Mini-Feuille Excel</span>
                </button>
              </div>
              <span className="text-[9px] text-gray-400 mt-0.5 uppercase tracking-wider font-light">Données & Tableurs</span>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* TAB: AIDE */}
        {/* ======================================= */}
        {activeTab === 'Aide' && (
          <div className="flex h-16 divide-x divide-gray-200 overflow-x-auto select-none items-center pr-4">
            <div className="flex flex-col items-center justify-between h-full px-3 py-1 flex-shrink-0">
              <div className="flex space-x-3 items-center flex-grow">
                <button
                  onClick={() => onExecuteCommand('insertHTML', '<div style="background-color:#eff6ff; border:1px dashed #3b82f6; border-left:4px solid #2563eb; padding:15px; margin:15px 0; border-radius:4px;"><h4 style="margin:0 0 6px 0; color:#1e3a8a;">💡 Centre d Aide Manix Word</h4><p style="font-size:12px; line-height:1.5; color:#1e40af;"><strong>Raccourcis indispensables :</strong><br/>• Ctrl + S : Sauvegarde rapide<br/>• Ctrl + Shift + P : Exporter en PDF d un clic<br/>• Double-cliquer pour éditer librement n importe quelle section !</p></div>')}
                  className="hover:bg-gray-100 p-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition text-blue-700"
                  title="Guide d'aide interactif"
                >
                  <span className="text-lg">❔</span>
                  <span className="text-[9px] text-gray-650 mt-0.5 font-medium">Afficher Guide</span>
                </button>
                <button
                  onClick={() => alert("Support technique Manix Word : Contactez-nous à support@manix.corp pour toute assistance relative à l application.")}
                  className="hover:bg-gray-100 p-1 rounded text-center text-xs flex flex-col items-center cursor-pointer transition text-emerald-600"
                  title="Contacter le helpdesk"
                >
                  <span className="text-lg">📞</span>
                  <span className="text-[9px] text-gray-650 mt-0.5">Contacter Support</span>
                </button>
              </div>
              <span className="text-[9px] text-gray-400 mt-0.5 uppercase tracking-wider font-light">Documentation</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
