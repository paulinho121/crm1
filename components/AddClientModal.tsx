
import React, { useState } from 'react';
import Modal from './Modal';
import { useStore } from '../store';
import { ClientType } from '../types';

interface AddClientModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddClientModal: React.FC<AddClientModalProps> = ({ isOpen, onClose }) => {
    const { addClient } = useStore();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        type: ClientType.CORPORATE,
        tags: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email) return;

        addClient({
            id: Math.random().toString(36).substr(2, 9),
            name: formData.name,
            email: formData.email,
            type: formData.type,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
            customFields: [],
            createdAt: new Date().toISOString()
        });

        setFormData({ name: '', email: '', type: ClientType.CORPORATE, tags: '' });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Register New Client">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Full Name / Company</label>
                    <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Wayne Enterprises"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Email Address</label>
                    <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="contact@company.com"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Relationship Type</label>
                    <select
                        value={formData.type}
                        onChange={e => setFormData({ ...formData, type: e.target.value as ClientType })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                    >
                        <option value={ClientType.CORPORATE}>Corporate (B2B)</option>
                        <option value={ClientType.INDIVIDUAL}>Individual (B2C)</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Tags (comma separated)</label>
                    <input
                        type="text"
                        value={formData.tags}
                        onChange={e => setFormData({ ...formData, tags: e.target.value })}
                        placeholder="VIP, Lead, Tech"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95 mt-4"
                >
                    Create Client
                </button>
            </form>
        </Modal>
    );
};

export default AddClientModal;
