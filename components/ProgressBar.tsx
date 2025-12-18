
import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = Math.round((current / total) * 100);
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-1">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Seu Progresso</span>
        <span className="text-sm font-bold text-slate-800">{percentage}%</span>
      </div>
      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-slate-800 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
