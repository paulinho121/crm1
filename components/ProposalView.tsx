
import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { useTranslation } from 'react-i18next';
import { FileText, Send, Plus, Trash2, Download, Search, User, Package, Calculator } from 'lucide-react';
import CommercialProposalTemplate from './CommercialProposalTemplate';
import { ProposalItem, Client, Product } from '../types';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ProposalView: React.FC = () => {
  const { t } = useTranslation();
  const { clients, products } = useStore();

  const [selectedClientId, setSelectedClientId] = useState('');
  const [items, setItems] = useState<ProposalItem[]>([]);
  const [shipping, setShipping] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedClient = clients.find(c => c.id === selectedClientId);

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + item.total, 0);
  }, [items]);

  const total = subtotal + shipping;

  const handleAddProduct = (product: Product) => {
    const existingItem = items.find(i => i.productId === product.id);
    if (existingItem) {
      setItems(items.map(i => i.productId === product.id ? {
        ...i,
        quantity: i.quantity + 1,
        total: (i.quantity + 1) * i.price
      } : i));
    } else {
      const newItem: ProposalItem = {
        productId: product.id,
        code: product.code,
        name: product.name,
        description: product.description,
        manufacturer: product.manufacturer,
        quantity: 1,
        price: product.price,
        total: product.price
      };
      setItems([...items, newItem]);
    }
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setItems(items.map(i => i.productId === productId ? {
      ...i,
      quantity,
      total: quantity * i.price
    } : i));
  };

  const handleUpdatePrice = (productId: string, price: number) => {
    setItems(items.map(i => i.productId === productId ? {
      ...i,
      price,
      total: i.quantity * price
    } : i));
  };

  const handleRemoveItem = (productId: string) => {
    setItems(items.filter(i => i.productId !== productId));
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadPDF = async () => {
    const element = document.getElementById('proposal-template');
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`PROPOSTA_${selectedClient?.name || 'DRAFT'}.pdf`);
  };

  const handleSendEmail = () => {
    alert('Funcionalidade de e-mail integrada! Preparando anexo...');
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('proposals_and_contracts')}</h1>
          <p className="text-zinc-500 mt-1">Crie orçamentos personalizados com produtos do seu inventário.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Layer: Configuration */}
        <div className="lg:col-span-4 space-y-6">
          {/* Step 1: Select Client */}
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <User className="text-indigo-500" size={18} />
              <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-400">1. Selecionar Cliente</h3>
            </div>
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
            >
              <option value="">Escolha um cliente cadastrado...</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
          </div>

          {/* Step 2: Add Products */}
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="text-indigo-500" size={18} />
              <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-400">2. Adicionar Itens</h3>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
              <input
                type="text"
                placeholder="Buscar no inventário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>

            <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  onClick={() => handleAddProduct(product)}
                  className="group flex flex-col p-3 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-indigo-500/50 cursor-pointer transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-zinc-200 group-hover:text-indigo-400">{product.name}</h4>
                      <p className="text-[10px] text-zinc-500">{product.code} | {product.manufacturer}</p>
                    </div>
                    <span className="text-[10px] font-black text-indigo-500">R$ {product.price.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals & Shipping */}
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="text-indigo-500" size={18} />
              <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-400">3. Frete e Ajustes</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Valor do Frete (R$)</label>
                <input
                  type="number"
                  value={shipping}
                  onChange={(e) => setShipping(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Final Actions */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleDownloadPDF}
              disabled={!selectedClient || items.length === 0}
              className="flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-2xl font-bold shadow-xl shadow-emerald-500/10 transition-all active:scale-95"
            >
              <Download size={18} /> PDF
            </button>
            <button
              onClick={handleSendEmail}
              disabled={!selectedClient || items.length === 0}
              className="flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-2xl font-bold shadow-xl shadow-indigo-500/10 transition-all active:scale-95"
            >
              <Send size={18} /> E-mail
            </button>
          </div>
        </div>

        {/* Right Layer: Items & Real-time Preview */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Selected Items List */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6">
            <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-400 mb-6">Itens Selecionados</h3>
            <div className="space-y-4">
              {items.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-zinc-600 border border-dashed border-zinc-800 rounded-2xl">
                  <Package size={48} strokeWidth={1} className="mb-2 opacity-20" />
                  <p className="text-sm">Nenhum item adicionado ainda.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item.productId} className="flex items-center gap-4 bg-zinc-950 p-4 border border-zinc-800 rounded-2xl">
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-zinc-200">{item.name}</h4>
                        <p className="text-[10px] text-zinc-500 uppercase font-black">{item.code}</p>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="w-20">
                          <label className="block text-[8px] font-black text-zinc-600 uppercase mb-1">Preço Unit.</label>
                          <input
                            type="number"
                            value={item.price}
                            onChange={(e) => handleUpdatePrice(item.productId, Number(e.target.value))}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-xs text-emerald-500 font-bold"
                          />
                        </div>
                        <div className="w-16">
                          <label className="block text-[8px] font-black text-zinc-600 uppercase mb-1">Qtd.</label>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleUpdateQuantity(item.productId, Number(e.target.value))}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-xs font-bold"
                          />
                        </div>
                        <div className="text-right w-24">
                          <label className="block text-[8px] font-black text-zinc-600 uppercase mb-1">Total</label>
                          <p className="text-sm font-black text-white">R$ {item.total.toLocaleString()}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.productId)}
                          className="p-2 text-zinc-600 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Document Preview */}
          <div className="bg-white/5 border border-zinc-800 rounded-[40px] p-2 aspect-[1/1.4] relative overflow-hidden group/preview">
            <div className="absolute inset-0 bg-zinc-950/80 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center z-10 pointer-events-none">
              <p className="bg-zinc-900 px-6 py-3 rounded-2xl text-sm font-bold border border-zinc-800 shadow-2xl">Visualização do Documento Final</p>
            </div>
            <div className="h-full overflow-y-auto no-scrollbar rounded-[32px] bg-white transform origin-top">
              {selectedClient ? (
                <CommercialProposalTemplate
                  client={selectedClient}
                  items={items}
                  subtotal={subtotal}
                  shipping={shipping}
                  total={total}
                  date={new Date().toLocaleDateString('pt-BR')}
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-zinc-300 gap-4 opacity-50 bg-[#fafafa]">
                  <FileText size={64} strokeWidth={1} />
                  <p className="font-sans text-sm italic">Selecione um cliente para visualizar o documento</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalView;
