/**
 * ResearchBrief AI - Core Client Engine
 * Governs landing long-scroll workflows, active state machine transitions, simulated background extension tracks, and modular UI component tab switches.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Navigation active indicators sync
  initSharedComponents();

  // Multi-Page module routing triggers
  if (document.getElementById("results-container")) {
    initResultsPage();
  } else if (document.getElementById("history-container")) {
    initHistoryPage();
  } else {
    // If on index.html / app.html, initialize unified landing/dashboard tracker logic
    initUnifiedWorkspace();
  }
});

/**
 * Navigation Bar sync styling state
 */
function initSharedComponents() {
  const path = window.location.pathname;
  const navLinks = document.querySelectorAll("header nav a, footer nav a");
  navLinks.forEach(link => {
    const linkPath = link.getAttribute("href");
    if (path.endsWith(linkPath) || (path === "/" && linkPath === "index.html")) {
      link.classList.add("text-[#0066FF]", "font-bold", "border-b-2", "border-[#0066FF]");
      link.classList.remove("text-gray-400");
    }
  });
}

// Simulated Tab pools corresponding to topic selector drop-downs
const SIMULATED_STREAMS = {
  quantum: [
    { title: "Nature Paper: High-Temperature Majorana Fermion Superconductivity NISQ Era Experiments", url: "https://www.nature.com/articles/phys-quantum-nisq-majorana" },
    { title: "Physical Review: Coherence Preservation Algorithms for Superconducting Transmon Qubits", url: "https://journals.aps.org/prx/qubit-coherence-preservation" },
    { title: "MIT Tech Review: How Commercial NISQ Accelerates Molecular Chemistry Simulations", url: "https://www.technologyreview.com/2026/05/nisq-molecular-chemistry" },
    { title: "IEEE Spec: Quantum Annealing Benchmarks vs GPGPU Classical Matrix Systems", url: "https://spectrum.ieee.org/quantum-annealing-benchmarks" }
  ],
  "ai-agents": [
    { title: "ArXiv: Prompt-Activated Memex Memory Trees for Autonomous LLM Reasoning Cycles", url: "https://arxiv.org/abs/2604.memex-memory-agents" },
    { title: "HuggingFace blog: Multi-Agent Consensus Routers over Hierarchical Vector Directories", url: "https://huggingface.co/blog/multi-agent-consensus-routing" },
    { title: "GitHub: Tool-Call Speculative Decoding & Async Function Pipeline Integration", url: "https://github.com/agents-framework/speculative-tool-decoding" },
    { title: "OpenAI: Secure Sandbox Orchestration Protocols for Virtual Operating Systems", url: "https://openai.com/research/secure-agent-sandbox-protocols" }
  ],
  biotech: [
    { title: "Cell: Dual-Target CRISPR CRISPR-Cas12 Cas13 Ribosomal RNA Silencing in vivo", url: "https://www.cell.com/cell/crispr-cas12-cas13-ribosomal-silencing" },
    { title: "DeepMind AlphaFold: Accurate Deep-Learning Structural Models of Flexible Multimers", url: "https://deepmind.google/discover/blog/alphafold-3-flexible-multimers-accuracy" },
    { title: "Science Daily: Nanoparticle Carrier Mechanisms for Epitopic Vaccine Packages", url: "https://www.sciencedaily.com/releases/nanoparticle-carrier-mechanisms" },
    { title: "GEN News: Scaled mRNA Direct Vector Splicing in Mammalian Cell Cultures", url: "https://www.genengnews.com/mrna-mammalian-cell-vector" }
  ],
  saas: [
    { title: "Stripe Tech-blog: Scaled Usage-based Multitenant Billing Pipelines for LLM Consumptions", url: "https://stripe.com/blog/scaled-usage-multitenant-billing" },
    { title: "YCombinator: Why Micro-SaaS Platforms Scale Faster with Embedded AI Native Connectors", url: "https://www.ycombinator.com/library/micro-saas-scaling-ai" },
    { title: "Vercel: Edge-Optimized Streaming Render & ISR for Internationalized SaaS Portals", url: "https://vercel.com/blog/edge-optimized-streaming-render-saas" },
    { title: "TechCrunch: VC Trends in Zero-Code Workflow Automation & Middleware API Splicers", url: "https://techcrunch.com/2026/05/vc-trends-zerocode-workflow" }
  ]
};

