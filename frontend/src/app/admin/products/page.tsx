'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { api, normalizeImageUrl, type Product, type ProductStats, type Brand, type Category } from '../../lib/api';
import { useNotification } from '../../context/NotificationContext';
import { 
  Search, 
  Plus, 
  Package, 
  AlertTriangle, 
  CheckCircle2, 
  Ban, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Camera, 
  Link as LinkIcon, 
  Tag, 
  Type, 
  Heading1,
  Loader2,
  Box,
  Image as ImageIcon
} from 'lucide-react';

// ─── Loading skeleton ─────────────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-100 rounded-xl ${className}`} />;
}

// ─── Stock indicator ──────────────────────────────────────────────────────────
function StockIndicator({ stock }: { stock: number }) {
  if (stock === 0) {
    return (
      <div className="flex flex-col gap-1.5">
        <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
          <div className="bg-rose-500 h-full w-full" />
        </div>
        <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Rupture de stock</span>
      </div>
    );
  }
  const pct = Math.min(100, (stock / 100) * 100);
  const color = stock <= 10 ? 'bg-amber-500' : 'bg-emerald-500';
  const textColor = stock <= 10 ? 'text-amber-600' : 'text-emerald-600';
  return (
    <div className="flex flex-col gap-1.5">
      <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
        <div className={`${color} h-full rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-[10px] font-black ${textColor} uppercase tracking-widest`}>{stock} en stock</span>
    </div>
  );
}

