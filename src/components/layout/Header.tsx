import React from 'react';
import { useApp } from '../../context/AppContext';
import { GlobalHeaderSearch } from './GlobalHeaderSearch';
import { SourceStatusIndicator } from './SourceStatusIndicator';
import { CheckCircle2, RotateCcw, Terminal, Radar, Zap, Sun, Moon, Inbox } from 'lucide-react';

interface HeaderProps {
  onOpenAcceptanceTest: () => void;
  onOpenHermesModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAcceptanceTest, onOpenHermesModal }) => {
  const { activeTab, setActiveTab, resetToDefaultData, opportunities, outreachDrafts, projects, theme, toggleTheme, setTheme } = useApp();

  const conflictingCount = projects.filter((p) => p.conflictingFields.length > 0).length;
  const pendingOutreach = outreachDrafts.filter((d) => d.status === 'Needs Review' || d.status === 'Draft').length;

  const tabLabels: Record<string, { title: string; subtitle: string }> = {
    today: { title: "Today's Diligence Queue", subtitle: 'California BESS Market Control Plane · Daily Operations' },
    requests: { title: 'Site-Screen Requests Workspace', subtitle: 'Intake, Scope Qualification, Connector Run & Intelligence Brief Delivery' },
    opportunities: { title: 'Opportunities Pipeline', subtitle: 'Explainable Qualification & Deal Progression' },
    projects: { title: 'California BESS Projects', subtitle: 'Canonical Infrastructure Intelligence · PostGIS System of Record' },
    evidence: { title: 'Source Evidence Ledger', subtitle: 'Immutable Chain of Provenance · Principles #1 & #2' },
    companies: { title: 'Companies & Contacts', subtitle: 'Verified BESS Siting Decision-Makers' },
    outreach: { title: 'Outreach Review Queue', subtitle: 'Grounded Personalization · Human Approval Gate' },
    sources: { title: 'Sources & Agent Runs', subtitle: 'Hermes M2M Scrapers & Job Telemetry' },
    backlog: { title: 'Scope Discipline Backlog', subtitle: 'Parked Future Concepts · Principle #9' },
  };

  const currentTabInfo = tabLabels[activeTab] || tabLabels.today;

  return (
    <header
      className={`sticky top-0 z-30 backdrop-blur-md border-b transition-colors duration-200 ${
        theme === 'dark'
          ? 'bg-[#0B1528]/95 border-slate-800/80 shadow-lg shadow-black/20 text-white'
          : 'bg-white/95 border-slate-200 shadow-xs text-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Breadcrumb & Section Name */}
          <div className="flex items-center gap-3 shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                    theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${theme === 'dark' ? 'bg-emerald-400' : 'bg-emerald-600'} animate-pulse`}></span>
                  GEOSPATIAL LABS
                </span>
                <span className={theme === 'dark' ? 'text-slate-600' : 'text-slate-300'}>/</span>
                <span
                  className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded border ${
                    theme === 'dark'
                      ? 'text-cyan-300 bg-cyan-950/80 border-cyan-800/60'
                      : 'text-cyan-800 bg-cyan-50 border-cyan-200'
                  }`}
                >
                  CALIFORNIA BESS CONTROL PLANE
                </span>
              </div>
              <h1 className={`text-base font-bold leading-tight mt-0.5 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {currentTabInfo.title}
              </h1>
            </div>
          </div>

          {/* Center Global Search Bar (Look up BESS sites by ID, Location, or Status) */}
          <div className="flex-1 max-w-md mx-2">
            <GlobalHeaderSearch />
          </div>

          {/* Right Action Buttons with Live Source Status Indicator */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Live Source Status Indicator (Verifiable telemetry) */}
            <SourceStatusIndicator />

            {/* Theme Toggle Switch */}
            <div
              className={`flex items-center p-0.5 rounded-lg border font-mono text-xs transition-colors ${
                theme === 'dark'
                  ? 'bg-slate-900/90 border-slate-700/80'
                  : 'bg-slate-100 border-slate-300'
              }`}
            >
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'bg-white text-slate-900 font-semibold shadow-xs border border-slate-200'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Switch to Light Mode"
                aria-label="Light mode"
              >
                <Sun className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-amber-500 fill-amber-500/20' : 'text-slate-400'}`} />
                <span className="text-[11px]">Light</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-[#0B1528] text-emerald-400 font-semibold shadow-xs border border-emerald-500/40'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Switch to Dark Mode"
                aria-label="Dark mode"
              >
                <Moon className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-emerald-400 fill-emerald-400/20' : 'text-slate-400'}`} />
                <span className="text-[11px]">Dark</span>
              </button>
            </div>

            <button
              onClick={onOpenHermesModal}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-md border transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                theme === 'dark'
                  ? 'text-slate-300 bg-slate-900/90 border-slate-700/80 hover:bg-slate-800 hover:text-white hover:border-slate-500'
                  : 'text-slate-700 bg-white border-slate-300 hover:bg-slate-100 hover:text-slate-900 shadow-xs'
              }`}
              title="Inspect Hermes machine-to-machine API contract & test runner"
            >
              <Terminal className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} />
              <span>Hermes M2M</span>
            </button>

            <button
              onClick={onOpenAcceptanceTest}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-md shadow-xs shadow-emerald-950/40 transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-emerald-400"
              title="Run 5-Opportunity California BESS Acceptance Test Suite"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-100" />
              <span className="hidden sm:inline">Acceptance Test</span>
              <span className="text-emerald-100 font-mono">(5 BESS)</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Reset all demo records and evidence to initial seed state?')) {
                  resetToDefaultData();
                }
              }}
              className={`p-1.5 rounded-md transition-colors ${
                theme === 'dark'
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'
              }`}
              title="Reset state to initial verified baseline"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
