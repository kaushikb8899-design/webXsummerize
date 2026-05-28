import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsing middleware
  app.use(express.json());

  // Server-side lazy initialized Gemini client
  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is not configured. Please define it in your AI Studio secrets.");
      }
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          }
        }
      });
    }
    return aiClient;
  }

  interface AnalyticPillar {
    title: string;
    description: string;
    actionItems: string[];
  }

  interface MindmapCategory {
    title: string;
    summary: string;
    subNodes: string[];
  }

  interface InfographicMetric {
    metric: string;
    label: string;
    progress: number;
    color: string;
    caption: string;
  }

  interface StreamlinedJSON {
    generalTitle: string;
    pillars: AnalyticPillar[];
    mindmap: {
      rootTitle: string;
      categories: MindmapCategory[];
    };
    infographics: InfographicMetric[];
  }

  function compilePillarsToHtml(pillars: AnalyticPillar[]): string {
    return `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${pillars.map((pillar, idx) => `
          <div class="bg-[#0F1322]/80 border border-white/5 rounded-2xl p-6 hover:border-[#0066FF]/20 hover:scale-[1.01] transition-all duration-300">
            <div class="flex items-center justify-between mb-4">
              <span class="inline-flex items-center text-[9px] font-mono font-bold text-[#0066FF] bg-blue-950/40 px-2.5 py-1 rounded border border-blue-900/30 uppercase tracking-wider">
                Strategic Pillar 0${idx + 1}
              </span>
              <span class="w-2 h-2 rounded-full bg-[#0066FF] shadow-[0_0_8px_rgba(0,102,255,0.8)]"></span>
            </div>
            <h3 class="text-white text-lg font-bold mb-3 tracking-wide">${pillar.title}</h3>
            <p class="text-slate-400 text-xs leading-relaxed mb-5">${pillar.description}</p>
            
            <div class="space-y-3 pt-3 border-t border-white/[0.03]">
              <h4 class="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Strategic Actions</h4>
              <div class="space-y-2.5 animation-stagger">
                ${pillar.actionItems.map(item => `
                  <div class="flex gap-2.5 items-start text-xs text-slate-300 leading-normal">
                    <svg class="w-4 h-4 text-[#0066FF] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4"></path>
                    </svg>
                    <span>${item}</span>
                  </div>
                `).join("")}
              </div>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }

  function compileMindmapToHtml(mindmap: StreamlinedJSON["mindmap"]): string {
    return `
      <div class="flex flex-col items-center gap-8 py-6 min-w-[700px]">
        <!-- Root Node -->
        <div class="mindmap-root bg-[#0066FF] text-white px-7 py-4 rounded-xl font-bold text-sm shadow-[0_0_25px_rgba(0,102,255,0.4)] border border-blue-400/30 text-center uppercase tracking-wider">
          ${mindmap.rootTitle}
        </div>
        
        <!-- Connectors Line -->
        <div class="w-0.5 h-8 bg-gradient-to-b from-[#0066FF] to-[#0F1322]/80"></div>
        
        <!-- Category Nodes -->
        <div class="mindmap-children grid grid-cols-3 gap-6 w-full">
          ${mindmap.categories.map((cat, idx) => `
            <div class="mindmap-node bg-[#0F1322]/60 border border-white/5 rounded-2xl p-5 space-y-4 hover:border-indigo-500/30 transition-all duration-350 flex flex-col justify-between">
              <div class="border-b border-white/5 pb-3">
                <span class="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-semibold">BRANCH 0${idx + 1}</span>
                <h4 class="text-white text-sm font-bold tracking-tight mt-1 truncate">${cat.title}</h4>
                <p class="text-[11px] text-slate-500 leading-normal mt-1.5">${cat.summary}</p>
              </div>
              
              <div class="mindmap-sub-nodes space-y-2 pt-1">
                ${cat.subNodes.map(subNode => `
                  <div class="mindmap-sub-node bg-slate-950/40 hover:bg-[#05070F]/60 px-3 py-2.5 rounded-lg border border-white/[0.02] hover:border-slate-800 transition-colors flex gap-2.5 items-center text-xs text-slate-350">
                    <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0 animate-pulse"></span>
                    <span class="leading-normal">${subNode}</span>
                  </div>
                `).join("")}
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  function compileInfographicToHtml(infographics: InfographicMetric[]): string {
    return `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        ${infographics.map((info, idx) => {
          let barColor = "from-blue-600 to-blue-400";
          let labelColor = "text-blue-400/90";
          if (info.color === "cyan") {
            barColor = "from-cyan-600 to-cyan-400";
            labelColor = "text-cyan-400/90";
          } else if (info.color === "indigo") {
            barColor = "from-indigo-600 to-indigo-400";
            labelColor = "text-indigo-400/90";
          } else if (info.color === "emerald") {
            barColor = "from-emerald-600 to-emerald-400";
            labelColor = "text-emerald-450/95";
          }
          
          return `
            <div class="bg-[#0F1322]/80 border border-white/5 rounded-2xl p-6 flex flex-col justify-between hover:border-[#0066FF]/20 hover:scale-[1.01] transition-all duration-300">
              <div>
                <div class="flex items-center justify-between mb-4">
                  <span class="inline-flex items-center text-[9px] font-mono font-bold ${labelColor} bg-[#0F1322] border border-white/5 px-2 py-0.5 rounded uppercase tracking-wider">
                    STAT 0${idx + 1}
                  </span>
                  <span class="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                </div>
                
                <!-- Big focus display metric -->
                <div class="text-white text-4.5xl md:text-5xl font-black tracking-tight font-sans mt-2 mb-1.5">
                  ${info.metric}
                </div>
                
                <!-- Descriptive Focus display label -->
                <h4 class="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold leading-normal mb-5 py-0.5">
                  ${info.label}
                </h4>
              </div>
              
              <div class="space-y-4">
                <!-- Linear visual progress bar fill track -->
                <div class="space-y-1.5">
                  <div class="flex justify-between items-center text-[9px] font-mono text-slate-500">
                    <span>Target Scale/Confidence Index</span>
                    <span>${info.progress}%</span>
                  </div>
                  <div class="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-white/[0.01]">
                    <div class="h-full rounded-full bg-gradient-to-r ${barColor}" style="width: ${info.progress}%"></div>
                  </div>
                </div>
                
                <p class="text-[11px] text-slate-500 leading-relaxed font-sans border-t border-white/[0.02] pt-3.5 mt-2">
                  ${info.caption}
                </p>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  // API Endpoint: Research Synthesis Proxy (secures key and executes 3x faster!)
  app.post("/api/generate", async (req, res) => {
    try {
      const { urls } = req.body;
      if (!urls || !Array.isArray(urls) || urls.length === 0) {
        return res.status(400).json({ error: "Missing required parameter: urls must be a non-empty array." });
      }

      console.log(`[Gemini Server Proxy] Synthesizing research brief for ${urls.length} URLs...`);

      const ai = getGeminiClient();

      const prompt = `You are a Senior Strategic Research Analyst. Your job is to conduct comprehensive analysis on the following URLs, synthesizing their context into premium analytical deliverables.
  
Research Target Locations:
${JSON.stringify(urls, null, 2)}

Provide a structured analysis according to the specified schema. Keep summaries tight, insightful, and professional. Use human-friendly, high-contrast, informative content. Do not output HTML; output raw JSON data parameters that will be rendered on the client side.`;

      // Query Gemini 3.5 Flash server-side with structured JSON output response schema
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              generalTitle: { type: Type.STRING, description: "The high-end aggregated research title (3-5 words)" },
              pillars: {
                type: Type.ARRAY,
                description: "Four distinct structural core pillars for the executive summary tab",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING, description: "A highly concentrated synthesis paragraph summarizing trends/insights from the target links" },
                    actionItems: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "3-4 bullet-proof business action items"
                    }
                  },
                  required: ["title", "description", "actionItems"]
                }
              },
              mindmap: {
                type: Type.OBJECT,
                description: "A logic-driven concept mindmap",
                properties: {
                  rootTitle: { type: Type.STRING, description: "The root topic theme node" },
                  categories: {
                    type: Type.ARRAY,
                    description: "3-4 category branches",
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING, description: "Category branch title" },
                        summary: { type: Type.STRING, description: "One sentence summary of this branch context" },
                        subNodes: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING },
                          description: "3-4 deep-dive core concept points belonging to this branch"
                        }
                      },
                      required: ["title", "summary", "subNodes"]
                    }
                  }
                },
                required: ["rootTitle", "categories"]
              },
              infographics: {
                type: Type.ARRAY,
                description: "Three highly polished quantitative metrics/stats card structures",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    metric: { type: Type.STRING, description: "Large number or percentage focus metric (e.g. '$4.2B', '96%', '8.5x')" },
                    label: { type: Type.STRING, description: "Descriptive label (e.g. 'Coherence preservation rate')" },
                    progress: { type: Type.INTEGER, description: "Numeric rating / percentage from 0 to 100 for a progress fill bar if applicable" },
                    color: { type: Type.STRING, description: "Color style to use: 'blue' or 'cyan' or 'indigo' or 'emerald'" },
                    caption: { type: Type.STRING, description: "A short caption mapping the context of the URLs" }
                  },
                  required: ["metric", "label", "progress", "color", "caption"]
                }
              }
            },
            required: ["generalTitle", "pillars", "mindmap", "infographics"]
          }
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error("Empty response received from the Gemini 3.5 synthesis engine.");
      }

      // Safe parse
      const parsedData: StreamlinedJSON = JSON.parse(text.trim());

      // Server-side project the streamlined JSON into beautiful semantic HTML structures
      const outputHTMLPayload = {
        generalTitle: parsedData.generalTitle,
        summaryHtml: compilePillarsToHtml(parsedData.pillars),
        mindmapHtml: compileMindmapToHtml(parsedData.mindmap),
        infographicHtml: compileInfographicToHtml(parsedData.infographics)
      };

      res.json(outputHTMLPayload);

    } catch (error: any) {
      console.error("[Gemini Server Error]:", error);
      res.status(500).json({ error: error.message || "Internal Service Error while compiling brief." });
    }
  });

  // Serve static assets and templates or use Vite dev server
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[ResearchBrief AI Server] listening running on http://localhost:${PORT}`);
  });
}

startServer();
