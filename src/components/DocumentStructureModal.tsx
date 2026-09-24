import { useState, useEffect } from 'react';
import { Layers, FileText, Check, X, Sparkles, MoveUp, MoveDown, Eye, AlignLeft, BarChart3, AlertCircle } from 'lucide-react';
import { WordDocument } from '../types';

interface DocumentStructureModalProps {
  isOpen: boolean;
  isDarkMode?: boolean;
  accentColor?: string;
  onClose: () => void;
  activeDoc: WordDocument | null;
  onUpdateContentHtml: (newContentHtml: string) => void;
}

interface StructureNode {
  id: string;
  type: 'h1' | 'h2' | 'h3' | 'p' | 'table';
  text: string;
  fullHtml: string;
}

export default function DocumentStructureModal({
  isOpen,
  isDarkMode = false,
  accentColor = '#1d4ed8',
  onClose,
  activeDoc,
  onUpdateContentHtml,
}: DocumentStructureModalProps) {
  const [nodes, setNodes] = useState<StructureNode[]>([]);
  const [activeTab, setActiveTab] = useState<'hierarchy' | 'readability'>('hierarchy');
  const [fleschScore, setFleschScore] = useState(72);
  const [passiveVoicePercent, setPassiveVoicePercent] = useState(14);
  const [sentenceAvgWords, setSentenceAvgWords] = useState(18);

  useEffect(() => {
    if (!isOpen || !activeDoc) return;

    // Parse Document Structure from HTML
    const container = document.createElement('div');
    container.innerHTML = activeDoc.content;

    const parsedNodes: StructureNode[] = [];
    let count = 0;

    container.childNodes.forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const el = child as HTMLElement;
        const tag = el.tagName.toLowerCase();

        if (['h1', 'h2', 'h3', 'p', 'table'].includes(tag)) {
          parsedNodes.push({
            id: `node-${Date.now()}-${count++}`,
            type: tag as any,
            text: el.innerText.trim() || `[Bloc ${tag.toUpperCase()}]`,
            fullHtml: el.outerHTML,
          });
        }
      }
    });

    setNodes(parsedNodes);

    // Calculate Flesch-Kincaid & Readability Metrics for French
    const plainText = container.innerText || '';
    const words = plainText.split(/\s+/).filter((w) => w.length > 0);
    const sentences = plainText.split(/[.!?]+/).filter((s) => s.trim().length > 0);

    if (words.length > 0 && sentences.length > 0) {
      const avgSentence = Math.round(words.length / sentences.length);
      setSentenceAvgWords(avgSentence);

      // Flesch score French adaptation: 207 - (1.015 * words/sentences) - (73.6 * syllables/words)
      const approxSyllables = words.reduce((acc, w) => acc + Math.max(1, w.match(/[aeiouyàâéèêëîïôöùûü]/gi)?.length || 1), 0);
      const score = Math.round(207 - 1.015 * (words.length / sentences.length) - 73.6 * (approxSyllables / words.length));
      setFleschScore(Math.min(100, Math.max(30, score)));

      // Passive voice detection approximation in French ("a été", "est réalisé", "par")
      const passiveMatches = plainText.match(/\b(a été|ont été|est|sont)\s+[a-zàâéèêëîïôöùûüç]+(é|és|ée|ées)\b/gi);
      const passiveCount = passiveMatches ? passiveMatches.length : 0;
      setPassiveVoicePercent(Math.min(100, Math.round((passiveCount / sentences.length) * 100)));
    }
  }, [isOpen, activeDoc]);

  const moveNode = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= nodes.length) return;

    const updated = [...nodes];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setNodes(updated);
  };

  const handleApplyReorderedStructure = () => {
    const combinedHtml = nodes.map((n) => n.fullHtml).join('\n');
    onUpdateContentHtml(combinedHtml);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div
        className={`w-full max-w-2xl rounded-3xl shadow-2xl border p-6 font-sans overflow-hidden transition-all ${
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
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Analyse Sémantique & Score de Style NLP</h3>
              <p className="text-xs text-slate-500">Découpage fonctionnel de la hiérarchie et métriques de lisibilité</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex space-x-2 my-4 border-b border-slate-200 dark:border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('hierarchy')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'hierarchy'
                ? 'bg-blue-600 text-white shadow-xs'
                : isDarkMode
                ? 'bg-slate-800 text-slate-400'
                : 'bg-slate-100 text-slate-600'
            }`}
            style={activeTab === 'hierarchy' ? { backgroundColor: accentColor } : {}}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Hiérarchie & Chapitres ({nodes.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('readability')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'readability'
                ? 'bg-blue-600 text-white shadow-xs'
                : isDarkMode
                ? 'bg-slate-800 text-slate-400'
                : 'bg-slate-100 text-slate-600'
            }`}
            style={activeTab === 'readability' ? { backgroundColor: accentColor } : {}}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Score Flesch-Kincaid & Style</span>
          </button>
        </div>

        {activeTab === 'hierarchy' ? (
          /* Tree View & Drag Re-order */
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase text-slate-400">
              Déplacer ou réorganiser les chapitres sans altérer la mise en forme :
            </span>
            <div
              className={`p-3 rounded-2xl border space-y-2 h-64 overflow-y-auto text-xs ${
                isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              {nodes.map((node, index) => (
                <div
                  key={node.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between transition ${
                    node.type === 'h1'
                      ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 font-bold'
                      : node.type === 'h2'
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 font-semibold pl-6'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 pl-8'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate pr-2">
                    <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono font-bold">
                      {node.type}
                    </span>
                    <span className="truncate text-slate-800 dark:text-slate-200 font-serif text-xs">
                      {node.text}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      disabled={index === 0}
                      onClick={() => moveNode(index, 'up')}
                      className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 cursor-pointer"
                      title="Monter"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      disabled={index === nodes.length - 1}
                      onClick={() => moveNode(index, 'down')}
                      className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 cursor-pointer"
                      title="Descendre"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Style & Readability Dashboard */
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl border text-center space-y-1 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800">
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{fleschScore}/100</span>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Score de Lisibilité</p>
                <p className="text-[10px] text-slate-500">Formule Flesch-Kincaid (Français)</p>
              </div>

              <div className="p-4 rounded-2xl border text-center space-y-1 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800">
                <span className="text-2xl font-black text-purple-600 dark:text-purple-400">{passiveVoicePercent}%</span>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Voix Passive</p>
                <p className="text-[10px] text-slate-500">Phrases passives détectées</p>
              </div>

              <div className="p-4 rounded-2xl border text-center space-y-1 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800">
                <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{sentenceAvgWords}</span>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Mots / Phrase</p>
                <p className="text-[10px] text-slate-500">Moyenne de longueur des phrases</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <h4 className="font-bold flex items-center space-x-1.5 text-slate-800 dark:text-slate-200">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span>Recommandations Stylistiques ManixGPT :</span>
              </h4>
              <ul className="space-y-1 text-slate-600 dark:text-slate-400 list-disc pl-5 text-[11px]">
                <li>
                  {fleschScore > 65
                    ? 'Le niveau de lisibilité est fluide et adapté à un public professionnel.'
                    : 'Le texte contient des structures complexes. Pensez à scinder les phrases de plus de 25 mots.'}
                </li>
                <li>
                  {passiveVoicePercent < 20
                    ? 'Excellent usage de la voix active pour dynamiser la lecture.'
                    : 'Convertissez certaines phrases passives vers la voix active pour un ton plus percutant.'}
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">Extraction NLP : Layout Analysis & Entity Extraction</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Fermer
            </button>
            {activeTab === 'hierarchy' && (
              <button
                onClick={handleApplyReorderedStructure}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md flex items-center space-x-1.5 transition cursor-pointer"
                style={{ backgroundColor: accentColor }}
              >
                <Check className="w-4 h-4" />
                <span>Appliquer la réorganisation</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
