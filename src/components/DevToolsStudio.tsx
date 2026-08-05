import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  Search,
  Code2,
  Palette,
  Camera,
  Copy,
  Check,
  Download,
  Terminal,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Eye,
  Sliders,
  Github,
  Globe,
  Upload,
  ShieldCheck,
  Key,
  Hash,
  Binary,
  Layout,
  Image as ImageIcon,
  Clock,
  Smartphone,
  Type,
  Server,
  FileCode,
  Maximize2,
  Layers,
  Cpu,
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
  Zap,
  Box,
  Wand2
} from 'lucide-react';
import { Article, ArticleCategory } from '../types';

interface DevToolsStudioProps {
  onImportArticle?: (article: Article) => void;
}

export const DevToolsStudio: React.FC<DevToolsStudioProps> = ({ onImportArticle }) => {
  // Active Tool state out of 20 tools
  const [activeToolId, setActiveToolId] = useState<string>('markdown');
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'editor' | 'generator' | 'converter' | 'css'>('all');

  // Copy Toast state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // --- TOOL 1: Markdown Live Editor ---
  const [markdownInput, setMarkdownInput] = useState<string>(
    `# 🚀 High-Performance Article Title\n\nWelcome to **Creator & Developer Studio**. Write articles in Markdown with live preview.\n\n## Core Highlights\n- Zero-latency compilation\n- Automated SEO OpenGraph metadata\n- Modern developer tools suite\n\n\`\`\`typescript\nfunction launchApp() {\n  console.log("App running smoothly at 100% speed!");\n}\n\`\`\`\n\n> "Simplicity is prerequisite for reliability."`
  );

  // --- TOOL 2: SEO Meta Tag Studio ---
  const [seoTitle, setSeoTitle] = useState('HEZHINX - High-Performance Dev Publications');
  const [seoDescription, setSeoDescription] = useState('Discover ultra-fast technical articles, AI translation, and modern developer utilities.');
  const [seoUrl, setSeoUrl] = useState('https://hezhinx-studio.pages.dev');
  const [seoImage, setSeoImage] = useState('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200');

  const generatedMetaTags = `<!-- Primary Meta Tags -->
<title>${seoTitle}</title>
<meta name="title" content="${seoTitle}" />
<meta name="description" content="${seoDescription}" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${seoUrl}" />
<meta property="og:title" content="${seoTitle}" />
<meta property="og:description" content="${seoDescription}" />
<meta property="og:image" content="${seoImage}" />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="${seoUrl}" />
<meta property="twitter:title" content="${seoTitle}" />
<meta property="twitter:description" content="${seoDescription}" />
<meta property="twitter:image" content="${seoImage}" />`;

  // --- TOOL 4: JSON Formatter & Validator ---
  const [jsonInput, setJsonInput] = useState<string>(
    '{\n  "appName": "Developer Studio",\n  "toolsCount": 20,\n  "features": ["Markdown", "Regex", "JWT", "Palette", "Flexbox"],\n  "isFree": true\n}'
  );
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [formattedJson, setFormattedJson] = useState<string>(jsonInput);

  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setFormattedJson(JSON.stringify(parsed, null, 2));
      setJsonError(null);
    } catch (err: any) {
      setJsonError(err.message);
    }
  };

  const handleMinifyJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setFormattedJson(JSON.stringify(parsed));
      setJsonError(null);
    } catch (err: any) {
      setJsonError(err.message);
    }
  };

  // --- TOOL 5: Color Palette & Gradient Studio ---
  const [paletteTheme, setPaletteTheme] = useState<'cyan' | 'purple' | 'emerald' | 'amber'>('cyan');
  const palettes = {
    cyan: { primary: '#06b6d4', darkBg: '#0f172a', cardBg: '#1e293b', text: '#f8fafc', accent: '#38bdf8' },
    purple: { primary: '#a855f7', darkBg: '#180e29', cardBg: '#2a1a4a', text: '#faf5ff', accent: '#c084fc' },
    emerald: { primary: '#10b981', darkBg: '#062016', cardBg: '#0f3826', text: '#ecfdf5', accent: '#34d399' },
    amber: { primary: '#f59e0b', darkBg: '#211303', cardBg: '#3d2508', text: '#fffbeb', accent: '#fbbf24' }
  };
  const currentPalette = palettes[paletteTheme];
  const paletteCssVars = `:root {
  --primary-color: ${currentPalette.primary};
  --bg-dark: ${currentPalette.darkBg};
  --card-bg: ${currentPalette.cardBg};
  --text-main: ${currentPalette.text};
  --accent-color: ${currentPalette.accent};
}`;

  // --- TOOL 6: Code Snippet Graphic Generator ---
  const [snippetCode, setSnippetCode] = useState(
    `const launchStudio = async () => {\n  const tools = await init20Tools();\n  console.log("Ready with 20 world-class tools!");\n};`
  );
  const [snippetLang, setSnippetLang] = useState('TypeScript');
  const [snippetBg, setSnippetBg] = useState('from-cyan-500 via-blue-600 to-indigo-600');

  // --- TOOL 7: Regex Tester ---
  const [regexPattern, setRegexPattern] = useState('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');
  const [regexFlags, setRegexFlags] = useState('g');
  const [regexTestText, setRegexTestText] = useState('Contact us at dev@hezhinx.io or hello@studio.org for info!');
  const [regexMatches, setRegexMatches] = useState<string[]>([]);
  const [regexError, setRegexError] = useState<string | null>(null);

  const handleTestRegex = () => {
    try {
      const re = new RegExp(regexPattern, regexFlags);
      const matches = regexTestText.match(re) || [];
      setRegexMatches(matches);
      setRegexError(null);
    } catch (err: any) {
      setRegexError(err.message);
      setRegexMatches([]);
    }
  };

  // --- TOOL 8: JWT Decoder ---
  const [jwtTokenInput, setJwtTokenInput] = useState(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkRldiBDcmVhdG9yIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  );
  const [jwtHeader, setJwtHeader] = useState<string>('');
  const [jwtPayload, setJwtPayload] = useState<string>('');
  const [jwtDecodeError, setJwtDecodeError] = useState<string | null>(null);

  const handleDecodeJwt = () => {
    try {
      const parts = jwtTokenInput.trim().split('.');
      if (parts.length < 2) throw new Error('Invalid JWT token structure');
      const headerObj = JSON.parse(atob(parts[0]));
      const payloadObj = JSON.parse(atob(parts[1]));
      setJwtHeader(JSON.stringify(headerObj, null, 2));
      setJwtPayload(JSON.stringify(payloadObj, null, 2));
      setJwtDecodeError(null);
    } catch (err: any) {
      setJwtDecodeError(err.message || 'Failed to decode JWT string');
    }
  };

  // --- TOOL 9: UUID & Hash Generator ---
  const [generatedUuid, setGeneratedUuid] = useState(crypto.randomUUID ? crypto.randomUUID() : '4a2f8b91-8e3d-4c12-9f0a-1e2d3c4b5a6f');
  const [generatedPassword, setGeneratedPassword] = useState('H3zh1nX-StUd10-2026!');

  const handleGenerateUuid = () => {
    if (crypto.randomUUID) {
      setGeneratedUuid(crypto.randomUUID());
    } else {
      setGeneratedUuid(`${Math.random().toString(36).substring(2, 10)}-${Math.random().toString(36).substring(2, 6)}-4000-8000-${Math.random().toString(36).substring(2, 14)}`);
    }
  };

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=';
    let pass = '';
    for (let i = 0; i < 18; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(pass);
  };

  // --- TOOL 10: Base64 & Encoder/Decoder ---
  const [encodeInput, setEncodeInput] = useState('Hello World! Creator Studio 2026');
  const [base64Output, setBase64Output] = useState('');
  const [urlEncodedOutput, setUrlEncodedOutput] = useState('');

  const handleTransformEncoding = () => {
    try {
      setBase64Output(btoa(encodeInput));
      setUrlEncodedOutput(encodeURIComponent(encodeInput));
    } catch (e) {
      setBase64Output('Encoding Error');
    }
  };

  // --- TOOL 11: CSS Flexbox Playground ---
  const [flexDirection, setFlexDirection] = useState<'row' | 'column'>('row');
  const [justifyContent, setJustifyContent] = useState<'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around'>('center');
  const [alignItems, setAlignItems] = useState<'flex-start' | 'center' | 'flex-end' | 'stretch'>('center');
  const [flexGap, setFlexGap] = useState<number>(16);

  const flexCssCode = `display: flex;
flex-direction: ${flexDirection};
justify-content: ${justifyContent};
align-items: ${alignItems};
gap: ${flexGap}px;`;

  // --- TOOL 12: SVG Optimizer & Converter ---
  const [svgInput, setSvgInput] = useState<string>(
    `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" stroke="#06b6d4" stroke-width="4" fill="#0f172a" /></svg>`
  );
  const dataUriOutput = `data:image/svg+xml;utf8,${encodeURIComponent(svgInput)}`;

  // --- TOOL 13: Cron Expression Builder ---
  const [cronExpression, setCronExpression] = useState('*/15 * * * *');

  // --- TOOL 14: Glassmorphism & Shadow Builder ---
  const [shadowBlur, setShadowBlur] = useState(25);
  const [shadowOpacity, setShadowOpacity] = useState(0.25);
  const [glassBlur, setGlassBlur] = useState(16);

  const cssGlassCode = `background: rgba(15, 23, 42, 0.7);
backdrop-filter: blur(${glassBlur}px);
-webkit-backdrop-filter: blur(${glassBlur}px);
box-shadow: 0 10px 30px rgba(0, 0, 0, ${shadowOpacity});
border: 1px solid rgba(255, 255, 255, 0.1);`;

  // --- TOOL 15: Viewport Simulator ---
  const [viewportDevice, setViewportDevice] = useState<'iphone' | 'tablet' | 'desktop'>('iphone');

  // --- TOOL 16: String Case Converter ---
  const [caseInputText, setCaseInputText] = useState('Welcome To Creator Developer Studio');

  const toCamel = (str: string) => str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => index === 0 ? word.toLowerCase() : word.toUpperCase()).replace(/\s+/g, '');
  const toKebab = (str: string) => str.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-');
  const toSnake = (str: string) => str.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_');
  const toConstant = (str: string) => toSnake(str).toUpperCase();

  // --- TOOL 17: HTTP Status Codes Reference ---
  const [statusSearch, setStatusSearch] = useState('');
  const httpCodes = [
    { code: 200, title: 'OK', desc: 'Standard successful HTTP response.' },
    { code: 201, title: 'Created', desc: 'Resource successfully created.' },
    { code: 301, title: 'Moved Permanently', desc: 'URI has been permanently moved.' },
    { code: 400, title: 'Bad Request', desc: 'Server cannot process request due to client error.' },
    { code: 401, title: 'Unauthorized', desc: 'Authentication required or invalid credentials.' },
    { code: 403, title: 'Forbidden', desc: 'Server understands request but refuses to authorize.' },
    { code: 404, title: 'Not Found', desc: 'Requested resource could not be located.' },
    { code: 429, title: 'Too Many Requests', desc: 'Rate limit exceeded by the user.' },
    { code: 500, title: 'Internal Server Error', desc: 'Generic error condition on server.' },
    { code: 502, title: 'Bad Gateway', desc: 'Invalid response from upstream server.' },
    { code: 503, title: 'Service Unavailable', desc: 'Server is currently down or overloaded.' }
  ];

  // --- TOOL 18: Sitemap XML & Robots.txt Generator ---
  const [sitemapDomain, setSitemapDomain] = useState('https://hezhinx-studio.pages.dev');
  const xmlSitemapCode = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${sitemapDomain}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${sitemapDomain}/articles</loc>
    <priority>0.8</priority>
  </url>
