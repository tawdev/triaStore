'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { api, normalizeImageUrl, type Category } from '../../lib/api';
import { useNotification } from '../../context/NotificationContext';
import { 
    LayoutGrid, 
    Search, 
    Plus, 
    Edit2, 
    Trash2, 
    ChevronLeft, 
    ChevronRight, 
    X, 
    ChevronDown,
    CheckCircle2,
    Loader2,
    Layers,
    Image as ImageIcon,
    Upload
} from 'lucide-react';
import Image from 'next/image';

// ─── Loading skeleton ─────────────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
    return <div className={`animate-pulse bg-slate-100 rounded-lg ${className}`} />;
}

export default function AdminCategoriesPage() {
    const { showToast, showConfirm } = useNotification();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({ name: '', description: '', isActive: true, parentId: null as number | null, imageUrl: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        try {
            const results = await api.uploadImages(Array.from(files));
            if (results && results.length > 0) {
                setFormData(prev => ({ ...prev, imageUrl: results[0].url }));
                showToast('Image téléchargée !', 'success');
            }
        } catch {
            showToast('Erreur lors du téléchargement.', 'error');
        }
    };

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.getCategories();
            setCategories(data);
        } catch {
            setError('Impossible de charger les catégories.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    const filteredCategories = useMemo(() => {
        return categories.filter(c =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (c.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
        );
    }, [categories, searchQuery]);

    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

    const hierarchicalCategories = useMemo(() => {
        const buildTree = (items: Category[], parentId: number | null = null, depth = 0): (Category & { depth: number })[] => {
            return items
                .filter(item => item.parentId === parentId)
                .reduce((acc, item) => {
                    return [
                        ...acc,
                        { ...item, depth },
                        ...buildTree(items, item.id, depth + 1)
                    ];
                }, [] as (Category & { depth: number })[]);
        };
        if (searchQuery) return filteredCategories.map(c => ({ ...c, depth: 0 }));
        return buildTree(categories);
    }, [categories, filteredCategories, searchQuery]);

    const paginatedCategories = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return hierarchicalCategories.slice(start, start + itemsPerPage);
    }, [hierarchicalCategories, currentPage, itemsPerPage]);

    useEffect(() => { setCurrentPage(1); }, [searchQuery]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            if (editingCategory) {
                await api.updateCategory(editingCategory.id, formData);
                showToast('Catégorie mise à jour !', 'success');
            } else {
                await api.createCategory(formData);
                showToast('Catégorie créée !', 'success');
            }
            setIsModalOpen(false);
            setEditingCategory(null);
            setFormData({ name: '', description: '', isActive: true, parentId: null, imageUrl: '' });
            loadData();
        } catch {
            showToast('Erreur lors de la sauvegarde.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            description: category.description || '',
            isActive: category.isActive,
            parentId: category.parentId || null,
            imageUrl: category.imageUrl || ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (categoryId: number) => {
        try {
            await api.deleteCategory(categoryId);
            showToast('Catégorie supprimée !', 'success');
            loadData();
        } catch {
            showToast('Erreur. La catégorie pourrait être utilisée.', 'error');
        }
    };

    return (
        <main className="flex-1 p-8 overflow-y-auto no-scrollbar bg-white">
            <div className="max-w-6xl mx-auto">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Gestion <span className="text-[#B8860B]">Catégories</span></h2>
                        <p className="text-slate-400 mt-1 font-medium text-sm">Organisez vos collections de luminaires avec élégance.</p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingCategory(null);
                            setFormData({ name: '', description: '', isActive: true, parentId: null, imageUrl: '' });
                            setIsModalOpen(true);
                        }}
                        className="bg-[#B8860B] hover:bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#B8860B]/20 transition-all flex items-center gap-3"
                    >
                        <Plus size={18} />
                        Nouvelle Catégorie
                    </button>
                </header>

                {/* Toolbar */}
                <div className="mb-10 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-[#B8860B]/20 focus:ring-4 focus:ring-[#B8860B]/5 outline-none transition-all"
                            placeholder="Rechercher une catégorie..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden relative mb-12">
                    {loading && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
                            <Loader2 className="w-10 h-10 text-[#B8860B] animate-spin" />
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <th className="px-8 py-6">Image</th>
                                    <th className="px-8 py-6">Nom de la Catégorie</th>
                                    <th className="px-8 py-6">Articles</th>
                                    <th className="px-8 py-6">Statut</th>
                                    <th className="px-8 py-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {paginatedCategories.length === 0 && !loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-24 text-center">
                                            <div className="flex flex-col items-center">
                                                <Layers className="size-16 text-slate-100 mb-4" />
                                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Aucune catégorie</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedCategories.map((category) => (
                                        <tr key={category.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="size-12 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center">
                                                    {category.imageUrl ? (
                                                        <img 
                                                            src={normalizeImageUrl(category.imageUrl) || category.imageUrl} 
                                                            alt={category.name} 
                                                            className="w-full h-full object-cover" 
                                                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/f8fafc/cbd5e1?text=X'; }}
                                                        />
                                                    ) : (
                                                        <ImageIcon size={18} className="text-slate-200" />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    {[...Array(category.depth)].map((_, i) => (
                                                        <div key={i} className="w-4 border-l-2 border-slate-100 h-8 ml-2" />
                                                    ))}
                                                    <div className="flex flex-col">
                                                        <span className="text-[15px] font-black text-slate-900 tracking-tight capitalize">{category.name}</span>
                                                        {category.parent && (
                                                            <span className="text-[10px] font-bold text-[#B8860B] uppercase tracking-widest mt-0.5">Sous-catégorie</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 max-w-[300px]">
                                                <p className="text-sm text-slate-400 font-medium truncate" title={category.description || ''}>
                                                    {category.description || 'Pas de description'}
                                                </p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-xs font-black text-slate-900 bg-slate-50 px-3 py-1.5 rounded-xl">
                                                    {category.products?.length || 0}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                {category.isActive ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                        <CheckCircle2 size={12} /> Actif
                                                    </span>
                                                ) : (
                                                    <span className="px-3 py-1 bg-slate-50 text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest">Inactif</span>
                                                )}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                                    <button onClick={() => handleEdit(category)} className="size-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-[#B8860B] hover:border-[#B8860B]/30 hover:shadow-lg transition-all">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button onClick={() => showConfirm({ title: 'Supprimer ?', message: 'Action irréversible.', confirmText: 'Supprimer', onConfirm: () => handleDelete(category.id) })} className="size-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:shadow-lg transition-all">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                Page {currentPage} sur {totalPages}
                            </span>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="px-5 py-2.5 rounded-full bg-white border border-slate-100 text-[10px] font-black text-slate-500 hover:bg-[#B8860B] hover:text-white transition-all disabled:opacity-50 flex items-center gap-2 uppercase tracking-widest"
                                >
                                    <ChevronLeft size={14} /> Précédent
                                </button>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-5 py-2.5 rounded-full bg-white border border-slate-100 text-[10px] font-black text-slate-500 hover:bg-[#B8860B] hover:text-white transition-all disabled:opacity-50 flex items-center gap-2 uppercase tracking-widest"
                                >
                                    Suivant <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                                    {editingCategory ? 'Modifier Catégorie' : 'Nouvelle Catégorie'}
                                </h3>
                                <p className="text-sm text-slate-400 font-medium mt-1">Structurez votre catalogue par thèmes.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="size-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[80vh] overflow-y-auto no-scrollbar">
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Image de la Catégorie</label>
                                    <div className="flex items-center gap-6">
                                        <div className="size-24 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden shrink-0 relative group">
                                            {formData.imageUrl ? (
                                                <img 
                                                    src={normalizeImageUrl(formData.imageUrl) || formData.imageUrl} 
                                                    alt="Preview" 
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/200x200/f8fafc/cbd5e1?text=Invalide'; }}
                                                />
                                            ) : (
                                                <ImageIcon className="text-slate-300" size={24} />
                                            )}
                                            <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                <Upload size={20} className="text-white" />
                                            </div>
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ou coller une URL directe</p>
                                            <div className="relative">
                                                <input 
                                                    type="text" 
                                                    value={formData.imageUrl} 
                                                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value.trim() })} 
                                                    className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl text-xs font-bold focus:bg-white focus:border-[#B8860B]/20 outline-none transition-all" 
                                                    placeholder="https://images.com/photo.jpg" 
                                                />
                                                {formData.imageUrl && (
                                                    <button type="button" onClick={() => setFormData({ ...formData, imageUrl: '' })} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500">
                                                        <X size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Nom de la Catégorie</label>
                                    <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-[#B8860B]/20 focus:ring-4 focus:ring-[#B8860B]/5 outline-none transition-all" placeholder="Ex: Suspensions Modernes" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Description</label>
                                    <textarea rows={2} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-[#B8860B]/20 focus:ring-4 focus:ring-[#B8860B]/5 outline-none transition-all resize-none" placeholder="Une brève description..." />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Catégorie Parente</label>
                                    <div className="relative">
                                        <select value={formData.parentId || ''} onChange={e => setFormData({ ...formData, parentId: e.target.value ? Number(e.target.value) : null })} className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-[#B8860B]/20 focus:ring-4 focus:ring-[#B8860B]/5 outline-none transition-all appearance-none">
                                            <option value="">Aucune (Niveau supérieur)</option>
                                            {categories.filter(c => c.id !== editingCategory?.id).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                        <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-5 bg-slate-50 rounded-[20px] border border-slate-100">
                                    <div>
                                        <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Statut Visible</p>
                                        <p className="text-[10px] text-slate-400 font-medium">Afficher sur la boutique en ligne.</p>
                                    </div>
                                    <button type="button" onClick={() => setFormData({ ...formData, isActive: !formData.isActive })} className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all focus:outline-none ${formData.isActive ? 'bg-[#B8860B]' : 'bg-slate-200'}`}>
                                        <span className={`inline-block size-5 transform rounded-full bg-white transition-transform ${formData.isActive ? 'translate-x-6' : 'translate-x-1'} shadow-sm`} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-8 py-4 border border-slate-100 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">Annuler</button>
                                <button type="submit" disabled={isSubmitting} className="flex-1 px-8 py-4 bg-[#B8860B] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#B8860B]/20 hover:bg-slate-900 transition-all">
                                    {isSubmitting ? 'Chargement...' : (editingCategory ? 'Mettre à jour' : 'Créer')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
