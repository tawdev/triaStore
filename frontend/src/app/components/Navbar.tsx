'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Menu, ChevronRight, ShoppingBag, ChevronDown, Search, ArrowRight } from 'lucide-react';
import { api, type Category } from '../lib/api';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const pathname = usePathname();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { totalItems } = useCart();
    const [mounted, setMounted] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

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

    return (
        <nav 
            className={`w-full sticky top-0 z-[5000] transition-all duration-500 border-b print:hidden font-outfit ${
                isScrolled ? 'bg-white/90 backdrop-blur-xl py-3 border-slate-100 shadow-xl shadow-slate-200/20' : 'bg-white py-6 border-transparent'
            }`}
        >
            <div className="mx-auto max-w-[1440px] px-6 sm:px-12 flex items-center justify-between">
                
                {/* Logo Section */}
                <div className="flex-1 flex items-center gap-12">
                    <Link href="/" className="flex flex-col group">
                        <span className="text-2xl font-black tracking-tighter text-slate-900 leading-none group-hover:text-[#B8860B] transition-colors">
                            TRIA <span className="text-[#B8860B] group-hover:text-slate-900 transition-colors">LAMPE</span>
                        </span>
                        <span className="text-[8px] font-black tracking-[0.5em] text-slate-300 uppercase mt-1">L'Excellence Lumineuse</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-10">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`text-[11px] font-black uppercase tracking-[0.25em] transition-all relative py-2 group ${isActive ? 'text-[#B8860B]' : 'text-slate-400 hover:text-slate-900'}`}
                                >
                                    {item.name}
                                    <span className={`absolute bottom-0 left-0 h-[2px] bg-[#B8860B] transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Search & Actions */}
                <div className="flex items-center gap-8">
                    <div className="hidden md:flex items-center bg-slate-50 px-5 py-2.5 rounded-full border border-slate-100 group focus-within:border-[#B8860B] transition-all">
                        <Search size={14} className="text-slate-300 group-focus-within:text-[#B8860B]" />
                        <input 
                            type="text" 
                            placeholder="RECHERCHER..." 
                            className="bg-transparent border-none outline-none text-[10px] font-black tracking-widest text-slate-900 placeholder-slate-300 ml-3 w-40"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Cart Button */}
                        <Link href="/cart" className="relative group">
                            <div className="size-11 rounded-full bg-slate-900 flex items-center justify-center text-white group-hover:bg-[#B8860B] transition-all shadow-xl shadow-slate-900/10">
                                <ShoppingBag size={18} />
                            </div>
                            <AnimatePresence>
                                {mounted && totalItems > 0 && (
                                    <motion.span 
                                        initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                                        className="absolute -top-1 -right-1 bg-[#B8860B] text-white text-[9px] font-black size-5 rounded-full flex items-center justify-center ring-4 ring-white"
                                    >
                                        {totalItems}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <button 
                            className="lg:hidden size-11 rounded-full bg-slate-50 flex items-center justify-center text-slate-900 hover:bg-slate-100 transition-all border border-slate-100"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>

                        {/* Catalog Trigger (Desktop) */}
                        <div className="hidden lg:block relative" ref={menuRef}>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="flex items-center gap-4 bg-slate-50 hover:bg-slate-100 text-slate-900 px-6 h-11 rounded-full transition-all border border-slate-100 group"
                            >
                                <span className="text-[10px] font-black uppercase tracking-widest">Le Catalogue</span>
                                <ChevronDown size={14} className={`transition-transform duration-500 ${isMenuOpen ? 'rotate-180 text-[#B8860B]' : 'text-slate-400'}`} />
                            </button>

                            <AnimatePresence>
                                {isMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute top-full right-0 mt-4 w-72 bg-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] border border-slate-100 py-6 z-[5001] rounded-[30px] overflow-hidden"
                                    >
                                        <div className="px-8 mb-4">
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Catégories</p>
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
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }}
                        className="lg:hidden fixed inset-0 z-[6000] bg-white p-10 flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-16">
                            <span className="text-xl font-black tracking-tighter">TRIA <span className="text-[#B8860B]">LAMPE</span></span>
                            <button onClick={() => setIsMenuOpen(false)} className="size-12 rounded-full bg-slate-50 flex items-center justify-center">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="space-y-8">
                            {navItems.map((item) => (
                                <Link 
                                    key={item.name} href={item.href} 
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block text-4xl font-black uppercase tracking-tighter text-slate-900 hover:text-[#B8860B] transition-colors"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                        <div className="mt-auto space-y-6">
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Suivez-nous</p>
                            <div className="flex gap-6">
                                {['IG', 'FB', 'LI'].map(s => <span key={s} className="text-xs font-black text-slate-900">{s}</span>)}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
