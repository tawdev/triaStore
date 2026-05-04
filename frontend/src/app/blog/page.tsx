'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { api, type BlogPost } from '../lib/api';
import { Search, Grid, List as ListIcon, ChevronLeft, ChevronRight, Filter, SortAsc } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BlogHero from '../components/BlogHero';
import BlogCard from '../components/BlogCard';
import BlogTicker from '../components/BlogTicker';
import BlogListingSidebar from '../components/BlogSidebar';

export default function BlogListingPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [dynamicCategories, setDynamicCategories] = useState<string[]>(['Tous']);
  const [sortBy, setSortBy] = useState<'recent' | 'oldest'>('recent');
  const [isSortOpen, setIsSortOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await api.getUniqueCategories();
        if (categories && categories.length > 0) {
          setDynamicCategories(['Tous', ...categories]);
        }
      } catch (error) {
        console.error('Failed to fetch blog categories', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedTag, selectedCategory, sortBy]);

  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);

      const allRes = await api.getPosts(1, 500); 
      const allPublished = allRes.data.filter(p => p.status === 'Published');
      setAllPosts(allPublished);

      const paginatedRes = await api.getPosts(page, limit, debouncedSearch || undefined, selectedTag || undefined, selectedCategory, sortBy);
      const currentPublished = paginatedRes.data.filter(p => p.status === 'Published');
      setPosts(currentPublished);
      
      const filteredTotal = debouncedSearch || selectedTag || selectedCategory !== 'Tous' 
        ? allPublished.filter(p => {
            const matchesSearch = !debouncedSearch || p.title.toLowerCase().includes(debouncedSearch.toLowerCase());
            const matchesTag = !selectedTag || p.tags?.includes(selectedTag);
            const matchesCategory = selectedCategory === 'Tous' || p.category === selectedCategory;
            return matchesSearch && matchesTag && matchesCategory;
          }).length
        : allPublished.length;

      setTotal(filteredTotal);
      setTotalPages(Math.ceil(filteredTotal / limit));
    } catch (error) {
      console.error('Failed to load posts', error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, selectedTag, selectedCategory, sortBy]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <nav className="flex items-center gap-3 mt-24 justify-center pb-20">
        <button
          onClick={() => {
            setPage(p => Math.max(1, p - 1));
            window.scrollTo({ top: 400, behavior: 'smooth' });
          }}
          disabled={page === 1}
          className="size-14 flex items-center justify-center rounded-2xl border border-slate-100 bg-white hover:border-[#B8860B] hover:text-[#B8860B] transition-all disabled:opacity-30"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex items-center gap-3">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(i => (
            <button
              key={i}
              onClick={() => {
                setPage(i);
                window.scrollTo({ top: 400, behavior: 'smooth' });
              }}
              className={`size-14 flex items-center justify-center rounded-2xl text-xs font-black transition-all ${page === i
                ? 'bg-[#B8860B] text-white shadow-xl shadow-[#B8860B]/20 scale-110'
                : 'border border-slate-100 bg-white text-slate-400 hover:border-[#B8860B] hover:text-[#B8860B]'
                }`}
            >
              {i}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            setPage(p => Math.min(totalPages, p + 1));
            window.scrollTo({ top: 400, behavior: 'smooth' });
          }}
          disabled={page === totalPages}
          className="size-14 flex items-center justify-center rounded-2xl border border-slate-100 bg-white hover:border-[#B8860B] hover:text-[#B8860B] transition-all disabled:opacity-30"
        >
          <ChevronRight size={20} />
        </button>
      </nav>
    );
  };

  const recentPosts = [...allPosts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  return (
    <div className="flex-1 flex flex-col bg-white">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <BlogHero search={search} setSearch={setSearch} />
        <BlogTicker />
      </motion.div>

      {/* Sub-Navbar: Categories & Sort */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-50">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12 h-20 flex items-center justify-between">
              <div className="flex items-center gap-4 overflow-x-auto custom-scrollbar-hide">
                  {dynamicCategories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
                            selectedCategory === cat 
                            ? 'bg-slate-900 text-white shadow-xl' 
                            : 'text-slate-400 hover:text-[#B8860B]'
                        }`}
                      >
                          {cat}
                      </button>
                  ))}
              </div>

              <div className="flex items-center gap-6 shrink-0 ml-8 border-l border-slate-100 pl-8">
                  <div className="relative">
                      <button 
                        onClick={() => setIsSortOpen(!isSortOpen)}
                        className="flex items-center gap-3 px-5 py-2.5 bg-slate-50 rounded-2xl text-[10px] font-black text-slate-900 uppercase tracking-widest hover:bg-slate-100 transition-all"
                      >
                          <SortAsc size={16} className="text-[#B8860B]" />
                          {sortBy === 'recent' ? 'Plus récent' : 'Plus ancien'}
                      </button>

                      <AnimatePresence>
                        {isSortOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)} />
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute right-0 mt-4 w-48 bg-white border border-slate-50 rounded-[24px] shadow-2xl overflow-hidden z-20 py-2"
                                >
                                    {[
                                        { label: 'Plus récent', value: 'recent' },
                                        { label: 'Plus ancien', value: 'oldest' }
                                    ].map((option) => (
                                        <button
                                          key={option.value}
                                          onClick={() => {
                                              setSortBy(option.value as any);
                                              setIsSortOpen(false);
                                          }}
                                          className={`w-full text-left px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-colors ${
                                              sortBy === option.value 
                                              ? 'bg-slate-50 text-[#B8860B]' 
                                              : 'text-slate-600 hover:bg-slate-50 hover:text-[#B8860B]'
                                          }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </motion.div>
                            </>
                        )}
                      </AnimatePresence>
                  </div>
              </div>
          </div>
      </div>
      
      <main className="mx-auto w-full max-w-[1400px] px-6 lg:px-12 py-24">
        {/* Section Title & View Toggles */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-1 bg-[#B8860B]" />
              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[#B8860B]">Journal de Bord</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 leading-none uppercase tracking-tighter max-w-2xl">
              {selectedTag ? `#${selectedTag}` : (debouncedSearch ? `Inspirations "${debouncedSearch}"` : 'L\'univers Tria Lampe')}
            </h2>
            {selectedTag && (
                <button 
                  onClick={() => setSelectedTag(null)}
                  className="mt-4 flex items-center gap-3 px-6 py-3 bg-slate-50 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-100"
                >
                  Effacer le filtre
                </button>
            )}
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setViewMode('grid')}
              className={`size-16 flex items-center justify-center rounded-2xl transition-all ${viewMode === 'grid' ? 'bg-slate-900 text-white shadow-2xl scale-110' : 'bg-slate-50 text-slate-300 hover:text-slate-900'}`}
            >
              <Grid size={24} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`size-16 flex items-center justify-center rounded-2xl transition-all ${viewMode === 'list' ? 'bg-slate-900 text-white shadow-2xl scale-110' : 'bg-slate-50 text-slate-300 hover:text-slate-900'}`}
            >
              <ListIcon size={24} />
            </button>
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {[1, 2, 4].map((i) => (
                  <div key={i} className="animate-pulse space-y-8">
                    <div className="aspect-[1.3] w-full bg-slate-50 rounded-[50px]" />
                    <div className="space-y-4 px-4">
                      <div className="h-8 w-3/4 bg-slate-50 rounded-xl"></div>
                      <div className="h-16 w-full bg-slate-50 rounded-2xl"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="py-32 text-center flex flex-col items-center">
                <div className="size-32 rounded-[40px] bg-slate-50 flex items-center justify-center mb-10">
                  <Search className="text-slate-200" size={48} />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-6 uppercase tracking-tight">Aucun récit trouvé</h3>
                <p className="text-lg font-medium text-slate-400 max-w-md mx-auto leading-relaxed">
                  Notre journal ne contient pas encore d'articles correspondant à vos critères.
                </p>
                <button onClick={() => { setSearch(''); setSelectedCategory('Tous'); setSelectedTag(null); }} className="mt-12 px-10 py-5 bg-[#B8860B] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl shadow-[#B8860B]/20">
                  Explorer tout le journal
                </button>
              </div>
            ) : (
              <div className={`grid gap-12 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2' : 'grid-cols-1'}`}>
                {posts.map((post: BlogPost, idx) => (
                  <BlogCard key={post.id} post={post} priority={idx < 2} layout={viewMode} />
                ))}
              </div>
            )}

            {renderPagination()}
          </div>

          <aside className="lg:w-[400px] shrink-0">
            <div className="sticky top-32 space-y-12">
              <BlogListingSidebar 
                recentPosts={recentPosts} 
                activeTag={selectedTag}
                onTagClick={(tag: string) => setSelectedTag(tag === selectedTag ? null : tag)}
                hideTip={true}
              />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
