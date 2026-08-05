import { Article } from '../types';

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'Deploying High-Performance Web Apps on Cloudflare Pages & GitHub Actions',
    subtitle: 'A step-by-step masterclass on zero-latency static distribution, global edge routing, and automated CI/CD pipelines.',
    category: 'Tech',
    tags: ['Cloudflare', 'GitHub Pages', 'Edge Computing', 'CI/CD', 'Vite'],
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200',
    publishedAt: 'Aug 04, 2026',
    readTime: '6 min read',
    views: 14250,
    likes: 890,
    author: {
      name: 'Elena Rostova',
      role: 'Principal Edge Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      bio: 'Building hyper-scalable distributed web systems & edge compute nodes.'
    },
    toc: [
      { id: 'sec-1', text: '1. Why Edge Hosting is Revolutionizing Web Speed', level: 2 },
      { id: 'sec-2', text: '2. Configuring Cloudflare Pages Deployment', level: 2 },
      { id: 'sec-3', text: '3. GitHub Actions CI/CD Workflow Setup', level: 2 },
      { id: 'sec-4', text: '4. Performance Benchmark Comparison', level: 2 },
    ],
    content: `## 1. Why Edge Hosting is Revolutionizing Web Speed

Modern web users expect instant page loads under 100 milliseconds regardless of geographic location. Traditional centralized origin servers introduces physical latency due to network hops across continents.

By deploying your static web assets directly to global edge networks like **Cloudflare Pages** or **GitHub Pages**, your application is cached across over 300+ datacenters worldwide.

### Key Performance Advantages:
- **Sub-50ms TTFB (Time to First Byte)**: Requests terminate at the nearest edge server.
- **DDoS Mitigation**: Integrated Cloudflare web application firewall (WAF) filters malicious traffic seamlessly.
- **Zero Server Maintenance**: Static assets require no server patching or container scaling.

---

## 2. Configuring Cloudflare Pages Deployment

Deploying a Vite React application to Cloudflare Pages is remarkably straightforward. You can configure build commands directly through the dashboard or using the \`wrangler.toml\` configuration file.

\`\`\`toml
# wrangler.toml
name = "nexus-web-studio"
compatibility_date = "2026-08-01"
pages_build_output_dir = "dist"

[site]
bucket = "./dist"

[vars]
ENVIRONMENT = "production"
\`\`\`

---

## 3. GitHub Actions CI/CD Workflow Setup

Automate your deployment every time code is pushed to your \`main\` branch using GitHub Actions. Create \`.github/workflows/deploy.yml\`:

\`\`\`yaml
name: Deploy to Cloudflare Pages & GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install & Build
        run: |
          npm ci
          npm run build

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: \${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: \${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: 'nexus-app'
          directory: 'dist'
\`\`\`

---

## 4. Performance Benchmark Comparison

| Metric | Traditional VPS | Cloudflare Pages Edge |
| :--- | :--- | :--- |
| **Global Latency** | 240ms - 650ms | 18ms - 45ms |
| **Bandwidth Limits** | Metered | Unlimited Global CDN |
| **SSL Handshake** | 80ms | Integrated Edge TLS 1.3 |
| **Cold Starts** | 1.2s | 0ms (Static Cache) |

Mastering edge distribution ensures your applications remain blisteringly fast for every user on earth!`,
    comments: [
      { id: 'c1', author: 'Marcus Vance', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120', text: 'The GitHub Actions YAML snippet worked flawlessly on my repository! Saved me hours of trial and error.', timestamp: '2 hours ago', likes: 14 },
      { id: 'c2', author: 'Sophia Ling', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120', text: 'Cloudflare Pages combined with custom CSS injection makes styling so dynamic.', timestamp: '5 hours ago', likes: 9 }
    ]
  },
  {
    id: 'art-2',
    title: 'Mastering Modern Motion Design & Micro-Interactions with Framer Motion',
    subtitle: 'Elevate user experience with fluid spatial choreography, physics-driven gestures, and accessible layout transitions.',
    category: 'Mind Science',
    tags: ['Mind Science', 'Cognition', 'UI/UX', 'Neuroscience', 'Focus'],
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
    publishedAt: 'Aug 03, 2026',
    readTime: '8 min read',
    views: 18920,
    likes: 1240,
    author: {
      name: 'Aria Thorne',
      role: 'Lead UI/UX Engineer & Motion Specialist',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
      bio: 'Crafting fluid digital interfaces and human-centered motion choreography.'
    },
    toc: [
      { id: 'm-1', text: '1. The Psychology of Purposeful Motion', level: 2 },
      { id: 'm-2', text: '2. Implementing Spring Physics over Linear Easing', level: 2 },
      { id: 'm-3', text: '3. Shared Layout Animations with layoutId', level: 2 },
    ],
    content: `## 1. The Psychology of Purposeful Motion

Animation in web design should never be decorative noise; it serves as spatial feedback for the user's mental model. When an element scales, fades, or glides, it signals object persistence and structural hierarchy.

### The 3 Core Rules of Modern Motion:
1. **Snappy Responsiveness**: User-initiated micro-interactions should respond within **100ms** with swift acceleration curves.
2. **Physical Context**: Objects should feel as though they possess mass and momentum using spring physics.
3. **Respect Reduced Motion**: Always wrap complex choreography in media query guards to honor user preferences.

---

## 2. Implementing Spring Physics over Linear Easing

Linear easing curves feel rigid and robotic. Instead, leverage spring parameters (\`stiffness\`, \`damping\`, and \`mass\`) to simulate natural kinetic movement.

\`\`\`tsx
import { motion } from 'motion/react';

export function GlowCard({ title, description }: { title: string; description: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -6 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20
      }}
      className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-xl hover:border-cyan-500/50 hover:shadow-cyan-500/10 transition-colors"
    >
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm">{description}</p>
    </motion.div>
  );
}
\`\`\`

---

## 3. Shared Layout Animations with layoutId

Morphing tabs, expanding cards, and floating highlights become trivial using \`layoutId\` in React motion libraries.

\`\`\`tsx
{tabs.map((tab) => (
  <button
    key={tab.id}
    onClick={() => setActiveTab(tab.id)}
    className="relative px-4 py-2 text-sm font-medium transition-colors text-slate-300 hover:text-white"
  >
    {activeTab === tab.id && (
      <motion.div
        layoutId="active-indicator"
        className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg -z-10"
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      />
    )}
    {tab.label}
  </button>
))}
\`\`\``,
    comments: [
      { id: 'c3', author: 'Devon Vance', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120', text: 'Spring stiffness 300 / damping 20 is my go-to preset now. Perfect balance!', timestamp: '1 day ago', likes: 22 }
    ]
  },
  {
    id: 'art-3',
    title: 'Building AI-Powered Content Pipelines with Gemini 3.6 Flash & Server Routes',
    subtitle: 'How to implement automatic article summarization, live translation, and smart metadata generation without exposing secret keys.',
    category: 'AI & Future',
    tags: ['Gemini API', 'AI', 'Fullstack', 'Express', 'TypeScript'],
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200',
    publishedAt: 'Aug 02, 2026',
    readTime: '7 min read',
    views: 21040,
    likes: 1580,
    author: {
      name: 'Dr. Aris Thorne',
      role: 'Chief AI Systems Strategist',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      bio: 'Researching generative AI architectures and server-side model orchestration.'
    },
    toc: [
      { id: 'ai-1', text: '1. Why Full-Stack API Isolation is Essential for AI Keys', level: 2 },
      { id: 'ai-2', text: '2. Setting up @google/genai in Express Server', level: 2 },
      { id: 'ai-3', text: '3. Realtime Translation Endpoint Integration', level: 2 },
    ],
    content: `## 1. Why Full-Stack API Isolation is Essential for AI Keys

When building production web apps powered by Google Gemini, embedding API keys directly in client bundles exposes them to potential abuse and rate-limit depletion.

By routing all requests through server-side Express endpoints (\`/api/gemini/*\`), your secret key stays securely stored in environment variables (\`process.env.GEMINI_API_KEY\`).

---

## 2. Setting up @google/genai in Express Server

Import the modern \`@google/genai\` SDK on the server and construct the client with the required User-Agent telemetry headers.

\`\`\`typescript
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build'
    }
  }
});

export async function summarizeText(text: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: \`Summarize the following text in 3 bullet points:\\n\${text}\`,
  });
  return response.text;
}
\`\`\`

---

## 3. Realtime Translation Endpoint Integration

To enable instant multi-language translation across articles and developer tools, implement a dedicated translation route:

\`\`\`typescript
app.post('/api/gemini/translate', async (req, res) => {
  const { text, targetLang } = req.body;
  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: \`Translate to \${targetLang}:\\n\${text}\`
  });
  res.json({ translatedText: response.text });
});
\`\`\`

This setup ensures ultra-fast responses with enterprise-grade key protection!`,
    comments: [
      { id: 'c4', author: 'Liam Gallagher', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=120', text: 'Using server-side Gemini 3.6 Flash endpoint completely transformed our content indexing pipeline!', timestamp: '2 days ago', likes: 18 }
    ]
  },
  {
    id: 'art-4',
    title: 'The Ultimate Guide to Custom CSS Injection & Micro-Theming Engine',
    subtitle: 'Unlocking infinite UI customization with live DOM style injection, CSS variable overrides, and Google Translate widget styling.',
    category: 'Tech',
    tags: ['CSS Injection', 'Web Tools', 'Theming', 'UI Customization', 'DOM'],
    coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1200',
    publishedAt: 'Aug 01, 2026',
    readTime: '5 min read',
    views: 12400,
    likes: 910,
    author: {
      name: 'Kai Vance',
      role: 'Staff Frontend Architect',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=200',
      bio: 'Lover of clean CSS architectures, custom design tokens, and user customization.'
    },
    toc: [
      { id: 'css-1', text: '1. How Dynamic Style Injection Works in React', level: 2 },
      { id: 'css-2', text: '2. Styling Third-Party Translation Widgets', level: 2 },
    ],
    content: `## 1. How Dynamic Style Injection Works in React

Custom CSS injection gives users total ownership over their visual environment. By binding an active state to a \`<style id="custom-user-css">\` tag in the DOM \`<head>\`, any standard CSS rules, font family overrides, or glowing animation keyframes take immediate effect without reloading the page.

\`\`\`typescript
export function applyUserCSS(cssString: string) {
  let styleEl = document.getElementById('nexus-custom-css');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'nexus-custom-css';
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = cssString;
}
\`\`\`

---

## 2. Styling Third-Party Translation Widgets

When embedding external widgets like Google Translate or custom language switchers, injecting custom CSS allows you to seamlessly hide clunky default popups and match dark/light design systems:

\`\`\`css
/* Custom CSS Injection Example */
.goog-te-banner-frame {
  display: none !important;
}
body {
  top: 0px !important;
}
.translated-highlight {
  background: linear-gradient(120deg, rgba(6,182,212,0.2), rgba(59,130,246,0.2));
  border-bottom: 2px solid #06b6d4;
}
\`\`\``,
    comments: [
      { id: 'c5', author: 'Nadia Petrov', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120', text: 'The live style injection drawer is so useful for tweaking custom fonts and dark mode accents!', timestamp: '3 days ago', likes: 11 }
    ]
  },
  {
    id: 'art-5',
    title: 'Architecting Resilient Real-Time Micro-Frontends with Module Federation',
    subtitle: 'Decouple large monolithic codebases into independently deployable, type-safe micro-applications with Vite and Webpack 5.',
    category: 'Business',
    tags: ['Business', 'Vite', 'Architecture', 'Enterprise', 'Strategy'],
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200',
    publishedAt: 'Jul 30, 2026',
    readTime: '9 min read',
    views: 16500,
    likes: 1120,
    author: {
      name: 'Siddharth Patel',
      role: 'Staff Systems Architect',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
      bio: 'Specializing in enterprise scale frontend infrastructure and distributed modules.'
    },
    toc: [
      { id: 'mf-1', text: '1. What is Module Federation?', level: 2 },
      { id: 'mf-2', text: '2. Remote & Host Configuration in Vite', level: 2 },
      { id: 'mf-3', text: '3. Shared Dependency Management', level: 2 }
    ],
    content: `## 1. What is Module Federation?

Module Federation allows a JavaScript application to dynamically load code from another application at runtime. Unlike traditional npm packages, updates to remote modules deploy instantly without requiring host application rebuilds.

### Core Benefits:
- **Autonomous Release Cycles**: Autonomous teams deploy remote apps independently.
- **Shared Memory Footprint**: Common libraries like React or Tailwind load once at runtime.
- **Zero Monorepo Bottlenecks**: Independent repos stream components on demand.

---

## 2. Remote & Host Configuration in Vite

Using \`@originjs/vite-plugin-federation\`, expose and consume components with minimal setup:

\`\`\`typescript
// vite.config.ts (Remote App)
import { defineConfig } from 'vite';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    federation({
      name: 'remote_ui',
      filename: 'remoteEntry.js',
      exposes: {
        './Button': './src/components/Button.tsx',
        './Header': './src/components/Header.tsx',
      },
      shared: ['react', 'react-dom']
    })
  ]
});
\`\`\`

---

## 3. Shared Dependency Management

Ensure version alignment across remote modules to avoid duplicate React bundle instantiations!`,
    comments: []
  },
  {
    id: 'art-6',
    title: 'Zero-Downtime Database Migrations with Prisma, Supabase & Cloud SQL',
    subtitle: 'A practical guide to non-blocking schema evolution, dual-writing patterns, and zero-downtime database upgrades.',
    category: 'Science',
    tags: ['Science', 'Database', 'PostgreSQL', 'Cloud SQL', 'CI/CD'],
    coverImage: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=1200',
    publishedAt: 'Jul 28, 2026',
    readTime: '7 min read',
    views: 19800,
    likes: 1430,
    author: {
      name: 'Clara Vance',
      role: 'DevOps & Infrastructure Lead',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
      bio: 'Automating continuous delivery pipelines and resilient database clusters.'
    },
    toc: [
      { id: 'db-1', text: '1. The Dual-Write Migration Strategy', level: 2 },
      { id: 'db-2', text: '2. Non-Blocking DDL Executions', level: 2 }
    ],
    content: `## 1. The Dual-Write Migration Strategy

Evolving production schemas without taking down application services requires a multi-phase deployment pipeline:

1. **Expand**: Add new columns or tables as nullable or with default constraints.
2. **Dual Write**: Update API services to write to both legacy and new schema targets.
3. **Backfill**: Migrate historical records in asynchronous background batches.
4. **Contract**: Remove legacy columns safely once zero reads target old attributes.

---

## 2. Non-Blocking DDL Executions

Avoid acquiring heavy table locks in PostgreSQL by using concurrent index builds:

\`\`\`sql
CREATE INDEX CONCURRENTLY idx_users_email_verified ON users (email, is_verified);
\`\`\``,
    comments: []
  },
  {
    id: 'art-7',
    title: 'Mastering Web Vitals 2026: Achieving 100/100 Lighthouse Performance Scores',
    subtitle: 'Optimize Interaction to Next Paint (INP), Largest Contentful Paint (LCP), and Cumulative Layout Shift (CLS) for max SEO impact.',
    category: 'Health',
    tags: ['Health', 'SEO', 'Web Vitals', 'Lighthouse', 'React'],
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200',
    publishedAt: 'Jul 25, 2026',
    readTime: '6 min read',
    views: 24100,
    likes: 1890,
    author: {
      name: 'Lucas Sterling',
      role: 'Web Performance Architect',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      bio: 'Obsessed with sub-second web delivery and Google SEO ranking algorithms.'
    },
    toc: [
      { id: 'wv-1', text: '1. Understanding INP (Interaction to Next Paint)', level: 2 },
      { id: 'wv-2', text: '2. Optimizing LCP Image Loading', level: 2 }
    ],
    content: `## 1. Understanding INP (Interaction to Next Paint)

INP measures application responsiveness by timing every tap, click, or key press during a user's entire visit. A good INP target is **under 200 milliseconds**.

### Common INP Bottlenecks:
- Long synchronous JavaScript execution blocking the main thread.
- Heavy DOM recalculations inside click handlers.
- Unnecessary global React re-renders.

---

## 2. Optimizing LCP Image Loading

Ensure critical hero banner images preload immediately in HTML headers:

\`\`\`html
<link rel="preload" fetchpriority="high" as="image" href="/hero-cover.webp" type="image/webp">
\`\`\``,
    comments: []
  },
  {
    id: 'art-8',
    title: 'Designing Accessible Design Systems with Tailwind CSS & Radix Primitives',
    subtitle: 'Create robust WCAG AAA compliant UI component libraries with dynamic focus rings and keyboard navigation.',
    category: 'World Cast',
    tags: ['World Cast', 'Accessibility', 'Tailwind', 'Radix UI', 'React'],
    coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1200',
    publishedAt: 'Jul 22, 2026',
    readTime: '8 min read',
    views: 15300,
    likes: 980,
    author: {
      name: 'Maya Lin',
      role: 'Principal Design Technologist',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      bio: 'Championing inclusive design systems and accessible design tokens.'
    },
    toc: [
      { id: 'a11y-1', text: '1. High Contrast Design Tokens', level: 2 },
      { id: 'a11y-2', text: '2. ARIA Dialog & Focus Trapping', level: 2 }
    ],
    content: `## 1. High Contrast Design Tokens

Accessibility begins with mathematical contrast ratios. Ensure text elements pass WCAG AA (minimum 4.5:1 ratio) across both light and dark themes.

---

## 2. ARIA Dialog & Focus Trapping

When modals open, focus must automatically trap within the dialog boundary to protect screen-reader users.`,
    comments: []
  },
  {
    id: 'art-9',
    title: 'Serverless Edge Functions vs Traditional Containers in 2026',
    subtitle: 'When to choose Vercel/Cloudflare Edge workers over Docker Cloud Run containers for modern API gateways.',
    category: 'Science',
    tags: ['Edge', 'Cloud Run', 'Docker', 'Serverless', 'Backend'],
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200',
    publishedAt: 'Jul 20, 2026',
    readTime: '6 min read',
    views: 17400,
    likes: 1290,
    author: {
      name: 'Elena Rostova',
      role: 'Principal Edge Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      bio: 'Building hyper-scalable distributed web systems & edge compute nodes.'
    },
    toc: [
      { id: 'e-1', text: '1. Latency & Cold Starts Comparison', level: 2 },
      { id: 'e-2', text: '2. Memory & Execution Limits', level: 2 }
    ],
    content: `## 1. Latency & Cold Starts Comparison

Edge Workers run on V8 isolate runtimes with 0ms cold starts, while Docker containers in Cloud Run spin up full Linux kernels in 1-2 seconds.

---

## 2. Memory & Execution Limits

For heavy AI model inferencing or video processing, containers provide unlimited CPU & GPU access.`,
    comments: []
  },
  {
    id: 'art-10',
    title: 'Automating Web Testing with Playwright & GitHub Actions CI',
    subtitle: 'Catch visual regressions, broken navigation flows, and API failures before hitting production.',
    category: 'Tech',
    tags: ['Playwright', 'Testing', 'CI/CD', 'Automation', 'GitHub Actions'],
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200',
    publishedAt: 'Jul 18, 2026',
    readTime: '5 min read',
    views: 13900,
    likes: 870,
    author: {
      name: 'Clara Vance',
      role: 'DevOps & Infrastructure Lead',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
    },
    toc: [
      { id: 'pw-1', text: '1. End-to-End Test Suite Setup', level: 2 }
    ],
    content: `## 1. End-to-End Test Suite Setup

Playwright runs end-to-end tests across Chromium, Firefox, and WebKit simultaneously in headless mode.`,
    comments: []
  }
];

export const AVAILABLE_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'si', name: 'Sinhala', nativeName: 'සිංහල', flag: '🇱🇰' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' }
];
