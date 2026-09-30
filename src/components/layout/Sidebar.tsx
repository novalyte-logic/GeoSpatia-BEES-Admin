import { YellowBlinkMockMark } from '../common/YellowBlinkMockMark';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Zap,
  FolderGit2,
  FileSpreadsheet,
  Building2,
  Mail,
  Cpu,
  Archive,
  Terminal,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Radio,
  ChevronRight,
  Sun,
  Moon,
  Inbox,
} from 'lucide-react';

interface SidebarProps {
  onOpenAcceptanceTest: () => void;
  onOpenHermesModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenAcceptanceTest, onOpenHermesModal }) => {
  const { activeTab, setActiveTab, opportunities, outreachDrafts, projects, evidence, resetToDefaultData, theme, toggleTheme } = useApp();
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const conflictingCount = projects.filter((p) => p.conflictingFields.length > 0).length;
  const pendingOutreach = outreachDrafts.filter((d) => d.status === 'Needs Review' || d.status === 'Draft').length;

  const totalMw = projects.reduce((acc, p) => (typeof p.capacityMw === 'number' ? acc + p.capacityMw : acc), 0);
  const pipelineValueUsd = opportunities.length * 11500;

  const navItems = [
    { id: 'today', label: 'Today', icon: LayoutDashboard },
    { id: 'requests', label: 'Requests Workspace', icon: Inbox, count: 1, highlight: true },
    { id: 'opportunities', label: 'Opportunities', icon: Zap, count: opportunities.length },
    { id: 'projects', label: 'Projects', icon: FolderGit2, count: projects.length, alert: conflictingCount > 0 },
    { id: 'evidence', label: 'Evidence Ledger', icon: FileSpreadsheet, count: evidence.length },
    { id: 'companies', label: 'Companies & Contacts', icon: Building2 },
    { id: 'outreach', label: 'Outreach Queue', icon: Mail, count: pendingOutreach, highlight: pendingOutreach > 0 },
    { id: 'sources', label: 'Sources & Runs', icon: Cpu },
    { id: 'backlog', label: 'Backlog', icon: Archive },
  ];

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed top-0 left-0 z-40 h-screen bg-slate-950 text-slate-300 border-r border-slate-800 transition-all duration-300 ease-in-out flex flex-col justify-between select-none ${
        isHovered ? 'w-64 shadow-2xl shadow-black/80' : 'w-16'
      }`}
    >
      {/* Top Header Logo & Navigation */}
      <div>
        {/* Logo Banner */}
        <div className="h-16 flex items-center px-4 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('today')}
            className="flex items-center gap-3 w-full text-left overflow-hidden focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <div
              className={`transition-opacity duration-200 whitespace-nowrap overflow-hidden ${
                isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <span className="text-sm font-bold tracking-tight text-white block">
                GEOSPATIAL LABS
              </span>
              <span className="text-[10px] text-emerald-400 font-mono block -mt-0.5">
                California BESS Control Plane
              </span>
            </div>
          </button>
        </div>

        {/* Live System Indicator */}
        <div className="px-3.5 py-2.5 border-b border-slate-800/50 bg-slate-900/40">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
            <div
              className={`transition-opacity duration-200 whitespace-nowrap text-[11px] font-mono text-slate-400 overflow-hidden ${
                isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <span>CA BESS · Cluster 14/15</span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-2 space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={!isHovered ? `${item.label} ${item.count !== undefined ? `(${item.count})` : ''}` : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all group relative ${
                  isActive
                    ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'
                  }`}
                />

                {/* Expanded Label & Counts */}
                <div
                  className={`flex-1 flex items-center justify-between transition-opacity duration-200 whitespace-nowrap overflow-hidden ${
                    isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <span className="truncate">{item.label}</span>
                  {item.count !== undefined && (
                    <span
                      className={`text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded ${
                        item.alert
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : item.highlight
                          ? 'bg-emerald-400/20 text-emerald-300'
                          : isActive
                          ? 'bg-emerald-700 text-emerald-100'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </div>

                {/* Collapsed Badge Indicator Dot */}
                {!isHovered && item.count !== undefined && item.count > 0 && (
                  <span
                    className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
                      item.alert
                        ? 'bg-amber-400'
                        : item.highlight
                        ? 'bg-emerald-400 animate-pulse'
                        : 'bg-slate-600'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Hovered KPI Mini-Telemetry Block */}
      {isHovered && (
        <div className="mx-2 mb-2 p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1.5 transition-all">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span className="uppercase">BESS Pipeline</span>
            <span className="text-emerald-400 font-bold">{totalMw.toLocaleString()} MW</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '80%' }}></div>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-0.5">
            <div className="flex items-center gap-1">
              <span>Diligence Value</span>
              <YellowBlinkMockMark label="EST." tooltip="Estimated Pipeline Value using hypothetical $11.5k tier" variant="mini" />
            </div>
            <span className="text-yellow-300 font-bold">${pipelineValueUsd.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Bottom Tools & Operator Controls */}
      <div className="p-2 border-t border-slate-800/80 space-y-1.5 bg-slate-950/60">
        {/* Theme Mode Toggle */}
        <button
          onClick={toggleTheme}
          title={!isHovered ? (theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode') : undefined}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors group cursor-pointer"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 shrink-0" />
          ) : (
            <Moon className="w-4 h-4 text-cyan-400 shrink-0" />
          )}
          <span
            className={`transition-opacity duration-200 whitespace-nowrap overflow-hidden ${
              isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </span>
        </button>

        {/* Hermes M2M API */}
        <button
          onClick={onOpenHermesModal}
          title={!isHovered ? 'Hermes M2M Contract' : undefined}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors group"
        >
          <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
          <span
            className={`transition-opacity duration-200 whitespace-nowrap overflow-hidden ${
              isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            Hermes M2M
          </span>
        </button>

        {/* 5-BESS Acceptance Suite */}
        <button
          onClick={onOpenAcceptanceTest}
          title={!isHovered ? '5 BESS Acceptance Test' : undefined}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold text-emerald-200 bg-emerald-950/60 border border-emerald-800/80 hover:bg-emerald-900/60 transition-colors group"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span
            className={`transition-opacity duration-200 whitespace-nowrap overflow-hidden truncate ${
              isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            Acceptance Suite
          </span>
        </button>

        {/* Reset State */}
        <button
          onClick={() => {
            if (window.confirm('Reset all demo records and evidence to initial seed state?')) {
              resetToDefaultData();
            }
          }}
          title={!isHovered ? 'Reset Data' : undefined}
          className="w-full flex items-center gap-3 px-3 py-1.5 rounded-md text-xs text-slate-500 hover:text-slate-300 hover:bg-slate-900 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 shrink-0" />
          <span
            className={`transition-opacity duration-200 whitespace-nowrap overflow-hidden text-[11px] ${
              isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            Reset Seed Data
          </span>
        </button>
      </div>
    </aside>
  );
};
