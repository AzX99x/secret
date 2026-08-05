// Instant client-side translation helper with comprehensive dictionary support & Gemini API fallback

export const TRANSLATION_DICTIONARY: Record<string, Record<string, string>> = {
  si: {
    // Sinhala translations
    "Featured Technical Articles": "විශේෂිත තාක්ෂණික ලිපි",
    "World-Class Tech Insights & Developer Motion Studio": "ලෝක මට්ටමේ තාක්ෂණික තොරතුරු සහ සංවර්ධන ස්ටූඩියෝව",
    "Generate Article with AI": "AI මගින් ලිපියක් සාදන්න",
    "Write Custom Article": "නව ලිපියක් ලියන්න",
    "All": "සියල්ල",
    "AI & Future": "කෘතිම බුද්ධිය (AI) සහ අනාගතය",
    "Frontend & Motion": "ෆ්‍රොන්ට්එන්ඩ් සහ චලන (Motion)",
    "Cloud & Edge": "ක්ලවුඩ් සහ එජ් (Edge)",
    "Web Tools": "වෙබ් මෙවලම්",
    "DevOps & CI/CD": "DevOps සහ CI/CD",
    "Design Systems": "සැලසුම් පද්ධති (Design Systems)",
    "Search articles, tags, authors...": "ලිපි, ටැග්, කතුවරුන් සොයන්න...",
    "Articles & Feed": "ලිපි සහ පෝෂණය",
    "Dev Tools & Studio": "සංවර්ධක මෙවලම්",
    "Live CSS Injector": "සජීවී CSS ඉන්ජෙක්ටරය",
    "Listen": "සවන් දෙන්න",
    "Stop Audio": "ශ්‍රව්‍ය නවත්න්න",
    "AI Takeaways": "AI ප්‍රධාන කරුණු",
    "Table of Contents": "පටුන",
    "Developer Discussion": "සංවර්ධක සාකච්ඡාව",
    "Post Comment": "අදහස පළ කරන්න",
    "Export Markdown": "මවුක්ඩවුන් අපනයනය",
    "Likes": "කැමැත්ත",
    "Just Now": "දැන්",
    "Deploying High-Performance Web Apps on Cloudflare Pages & GitHub Actions": "ක්ලවුඩ්ෆ්ලෙයාර් සහ ජිට්හබ් හි ඉහළ ක්‍රියාකාරී වෙබ් අඩවි ස්ථාපනය",
    "Mastering Modern Motion Design & Micro-Interactions with Framer Motion": "Framer Motion මගින් නූතන චලන නිර්මාණය සහ ක්ෂුද්‍ර අන්තර්ක්‍රියා ප්‍රගුණ කිරීම",
    "Building AI-Powered Content Pipelines with Gemini 3.6 Flash & Server Routes": "Gemini 3.6 Flash භාවිතයෙන් AI අන්තර්ගත පද්ධති ගොඩනැගීම",
    "The Ultimate Guide to Custom CSS Injection & Micro-Theming Engine": "අභිරුචි CSS ඉන්ජෙක්ෂන් සහ තීම් එන්ජිම සඳහා සම්පූර්ණ මගපෙන්වීම"
  },
  es: {
    // Spanish
    "Featured Technical Articles": "Artículos Técnicos Destacados",
    "World-Class Tech Insights & Developer Motion Studio": "Perspectivas Tecnológicas de Clase Mundial",
    "Generate Article with AI": "Generar Artículo con IA",
    "Write Custom Article": "Escribir Artículo Personalizado",
    "All": "Todos",
    "AI & Future": "IA y Futuro",
    "Frontend & Motion": "Frontend y Movimiento",
    "Cloud & Edge": "Nube y Edge",
    "Web Tools": "Herramientas Web",
    "DevOps & CI/CD": "DevOps y CI/CD",
    "Design Systems": "Sistemas de Diseño",
    "Search articles, tags, authors...": "Buscar artículos, etiquetas, autores...",
    "Articles & Feed": "Artículos y Feed",
    "Dev Tools & Studio": "Herramientas de Dev",
    "Listen": "Escuchar",
    "AI Takeaways": "Resumen IA",
    "Developer Discussion": "Discusión de Desarrolladores"
  },
  fr: {
    // French
    "Featured Technical Articles": "Articles Techniques en Vedette",
    "Generate Article with AI": "Générer un Article avec l'IA",
    "Write Custom Article": "Rédiger un Article",
    "All": "Tous",
    "AI & Future": "IA et Futur",
    "Frontend & Motion": "Frontend et Animation",
    "Cloud & Edge": "Cloud et Edge",
    "Web Tools": "Outils Web",
    "Search articles, tags, authors...": "Rechercher des articles, tags...",
    "Articles & Feed": "Articles & Flux",
    "Listen": "Écouter",
    "AI Takeaways": "Points Clés IA",
    "Developer Discussion": "Discussion des Développeurs"
  },
  de: {
    // German
    "Featured Technical Articles": "Hervorgehobene Technische Artikel",
    "Generate Article with AI": "Artikel mit KI Generieren",
    "Write Custom Article": "Eigenen Artikel Schreiben",
    "All": "Alle",
    "AI & Future": "KI & Zukunft",
    "Frontend & Motion": "Frontend & Motion",
    "Cloud & Edge": "Cloud & Edge",
    "Web Tools": "Web-Werkzeuge",
    "Search articles, tags, authors...": "Suchen...",
    "Articles & Feed": "Artikel & Feed",
    "Listen": "Anhören",
    "AI Takeaways": "KI-Erkenntnisse"
  },
  ja: {
    // Japanese
    "Featured Technical Articles": "注目の技術記事",
    "Generate Article with AI": "AIで記事を生成",
    "Write Custom Article": "カスタム記事を作成",
    "All": "すべて",
    "AI & Future": "AIと未来",
    "Frontend & Motion": "フロントエンドとモーション",
    "Cloud & Edge": "クラウド＆エッジ",
    "Web Tools": "Webツール",
    "Search articles, tags, authors...": "記事やタグを検索...",
    "Articles & Feed": "記事＆フィード",
    "Listen": "音声で聴く",
    "AI Takeaways": "AI要約"
  },
  zh: {
    // Chinese
    "Featured Technical Articles": "精选技术文章",
    "Generate Article with AI": "AI 生成文章",
    "Write Custom Article": "撰写自定义文章",
    "All": "全部",
    "AI & Future": "人工智能与未来",
    "Frontend & Motion": "前端与动效",
    "Cloud & Edge": "云计算与边缘",
    "Web Tools": "Web 工具",
    "Search articles, tags, authors...": "搜索文章、标签、作者...",
    "Articles & Feed": "文章与动态",
    "Listen": "朗读内容",
    "AI Takeaways": "AI 核心摘要"
  },
  ta: {
    // Tamil
    "Featured Technical Articles": "முக்கிய தொழில்நுட்ப கட்டுரைகள்",
    "Generate Article with AI": "AI கட்டுரையை உருவாக்கு",
    "Write Custom Article": "புதிய கட்டுரை எழுது",
    "All": "அனைத்தும்",
    "AI & Future": "செயற்கை நுண்ணறிவு & எதிர்காலம்",
    "Frontend & Motion": "முன்னணி & அசைவு",
    "Cloud & Edge": "கிளவுட் & எட்ஜ்",
    "Web Tools": "வலைக் கருவிகள்",
    "Search articles, tags, authors...": "தேடுங்கள்...",
    "Listen": "கேளுங்கள்",
    "AI Takeaways": "AI முக்கிய அம்சங்கள்"
  },
  hi: {
    // Hindi
    "Featured Technical Articles": "प्रमुख तकनीकी लेख",
    "Generate Article with AI": "AI से लेख उत्पन्न करें",
    "Write Custom Article": "नया लेख लिखें",
    "All": "सभी",
    "AI & Future": "AI और भविष्य",
    "Frontend & Motion": "फ्रंटएंड और मोशन",
    "Cloud & Edge": "क्लाउड और एज",
    "Web Tools": "वेब उपकरण",
    "Search articles, tags, authors...": "खोजें...",
    "Listen": "सुनें",
    "AI Takeaways": "AI मुख्य बिंदु"
  }
};

