import React from 'react';

interface YellowBlinkMockMarkProps {
  label?: string;
  tooltip?: string;
  variant?: 'badge' | 'inline' | 'card-header' | 'mini';
  className?: string;
}

export const YellowBlinkMockMark: React.FC<YellowBlinkMockMarkProps> = ({
  label = 'MOCK / SIMULATED DATA',
  tooltip = 'This value/telemetry is simulated mock data and has not been verified from a real-time production endpoint.',
  variant = 'badge',
  className = '',
}) => {
  if (variant === 'mini') {
    return (
      <span
        title={tooltip}
        className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-yellow-400 text-slate-950 border border-yellow-300 shadow-[0_0_8px_rgba(250,204,21,0.7)] animate-pulse select-none cursor-help ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-slate-950 shrink-0"></span>
        <span>{label}</span>
      </span>
    );
  }

  if (variant === 'inline') {
    return (
      <span
        title={tooltip}
        className={`inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.4)] animate-pulse select-none cursor-help ${className}`}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-90"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
        </span>
        <span>{label}</span>
      </span>
    );
  }

  if (variant === 'card-header') {
    return (
      <div
        title={tooltip}
        className={`p-2 rounded-lg bg-yellow-500/15 border border-yellow-400/80 flex items-center justify-between text-xs font-mono font-semibold text-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.25)] animate-pulse select-none cursor-help ${className}`}
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-90"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-400"></span>
          </span>
          <span className="font-bold tracking-wider uppercase text-yellow-300">
            ⚠️ {label}
          </span>
        </div>
        <span className="text-[10px] text-yellow-200/90 font-normal hidden sm:inline">
          {tooltip}
        </span>
      </div>
    );
  }

  // Default 'badge'
  return (
    <span
      title={tooltip}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-yellow-400 text-slate-950 border-2 border-yellow-300 shadow-[0_0_12px_rgba(250,204,21,0.8)] animate-pulse select-none cursor-help ${className}`}
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-950"></span>
      </span>
      <span className="tracking-wider uppercase">{label}</span>
    </span>
  );
};