/**
 * Unified Landing + Active Workspace simulation + Results State Machine (index.html & app.html)
 */
function initUnifiedWorkspace() {
  console.log("ResearchBrief AI: Unified Workspace initialized...");

  // Core containers
  const landingContainer = document.getElementById("landing-state-container");
  const recordingContainer = document.getElementById("recording-state-container");
  const processingContainer = document.getElementById("processing-state-container");
  const resultContainer = document.getElementById("result-state-container");

  // Interaction buttons & drop-downs
  const startTrackingBtn = document.getElementById("start-tracking-btn");
  const stopTrackingBtn = document.getElementById("stop-tracking-btn");
  const topicSelector = document.getElementById("research-topic");
  const activeTrackNameLabel = document.getElementById("active-track-name");
  
  // Simulated components
  const simulatedVisitsList = document.getElementById("simulated-visits-list");
  const emptyVisitsNote = document.getElementById("empty-visits-note");
  const collectedCounterBadge = document.getElementById("collected-counter-badge");
  const simulateTabBtn = document.getElementById("simulate-tab-btn");
  
  // Results sections
  const liveResultTitle = document.getElementById("live-result-title");
  const liveResultTimestamp = document.getElementById("live-result-timestamp");
  const liveResultUrls = document.getElementById("live-result-urls");
  const resetToLandingBtn = document.getElementById("reset-to-landing-btn");

  const compilerStatusText = document.getElementById("compiler-status-text");

  // Results Tabs triggers
  const liveTabSummaryBtn = document.getElementById("live-tab-summary-btn");
  const liveTabMindmapBtn = document.getElementById("live-tab-mindmap-btn");
  const liveTabInfographicBtn = document.getElementById("live-tab-infographic-btn");

  // Results content blocks
  const liveSummaryContent = document.getElementById("live-summary-content");
  const liveMindmapContent = document.getElementById("live-mindmap-content");
  const liveInfographicContent = document.getElementById("live-infographic-content");

  // Active tracking memory variables
  let trackingSessionActive = false;
  let trackedUrlsStore = [];
  let currentTopicKey = "quantum";
  let autoSimulateTimer = null;

  // Sync session counter label on landing page
  const history = getResearchHistory();
  const historyBadgeEl = document.getElementById("history-badge");
  if (historyBadgeEl && history.length > 0) {
    historyBadgeEl.textContent = `Access history archive (${history.length} briefs cached)`;
  }

  // Double check chrome extension interface if available
  const hasChromeExtensionSupport = typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.sendMessage;

  // ==================== STATE TRANSITIONS ====================

  // Start Tracker Session
  startTrackingBtn.addEventListener("click", () => {
    currentTopicKey = topicSelector.value;
    const selectedOptionText = topicSelector.options[topicSelector.selectedIndex].text;
    
    // Clear previous sessions
    trackedUrlsStore = [];
    trackingSessionActive = true;
    renderSimulatedList();

    // 1. COMMUNICATE WITH CHROME EXTENSION BACKGROUND if running locally inside extension unpacked
    if (hasChromeExtensionSupport) {
      chrome.runtime.sendMessage({ action: "startTracking" }, (response) => {
        console.log("Background Extension notified:", response);
      });
    }

    // Save tracking state locally
    localStorage.setItem("research_is_tracking", "true");
    localStorage.setItem("research_track_theme", currentTopicKey);

    // 2. STYLING SHIFT: Hide landing, reveal active recorder panel
    landingContainer.classList.add("opacity-0");
    setTimeout(() => {
      landingContainer.classList.add("hidden");
      recordingContainer.classList.remove("hidden");
      recordingContainer.classList.add("animate-fade-in");
    }, 400);

    // Update headers text
    if (activeTrackNameLabel) {
      activeTrackNameLabel.textContent = selectedOptionText.split(":")[0];
    }

    // Generate initial live capture automatically to show instant reactivity
    injectSimulatedVisit();

    // Start a periodic background simulation loop (every 14-18 seconds, simulating natural surf behavior)
    startLiveSurferSimulator();
    showNotification("Silent auto-tracking engine armed. Browsing targets will be compiled.", "success");
  });

  // Action Button: Simulate visited tab manually
  simulateTabBtn.addEventListener("click", () => {
    injectSimulatedVisit();
    showNotification("Automatically captured visited address metadata in the background.", "success");
  });

  // Action Button: Stop background process and hit compiler API
  stopTrackingBtn.addEventListener("click", async () => {
    if (trackedUrlsStore.length === 0) {
      showNotification("Please capture or simulate at least one visited location first.", "error");
      return;
    }

    // Clear trackers
    trackingSessionActive = false;
    localStorage.removeItem("research_is_tracking");
    if (autoSimulateTimer) clearInterval(autoSimulateTimer);

    // 1. FINISH EXTENSION OBSERVER if active
    if (hasChromeExtensionSupport) {
      chrome.runtime.sendMessage({ action: "stopTracking" }, (response) => {
        console.log("Stopped background observer. Captured URLs:", response?.urls);
      });
    }

    // 2. TRANSITION-OUT: Show Loader panel (Staging overlays)
    recordingContainer.classList.add("hidden");
    processingContainer.classList.remove("hidden");
    processingContainer.classList.add("flex");

    const loaderStages = [
      "Retrieving URL targets from background storage cache...",
      "Analyzing content segments and security certificates...",
      "Forwarding structured research packets to backend server proxy...",
      "Initializing secure Gemini 3.5 Flash synthesis engine...",
      "Assembling business executive summaries and major pillars...",
      "Analyzing semantic dependencies to design concept mindmap...",
      "Generating numerical dashboard statistical cards...",
      "Bundling finalized deliverables..."
    ];

    let stageIndex = 0;
    if (compilerStatusText) compilerStatusText.textContent = loaderStages[0];

    const pipelineTimer = setInterval(() => {
      if (stageIndex < loaderStages.length - 1) {
        stageIndex++;
        if (compilerStatusText) compilerStatusText.textContent = loaderStages[stageIndex];
      }
    }, 2200);

    // 3. EXECUTE REVENUE SECURED GEMINI API CALL (via our local server.ts proxy endpoint!)
    try {
      const urlsArray = trackedUrlsStore.map(item => item.url);
      
      console.log("Triggering server side proxy compile endpoint with URLs:", urlsArray);
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ urls: urlsArray })
      });

      clearInterval(pipelineTimer);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP Compiler Service Failure (${response.status})`);
      }

      const parsedJSON = await response.json();

      // Formulate complete session Brief cache object
      const briefId = "brief_" + Date.now();
      const briefData = {
        id: briefId,
        timestamp: new Date().toISOString(),
        sources: urlsArray,
        title: parsedJSON.generalTitle || "Research Brief Outcome",
        summaryHtml: parsedJSON.summaryHtml,
        mindmapHtml: parsedJSON.mindmapHtml,
        infographicHtml: parsedJSON.infographicHtml
      };

      // Set as active display result
      localStorage.setItem("current_research_result", JSON.stringify(briefData));

      // Append to the local History database list
      const currentHistory = getResearchHistory();
      currentHistory.unshift(briefData);
      localStorage.setItem("research_history", JSON.stringify(currentHistory));

      // Close loader
      processingContainer.classList.add("hidden");
      processingContainer.classList.remove("flex");

      // Render outputs dynamically within the local page results pane
      renderLiveResults(briefData);

      // Transition-in result panel
      resultContainer.classList.remove("hidden");
      resultContainer.classList.add("animate-fade-in");
      
      showNotification("Research brief synthesized successfully!", "success");

    } catch (err) {
      clearInterval(pipelineTimer);
      processingContainer.classList.add("hidden");
      processingContainer.classList.remove("flex");
      recordingContainer.classList.remove("hidden");
      showNotification(err.message || "Failed to compile research brief. Please verify connection credentials.", "error");
    }
  });

  // Action Button: Reset from results page back to fresh landing page
  resetToLandingBtn.addEventListener("click", () => {
    // Scroll smoothly to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Reset UI visibilities
    resultContainer.classList.add("hidden");
    landingContainer.classList.remove("hidden");
    landingContainer.classList.remove("opacity-0");
    landingContainer.classList.add("animate-fade-in");

    // Clear tracked nodes
    trackedUrlsStore = [];
    renderSimulatedList();

    // Hot-update history brief count
    const updatedHistory = getResearchHistory();
    if (historyBadgeEl && updatedHistory.length > 0) {
      historyBadgeEl.textContent = `Access history archive (${updatedHistory.length} briefs cached)`;
    }
  });

  // ==================== HELPER OBSERVERS ====================

  function injectSimulatedVisit() {
    const stream = SIMULATED_STREAMS[currentTopicKey] || SIMULATED_STREAMS["quantum"];
    
    // Pick first item not already in tracking queue
    let targetObj = null;
    for (let item of stream) {
      if (!trackedUrlsStore.some(exists => exists.url === item.url)) {
        targetObj = item;
        break;
      }
    }

    // fallback in case they simulate too many: restart cycle
    if (!targetObj) {
      const idx = trackedUrlsStore.length % stream.length;
      const baseItem = stream[idx];
      targetObj = {
        title: baseItem.title,
        url: baseItem.url.replace(".html", "") + "-" + (Math.floor(Math.random() * 900) + 100)
      };
    }

    trackedUrlsStore.push({
      title: targetObj.title,
      url: targetObj.url,
      timestamp: new Date().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    });

    renderSimulatedList();
  }

  function renderSimulatedList() {
    if (!simulatedVisitsList) return;

    if (trackedUrlsStore.length === 0) {
      simulatedVisitsList.innerHTML = `
        <div class="p-8 text-center text-slate-500 text-xs font-mono italic" id="empty-visits-note">
          Waiting for browser tab visits...
        </div>
      `;
      if (collectedCounterBadge) collectedCounterBadge.textContent = "0 Targets Capturing";
      return;
    }

    if (emptyVisitsNote) emptyVisitsNote.classList.add("hidden");
    if (collectedCounterBadge) {
      collectedCounterBadge.textContent = `${trackedUrlsStore.length} Source(s) Auto-Captured`;
    }

    // Render list items
    simulatedVisitsList.innerHTML = trackedUrlsStore.map((item, index) => {
      const domain = new URL(item.url).hostname;
      return `
        <div class="flex items-center justify-between p-3.5 bg-slate-900 border border-white/5 rounded-xl hover:border-[#0066FF]/20 hover:bg-[#0F1322]/40 transition-all text-left animate-fade-in-up">
          <div class="flex gap-3 items-center min-w-0 flex-1 pr-3">
            <span class="w-1.5 h-1.5 rounded-full bg-[#0066FF]"></span>
            <div class="space-y-0.5 truncate">
              <h4 class="text-xs text-white font-semibold truncate leading-tight">${item.title}</h4>
              <p class="text-[10px] text-slate-500 font-mono truncate leading-normal">${item.url}</p>
            </div>
          </div>
          <div class="flex items-center gap-2.5 flex-shrink-0 font-mono text-[9px] text-slate-600 bg-slate-950 px-2 py-1 rounded border border-white/[0.02]">
            <span>${domain}</span>
            <span>${item.timestamp}</span>
          </div>
        </div>
      `;
    }).join("");

    // Automatically scroll to the bottom of the list when a new page matches
    simulatedVisitsList.scrollTop = simulatedVisitsList.scrollHeight;
  }

  function startLiveSurferSimulator() {
    autoSimulateTimer = setInterval(() => {
      if (trackingSessionActive && trackedUrlsStore.length < 5) {
        injectSimulatedVisit();
        showNotification("Captured external browsing tab load silently.", "info");
      }
    }, 15000);
  }

  // ==================== RENDERING LIVE INSIGHTS MODULES ====================

  function renderLiveResults(brief) {
    if (liveResultTitle) liveResultTitle.textContent = brief.title;
    if (liveResultTimestamp) {
      const formattedDate = new Date(brief.timestamp).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short"
      });
      liveResultTimestamp.textContent = `Generated on ${formattedDate}`;
    }

    // Load URLs pills
    if (liveResultUrls) {
      liveResultUrls.innerHTML = brief.sources.map(url => {
        try {
          const host = new URL(url).hostname;
          return `<span class="inline-flex items-center text-[10px] font-mono bg-slate-900 border border-white/5 text-slate-400 px-2.5 py-1 rounded-md" title="${url}">${host}</span>`;
        } catch {
          return `<span class="inline-flex items-center text-[10px] font-mono bg-slate-900 border border-white/5 text-slate-400 px-2.5 py-1 rounded-md" title="${url}">${url}</span>`;
        }
      }).join("");
    }

    // Load visual HTML payloads
    if (liveSummaryContent) liveSummaryContent.innerHTML = brief.summaryHtml;
    if (liveMindmapContent) liveMindmapContent.innerHTML = brief.mindmapHtml;
    if (liveInfographicContent) liveInfographicContent.innerHTML = brief.infographicHtml;

    // Toggle live tab actions
    function switchLiveTab(tab) {
      [liveTabSummaryBtn, liveTabMindmapBtn, liveTabInfographicBtn].forEach(btn => {
        if (btn) btn.classList.remove("active");
      });

      [liveSummaryContent, liveMindmapContent, liveInfographicContent].forEach(box => {
        if (box) {
          box.classList.add("hidden");
          box.classList.remove("animate-fade-in");
        }
      });

      if (tab === "summary") {
        if (liveTabSummaryBtn) liveTabSummaryBtn.classList.add("active");
        if (liveSummaryContent) {
          liveSummaryContent.classList.remove("hidden");
          liveSummaryContent.classList.add("animate-fade-in");
        }
      } else if (tab === "mindmap") {
        if (liveTabMindmapBtn) liveTabMindmapBtn.classList.add("active");
        if (liveMindmapContent) {
          liveMindmapContent.classList.remove("hidden");
          liveMindmapContent.classList.add("animate-fade-in");
        }
      } else if (tab === "infographic") {
        if (liveTabInfographicBtn) liveTabInfographicBtn.classList.add("active");
        if (liveInfographicContent) {
          liveInfographicContent.classList.remove("hidden");
          liveInfographicContent.classList.add("animate-fade-in");
        }
      }
    }

    // Event hooks
    if (liveTabSummaryBtn) liveTabSummaryBtn.onclick = () => switchLiveTab("summary");
    if (liveTabMindmapBtn) liveTabMindmapBtn.onclick = () => switchLiveTab("mindmap");
    if (liveTabInfographicBtn) liveTabInfographicBtn.onclick = () => switchLiveTab("infographic");

    // Init display
    switchLiveTab("summary");
  }
}

/**
 * Standard Standalone Results page logic (results.html)
 */
function initResultsPage() {
  console.log("ResearchBrief AI: Standalone Results Pane loaded.");

  const resultTitleEl = document.getElementById("result-title");
  const resultTimestampEl = document.getElementById("result-timestamp");
  const resultUrlsEl = document.getElementById("result-urls");

  const tabSummaryBtn = document.getElementById("tab-summary-btn");
  const tabMindmapBtn = document.getElementById("tab-mindmap-btn");
  const tabInfographicBtn = document.getElementById("tab-infographic-btn");

  const summaryContent = document.getElementById("summary-content");
  const mindmapContent = document.getElementById("mindmap-content");
  const infographicContent = document.getElementById("infographic-content");

  const briefStr = localStorage.getItem("current_research_result");
  if (!briefStr) {
    showNotification("No analytical results currently found in display cache.", "info");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1200);
    return;
  }

  const brief = JSON.parse(briefStr);

  // Load basic attributes
  if (resultTitleEl) resultTitleEl.textContent = brief.title;
  if (resultTimestampEl) {
    const formattedDate = new Date(brief.timestamp).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short"
    });
    resultTimestampEl.textContent = `Generated on ${formattedDate}`;
  }

  // Generate URL elements
  if (resultUrlsEl && brief.sources) {
    resultUrlsEl.innerHTML = brief.sources.map(link => {
      try {
        const domain = new URL(link).hostname;
        return `<span class="inline-flex items-center text-[10px] font-mono bg-slate-900 border border-white/5 text-slate-400 px-2.5 py-1 rounded-md" title="${link}">${domain}</span>`;
      } catch {
        return `<span class="inline-flex items-center text-[10px] font-mono bg-slate-900 border border-white/5 text-slate-400 px-2.5 py-1 rounded-md" title="${link}">${link}</span>`;
      }
    }).join("");
  }

  // Populate actual HTML structures (already sanitized & styled with Tailwind server-side)
  if (summaryContent) summaryContent.innerHTML = brief.summaryHtml;
  if (mindmapContent) mindmapContent.innerHTML = brief.mindmapHtml;
  if (infographicContent) infographicContent.innerHTML = brief.infographicHtml;

  function switchTab(tab) {
    [tabSummaryBtn, tabMindmapBtn, tabInfographicBtn].forEach(btn => {
      if (btn) btn.classList.remove("active");
    });

    [summaryContent, mindmapContent, infographicContent].forEach(view => {
      if (view) {
        view.classList.add("hidden");
        view.classList.remove("animate-fade-in");
      }
    });

    if (tab === "summary") {
      if (tabSummaryBtn) tabSummaryBtn.classList.add("active");
      if (summaryContent) {
        summaryContent.classList.remove("hidden");
        summaryContent.classList.add("animate-fade-in");
      }
    } else if (tab === "mindmap") {
      if (tabMindmapBtn) tabMindmapBtn.classList.add("active");
      if (mindmapContent) {
        mindmapContent.classList.remove("hidden");
        mindmapContent.classList.add("animate-fade-in");
      }
    } else if (tab === "infographic") {
      if (tabInfographicBtn) tabInfographicBtn.classList.add("active");
      if (infographicContent) {
        infographicContent.classList.remove("hidden");
        infographicContent.classList.add("animate-fade-in");
      }
    }
  }

  if (tabSummaryBtn) tabSummaryBtn.onclick = () => switchTab("summary");
  if (tabMindmapBtn) tabMindmapBtn.onclick = () => switchTab("mindmap");
  if (tabInfographicBtn) tabInfographicBtn.onclick = () => switchTab("infographic");

  // Default
  switchTab("summary");
}

/**
 * Standalone Archive List Page (history.html)
 */
function initHistoryPage() {
  console.log("ResearchBrief AI: Standalone History Vault loaded.");

  const historyListContainer = document.getElementById("history-list");
  const wipeHistoryBtn = document.getElementById("wipe-history-btn");

  function renderHistory() {
    const list = getResearchHistory();
    historyListContainer.innerHTML = "";

    if (list.length === 0) {
      historyListContainer.innerHTML = `
        <div class="col-span-full py-16 text-center border border-dashed border-white/5 rounded-2xl bg-slate-900/10">
          <svg class="w-10 h-10 text-slate-650 mx-auto mb-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"></path>
          </svg>
          <h3 class="text-sm font-semibold text-slate-300 font-sans">No histories briefs found in storage</h3>
          <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Click "Start Auto-Tracking Session" on the Home page to compile and archive briefings.</p>
          <a href="index.html" class="inline-flex items-center text-xs text-[#0066FF] hover:text-blue-400 mt-5 font-semibold group transition-all">
            Go to Home Workspace
            <svg class="w-3.5 h-3.5 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"></path>
            </svg>
          </a>
        </div>
      `;
      if (wipeHistoryBtn) wipeHistoryBtn.classList.add("hidden");
      return;
    }

    if (wipeHistoryBtn) wipeHistoryBtn.classList.remove("hidden");

    list.forEach(brief => {
      const card = document.createElement("div");
      card.className = "premium-card p-6 rounded-2xl flex flex-col justify-between hover:border-[#0066FF]/30 transition-all bg-[#0F1322]/40";

      const formattedStr = new Date(brief.timestamp).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short"
      });

      card.innerHTML = `
        <div class="space-y-4">
          <div class="flex items-center justify-between gap-1 border-b border-white/[0.04] pb-3">
            <span class="inline-flex items-center text-[10px] font-mono text-[#0066FF] bg-blue-950/40 px-2 py-0.5 rounded border border-blue-900/30">History Session</span>
            <span class="text-[10px] text-slate-500 font-mono">${formattedStr}</span>
          </div>
          <h3 class="text-base font-bold text-slate-100 truncate">${brief.title}</h3>
          
          <div class="space-y-1.5">
            <h4 class="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">Tracked URLs</h4>
            <div class="flex flex-wrap gap-1.5 max-h-[58px] overflow-hidden">
              ${brief.sources.map(s => {
                try {
                  const domainHost = new URL(s).hostname;
                  return `<span class="text-[9px] text-[#0066FF] font-mono bg-blue-950/20 border border-blue-900/25 px-1.5 py-0.5 rounded truncate max-w-[120px]">${domainHost}</span>`;
                } catch {
                  return `<span class="text-[9px] text-slate-400 font-mono bg-slate-900 px-1.5 py-0.5 rounded truncate max-w-[120px]">research-source</span>`;
                }
              }).join("")}
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 mt-6 pt-4 border-t border-white/[0.03]">
          <button class="view-brief-btn glow-btn flex-1 text-center text-xs font-bold uppercase tracking-wider text-white py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer">
            View Analytics
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"></path>
            </svg>
          </button>
          <button class="delete-brief-btn text-xs text-rose-450 border border-transparent hover:border-rose-500/10 hover:bg-rose-500/5 p-2 rounded-lg transition-all cursor-pointer" title="Delete Archive">
            <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
      `;

      // Event handlers
      card.querySelector(".view-brief-btn").onclick = () => {
        localStorage.setItem("current_research_result", JSON.stringify(brief));
        window.location.href = "results.html";
      };

      card.querySelector(".delete-brief-btn").onclick = () => {
        deleteBriefFromHistory(brief.id);
        renderHistory();
      };

      historyListContainer.appendChild(card);
    });
  }

  if (wipeHistoryBtn) {
    wipeHistoryBtn.onclick = () => {
      if (confirm("Are you sure you want to permanently empty your cached analytical archive?")) {
        localStorage.removeItem("research_history");
        localStorage.removeItem("current_research_result");
        renderHistory();
        showNotification("All database caches successfully cleared.", "info");
      }
    };
  }

  renderHistory();
}

/**
 * Shared Local History Helpers
 */
function getResearchHistory() {
  const hStr = localStorage.getItem("research_history");
  return hStr ? JSON.parse(hStr) : [];
}

function deleteBriefFromHistory(briefId) {
  let hist = getResearchHistory();
  hist = hist.filter(item => item.id !== briefId);
  localStorage.setItem("research_history", JSON.stringify(hist));

  // If was current display brief
  const curr = localStorage.getItem("current_research_result");
  if (curr) {
    const parsed = JSON.parse(curr);
    if (parsed.id === briefId) {
      localStorage.removeItem("current_research_result");
    }
  }
  showNotification("Deleted historical briefing.", "info");
}

/**
 * Toast Notifications
 */
function showNotification(message, type = "info") {
  let pool = document.getElementById("notification-pool");
  if (!pool) {
    pool = document.createElement("div");
    pool.id = "notification-pool";
    pool.className = "fixed bottom-5 right-5 space-y-2 z-50 pointer-events-none max-w-sm w-full px-4";
    document.body.appendChild(pool);
  }

  const toast = document.createElement("div");
  toast.className = "p-4 rounded-xl shadow-2xl flex items-center gap-3 border pointer-events-auto transition-all duration-300 transform translate-y-2 opacity-0 animate-fade-in-up";

  let bgClass = "bg-slate-900 text-gray-200 border-white/5";
  let iconMarkup = "";

  if (type === "success") {
    bgClass = "bg-[#091C1E] text-emerald-300 border-emerald-900/30";
    iconMarkup = `<svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
  } else if (type === "error") {
    bgClass = "bg-[#1E090F] text-rose-300 border-rose-900/30";
    iconMarkup = `<svg class="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`;
  } else {
    bgClass = "bg-[#091522] text-blue-300 border-blue-900/30";
    iconMarkup = `<svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
  }

  toast.className = toast.className + " " + bgClass;
  toast.innerHTML = `
    ${iconMarkup}
    <p class="text-xs font-semibold font-sans leading-relaxed flex-1">${message}</p>
    <button class="text-slate-400 hover:text-slate-200 cursor-pointer" onclick="this.parentElement.remove()">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
    </button>
  `;

  pool.appendChild(toast);

  // Animate Entrance
  setTimeout(() => {
    toast.classList.remove("opacity-0", "translate-y-2");
  }, 10);

  // Auto clean up after 5.5s
  setTimeout(() => {
    if (toast.parentElement) {
      toast.classList.add("opacity-0", "translate-y-1");
      setTimeout(() => {
        toast.remove();
      }, 300);
    }
  }, 5500);
}