/**
 * Returns instant client-side translation if available in dictionary or formatted
 */
export function translateTextInstant(text: string, langCode: string): string {
  if (!text || langCode === 'en') return text;

  const langDict = TRANSLATION_DICTIONARY[langCode];
  if (langDict && langDict[text]) {
    return langDict[text];
  }

  // If text is in dictionary, return translated value
  if (langDict) {
    for (const [key, val] of Object.entries(langDict)) {
      if (text.includes(key)) {
        return text.replace(key, val);
      }
    }
  }

  return text;
}

/**
 * Translates any text into target world language using free Google Translate client endpoint (Zero Gemini API Quota)
 */
export async function translateTextFree(text: string, targetLang: string): Promise<string> {
  if (!text || !targetLang || targetLang === 'en') return text;

  try {
    const lines = text.split('\n');
    // Translate in parallel chunks
    const translatedLines = await Promise.all(
      lines.map(async (line) => {
        if (!line.trim()) return line;
        // Don't translate code block fences like ```typescript
        if (line.trim().startsWith('```')) return line;

        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(line)}`;
        const res = await fetch(url);
        if (!res.ok) return line;
        
        const data = await res.json();
        if (Array.isArray(data?.[0])) {
          return data[0].map((item: any) => item[0] || '').join('');
        }
        return line;
      })
    );
    return translatedLines.join('\n');
  } catch (err) {
    console.warn('Free Google Translate error:', err);
    return text;
  }
}
