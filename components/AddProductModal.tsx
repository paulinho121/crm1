
import React, { useState } from 'react';
import Modal from './Modal';
import { useStore } from '../store';
import { useTranslation } from 'react-i18next';
import { Plus, X } from 'lucide-react';

interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const { addProduct, categories, addCategory } = useStore();
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        description: '',
        category: '',
        price: '',
        manufacturer: ''
    });

    const [newCategoryName, setNewCategoryName] = useState('');
    const [isAddingCategory, setIsAddingCategory] = useState(false);

    // Set default category on open if empty and categories exist
    React.useEffect(() => {
        if (isOpen && !formData.category && categories.length > 0) {
            setFormData(prev => ({ ...prev, category: categories[0].name }));
        }
    }, [isOpen, categories, formData.category]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.code || !formData.name || !formData.price || !formData.category) return;

        await addProduct({
            code: formData.code,
            name: formData.name,
            description: formData.description,
            category: formData.category,
            price: parseFloat(formData.price),
            manufacturer: formData.manufacturer
        });

        setFormData({
            code: '',
            name: '',
            description: '',
            category: categories[0]?.name || '',
            price: '',
            manufacturer: ''
        });
        onClose();
    };

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return;
        await addCategory(newCategoryName.trim());
        setFormData(prev => ({ ...prev, category: newCategoryName.trim() }));
        setNewCategoryName('');
        setIsAddingCategory(false);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`${t('new')} ${t('item')}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">{t('product_code')}</label>
                        <input
                            required
                            type="text"
                            value={formData.code}
                            onChange={e => setFormData({ ...formData, code: e.target.value })}
                            placeholder="PROD-001"
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">{t('manufacturer')}</label>
                        <input
                            required
                            type="text"
                            value={formData.manufacturer}
                            onChange={e => setFormData({ ...formData, manufacturer: e.target.value })}
                            placeholder="e.g. Sony, Stark"
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">{t('product_name')}</label>
                    <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Item name"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">{t('description')}</label>
                    <textarea
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Briefly describe the item purpose..."
                        rows={2}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all no-scrollbar"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">{t('unit_value')} (R$)</label>
                        <input
                            required
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                            placeholder="0.00"
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">{t('category')}</label>
                        <div className="flex gap-2">
                            {!isAddingCategory ? (
                                <div className="flex-1 flex gap-2">
                                    <select
                                        required
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                                    >
                                        {categories.length === 0 && <option value="">{t('no_categories') || 'No categories'}</option>}
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => setIsAddingCategory(true)}
                                        className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-indigo-400 transition-colors"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex-1 flex gap-2">
                                    <input
                                        autoFocus
                                        type="text"
                                        value={newCategoryName}
                                        onChange={e => setNewCategoryName(e.target.value)}
                                        placeholder="New category..."
                                        className="flex-1 bg-zinc-950 border border-indigo-500/50 rounded-xl px-4 py-3 text-sm focus:outline-none transition-all"
                                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddCategory}
                                        className="p-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white transition-colors"
                                    >
                                        <Plus size={18} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsAddingCategory(false)}
                                        className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-zinc-400 transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95 mt-4"
                >
                    {t('new_item')}
                </button>
            </form>
        </Modal>
    );
};

export default AddProductModal;
