'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { api, type Category, type Product } from '@/app/lib/api';
import { useWishlist } from '@/app/context/WishlistContext';
import { useCart } from '@/app/context/CartContext';
import { useSettings } from '@/app/context/SettingsContext';
import { Search, Heart, ShoppingBag, User, Facebook, Instagram, Phone, Truck, Lightbulb } from 'lucide-react';

export default function Header() {
    const { settings } = useSettings();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { count: wishlistCount } = useWishlist();
    const { totalItems } = useCart();
    const [mounted, setMounted] = useState(false);
    const searchContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchQuery.length < 2) {
                setSuggestedProducts([]);
                return;
            }
            setIsLoading(true);
            try {
                const res = await api.getProducts({ search: searchQuery, limit: 5 });
                setSuggestedProducts(res.data);
            } catch (error) {
                console.error('Failed to fetch suggestions:', error);
            } finally {
                setIsLoading(false);
            }
        };
        const timer = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSearch = () => {
        if (!searchQuery.trim()) return;
        setShowSuggestions(false);
        router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    };

    return (
        <header className="w-full bg-white relative z-[5000] print:hidden font-outfit">
            {/* Top Bar */}
            <div className="bg-[#0D0D0D] py-2.5 text-white/90">
                <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 sm:px-12">
                    <div className="flex items-center gap-2 text-[11px] font-medium tracking-tight">
                        <Truck size={14} className="text-[#B8860B]" />
                        <span>Livraison gratuite à partir de 1000 MAD</span>
                    </div>
                    <div className="hidden md:flex items-center gap-2 text-[11px] font-medium">
                        <Lightbulb size={14} className="text-[#B8860B]" />
                        <span>Éclairez votre intérieur avec élégance</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-[11px] font-medium">
                            <Phone size={14} className="text-[#B8860B]" />
                            <span>Service client : +212 5 22 92 36 24</span>
                        </div>
                        <div className="flex items-center gap-3 border-l border-white/10 pl-6">
                            <a href="#" className="hover:text-[#B8860B] transition-colors"><Facebook size={14} /></a>
                            <a href="#" className="hover:text-[#B8860B] transition-colors"><Instagram size={14} /></a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="py-6 border-b border-slate-100">
                <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 sm:px-12 gap-12">
                    
                    {/* Logo */}
                    <Link href="/" className="shrink-0 flex flex-col items-start">
                        <span className="text-3xl font-black tracking-tighter text-slate-900 leading-none">
                            TRIA <span className="text-[#B8860B]">LAMPE</span>
                        </span>
                        <span className="text-[10px] font-bold tracking-[0.3em] text-slate-400 mt-1 uppercase">Lumière & Design</span>
                    </Link>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-2xl relative" ref={searchContainerRef}>
                        <div className="flex w-full items-center rounded-full bg-[#F5F5F5] border border-transparent h-[50px] group transition-all focus-within:bg-white focus-within:border-[#B8860B]/30">
                            <input
                                type="text"
                                placeholder="Rechercher une lampe, un style..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                onFocus={() => setShowSuggestions(true)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="w-full bg-transparent h-full px-8 text-sm font-medium outline-none text-slate-700 placeholder:text-slate-400"
                            />
                            <button onClick={handleSearch} className="mr-2 h-10 w-10 flex items-center justify-center text-slate-400 hover:text-[#B8860B] transition-colors">
                                <Search size={20} />
                            </button>
                        </div>
                        
                        {showSuggestions && searchQuery.length >= 2 && suggestedProducts.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[100]">
                                <div className="p-4 space-y-2">
                                    {suggestedProducts.map(p => (
                                        <button 
                                            key={p.id} 
                                            onClick={() => { router.push(`/products/${p.id}`); setShowSuggestions(false); }}
                                            className="w-full flex items-center gap-4 p-2 hover:bg-slate-50 rounded-xl transition-colors text-left"
                                        >
                                            <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                                                <img src={p.imageUrl || '/placeholder.png'} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-slate-800 truncate">{p.name}</p>
                                                <p className="text-xs text-[#B8860B] font-bold">{p.price} MAD</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Icons */}
                    <div className="flex items-center gap-8">
                        <Link href="/portal" className="flex flex-col items-center gap-1 text-slate-800 hover:text-[#B8860B] transition-all group">
                            <div className="p-1 group-hover:scale-110 transition-transform"><User size={24} strokeWidth={1.5} /></div>
                            <span className="text-[11px] font-bold uppercase tracking-wider">Compte</span>
                        </Link>
                        <Link href="/wishlist" className="flex flex-col items-center gap-1 text-slate-800 hover:text-[#B8860B] transition-all relative group">
                            <div className="p-1 group-hover:scale-110 transition-transform"><Heart size={24} strokeWidth={1.5} /></div>
                            <span className="text-[11px] font-bold uppercase tracking-wider">Favoris</span>
                            {mounted && wishlistCount > 0 && (
                                <span className="absolute top-0 right-0 bg-[#B8860B] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>
                        <Link href="/cart" className="flex flex-col items-center gap-1 text-slate-800 hover:text-[#B8860B] transition-all relative group">
                            <div className="p-1 group-hover:scale-110 transition-transform"><ShoppingBag size={24} strokeWidth={1.5} /></div>
                            <span className="text-[11px] font-bold uppercase tracking-wider">Panier</span>
                            {mounted && totalItems > 0 && (
                                <span className="absolute top-0 right-0 bg-[#B8860B] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
