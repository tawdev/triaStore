'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { api, type Product } from '../../lib/api';
import { useNotification } from '../../context/NotificationContext';
import { 
    Search, 
    AlertTriangle, 
    Plus, 
    Minus, 
    ChevronLeft, 
    ChevronRight, 
    Image as ImageIcon, 
    AlertCircle, 
    List, 
    CheckCircle2, 
    Package,
    Loader2
} from 'lucide-react';

function Skeleton({ className }: { className?: string }) {
    return <div className={`animate-pulse bg-slate-200 rounded ${className}`} />;
}

export default function AdminInventoryPage() {
    const { showToast } = useNotification();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'in-stock' | 'out-of-stock'>('all');
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Increased for better view

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.getProducts({ page: 1, limit: 200 });
            setProducts(response.data);
        } catch {
            setError('Failed to load inventory data.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (p.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

            let matchesFilter = true;
            if (stockFilter === 'out-of-stock') matchesFilter = p.stock === 0;
            else if (stockFilter === 'low') matchesFilter = p.stock <= 10 && p.stock > 0;
            else if (stockFilter === 'in-stock') matchesFilter = p.stock > 10;

            return matchesSearch && matchesFilter;
        });
    }, [products, searchQuery, stockFilter]);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredProducts.slice(start, start + itemsPerPage);
    }, [filteredProducts, currentPage, itemsPerPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, stockFilter]);

    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) return [1, 2, 3, 4, 5];
            if (currentPage >= totalPages - 2) return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
            return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
        }
        return pages;
    };

    const handleUpdateStock = async (id: number, currentStock: number, delta: number) => {
        const newStock = Math.max(0, currentStock + delta);
        if (newStock === currentStock) return;

        try {
            setUpdatingId(id);
            await api.updateProduct(id, { stock: newStock });
            setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: newStock } : p));
            showToast('Stock mis à jour !', 'success');
        } catch {
            showToast('Erreur de mise à jour', 'error');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleManualStockUpdate = async (id: number, val: string) => {
        const newStock = parseInt(val);
        if (isNaN(newStock) || newStock < 0) return;

        try {
            setUpdatingId(id);
            await api.updateProduct(id, { stock: newStock });
            setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: newStock } : p));
            showToast('Stock mis à jour !', 'success');
        } catch {
            showToast('Erreur de mise à jour', 'error');
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <main className="flex-1 p-8 overflow-y-auto bg-slate-50/30">
            <div className="max-w-7xl mx-auto">
                <header className="mb-10">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Gestion de l'Inventaire</h2>
                    <p className="text-slate-500 mt-1 font-medium text-[15px]">Suivez et gérez les niveaux de stock de vos produits.</p>
                </header>

                {/* Alerts */}
                {!loading && (
                    <div className="space-y-4 mb-8">
                        {products.filter(p => p.stock <= 10 && p.stock > 0).length > 0 && (
                            <div className="flex items-center gap-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                                <div className="size-10 shrink-0 rounded-xl bg-amber-100 flex items-center justify-center">
                                    <AlertTriangle size={20} className="text-amber-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-amber-900 text-sm">
                                        {products.filter(p => p.stock <= 10 && p.stock > 0).length} produits en stock faible
                                    </p>
                                    <p className="text-xs text-amber-700/70 font-medium">Réapprovisionnement conseillé (moins de 10 unités).</p>
                                </div>
                                <button onClick={() => setStockFilter('low')} className="px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition-all shadow-sm">
                                    Voir
                                </button>
                            </div>
                        )}
                        {products.filter(p => p.stock === 0).length > 0 && (
                            <div className="flex items-center gap-4 p-4 bg-rose-50 border border-rose-200 rounded-2xl">
                                <div className="size-10 shrink-0 rounded-xl bg-rose-100 flex items-center justify-center">
                                    <AlertCircle size={20} className="text-rose-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-rose-900 text-sm">
                                        {products.filter(p => p.stock === 0).length} produits en rupture de stock
                                    </p>
                                    <p className="text-xs text-rose-700/70 font-medium">Action immédiate requise.</p>
                                </div>
                                <button onClick={() => setStockFilter('out-of-stock')} className="px-4 py-2 bg-rose-500 text-white rounded-xl text-xs font-bold hover:bg-rose-600 transition-all shadow-sm">
                                    Voir
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Filters & Search */}
                <div className="flex flex-col lg:flex-row gap-4 mb-8">
                    <div className="relative flex-1 group">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                        <input
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-[14px] font-medium focus:ring-4 focus:ring-slate-100 focus:border-slate-300 outline-none transition-all"
                            placeholder="Rechercher par nom ou SKU..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex p-1 bg-white border border-slate-200 rounded-2xl overflow-x-auto no-scrollbar">
                        {[
                            { id: 'all', label: 'Tous', icon: List },
                            { id: 'low', label: 'Faible', icon: AlertTriangle },
                            { id: 'out-of-stock', label: 'Rupture', icon: AlertCircle },
                            { id: 'in-stock', label: 'En Stock', icon: CheckCircle2 }
                        ].map((filter) => (
                            <button
                                key={filter.id}
                                onClick={() => setStockFilter(filter.id as any)}
                                className={`px-4 py-2 rounded-xl font-bold text-[13px] flex items-center gap-2 transition-all whitespace-nowrap ${stockFilter === filter.id
                                    ? 'bg-slate-900 text-white shadow-lg'
                                    : 'text-slate-500 hover:bg-slate-50'
                                    }`}
                            >
                                <filter.icon size={16} />
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                    <th className="px-8 py-6">Produit</th>
                                    <th className="px-8 py-6">Catégorie</th>
                                    <th className="px-8 py-6">Prix</th>
                                    <th className="px-8 py-6">Stock</th>
                                    <th className="px-8 py-6">Statut</th>
                                    <th className="px-8 py-6 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading && products.length === 0 ? (
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i}>
                                            <td className="px-8 py-6"><div className="flex items-center gap-4"><Skeleton className="size-12 rounded-xl" /><div className="space-y-2"><Skeleton className="h-4 w-40" /><Skeleton className="h-3 w-20" /></div></div></td>
                                            <td className="px-8 py-6"><Skeleton className="h-4 w-24" /></td>
                                            <td className="px-8 py-6"><Skeleton className="h-4 w-16" /></td>
                                            <td className="px-8 py-6"><Skeleton className="h-4 w-16" /></td>
                                            <td className="px-8 py-6"><Skeleton className="h-6 w-20 rounded-full" /></td>
                                            <td className="px-8 py-6"><Skeleton className="h-10 w-32 ml-auto rounded-xl" /></td>
                                        </tr>
                                    ))
                                ) : filteredProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-32 text-center">
                                            <div className="flex flex-col items-center gap-4 text-slate-300">
                                                <Package size={64} strokeWidth={1} />
                                                <p className="font-bold text-slate-400">Aucun produit trouvé</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedProducts.map((product) => (
                                        <tr key={product.id} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                                                        {product.imageUrl ? (
                                                            <img src={product.imageUrl} alt={product.name} className="size-full object-cover" />
                                                        ) : (
                                                            <div className="size-full flex items-center justify-center text-slate-300"><ImageIcon size={20} /></div>
                                                        )}
                                                    </div>
                                                    <div className="max-w-[200px]">
                                                        <p className="text-[14px] font-bold text-slate-900 truncate" title={product.name}>{product.name}</p>
                                                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider">SKU: {product.sku || '---'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-[12px] font-bold text-slate-500">{product.category?.name || 'Sans catégorie'}</span>
                                            </td>
                                            <td className="px-8 py-6 text-[14px] font-bold text-slate-900">
                                                {Number(product.price).toLocaleString()} MAD
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`text-[15px] font-black ${product.stock <= 10 ? 'text-rose-600' : 'text-slate-900'}`}>
                                                    {product.stock}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                {product.stock === 0 ? (
                                                    <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-widest">Rupture</span>
                                                ) : product.stock <= 10 ? (
                                                    <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest">Faible</span>
                                                ) : (
                                                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">Ok</span>
                                                )}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
                                                        <button
                                                            disabled={updatingId === product.id || product.stock === 0}
                                                            onClick={() => handleUpdateStock(product.id, product.stock, -1)}
                                                            className="size-8 flex items-center justify-center rounded-lg hover:bg-white text-slate-500 hover:text-slate-900 transition-all disabled:opacity-20"
                                                        >
                                                            <Minus size={14} />
                                                        </button>
                                                        <input
                                                            key={`${product.id}-${product.stock}`}
                                                            type="text"
                                                            className="w-10 text-center bg-transparent border-none text-[13px] font-black text-slate-900 focus:ring-0 p-0"
                                                            defaultValue={updatingId === product.id ? '...' : product.stock}
                                                            onBlur={(e) => handleManualStockUpdate(product.id, e.target.value)}
                                                            onKeyDown={(e) => e.key === 'Enter' && (e.target as any).blur()}
                                                        />
                                                        <button
                                                            disabled={updatingId === product.id}
                                                            onClick={() => handleUpdateStock(product.id, product.stock, 1)}
                                                            className="size-8 flex items-center justify-center rounded-lg hover:bg-white text-slate-500 hover:text-slate-900 transition-all disabled:opacity-20"
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>
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
                        <div className="px-8 py-6 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
                            <p className="text-[13px] font-bold text-slate-400">
                                <span className="text-slate-900">{filteredProducts.length}</span> produits au total
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 text-slate-400 hover:text-slate-900 transition-colors disabled:opacity-20"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <div className="flex items-center gap-1">
                                    {getPageNumbers().map((page, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(page as number)}
                                            className={`size-9 rounded-xl font-black text-[13px] transition-all ${currentPage === page ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-500 hover:bg-white hover:shadow-md'}`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 text-slate-400 hover:text-slate-900 transition-colors disabled:opacity-20"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}


