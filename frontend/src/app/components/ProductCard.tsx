'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { type Product } from '../lib/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductRating from './ProductRating';
import { motion } from 'framer-motion';

interface ProductCardProps {
    product: Product;
    viewMode?: 'grid' | 'list';
}

export default function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
    const { addItem } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

    const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
    const isNew = new Date(product.createdAt).getTime() > new Date().getTime() - (30 * 24 * 60 * 60 * 1000);

    if (viewMode === 'list') {
        return (
            <div className="group bg-white rounded-[24px] overflow-hidden border border-slate-50 transition-all duration-300 hover:shadow-xl flex gap-6 p-4">
                <div className="relative w-48 aspect-square overflow-hidden rounded-2xl bg-slate-50 shrink-0">
                    <Image
                        src={product.imageUrl || '/placeholder.png'}
                        alt={product.name}
                        fill
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
                                <h3 className="text-lg font-black text-slate-900 hover:text-[#B8860B] transition-colors line-clamp-1 mb-1">
                                    {product.name}
                                </h3>
                            </Link>
                            <ProductRating productId={product.id} starSize={12} className="!gap-1" />
                        </div>
                        <button 
                            onClick={() => toggleWishlist(product)}
                            className={`p-2 rounded-full transition-all ${isInWishlist(product.id) ? 'text-[#B8860B]' : 'text-slate-300 hover:text-[#B8860B]'}`}
                        >
                            <Heart size={20} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
                        </button>
                    </div>
                    <p className="text-slate-500 text-sm line-clamp-2 mb-4 font-medium">{product.description || 'Un luminaire d\'exception pour sublimer votre intérieur.'}</p>
                    <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-baseline gap-3">
                            <span className="text-xl font-black text-slate-900">{product.price.toLocaleString()} MAD</span>
                            {product.oldPrice && (
                                <span className="text-xs text-slate-400 line-through font-bold">{product.oldPrice.toLocaleString()} MAD</span>
                            )}
                        </div>
                        <button 
                            onClick={() => addItem(product)}
                            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#B8860B] transition-all"
                        >
                            <ShoppingCart size={14} /> Ajouter
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="group bg-white rounded-[32px] overflow-hidden border border-slate-50 transition-all duration-500 hover:shadow-2xl flex flex-col h-full">
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-slate-50 p-4">
                <div className="relative w-full h-full overflow-hidden rounded-2xl">
                    <Image
                        src={product.imageUrl || '/placeholder.png'}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                </div>
                
                {/* Badges */}
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                    {discount > 0 && (
                        <span className="bg-[#B8860B] text-white text-[9px] font-black px-2.5 py-1.5 rounded-lg uppercase tracking-widest shadow-xl">
                            -{discount}%
                        </span>
                    )}
                    {isNew && !discount && (
                        <span className="bg-slate-900 text-white text-[9px] font-black px-2.5 py-1.5 rounded-lg uppercase tracking-widest shadow-xl">
                            Nouveau
                        </span>
                    )}
                </div>

                {/* Hover Actions */}
                <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <button 
                        onClick={() => toggleWishlist(product)}
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all translate-y-4 group-hover:translate-y-0 duration-300 shadow-xl ${isInWishlist(product.id) ? 'bg-[#B8860B] text-white' : 'bg-white text-slate-900 hover:bg-[#B8860B] hover:text-white'}`}
                    >
                        <Heart size={20} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
                    </button>
                    <Link 
                        href={`/products/${product.id}`}
                        className="w-11 h-11 bg-white text-slate-900 rounded-2xl flex items-center justify-center hover:bg-[#B8860B] hover:text-white transition-all translate-y-4 group-hover:translate-y-0 duration-300 delay-75 shadow-xl"
                    >
                        <Eye size={20} />
                    </Link>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-1">
                <Link href={`/products/${product.id}`}>
                    <h3 className="text-[15px] font-black text-slate-900 hover:text-[#B8860B] transition-colors truncate mb-1 uppercase tracking-tight">
                        {product.name}
                    </h3>
                </Link>
                
                <div className="mb-4">
                    <ProductRating productId={product.id} starSize={12} className="!gap-1" />
                </div>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex flex-col">
                        <span className="text-lg font-black text-slate-900 tracking-tighter">
                            {product.price.toLocaleString()} <span className="text-[10px] uppercase ml-0.5">MAD</span>
                        </span>
                        {product.oldPrice && (
                            <span className="text-[11px] text-slate-400 line-through font-bold">
                                {product.oldPrice.toLocaleString()} MAD
                            </span>
                        )}
                    </div>
                    
                    <button 
                        onClick={() => addItem(product)}
                        className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-[#B8860B] hover:text-white hover:shadow-xl hover:shadow-[#B8860B]/20 transition-all group/btn"
                        title="Ajouter au panier"
                    >
                        <ShoppingCart size={20} className="transition-transform group-hover/btn:scale-110" />
                    </button>
                </div>
            </div>
        </div>
    );
}
