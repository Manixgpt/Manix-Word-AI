import { useState, ChangeEvent } from 'react';
import { Search, FolderOpen, Mail, Clock, FileText, ChevronRight, User } from 'lucide-react';
import { TEMPLATES } from '../templatesData';
import { Template, WordDocument } from '../types';

interface TemplateChooserProps {
  onSelectTemplate: (template: Template) => void;
  recentDocs: WordDocument[];
  onOpenDoc: (doc: WordDocument) => void;
  onImportLocalFile: (event: ChangeEvent<HTMLInputElement>) => void;
  userEmail?: string;
}

/**
 * Renders an outstandingly realistic visual mini-A4 mockup of the document background template
 * to replicate official Word template cards perfectly.
 */
function renderTemplateMockup(id: string) {
  switch (id) {
    case 'blank':
      return (
        <div className="space-y-2 pt-3">
          <div className="w-14 h-1.5 bg-[#2b579a] rounded"></div>
          <div className="w-24 h-0.5 bg-gray-200 rounded"></div>
          <div className="w-28 h-0.5 bg-gray-200 rounded"></div>
          <div className="w-20 h-0.5 bg-gray-200 rounded"></div>
          <div className="w-24 h-0.5 bg-gray-200 rounded"></div>
        </div>
      );
    case 'rapport_activite':
      return (
        <div className="h-full border border-double border-[#2b579a] p-1.5 flex flex-col justify-between pt-4 rounded">
          <div className="text-center space-y-1.5">
            <h4 className="text-[5px] tracking-wide font-extrabold text-[#1a365d] uppercase">RAPPORT ANNUEL</h4>
            <div className="w-8 h-[1px] bg-[#2b579a] mx-auto"></div>
            <div className="w-14 h-0.5 bg-gray-300 mx-auto rounded"></div>
          </div>
          <div className="space-y-1">
            <div className="w-16 h-0.5 bg-gray-200 rounded"></div>
            <div className="w-20 h-0.5 bg-gray-200 rounded"></div>
          </div>
        </div>
      );
    case 'business_plan':
      return (
        <div className="space-y-1.5 pt-1">
          <div className="border-b-2 border-[#1e3a8a] pb-1">
            <h4 className="text-[5px] font-extrabold text-[#1e3a8a] tracking-tight">BUSINESS PLAN</h4>
            <div className="w-16 h-[2px] bg-amber-400 mt-0.5"></div>
          </div>
          <div className="w-24 h-0.5 bg-gray-200 rounded"></div>
          <div className="w-28 h-0.5 bg-gray-200 rounded"></div>
          <div className="mt-2 border border-gray-200 rounded bg-[#f8fafc] p-0.5">
            <div className="grid grid-cols-2 gap-0.5">
              <div className="h-1 bg-slate-300 rounded"></div>
              <div className="h-1 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      );
    case 'compte_rendu':
      return (
        <div className="space-y-1.5 pt-1">
          <div className="bg-[#f8fafc] border-l-2 border-[#0f172a] p-1 space-y-0.5">
            <h4 className="text-[4px] font-bold text-[#0f172a]">COMPTE RENDU</h4>
            <div className="w-12 h-[2px] bg-slate-300 rounded"></div>
          </div>
          <div className="w-24 h-0.5 bg-gray-200 rounded"></div>
          <div className="w-20 h-0.5 bg-gray-200 rounded"></div>
          <div className="w-24 h-0.5 bg-gray-200 rounded"></div>
        </div>
      );
    case 'carte_visite':
      return (
        <div className="border border-gray-300 p-2 rounded bg-slate-50 flex items-center h-[90px] mt-4 relative">
          <div className="border-l-2 border-[#2b579a] pl-1.5 space-y-1 w-full">
            <div className="w-14 h-1 bg-[#2b579a] rounded"></div>
            <div className="w-10 h-0.5 bg-gray-400 rounded"></div>
            <div className="w-16 h-0.5 bg-gray-300 rounded"></div>
          </div>
          <div className="absolute right-1 top-1 w-3 h-3 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-[3px] font-bold text-[#2b579a]">W</span>
          </div>
        </div>
      );
    case 'carte_invitation':
      return (
        <div className="h-full border border-amber-400 p-1.5 flex flex-col justify-center items-center rounded bg-[#faf8f5]">
          <span className="text-[4px] tracking-widest text-[#d4af37] font-bold uppercase text-[5px]">GALA</span>
          <h4 className="text-[6px] tracking-tight text-gray-800 font-serif my-1 font-semibold">INVITATION</h4>
          <div className="w-6 h-[1px] bg-amber-400 my-1"></div>
          <div className="w-16 h-0.5 bg-gray-300 rounded"></div>
        </div>
      );
    case 'flyer_commercial':
      return (
        <div className="h-full flex flex-col justify-between pt-1">
          <div className="bg-[#2b579a] text-white p-1 rounded text-center">
            <h4 className="text-[5px] tracking-wide font-extrabold uppercase">PROSPECTUS</h4>
            <div className="w-10 h-[1px] bg-white mx-auto my-0.5"></div>
          </div>
          <div className="grid grid-cols-2 gap-1 mt-2">
            <div className="border border-gray-200 p-1 bg-slate-50 space-y-0.5 rounded">
              <div className="w-full h-2 bg-blue-100 rounded"></div>
              <div className="w-8 h-0.5 bg-gray-300 rounded"></div>
            </div>
            <div className="border border-gray-200 p-1 bg-slate-50 space-y-0.5 rounded">
              <div className="w-full h-2 bg-purple-100 rounded"></div>
              <div className="w-8 h-0.5 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      );
    case 'affiche_evt':
      return (
        <div className="h-full bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] text-white p-2 rounded flex flex-col justify-between">
          <div className="space-y-1 text-center pt-2">
            <span className="text-[4px] tracking-widest text-blue-200 font-bold uppercase">ÉVÉNEMENT</span>
            <h4 className="text-[6px] font-extrabold tracking-tight leading-3">LAUNCH EVENT</h4>
          </div>
          <div className="bg-white text-[#1e3a8a] py-0.5 px-2 text-center rounded-full text-[4px] scale-[0.8] font-bold">
            INSCRIPTION
          </div>
        </div>
      );
    case 'lettre_affaires':
      return (
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between">
            <div className="w-8 h-1 bg-slate-400 rounded"></div>
            <div className="w-10 h-1 bg-slate-300 rounded"></div>
          </div>
          <div className="w-12 h-0.5 bg-gray-400 rounded pt-1"></div>
          <div className="w-24 h-0.5 bg-gray-200 rounded"></div>
          <div className="w-28 h-0.5 bg-gray-200 rounded"></div>
          <div className="w-20 h-0.5 bg-gray-205 rounded"></div>
          <div className="w-14 h-[2px] bg-slate-400 rounded mt-4"></div>
        </div>
      );
    case 'lettre_remerciement':
      return (
        <div className="h-full flex flex-col justify-between pt-4">
          <div className="text-center space-y-1">
            <h4 className="text-[6px] tracking-widest text-[#2b579a] font-serif font-bold">MERCI</h4>
            <div className="w-6 h-[1px] bg-amber-400 mx-auto"></div>
          </div>
          <div className="space-y-1 px-1">
            <div className="w-24 h-0.5 bg-gray-200 rounded mx-auto"></div>
            <div className="w-20 h-0.5 bg-gray-200 rounded mx-auto"></div>
          </div>
          <div className="w-10 h-0.5 bg-slate-300 ml-auto mr-1 pb-1"></div>
        </div>
      );
    case 'syllabus_cours':
      return (
        <div className="h-full flex flex-col justify-between pt-1">
          <div className="bg-[#1e3a8a] text-white p-1 rounded text-center">
            <h4 className="text-[4px] font-bold tracking-tight uppercase">SYLLABUS ACADÉMIQUE</h4>
          </div>
          <div className="space-y-1 mt-2">
            <div className="w-16 h-1 bg-gray-300 rounded"></div>
            <div className="grid grid-cols-2 gap-0.5 border border-gray-200 p-0.5 rounded">
              <div className="h-1.5 bg-slate-105 rounded"></div>
              <div className="h-1.5 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      );
    case 'rapport_stage':
      return (
        <div className="h-full border border-gray-200 p-1.5 flex flex-col justify-between rounded">
          <div className="text-center space-y-1 pt-3">
            <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
              <span className="text-[4px] font-bold text-[#1e3a8a]">U</span>
            </div>
            <h4 className="text-[5px] font-bold text-gray-700 tracking-tight leading-3">RAPPORT DE STAGE</h4>
          </div>
          <div className="w-20 h-[2px] bg-blue-400 mx-auto"></div>
        </div>
      );
    case 'cv':
      return (
        <div className="h-full border-t-2 border-[#b53826] flex flex-col justify-between pt-1">
          <div className="flex justify-between items-center border-b border-gray-100 pb-1">
            <div className="space-y-0.5">
              <div className="w-14 h-1.5 bg-slate-800 rounded"></div>
              <div className="w-16 h-0.5 bg-slate-400 rounded"></div>
            </div>
            <div className="w-4 h-4 rounded-full bg-gray-100 border border-gray-200 flex-shrink-0"></div>
          </div>
          <div className="space-y-1 mt-1 flex-1">
            <div className="w-10 h-1 bg-[#b53826] rounded"></div>
            <div className="w-24 h-0.5 bg-gray-200 rounded"></div>
            <div className="w-20 h-0.5 bg-gray-200 rounded"></div>
          </div>
        </div>
      );
    case 'lette_motivation':
      return (
        <div className="space-y-1.5 pt-1">
          <div className="w-14 h-1 bg-red-600 rounded"></div>
          <div className="w-20 h-0.5 bg-gray-300 rounded"></div>
          <div className="w-14 h-0.5 bg-gray-300 rounded"></div>
          <div className="w-24 h-0.5 bg-gray-200 rounded"></div>
          <div className="w-24 h-0.5 bg-gray-200 rounded"></div>
        </div>
      );
    case 'cv_minimaliste':
      return (
        <div className="space-y-1.5 pt-2 text-center">
          <div className="space-y-0.5">
            <h4 className="text-[5px] tracking-wide font-extrabold text-gray-800">Zuraide Elorriaga</h4>
            <div className="w-12 h-0.5 bg-gray-400 mx-auto"></div>
          </div>
          <div className="w-24 h-0.5 bg-gray-200 mx-auto rounded"></div>
          <div className="w-20 h-0.5 bg-gray-200 mx-auto rounded"></div>
          <div className="w-24 h-0.5 bg-gray-200 mx-auto rounded"></div>
        </div>
      );
    case 'invit_anniv':
      return (
        <div className="h-full bg-[#ff6b6b] text-white p-2 rounded flex flex-col justify-between text-center">
          <div className="space-y-0.5 pt-2">
            <span className="text-xs">🎂</span>
            <h4 className="text-[5px] font-extrabold uppercase tracking-widest text-[#fff]">ANNIVERSAIRE</h4>
          </div>
          <div className="bg-white text-[#ff6b6b] py-0.5 px-2 rounded-full text-[4px] font-bold mx-auto scale-[0.9]">
            INVITATION
          </div>
        </div>
      );
    case 'menu_fete':
      return (
        <div className="h-full border border-dashed border-[#e08e79] p-1.5 flex flex-col justify-between items-center bg-[#fffaf9] rounded">
          <span className="text-[4px] text-[#e08e79] font-serif font-bold tracking-widest uppercase text-[4px]">CONVIVES</span>
          <h4 className="text-[6px] text-gray-800 font-serif my-0.5 font-bold">REPAS DE NOCES</h4>
          <div className="space-y-1 w-full pt-1">
            <div className="w-16 h-0.5 bg-gray-200 mx-auto"></div>
            <div className="w-20 h-0.5 bg-gray-200 mx-auto"></div>
          </div>
        </div>
      );
    default:
      return (
        <div className="space-y-2 pt-3">
          <div className="w-12 h-1 bg-[#2b579a] rounded"></div>
          <div className="w-20 h-0.5 bg-gray-200 rounded"></div>
        </div>
      );
  }
}

export default function TemplateChooser({
  onSelectTemplate,
  recentDocs,
  onOpenDoc,
  onImportLocalFile,
  userEmail = '23iw064si@esisalama.org',
}: TemplateChooserProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = TEMPLATES.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const suggestedSearches = [
    'Professionnel',
    'Cartes',
    'Prospectus',
    'Lettres',
    'Éducation',
    'C.V. et lettres de motivation',
    'Fête',
  ];

  return (
    <div className="flex h-screen bg-[#f3f2f1] font-sans antialiased overflow-hidden select-none">
      {/* Blue Sidebar */}
      <div id="word-sidebar" className="w-80 bg-[#2b579a] text-white flex flex-col justify-between p-6 flex-shrink-0">
        <div>
          <div className="flex items-center space-x-2 mb-12 mt-4">
            <div className="bg-white text-[#2b579a] p-1.5 rounded font-bold text-xl tracking-tight shadow">
              M
            </div>
            <span className="text-2xl font-light tracking-wide">Manix Word</span>
          </div>

          <h2 className="text-xl font-medium mb-4 text-[#e1ecf4]">Récent</h2>

          <div className="space-y-3 overflow-y-auto max-h-[50vh] pr-2">
            {recentDocs.length === 0 ? (
              <p className="text-sm text-blue-200 leading-relaxed font-light">
                Vous n'avez pas ouvert de documents récemment. Pour commencer, choisissez un modèle à droite ou cliquez ci-dessous.
              </p>
            ) : (
              recentDocs.map((doc) => (
                <button
                  id={`recent-${doc.id}`}
                  key={doc.id}
                  onClick={() => onOpenDoc(doc)}
                  className="w-full text-left p-3 rounded bg-white/10 hover:bg-white/20 transition flex items-center space-x-3 group"
                >
                  <FileText className="h-5 w-5 text-blue-200 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate group-hover:text-white transition">{doc.title}</p>
                    <p className="text-xs text-blue-200 truncate flex items-center mt-0.5">
                      <Clock className="h-3 w-3 mr-1" /> {new Date(doc.lastModified).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-blue-300 opacity-0 group-hover:opacity-100 transition" />
                </button>
              ))
            )}
          </div>
        </div>

        {/* Footer actions of left sidebar */}
        <div className="space-y-4">
          <label className="flex items-center space-x-3 p-3 rounded bg-white/10 hover:bg-white/15 transition cursor-pointer w-full text-left">
            <FolderOpen className="h-5 w-5 text-blue-200" />
            <span className="text-sm font-medium">Ouvrir d’autres Documents</span>
            <input
              type="file"
              accept=".docx,.doc,.txt,.pdf,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={onImportLocalFile}
              className="hidden"
            />
          </label>

          <div className="border-t border-white/20 pt-4 flex items-center space-x-3 text-xs text-blue-100">
            <div className="bg-white/20 p-2 rounded-full">
              <User className="h-4 w-4" />
            </div>
            <div className="truncate">
              <p className="font-semibold truncate">{userEmail}</p>
              <p className="opacity-75">Connecté à Office 365</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Pane */}
      <div id="word-templates-pane" className="flex-1 flex flex-col p-10 overflow-y-auto">
        {/* Header Ribbon banner */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-xl text-gray-700 font-normal">Nouveau</h1>
          </div>
          <div className="text-right text-sm">
            <span className="text-[#2b579a] hover:underline cursor-pointer">
              Connectez-vous pour tirer pleinement parti d'Office
            </span>
            <span className="mx-2 text-gray-400">|</span>
            <span className="text-gray-500 hover:text-gray-800 cursor-pointer">Plus d'infos</span>
          </div>
        </div>

        {/* Search Bar matching Image 1 */}
        <div className="max-w-3xl mb-4 relative">
          <input
            id="template-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher des modèles en ligne"
            className="w-full bg-white border border-gray-300 rounded px-4 py-2 pr-10 outline-none text-sm shadow-sm focus:border-[#2b579a] focus:ring-1 focus:ring-[#2b579a] transition"
          />
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>

        {/* Recommended Searches */}
        <div className="max-w-5xl mb-10 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs text-gray-600">
          <span className="font-medium text-gray-800">Recherches suggérées :</span>
          {suggestedSearches.map((term) => (
            <button
              id={`suggested-${term.replace(/\s+/g, '-')}`}
              key={term}
              onClick={() => {
                setSearchQuery(term);
              }}
              className="text-[#2b579a] hover:underline hover:text-blue-800 transition py-0.5 px-1 font-normal"
            >
              {term}
            </button>
          ))}
        </div>

        {/* Dynamic & Beautiful Grid of Templates */}
        <div className="max-w-6xl">
          <h2 className="text-sm font-semibold text-gray-800 mb-6 uppercase tracking-wider">
            Modèles recommandés ({filteredTemplates.length})
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredTemplates.map((template) => (
              <div
                id={`template-card-${template.id}`}
                key={template.id}
                onClick={() => onSelectTemplate(template)}
                className="group cursor-pointer bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md hover:border-[#2b579a]/50 transition duration-200 flex flex-col justify-between"
              >
                {/* Visual Representation of the A4 page layout */}
                <div className="h-56 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6 border-b border-gray-100 relative group-hover:from-blue-50/30 group-hover:to-blue-50/10 transition">
                  <div className="w-36 h-[190px] bg-white border border-gray-200 rounded shadow-sm p-3 overflow-hidden text-[6px] text-gray-400 select-none flex flex-col justify-between group-hover:border-[#2b579a]/30 group-hover:scale-105 transition transform duration-200">
                    <div className="flex-1">
                      {renderTemplateMockup(template.id)}
                    </div>
                    <div className="text-[4px] text-gray-300 flex justify-between border-t border-gray-100 pt-1 mt-1">
                      <span>Office 365</span>
                      <span>Page 1</span>
                    </div>
                  </div>

                  {/* Icon badge */}
                  <span className="absolute bottom-3 right-3 text-2xl filter drop-shadow opacity-80 group-hover:scale-110 transition duration-200">
                    {template.thumbnail}
                  </span>
                </div>

                {/* Bottom title & description */}
                <div className="p-4 bg-white flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 group-hover:text-[#2b579a] transition">
                      {template.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {template.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-200">
              <p className="text-gray-500">Aucun modèle ne correspond à votre recherche "{searchQuery}"</p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-sm text-[#2b579a] hover:underline font-semibold mt-2"
              >
                Effacer la recherche
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
