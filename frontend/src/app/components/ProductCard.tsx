'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { type Product, api } from '../lib/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductRating from './ProductRating';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ProductCardProps {
    product: Product;
    viewMode?: 'grid' | 'list';
}

export default function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

    const [isNew, setIsNew] = useState(false);
    const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;

    useEffect(() => {
        const newlyAdded = new Date(product.createdAt).getTime() > new Date().getTime() - (30 * 24 * 60 * 60 * 1000);
        setIsNew(newlyAdded);
    }, [product.createdAt]);

    if (viewMode === 'list') {
        return (
            <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
        >
            <div className="group bg-white rounded-[24px] overflow-hidden border border-slate-50 transition-all duration-300 hover:shadow-xl flex gap-6 p-4">

                <div className="relative w-48 aspect-square overflow-hidden rounded-2xl bg-white shrink-0">
                    <Image
                        src={product.imageUrl || '/placeholder.png'}
                        alt={product.name}
                        fill
                        quality={100}
                        sizes="200px"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {discount > 0 && (
                        <div className="absolute top-3 left-3 bg-[#B8860B] text-white text-[9px] font-black px-2 py-1 rounded uppercase tracking-widest shadow-lg">
                            -{discount}%
                        </div>
                    )}
                </div>
                <div className="flex-1 flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <Link href={`/products/${product.id}`}>
                                <h3 className="text-lg font-black text-slate-900 hover:text-[#B8860B] transition-colors line-clamp-2 mb-1">
                                    {product.name}
                                </h3>
                            </Link>
                            <Link href={`/products/${product.id}#avis`} className="block hover:opacity-80 transition-opacity">
                                <ProductRating productId={product.id} starSize={12} className="!gap-1" />
                            </Link>
                        </div>
                        <motion.button 
                            whileTap={{ scale: 0.8 }}
                            onClick={() => toggleWishlist(product.id)}
                            className={`p-2.5 rounded-2xl transition-all duration-500 ${isInWishlist(product.id) ? 'bg-[#B8860B] text-white shadow-xl shadow-[#B8860B]/20' : 'bg-slate-50 text-slate-300 hover:text-[#B8860B] hover:bg-white'}`}
                        >
                            <Heart size={18} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} className="transition-transform duration-500" />
                        </motion.button>
                    </div>
                    <p className="text-slate-500 text-sm line-clamp-2 mb-4 font-medium">{product.description || 'Un luminaire d\'exception pour sublimer votre intérieur.'}</p>
                    <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-baseline gap-3">
                            <span className="text-xl font-black text-slate-900">{api.formatPrice(product.price)} MAD</span>
                            {product.oldPrice && (
                                <span className="text-xs text-slate-400 line-through font-bold">{api.formatPrice(product.oldPrice)} MAD</span>
                            )}
                        </div>
                        <motion.button 
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => addToCart({ 
                                productId: product.id, 
                                name: product.name, 
                                price: product.price, 
                                imageUrl: product.imageUrl 
                            })}
                            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#B8860B] transition-all"
                        >
                            <ShoppingCart size={14} /> Ajouter
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ 
                duration: 0.5, 
                ease: [0.25, 1, 0.5, 1] 
            }}
            className="h-full w-full"
        >
            <div className="group bg-white rounded-[28px] overflow-hidden border border-slate-100/60 transition-all duration-700 hover:shadow-[0_30px_60px_rgba(0,0,0,0.06)] flex flex-col h-full relative">

            {/* Image Container */}
            <div className="relative aspect-[3/4] overflow-hidden bg-[#FAFAFA]">
                <div className="relative w-full h-full">
                    <Image
                        src={product.imageUrl || '/placeholder.png'}
                        alt={product.name}
                        fill
                        quality={100}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-[2s] ease-out-expo group-hover:scale-110"
                    />
                </div>
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                    {discount > 0 && (
                        <span className="bg-[#B8860B] text-white text-[7px] font-black px-2.5 py-1 rounded-full uppercase tracking-[0.2em] shadow-md">
                            -{discount}%
                        </span>
                    )}
                    {isNew && !discount && (
                        <span className="bg-slate-900 text-white text-[7px] font-black px-2.5 py-1 rounded-full uppercase tracking-[0.2em] shadow-md">
                            Nouveau
                        </span>
                    )}
                </div>

                {/* Wishlist Button */}
                <motion.button 
                    whileTap={{ scale: 0.8 }}
                    onClick={() => toggleWishlist(product.id)}
                    className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500 z-10 ${isInWishlist(product.id) ? 'bg-[#B8860B] text-white shadow-lg shadow-[#B8860B]/30' : 'bg-white/90 backdrop-blur-md text-slate-400 hover:text-[#B8860B]'}`}
                >
                    <Heart size={16} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} strokeWidth={isInWishlist(product.id) ? 0 : 2} />
                </motion.button>

                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all duration-700 backdrop-blur-[4px] flex flex-col items-center justify-center gap-4 z-20">
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <Link 
                            href={`/products/${product.id}`}
                            className="bg-white text-slate-900 px-8 py-3.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] translate-y-12 group-hover:translate-y-0 transition-all duration-700 ease-out-expo hover:bg-[#B8860B] hover:text-white shadow-2xl block"
                        >
                            Explorer l'Exception
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6 flex flex-col flex-1 items-center text-center relative z-10">
                <span className="text-[8px] font-bold text-slate-300 uppercase tracking-[0.4em] mb-2">Tria Collection</span>
                
                <Link href={`/products/${product.id}`} className="w-full">
                    <h3 className="text-[13px] font-bold text-slate-900 hover:text-[#B8860B] transition-colors line-clamp-2 mb-2 uppercase tracking-tight min-h-[32px] flex items-center justify-center">
                        {product.name}
                    </h3>
                </Link>
                
                <Link href={`/products/${product.id}#avis`} className="mb-5 block hover:opacity-80 transition-opacity">
                    <ProductRating productId={product.id} starSize={9} className="!gap-0.5 opacity-60" />
                </Link>

                <div className="mt-auto w-full flex items-center justify-between pt-5 border-t border-slate-50/80">
                    <div className="flex flex-col items-start">
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-lg font-bold text-slate-900 tracking-tighter">
                                {api.formatPrice(product.price)}
                            </span>
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">MAD</span>
                        </div>
                        {product.oldPrice && (
                            <span className="text-[9px] text-slate-300 line-through font-bold tracking-tight">
                                {api.formatPrice(product.oldPrice)} MAD
                            </span>
                        )}
                    </div>
                    
                    <motion.button 
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ scale: 1.1 }}
                        onClick={() => addToCart({ 
                            productId: product.id, 
                            name: product.name, 
                            price: product.price, 
                            imageUrl: product.imageUrl 
                        })}
                        className="w-11 h-11 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-[#B8860B] hover:text-white transition-all group/cart"
                        title="Ajouter au panier"
                    >
                        <ShoppingCart size={16} strokeWidth={2} className="group-hover/cart:scale-110 transition-transform" />
                    </motion.button>
                </div>
            </div>
        </div>
    </motion.div>
    );
}

