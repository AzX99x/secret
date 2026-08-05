import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Endpoint to automatically scan the /public folder and subfolders recursively for any .html article files
app.get("/api/public-articles", (_req, res) => {
  try {
    const scannedArticles: any[] = [];
    const publicDir = path.join(process.cwd(), "public");

    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Helper to walk a directory recursively
    const walkAndScan = (dirPath: string, relativePrefix: string = "") => {
      if (!fs.existsSync(dirPath)) return;

      let entries: fs.Dirent[] = [];
      try {
        entries = fs.readdirSync(dirPath, { withFileTypes: true });
      } catch (e) {
        return;
      }

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        const relPath = relativePrefix ? `${relativePrefix}/${entry.name}` : entry.name;

        if (entry.isDirectory()) {
          // Skip system/build directories
          if (!["node_modules", ".git", "dist", "build", ".aistudio"].includes(entry.name)) {
            walkAndScan(fullPath, relPath);
          }
        } else if (entry.isFile()) {
          const lowerName = entry.name.toLowerCase();
          if (lowerName.endsWith(".html") || lowerName.endsWith(".htm")) {
            // Skip top-level root app index.html if in public root
            if (relPath === "index.html" || relPath === "/index.html") continue;

            try {
              const stat = fs.statSync(fullPath);
              const rawHtml = fs.readFileSync(fullPath, "utf-8");

              // Extract Title (OG Title > Meta Title > Title Tag > H1 > Filename)
              let titleStr = "";
              const ogTitle = rawHtml.match(/<meta\s+property=["']og:title["']\s+content=["'](.*?)["']/i)
                || rawHtml.match(/<meta\s+name=["']title["']\s+content=["'](.*?)["']/i);
              const titleTag = rawHtml.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
              const h1Tag = rawHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);

              if (ogTitle && ogTitle[1].trim()) {
                titleStr = ogTitle[1].trim();
              } else if (titleTag && titleTag[1].trim()) {
                titleStr = titleTag[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
              } else if (h1Tag && h1Tag[1].trim()) {
                titleStr = h1Tag[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
              } else {
                titleStr = entry.name.replace(/\.(html|htm)$/i, "").replace(/[-_]/g, " ");
              }

              // Extract Excerpt / Description
              let excerpt = "";
              const ogDesc = rawHtml.match(/<meta\s+(?:name|property)=["'](?:description|og:description)["']\s+content=["'](.*?)["']/i);
              const firstP = rawHtml.match(/<p[^>]*>([\s\S]*?)<\/p>/i);

              if (ogDesc && ogDesc[1].trim()) {
                excerpt = ogDesc[1].trim();
              } else if (firstP && firstP[1].trim()) {
                excerpt = firstP[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
              }
              if (!excerpt || excerpt.length < 5) {
                excerpt = "Published HTML publication document.";
              }
              if (excerpt.length > 180) {
                excerpt = excerpt.slice(0, 185) + "...";
              }

              // Extract Cover Image
              let coverImgUrl = "";
              const ogImg = rawHtml.match(/<meta\s+property=["']og:image["']\s+content=["'](.*?)["']/i);
              const firstImg = rawHtml.match(/<img[^>]+src=["']([^"']+)["']/i);

              if (ogImg && ogImg[1].trim()) {
                coverImgUrl = ogImg[1].trim();
              } else if (firstImg && firstImg[1].trim() && !firstImg[1].includes("1px")) {
                coverImgUrl = firstImg[1].trim();
              } else {
                coverImgUrl = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000";
              }

              const articleUrl = `/${relPath}`;

              scannedArticles.push({
                id: `public-html-${relPath.replace(/[^a-zA-Z0-9]/g, "-")}`,
                title: titleStr.charAt(0).toUpperCase() + titleStr.slice(1),
                subtitle: excerpt,
                category: "Tech",
                publishedAt: stat.mtime ? new Date(stat.mtime).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
                readTime: `${Math.max(1, Math.ceil(rawHtml.length / 1000))} min read`,
                coverImage: coverImgUrl,
                author: {
                  name: "Public HTML Article",
                  role: "GitHub Document",
                  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
                },
                content: rawHtml,
                isHtmlFile: true,
                htmlUrl: articleUrl,
                likes: 18,
                views: 210,
                tags: ["Public HTML", "GitHub Sync", "Auto Scanned"]
              });
            } catch (fileErr) {
              console.warn("Failed to parse HTML file:", fullPath, fileErr);
            }
          }
        }
      }
    };

    // Scan public directory recursively
    walkAndScan(publicDir);

    // Also scan an optional /articles directory at root if present
    const rootArticlesDir = path.join(process.cwd(), "articles");
    if (fs.existsSync(rootArticlesDir)) {
      walkAndScan(rootArticlesDir, "articles");
    }

    res.json({ articles: scannedArticles });
  } catch (err: any) {
    console.error("Public articles scan error:", err);
    res.json({ articles: [] });
  }
});

// Endpoint to upload or save a new HTML article directly into /public/articles/
app.post("/api/upload-html-article", (req, res) => {
  try {
    const { fileName, htmlContent } = req.body;
    if (!htmlContent) {
      return res.status(400).json({ error: "HTML content is required" });
    }

    const publicArticlesDir = path.join(process.cwd(), "public", "articles");
    if (!fs.existsSync(publicArticlesDir)) {
      fs.mkdirSync(publicArticlesDir, { recursive: true });
    }

    let cleanName = (fileName || `article-${Date.now()}`).toLowerCase().replace(/[^a-z0-9-_]/g, "-");
    if (!cleanName.endsWith(".html")) {
      cleanName += ".html";
    }

    const filePath = path.join(publicArticlesDir, cleanName);
    fs.writeFileSync(filePath, htmlContent, "utf-8");

    const articleUrl = `/articles/${cleanName}`;

    res.json({
      success: true,
      fileName: cleanName,
      htmlUrl: articleUrl,
      message: `Successfully saved ${cleanName} to /public/articles/`
    });
  } catch (err: any) {
    console.error("Failed to save HTML article:", err);
    res.status(500).json({ error: err.message || "Failed to upload HTML article" });
  }
});

// Initialize Gemini Client safely
function getAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// In-memory Database Store for Likes & Comments (Persistent across client sessions)
const dbLikes: Record<string, number> = {};
const dbComments: Record<string, any[]> = {};

// GET Database Store state
app.get("/api/db/store", (_req, res) => {
  res.json({ likes: dbLikes, comments: dbComments });
});

// POST Like
app.post("/api/likes", (req, res) => {
  const { articleId } = req.body;
  if (!articleId) return res.status(400).json({ error: "Article ID required" });
  dbLikes[articleId] = (dbLikes[articleId] || 0) + 1;
  res.json({ articleId, likes: dbLikes[articleId] });
});

// GET Comments for article
app.get("/api/comments/:articleId", (req, res) => {
  const { articleId } = req.params;
  res.json({ comments: dbComments[articleId] || [] });
});

// POST Comment
app.post("/api/comments", (req, res) => {
  const { articleId, comment } = req.body;
  if (!articleId || !comment) return res.status(400).json({ error: "Article ID and comment required" });
  if (!dbComments[articleId]) dbComments[articleId] = [];
  dbComments[articleId].unshift(comment);
  res.json({ articleId, comments: dbComments[articleId] });
});

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Article Summarizer endpoint
app.post("/api/gemini/summarize", async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!content) {
      return res.status(400).json({ error: "Article content is required" });
    }

    const ai = getAIClient();
    if (!ai) {
      return res.json({
        summary: `This comprehensive article titled "${title || 'Article'}" breaks down core concepts, implementation strategies, performance optimization, and developer workflows for modern web architecture.`,
        keyTakeaways: [
          "Modern frontend architectures prioritize instant loading, micro-interactions, and responsive layout scaling.",
          "Cloud deployment pipelines streamline edge delivery and static site generation.",
          "Integrating AI-assisted workflows drastically speeds up content editing, translation, and code inspection."
        ],
        readabilityScore: "Advanced / Developer Friendly",
        estimatedMinutes: Math.ceil(content.length / 800)
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: `You are an expert tech editor. Analyze this article titled "${title || 'Untitled'}" and provide:
1. A concise 2-3 sentence executive summary.
2. Exactly 3 key bullet point takeaways.
3. Readability level (e.g. Beginner, Intermediate, Advanced Developer).

Article Content:
${content.slice(0, 4000)}

Return your response strictly in valid JSON with keys: "summary" (string), "keyTakeaways" (array of strings), "readabilityScore" (string).`,
        config: {
          responseMimeType: "application/json",
        }
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json({
        summary: parsed.summary || "Summary generated successfully.",
        keyTakeaways: parsed.keyTakeaways || ["Key insight 1", "Key insight 2", "Key insight 3"],
        readabilityScore: parsed.readabilityScore || "Intermediate",
        estimatedMinutes: Math.ceil(content.length / 800)
      });
    } catch (apiErr: any) {
      console.warn("Gemini model execution fallback:", apiErr.message);
      res.json({
        summary: `This comprehensive article titled "${title || 'Article'}" breaks down core concepts, implementation strategies, and performance optimizations.`,
        keyTakeaways: [
          "Modern frontend architectures prioritize instant loading and responsive layouts.",
          "Modular development improves maintenance and deployment reliability.",
          "Multi-language support expands accessibility across global technical communities."
        ],
        readabilityScore: "Intermediate Developer",
        estimatedMinutes: Math.ceil(content.length / 800)
      });
    }
  } catch (err: any) {
    console.error("Gemini summarize error:", err);
    res.status(500).json({ error: err.message || "Failed to summarize article" });
  }
});

// AI Translation endpoint
app.post("/api/gemini/translate", async (req, res) => {
  try {
    const { text, targetLang } = req.body;
    if (!text || !targetLang) {
      return res.status(400).json({ error: "Text and targetLang are required" });
    }

    const ai = getAIClient();
    if (!ai) {
      return res.json({ translatedText: text });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: `Translate the following text accurately into ${targetLang}. Preserve all code blocks, HTML, and markdown tags intact. Only return the translated text without extra conversational comments.

Text to translate:
${text}`,
      });

      res.json({ translatedText: response.text || text });
    } catch (apiErr: any) {
      console.warn("Gemini translate model fallback:", apiErr.message);
      res.json({ translatedText: text });
    }
  } catch (err: any) {
    console.error("Gemini translate error:", err);
    res.json({ translatedText: req.body.text || "" });
  }
});

// AI Article Generator endpoint
app.post("/api/gemini/generate-article", async (req, res) => {
  try {
    const { topic, category } = req.body;
    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    const ai = getAIClient();
    if (!ai) {
      return res.json({
        title: `Deep Dive into ${topic}`,
        subtitle: `A comprehensive guide exploring modern patterns, implementation strategies, and performance optimizations for ${topic}.`,
        readTime: "6 min read",
        author: {
          name: "NEXUS Tech Editorial",
          role: "Senior Architecture Specialist",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
        },
        content: `## Executive Overview

Understanding **${topic}** is essential for high-performance engineering. In this publication, we examine architectural best practices, developer workflows, and actionable code implementations.

### Key Conceptual Pillars

1. **Scalability & Performance**: Optimizing runtime execution and asset sizes.
2. **Developer Experience (DX)**: Clean abstractions, type safety, and fast iteration loops.
3. **Resilience**: Handling edge cases and robust error boundaries gracefully.

\`\`\`typescript
// Modern TypeScript Implementation Example
export interface ${topic.replace(/[^a-zA-Z0-9]/g, '')}Config {
  enabled: boolean;
  maxRetries: number;
  timeoutMs: number;
}

export function initializeSystem(config: ${topic.replace(/[^a-zA-Z0-9]/g, '')}Config) {
  console.log("System initialized with config:", config);
  return { status: "active", timestamp: Date.now() };
}
\`\`\`

### Conclusion & Future Outlook

Adopting ${topic} allows teams to scale confidence and code quality. Experiment with live code snippets and monitor performance metrics in production.`
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: `You are a world-class technical writer and senior staff software engineer. Write a deeply informative, publication-ready technical article on the topic: "${topic}" under category "${category || 'AI & Future'}".

Return strictly JSON with the following keys:
- "title": (engaging, professional title)
- "subtitle": (clear 1-line subtitle summary)
- "readTime": (e.g. "5 min read")
- "author": object with "name", "role", "avatar" (valid unsplash portrait URL)
- "content": (rich Markdown string formatted with headings ##, bullet points, bold highlights, and code blocks)
`,
        config: {
          responseMimeType: "application/json",
        }
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json({
        title: parsed.title || `Mastering ${topic}`,
        subtitle: parsed.subtitle || `Comprehensive guide to ${topic}`,
        readTime: parsed.readTime || "5 min read",
        author: parsed.author || {
          name: "NEXUS Editorial",
          role: "Staff Engineer",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
        },
        content: parsed.content || `## Overview\n\nExploring ${topic} in modern web architecture.`
      });
    } catch (apiErr: any) {
      console.warn("Gemini article generation fallback:", apiErr.message);
      res.json({
        title: `Deep Dive into ${topic}`,
        subtitle: `Exploring modern patterns and implementation strategies for ${topic}.`,
        readTime: "5 min read",
        author: {
          name: "NEXUS Tech Editorial",
          role: "Senior Architecture Specialist",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
        },
        content: `## Executive Overview\n\nUnderstanding **${topic}** is key to building modern high-performance web applications.`
      });
    }
  } catch (err: any) {
    console.error("Gemini article generator error:", err);
    res.status(500).json({ error: err.message || "Failed to generate article" });
  }
});

// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
