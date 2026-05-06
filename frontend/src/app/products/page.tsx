'use client';

import { useEffect, useState, useCallback, useMemo, Suspense } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, LayoutGrid, List, Search, SlidersHorizontal, ArrowRight, Truck, ShieldCheck, RotateCcw, Star, Sparkles, Box } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api, type Product, type Category } from '@/app/lib/api';

import ProductCard from '@/app/components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Sub-Components ─────────────────────────────────────────────────────────────────

function CategoryTreeItem({
  category,
  selectedId,
  onSelect,
}: {
  category: Category;
  selectedId: number | null;
  onSelect: (id: number | null) => void;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = category.children && category.children.length > 0;
  const isSelected = selectedId === category.id;

  return (
    <div className="space-y-2">
      <button
        onClick={() => {
            onSelect(category.id);
            if (hasChildren) setIsOpen(!isOpen);
        }}
        className={`w-full flex items-center justify-between py-2 text-sm transition-all group ${isSelected ? 'text-[#B8860B] font-black' : 'text-slate-500 hover:text-slate-900 font-bold'}`}
      >
        <span className="flex items-center gap-3">
            <div className={`size-1.5 rounded-full transition-all ${isSelected ? 'bg-[#B8860B] scale-150' : 'bg-slate-200 group-hover:bg-slate-400'}`} />
            {category.name}
        </span>
        {hasChildren && <ChevronDown size={14} className={`transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} />}
      </button>

      {hasChildren && isOpen && (
        <div className="pl-6 space-y-1 border-l border-slate-100 ml-1.5">
          {category.children!.map(child => (
            <CategoryTreeItem
              key={child.id}
              category={child}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductListingContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategoryId = searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : null;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filters State
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [categoryId, setCategoryId] = useState<number | null>(initialCategoryId);
  const [sort, setSort] = useState('newest');
  const [maxPrice, setMaxPrice] = useState<number>(15000);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, categoryId, sort, maxPrice]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getProducts({
        page,
        limit,
        search: debouncedSearch || undefined,
        categoryId: categoryId || undefined,
        maxPrice: maxPrice || undefined,
        sort: sort || undefined,
        active: true,
      });
      setProducts(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages || Math.ceil(res.total / limit));

      const cachedCategories = await api.getCategories(true);
      setCategories(cachedCategories.filter(c => c.isActive));
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, categoryId, maxPrice, sort, limit]);

  useEffect(() => { loadData(); }, [loadData]);

  const categoryTree = useMemo(() => {
    const buildTree = (items: Category[], parentId: number | null = null): Category[] => {
      return items
        .filter(item => item.parentId === parentId)
        .map(item => ({
          ...item,
          children: buildTree(items, item.id)
        }));
    };
    return buildTree(categories);
  }, [categories]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section with Luxury Background */}
      <div className="relative min-h-[60vh] flex items-center overflow-hidden bg-slate-900">
        {/* Background Image with Parallax-ready styling */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=2070&auto=format&fit=crop" 
            alt="Luxury Architecture"
            className="w-full h-full object-cover opacity-60 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        </div>

        <div className="max-w-[1400px] mx-auto px-6 w-full relative z-10 py-32">
          <motion.nav 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-[#B8860B] mb-12"
          >
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <ArrowRight size={12} />
            <span className="text-slate-400">Boutique Exclusive</span>
          </motion.nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-16">
            <div className="space-y-6 max-w-2xl">
                <motion.h1 
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                  className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.9]"
                >
                    L'Atelier <br/><span className="text-[#B8860B]">Signature</span>
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="text-xl text-slate-300 font-medium leading-relaxed max-w-lg"
                >
                    Explorez notre curation de luminaires d'exception, conçus pour transformer votre architecture en une œuvre de lumière.
                </motion.p>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
              className="relative group max-w-md w-full"
            >
                <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400 size-6" />
                <input 
                    type="text" 
                    placeholder="Quelle pièce cherchez-vous ?"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full h-20 pl-20 pr-8 bg-white/10 backdrop-blur-xl border border-white/10 rounded-[32px] shadow-2xl focus:bg-white focus:ring-0 outline-none font-bold text-white focus:text-slate-900 placeholder-slate-400 transition-all text-lg"
                />
            </motion.div>
          </div>
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-6 py-32">
        <div className="flex flex-col lg:flex-row gap-20 items-start">
          
          {/* Sidebar Filters - Sticky Positioned */}
          <aside className="w-full lg:w-80 shrink-0 space-y-16 lg:sticky lg:top-32 self-start">
            
            {/* Categories */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-8 h-[2px] bg-[#B8860B]" />
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900">Collections</h3>
              </div>
              <div className="space-y-1">
                <button
                    onClick={() => setCategoryId(null)}
                    className={`w-full text-left py-3 text-sm transition-all flex items-center gap-3 ${categoryId === null ? 'text-[#B8860B] font-black' : 'text-slate-400 hover:text-slate-900 font-bold'}`}
                >
                    <div className={`size-1.5 rounded-full ${categoryId === null ? 'bg-[#B8860B] scale-150' : 'bg-slate-200'}`} />
                    Toutes les créations
                </button>
                {categoryTree.map(cat => (
                  <CategoryTreeItem key={cat.id} category={cat} selectedId={categoryId} onSelect={setCategoryId} />
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <div className="flex items-center gap-4 mb-10">
                <div className="w-8 h-[2px] bg-[#B8860B]" />
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900">Budget (MAD)</h3>
              </div>
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-300">0 MAD</span>
                    <span className="text-lg font-black text-[#B8860B]">{api.formatPrice(maxPrice)} MAD</span>
                </div>
                <input 
                    type="range" 
                    min="0" 
                    max="30000" 
                    step="500"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-[#B8860B]"
                />
              </div>
            </div>

            {/* Quality Badges */}
            <div className="p-8 bg-slate-900 rounded-[40px] text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 size-32 bg-[#B8860B] opacity-10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:opacity-30 transition-opacity" />
                <Sparkles size={32} className="text-[#B8860B] mb-6" />
                <h4 className="text-lg font-black uppercase tracking-tight mb-4">Service <br/>Sur-Mesure</h4>
                <p className="text-sm font-medium text-slate-400 leading-relaxed mb-8">
                    Chaque espace est unique. Nos designers vous accompagnent pour une mise en lumière personnalisée.
                </p>
                <Link href="/contact" className="text-[10px] font-black uppercase tracking-widest text-[#B8860B] flex items-center gap-3 hover:gap-5 transition-all">
                    Demander conseil <ArrowRight size={14} />
                </Link>
            </div>

            <button 
                onClick={() => {
                    setSearch('');
                    setCategoryId(null);
                    setMaxPrice(30000);
                }}
                className="w-full py-5 rounded-2xl bg-slate-50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all border border-slate-100"
            >
                Réinitialiser
            </button>
          </aside>

          {/* Product Grid Area */}
          <div className="flex-1">
            
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 mb-16 pb-8 border-b border-slate-50">
              <div className="flex items-center gap-4">
                  <SlidersHorizontal size={16} className="text-[#B8860B]" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                    <span className="text-slate-900">{total}</span> Pièces d'exception
                  </p>
              </div>
              
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-2xl">
                    <button 
                        onClick={() => setViewMode('grid')}
                        className={`size-10 flex items-center justify-center rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white text-[#B8860B] shadow-xl' : 'text-slate-300 hover:text-slate-600'}`}
                    >
                        <LayoutGrid size={18} />
                    </button>
                    <button 
                        onClick={() => setViewMode('list')}
                        className={`size-10 flex items-center justify-center rounded-xl transition-all ${viewMode === 'list' ? 'bg-white text-[#B8860B] shadow-xl' : 'text-slate-300 hover:text-slate-600'}`}
                    >
                        <List size={18} />
                    </button>
                </div>

                <div className="relative group">
                    <select 
                        value={sort} 
                        onChange={(e) => setSort(e.target.value)}
                        className="appearance-none bg-white border border-slate-100 rounded-2xl px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] outline-none focus:border-[#B8860B] cursor-pointer pr-12 shadow-sm hover:shadow-md transition-all"
                    >
                        <option value="newest">Les plus récents</option>
                        <option value="priceAsc">Prix croissant</option>
                        <option value="priceDesc">Prix décroissant</option>
                        <option value="rating">Excellence client</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Grid Area */}
            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-12"
                    >
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="space-y-8">
                                <div className="aspect-[0.8] bg-slate-50 rounded-[40px] animate-pulse" />
                                <div className="space-y-3 px-4">
                                    <div className="h-6 w-3/4 bg-slate-50 rounded-lg animate-pulse" />
                                    <div className="h-4 w-1/2 bg-slate-50 rounded-lg animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </motion.div>
                ) : products.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="py-40 text-center"
                    >
                        <div className="size-24 rounded-[40px] bg-slate-50 flex items-center justify-center mx-auto mb-10">
                            <Box size={40} className="text-slate-200" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">Aucune création trouvée</h3>
                        <p className="text-slate-400 font-medium">Ajustez vos critères pour explorer d'autres collections.</p>
                        <button onClick={() => { setSearch(''); setCategoryId(null); setMaxPrice(30000); }} className="mt-10 px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#B8860B] transition-all shadow-2xl shadow-slate-900/10">
                            Explorer toute la collection
                        </button>
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className={`grid gap-12 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}
                    >
                        {products.map((product, idx) => (
                            <motion.div 
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <ProductCard product={product} viewMode={viewMode} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-32 flex items-center justify-center gap-4">
                    <button 
                        onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        disabled={page === 1}
                        className="size-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-[#B8860B] disabled:opacity-30 transition-all shadow-sm"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                        <button 
                            key={i}
                            onClick={() => { setPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            className={`size-14 rounded-2xl font-black text-xs transition-all ${page === i + 1 ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/20 scale-110' : 'bg-white text-slate-400 hover:bg-slate-50 border border-slate-100'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button 
                        onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        disabled={page === totalPages}
                        className="size-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-[#B8860B] disabled:opacity-30 transition-all shadow-sm"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            )}
          </div>
        </div>
      </main>

      {/* Trust Badges */}
      <div className="bg-slate-900 py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 size-96 bg-[#B8860B] opacity-5 rounded-full -mr-48 -mt-48 blur-[100px]" />
        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 relative z-10">
            {[
                { icon: Truck, label: 'Livraison Prestige', sub: 'Assurée par nos experts' },
                { icon: ShieldCheck, label: 'Garantie 5 Ans', sub: 'Excellence certifiée' },
                { icon: RotateCcw, label: 'Service Conciergerie', sub: 'À votre entière écoute' },
                { icon: Star, label: 'Pièces d\'Artisanat', sub: 'Laiton & Matériaux nobles' },
            ].map(item => (
                <div key={item.label} className="flex flex-col items-center text-center gap-6 group">
                    <div className="size-16 bg-white/5 rounded-[24px] flex items-center justify-center text-[#B8860B] border border-white/5 transition-all group-hover:bg-[#B8860B] group-hover:text-white">
                        <item.icon size={28} />
                    </div>
                    <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white mb-2">{item.label}</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.sub}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default function ProductListingPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-white"><div className="size-12 border-2 border-slate-100 border-t-[#B8860B] rounded-full animate-spin"></div></div>}>
      <ProductListingContent />
    </Suspense>
  );
}


