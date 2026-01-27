
import { create } from 'zustand';
import { Client, Deal, PipelineStage, AppView } from './types';
import { INITIAL_CLIENTS, INITIAL_DEALS, PIPELINE_STAGES } from './constants';

interface CRMStore {
  clients: Client[];
  deals: Deal[];
  stages: PipelineStage[];
  activeView: AppView;
  
  // Actions
  setClients: (clients: Client[]) => void;
  addClient: (client: Client) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  
  setDeals: (deals: Deal[]) => void;
  addDeal: (deal: Deal) => void;
  updateDeal: (id: string, deal: Partial<Deal>) => void;
  
  setActiveView: (view: AppView) => void;
  
  // Helper to move a deal in pipeline
  moveDeal: (dealId: string, targetStageId: string) => void;
}

export const useStore = create<CRMStore>((set) => ({
  clients: INITIAL_CLIENTS,
  deals: INITIAL_DEALS,
  stages: PIPELINE_STAGES,
  activeView: 'dashboard',

  setClients: (clients) => set({ clients }),
  addClient: (client) => set((state) => ({ clients: [...state.clients, client] })),
  updateClient: (id, updatedClient) => set((state) => ({
    clients: state.clients.map((c) => (c.id === id ? { ...c, ...updatedClient } : c)),
  })),

  setDeals: (deals) => set({ deals }),
  addDeal: (deal) => set((state) => ({ deals: [...state.deals, deal] })),
  updateDeal: (id, updatedDeal) => set((state) => ({
    deals: state.deals.map((d) => (d.id === id ? { ...d, ...updatedDeal } : d)),
  })),

  setActiveView: (activeView) => set({ activeView }),

  moveDeal: (dealId, targetStageId) => set((state) => ({
    deals: state.deals.map((d) => (d.id === dealId ? { ...d, stageId: targetStageId } : d))
  })),
}));
