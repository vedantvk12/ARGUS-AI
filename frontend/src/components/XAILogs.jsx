import React, { useEffect, useRef } from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

const XAILogs = ({ logs }) => {
  const endOfLogsRef = useRef(null);

  // Auto-scroll to bottom whenever logs update
  useEffect(() => {
    endOfLogsRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="h-full flex flex-col font-mono text-xs">
      <div className="flex justify-between items-center mb-2 px-1">
        <span className="text-slate-400 font-bold">EVENT STREAM</span>
        <span className="text-[10px] text-slate-600">LIVE</span>
      </div>
      
      {/* Scrollable Area */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-2 max-h-[200px] scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {logs.length === 0 && (
          <div className="text-slate-600 text-center italic mt-10">
            Waiting for intelligence stream...
          </div>
        )}

        {logs.map((log, index) => {
          // Dynamic Colors
          let borderClass = "border-l-2 border-slate-600";
          let bgClass = "bg-slate-800/50";
          let icon = <Info size={12} className="text-slate-400" />;

          if (log.risk_score > 60) {
            borderClass = "border-l-2 border-red-500";
            bgClass = "bg-red-900/10";
            icon = <AlertTriangle size={12} className="text-red-500" />;
          } else if (log.risk_score > 30) {
            borderClass = "border-l-2 border-yellow-500";
            bgClass = "bg-yellow-900/10";
            icon = <AlertTriangle size={12} className="text-yellow-500" />;
          } else if (log.escalation === "De-escalating") {
            borderClass = "border-l-2 border-green-500";
            icon = <CheckCircle size={12} className="text-green-500" />;
          }

          return (
            <div key={index} className={`p-2 rounded ${bgClass} ${borderClass} mb-1 animate-in slide-in-from-left-2 duration-300`}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-500">{log.time}</span>
                <span className={`font-bold ${log.risk_score > 60 ? 'text-red-400' : 'text-slate-300'}`}>
                  RISK: {log.risk_score}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                 <div className="flex gap-1 flex-wrap">
                    {log.reasons.length > 0 ? (
                        log.reasons.map((r, i) => (
                            <span key={i} className="px-1.5 py-0.5 bg-black/30 rounded text-slate-300 border border-slate-700">
                                {r}
                            </span>
                        ))
                    ) : (
                        <span className="text-slate-600 italic">No anomalies</span>
                    )}
                 </div>
                 
                 {/* Escalation Tag */}
                 {log.escalation !== "Stable" && (
                    <span className={`uppercase text-[9px] font-bold tracking-wider ${
                        log.escalation.includes("CRITICAL") ? "text-red-500 animate-pulse" : 
                        log.escalation.includes("De") ? "text-green-500" : "text-yellow-500"
                    }`}>
                        {log.escalation}
                    </span>
                 )}
              </div>
            </div>
          );
        })}
        {/* Invisible element to scroll to */}
        <div ref={endOfLogsRef} />
      </div>
    </div>
  );
};

export default XAILogs;