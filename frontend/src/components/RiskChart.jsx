import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const RiskChart = ({ data }) => {
  return (
    <div className="w-full h-full min-h-[200px] flex flex-col">
      {/* Chart Header */}
      <div className="flex justify-between items-center mb-2 px-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <span className="text-xs text-slate-400 font-mono">REAL-TIME</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-400/30 border border-blue-400 border-dashed"></div>
          <span className="text-xs text-slate-500 font-mono">PREDICTED</span>
        </div>
      </div>

      {/* The Chart */}
      <div className="flex-1 w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            
            <XAxis 
                dataKey="time" 
                hide={true} 
            />
            
            <YAxis 
                domain={[0, 100]} 
                orientation="right" 
                tick={{fill: '#475569', fontSize: 10, fontFamily: 'monospace'}}
                axisLine={false}
                tickLine={false}
            />
            
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
              itemStyle={{ color: '#3b82f6' }}
              labelStyle={{ display: 'none' }}
            />
            
            {/* Predicted Risk (Dashed Line) */}
            <Area 
              type="monotone" 
              dataKey="predicted_risk" 
              stroke="#60a5fa" 
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="none" 
              isAnimationActive={false}
            />

            {/* Actual Risk (Solid Line) */}
            <Area 
              type="monotone" 
              dataKey="risk_score" 
              stroke="#3b82f6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorRisk)" 
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RiskChart;