import React from 'react';

const Heatmap = ({ grid }) => {
  // If no data yet, show empty grid
  const safeGrid = grid || Array(8).fill(Array(8).fill(0));

  const getColor = (val) => {
    if (val === 3) return "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"; // Critical
    if (val === 2) return "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]"; // Warning
    if (val === 1) return "bg-blue-500/50"; // Low Activity
    return "bg-slate-800/50"; // Empty
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="grid grid-cols-8 gap-1 p-2 bg-slate-900/50 rounded-lg border border-slate-700/50">
        {safeGrid.map((row, rIndex) => (
          row.map((cellValue, cIndex) => (
            <div
              key={`${rIndex}-${cIndex}`}
              className={`w-4 h-4 rounded-sm transition-all duration-300 ${getColor(cellValue)}`}
            />
          ))
        ))}
      </div>
      <div className="mt-2 flex gap-4 text-[10px] text-slate-500 font-mono uppercase tracking-wider">
        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-full"></div>Critical</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-yellow-500 rounded-full"></div>High</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500 rounded-full"></div>Active</div>
      </div>
    </div>
  );
};

export default Heatmap;