
import { create } from 'zustand';
import { Client, Deal, PipelineStage, AppView, ClientType, DealStatus, Product, ProductCategory } from './types';
import { supabase } from './lib/supabase';

interface CRMStore {
    clients: Client[];
    deals: Deal[];
    stages: PipelineStage[];
    products: Product[];
    categories: ProductCategory[];
    activeView: AppView;
    isLoading: boolean;

    // Actions
    fetchInitialData: () => Promise<void>;

    addClient: (client: Omit<Client, 'id' | 'createdAt'>) => Promise<void>;
    updateClient: (id: string, client: Partial<Client>) => Promise<void>;

    addDeal: (deal: Omit<Deal, 'id' | 'createdAt'>) => Promise<void>;
    updateDeal: (id: string, deal: Partial<Deal>) => Promise<void>;
    setDeals: (deals: Deal[]) => void;

    moveDeal: (dealId: string, targetStageId: string) => Promise<void>;

    // Products Actions
    addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
    updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;

    // Categories Actions
    addCategory: (name: string) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;

    setActiveView: (view: AppView) => void;

    // Modal States
    isClientModalOpen: boolean;
    isDealModalOpen: boolean;
    isProductModalOpen: boolean;
    setClientModalOpen: (open: boolean) => void;
    setDealModalOpen: (open: boolean) => void;
    setProductModalOpen: (open: boolean) => void;
}

