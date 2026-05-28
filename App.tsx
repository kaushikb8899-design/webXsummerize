@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
}

/* Base custom styles for premium ResearchBrief AI look */
:root {
  --color-bg: #05070F;
  --color-card: #0F1322;
  --color-card-border: rgba(30, 41, 59, 1);
  --color-accent: #0066FF;
  --color-accent-glow: rgba(0, 102, 255, 0.25);
  --color-accent-glow-strong: rgba(0, 102, 255, 0.45);
}

body {
  background-color: var(--color-bg);
  color: #F8FAFC;
  font-family: var(--font-sans);
  overflow-x: hidden;
  min-height: 100vh;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes pulseGlow {
  0%, 100% {
    box-shadow: 0 0 15px var(--color-accent-glow);
  }
  50% {
    box-shadow: 0 0 30px var(--color-accent-glow-strong);
  }
}

@keyframes laserShine {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

/* Stagger delays */
.delay-100 { animation-delay: 100ms; }
.delay-200 { animation-delay: 200ms; }
.delay-300 { animation-delay: 300ms; }
.delay-400 { animation-delay: 400ms; }

/* Custom Premium UI Components */
.glass-nav {
  background: rgba(5, 7, 15, 0.75);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.premium-card {
  background-color: var(--color-card);
  border: 1px solid rgba(255, 255, 255, 0.04);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
}

.premium-card:hover {
  border-color: rgba(0, 102, 255, 0.4);
  box-shadow: 0 10px 40px rgba(0, 102, 255, 0.08);
  transform: translateY(-2px);
}

.glow-btn {
  background: linear-gradient(135deg, #0066FF, #0052CC);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 0 15px rgba(0, 102, 255, 0.3);
  position: relative;
  overflow: hidden;
}

.glow-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 0 25px rgba(0, 102, 255, 0.6);
  filter: brightness(1.1);
}

.glow-btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transform: translateX(-100%);
  transition: none;
}

.glow-btn:hover::after {
  transform: translateX(100%);
  transition: transform 0.8s ease-in-out;
}

/* Style customizations for Bold Typography theme */
.tabs-wrapper {
  display: flex;
  gap: 0.375rem;
  padding: 0.375rem;
  background-color: #0F1322;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  width: max-content;
  max-width: 100%;
}

.tab-trigger {
  padding: 0.625rem 1.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  border-radius: 8.5px;
  color: #94A3B8;
  background: transparent;
  border: none;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
}

.tab-trigger:hover {
  color: #FFF;
}

.tab-trigger.active {
  background-color: #0066FF;
  color: #FFFFFF !important;
  box-shadow: 0 0 15px rgba(0, 102, 255, 0.35);
}

/* Custom premium hover and gradient card wrappers matching design mockups */
.glowing-card-wrapper {
  position: relative;
  transition: all 0.3s ease;
}

.glowing-card-wrapper::before {
  content: '';
  position: absolute;
  inset: -1px;
  background: linear-gradient(90deg, #0066FF, #06B6D4);
  border-radius: 16px;
  z-index: 0;
  opacity: 0.15;
  filter: blur(8px);
  transition: opacity 0.3s ease;
}

.glowing-card-wrapper:hover::before {
  opacity: 0.35;
}

/* Mindmap styling (Logical Concept Tree representation) */
.mindmap-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 1.5rem;
  width: 100%;
  background: radial-gradient(circle at center, rgba(15, 23, 42, 0.4) 0%, transparent 100%);
}

.mindmap-root {
  background: linear-gradient(135deg, #0066FF, #0022AA);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 700;
  text-align: center;
  box-shadow: 0 0 25px rgba(0, 102, 255, 0.4);
  position: relative;
  z-index: 10;
}

.mindmap-root::after {
  content: '';
  position: absolute;
  bottom: -2rem;
  left: 50%;
  width: 2px;
  height: 2rem;
  background: linear-gradient(to bottom, #0066FF, rgba(0, 102, 255, 0.2));
  transform: translateX(-50%);
}

.mindmap-children {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2.5rem;
  width: 100%;
  position: relative;
}

/* Draw logic horizontal line for connecting children */
.mindmap-children::before {
  content: '';
  position: absolute;
  top: -2rem;
  left: 10%;
  right: 10%;
  height: 2px;
  background: rgba(0, 102, 255, 0.2);
  display: none; /* Let CSS layout flow dynamically */
}

.mindmap-node {
  background: var(--color-card);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-left: 4px solid #0066FF;
  border-radius: 8px;
  padding: 1.25rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  position: relative;
  transition: all 0.3s ease;
}

.mindmap-node:hover {
  transform: translateY(-2px);
  border-color: rgba(0, 102, 255, 0.3);
  box-shadow: 0 8px 30px rgba(0, 102, 255, 0.1);
}

.mindmap-node-title {
  font-size: 1rem;
  font-weight: 600;
  color: #F8FAFC;
  margin-bottom: 0.5rem;
}

.mindmap-node-desc {
  font-size: 0.875rem;
  color: #94A3B8;
  line-height: 1.5;
}

/* Concept map dynamic lines */
.mindmap-node::before {
  content: '';
  position: absolute;
  top: -1.25rem;
  left: 50%;
  width: 2px;
  height: 1.25rem;
  background: rgba(0, 102, 255, 0.2);
  transform: translateX(-50%);
}

.mindmap-sub-nodes {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-left: 1rem;
  border-left: 1.5px dashed rgba(0, 102, 255, 0.25);
}

.mindmap-sub-node {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: 6px;
  padding: 0.75rem 1rem;
  font-size: 0.825rem;
  color: #CBD5E1;
  transition: all 0.2s ease;
}

.mindmap-sub-node:hover {
  background: rgba(0, 102, 255, 0.05);
  border-color: rgba(0, 102, 255, 0.2);
  color: #FFF;
}

/* Executive summary style custom scrollbars and structure */
.exec-pillar {
  border-left: 2px solid #0066FF;
  padding-left: 1.25rem;
}

/* Custom scrollbars */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #05070F;
}

::-webkit-scrollbar-thumb {
  background: #1E293B;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #0066FF;
}

/* Neon dot indicator */
.neon-dot {
  width: 8px;
  height: 8px;
  background-color: #00FF66;
  border-radius: 50%;
  box-shadow: 0 0 8px #00FF66;
}

.neon-dot-blue {
  width: 8px;
  height: 8px;
  background-color: #0066FF;
  border-radius: 50%;
  box-shadow: 0 0 8px #0066FF;
}

/* Responsive grid layouts */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;
}

/* Premium gradient ambient orb */
.ambient-orb {
  position: absolute;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(0, 102, 255, 0.12) 0%, transparent 70%);
  border-radius: 50%;
  filter: blur(40px);
  pointer-events: none;
  z-index: 0;
}
