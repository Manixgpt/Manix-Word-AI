import { useState } from 'react';
import { 
  CheckCircle, AlertTriangle, Sparkles, X, ChevronRight, Check, 
  ArrowRight, RefreshCw, BookOpen, ShieldCheck, Zap, ToggleLeft, ToggleRight
} from 'lucide-react';
import { GrammarIssue } from '../types';

interface GrammarPanelProps {
  isOpen: boolean;
  onClose: () => void;
  issues: GrammarIssue[];
  isAnalyzing: boolean;
  onFixIssue: (issue: GrammarIssue) => void;
  onFixAllIssues: () => void;
  onRecheck: () => void;
  autoFixOnType: boolean;
  onToggleAutoFix: () => void;
}

export default function GrammarPanel({
  isOpen,
  onClose,
  issues,
  isAnalyzing,
  onFixIssue,
  onFixAllIssues,
  onRecheck,
  autoFixOnType,
  onToggleAutoFix,
}: GrammarPanelProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'grammaire' | 'accord' | 'orthographe'>('all');
  const [fixedIssueIds, setFixedIssueIds] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  const filteredIssues = issues.filter(iss => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'grammaire') return iss.type === 'grammaire' || iss.type === 'conjugaison';
    if (activeFilter === 'accord') return iss.type === 'accord';
    if (activeFilter === 'orthographe') return iss.type === 'orthographe' || iss.type === 'homophone';
    return true;
  });

  const handleFixSingle = (issue: GrammarIssue) => {
    setFixedIssueIds(prev => new Set(prev).add(issue.id));
    onFixIssue(issue);
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'accord':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'grammaire':
      case 'conjugaison':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'orthographe':
      case 'homophone':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'ponctuation':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div 
      id="grammar-analysis-drawer" 
      className="fixed right-0 top-0 bottom-0 w-96 bg-white shadow-2xl border-l border-slate-300 z-50 flex flex-col font-sans select-none animate-in slide-in-from-right duration-200"
    >
      {/* Header */}
      <div className="bg-[#2b579a] text-white px-5 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-blue-200" />
          </div>
          <div>
            <h2 className="text-sm font-bold leading-tight">Analyse Grammaticale en direct</h2>
            <p className="text-[11px] text-blue-150">Correcteur intelligent temps réel</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-1.5 hover:bg-white/10 rounded-full transition text-blue-100 hover:text-white"
          title="Fermer le panneau"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Real-time Status Banner */}
      <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 text-[#2b579a] animate-spin" />
              <span className="text-slate-600 font-medium">Analyse en cours...</span>
            </>
          ) : issues.length === 0 ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-green-700 font-medium">Document impeccable</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span className="text-slate-700 font-medium">
                <strong className="text-amber-700">{issues.length}</strong> {issues.length > 1 ? 'fautes détectées' : 'faute détectée'}
              </span>
            </>
          )}
        </div>

        <button
          onClick={onRecheck}
          disabled={isAnalyzing}
          className="px-2.5 py-1 text-[11px] font-medium text-[#2b579a] hover:bg-blue-50 rounded border border-blue-200 transition flex items-center space-x-1"
          title="Relancer une vérification immédiate"
        >
          <RefreshCw className={`w-3 h-3 ${isAnalyzing ? 'animate-spin' : ''}`} />
          <span>Analyser</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-100/60 px-3 pt-2 text-[11px] font-medium space-x-1">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-t-md transition ${
            activeFilter === 'all'
              ? 'bg-white text-[#2b579a] font-semibold border-t border-l border-r border-slate-200 -mb-px'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Toutes ({issues.length})
        </button>
        <button
          onClick={() => setActiveFilter('grammaire')}
          className={`px-3 py-1.5 rounded-t-md transition ${
            activeFilter === 'grammaire'
              ? 'bg-white text-[#2b579a] font-semibold border-t border-l border-r border-slate-200 -mb-px'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Grammaire
        </button>
        <button
          onClick={() => setActiveFilter('accord')}
          className={`px-3 py-1.5 rounded-t-md transition ${
            activeFilter === 'accord'
              ? 'bg-white text-[#2b579a] font-semibold border-t border-l border-r border-slate-200 -mb-px'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Accords
        </button>
        <button
          onClick={() => setActiveFilter('orthographe')}
          className={`px-3 py-1.5 rounded-t-md transition ${
            activeFilter === 'orthographe'
              ? 'bg-white text-[#2b579a] font-semibold border-t border-l border-r border-slate-200 -mb-px'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Orthographe
        </button>
      </div>

      {/* Issues List Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f8fafc]">
        {filteredIssues.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 border border-green-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800 mb-1">Aucune faute à signaler</h3>
            <p className="text-xs text-slate-500 max-w-[240px] mx-auto">
              L'analyse grammaticale en direct n'a trouvé aucune faute d'accord ou d'orthographe dans votre texte.
            </p>
          </div>
        ) : (
          filteredIssues.map((issue) => {
            const isFixed = fixedIssueIds.has(issue.id);
            return (
              <div
                key={issue.id}
                className={`bg-white rounded-lg p-3.5 border transition shadow-sm ${
                  isFixed 
                    ? 'border-green-300 bg-green-50/40 opacity-70' 
                    : 'border-slate-200 hover:border-[#2b579a]/50 hover:shadow'
                }`}
              >
                {/* Header item */}
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getBadgeColor(issue.type)}`}>
                    {issue.type}
                  </span>
                  {isFixed && (
                    <span className="text-[10px] text-green-700 font-semibold flex items-center">
                      <Check className="w-3 h-3 mr-1" /> Corrigé
                    </span>
                  )}
                </div>

                {/* Diff Segment */}
                <div className="bg-slate-50 rounded p-2 border border-slate-200 text-xs mb-2">
                  <div className="flex items-center text-slate-700">
                    <span className="line-through text-rose-600 bg-rose-50 px-1 py-0.5 rounded font-mono font-medium">
                      {issue.original}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 mx-2 text-slate-400 shrink-0" />
                    <span className="text-green-700 bg-green-50 px-1.5 py-0.5 rounded font-mono font-semibold">
                      {issue.replacement}
                    </span>
                  </div>
                  {issue.context && (
                    <p className="text-[11px] text-slate-500 mt-1.5 italic border-t border-slate-200/60 pt-1">
                      « ...{issue.context}... »
                    </p>
                  )}
                </div>

                {/* Explanation */}
                <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                  {issue.explanation}
                </p>

                {/* Fix Action Button */}
                {!isFixed && (
                  <button
                    onClick={() => handleFixSingle(issue)}
                    className="w-full py-1.5 bg-[#2b579a] hover:bg-blue-800 text-white rounded text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-sm transition"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Remplacer par « {issue.replacement} »</span>
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer Bulk Actions */}
      <div className="bg-white border-t border-slate-200 p-4 space-y-2.5">
        {issues.length > 0 && (
          <button
            onClick={onFixAllIssues}
            className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-xs font-bold flex items-center justify-center space-x-2 shadow transition cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            <span>Corriger toutes les fautes ({issues.length})</span>
          </button>
        )}

        <div className="flex items-center justify-between text-xs text-slate-600 pt-1 border-t border-slate-100">
          <span className="text-[11px] font-medium">Vérification automatique en continu</span>
          <button 
            onClick={onToggleAutoFix}
            className="text-[#2b579a] hover:text-blue-900 transition flex items-center"
            title="Activer ou désactiver l'analyse en arrière-plan pendant la frappe"
          >
            {autoFixOnType ? (
              <ToggleRight className="w-5 h-5 text-[#2b579a]" />
            ) : (
              <ToggleLeft className="w-5 h-5 text-slate-400" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
