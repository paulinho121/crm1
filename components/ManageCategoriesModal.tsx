
import React, { useState } from 'react';
import Modal from './Modal';
import { useStore } from '../store';
import { Trash2, Plus, Tag, X } from 'lucide-react';

interface ManageCategoriesModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ManageCategoriesModal: React.FC<ManageCategoriesModalProps> = ({ isOpen, onClose }) => {
    const { categories, addCategory, deleteCategory } = useStore();
    const [newCatName, setNewCatName] = useState('');

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCatName.trim()) return;
        await addCategory(newCatName.trim());
        setNewCatName('');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Manage Categories">
            <div className="space-y-6">
                <form onSubmit={handleAdd} className="flex gap-2">
                    <input
                        type="text"
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        placeholder="New category name..."
                        className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Add
                    </button>
                </form>

                <div className="space-y-2 max-h-[400px] overflow-y-auto no-scrollbar">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Global Categories</p>
                    {categories.length === 0 ? (
                        <div className="text-center py-8 border-2 border-dashed border-zinc-800 rounded-2xl">
                            <Tag className="mx-auto text-zinc-700 mb-2" size={24} />
                            <p className="text-xs text-zinc-600">No categories found.</p>
                        </div>
                    ) : (
                        categories.map((category) => (
                            <div
                                key={category.id}
                                className="flex items-center justify-between p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                    <span className="text-sm font-medium">{category.name}</span>
                                </div>
                                <button
                                    onClick={() => deleteCategory(category.id)}
                                    className="p-2 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div className="pt-4 border-t border-zinc-800">
                    <p className="text-[10px] text-zinc-500 leading-relaxed italic">
                        * Removing a category will not delete products assigned to it, but they will no longer have a valid category link.
                    </p>
                </div>
            </div>
        </Modal>
    );
};

export default ManageCategoriesModal;
