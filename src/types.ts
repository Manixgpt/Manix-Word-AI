export interface DocumentStyle {
  fontFamily: string;
  fontSize: number;
  textColor: string;
  backgroundColor: string;
  margin: 'normal' | 'narrow' | 'moderate' | 'wide';
  orientation: 'portrait' | 'landscape';
  lineSpacing: number;
  theme: string;
}

export interface WordDocument {
  id: string;
  title: string;
  content: string; // HTML-like rich structure
  createdAt: string;
  lastModified: string;
  style: DocumentStyle;
  headerText: string;
  footerText: string;
  pageNumbering: boolean;
  watermark?: string;
  isFinal?: boolean;
  password?: string;
  isReadOnly?: boolean;
  signature?: string;
  versionHistory?: Array<{ id: string; date: string; content: string; author: string }>;
}

export type RibbonTab =
  | 'Fichier'
  | 'Accueil'
  | 'Insertion'
  | 'Création'
  | 'Disposition'
  | 'Références'
  | 'Publipostage'
  | 'Révision'
  | 'Affichage'
  | 'Dessin'
  | 'Extensions'
  | 'Aide';

export interface CoEditor {
  id: string;
  name: string;
  color: string;
  avatar: string;
  cursorPosition?: { line: number; ch: number };
  status: 'active' | 'idle' | 'writing';
}

export interface SearchResultItem {
  title: string;
  url: string;
  snippet: string;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category?: string;
  content: string;
  style: DocumentStyle;
  headerText: string;
  footerText: string;
}

export interface GrammarIssue {
  id: string;
  original: string;
  replacement: string;
  type: 'grammaire' | 'orthographe' | 'accord' | 'conjugaison' | 'ponctuation' | 'style' | 'homophone';
  explanation: string;
  context?: string;
  severity?: 'error' | 'warning' | 'suggestion';
}

export interface GrammarCheckResult {
  success: boolean;
  issues: GrammarIssue[];
  issuesCount: number;
  correctedHtml?: string;
  analyzedAt: string;
  isSimulated?: boolean;
}

export interface SynonymItem {
  word: string;
  category?: 'courant' | 'soutenu' | 'familier' | 'littéraire' | 'précis' | 'nuance';
  definition?: string;
  example?: string;
}

export interface SynonymResult {
  success: boolean;
  word: string;
  synonyms: SynonymItem[];
  antonyms?: string[];
  expressions?: string[];
}
