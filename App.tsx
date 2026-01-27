import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useStore } from './store';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ClientView from './components/ClientView';
import PipelineView from './components/PipelineView';
import ProposalView from './components/ProposalView';
import FinanceView from './components/FinanceView';
import SettingsView from './components/SettingsView';
import TopBar from './components/TopBar';

import { AnimatePresence } from 'framer-motion';
import PageWrapper from './components/PageWrapper';

const App: React.FC = () => {
  const location = useLocation();

  // Get active view from path for TopBar
  const activeView = (location.pathname.split('/')[1] || 'dashboard') as any;

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar activeView={activeView} />
        <main className="flex-1 overflow-y-auto no-scrollbar relative">
          <AnimatePresence mode="wait">
            <div key={location.pathname}>
              <Routes location={location}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
                <Route path="/clients" element={<PageWrapper><ClientView /></PageWrapper>} />
                <Route path="/pipeline" element={<PageWrapper><PipelineView /></PageWrapper>} />
                <Route path="/proposals" element={<PageWrapper><ProposalView /></PageWrapper>} />
                <Route path="/finance" element={<PageWrapper><FinanceView /></PageWrapper>} />
                <Route path="/settings" element={<PageWrapper><SettingsView /></PageWrapper>} />
              </Routes>
            </div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default App;
