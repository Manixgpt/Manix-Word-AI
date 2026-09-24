import React from 'react';
import { X, Check, FileText, Layout, Sparkles, FilePlus, Eye } from 'lucide-react';
import { Template } from '../types';

interface TemplatePreviewModalProps {
  isOpen: boolean;
  template: Template | null;
  isDarkMode?: boolean;
  accentColor?: string;
  onClose: () => void;
  onSelectTemplate: (template: Template) => void;
}

export default function TemplatePreviewModal({
  isOpen,
  template,
  isDarkMode = false,
  accentColor = '#1d4ed8',
  onClose,
  onSelectTemplate,
}: TemplatePreviewModalProps) {
  if (!isOpen || !template) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div
        className={`w-full max-w-4xl rounded-2xl shadow-2xl border flex flex-col overflow-hidden max-h-[90vh] transition-all ${
          isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Modal Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between shrink-0 ${isDarkMode ? 'border-slate-800 bg-slate-950/60' : 'border-slate-100 bg-slate-50/80'}`}>
          <div className="flex items-center space-x-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
              style={{ backgroundColor: accentColor }}
            >
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">{template.title}</h3>
              <p className="text-xs text-slate-400">Aperçu de la structure et du style avant création</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Template Information & Specs */}
          <div className="md:col-span-5 space-y-4">
            <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-2">Description</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{template.description}</p>
            </div>

            <div className={`p-4 rounded-xl border space-y-3 ${isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Spécifications du modèle</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Police par défaut :</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{template.style.fontFamily}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Taille de texte :</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{template.style.fontSize} pt</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Marges :</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200 capitalize">{template.style.margin}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Orientation :</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200 capitalize">{template.style.orientation}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Numérotation des pages :</span>
                  <span className="font-semibold text-emerald-500">Inclus</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-900 dark:text-blue-300 text-xs flex items-center space-x-2.5">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                Prêt à l'emploi. Le modèle contient des sections et structures pré-rédigées prêtes à être personnalisées par ManixGPT.
              </span>
            </div>
          </div>

          {/* Right Column: Visual Sheet Replica Preview */}
          <div className="md:col-span-7 flex flex-col items-center">
            <div className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">
              Aperçu visuel A4
            </div>

            {/* A4 Page Representation Container */}
            <div className="w-full max-w-md bg-white border border-slate-300 shadow-xl rounded-lg p-6 text-slate-800 font-sans text-xs min-h-[380px] overflow-hidden relative font-serif">
              <div className="border-b pb-2 mb-4 flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-widest font-sans">
                <span>Manix Word Official Template</span>
                <span>Page 1</span>
              </div>

              {/* Live Rendered Content Preview */}
              <div
                className="prose prose-xs max-w-none text-slate-800 leading-snug"
                dangerouslySetInnerHTML={{ __html: template.content.slice(0, 900) + '...' }}
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className={`px-6 py-4 border-t flex items-center justify-between shrink-0 ${isDarkMode ? 'border-slate-800 bg-slate-950/80' : 'border-slate-100 bg-slate-50'}`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
              isDarkMode ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-slate-300 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Fermer
          </button>

          <button
            onClick={() => {
              onSelectTemplate(template);
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 flex items-center space-x-2 cursor-pointer"
            style={{ backgroundColor: accentColor }}
          >
            <Check className="w-4 h-4" />
            <span>Utiliser ce modèle</span>
          </button>
        </div>
      </div>
    </div>
  );
}
