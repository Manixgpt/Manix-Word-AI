import { useState, useEffect } from 'react';
import { Sparkles, BookOpen, X, Search, Check, ArrowRight, CornerDownLeft, RefreshCw, Volume2 } from 'lucide-react';
import { SynonymItem, SynonymResult } from '../types';

interface SynonymDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedWord: string;
  contextSentence?: string;
  onReplaceWord: (newWord: string) => void;
}

export default function SynonymDrawer({
  isOpen,
  onClose,
  selectedWord,
  contextSentence,
  onReplaceWord,
}: SynonymDrawerProps) {
  const [searchTerm, setSearchTerm] = useState(selectedWord || '');
  const [result, setResult] = useState<SynonymResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'courant' | 'soutenu' | 'précis' | 'littéraire'>('all');
  const [justReplacedWord, setJustReplacedWord] = useState<string | null>(null);

  useEffect(() => {
    if (selectedWord) {
      setSearchTerm(selectedWord.trim());
      fetchSynonyms(selectedWord.trim(), contextSentence);
    }
  }, [selectedWord, contextSentence]);

  const fetchSynonyms = async (wordToSearch: string, ctx?: string) => {
    if (!wordToSearch || !wordToSearch.trim()) return;
    setIsLoading(true);
    setJustReplacedWord(null);

    try {
      const response = await fetch('/api/ai/synonyms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: wordToSearch.trim(),
          context: ctx || ''
        }),
      });

      if (response.ok) {
        const data: SynonymResult = await response.json();
        setResult(data);
      }
    } catch (error) {
      console.error('Failed to fetch synonyms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const filteredSynonyms = (result?.synonyms || []).filter((s) => {
    if (activeTab === 'all') return true;
    return s.category === activeTab;
  });

  const handleSelectSynonym = (synWord: string) => {
    onReplaceWord(synWord);
    setJustReplacedWord(synWord);
    setTimeout(() => {
      setJustReplacedWord(null);
    }, 2000);
  };

  const getRegisterBadge = (cat?: string) => {
    switch (cat) {
      case 'soutenu':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'courant':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'familier':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'littéraire':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'précis':
      case 'moderne':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div
      id="synonym-dictionary-drawer"
      className="fixed right-0 top-0 bottom-0 w-96 bg-white shadow-2xl border-l border-slate-300 z-50 flex flex-col font-sans select-none animate-in slide-in-from-right duration-200"
    >
      {/* Header Word Style */}
      <div className="bg-[#2b579a] text-white px-5 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-blue-200" />
          </div>
          <div>
            <h2 className="text-sm font-bold leading-tight flex items-center gap-1.5">
              Dictionnaire de Synonymes
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
            </h2>
            <p className="text-[11px] text-blue-150">Suggestions intelligentes & nuances</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-white/10 rounded-full transition text-blue-100 hover:text-white"
          title="Fermer le dictionnaire"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-slate-50 border-b border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchSynonyms(searchTerm);
          }}
          className="relative flex items-center"
        >
          <Search className="w-4 h-4 absolute left-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un mot ou synonyme..."
            className="w-full pl-9 pr-16 py-2 bg-white border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#2b579a] focus:ring-1 focus:ring-[#2b579a]"
          />
          <button
            type="submit"
            disabled={isLoading || !searchTerm.trim()}
            className="absolute right-1 px-2.5 py-1 bg-[#2b579a] text-white text-[11px] font-medium rounded hover:bg-[#1e3f70] transition disabled:opacity-50"
          >
            {isLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : 'Chercher'}
          </button>
        </form>

        {result?.word && (
          <div className="mt-2.5 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-800 capitalize">« {result.word} »</span>
              <span className="text-[10px] text-slate-500 font-medium">
                ({result.synonyms?.length || 0} synonymes)
              </span>
            </div>
            {justReplacedWord && (
              <span className="text-[10px] text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded font-medium animate-pulse flex items-center gap-1">
                <Check className="w-3 h-3" /> Inséré : {justReplacedWord}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-100/60 px-3 pt-2 text-[11px] font-medium space-x-1 overflow-x-auto">
        {(['all', 'courant', 'soutenu', 'précis', 'littéraire'] as const).map((tab) => {
          const labels: Record<string, string> = {
            all: 'Tous',
            courant: 'Courant',
            soutenu: 'Soutenu',
            précis: 'Précis',
            littéraire: 'Littéraire',
          };
          const count =
            tab === 'all'
              ? result?.synonyms?.length || 0
              : (result?.synonyms || []).filter((s) => s.category === tab).length;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2.5 py-1.5 rounded-t-md transition whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-white text-[#2b579a] font-semibold border-t border-l border-r border-slate-200 -mb-px shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {labels[tab]} ({count})
            </button>
          );
        })}
      </div>

      {/* Synonyms List Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f8fafc]">
        {isLoading ? (
          <div className="py-16 text-center">
            <RefreshCw className="w-7 h-7 text-[#2b579a] animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-600 font-medium">Recherche des meilleurs synonymes...</p>
            <p className="text-[11px] text-slate-400 mt-1">Analyse contextuelle par l'IA</p>
          </div>
        ) : filteredSynonyms.length === 0 ? (
          <div className="py-12 text-center px-4">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xs font-semibold text-slate-700 mb-1">
              {searchTerm ? 'Aucun synonyme trouvé' : 'Sélectionnez un mot'}
            </h3>
            <p className="text-[11px] text-slate-500 max-w-[220px] mx-auto">
              {searchTerm
                ? 'Essayez de chercher un terme générique ou une forme au singulier/infinitif.'
                : "Double-cliquez sur un mot dans votre document pour découvrir ses équivalents."}
            </p>
          </div>
        ) : (
          <>
            <div className="text-[11px] text-slate-500 font-medium mb-1 flex items-center justify-between">
              <span>Cliquez sur un mot pour remplacer la sélection :</span>
            </div>

            {filteredSynonyms.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectSynonym(item.word)}
                className="group bg-white p-3 rounded-lg border border-slate-200 hover:border-[#2b579a] hover:shadow-md transition cursor-pointer text-left relative"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-[#2b579a] transition">
                      {item.word}
                    </span>
                    {item.category && (
                      <span
                        className={`text-[9px] uppercase font-semibold px-1.5 py-0.2 rounded border ${getRegisterBadge(
                          item.category
                        )}`}
                      >
                        {item.category}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    className="opacity-0 group-hover:opacity-100 transition px-2 py-0.5 bg-[#2b579a] text-white text-[10px] rounded font-medium flex items-center space-x-1 shadow-xs"
                  >
                    <span>Remplacer</span>
                    <CornerDownLeft className="w-2.5 h-2.5" />
                  </button>
                </div>

                {item.definition && (
                  <p className="text-[11px] text-slate-600 leading-relaxed mb-1">
                    {item.definition}
                  </p>
                )}

                {item.example && (
                  <p className="text-[10.5px] text-slate-400 italic bg-slate-50 rounded px-2 py-1 border border-slate-100 mt-1.5">
                    « {item.example} »
                  </p>
                )}
              </div>
            ))}

            {/* Antonyms Section */}
            {result?.antonyms && result.antonyms.length > 0 && (
              <div className="mt-5 pt-4 border-t border-slate-200">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
                  <span>Antonymes (sens contraire)</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {result.antonyms.map((ant, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectSynonym(ant)}
                      className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded text-xs transition cursor-pointer"
                      title="Cliquer pour insérer"
                    >
                      ≠ {ant}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Expressions Section */}
            {result?.expressions && result.expressions.length > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-200">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Expressions & Locutions
                </h4>
                <ul className="space-y-1 text-xs text-slate-600">
                  {result.expressions.map((exp, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>{exp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-white border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
        <span className="text-slate-400">Raccourci clavier : Shift+F7</span>
        <button
          onClick={() => fetchSynonyms(searchTerm)}
          disabled={isLoading || !searchTerm}
          className="text-[#2b579a] font-medium hover:underline flex items-center gap-1"
        >
          <RefreshCw className="w-3 h-3" /> Actualiser
        </button>
      </div>
    </div>
  );
}