export const useStore = create<CRMStore>((set, get) => ({
    clients: [],
    deals: [],
    stages: [],
    products: [],
    categories: [],
    activeView: 'dashboard',
    isLoading: true,
    isClientModalOpen: false,
    isDealModalOpen: false,
    isProductModalOpen: false,

    setClientModalOpen: (open) => set({ isClientModalOpen: open }),
    setDealModalOpen: (open) => set({ isDealModalOpen: open }),
    setProductModalOpen: (open) => set({ isProductModalOpen: open }),

    fetchInitialData: async () => {
        set({ isLoading: true });
        try {
            const [stagesRes, clientsRes, dealsRes, productsRes, categoriesRes] = await Promise.all([
                supabase.from('pipeline_stages').select('*').order('display_order', { ascending: true }),
                supabase.from('clients').select('*').order('created_at', { ascending: false }),
                supabase.from('deals').select('*').order('created_at', { ascending: false }),
                supabase.from('products').select('*').order('name', { ascending: true }),
                supabase.from('product_categories').select('*').order('name', { ascending: true })
            ]);

            set({
                stages: stagesRes.data?.map(s => ({
                    id: s.id,
                    title: s.title,
                    color: s.color,
                    order: s.display_order
                })) || [],
                clients: clientsRes.data?.map(c => ({
                    id: c.id,
                    name: c.name,
                    email: c.email,
                    taxId: c.tax_id,
                    stateRegistration: c.state_registration,
                    cep: c.cep,
                    address: c.address,
                    number: c.number,
                    complement: c.complement,
                    neighborhood: c.neighborhood,
                    city: c.city,
                    state: c.state,
                    type: c.type as ClientType,
                    tags: c.tags || [],
                    customFields: c.custom_fields || [],
                    createdAt: c.created_at
                })) || [],
                deals: dealsRes.data?.map(d => ({
                    id: d.id,
                    clientId: d.client_id,
                    title: d.title,
                    value: d.value,
                    stageId: d.stage_id,
                    status: d.status as DealStatus,
                    probability: d.probability,
                    createdAt: d.created_at
                })) || [],
                products: productsRes.data?.map(p => ({
                    id: p.id,
                    code: p.code,
                    name: p.name,
                    description: p.description,
                    category: p.category,
                    price: p.price,
                    manufacturer: p.manufacturer
                })) || [],
                categories: categoriesRes.data?.map(cat => ({
                    id: cat.id,
                    name: cat.name
                })) || [],
                isLoading: false
            });
        } catch (error) {
            console.error('Error fetching data from Supabase:', error);
            set({ isLoading: false });
        }
    },

    addClient: async (newClient) => {
        const { data, error } = await supabase
            .from('clients')
            .insert([{
                name: newClient.name,
                email: newClient.email,
                tax_id: newClient.taxId,
                state_registration: newClient.stateRegistration,
                cep: newClient.cep,
                address: newClient.address,
                number: newClient.number,
                complement: newClient.complement,
                neighborhood: newClient.neighborhood,
                city: newClient.city,
                state: newClient.state,
                type: newClient.type,
                tags: newClient.tags,
                custom_fields: newClient.customFields
            }])
            .select()
            .single();

        if (error) {
            console.error('Error adding client:', error);
            return;
        }
        if (data) {
            const client: Client = {
                id: data.id,
                name: data.name,
                email: data.email,
                taxId: data.tax_id,
                stateRegistration: data.state_registration,
                cep: data.cep,
                address: data.address,
                number: data.number,
                complement: data.complement,
                neighborhood: data.neighborhood,
                city: data.city,
                state: data.state,
                type: data.type as ClientType,
                tags: data.tags || [],
                customFields: data.custom_fields || [],
                createdAt: data.created_at
            };
            set((state) => ({ clients: [client, ...state.clients] }));
        }
    },

    updateClient: async (id, updatedClient) => {
        const { error } = await supabase
            .from('clients')
            .update({
                name: updatedClient.name,
                email: updatedClient.email,
                type: updatedClient.type,
                tags: updatedClient.tags,
                custom_fields: updatedClient.customFields
            })
            .eq('id', id);

        if (!error) {
            set((state) => ({
                clients: state.clients.map((c) => (c.id === id ? { ...c, ...updatedClient } : c)),
            }));
        }
    },

    addDeal: async (newDeal) => {
        const { data, error } = await supabase
            .from('deals')
            .insert([{
                client_id: newDeal.clientId,
                title: newDeal.title,
                value: newDeal.value,
                stage_id: newDeal.stageId,
                status: newDeal.status,
                probability: newDeal.probability
            }])
            .select()
            .single();

        if (error) return;
        if (data) {
            const deal: Deal = {
                id: data.id,
                clientId: data.client_id,
                title: data.title,
                value: data.value,
                stageId: data.stage_id,
                status: data.status as DealStatus,
                probability: data.probability,
                createdAt: data.created_at
            };
            set((state) => ({ deals: [deal, ...state.deals] }));
        }
    },

    updateDeal: async (id, updatedDeal) => {
        const { error } = await supabase
            .from('deals')
            .update({
                title: updatedDeal.title,
                value: updatedDeal.value,
                stage_id: updatedDeal.stageId,
                status: updatedDeal.status,
                probability: updatedDeal.probability,
                client_id: updatedDeal.clientId
            })
            .eq('id', id);

        if (!error) {
            set((state) => ({
                deals: state.deals.map((d) => (d.id === id ? { ...d, ...updatedDeal } : d)),
            }));
        }
    },

    setDeals: (deals) => set({ deals }),

    moveDeal: async (dealId, targetStageId) => {
        const previousDeals = get().deals;
        set((state) => ({
            deals: state.deals.map((d) => (d.id === dealId ? { ...d, stageId: targetStageId } : d))
        }));

        const { error } = await supabase
            .from('deals')
            .update({ stage_id: targetStageId })
            .eq('id', dealId);

        if (error) {
            set({ deals: previousDeals });
        } else {
            await supabase.from('activities').insert({
                deal_id: dealId,
                type: 'stage_change',
                content: `Moved to ${targetStageId}`
            });
        }
    },

    addProduct: async (newProduct) => {
        const { data, error } = await supabase
            .from('products')
            .insert([newProduct])
            .select()
            .single();

        if (error) {
            console.error('Error adding product:', error);
            return;
        }

        if (data) {
            set((state) => ({ products: [...state.products, data] }));
        }
    },

    updateProduct: async (id, updatedProduct) => {
        const { error } = await supabase
            .from('products')
            .update(updatedProduct)
            .eq('id', id);

        if (error) {
            console.error('Error updating product:', error);
            return;
        }

        set((state) => ({
            products: state.products.map((p) => (p.id === id ? { ...p, ...updatedProduct } : p)),
        }));
    },

    deleteProduct: async (id) => {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting product:', error);
            return;
        }

        set((state) => ({
            products: state.products.filter((p) => p.id !== id),
        }));
    },

    addCategory: async (name) => {
        const { data, error } = await supabase
            .from('product_categories')
            .insert([{ name }])
            .select()
            .single();

        if (error) {
            console.error('Error adding category:', error);
            return;
        }

        if (data) {
            set((state) => ({ categories: [...state.categories, { id: data.id, name: data.name }] }));
        }
    },

    deleteCategory: async (id) => {
        const { error } = await supabase
            .from('product_categories')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting category:', error);
            return;
        }

        set((state) => ({ categories: state.categories.filter(c => c.id !== id) }));
    },

    setActiveView: (activeView) => set({ activeView }),
}));
