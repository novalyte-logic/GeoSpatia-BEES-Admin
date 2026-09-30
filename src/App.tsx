/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { TodayView } from './components/views/TodayView';
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
      {/* Collapsible Sidebar on Left - expands strictly on mouse hover */}
      <Sidebar
        onOpenAcceptanceTest={() => setIsAcceptanceModalOpen(true)}
        onOpenHermesModal={() => setIsHermesModalOpen(true)}
      />

      {/* Main Content Area - offset for collapsed sidebar rail (w-16 = 64px) */}
      <div className="pl-16 flex-1 flex flex-col min-w-0 transition-all duration-300">
        {/* Top Bar following 3-Zone Contract */}
        <Header
          onOpenAcceptanceTest={() => setIsAcceptanceModalOpen(true)}
          onOpenHermesModal={() => setIsHermesModalOpen(true)}
        />

        {/* Main Viewport Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          {activeTab === 'today' && <TodayView />}
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
