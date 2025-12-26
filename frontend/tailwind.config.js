/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // The Backgrounds: Matte Black to Deep Slate
        'ops-bg': '#020617',     // Darkest (Main Background)
        'ops-panel': '#0f172a',  // Panel Background (Slate 900)
        'ops-border': '#1e293b', // Subtle Borders (Slate 800)
        
        // The Signals: Neon Logic
        'signal-safe': '#10b981',    // Emerald 500 (Safe)
        'signal-warn': '#f59e0b',    // Amber 500 (Warning)
        'signal-danger': '#ef4444',  // Red 500 (Critical)
        'signal-neutral': '#64748b', // Slate 500 (Inactive)
      },
      fontFamily: {
        // Tech/Monospace feel for numbers
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
      }
    },
  },
  plugins: [],
}