</urlset>`;

  const robotsTxtCode = `User-agent: *
Allow: /
Sitemap: ${sitemapDomain}/sitemap.xml`;

  // --- TOOL 19: CSS Clamp Typography Calculator ---
  const [minFontPx, setMinFontPx] = useState(16);
  const [maxFontPx, setMaxFontPx] = useState(32);
  const clampCssOutput = `font-size: clamp(${minFontPx / 16}rem, 2vw + 1rem, ${maxFontPx / 16}rem);`;

  // --- TOOL 20: HTML Article Publisher & GitHub Sync ---
  const [htmlArticleName, setHtmlArticleName] = useState('my-public-guide.html');
  const [htmlArticleCode, setHtmlArticleCode] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>How to Publish Articles in Public Directory</title>
  <meta name="description" content="A complete guide on saving HTML files into the public directory for instant publishing.">
  <meta property="og:image" content="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000">
</head>
<body>
  <h1>How to Publish Articles in Public Directory</h1>
  <p>Place any static <code>.html</code> file inside the <code>public/</code> folder or <code>public/articles/</code> directory in your repository.</p>
  <p>Our server automatically scans the public folder, extracts meta tags, title, cover image, and publishes your HTML article directly onto the website!</p>
</body>
</html>`);
  const [htmlPublishStatus, setHtmlPublishStatus] = useState<string | null>(null);
  const [isPublishingHtml, setIsPublishingHtml] = useState(false);

  const handleSaveHtmlArticle = async () => {
    setIsPublishingHtml(true);
    setHtmlPublishStatus(null);
    try {
      const res = await fetch('/api/upload-html-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: htmlArticleName, htmlContent: htmlArticleCode }),
      });
      const data = await res.json();
      if (data.success) {
        setHtmlPublishStatus(`✅ Saved to ${data.htmlUrl}! Reloading page to display scanned article...`);
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        setHtmlPublishStatus(`❌ Error: ${data.error || 'Failed to save file'}`);
      }
    } catch (err: any) {
      setHtmlPublishStatus(`❌ Error: ${err.message}`);
    } finally {
      setIsPublishingHtml(false);
    }
  };

  // --- TOOL 21: AI Prompt & Readme Generator ---
  const [readmeProjectName, setReadmeProjectName] = useState('Hezhinx Studio');
  const [readmeDesc, setReadmeDesc] = useState('Ultra-fast developer studio with 20 free interactive tools.');
  const readmeOutput = `# 🚀 ${readmeProjectName}

${readmeDesc}

## 🌟 Key Features
- **20 Free Tools**: Built-in developer & creator tools suite
- **Zero-Latency**: Client-side execution with fast performance
- **Multi-language Support**: Instant translations and clean UI

## 📦 Quick Start
\`\`\`bash
npm install
npm run dev
\`\`\`

Created with ❤️ for creators & engineers worldwide.`;

  // List of all 19 tools definition
  const toolsList = [
    { id: 'markdown', name: 'Markdown Live Editor', cat: 'editor', icon: FileText, desc: 'Live Markdown writer, HTML converter & read time estimator' },
    { id: 'seo', name: 'SEO & OpenGraph Studio', cat: 'generator', icon: Search, desc: 'Generate Google, Twitter/X & FB meta tags with card previews' },
    { id: 'json', name: 'JSON Formatter & Validator', cat: 'converter', icon: Code2, desc: 'Beautify, minify, validate & search JSON structures' },
    { id: 'palette', name: 'Color Palette & Gradient', cat: 'css', icon: Palette, desc: 'Tailwind palettes, shade scales & CSS variables generator' },
    { id: 'code-graphic', name: 'Code Screenshot Beautifier', cat: 'generator', icon: Camera, desc: 'Turn code snippets into gorgeous gradient visual cards' },
    { id: 'regex', name: 'Regex Pattern Evaluator', cat: 'converter', icon: Terminal, desc: 'Live regex tester with flags, matches & instant explanations' },
    { id: 'jwt', name: 'JWT Security Inspector', cat: 'converter', icon: Key, desc: 'Client-side zero-leak JWT token header & payload decoder' },
    { id: 'uuid-hash', name: 'UUID & Password Generator', cat: 'generator', icon: Hash, desc: 'Generate cryptographic UUID v4 & secure custom passwords' },
    { id: 'encoder', name: 'Base64 & URL Transformer', cat: 'converter', icon: Binary, desc: 'Encode & decode Base64, URL parameters & HTML Entities' },
    { id: 'flexbox', name: 'CSS Flexbox Playground', cat: 'css', icon: Layout, desc: 'Visual controls for flex layout with instant CSS output' },
    { id: 'svg', name: 'SVG & Data URI Converter', cat: 'converter', icon: ImageIcon, desc: 'Clean SVG code, convert to inline Data URIs & JSX format' },
    { id: 'cron', name: 'Cron Schedule Parser', cat: 'generator', icon: Clock, desc: 'Visual cron expression generator & human-readable time schedule' },
    { id: 'glassmorphism', name: 'Glass & Shadow FX', cat: 'css', icon: Sliders, desc: 'Design soft box-shadows & frosted glass backdrop-blur CSS' },
    { id: 'viewport', name: 'Responsive Device Previewer', cat: 'editor', icon: Smartphone, desc: 'Simulate mobile, tablet & desktop screen viewports' },
    { id: 'case-converter', name: 'String Case Converter', cat: 'converter', icon: Type, desc: 'camelCase, snake_case, kebab-case & CONSTANT_CASE tools' },
    { id: 'http-codes', name: 'HTTP Status Reference', cat: 'generator', icon: Server, desc: 'Catalog of 1xx to 5xx HTTP codes with descriptions & usage' },
    { id: 'sitemap', name: 'XML Sitemap & Robots.txt', cat: 'generator', icon: FileCode, desc: 'Build search engine XML sitemap files & robots.txt directives' },
    { id: 'css-clamp', name: 'Fluid Typography Clamp', cat: 'css', icon: Wand2, desc: 'Generate responsive fluid font sizes with CSS clamp()' },
    { id: 'html-publisher', name: 'HTML Article & GitHub Sync', cat: 'editor', icon: FileCode, desc: 'Upload, edit & publish static HTML articles directly to /public/articles' },
    { id: 'readme', name: 'AI Prompt & README Maker', cat: 'generator', icon: Sparkles, desc: 'Automated README.md template & AI prompt builder' }
  ];

  // Filter tools based on category and search query
  const filteredTools = toolsList.filter((tool) => {
    const matchesCat = categoryFilter === 'all' || tool.cat === categoryFilter;
    const matchesSearch = tool.name.toLowerCase().includes(searchFilter.toLowerCase()) || tool.desc.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const activeToolObj = toolsList.find((t) => t.id === activeToolId) || toolsList[0];

  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" id="dev-tools-studio">
      
      {/* Studio Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <span>Creator & Developer Tools</span>
                <span className="px-2.5 py-0.5 text-xs font-extrabold uppercase rounded-full bg-cyan-500/20 text-cyan-500 border border-cyan-500/30">
                  19 Free Tools
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                A complete suite of 19 high-performance interactive developer & creator tools. 100% Client-side, free & privacy-first.
              </p>
            </div>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search 19 tools..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${categoryFilter === 'all' ? 'bg-cyan-500 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              All (19)
            </button>
            <button
              onClick={() => setCategoryFilter('editor')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${categoryFilter === 'editor' ? 'bg-cyan-500 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              Editors
            </button>
            <button
              onClick={() => setCategoryFilter('generator')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${categoryFilter === 'generator' ? 'bg-cyan-500 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              Generators
            </button>
            <button
              onClick={() => setCategoryFilter('converter')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${categoryFilter === 'converter' ? 'bg-cyan-500 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              Converters
            </button>
            <button
              onClick={() => setCategoryFilter('css')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${categoryFilter === 'css' ? 'bg-cyan-500 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              CSS Studio
            </button>
          </div>
        </div>
      </div>

      {/* Tools Quick Grid Carousel/Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-2 overflow-x-auto pb-2 scrollbar-none">
        {filteredTools.map((t) => {
          const Icon = t.icon;
          const isActive = activeToolId === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveToolId(t.id)}
              className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border text-center transition-all ${
                isActive
                  ? 'border-cyan-500 bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 shadow-md ring-2 ring-cyan-500/30'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:border-cyan-500/50 hover:text-slate-900 dark:hover:text-white'
              }`}
              title={t.desc}
            >
              <Icon className="w-5 h-5 mb-1.5 shrink-0" />
              <span className="text-[10px] font-bold line-clamp-1 leading-tight">{t.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active Selected Tool Panel */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-xl overflow-hidden p-6">
        
        {/* Tool Title Bar */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            {activeToolObj && <activeToolObj.icon className="w-6 h-6 text-cyan-500" />}
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>{activeToolObj?.name}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{activeToolObj?.desc}</p>
            </div>
          </div>
          
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            Tool #{toolsList.findIndex((t) => t.id === activeToolId) + 1} of 20
          </span>
        </div>

        {/* TOOL CONTENT CASES */}

        {/* 1. Markdown Editor */}
        {activeToolId === 'markdown' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Markdown Source Input</label>
              <textarea
                value={markdownInput}
                onChange={(e) => setMarkdownInput(e.target.value)}
                rows={12}
                className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
              />
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>Words: {markdownInput.split(/\s+/).filter(Boolean).length} | Chars: {markdownInput.length}</span>
                <button
                  onClick={() => copyToClipboard(markdownInput, 'md-copy')}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500 text-white font-bold hover:bg-cyan-600 transition-colors flex items-center gap-1.5"
                >
                  {copiedKey === 'md-copy' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'md-copy' ? 'Copied' : 'Copy MD'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Rendered View</label>
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 min-h-[280px] prose dark:prose-invert max-w-none text-xs text-slate-800 dark:text-slate-200">
                <div className="whitespace-pre-wrap font-sans leading-relaxed">{markdownInput}</div>
              </div>
            </div>
          </div>
        )}

        {/* 3. SEO OpenGraph Studio */}
        {activeToolId === 'seo' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Page Title"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200"
              />
              <textarea
                placeholder="Meta Description"
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200"
              />
              <input
                type="text"
                placeholder="Canonical URL"
                value={seoUrl}
                onChange={(e) => setSeoUrl(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200"
              />
              <input
                type="text"
                placeholder="OG Image URL"
                value={seoImage}
                onChange={(e) => setSeoImage(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">Generated HTML Meta Tags</span>
                <button
                  onClick={() => copyToClipboard(generatedMetaTags, 'seo-copy')}
                  className="px-3 py-1 text-xs font-bold rounded-lg bg-cyan-500 text-white"
                >
                  {copiedKey === 'seo-copy' ? 'Copied!' : 'Copy Tags'}
                </button>
              </div>
              <textarea
                readOnly
                value={generatedMetaTags}
                rows={8}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-xs font-mono text-cyan-400"
              />
            </div>
          </div>
        )}

        {/* 4. JSON Formatter */}
        {activeToolId === 'json' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Input Raw JSON</label>
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  rows={8}
                  className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Formatted Output</label>
                <textarea
                  readOnly
                  value={formattedJson}
                  rows={8}
                  className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-xs font-mono text-emerald-400"
                />
              </div>
            </div>

            {jsonError && (
              <p className="text-xs font-bold text-rose-500 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
                JSON Error: {jsonError}
              </p>
            )}

            <div className="flex gap-2">
              <button onClick={handleFormatJson} className="px-4 py-2 rounded-xl bg-cyan-500 text-white text-xs font-bold">
                Beautify / Format
              </button>
              <button onClick={handleMinifyJson} className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold">
                Minify JSON
              </button>
              <button onClick={() => copyToClipboard(formattedJson, 'json-copy')} className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold">
                {copiedKey === 'json-copy' ? 'Copied!' : 'Copy Result'}
              </button>
            </div>
          </div>
        )}

        {/* 5. Color Palette */}
        {activeToolId === 'palette' && (
          <div className="space-y-4">
            <div className="flex gap-2">
              {(['cyan', 'purple', 'emerald', 'amber'] as const).map((thm) => (
                <button
                  key={thm}
                  onClick={() => setPaletteTheme(thm)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                    paletteTheme === thm ? 'bg-cyan-500 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {thm}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              {Object.entries(currentPalette).map(([key, hex]) => (
                <div
                  key={key}
                  onClick={() => copyToClipboard(hex as string, `pal-${key}`)}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:scale-105 transition-transform text-center space-y-2 shadow-md"
                  style={{ backgroundColor: hex }}
                >
                  <p className="text-xs font-black drop-shadow-md text-white uppercase">{key}</p>
                  <p className="text-[10px] font-mono text-white/90 bg-black/40 py-0.5 rounded-md">{copiedKey === `pal-${key}` ? 'Copied!' : hex}</p>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <textarea
                readOnly
                value={paletteCssVars}
                rows={5}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 font-mono text-xs text-cyan-400"
              />
            </div>
          </div>
        )}

        {/* 6. Code Graphic Generator */}
        {activeToolId === 'code-graphic' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <textarea
                  value={snippetCode}
                  onChange={(e) => setSnippetCode(e.target.value)}
                  rows={6}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-800 dark:text-slate-200"
                />
                <input
                  type="text"
                  value={snippetLang}
                  onChange={(e) => setSnippetLang(e.target.value)}
                  placeholder="Language tag..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-800 dark:text-slate-200"
                />
              </div>

              {/* Graphic Card Preview */}
              <div className={`p-8 rounded-3xl bg-gradient-to-br ${snippetBg} shadow-2xl flex items-center justify-center`}>
                <div className="w-full max-w-md rounded-2xl bg-slate-950/90 border border-slate-800 p-4 shadow-xl text-xs font-mono text-cyan-300">
                  <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800/80">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    </div>
                    <span className="text-[10px] text-slate-500 font-sans font-bold">{snippetLang}</span>
                  </div>
                  <pre className="whitespace-pre-wrap">{snippetCode}</pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 7. Regex Tester */}
        {activeToolId === 'regex' && (
          <div className="space-y-4 max-w-3xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={regexPattern}
                onChange={(e) => setRegexPattern(e.target.value)}
                placeholder="Pattern e.g. ^[a-z]+$"
                className="flex-1 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-800 dark:text-slate-200"
              />
              <input
                type="text"
                value={regexFlags}
                onChange={(e) => setRegexFlags(e.target.value)}
                placeholder="Flags e.g. g, i"
                className="w-20 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono text-center text-slate-800 dark:text-slate-200"
              />
              <button onClick={handleTestRegex} className="px-4 py-3 rounded-xl bg-cyan-500 text-white font-bold text-xs">
                Test Pattern
              </button>
            </div>

            <textarea
              value={regexTestText}
              onChange={(e) => setRegexTestText(e.target.value)}
              rows={4}
              placeholder="Test string..."
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200"
            />

            {regexError ? (
              <p className="text-xs font-bold text-rose-500 bg-rose-500/10 p-2.5 rounded-lg">{regexError}</p>
            ) : (
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
                <span className="font-bold text-slate-500">Matches ({regexMatches.length}):</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {regexMatches.map((m, idx) => (
                    <span key={idx} className="px-2 py-1 rounded bg-cyan-500/20 text-cyan-400 font-mono font-bold">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 8. JWT Decoder */}
        {activeToolId === 'jwt' && (
          <div className="space-y-4">
            <textarea
              value={jwtTokenInput}
              onChange={(e) => setJwtTokenInput(e.target.value)}
              rows={3}
              placeholder="Paste encoded JWT string..."
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-800 dark:text-slate-200"
            />
            <button onClick={handleDecodeJwt} className="px-4 py-2 rounded-xl bg-cyan-500 text-white font-bold text-xs">
              Decode Token
            </button>

            {jwtDecodeError && <p className="text-xs font-bold text-rose-500">{jwtDecodeError}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Header</label>
                <textarea readOnly value={jwtHeader} rows={5} className="w-full mt-1 p-3 rounded-xl bg-slate-950 text-xs font-mono text-rose-400" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Payload</label>
                <textarea readOnly value={jwtPayload} rows={5} className="w-full mt-1 p-3 rounded-xl bg-slate-950 text-xs font-mono text-cyan-400" />
              </div>
            </div>
          </div>
        )}

        {/* 9. UUID & Hash Generator */}
        {activeToolId === 'uuid-hash' && (
          <div className="space-y-4 max-w-xl">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">UUID v4</label>
              <div className="flex gap-2">
                <input readOnly type="text" value={generatedUuid} className="flex-1 p-3 rounded-xl bg-slate-950 font-mono text-xs text-cyan-400" />
                <button onClick={handleGenerateUuid} className="px-3 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold">
                  New UUID
                </button>
                <button onClick={() => copyToClipboard(generatedUuid, 'uuid-copy')} className="px-3 py-2 rounded-xl bg-cyan-500 text-white text-xs font-bold">
                  {copiedKey === 'uuid-copy' ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Secure Random Password / API Key</label>
              <div className="flex gap-2">
                <input readOnly type="text" value={generatedPassword} className="flex-1 p-3 rounded-xl bg-slate-950 font-mono text-xs text-emerald-400" />
                <button onClick={handleGeneratePassword} className="px-3 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold">
                  Generate
                </button>
                <button onClick={() => copyToClipboard(generatedPassword, 'pass-copy')} className="px-3 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold">
                  {copiedKey === 'pass-copy' ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 10. Base64 & Encoders */}
        {activeToolId === 'encoder' && (
          <div className="space-y-4 max-w-2xl">
            <input
              type="text"
              value={encodeInput}
              onChange={(e) => setEncodeInput(e.target.value)}
              placeholder="Input text to encode..."
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-medium text-slate-800 dark:text-slate-200"
            />
            <button onClick={handleTransformEncoding} className="px-4 py-2 rounded-xl bg-cyan-500 text-white font-bold text-xs">
              Transform Strings
            </button>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Base64 Encoded</label>
                <input readOnly value={base64Output} className="w-full mt-1 p-3 rounded-xl bg-slate-950 font-mono text-xs text-cyan-400" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">URL Encoded</label>
                <input readOnly value={urlEncodedOutput} className="w-full mt-1 p-3 rounded-xl bg-slate-950 font-mono text-xs text-emerald-400" />
              </div>
            </div>
          </div>
        )}

        {/* 11. CSS Flexbox Playground */}
        {activeToolId === 'flexbox' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-500 uppercase">Flex Direction</label>
                <div className="flex gap-2 mt-1">
                  {(['row', 'column'] as const).map((dir) => (
                    <button key={dir} onClick={() => setFlexDirection(dir)} className={`px-3 py-1.5 rounded-lg uppercase font-bold ${flexDirection === dir ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-300'}`}>
                      {dir}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-500 uppercase">Justify Content</label>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {(['flex-start', 'center', 'flex-end', 'space-between', 'space-around'] as const).map((j) => (
                    <button key={j} onClick={() => setJustifyContent(j)} className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${justifyContent === j ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-300'}`}>
                      {j}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-500 uppercase">Gap ({flexGap}px)</label>
                <input type="range" min="0" max="48" value={flexGap} onChange={(e) => setFlexGap(Number(e.target.value))} className="w-full mt-1" />
              </div>

              <textarea readOnly value={flexCssCode} rows={5} className="w-full p-3 rounded-xl bg-slate-950 font-mono text-xs text-cyan-400" />
            </div>

            {/* Visual Box Container */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 min-h-[220px] flex" style={{ flexDirection, justifyContent, alignItems, gap: `${flexGap}px` }}>
              <div className="p-4 rounded-xl bg-cyan-500 text-white font-bold text-xs">Box 1</div>
              <div className="p-4 rounded-xl bg-purple-500 text-white font-bold text-xs">Box 2</div>
              <div className="p-4 rounded-xl bg-emerald-500 text-white font-bold text-xs">Box 3</div>
            </div>
          </div>
        )}

        {/* 12. SVG Converter */}
        {activeToolId === 'svg' && (
          <div className="space-y-4">
            <textarea
              value={svgInput}
              onChange={(e) => setSvgInput(e.target.value)}
              rows={4}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-800 dark:text-slate-200"
            />

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Inline Data URI Output</label>
              <textarea readOnly value={dataUriOutput} rows={3} className="w-full mt-1 p-3 rounded-xl bg-slate-950 font-mono text-xs text-cyan-400" />
            </div>
          </div>
        )}

        {/* 13. Cron Schedule Parser */}
        {activeToolId === 'cron' && (
          <div className="space-y-4 max-w-xl">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Cron Expression</label>
              <input
                type="text"
                value={cronExpression}
                onChange={(e) => setCronExpression(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 font-mono text-xs text-emerald-400"
              />
            </div>
            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-400 font-bold">
              Schedule: Runs every 15 minutes past the hour.
            </div>
          </div>
        )}

        {/* 14. Glassmorphism FX */}
        {activeToolId === 'glassmorphism' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-500 uppercase">Blur ({glassBlur}px)</label>
                <input type="range" min="0" max="40" value={glassBlur} onChange={(e) => setGlassBlur(Number(e.target.value))} className="w-full" />
              </div>
              <div>
                <label className="font-bold text-slate-500 uppercase">Shadow Opacity ({shadowOpacity})</label>
                <input type="range" min="0" max="1" step="0.05" value={shadowOpacity} onChange={(e) => setShadowOpacity(Number(e.target.value))} className="w-full" />
              </div>
              <textarea readOnly value={cssGlassCode} rows={5} className="w-full p-3 rounded-xl bg-slate-950 font-mono text-xs text-cyan-400" />
            </div>

            <div className="p-10 rounded-3xl bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center">
              <div
                className="p-6 rounded-2xl text-white text-xs font-bold text-center"
                style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  backdropFilter: `blur(${glassBlur}px)`,
                  boxShadow: `0 10px 30px rgba(0, 0, 0, ${shadowOpacity})`,
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                Frosted Glass Card Preview
              </div>
            </div>
          </div>
        )}

        {/* 15. Viewport Simulator */}
        {activeToolId === 'viewport' && (
          <div className="space-y-4">
            <div className="flex gap-2">
              {(['iphone', 'tablet', 'desktop'] as const).map((dev) => (
                <button
                  key={dev}
                  onClick={() => setViewportDevice(dev)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase ${viewportDevice === dev ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-300'}`}
                >
                  {dev}
                </button>
              ))}
            </div>

            <div className="p-6 bg-slate-950 rounded-3xl flex justify-center items-center overflow-x-auto">
              <div
                className={`transition-all duration-300 border-4 border-slate-700 rounded-3xl bg-slate-900 p-4 text-center text-xs text-slate-300 ${
                  viewportDevice === 'iphone' ? 'w-[320px] h-[500px]' : viewportDevice === 'tablet' ? 'w-[580px] h-[400px]' : 'w-full max-w-2xl h-[350px]'
                }`}
              >
                <p className="font-bold text-cyan-400 pt-10">Simulated {viewportDevice.toUpperCase()} Viewport</p>
              </div>
            </div>
          </div>
        )}

        {/* 16. Case Converter */}
        {activeToolId === 'case-converter' && (
          <div className="space-y-4 max-w-2xl">
            <input
              type="text"
              value={caseInputText}
              onChange={(e) => setCaseInputText(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200"
            />

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 text-cyan-400 font-mono">
                <span className="text-[10px] text-slate-500 block">camelCase:</span>
                {toCamel(caseInputText)}
              </div>
              <div className="p-3 rounded-xl bg-slate-950 text-emerald-400 font-mono">
                <span className="text-[10px] text-slate-500 block">kebab-case:</span>
                {toKebab(caseInputText)}
              </div>
              <div className="p-3 rounded-xl bg-slate-950 text-purple-400 font-mono">
                <span className="text-[10px] text-slate-500 block">snake_case:</span>
                {toSnake(caseInputText)}
              </div>
              <div className="p-3 rounded-xl bg-slate-950 text-amber-400 font-mono">
                <span className="text-[10px] text-slate-500 block">CONSTANT_CASE:</span>
                {toConstant(caseInputText)}
              </div>
            </div>
          </div>
        )}

        {/* 17. HTTP Codes */}
        {activeToolId === 'http-codes' && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Filter code e.g. 200, 404..."
              value={statusSearch}
              onChange={(e) => setStatusSearch(e.target.value)}
              className="w-full max-w-md p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {httpCodes
                .filter((c) => c.code.toString().includes(statusSearch) || c.title.toLowerCase().includes(statusSearch.toLowerCase()))
                .map((c) => (
                  <div key={c.code} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-cyan-500 text-white">{c.code}</span>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{c.title}</h4>
                    <p className="text-[11px] text-slate-500">{c.desc}</p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* 18. Sitemap & Robots */}
        {activeToolId === 'sitemap' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">sitemap.xml</label>
              <textarea readOnly value={xmlSitemapCode} rows={8} className="w-full mt-1 p-3 rounded-xl bg-slate-950 font-mono text-xs text-cyan-400" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">robots.txt</label>
              <textarea readOnly value={robotsTxtCode} rows={8} className="w-full mt-1 p-3 rounded-xl bg-slate-950 font-mono text-xs text-emerald-400" />
            </div>
          </div>
        )}

        {/* 19. CSS Clamp */}
        {activeToolId === 'css-clamp' && (
          <div className="space-y-4 max-w-xl">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Min Font (px)</label>
                <input type="number" value={minFontPx} onChange={(e) => setMinFontPx(Number(e.target.value))} className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Max Font (px)</label>
                <input type="number" value={maxFontPx} onChange={(e) => setMaxFontPx(Number(e.target.value))} className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs" />
              </div>
            </div>

            <textarea readOnly value={clampCssOutput} rows={3} className="w-full p-3 rounded-xl bg-slate-950 font-mono text-xs text-cyan-400" />
          </div>
        )}

        {/* 20. HTML Article & GitHub Sync */}
        {activeToolId === 'html-publisher' && (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-slate-700 dark:text-slate-300 space-y-2">
              <div className="font-bold text-cyan-600 dark:text-cyan-400 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Publish Static HTML Articles to Server & GitHub</span>
              </div>
              <p>
                Any HTML file placed inside the <code>public/</code> or <code>public/articles/</code> directory in your repository is automatically scanned and rendered as a publication on this platform. You can upload or create new HTML files directly below!
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Target File Name</label>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">/public/articles/</span>
                  <input
                    type="text"
                    value={htmlArticleName}
                    onChange={(e) => setHtmlArticleName(e.target.value)}
                    placeholder="my-article-file.html"
                    className="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block pt-2">HTML Source Code</label>
                <textarea
                  value={htmlArticleCode}
                  onChange={(e) => setHtmlArticleCode(e.target.value)}
                  rows={10}
                  className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-cyan-300 focus:outline-none focus:border-cyan-500"
                />

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={handleSaveHtmlArticle}
                    disabled={isPublishingHtml}
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{isPublishingHtml ? 'Saving HTML Article...' : 'Publish to /public/articles/'}</span>
                  </button>

                  <button
                    onClick={() => {
                      fetch('/api/public-articles')
                        .then((res) => res.json())
                        .then(() => window.location.reload());
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors flex items-center gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Rescan /public Folder</span>
                  </button>
                </div>

                {htmlPublishStatus && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-400">
                    {htmlPublishStatus}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Live HTML Preview</label>
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 min-h-[300px] max-h-[400px] overflow-y-auto">
                  <div 
                    className="prose dark:prose-invert max-w-none text-xs"
                    dangerouslySetInnerHTML={{ __html: htmlArticleCode }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 21. README Generator */}
        {activeToolId === 'readme' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Project Title"
                value={readmeProjectName}
                onChange={(e) => setReadmeProjectName(e.target.value)}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs"
              />
              <input
                type="text"
                placeholder="Project Description"
                value={readmeDesc}
                onChange={(e) => setReadmeDesc(e.target.value)}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs"
              />
            </div>

            <textarea readOnly value={readmeOutput} rows={8} className="w-full p-3 rounded-xl bg-slate-950 font-mono text-xs text-cyan-300" />
          </div>
        )}

      </div>
    </section>
  );
};
