'use client';

import { useEffect, useState } from 'react';
import { api, normalizeImageUrl, type Brand } from '../../lib/api';
import { useNotification } from '../../context/NotificationContext';
import { 
    Plus, 
    Upload, 
    Link as LinkIcon, 
    Edit2, 
    Trash2, 
    BadgeCheck,
    Loader2,
    Image as ImageIcon
} from 'lucide-react';

export default function AdminBrandsPage() {
    const { showToast, showConfirm } = useNotification();
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
    const [formData, setFormData] = useState({ name: '', logoUrl: '', isActive: true });
    const [uploading, setUploading] = useState(false);

    const loadBrands = async () => {
        setLoading(true);
        try {
            const data = await api.getBrands();
            setBrands(data);
        } catch (err) {
            console.error('Failed to load brands:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadBrands(); }, []);

    const resetForm = () => {
        setFormData({ name: '', logoUrl: '', isActive: true });
        setEditingBrand(null);
        setShowForm(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingBrand) {
                await api.updateBrand(editingBrand.id, formData);
                showToast('Marque mise à jour avec succès !', 'success');
            } else {
                await api.createBrand(formData);
                showToast('Marque ajoutée avec succès !', 'success');
            }
            resetForm();
            loadBrands();
        } catch (err: any) {
            console.error('Failed to save brand:', err);
            showToast(err.message || 'Échec de l\'enregistrement de la marque', 'error');
        }
    };

    const handleEdit = (brand: Brand) => {
        setEditingBrand(brand);
        setFormData({ name: brand.name, logoUrl: brand.logoUrl || '', isActive: brand.isActive });
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        showConfirm({
            title: 'Supprimer la marque',
            message: 'Êtes-vous sûr de vouloir supprimer cette marque ? Cette action est irréversible.',
            confirmText: 'Supprimer',
            variant: 'danger',
            onConfirm: async () => {
                try {
                    await api.deleteBrand(id);
                    showToast('Marque supprimée avec succès !', 'success');
                    loadBrands();
                } catch (err: any) {
                    console.error('Failed to delete brand:', err);
                    showToast(err.message || 'Échec de la suppression de la marque', 'error');
                }
            }
        });
    };

    const handleToggleActive = async (brand: Brand) => {
        try {
            await api.updateBrand(brand.id, { isActive: !brand.isActive });
            loadBrands();
        } catch (err) {
            console.error('Failed to toggle brand:', err);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const result = await api.uploadImage(file);
            setFormData((prev) => ({ ...prev, logoUrl: result.url }));
        } catch (err) {
            console.error('Failed to upload image:', err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex-1 h-full min-h-0 flex flex-col overflow-y-auto no-scrollbar p-8 bg-slate-50/30">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Gestion des Marques</h1>
                    <p className="text-sm font-medium text-slate-500 mt-1">{brands.length} marque(s) enregistrée(s)</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowForm(true); }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-xl shadow-slate-900/10 hover:opacity-90 transition-all"
                >
                    <Plus size={18} />
                    Nouvelle Marque
                </button>
            </div>

            {/* Add/Edit Form */}
            {showForm && (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 mb-8">
                    <h2 className="text-lg font-black text-slate-900 mb-6 uppercase tracking-tight">
                        {editingBrand ? 'Modifier la Marque' : 'Ajouter une Marque'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="max-w-md">
                            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Nom de la marque</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Ex: Artemis Design, Crystal & Co..."
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[14px] font-medium focus:outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-200 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Logo</label>
                            <div className="space-y-4">
                                {/* Upload file */}
                                <div className="flex items-center gap-6">
                                    {formData.logoUrl?.trim() && (
                                        <div className="w-24 h-24 rounded-2xl border border-slate-100 overflow-hidden bg-white flex items-center justify-center p-3 shadow-sm">
                                            <img
                                                 src={normalizeImageUrl(formData.logoUrl) || ''}
                                                 alt="Logo preview"
                                                 className="max-w-full max-h-full object-contain"
                                                 onError={(e) => {
                                                     (e.target as HTMLImageElement).src = 'https://placehold.co/200x200/f8fafc/cbd5e1?text=Logo+invalide';
                                                 }}
                                             />
                                        </div>
                                    )}
                                    <label className="cursor-pointer group flex flex-col items-center justify-center size-24 border-2 border-dashed border-slate-200 rounded-2xl hover:border-slate-400 hover:bg-slate-50 transition-all text-slate-400 hover:text-slate-900">
                                        {uploading ? <Loader2 size={24} className="animate-spin" /> : <Upload size={24} />}
                                        <span className="text-[10px] font-black uppercase tracking-widest mt-2">{uploading ? '...' : 'Upload'}</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </label>
                                </div>

                                <div className="flex items-center gap-4 max-w-xl">
                                    <div className="flex-1 h-px bg-slate-100" />
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">ou URL directe</span>
                                    <div className="flex-1 h-px bg-slate-100" />
                                </div>

                                <div className="relative group max-w-xl">
                                    <LinkIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                                    <input
                                        type="url"
                                        value={formData.logoUrl.startsWith('http') ? formData.logoUrl : ''}
                                        onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                                        placeholder="Collez l'URL du logo ici..."
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-[14px] font-medium focus:outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-200 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 bg-slate-50 w-fit px-4 py-2 rounded-xl border border-slate-100">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="size-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 transition-all"
                            />
                            <label htmlFor="isActive" className="text-xs font-bold text-slate-700 cursor-pointer">Active (visible sur le site)</label>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-slate-900/10"
                            >
                                {editingBrand ? 'Mettre à jour' : 'Ajouter'}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-8 py-3 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                            >
                                Annuler
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Brands Table */}
            {loading ? (
                <div className="flex items-center justify-center py-32">
                    <Loader2 size={40} className="animate-spin text-slate-200" />
                </div>
            ) : brands.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-center">
                    <div className="size-20 rounded-3xl bg-slate-50 flex items-center justify-center mb-6">
                        <BadgeCheck size={40} className="text-slate-200" />
                    </div>
                    <p className="text-lg font-black text-slate-900 tracking-tight">Aucune marque enregistrée</p>
                    <p className="text-sm font-medium text-slate-400 mt-1">Commencez par ajouter votre première marque partenaire.</p>
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="text-left px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Logo</th>
                                <th className="text-left px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Nom</th>
                                <th className="text-left px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Statut</th>
                                <th className="text-right px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {brands.map((brand) => (
                                <tr key={brand.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="w-16 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center p-2 overflow-hidden shadow-sm">
                                            {brand.logoUrl?.trim() ? (
                                                <img
                                                     src={brand.logoUrl}
                                                     alt={brand.name}
                                                     className="max-w-full max-h-full object-contain"
                                                     onError={(e) => {
                                                         (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/f8fafc/cbd5e1?text=?';
                                                     }}
                                                 />
                                            ) : (
                                                <ImageIcon size={16} className="text-slate-200" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="font-bold text-slate-900 text-sm tracking-tight">{brand.name}</span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <button
                                            onClick={() => handleToggleActive(brand)}
                                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${brand.isActive
                                                ? 'bg-emerald-50 text-emerald-600'
                                                : 'bg-slate-100 text-slate-400'
                                                }`}
                                        >
                                            <span className={`size-1.5 rounded-full ${brand.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                                            {brand.isActive ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(brand)}
                                                className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                                                title="Modifier"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(brand.id)}
                                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                                title="Supprimer"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}


