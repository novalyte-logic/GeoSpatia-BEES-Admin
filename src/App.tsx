/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { TodayView } from './components/views/TodayView';
import { RequestsView } from './components/views/RequestsView';
import { OpportunitiesView } from './components/views/OpportunitiesView';
import { ProjectsView } from './components/views/ProjectsView';
import { EvidenceView } from './components/views/EvidenceView';
import { CompaniesContactsView } from './components/views/CompaniesContactsView';
import { OutreachView } from './components/views/OutreachView';
import { SourcesRunsView } from './components/views/SourcesRunsView';
import { BacklogView } from './components/views/BacklogView';
import { EvidenceDrawer } from './components/modals/EvidenceDrawer';
import { AcceptanceTestModal } from './components/modals/AcceptanceTestModal';
import { HermesM2MModal } from './components/modals/HermesM2MModal';

const DashboardContent: React.FC = () => {
  const { activeTab, theme } = useApp();
  const [isAcceptanceModalOpen, setIsAcceptanceModalOpen] = useState(false);
  const [isHermesModalOpen, setIsHermesModalOpen] = useState(false);

  return (
    <div
      className={`min-h-screen bg-grid-geospatial flex font-sans relative transition-colors duration-200 ${
        theme === 'dark'
          ? 'bg-[#070D18] text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-300'
          : 'bg-[#F8FAFC] text-slate-900 selection:bg-emerald-100 selection:text-emerald-900'
      }`}
    >
      {/* Collapsible Sidebar on Left */}
      <Sidebar
        onOpenAcceptanceTest={() => setIsAcceptanceModalOpen(true)}
        onOpenHermesModal={() => setIsHermesModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="pl-16 flex-1 flex flex-col min-w-0 transition-all duration-300">
        <Header
          onOpenAcceptanceTest={() => setIsAcceptanceModalOpen(true)}
          onOpenHermesModal={() => setIsHermesModalOpen(true)}
        />

        {/* Disclaimer Banner: Non-negotiable diligence scope */}
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-1.5 text-[11px] font-mono text-amber-300 flex items-center justify-between">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <span>
              <strong>DILIGENCE SCOPE:</strong> Single-Site Intelligence Brief control plane. Does not guarantee real-time grid headroom or legal/permitting clearance.
            </span>
            <span className="text-slate-400 text-[10px]">
              CAISO Master Queue · Cluster 14/15 · Verified Sources Only
            </span>
          </div>
        </div>

        {/* Main Viewport Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          {activeTab === 'today' && <TodayView />}
          {activeTab === 'requests' && <RequestsView />}
          {activeTab === 'opportunities' && <OpportunitiesView />}
          {activeTab === 'projects' && <ProjectsView />}
          {activeTab === 'evidence' && <EvidenceView />}
          {activeTab === 'companies' && <CompaniesContactsView />}
          {activeTab === 'outreach' && <OutreachView />}
          {activeTab === 'sources' && <SourcesRunsView />}
          {activeTab === 'backlog' && <BacklogView />}
        </main>
      </div>

      {/* Slide-over Evidence Drawer */}
      <EvidenceDrawer />

      {/* Acceptance Test Suite Modal */}
      <AcceptanceTestModal
        isOpen={isAcceptanceModalOpen}
        onClose={() => setIsAcceptanceModalOpen(false)}
      />

      {/* Hermes Machine-to-Machine Integration Modal */}
      <HermesM2MModal
        isOpen={isHermesModalOpen}
        onClose={() => setIsHermesModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <DashboardContent />
    </AppProvider>
  );
}
