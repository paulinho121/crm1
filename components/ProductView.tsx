
import React, { useState } from 'react';
import { useStore } from '../store';
import { useTranslation } from 'react-i18next';
import { Package, Plus, Trash2, Building2, Hash, Settings2 } from 'lucide-react';
import ManageCategoriesModal from './ManageCategoriesModal';
import AddProductModal from './AddProductModal';

const ProductView: React.FC = () => {
    const { t } = useTranslation();
    const { products, deleteProduct } = useStore();
    const [isCatModalOpen, setIsCatModalOpen] = useState(false);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('inventory')}</h1>
                    <p className="text-zinc-500 mt-1">Manage your specialized products and manufacturers.</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => setIsCatModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl text-sm font-medium transition-all"
                    >
                        <Settings2 size={16} className="text-zinc-400" />
                        {t('manage_categories')}
                    </button>
                    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-center gap-4 text-zinc-100">
                        <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-lg">
                            <Package size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">{t('active_items')}</p>
                            <p className="text-xl font-bold">{products.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div key={product.id} className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl hover:border-zinc-700 transition-all group overflow-hidden relative">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-zinc-800 rounded-2xl text-indigo-400 group-hover:scale-110 transition-transform">
                                    <Package size={24} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-1.5 text-zinc-500">
                                        <Hash size={12} />
                                        <span className="text-[10px] font-bold tracking-widest">{product.code}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-emerald-500 mt-0.5">
                                        <Building2 size={12} />
                                        <span className="text-[10px] font-bold uppercase">{product.manufacturer}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => deleteProduct(product.id)}
                                    className="p-2 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-zinc-800 px-2 py-0.5 rounded">{product.category}</span>
                                <h3 className="text-lg font-bold mt-2 group-hover:text-indigo-400 transition-colors">{product.name}</h3>
                                <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                                    {product.description || "No description provided for this professional item."}
                                </p>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                                <div>
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase">{t('unit_value')}</p>
                                    <p className="text-xl font-bold text-zinc-100">R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Gradient */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-[60px] pointer-events-none"></div>
                    </div>
                ))}

                <button
                    onClick={() => setIsProductModalOpen(true)}
                    className="border-2 border-dashed border-zinc-800 rounded-3xl p-6 flex flex-col items-center justify-center gap-4 text-zinc-600 hover:text-indigo-400 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all min-h-[220px]"
                >
                    <div className="p-3 bg-zinc-900 rounded-2xl">
                        <Plus size={24} />
                    </div>
                    <span className="font-bold">{t('new_item')}</span>
                </button>
            </div>

            <ManageCategoriesModal isOpen={isCatModalOpen} onClose={() => setIsCatModalOpen(false)} />
            <AddProductModal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} />
        </div>
    );
};

export default ProductView;
