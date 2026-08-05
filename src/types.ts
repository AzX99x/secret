export type ThemeMode = 'dark' | 'light';

export interface Author {
  name: string;
  role: string;
  avatar: string;
  bio?: string;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timestamp: string;
  likes: number;
}

export interface Article {
  id: string;
  title: string;
  subtitle: string;
  category: ArticleCategory;
  tags: string[];
  coverImage: string;
  author: Author;
  publishedAt: string;
  readTime: string;
  views: number;
  likes: number;
  isBookmarked?: boolean;
  content: string; // Markdown / HTML formatted
  toc?: { id: string; text: string; level: number }[];
  comments?: Comment[];
}

export type ArticleCategory =
  | 'All'
  | 'Mind Science'
  | 'Business'
  | 'AI & Future'
  | 'Science'
  | 'Health'
  | 'Tech'
  | 'World Cast';

export interface CustomCSSSnippet {
  id: string;
  name: string;
  css: string;
  active: boolean;
}

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export type ActiveTab = 'articles' | 'bookmarks' | 'tools' | 'css-editor' | 'deploy-guide';
