
export enum ClientType {
  INDIVIDUAL = 'Individual',
  CORPORATE = 'Corporate'
}

export enum DealStatus {
  OPEN = 'Open',
  WON = 'Won',
  LOST = 'Lost'
}

export interface CustomField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select';
  value: any;
}

export interface Client {
  id: string;
  name: string;
  type: ClientType;
  email: string;
  taxId?: string; // CPF or CNPJ
  stateRegistration?: string; // Inscrição Estadual
  cep?: string;
  address?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  tags: string[];
  customFields: CustomField[];
  createdAt: string;
}

export interface PipelineStage {
  id: string;
  title: string;
  color: string;
  order: number;
}

export interface Deal {
  id: string;
  clientId: string;
  title: string;
  value: number;
  stageId: string;
  status: DealStatus;
  probability: number;
  createdAt: string;
}

export interface ProposalItem {
  productId: string;
  code: string;
  name: string;
  description: string;
  manufacturer: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Proposal {
  id: string;
  clientId: string;
  title: string;
  items: ProposalItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected';
  createdAt: string;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  price: number;
  manufacturer: string;
}

export interface ProductCategory {
  id: string;
  name: string;
}

export interface Commission {
  id: string;
  dealId: string;
  amount: number;
  status: 'Pending' | 'Paid';
  percentage: number;
}

export type AppView = 'dashboard' | 'clients' | 'pipeline' | 'proposals' | 'finance' | 'settings' | 'inventory';
