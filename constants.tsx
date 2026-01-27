
import React from 'react';
import { LayoutDashboard, Users, Kanban, FileText, Landmark, Settings, Plus, Search, Bell, Sparkles } from 'lucide-react';
import { ClientType, DealStatus } from './types';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'clients', label: 'Clients', icon: <Users size={20} /> },
  { id: 'pipeline', label: 'Pipeline', icon: <Kanban size={20} /> },
  { id: 'proposals', label: 'Proposals', icon: <FileText size={20} /> },
  { id: 'finance', label: 'Finance', icon: <Landmark size={20} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
];

export const INITIAL_CLIENTS = [
  { id: '1', name: 'Acme Corp', type: ClientType.CORPORATE, email: 'contact@acme.com', tags: ['Enterprise', 'Tech'], customFields: [], createdAt: '2023-10-01' },
  { id: '2', name: 'John Doe', type: ClientType.INDIVIDUAL, email: 'john@gmail.com', tags: ['VIP'], customFields: [], createdAt: '2023-10-05' },
  { id: '3', name: 'Stark Industries', type: ClientType.CORPORATE, email: 'tony@stark.com', tags: ['Defense', 'Global'], customFields: [], createdAt: '2023-11-12' },
];

export const PIPELINE_STAGES = [
  { id: 'lead', title: 'Lead', color: '#3b82f6', order: 0 },
  { id: 'meeting', title: 'Meeting', color: '#a855f7', order: 1 },
  { id: 'proposal', title: 'Proposal', color: '#eab308', order: 2 },
  { id: 'negotiation', title: 'Negotiation', color: '#f97316', order: 3 },
  { id: 'closed', title: 'Closed', color: '#22c55e', order: 4 },
];

export const INITIAL_DEALS = [
  { id: 'd1', clientId: '1', title: 'CRM Implementation', value: 15000, stageId: 'proposal', status: DealStatus.OPEN, probability: 60, createdAt: '2024-01-10' },
  { id: 'd2', clientId: '3', title: 'Arc Reactor Supply', value: 500000, stageId: 'meeting', status: DealStatus.OPEN, probability: 40, createdAt: '2024-02-01' },
  { id: 'd3', clientId: '2', title: 'Personal Consulting', value: 2500, stageId: 'lead', status: DealStatus.OPEN, probability: 20, createdAt: '2024-02-15' },
];
