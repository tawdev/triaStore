'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api, type Product } from '@/app/lib/api';
import { useWishlist } from '@/app/context/WishlistContext';
import { useCart } from '@/app/context/CartContext';
import { useNotification } from '@/app/context/NotificationContext';
import { X, Share2, ShoppingBag, Heart, Sparkles, ArrowRight, Star, Box } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WishlistPage() {
    const { wishlistIds, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();
    const { showToast } = useNotification();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const res = await api.getProducts({ page: 1, limit: 200 });
                const wishlisted = res.data.filter((p) => wishlistIds.includes(p.id));
                setProducts(wishlisted);

                const viewedIds = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
                const viewedProducts = viewedIds
                    .map((id: number) => res.data.find(p => p.id === id))
                    .filter(Boolean)
                    .slice(0, 12) as Product[];
                setRecentlyViewed(viewedProducts);
            } catch (err) {
                console.error('Failed to fetch wishlist products:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [wishlistIds]);

    const handleShareList = async () => {
        if (products.length === 0) {
            showToast('Votre curation est vide', 'error');
            return;
        }
        const text = `Découvrez ma curation de luminaires sur Tria Lampe :\n` +
            products.map(p => `- ${p.name.toUpperCase()}`).join('\n') + `\n\nExplorez l'excellence sur : ${typeof window !== 'undefined' ? window.location.origin : ''}`;
            
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Ma Sélection Tria Lampe',
                    text: text,
                });
            } catch (err) {
                console.error('Share failed:', err);
            }
        } else {
            navigator.clipboard.writeText(text);
            showToast('Lien de curation copié !', 'success');
        }
    };

    const handleAddAllToCart = () => {
        if (products.length === 0) return;
        let addedCount = 0;
        products.forEach(product => {
            if (product.stock > 0) {
                addToCart({
                    productId: Number(product.id),
                    name: product.name,
                    price: product.price,
                    imageUrl: product.imageUrl
                }, 1);
                addedCount++;
            }
        });
        if (addedCount > 0) {
            showToast(`${addedCount} pièce(s) ajoutée(s) au panier !`, 'success');
        } else {
            showToast('Aucune pièce disponible pour le moment.', 'error');
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-white py-24">
            <div className="mx-auto max-w-[1400px] px-6">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20 border-b border-slate-50 pb-12">
                    <div className="space-y-4">
                        <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-[#B8860B] mb-4">
                            <Link href="/">Accueil</Link>
                            <div className="size-1 rounded-full bg-slate-200" />
                            <span className="text-slate-400 font-bold tracking-widest uppercase">Ma Curation</span>
                        </nav>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                            Sélection <span className="text-[#B8860B]">Privée</span>
                        </h1>
                        <p className="text-xl text-slate-400 font-medium max-w-xl">
                            Conservez vos pièces favorites et composez l'atmosphère de votre prochain projet.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={handleShareList} 
                            className="flex items-center gap-4 px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                        >
                            <Share2 size={16} />
                            Partager
                        </button>
                        <button 
                            onClick={handleAddAllToCart} 
                            className="flex items-center gap-4 px-8 py-5 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#B8860B] transition-all shadow-2xl shadow-slate-900/20"
                        >
                            <ShoppingBag size={16} />
                            Réserver Tout
                        </button>
                    </div>
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-12">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="space-y-6">
                                <div className="aspect-[0.8] w-full bg-slate-50 rounded-[40px] animate-pulse" />
                                <div className="space-y-2 px-4">
                                    <div className="h-6 w-3/4 bg-slate-50 rounded-lg animate-pulse" />
                                    <div className="h-4 w-1/2 bg-slate-50 rounded-lg animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-40 text-center"
                    >
                        <div className="size-32 rounded-[50px] bg-slate-50 flex items-center justify-center mb-10">
                            <Heart size={48} className="text-slate-200" />
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-4">Curation Vierge</h3>
                        <p className="text-slate-400 font-medium mb-12 max-w-sm leading-relaxed">
                            Votre sélection privée ne contient aucune pièce pour le moment. Laissez-vous inspirer par nos dernières collections.
                        </p>
                        <Link
                            href="/products"
                            className="px-12 py-5 bg-[#B8860B] text-white font-black uppercase text-[10px] tracking-[0.3em] rounded-2xl shadow-2xl shadow-[#B8860B]/20 hover:bg-slate-900 transition-all"
                        >
                            Explorer la Galerie
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-12">
                        {products.map((product, idx) => (
                            <motion.div 
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group relative flex flex-col bg-white rounded-[40px] border border-slate-50 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 transition-all p-4"
                            >
                                {/* Remove Button */}
                                <button
                                    onClick={() => removeFromWishlist(product.id)}
                                    className="absolute top-6 right-6 z-20 size-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-slate-400 border border-slate-100 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm"
                                >
                                    <X size={16} />
                                </button>

                                {/* Image Wrapper */}
                                <Link href={`/products/${product.id}`} className="relative aspect-[0.9] w-full overflow-hidden rounded-[30px] bg-slate-50 mb-6 flex items-center justify-center">
                                    {product.imageUrl ? (
                                        <Image
                                            fill
                                            className="object-contain p-6 transition-transform duration-700 group-hover:scale-110"
                                            src={product.imageUrl}
                                            alt={product.name}
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-slate-200">
                                            <ShoppingBag size={48} className="opacity-10" />
                                        </div>
                                    )}
                                </Link>

                                {/* Product Info */}
                                <div className="flex flex-1 flex-col px-4 pb-4">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="h-[2px] w-4 bg-[#B8860B]" />
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#B8860B]">Signature</span>
                                    </div>
                                    <Link href={`/products/${product.id}`}>
                                        <h3 className="text-lg font-black text-slate-900 leading-none line-clamp-2 mb-4 uppercase tracking-tight group-hover:text-[#B8860B] transition-colors">
                                            {product.name}
                                        </h3>
                                    </Link>

                                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                                        <div className="flex flex-col">
                                            <span className="text-xl font-black text-slate-900 tracking-tighter">
                                                {api.formatPrice(product.price)} <span className="text-[10px]">MAD</span>
                                            </span>
                                        </div>

                                        <button 
                                            onClick={() => {
                                                addToCart({
                                                    productId: Number(product.id),
                                                    name: product.name,
                                                    price: product.price,
                                                    imageUrl: product.imageUrl
                                                });
                                                showToast(`${product.name} ajouté à votre curation !`, 'success');
                                            }}
                                            className="size-12 flex items-center justify-center rounded-2xl bg-slate-900 text-white hover:bg-[#B8860B] transition-all shadow-xl shadow-slate-900/10" 
                                        >
                                            <ShoppingBag size={20} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Recently Viewed */}
                {recentlyViewed.length > 0 && (
                    <div className="mt-40">
                        <div className="border-t border-slate-50 pt-24">
                            <div className="flex items-center gap-6 mb-16">
                                <Sparkles className="size-6 text-[#B8860B] opacity-30" />
                                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Galerie de <span className="text-[#B8860B]">Curation</span></h2>
                            </div>
                            <div className="flex gap-10 overflow-x-auto pb-10 -mx-6 px-6 no-scrollbar">
                                {recentlyViewed.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/products/${product.id}`}
                                        className="shrink-0 w-[240px] group"
                                    >
                                        <div className="aspect-[0.9] w-full rounded-[40px] overflow-hidden bg-slate-50 border border-slate-50 mb-6 shadow-sm transition-all group-hover:shadow-2xl group-hover:shadow-slate-200/50 group-hover:-translate-y-2 relative">
                                            {product.imageUrl ? (
                                                <Image
                                                    fill
                                                    className="object-contain p-6 transition-transform duration-700 group-hover:scale-110"
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-slate-100">
                                                    <Box size={40} className="opacity-20" />
                                                </div>
                                            )}
                                        </div>
                                        <h4 className="text-[13px] font-black text-slate-900 leading-tight line-clamp-2 mb-2 group-hover:text-[#B8860B] transition-colors h-[32px] uppercase tracking-tight">
                                            {product.name}
                                        </h4>
                                        <span className="text-lg font-black text-[#B8860B] tracking-tighter">
                                            {api.formatPrice(product.price)} <span className="text-[10px]">MAD</span>
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
