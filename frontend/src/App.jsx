import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Users, Zap, Terminal, Grid } from 'lucide-react';
import RiskGauge from './components/RiskGauge';
import RiskChart from './components/RiskChart';
import XAILogs from './components/XAILogs';
import Heatmap from './components/Heatmap'; // <--- NEW IMPORT
import useWebSocket from './hooks/useWebSocket';

function App() {
  const { data, status } = useWebSocket('ws://localhost:8000/ws');
  
  const [history, setHistory] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (status === 'CONNECTED') {
      const now = new Date().toLocaleTimeString();

      setHistory(prev => {
        const newEntry = {
          time: now,
          risk_score: data.risk_score,
          predicted_risk: data.predicted_risk
        };
        const newHistory = [...prev, newEntry];
        if (newHistory.length > 50) newHistory.shift();
        return newHistory;
      });

      setLogs(prev => {
        const newLog = {
          time: now,
          risk_score: data.risk_score,
          reasons: data.reasons,
          escalation: data.escalation
        };
        const newLogs = [...prev, newLog];
        if (newLogs.length > 30) newLogs.shift(); 
        return newLogs;
      });
    }
  }, [data, status]);

  const isConnected = status === 'CONNECTED';

  return (
    <div className="min-h-screen bg-ops-bg text-slate-200 p-6 font-sans">
      {/* TOP BAR */}
      <header className="flex justify-between items-center mb-8 border-b border-ops-border pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <Activity className="text-blue-400" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-wider text-white">ARGUS-AI</h1>
            <p className="text-xs text-slate-500 uppercase tracking-widest">Predictive Crowd Intelligence</p>
          </div>
        </div>
        <div className={`flex items-center gap-4 px-4 py-2 rounded-full border transition-all duration-500 ${isConnected ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
          <div className="flex items-center gap-2">
             <span className={`animate-ping absolute inline-flex h-3 w-3 rounded-full opacity-75 ${isConnected ? 'bg-signal-safe' : 'bg-signal-danger'}`}></span>
             <span className={`relative inline-flex rounded-full h-3 w-3 ${isConnected ? 'bg-signal-safe' : 'bg-signal-danger'}`}></span>
            <span className={`text-sm font-mono font-bold ${isConnected ? 'text-signal-safe' : 'text-signal-danger'}`}>
              {status}
            </span>
          </div>
        </div>
      </header>

      {/* MAIN GRID */}
      <main className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-140px)]">
        
        {/* LEFT COLUMN: RISK CORE + HEATMAP */}
        <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* 1. Risk Gauge Panel */}
            <div className="flex-1 bg-ops-panel rounded-2xl border border-ops-border p-6 shadow-2xl relative overflow-hidden flex flex-col justify-center">
                <h2 className="text-slate-400 font-bold mb-4 flex items-center gap-2">
                    <ShieldCheck size={18} /> LIVE THREAT INDEX
                </h2>
                <div className="flex justify-center">
                    <RiskGauge score={data.risk_score} predicted_score={data.predicted_risk} />
                </div>
            </div>

            {/* 2. Heatmap Panel (New) */}
            <div className="flex-1 bg-ops-panel rounded-2xl border border-ops-border p-6 shadow-lg flex flex-col">
                <h2 className="text-slate-400 font-bold mb-4 flex items-center gap-2">
                    <Grid size={18} /> SPATIAL DENSITY (ABSTRACT)
                </h2>
                <div className="flex-1 flex items-center justify-center">
                    <Heatmap grid={data.heatmap} />
                </div>
            </div>
        </div>

        {/* RIGHT COLUMN: ANALYTICS + LOGS */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* 3. Trends Chart */}
          <div className="flex-1 bg-ops-panel rounded-2xl border border-ops-border p-6 shadow-lg">
            <h2 className="text-slate-400 font-bold mb-4">TEMPORAL TRENDS</h2>
             <RiskChart data={history} />
          </div>
          
          {/* 4. XAI Logs */}
          <div className="flex-1 bg-ops-panel rounded-2xl border border-ops-border p-6 shadow-lg flex flex-col">
            <h2 className="text-slate-400 font-bold mb-4 flex items-center gap-2">
                <Terminal size={16} /> INTELLIGENCE LOGS (XAI)
            </h2>
             <XAILogs logs={logs} />
             
             {/* Metrics Footer */}
             <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-800">
                <div className="flex items-center gap-3">
                    <Users className="text-blue-400" size={16}/>
                    <div>
                        <p className="text-[10px] text-slate-500">COUNT</p>
                        <p className="text-xl font-mono font-bold">{data.people_count}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Zap className="text-yellow-400" size={16}/>
                    <div>
                        <p className="text-[10px] text-slate-500">VELOCITY</p>
                        <p className="text-xl font-mono font-bold">{data.avg_velocity}</p>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;