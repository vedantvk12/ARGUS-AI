import React from 'react';

const RiskGauge = ({ score, predicted_score }) => {
  // --- CONFIGURATION ---
  const radius = 120; 
  const stroke = 15;  
  const normalizedScore = Math.min(Math.max(score, 0), 100);
  const normalizedPred = Math.min(Math.max(predicted_score || score, 0), 100);
  
  const circumference = radius * Math.PI;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;
  
  const getColor = (value) => {
    if (value > 75) return '#ef4444'; // Red
    if (value > 40) return '#eab308'; // Yellow
    return '#10b981'; // Green
  };
  
  const currentColor = getColor(normalizedScore);

  return (
    <div className="relative flex flex-col items-center justify-center py-6">
      <svg height={radius + stroke + 10} width={(radius + stroke) * 2} className="overflow-visible">
        {/* Background Track */}
        <path d={`M ${stroke} ${radius} A ${radius} ${radius} 0 0 1 ${radius * 2 + stroke} ${radius}`} fill="none" stroke="#1e293b" strokeWidth={stroke} strokeLinecap="round" />

        {/* Active Risk Arc */}
        <path d={`M ${stroke} ${radius} A ${radius} ${radius} 0 0 1 ${radius * 2 + stroke} ${radius}`} fill="none" stroke={currentColor} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className="transition-all duration-1000 ease-out" style={{ filter: `drop-shadow(0 0 8px ${currentColor}80)` }} />

        {/* --- PREDICTION GHOST NEEDLE --- */}
        {/* Only show if prediction is different significantly */}
        {Math.abs(normalizedPred - normalizedScore) > 3 && (
             <g className="transition-all duration-500 ease-out" style={{ transformOrigin: 'bottom center', transform: `rotate(${(normalizedPred / 100) * 180 - 90}deg) translate(0, -${radius - 25}px)` }}>
                {/* Dotted Line Indicator */}
                <line x1="0" y1="0" x2="0" y2="-40" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 2" />
                <circle r="4" fill="#94a3b8" />
                <text x="10" y="-35" fill="#94a3b8" fontSize="10" fontFamily="monospace" style={{transform: 'rotate(90deg)'}}>PREDICTED</text>
             </g>
        )}

        {/* Main Needle */}
        <g className="transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]" style={{ transformBox: 'fill-box', transformOrigin: 'center bottom', transform: `translateX(${radius + stroke}px) translateY(${radius}px) rotate(${(normalizedScore / 100) * 180 - 90}deg)` }}>
          <path d="M -4 0 L 0 -100 L 4 0 Z" fill="#e2e8f0" />
          <circle r="6" fill="#e2e8f0" />
        </g>
      </svg>

      {/* Digital Readout */}
      <div className="absolute bottom-6 flex flex-col items-center">
        <span className="text-slate-400 text-xs font-mono tracking-widest uppercase mb-1">Current Risk</span>
        <div className="flex items-baseline gap-1">
            <span className="text-5xl font-black transition-colors duration-300" style={{ color: currentColor, textShadow: `0 0 20px ${currentColor}40` }}>
            {Math.round(normalizedScore)}
            </span>
            <span className="text-slate-500 font-bold">/100</span>
        </div>
        
        {/* Prediction Text */}
        {normalizedPred > normalizedScore + 5 && (
            <div className="mt-2 text-xs font-mono text-blue-400 animate-pulse flex items-center gap-1">
                <span>↗ PREDICTED RISE: {Math.round(normalizedPred)}</span>
            </div>
        )}
      </div>
    </div>
  );
};

export default RiskGauge;