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
    Truck
} from 'lucide-react';
import { api, type Category } from '../lib/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useSettings } from '../context/SettingsContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { settings } = useSettings();
    const { totalItems } = useCart();
    const { count: wishlistCount } = useWishlist();
    
    const [categories, setCategories] = useState<Category[]>([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [mounted, setMounted] = useState(false);
    
    const menuRef = useRef<HTMLDivElement>(null);
    const isHome = pathname === '/';

    useEffect(() => {
        setMounted(true);
        api.getCategories(true).then(setCategories).catch(console.error);
        
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const navItems = [
        { name: 'Collections', href: '/products' },
        { name: 'La Maison', href: '/about' },
        { name: 'Journal', href: '/blog' },
        { name: 'Contact', href: '/contact' },
    ];

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!searchQuery.trim()) return;
        setIsSearchOpen(false);
        router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    };

    if (!mounted) return null;

    const storeName = settings?.storeName || 'TRIA LAMPE';

    return (
        <>
            <div className={`fixed top-0 left-0 right-0 z-[5000] transition-all duration-500 ${
                isScrolled ? '-translate-y-10' : 'translate-y-0'
            }`}>
                {/* TOP BAR */}
                <div className="bg-[#0D0D0D] py-2.5 text-white/90 font-outfit">
                    <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 sm:px-12">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                                <Truck size={14} className="text-[#B8860B]" />
                                <span className="hidden sm:inline">Livraison Prestige dès 1000 MAD</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                                <Phone size={14} className="text-[#B8860B]" />
                                <span>{settings?.phoneNumber || '+212 5 22 92 36 24'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MAIN NAV */}
                <nav 
                    className={`transition-all duration-500 font-outfit ${
                        isScrolled 
                        ? 'bg-white/90 backdrop-blur-xl py-3 border-b border-slate-100 shadow-xl shadow-slate-200/10' 
                        : isHome ? 'bg-transparent py-8 border-transparent' : 'bg-white py-6 border-b border-slate-50'
                    }`}
                >
                    <div className="mx-auto max-w-[1440px] px-6 sm:px-12 flex items-center justify-between gap-8">
                        {/* Logo */}
                        <Link href="/" className="shrink-0 group">
                            {settings?.logoUrl ? (
                                <img 
                                    src={settings.logoUrl} 
                                    alt={storeName} 
                                    className={`transition-all duration-500 object-contain ${
                                        isScrolled ? 'h-10 md:h-12' : 'h-14 md:h-20'
                                    }`}
                                />
                            ) : (
                                <div className="flex flex-col">
                                    <span className={`text-2xl font-black tracking-tighter leading-none transition-colors duration-500 ${
                                        !isScrolled && isHome ? 'text-white' : 'text-slate-900'
                                    }`}>
                                        {storeName.split(' ')[0]} <span className="text-[#B8860B]">{storeName.split(' ').slice(1).join(' ')}</span>
                                    </span>
                                    <span className={`text-[8px] font-black tracking-[0.5em] uppercase mt-1 transition-colors duration-500 ${
                                        !isScrolled && isHome ? 'text-white/60' : 'text-slate-300'
                                    }`}>L'Excellence Lumineuse</span>
                                </div>
                            )}
                        </Link>

                        {/* Navigation Links - Centered */}
                        <div className="hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all relative py-2 group ${
                                        pathname === item.href 
                                        ? 'text-[#B8860B]' 
                                        : !isScrolled && isHome ? 'text-white/80 hover:text-white' : 'text-slate-400 hover:text-slate-900'
                                    }`}
                                >
                                    {item.name}
                                    <span className={`absolute bottom-0 left-0 h-[2px] bg-[#B8860B] transition-all duration-300 ${pathname === item.href ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                                </Link>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
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
                                <div className={`size-11 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg ${
                                    !isScrolled && isHome 
                                    ? 'bg-white text-slate-900 hover:bg-[#B8860B] hover:text-white' 
                                    : 'bg-slate-900 text-white hover:bg-[#B8860B]'
                                } shadow-slate-900/10`}>
                                    <ShoppingBag size={18} />
                                </div>
                                {totalItems > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-[#B8860B] text-white text-[9px] font-black size-5 rounded-full flex items-center justify-center ring-4 ring-white">
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
                                className={`lg:hidden size-11 rounded-full flex items-center justify-center transition-all duration-500 border ${
                                    !isScrolled && isHome
                                    ? 'bg-white/10 border-white/20 text-white'
                                    : 'bg-slate-50 border-slate-100 text-slate-900'
                                }`}
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        </div>
                    </div>
                </nav>
            </div>

            {/* FULLSCREEN SEARCH */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[10000] bg-slate-900/98 backdrop-blur-3xl flex flex-col items-center justify-center p-6"
                    >
                        <button onClick={() => setIsSearchOpen(false)} className="absolute top-12 right-12 text-white/40 hover:text-white transition-colors p-4">
                            <X size={40} strokeWidth={1} />
                        </button>
                        <div className="w-full max-w-4xl text-center space-y-12">
                            <h2 className="text-white text-5xl md:text-7xl font-black tracking-tighter uppercase italic">Que cherchez-vous ?</h2>
                            <form onSubmit={handleSearch} className="relative">
                                <input autoFocus type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Un lustre, une lampe..." className="w-full bg-transparent border-b-2 border-white/10 py-10 text-4xl md:text-6xl font-black text-white outline-none placeholder:text-white/5 focus:border-[#B8860B] transition-all text-center" />
                                <button type="submit" className="mt-12 text-[10px] font-black text-[#B8860B] uppercase tracking-[0.5em] hover:text-white transition-colors">Explorer la collection <ArrowRight className="inline-block ml-4" /></button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MOBILE MENU */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }}
                        className="lg:hidden fixed inset-0 z-[10000] bg-white p-10 flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-16">
                            {settings?.logoUrl ? (
                                <img src={settings.logoUrl} alt={storeName} className="h-10 w-auto object-contain" />
                            ) : (
                                <span className="text-xl font-black tracking-tighter">{storeName.split(' ')[0]} <span className="text-[#B8860B]">{storeName.split(' ').slice(1).join(' ')}</span></span>
                            )}
                            <button onClick={() => setIsMenuOpen(false)} className="size-12 rounded-full bg-slate-50 flex items-center justify-center">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="space-y-8 overflow-y-auto pb-20">
                            {navItems.map((item) => (
                                <Link key={item.name} href={item.href} onClick={() => setIsMenuOpen(false)} className="block text-4xl font-black uppercase tracking-tighter text-slate-900 hover:text-[#B8860B] transition-colors">{item.name}</Link>
                            ))}
                            <div className="pt-12 border-t border-slate-50 space-y-6">
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Univers Tria</p>
                                {categories.map(cat => (
                                    <Link key={cat.id} href={`/products?categoryId=${cat.id}`} onClick={() => setIsMenuOpen(false)} className="block text-xl font-bold text-slate-600 hover:text-[#B8860B] transition-colors uppercase tracking-widest">{cat.name}</Link>
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