// ─── Main Content Wrapper to handle useSearchParams in Suspense ───────────────
function ProductsContent() {
  const { showToast, showConfirm } = useNotification();
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get('search');

  const [stats, setStats] = useState<ProductStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    price: '',
    oldPrice: '',
    stock: '',
    categoryId: '' as string | number,
    brandId: '' as string | number,
    imageUrl: '',
    imageUrls: [] as string[],
    tags: [] as string[],
    description: '',
  });
  const [currentTag, setCurrentTag] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(urlSearch || '');
  const [debouncedSearch, setDebouncedSearch] = useState(urlSearch || '');

  useEffect(() => {
    const timer = setTimeout(() => { setDebouncedSearch(searchQuery); }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => { setPage(1); }, [debouncedSearch]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [s, p, b, c] = await Promise.all([
        api.getProductStats(),
        api.getProducts({ page, limit: 10, search: debouncedSearch }),
        api.getBrands(),
        api.getCategories(),
      ]);
      setStats(s);
      setProducts(p.data);
      setBrands(b);
      setCategories(c);
      setTotal(p.total);
      setTotalPages(p.totalPages);
    } catch {
      setError('Erreur de connexion au serveur.');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const productData: any = {
        name: newProduct.name,
        sku: newProduct.sku,
        price: parseFloat(newProduct.price),
        oldPrice: newProduct.oldPrice ? parseFloat(newProduct.oldPrice) : null,
        stock: parseInt(newProduct.stock),
        categoryId: newProduct.categoryId ? Number(newProduct.categoryId) : null,
        brandId: newProduct.brandId ? Number(newProduct.brandId) : null,
        imageUrl: newProduct.imageUrl,
        imageUrls: newProduct.imageUrls,
        tags: newProduct.tags,
        description: newProduct.description,
      };

      if (editingProduct) {
        await api.updateProduct(editingProduct.id, productData);
        showToast('Produit mis à jour !', 'success');
      } else {
        await api.createProduct(productData);
        showToast('Produit ajouté !', 'success');
      }

      setIsModalOpen(false);
      setEditingProduct(null);
      setNewProduct({ name: '', sku: '', price: '', oldPrice: '', stock: '', categoryId: '', brandId: '', imageUrl: '', imageUrls: [], tags: [], description: '' });
      loadData();
    } catch {
      showToast('Erreur lors de la sauvegarde.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      sku: product.sku || '',
      price: product.price.toString(),
      oldPrice: product.oldPrice ? product.oldPrice.toString() : '',
      stock: product.stock.toString(),
      categoryId: (product.categoryId || product.category?.id || '').toString(),
      brandId: (product.brandId || product.brand?.id || '').toString(),
      imageUrl: product.imageUrl || '',
      imageUrls: product.imageUrls || [],
      tags: product.tags || [],
      description: product.description || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (productId: number) => {
    try {
      await api.deleteProduct(productId);
      showToast('Produit supprimé !', 'success');
      loadData();
    } catch {
      showToast('Erreur lors de la suppression.', 'error');
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    try {
      setIsUploading(true);
      const results = await api.uploadImages(files);
      const newUrls = results.map(r => r.url);
      setNewProduct(prev => ({ 
        ...prev, 
        imageUrls: [...prev.imageUrls, ...newUrls],
        imageUrl: prev.imageUrl || newUrls[0] 
      }));
    } catch {
      showToast('Erreur d\'upload.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="flex-1 p-8 overflow-y-auto no-scrollbar bg-white">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Inventaire <span className="text-[#B8860B]">Produits</span></h2>
          <p className="text-slate-400 mt-1 font-medium text-sm">Gérez votre catalogue, les prix et les niveaux de stock.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              className="pl-12 pr-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-[#B8860B]/20 focus:ring-4 focus:ring-[#B8860B]/5 outline-none transition-all w-80"
              placeholder="Rechercher un produit..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => {
              setEditingProduct(null);
              setNewProduct({ name: '', sku: '', price: '', oldPrice: '', stock: '', categoryId: '', brandId: '', imageUrl: '', imageUrls: [], tags: [], description: '' });
              setIsModalOpen(true);
            }}
            className="bg-[#B8860B] hover:bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#B8860B]/20 transition-all flex items-center gap-3"
          >
            <Plus size={18} />
            Ajouter un produit
          </button>
        </div>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Total Produits', value: stats?.total, icon: Box, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Stock Faible', value: stats?.lowStock, icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'Articles Actifs', value: stats?.active, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Rupture', value: stats?.outOfStock, icon: Ban, color: 'text-rose-500', bg: 'bg-rose-50' },
        ].map(stat => (
          <div key={stat.label} className="bg-white border border-slate-100 rounded-[28px] p-6 shadow-sm">
            <div className={`size-12 rounded-2xl flex items-center justify-center mb-4 ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <p className="text-3xl font-black text-slate-900">{loading ? '—' : stat.value}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden mb-12 relative">
        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
            <Loader2 className="w-10 h-10 text-[#B8860B] animate-spin" />
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Aperçu</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Désignation</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Catégorie</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Prix</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">État du Stock</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {products.length === 0 && !loading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <Box className="size-16 text-slate-100 mb-4" />
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Aucun produit trouvé</p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="size-16 rounded-2xl bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100 group-hover:scale-105 transition-transform">
                        {product.imageUrl ? (
                          <img className="w-full h-full object-contain p-2" src={product.imageUrl} alt={product.name} />
                        ) : (
                          <ImageIcon className="text-slate-200" size={24} />
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900 tracking-tight line-clamp-1">{product.name}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">SKU: {product.sku || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="inline-flex items-center px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                        {product.category?.name ?? 'Divers'}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900">{Number(product.price).toFixed(2)} MAD</span>
                        {product.oldPrice && <span className="text-[10px] text-slate-300 line-through">{Number(product.oldPrice).toFixed(2)} MAD</span>}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <StockIndicator stock={product.stock} />
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                        <button onClick={() => handleEdit(product)} className="size-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-[#B8860B] hover:border-[#B8860B]/30 hover:shadow-lg transition-all">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => showConfirm({ title: 'Supprimer ?', message: 'Cette action est irréversible.', confirmText: 'Supprimer', onConfirm: () => handleDelete(product.id) })} className="size-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:shadow-lg transition-all">
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
        <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Affichage {(page - 1) * 10 + 1}–{Math.min(page * 10, total)} sur {total}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="px-5 py-2.5 rounded-full bg-white border border-slate-100 text-[10px] font-black text-slate-500 hover:bg-[#B8860B] hover:text-white transition-all disabled:opacity-50 flex items-center gap-2 uppercase tracking-widest"
            >
              <ChevronLeft size={14} /> Précédent
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || loading}
              className="px-5 py-2.5 rounded-full bg-white border border-slate-100 text-[10px] font-black text-slate-500 hover:bg-[#B8860B] hover:text-white transition-all disabled:opacity-50 flex items-center gap-2 uppercase tracking-widest"
            >
              Suivant <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                  {editingProduct ? 'Modifier Produit' : 'Ajouter Produit'}
                </h3>
                <p className="text-sm text-slate-400 font-medium mt-1">Détails techniques et inventaire.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="size-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
              <div className="p-10 overflow-y-auto no-scrollbar space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Désignation</label>
                    <input required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-[#B8860B]/20 focus:ring-4 focus:ring-[#B8860B]/5 outline-none transition-all" placeholder="Nom du luminaire..." />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Prix (MAD)</label>
                    <input required type="number" step="0.01" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-[#B8860B]/20 focus:ring-4 focus:ring-[#B8860B]/5 outline-none transition-all" placeholder="0.00" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Prix Promo (Optionnel)</label>
                    <input type="number" step="0.01" value={newProduct.oldPrice} onChange={e => setNewProduct({...newProduct, oldPrice: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-[#B8860B]/20 focus:ring-4 focus:ring-[#B8860B]/5 outline-none transition-all" placeholder="Prix original..." />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Quantité Stock</label>
                    <input required type="number" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-[#B8860B]/20 focus:ring-4 focus:ring-[#B8860B]/5 outline-none transition-all" placeholder="0" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Catégorie</label>
                    <select required value={newProduct.categoryId} onChange={e => setNewProduct({...newProduct, categoryId: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-[#B8860B]/20 focus:ring-4 focus:ring-[#B8860B]/5 outline-none transition-all">
                      <option value="">Sélectionner...</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Images du Produit</label>
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    {newProduct.imageUrls.map((url, i) => (
                      <div key={i} className={`relative aspect-square rounded-2xl bg-slate-50 overflow-hidden group border-2 transition-all flex items-center justify-center ${newProduct.imageUrl === url ? 'border-[#B8860B] shadow-lg shadow-[#B8860B]/10' : 'border-slate-100 hover:border-slate-200'}`}>
                        {/* Background icon in case image is missing or broken */}
                        <ImageIcon className="absolute text-slate-200" size={24} />
                        
                        {url && (
                          <img 
                            src={normalizeImageUrl(url) || url} 
                            className="absolute inset-0 w-full h-full object-contain p-2 z-10" 
                            alt="" 
                            onError={(e) => {
                              (e.target as HTMLImageElement).classList.add('opacity-0');
                            }}
                          />
                        )}

                        {/* Actions Overlay */}
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex flex-col items-center justify-center gap-2">
                          <button 
                            type="button" 
                            onClick={() => setNewProduct(p => ({...p, imageUrl: url}))} 
                            className={`size-8 rounded-full flex items-center justify-center transition-all ${newProduct.imageUrl === url ? 'bg-[#B8860B] text-white' : 'bg-white text-slate-400 hover:text-[#B8860B]'}`}
                            title="Définir comme image principale"
                          >
                            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setNewProduct(p => {
                              const filtered = p.imageUrls.filter((_, idx) => idx !== i);
                              return {
                                ...p, 
                                imageUrls: filtered,
                                imageUrl: p.imageUrl === url ? (filtered[0] || '') : p.imageUrl
                              };
                            })} 
                            className="size-8 bg-rose-500 text-white rounded-full flex items-center justify-center hover:bg-rose-600 transition-colors"
                            title="Supprimer"
                          >
                            <X size={16}/>
                          </button>
                        </div>

                        {/* Main Image Badge */}
                        {newProduct.imageUrl === url && (
                          <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#B8860B] text-white text-[8px] font-black uppercase tracking-widest rounded-full z-20">Principal</div>
                        )}
                      </div>
                    ))}
                    <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-100 hover:border-[#B8860B] hover:bg-[#B8860B]/5 flex flex-col items-center justify-center cursor-pointer transition-all group">
                      {isUploading ? <Loader2 size={24} className="text-[#B8860B] animate-spin" /> : <Camera size={24} className="text-slate-200 group-hover:text-[#B8860B]" />}
                      <span className="text-[9px] font-black text-slate-300 mt-2 uppercase tracking-widest group-hover:text-[#B8860B]">Uploader</span>
                      <input type="file" multiple hidden onChange={handleImageChange} />
                    </label>
                  </div>

                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input 
                        type="url" 
                        id="image-url-input"
                        placeholder="Ou collez l'URL d'une image ici..." 
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-[#B8860B]/20 focus:ring-4 focus:ring-[#B8860B]/5 outline-none transition-all"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const val = (e.target as HTMLInputElement).value.trim();
                            if (val) {
                              setNewProduct(prev => ({
                                ...prev,
                                imageUrls: [...prev.imageUrls, val],
                                imageUrl: prev.imageUrl || val
                              }));
                              (e.target as HTMLInputElement).value = '';
                            }
                          }
                        }}
                      />
                    </div>
                    <button 
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('image-url-input') as HTMLInputElement;
                        const val = input.value.trim();
                        if (val) {
                          setNewProduct(prev => ({
                            ...prev,
                            imageUrls: [...prev.imageUrls, val],
                            imageUrl: prev.imageUrl || val
                          }));
                          input.value = '';
                        }
                      }}
                      className="px-6 py-3.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#B8860B] transition-all"
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>

              <div className="px-10 py-8 bg-slate-50/50 flex gap-4 shrink-0">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-8 py-4 border border-slate-100 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-white transition-all">Annuler</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-8 py-4 bg-[#B8860B] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#B8860B]/20 hover:bg-slate-900 transition-all">
                  {isSubmitting ? 'Sauvegarde...' : (editingProduct ? 'Mettre à jour' : 'Ajouter')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center bg-white"><Loader2 className="w-10 h-10 text-[#B8860B] animate-spin" /></div>}>
      <ProductsContent />
    </Suspense>
  );
}
