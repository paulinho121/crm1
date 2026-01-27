import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useStore } from './store';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ClientView from './components/ClientView';
import PipelineView from './components/PipelineView';
import ProposalView from './components/ProposalView';
import FinanceView from './components/FinanceView';
import ProductView from './components/ProductView';
import SettingsView from './components/SettingsView';
import TopBar from './components/TopBar';
import AddClientModal from './components/AddClientModal';
import AddDealModal from './components/AddDealModal';
import AddProductModal from './components/AddProductModal';

import { AnimatePresence } from 'framer-motion';
import PageWrapper from './components/PageWrapper';

const App: React.FC = () => {
  const location = useLocation();
  const {
    fetchInitialData,
    isLoading,
    isClientModalOpen,
    isDealModalOpen,
    isProductModalOpen,
    setClientModalOpen,
    setDealModalOpen,
    setProductModalOpen
  } = useStore();

  React.useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Get active view from path for TopBar
  const activeView = (location.pathname.split('/')[1] || 'dashboard') as any;

  if (isLoading) {
    return (
      <div className="h-screen bg-zinc-950 flex flex-col items-center justify-center gap-6">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="space-y-2 text-center">
          <h2 className="text-xl font-bold tracking-tight">Nexus CRM</h2>
          <p className="text-sm text-zinc-500 animate-pulse">Syncing with Supabase...</p>
        </div>
      </div>
    );
  }

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
                <Route path="/inventory" element={<PageWrapper><ProductView /></PageWrapper>} />
                <Route path="/finance" element={<PageWrapper><FinanceView /></PageWrapper>} />
                <Route path="/settings" element={<PageWrapper><SettingsView /></PageWrapper>} />
              </Routes>
            </div>
          </AnimatePresence>
        </main>
      </div>

      <AddClientModal isOpen={isClientModalOpen} onClose={() => setClientModalOpen(false)} />
      <AddDealModal isOpen={isDealModalOpen} onClose={() => setDealModalOpen(false)} />
      <AddProductModal isOpen={isProductModalOpen} onClose={() => setProductModalOpen(false)} />
    </div>
  );
};

export default App;
