'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { 
    Menu, 
    ChevronDown, 
    Search, 
    ShoppingBag, 
    Heart, 
    User, 
    X, 
    ArrowRight,
    Sparkles,
    Phone,
    Truck,
    Package
} from 'lucide-react';
import { api, type Category, type Product } from '../lib/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useSettings } from '../context/SettingsContext';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { normalizeImageUrl } from '../lib/api';

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { settings } = useSettings();
    const { totalItems } = useCart();
    const { count: wishlistCount } = useWishlist();
    
    const [categories, setCategories] = useState<Category[]>([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [mounted, setMounted] = useState(false);
    const [searchResults, setSearchResults] = useState<{ categories: Category[]; products: Product[] }>({ categories: [], products: [] });
    const [searchLoading, setSearchLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    
    const menuRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const isHome = pathname === '/';

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        setMounted(true);
        api.getCategories(true).then(setCategories).catch(console.error);
        
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
        setIsMobileMenuOpen(false);
        setIsSearchOpen(false);
    }, [pathname]);

    // Live search with debounce
    useEffect(() => {
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        if (!searchQuery.trim()) {
            setSearchResults({ categories: [], products: [] });
            return;
        }
        setSearchLoading(true);
        searchTimeout.current = setTimeout(async () => {
            try {
                const q = searchQuery.toLowerCase();
                const [productsRes] = await Promise.all([
                    api.getProducts({ search: searchQuery, limit: 5 }),
                ]);
                const matchedCats = categories.filter(c => c.name.toLowerCase().includes(q)).slice(0, 3);
                setSearchResults({ categories: matchedCats, products: productsRes.data });
            } catch {
                setSearchResults({ categories: [], products: [] });
            } finally {
                setSearchLoading(false);
            }
        }, 300);
    }, [searchQuery, categories]);

    const highlightText = (text: string, query: string) => {
        if (!query.trim()) return <span>{text}</span>;
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        const parts = text.split(regex);
        return (
            <span>
                {parts.map((part, i) =>
                    regex.test(part) ? <span key={i} className="text-[#B8860B] font-black">{part}</span> : part
                )}
            </span>
        );
    };

    const navItems = [
        { name: 'Collections', href: '/products' },
        { name: 'Inspiration', href: '/inspiration' },
        { name: 'La Maison', href: '/about' },
        { name: 'Journal', href: '/blog' },
        { name: 'Contact', href: '/contact' },
        { name: 'Suivi', href: '/track' },
    ];

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!searchQuery.trim()) return;
        const params = new URLSearchParams({ search: searchQuery.trim() });
        if (selectedCategory !== 'all') params.set('categoryId', selectedCategory);
        setIsSearchOpen(false);
        setSearchQuery('');
        router.push(`/products?${params.toString()}`);
    };

    const { scrollY: windowScrollY } = useScroll();
    const logoScale = useTransform(windowScrollY, [0, 100], [1, isMobile ? 0.9 : 0.95]);
    const logoHeight = useTransform(windowScrollY, [0, 100], [isMobile ? 56 : 90, isMobile ? 40 : 64]); 
    
    if (!mounted) return null;

    const storeName = settings?.storeName || 'TRIA LAMPE';

    return (
        <>
            <motion.div 
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: isScrolled ? -40 : 0, opacity: 1 }}
                transition={{ 
                    type: "spring", 
                    stiffness: 100, 
                    damping: 20,
                    duration: 0.8 
                }}
                className="fixed top-0 left-0 right-0 z-[5000]"
            >

                {/* TOP BAR */}
                <div className="bg-[#0D0D0D] py-2.5 text-white/90 font-outfit border-b border-white/5">
                    <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 sm:px-12">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="flex items-center gap-6"
                        >
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                                <Truck size={14} className="text-[#B8860B]" />
                                <span className="hidden sm:inline">Livraison Prestige dès 1000 MAD</span>
                            </div>
                        </motion.div>
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="flex items-center gap-6"
                        >
                            <Link href="/track" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest hover:text-[#B8860B] transition-colors">
                                <Package size={14} className="text-[#B8860B]" />
                                <span className="hidden sm:inline">Suivi de Commande</span>
                            </Link>
                            <div className="w-px h-4 bg-white/10" />
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                                <Phone size={14} className="text-[#B8860B]" />
                                <span>{settings?.phoneNumber || '+212 5 22 92 36 24'}</span>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* MAIN NAV */}
                <nav 
                    className={`transition-all duration-500 font-outfit ${
                        isScrolled 
                        ? 'bg-white/90 backdrop-blur-xl py-3 md:py-5 border-b border-slate-100 shadow-xl shadow-slate-200/10' 
                        : isHome ? 'bg-transparent py-6 md:py-10 border-transparent' : 'bg-white py-4 md:py-8 border-b border-slate-50'
                    }`}
                >
                    <div className="mx-auto max-w-[1440px] px-4 sm:px-12 flex items-center justify-between gap-2 md:gap-8">
                        <motion.div
                            style={{ scale: logoScale }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.6, type: "spring" }}
                        >
                            <Link href="/" className="shrink-0 group block origin-left">
                                {settings?.logoUrl ? (
                                    <motion.img 
                                        src={settings.logoUrl} 
                                        alt={storeName} 
                                        style={{ height: logoHeight, width: 'auto' }}
                                        className="object-contain"
                                    />
                                ) : (
                                    <div className="flex flex-col">
                                        <motion.span 
                                            style={{ scale: logoScale }}
                                            className={`text-2xl md:text-3xl font-black tracking-tighter leading-none transition-all duration-500 block origin-left ${
                                                !isScrolled && isHome ? 'text-white' : 'text-slate-900'
                                            }`}
                                        >
                                            {storeName.split(' ')[0]} <span className="text-[#B8860B]">{storeName.split(' ').slice(1).join(' ')}</span>
                                        </motion.span>
                                        <span className={`text-[8px] font-black tracking-[0.5em] uppercase mt-1 transition-colors duration-500 ${
                                            !isScrolled && isHome ? 'text-white/60' : 'text-slate-300'
                                        }`}>L'Excellence Lumineuse</span>
                                    </div>
                                )}
                            </Link>
                        </motion.div>

                        {/* Navigation Links - Centered */}
                        <div className="hidden lg:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
                            {navItems.map((item, i) => (
                                <motion.div
                                    key={item.name}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                                >
                                    <Link
                                        href={item.href}
                                        className={`text-[11px] font-black uppercase tracking-[0.15em] transition-all relative py-2 group ${
                                            pathname === item.href 
                                            ? 'text-[#B8860B]' 
                                            : !isScrolled && isHome ? 'text-white/80 hover:text-white' : 'text-slate-400 hover:text-slate-900'
                                        }`}
                                    >
                                        {item.name}
                                        <span className={`absolute bottom-0 left-0 h-[2px] bg-[#B8860B] transition-all duration-300 ${pathname === item.href ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                            className="flex items-center gap-3 sm:gap-4 lg:gap-6"
                        >
                            <button 
                                onClick={() => setIsSearchOpen(true)}
                                className={`p-2 transition-all duration-500 hover:scale-110 ${
                                    !isScrolled && isHome ? 'text-white/80 hover:text-white' : 'text-slate-400 hover:text-slate-900'
                                }`}
                            >
                                <Search size={22} strokeWidth={1.5} />
                            </button>

                            <Link href="/wishlist" className={`hidden sm:flex items-center gap-1 relative group transition-all duration-500 ${
                                !isScrolled && isHome ? 'text-white/80 hover:text-white' : 'text-slate-400 hover:text-slate-900'
                            }`}>
                                <Heart size={22} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-[#B8860B] text-white text-[9px] font-black size-4 rounded-full flex items-center justify-center ring-2 ring-white">
                                        {wishlistCount}
                                    </span>
                                )}
                            </Link>

                            <Link href="/cart" className="relative group">
                                <div className={`size-10 md:size-11 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg ${
                                    !isScrolled && isHome 
                                    ? 'bg-white text-slate-900 hover:bg-[#B8860B] hover:text-white' 
                                    : 'bg-slate-900 text-white hover:bg-[#B8860B]'
                                } shadow-slate-900/10`}>
                                    <ShoppingBag size={isMobile ? 16 : 18} />
                                </div>
                                {totalItems > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-[#B8860B] text-white text-[9px] font-black size-4 md:size-5 rounded-full flex items-center justify-center ring-2 md:ring-4 ring-white">
                                        {totalItems}
                                    </span>
                                )}
                            </Link>

                            {/* Catalog Menu (Desktop) */}
                            <div className="hidden lg:block relative" ref={menuRef}>
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className={`flex items-center gap-4 px-6 h-11 rounded-full transition-all border duration-500 ${
                                        !isScrolled && isHome
                                        ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                                        : 'bg-slate-50 border-slate-100 text-slate-900 hover:bg-slate-100'
                                    }`}
                                >
                                    <span className="text-[10px] font-black uppercase tracking-widest">Le Catalogue</span>
                                    <ChevronDown size={14} className={`transition-transform duration-500 ${isMenuOpen ? 'rotate-180 text-[#B8860B]' : 'opacity-40'}`} />
                                </button>

                                <AnimatePresence>
                                    {isMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute top-full right-0 mt-4 w-72 bg-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] border border-slate-100 py-6 z-[5001] rounded-[30px] overflow-hidden"
                                        >
                                            <div className="px-8 mb-4 flex items-center gap-2">
                                                <Sparkles size={12} className="text-[#B8860B]" />
                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Univers Tria</p>
                                            </div>
                                            {categories.map((cat) => (
                                                <Link
                                                    key={cat.id}
                                                    href={`/products?categoryId=${cat.id}`}
                                                    onClick={() => setIsMenuOpen(false)}
                                                    className="flex items-center justify-between px-8 py-3.5 text-[11px] font-black text-slate-700 hover:text-[#B8860B] hover:bg-slate-50 transition-all uppercase tracking-widest group"
                                                >
                                                    {cat.name}
                                                    <ArrowRight size={12} className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                                </Link>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Mobile Toggle */}
                            <button 
                                className={`lg:hidden size-9 md:size-11 rounded-full flex items-center justify-center transition-all duration-500 border ${
                                    !isScrolled && isHome
                                    ? 'bg-white/10 border-white/20 text-white'
                                    : 'bg-slate-50 border-slate-100 text-slate-900'
                                }`}
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                            </button>
                        </motion.div>
                    </div>
                </nav>
            </motion.div>

            {/* SMART SEARCH MODAL */}
            <AnimatePresence>
                {isSearchOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                            className="fixed inset-0 z-[9999] bg-slate-900/70 backdrop-blur-sm"
                        />

                        {/* Search Card */}
                        <motion.div
                            initial={{ opacity: 0, y: -30, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.97 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="fixed top-[80px] left-1/2 -translate-x-1/2 z-[10000] w-full max-w-[720px] px-4"
                            ref={searchRef}
                        >
                            <div className="bg-white rounded-[28px] shadow-[0_40px_80px_-12px_rgba(0,0,0,0.3)] overflow-hidden">
                                {/* Input Row */}
                                <form onSubmit={handleSearch} className="flex items-center gap-0">
                                    <div className="flex-1 flex items-center gap-3 px-6 py-4">
                                        <Search size={18} className="text-slate-300 shrink-0" />
                                        <input
                                            ref={searchInputRef}
                                            autoFocus
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Rechercher un luminaire, un lustre..."
                                            className="flex-1 text-base font-medium text-slate-800 outline-none placeholder:text-slate-300 bg-transparent"
                                        />
                                        {searchQuery && (
                                            <button type="button" onClick={() => setSearchQuery('')} className="size-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors">
                                                <X size={12} />
                                            </button>
                                        )}
                                    </div>

                                    {/* Divider */}
                                    <div className="w-px h-8 bg-slate-100 shrink-0" />

                                    {/* Category Filter */}
                                    <div className="relative px-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors whitespace-nowrap"
                                        >
                                            <span>{selectedCategory === 'all' ? 'Toutes Les Catégories' : categories.find(c => c.id.toString() === selectedCategory)?.name || 'Catégorie'}</span>
                                            <ChevronDown size={13} className={`transition-transform ${showCategoryDropdown ? 'rotate-180 text-[#B8860B]' : ''}`} />
                                        </button>
                                        <AnimatePresence>
                                            {showCategoryDropdown && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 8 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 8 }}
                                                    className="absolute top-full right-0 mt-3 bg-white border border-slate-100 rounded-2xl shadow-2xl py-2 z-10 min-w-[200px]"
                                                >
                                                    <button type="button" onClick={() => { setSelectedCategory('all'); setShowCategoryDropdown(false); }} className={`w-full text-left px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors ${selectedCategory === 'all' ? 'text-[#B8860B]' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>
                                                        Toutes Les Catégories
                                                    </button>
                                                    {categories.map(c => (
                                                        <button type="button" key={c.id} onClick={() => { setSelectedCategory(c.id.toString()); setShowCategoryDropdown(false); }} className={`w-full text-left px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors ${selectedCategory === c.id.toString() ? 'text-[#B8860B]' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>
                                                            {c.name}
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Search Button */}
                                    <button type="submit" className="m-3 size-10 rounded-xl bg-[#B8860B] text-white flex items-center justify-center hover:bg-[#9a7009] transition-colors shadow-md shrink-0">
                                        <Search size={16} />
                                    </button>
                                </form>

                                {/* Results */}
                                <AnimatePresence>
                                    {searchQuery.trim() && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="border-t border-slate-50 max-h-[55vh] overflow-y-auto"
                                        >
                                            {searchLoading ? (
                                                <div className="p-6 text-center text-xs font-bold text-slate-300 uppercase tracking-widest">Recherche en cours...</div>
                                            ) : (
                                                <>
                                                    {/* Category Suggestions */}
                                                    {searchResults.categories.length > 0 && (
                                                        <div className="px-6 pt-5 pb-3">
                                                            <div className="flex items-center gap-3 mb-3">
                                                                <div className="w-1 h-4 bg-[#B8860B] rounded-full" />
                                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Suggestions de Catégories</p>
                                                            </div>
                                                            {searchResults.categories.map(cat => (
                                                                <button key={cat.id} type="button" onClick={() => { router.push(`/products?categoryId=${cat.id}`); setIsSearchOpen(false); setSearchQuery(''); }} className="block w-full text-left px-3 py-2.5 text-sm font-bold text-slate-600 hover:text-[#B8860B] transition-colors rounded-xl hover:bg-slate-50">
                                                                    {highlightText(cat.name, searchQuery)}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Product Suggestions */}
                                                    {searchResults.products.length > 0 && (
                                                        <div className={`px-6 pt-3 pb-5 ${searchResults.categories.length > 0 ? 'border-t border-slate-50' : ''}`}>
                                                            <div className="flex items-center gap-3 mb-3">
                                                                <div className="w-1 h-4 bg-[#B8860B] rounded-full" />
                                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Suggestions de Produits</p>
                                                            </div>
                                                            <div className="space-y-1">
                                                                {searchResults.products.map(product => (
                                                                    <button key={product.id} type="button" onClick={() => { router.push(`/products/${product.id}`); setIsSearchOpen(false); setSearchQuery(''); }} className="flex items-center gap-4 w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group">
                                                                        <div className="size-12 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
                                                                            {product.imageUrl ? (
                                                                                <img src={normalizeImageUrl(product.imageUrl) || ''} alt={product.name} className="w-full h-full object-cover" />
                                                                            ) : (
                                                                                <div className="w-full h-full flex items-center justify-center text-slate-200"><Sparkles size={16} /></div>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <p className="text-sm font-bold text-slate-800 line-clamp-2">{highlightText(product.name, searchQuery)}</p>
                                                                            <p className="text-xs font-black text-[#B8860B] mt-0.5">{api.formatPrice(product.price)} MAD</p>
                                                                        </div>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {searchResults.categories.length === 0 && searchResults.products.length === 0 && !searchLoading && (
                                                        <div className="p-8 text-center text-xs font-bold text-slate-300 uppercase tracking-widest">Aucun résultat pour "{searchQuery}"</div>
                                                    )}
                                                </>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
            {/* MOBILE MENU */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="lg:hidden fixed inset-0 z-[11000] bg-white p-10 flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-16">
                            {settings?.logoUrl ? (
                                <img src={settings.logoUrl} alt={storeName} className="h-10 w-auto object-contain" />
                            ) : (
                                <span className="text-xl font-black tracking-tighter">{storeName.split(' ')[0]} <span className="text-[#B8860B]">{storeName.split(' ').slice(1).join(' ')}</span></span>
                            )}
                            <button onClick={() => setIsMobileMenuOpen(false)} className="size-12 rounded-full bg-slate-50 flex items-center justify-center">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="relative z-[11001] space-y-4 overflow-y-auto pb-20 no-scrollbar">
                            {navItems.map((item) => (
                                <Link 
                                    key={item.name} 
                                    href={item.href} 
                                    className="block py-4 text-3xl font-black uppercase tracking-tighter text-slate-900 hover:text-[#B8860B] transition-all active:scale-95 active:opacity-70 origin-left cursor-pointer pointer-events-auto"
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <div className="pt-8 border-t border-slate-50 space-y-4">
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-4">Univers Tria</p>
                                {categories.map(cat => (
                                    <Link 
                                        key={cat.id} 
                                        href={`/products?categoryId=${cat.id}`} 
                                        className="block py-3 text-lg font-bold text-slate-600 hover:text-[#B8860B] transition-all uppercase tracking-widest active:scale-95 active:opacity-70 origin-left cursor-pointer pointer-events-auto"
                                    >
                                        {cat.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className="mt-auto pt-8 border-t border-slate-50 flex justify-between items-center">
                            <div className="flex gap-6">
                                <a href={settings?.instagramUrl || '#'} target="_blank" className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Instagram</a>
                                <a href={settings?.facebookUrl || '#'} target="_blank" className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Facebook</a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
