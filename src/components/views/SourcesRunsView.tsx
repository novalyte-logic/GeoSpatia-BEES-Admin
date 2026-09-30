import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SourceConnector, AgentRunRecord } from '../../types';
import {
  Layers,
  Bot,
  Play,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  Terminal,
  Activity,
  ChevronRight,
  ShieldCheck,
  Compass,
  Radar,
} from 'lucide-react';

export const SourcesRunsView: React.FC = () => {
  const { sources, agentRuns, triggerHermesRun, auditLogs } = useApp();

  const [selectedRunId, setSelectedRunId] = useState<string>('run_hermes_20260928_01');
  const [isTriggering, setIsTriggering] = useState<boolean>(false);
  const [triggerMessage, setTriggerMessage] = useState<string | null>(null);

  const activeRun = agentRuns.find((r) => r.id === selectedRunId) || agentRuns[0];

  const handleTriggerRun = (type: 'CAISO_CLUSTER_SCAN' | 'COUNTY_CEQA_SCAN') => {
    setIsTriggering(true);
    setTimeout(() => {
      const res = triggerHermesRun(type);
      setIsTriggering(false);
      setTriggerMessage(`Hermes agent completed run [${res.runId}] in 4.2s. 0 duplicates.`);
      setSelectedRunId(res.runId);
      setTimeout(() => setTriggerMessage(null), 5000);
    }, 700);
  };

  const getConnectorBadge = (status: SourceConnector['status']) => {
    switch (status) {
      case 'Connected':
        return (
          <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
            Connected
          </span>
        );
      case 'Waiting':
        return (
          <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
            Waiting (Rate Limited)
          </span>
        );
      case 'Setup Needed':
        return (
          <span className="text-[10px] font-mono font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            Setup Needed
          </span>
        );
      case 'Stale':
        return (
          <span className="text-[10px] font-mono font-bold text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">
            Stale
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 pb-16 text-slate-100 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="text-xs font-mono font-medium text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>Hermes Orchestration & Ingestion Diagnostics</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Sources & Agent Runs</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Operational transparency for automated scrapers, CAISO queue parsers, CEQA dockets, and machine job logs.
          </p>
        </div>

        {/* Trigger Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleTriggerRun('CAISO_CLUSTER_SCAN')}
            disabled={isTriggering}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors disabled:opacity-50 font-mono shadow-xs"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isTriggering ? 'Running Ingest...' : 'Run CAISO Ingest'}</span>
          </button>

          <button
            onClick={() => handleTriggerRun('COUNTY_CEQA_SCAN')}
            disabled={isTriggering}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-300 bg-[#0B1424] border border-slate-700 hover:bg-slate-800 hover:text-white rounded-lg transition-colors disabled:opacity-50 font-mono"
          >
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>Poll CEQA Clearinghouse</span>
          </button>
        </div>
      </div>

      {triggerMessage && (
        <div className="p-3.5 bg-emerald-950/80 border border-emerald-700 text-xs font-mono text-emerald-300 rounded-xl animate-in fade-in flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{triggerMessage}</span>
        </div>
      )}

      {/* Section 1: Configured Source Connectors */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
            Configured Primary Source Connectors ({sources.length})
          </h2>
          <span className="text-[11px] font-mono text-slate-500">
            Never represent a source as connected unless it is verified
          </span>
        </div>

        <div className="bg-[#0B1424]/95 border border-slate-800/90 rounded-2xl overflow-hidden shadow-xl shadow-black/20 divide-y divide-slate-800/80">
          {sources.map((src) => (
            <div key={src.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs hover:bg-slate-900/40 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{src.name}</span>
                  {getConnectorBadge(src.status)}
                </div>
                <div className="text-slate-300 font-medium">{src.jurisdiction}</div>
                <p className="text-slate-400 text-[11px] leading-relaxed font-mono">{src.endpointDescription}</p>
              </div>

              <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-2 shrink-0 font-mono text-[11px] text-slate-400 border-t md:border-t-0 pt-2 md:pt-0 border-slate-800">
                <div>
                  <span className="text-slate-500">Records Discovered: </span>
                  <span className="font-bold text-emerald-400 tabular-nums">{src.recordsDiscovered}</span>
                </div>
                <div>
                  <span className="text-slate-500">Last Sync: </span>
                  <span className="text-slate-300">{src.lastSuccessfulSync}</span>
                </div>
                {src.errorCount > 0 && (
                  <div className="text-amber-400 font-semibold">
                    Errors Logged: {src.errorCount}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Hermes Agent Run History & Diagnostic Logs */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
            Hermes Agent Ingestion Run History ({agentRuns.length})
          </h2>
          <span className="text-[11px] font-mono text-slate-500">
            Auditable runs with idempotency checks
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Runs Table (5 cols) */}
          <div className="lg:col-span-5 space-y-2.5">
            {agentRuns.map((run) => {
              const isSelected = activeRun?.id === run.id;

              return (
                <div
                  key={run.id}
                  onClick={() => setSelectedRunId(run.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-xs bg-[#0B1424]/95 shadow-md ${
                    isSelected
                      ? 'border-emerald-500 ring-1 ring-emerald-500/50 bg-[#0E1B33]'
                      : 'border-slate-800/90 hover:border-slate-700 hover:bg-[#0D1829]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-white">{run.id}</span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                        run.status === 'SUCCESS'
                          ? 'text-emerald-300 bg-emerald-950/80 border-emerald-800'
                          : run.status === 'PARTIAL_CONFLICT'
                          ? 'text-amber-300 bg-amber-950/80 border-amber-800'
                          : 'text-rose-300 bg-rose-950/80 border-rose-800'
                      }`}
                    >
                      {run.status}
                    </span>
                  </div>

                  <div className="font-medium text-slate-300 mt-1 font-mono">{run.targetDomain}</div>

                  <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>Evidence: +{run.evidenceCreated}</span>
                    <span>Conflicts: {run.conflictsFlagged}</span>
                    <span>{run.startedAt.split('T')[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Detailed Run Log & Diagnostic Snippets (7 cols) */}
          {activeRun && (
            <div className="lg:col-span-7 bg-[#0B1424]/95 border border-slate-800/90 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl shadow-black/20">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3.5">
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                    Agent Run Details
                  </div>
                  <h3 className="text-base font-bold text-white mt-0.5 font-mono">{activeRun.id}</h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {activeRun.agentName} ({activeRun.agentVersion})
                  </div>
                </div>
                <div className="text-right font-mono text-xs text-slate-400">
                  <div>Started: {activeRun.startedAt.split('T')[1].replace('Z', '')}</div>
                  <div>Finished: {activeRun.completedAt.split('T')[1].replace('Z', '')}</div>
                </div>
              </div>

              {/* Tasks Completed */}
              <div className="space-y-1.5 text-xs">
                <span className="font-semibold text-slate-300 uppercase tracking-wider text-[10px] font-mono">
                  Execution Tasks Completed
                </span>
                <ul className="space-y-1 bg-[#070D18] p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300">
                  {activeRun.tasksCompleted.map((t, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Idempotency Key */}
              <div className="p-3 bg-[#070D18] rounded-xl border border-slate-800 text-xs">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block font-mono">
                  Idempotency Verification Key
                </span>
                <span className="font-mono text-emerald-400 font-semibold">{activeRun.idempotencyKey}</span>
              </div>

              {/* Safe Ingestion Logs for Operator Display */}
              <div className="space-y-1.5">
                <span className="font-semibold text-slate-300 uppercase tracking-wider text-[10px] font-mono">
                  Safe Operational Logs (Sanitized)
                </span>
                <div className="p-4 bg-[#070D18] text-slate-200 rounded-xl font-mono text-xs space-y-1 max-h-48 overflow-y-auto leading-relaxed border border-slate-800">
                  {activeRun.logSnippets.map((l, idx) => (
                    <div key={idx} className="text-slate-300">
                      {l}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
