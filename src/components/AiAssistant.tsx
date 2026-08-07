import { useState } from 'react';
import { Sparkles, Search, CheckCircle, FilePlus, Copy, ArrowRight, Loader } from 'lucide-react';
import { SearchResultItem } from '../types';

interface AiAssistantProps {
  currentContent: string;
  onUpdateContent: (newContent: string) => void;
  onAppendContent: (htmlToAppend: string) => void;
  onExportPdf: () => void;
  onExportDocx: () => void;
}

export default function AiAssistant({
  currentContent,
  onUpdateContent,
  onAppendContent,
  onExportPdf,
  onExportDocx,
}: AiAssistantProps) {
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
  const [searchResult, setSearchResult] = useState<{ summary: string; sources: SearchResultItem[] } | null>(null);

  // Document Auto-generate State
  const [genPrompt, setGenPrompt] = useState('');
  const [genType, setGenType] = useState<string>("Rapport d'activité");
  const [genLoading, setGenLoading] = useState(false);

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
      if (data.summary) {
        setSearchResult({
          summary: data.summary,
          sources: data.sources || []
        });
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
          type: genType
        })
      });

      const data = await response.json();
      if (data.success && data.content) {
        onUpdateContent(data.content);
        setGenPrompt('');
      } else {
        alert("Echec de la génération de document.");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur serveur lors de la génération automatique.");
    } finally {
      setGenLoading(false);
    }
  };

  // Insert search result into active document sheet
  const handlePasteSearchResult = () => {
    if (!searchResult) return;

    // Create styled text with cites to insert directly
    const citationHtml = `
      <div style="background-color: #f8f9fa; border-left: 4px solid #2b579a; padding: 12px 16px; margin: 15px 0; border-radius: 4px; font-family: serif;">
        <h4 style="color: #2b579a; margin-top: 0; margin-bottom: 5px; font-size: 14px;">🔍 Informations de recherche internet : "${searchQuery}"</h4>
        <p style="font-size: 13px; color: #333; line-height: 1.4; margin-bottom: 8px;">${searchResult.summary.replace(/\n/g, '<br/>')}</p>
        <span style="font-size: 10px; color: #777;">Sources citées : ${searchResult.sources.map(s => `<a href="${s.url}" style="color: #2b579a; text-decoration: underline;" target="_blank">${s.title}</a>`).join(', ')}</span>
      </div>
    `;

    onAppendContent(citationHtml);
  };

  return (
    <div id="ai-assistant-sidebar" className="w-80 border-l border-slate-200 bg-white flex flex-col h-full flex-shrink-0 font-sans select-none overflow-y-auto">
      {/* Sidebar Header themed perfectly */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between shrink-0 bg-white">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded flex items-center justify-center">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <span className="text-sm font-bold text-slate-800">ManixGPT</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-[10px] text-green-600 font-semibold uppercase tracking-wider">En ligne</span>
        </div>
      </div>

      <div className="p-4 space-y-6 flex-1 divide-y divide-slate-100">
        
        {/* Module 1: Commandes et actions directes IA */}
        <div className="pt-2">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">1. Actions directes sur le document</h3>
          <p className="text-xs text-slate-500 mb-3 leading-relaxed">
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
              className="flex-1 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 outline-none text-xs w-full focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-slate-700"
            />
            <button
              id="ai-command-submit"
              onClick={() => handleDocCommand()}
              disabled={commandLoading}
              className="bg-purple-600 text-white px-3 rounded-lg hover:bg-purple-700 transition flex items-center justify-center shrink-0"
            >
              {commandLoading ? <Loader className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            </button>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Raccourcis Word IA :</span>
            {[
              "Met le titre principal en gras",
              "Souligne tous les contenus en gras",
              "Remplace le mot 'rapport' par 'bilan'"
            ].map((shortcutCmd) => (
              <button
                key={shortcutCmd}
                onClick={() => handleDocCommand(shortcutCmd)}
                disabled={commandLoading}
                className="w-full text-left bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium px-2 py-1.5 rounded-md text-[11px] truncate flex items-center justify-between transition border border-purple-100"
              >
                <span>{shortcutCmd}</span>
                <span className="text-purple-400 font-bold">→</span>
              </button>
            ))}
          </div>

          {commandSuccess && (
            <div className="mt-2 text-xs text-green-700 bg-green-50 border border-green-200 p-2 rounded-lg flex items-center space-x-1.5 animate-fade-in">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Modification appliquée par l'IA avec succès !</span>
            </div>
          )}
        </div>

        {/* Module 2: Correction orthographique */}
        <div className="pt-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">2. Correction d'orthographe</h3>
          <p className="text-xs text-slate-500 mb-3 leading-relaxed">
            Corriger automatiquement les fautes grammaticales et stylistiques sur la feuille.
          </p>

          <button
            id="ai-spellcheck"
            onClick={handleSpellcheck}
            disabled={spellCheckLoading}
            className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 border transition ${
              spellCheckLoading
                ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed'
                : 'bg-white text-slate-800 hover:bg-slate-50 border-slate-200 hover:border-slate-350 shadow-sm'
            }`}
          >
            {spellCheckLoading ? (
              <>
                <Loader className="h-4 w-4 text-purple-600 animate-spin" />
                <span>Correction en cours...</span>
              </>
            ) : (
              <>
                <span className="text-purple-600 font-bold">✓</span>
                <span>Relire & Corriger la page</span>
              </>
            )}
          </button>

          {spellCheckSuccess && (
            <div className="mt-2 text-xs text-green-700 bg-green-50 border border-green-200 p-2 rounded-lg flex items-center space-x-1.5">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Texte reformaté sans faute d'orthographe !</span>
            </div>
          )}
        </div>

        {/* Module 3: Recherches sur internet & copier coller */}
        <div className="pt-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">3. Recherche Internet Grounded</h3>
          <p className="text-xs text-slate-500 mb-3 leading-relaxed">
            Trouver un sujet en direct sur Google Search et l'insérer d'un clic sur Word.
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
              placeholder="Ex: dates clés de l'IA..."
              className="flex-1 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 outline-none text-xs w-full focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-slate-700"
            />
            <button
              id="ai-search-submit"
              onClick={handleSearch}
              disabled={searchLoading}
              className="bg-purple-600 text-white px-3 rounded-lg hover:bg-purple-700 transition flex items-center justify-center shrink-0"
            >
              {searchLoading ? <Loader className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </button>
          </div>

          {searchResult && (
            <div className="bg-slate-50 rounded-lg border border-slate-200 p-3 max-h-[220px] overflow-y-auto space-y-3">
              <div className="text-xs text-slate-755 leading-relaxed font-normal whitespace-pre-line">
                {searchResult.summary}
              </div>

              {searchResult.sources && searchResult.sources.length > 0 && (
                <div className="border-t border-slate-200 pt-2 text-[10px] text-slate-500">
                  <p className="font-semibold text-slate-600 mb-1">Sources trouvées :</p>
                  <ul className="space-y-1">
                    {searchResult.sources.map((src, idx) => (
                      <li key={idx} className="truncate">
                        🔗 <a href={src.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{src.title}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                id="ai-paste-search"
                onClick={handlePasteSearchResult}
                className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-1.5 px-3 rounded-md text-[11px] flex items-center justify-center space-x-1.5 shadow"
              >
                <Copy className="h-3 w-3" />
                <span>Copier & coller dans la feuille</span>
              </button>
            </div>
          )}
        </div>

        {/* Module 4: Rédaction automatique de pages */}
        <div className="pt-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">4. Générateur de pages</h3>
          <p className="text-xs text-slate-500 mb-3 leading-relaxed">
            Composer un document entier automatiquement selon vos instructions.
          </p>

          <div className="space-y-3">
            <div>
              <label htmlFor="doc-type-select" className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                Choisissez l'un des {docTypes.length} formats de documents :
              </label>
              <select
                id="doc-type-select"
                value={genType}
                onChange={(e) => setGenType(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-2 outline-none text-xs text-slate-700 font-medium focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition shadow-xs"
              >
                {docTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <textarea
              id="ai-prompt-input"
              value={genPrompt}
              onChange={(e) => setGenPrompt(e.target.value)}
              placeholder="Ex: Rédige une lettre de contestation polie mais ferme pour un abonnement..."
              rows={3}
              className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 outline-none text-xs focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-slate-705"
            />

            <button
              id="ai-generate-submit"
              onClick={handleGenerate}
              disabled={genLoading || !genPrompt.trim()}
              className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition ${
                genLoading || !genPrompt.trim()
                  ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm'
              }`}
            >
              {genLoading ? (
                <>
                  <Loader className="h-4 w-4 text-white animate-spin" />
                  <span>Génération par l'IA...</span>
                </>
              ) : (
                <>
                  <FilePlus className="h-4 w-4" />
                  <span>Générer d'un clic</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Module 5: Conversion & Export réel PDF / DOCX */}
        <div className="pt-4 pb-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">5. Convertisseur de Document</h3>
          <p className="text-xs text-slate-500 mb-3 leading-relaxed">
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
    </div>
  );
}
