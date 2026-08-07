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
  content: string;
  style: DocumentStyle;
  headerText: string;
  footerText: string;
}
