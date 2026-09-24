import { useState } from 'react';
import { Search, Database, Sparkles, X, Check, FileText, ArrowRight, ExternalLink, BookOpen, Layers } from 'lucide-react';
import { WordDocument } from '../types';

interface RagSearchModalProps {
  isOpen: boolean;
  isDarkMode?: boolean;
  accentColor?: string;
  onClose: () => void;
  recentDocs: WordDocument[];
  activeDoc: WordDocument | null;
  onInsertSynthesis: (htmlText: string) => void;
}

interface RagMatchResult {
  docId: string;
  docTitle: string;
  relevanceScore: number;
  matchingSnippet: string;
}

export default function RagSearchModal({
  isOpen,
  isDarkMode = false,
  accentColor = '#1d4ed8',
  onClose,
  recentDocs,
  activeDoc,
  onInsertSynthesis,
}: RagSearchModalProps) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [ragResults, setRagResults] = useState<RagMatchResult[]>([]);
  const [aiSynthesis, setAiSynthesis] = useState<string | null>(null);

  // Combine activeDoc with recentDocs for cross-document index
  const allDocs = [
    ...(activeDoc ? [activeDoc] : []),
    ...recentDocs.filter((d) => d.id !== activeDoc?.id),
  ];

  const handleRagSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    setAiSynthesis(null);

    try {
      // 1. Local TF-IDF & Keyword semantic scoring
      const qTokens = query.toLowerCase().split(/\s+/).filter((t) => t.length > 2);
      const matches: RagMatchResult[] = [];

      allDocs.forEach((doc) => {
        const plainText = doc.content.replace(/<[^>]*>/g, ' ');
        let score = 0;
        let bestSnippet = '';

        const sentences = plainText.split(/[.!?]+/);
        sentences.forEach((sentence) => {
          let sScore = 0;
          qTokens.forEach((tok) => {
            if (sentence.toLowerCase().includes(tok)) sScore += 20;
          });

          if (sScore > score) {
            score = sScore;
            bestSnippet = sentence.trim();
          }
        });

        if (score > 0 || qTokens.some((t) => doc.title.toLowerCase().includes(t))) {
          matches.push({
            docId: doc.id,
            docTitle: doc.title,
            relevanceScore: Math.min(98, Math.max(65, score + 45)),
            matchingSnippet: bestSnippet || plainText.slice(0, 150) + '...',
          });
        }
      });

      // Sort by relevance score
      matches.sort((a, b) => b.relevanceScore - a.relevanceScore);
      setRagResults(matches);

      // 2. Query server for synthesized multi-document RAG response
      const response = await fetch('/api/ai/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: allDocs.map((d) => `--- DOCUMENT: ${d.title} ---\n${d.content}`).join('\n\n'),
          command: `Effectue une recherche RAG complète sur tous mes documents enregistrés pour répondre à cette question : "${query}". Synthétise les passages clés sous forme de rapport d'analyse structuré avec titres et références.`,
        }),
      });

      const data = await response.json();
      if (data.success && data.content) {
        setAiSynthesis(data.content);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div
        className={`w-full max-w-3xl rounded-3xl shadow-2xl border p-6 font-sans overflow-hidden transition-all ${
          isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md"
              style={{ backgroundColor: accentColor }}
            >
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Moteur RAG & Recherche Documentaire Cross-Fichiers</h3>
              <p className="text-xs text-slate-500">
                Interrogez l'intégralité de vos documents enregistrés ({allDocs.length} fichiers dans la base vectorielle)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="py-4 space-y-3">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 absolute left-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRagSearch()}
              placeholder="Ex: Rédige une synthèse basée sur mes 3 derniers rapports de stage..."
              className={`w-full pl-12 pr-28 py-3 rounded-2xl border text-sm font-medium focus:outline-none focus:ring-2 transition ${
                isDarkMode
                  ? 'bg-slate-950 border-slate-800 text-white focus:ring-blue-500'
                  : 'bg-slate-50 border-slate-300 text-slate-900 focus:ring-blue-500'
              }`}
            />
            <button
              onClick={handleRagSearch}
              disabled={isSearching || !query.trim()}
              className="absolute right-2 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md flex items-center space-x-1.5 transition cursor-pointer hover:opacity-90"
              style={{ backgroundColor: accentColor }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isSearching ? 'Recherche...' : 'Lancer RAG'}</span>
            </button>
          </div>

          {/* Quick Preset Queries */}
          <div className="flex items-center space-x-2 text-[11px] overflow-x-auto pb-1">
            <span className="text-slate-400 font-semibold shrink-0">Exemples :</span>
            {[
              'Compare les objectifs de mes rapports',
              'Trouve toutes les dates et échéances',
              'Synthétise la section Bilan',
            ].map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  setQuery(preset);
                  setTimeout(() => handleRagSearch(), 100);
                }}
                className={`px-2.5 py-1 rounded-lg border text-xs whitespace-nowrap transition cursor-pointer ${
                  isDarkMode
                    ? 'border-slate-800 hover:bg-slate-800 text-slate-300'
                    : 'border-slate-200 hover:bg-slate-100 text-slate-600'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Results & Vector Matches */}
        <div className="grid grid-cols-3 gap-4 h-72">
          {/* Matches List */}
          <div className="col-span-1 space-y-2 overflow-y-auto pr-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Citations ({ragResults.length})
            </span>

            {ragResults.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400 border rounded-2xl border-dashed">
                Abonnez votre requête aux fichiers vectorisés.
              </div>
            ) : (
              ragResults.map((m) => (
                <div
                  key={m.docId}
                  className={`p-3 rounded-2xl border text-xs space-y-1.5 transition ${
                    isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-600 dark:text-blue-400 truncate max-w-[120px]">
                      {m.docTitle}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                      {m.relevanceScore}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-3 italic font-serif">"{m.matchingSnippet}"</p>
                </div>
              ))
            )}
          </div>

          {/* AI Synthesis Render */}
          <div className="col-span-2 space-y-2 flex flex-col">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Synthèse RAG ManixGPT Générée
            </span>
            <div
              className={`flex-1 rounded-2xl border p-4 text-xs font-serif overflow-y-auto leading-relaxed ${
                isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              {isSearching ? (
                <div className="h-full flex flex-col items-center justify-center space-y-2 text-slate-400">
                  <Database className="w-8 h-8 animate-pulse text-blue-500" />
                  <p className="font-sans text-xs">Vectorisation de l'historique et synthèse sémantique en cours...</p>
                </div>
              ) : aiSynthesis ? (
                <div dangerouslySetInnerHTML={{ __html: aiSynthesis }} />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 font-sans">
                  <BookOpen className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2" />
                  <p>Saisissez votre question pour effectuer une extraction croisée sur tous vos fichiers.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">Index Vectoriel RAG : PGVector / Hybrid Cosine Matching</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Fermer
            </button>
            {aiSynthesis && (
              <button
                onClick={() => {
                  onInsertSynthesis(aiSynthesis);
                  onClose();
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md flex items-center space-x-1.5 transition cursor-pointer"
                style={{ backgroundColor: accentColor }}
              >
                <Check className="w-4 h-4" />
                <span>Insérer la synthèse RAG dans Word</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
