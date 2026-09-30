import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BacklogItemRecord } from '../../types';
import { Plus, Shield, CheckCircle2, Clock, Ban, ArrowUpRight, Compass, Radar } from 'lucide-react';

export const BacklogView: React.FC = () => {
  const { backlog, addBacklogItem, updateBacklogStatus } = useApp();

  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [idea, setIdea] = useState<string>('');
  const [rationale, setRationale] = useState<string>('');
  const [revenueRelevance, setRevenueRelevance] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;
    addBacklogItem(idea, rationale, revenueRelevance);
    setIdea('');
    setRationale('');
    setRevenueRelevance('');
    setIsAdding(false);
  };

  const getStatusBadge = (status: BacklogItemRecord['status']) => {
    switch (status) {
      case 'PARKED':
        return (
          <span className="text-[10px] font-mono font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            PARKED (DEFAULT)
          </span>
        );
      case 'PROMOTED':
        return (
          <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
            PROMOTED TO V2
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
            UNDER REVIEW
          </span>
        );
      case 'REJECTED':
        return (
          <span className="text-[10px] font-mono font-bold text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">
            REJECTED
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-16 text-slate-100 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="text-xs font-mono font-medium text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>Scope Discipline · Non-Negotiable Principle #9</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Scope Backlog & Idea Parking</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Capture future concepts without interrupting the current California BESS revenue workflow. Optimize for first customer revenue, not feature count.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors self-start sm:self-auto font-mono shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isAdding ? 'Cancel' : 'Park New Idea'}</span>
        </button>
      </div>

      {/* Principle Callout */}
      <div className="p-4 bg-emerald-950/30 rounded-xl border border-emerald-800/60 flex items-start gap-3">
        <Shield className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs text-emerald-200 space-y-0.5 font-sans">
          <span className="font-bold text-emerald-300 font-mono text-xs uppercase block">Operating Law: Scope Lock</span>
          <p className="leading-relaxed">
            No backlog item enters active development unless explicitly promoted by the managing owner. The product is judged exclusively by whether it turns documented market activity into paid diligence engagements.
          </p>
        </div>
      </div>

      {/* Idea Add Form */}
      {isAdding && (
        <form
          onSubmit={handleSubmit}
          className="p-5 bg-[#0B1424]/95 border border-slate-700 rounded-2xl space-y-4 shadow-xl shadow-black/20 animate-in fade-in duration-150"
        >
          <div className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
            Park Future Capability
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono">
              Feature / Capability Idea
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Automated PPA Offtake Matching for Community Choice Aggregators"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              className="w-full text-xs p-3 bg-[#070D18] text-white border border-slate-700 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono">
                Strategic Rationale
              </label>
              <textarea
                rows={3}
                required
                placeholder="Why does this matter long term?"
                value={rationale}
                onChange={(e) => setRationale(e.target.value)}
                className="w-full text-xs p-3 bg-[#070D18] text-white border border-slate-700 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono">
                Direct Revenue Relevance
              </label>
              <textarea
                rows={3}
                required
                placeholder="How will this directly generate or accelerate customer fees?"
                value={revenueRelevance}
                onChange={(e) => setRevenueRelevance(e.target.value)}
                className="w-full text-xs p-3 bg-[#070D18] text-white border border-slate-700 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-[#070D18] border border-slate-700 rounded-lg transition-colors font-mono"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-xs font-mono"
            >
              Save to Backlog
            </button>
          </div>
        </form>
      )}

      {/* Backlog Items List */}
      <div className="grid grid-cols-1 gap-4">
        {backlog.map((item) => (
          <div
            key={item.id}
            className="p-5 bg-[#0B1424]/95 border border-slate-800/90 rounded-2xl shadow-xl shadow-black/20 space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-sm font-bold text-white">{item.idea}</span>
                {getStatusBadge(item.status)}
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                Parked: {item.dateAdded} · Id: {item.id}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
              <div className="p-3 bg-[#070D18] rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                  Strategic Rationale
                </span>
                <p className="text-slate-300 leading-relaxed font-sans">{item.rationale}</p>
              </div>

              <div className="p-3 bg-[#070D18] rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                  Revenue Relevance
                </span>
                <p className="text-emerald-200/90 leading-relaxed font-sans">{item.revenueRelevance}</p>
              </div>
            </div>

            {/* Operator Promotion Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <span className="text-slate-500 font-mono text-[11px]">
                Status Control (Principle #9):
              </span>
              <div className="flex items-center gap-1.5">
                {(['PARKED', 'UNDER_REVIEW', 'PROMOTED', 'REJECTED'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => updateBacklogStatus(item.id, st)}
                    className={`px-2 py-0.5 text-[10px] font-mono rounded transition-colors ${
                      item.status === st
                        ? 'bg-slate-700 text-white font-bold'
                        : 'bg-[#070D18] text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
