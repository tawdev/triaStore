'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api, Product } from '@/app/lib/api';
import { useCompare } from '@/app/context/CompareContext';
import { useCart } from '@/app/context/CartContext';
import {
    GitCompare, X, ShoppingBag, ArrowLeft, Trash2,
    CheckCircle2, AlertCircle, Sparkles, Star,
    Plus, Box, Zap, Maximize, Palette, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ComparePage() {
    const { compareIds, removeFromCompare, clearCompare, count } = useCompare();
    const { addToCart } = useCart();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const MAX_ITEMS = 4;

    useEffect(() => {
        const fetchCompareProducts = async () => {
            if (compareIds.length === 0) {
                setProducts([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const fetchedProducts = await Promise.all(
                    compareIds.map(id => api.getProductById(id).catch(() => null))
                );
                const validProducts = fetchedProducts.filter((p): p is Product => p !== null);
                setProducts(validProducts);
            } catch (error) {
                console.error('Failed to fetch comparison products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCompareProducts();
    }, [compareIds]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-slate-50 border-t-[#B8860B] rounded-full animate-spin"></div>
                    <GitCompare className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#B8860B]" size={24} />
                </div>
                <p className="mt-8 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 animate-pulse">Orchestration de la comparaison...</p>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="max-w-[1400px] mx-auto px-6 py-40">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center text-center py-24 bg-white rounded-[60px] border border-slate-50 shadow-2xl shadow-slate-200/20"
                >
                    <div className="size-32 bg-slate-50 flex items-center justify-center rounded-[40px] mb-12 group transition-transform hover:scale-110">
                        <GitCompare size={48} className="text-slate-200 group-hover:text-[#B8860B] transition-colors" />
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 mb-6 uppercase tracking-tighter leading-none">Comparaison <span className="text-[#B8860B]">Vierge</span></h2>
                    <p className="text-slate-400 max-w-sm mb-12 font-medium leading-relaxed">
                        Votre table de comparaison est actuellement inoccupée. Sélectionnez des pièces d'exception pour les analyser côte à côte.
                    </p>
                    <Link
                        href="/products"
                        className="flex items-center gap-4 px-12 py-5 bg-slate-900 text-white font-black uppercase text-[10px] tracking-[0.3em] rounded-2xl shadow-2xl shadow-slate-900/10 hover:bg-[#B8860B] transition-all"
                    >
                        <ArrowLeft size={16} />
                        Retourner à la Galerie
                    </Link>
                </motion.div>
            </div>
        );
    }

    const slots = [...products];
    if (slots.length < MAX_ITEMS) {
        slots.push(null as any);
    }

    return (
        <div className="flex-1 flex flex-col bg-white py-24">
            <div className="max-w-[1440px] mx-auto px-6 w-full">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
                    <div className="space-y-4">
                        <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-[#B8860B] mb-6">
                            <Link href="/">Accueil</Link>
                            <div className="size-1 rounded-full bg-slate-200" />
                            <span className="text-slate-400 font-bold tracking-widest uppercase">Comparateur</span>
                        </nav>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                            L'Art de la <span className="text-[#B8860B]">Comparaison</span>
                        </h1>
                        <p className="text-xl text-slate-400 font-medium max-w-xl">
                            Analysez les nuances techniques et esthétiques de nos plus belles pièces pour un choix éclairé.
                        </p>
                    </div>
                    <button 
                        onClick={clearCompare}
                        className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 hover:text-red-500 transition-colors"
                    >
                        <Trash2 size={16} /> Réinitialiser
                    </button>
                </div>

                {/* Comparison Main Table */}
                <div className="relative mb-24">
                    <div className="overflow-x-auto pb-12 no-scrollbar">
                        <table className="w-full border-collapse min-w-[1200px]">
                            <thead>
                                <tr>
                                    {/* Characteristics Label Column */}
                                    <th className="sticky left-0 z-30 bg-white min-w-[240px] p-0 text-left align-bottom pb-12">
                                        <div className="h-full flex flex-col justify-end">
                                            <div className="size-10 rounded-2xl bg-slate-50 flex items-center justify-center text-[#B8860B] mb-6 shadow-sm">
                                                <Layers size={18} />
                                            </div>
                                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Spécifications</h3>
                                            <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.3em] mt-1">Comparatif Technique</p>
                                        </div>
                                    </th>

                                    {/* Product Cards Row */}
                                    {slots.map((product, idx) => (
                                        <th key={product ? product.id : `empty-${idx}`} className="p-4 pt-0 w-1/4 min-w-[300px] align-top">
                                            {product ? (
                                                <motion.div 
                                                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                                                    className="relative group h-full flex flex-col bg-white p-6 rounded-[40px] border border-slate-50 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.06)] transition-all duration-700"
                                                >
                                                    <button
                                                        onClick={() => removeFromCompare(product.id)}
                                                        className="absolute top-6 right-6 size-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-slate-400 border border-slate-50 hover:bg-red-500 hover:text-white transition-all shadow-sm z-20"
                                                    >
                                                        <X size={16} />
                                                    </button>

                                                    <div className="relative aspect-[0.9] w-full mb-8 bg-slate-50 rounded-[30px] overflow-hidden flex items-center justify-center">
                                                        {product.imageUrl ? (
                                                            <Image fill src={product.imageUrl} alt={product.name} className="object-contain p-6 group-hover:scale-110 transition-transform duration-700" />
                                                        ) : (
                                                            <div className="flex flex-col items-center gap-2 text-slate-100"><Box size={48} /></div>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-col flex-1 text-center px-4">
                                                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#B8860B] mb-3">Signature Tria</span>
                                                        <h4 className="text-lg font-black text-slate-900 leading-tight mb-6 uppercase tracking-tight min-h-[48px] line-clamp-2">
                                                            {product.name}
                                                        </h4>

                                                        <div className="mt-auto space-y-6">
                                                            <div className="text-2xl font-black text-slate-900 tracking-tighter">
                                                                {Number(product.price).toLocaleString()} <span className="text-[10px]">MAD</span>
                                                            </div>

                                                            <button 
                                                                onClick={() => addToCart({
                                                                    productId: Number(product.id),
                                                                    name: product.name,
                                                                    price: product.price,
                                                                    imageUrl: product.imageUrl
                                                                })}
                                                                className="w-full py-5 bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl hover:bg-[#B8860B] transition-all shadow-xl shadow-slate-900/10 active:scale-95 flex items-center justify-center gap-3"
                                                            >
                                                                <ShoppingBag size={16} />
                                                                Réserver
                                                            </button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ) : (
                                                <div className="h-full flex flex-col items-center justify-center p-12 rounded-[40px] border-2 border-dashed border-slate-50 bg-slate-50/20 hover:bg-slate-50/50 transition-all group min-h-[400px]">
                                                    <Link href="/products" className="flex flex-col items-center gap-8">
                                                        <div className="size-20 rounded-[30px] bg-white border border-slate-50 flex items-center justify-center text-slate-200 group-hover:text-[#B8860B] group-hover:scale-110 group-hover:shadow-xl transition-all duration-700">
                                                            <Plus size={32} />
                                                        </div>
                                                        <div className="space-y-2 text-center">
                                                            <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Ajouter</div>
                                                            <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">Une autre pièce</div>
                                                        </div>
                                                    </Link>
                                                </div>
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { label: 'Collection', key: 'category', icon: <Sparkles size={14} /> },
                                    { label: 'Technologie LED', key: 'tech', icon: <Zap size={14} />, value: 'Intégrée High-CRI' },
                                    { label: 'Matériaux', key: 'material', icon: <Palette size={14} />, value: 'Laiton Massif / Cristal' },
                                    { label: 'Dimensions', key: 'sku', icon: <Maximize size={14} /> },
                                    { label: 'Disponibilité', key: 'stock', icon: <Box size={14} /> }
                                ].map((row, rIdx) => (
                                    <tr key={rIdx} className="border-t border-slate-50 group hover:bg-slate-50/50 transition-colors">
                                        <td className="sticky left-0 z-20 bg-white py-10 pr-10">
                                            <div className="flex items-center gap-4">
                                                <div className="size-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-[#B8860B] transition-colors">{row.icon}</div>
                                                <span className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">{row.label}</span>
                                            </div>
                                        </td>
                                        {slots.map((product, pIdx) => (
                                            <td key={pIdx} className="py-10 px-8">
                                                {product ? (
                                                    <span className="text-[13px] font-black text-slate-500 uppercase tracking-tight">
                                                        {row.key === 'category' ? (product.category?.name || 'Exception') : 
                                                         row.key === 'stock' ? (
                                                            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest ${product.stock > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                                                                <div className={`size-1.5 rounded-full ${product.stock > 0 ? 'bg-emerald-600' : 'bg-slate-300'}`} />
                                                                {product.stock > 0 ? 'DISPONIBLE' : 'SUR COMMANDE'}
                                                            </span>
                                                         ) : 
                                                         row.key === 'sku' ? (product.sku || 'Standard') :
                                                         (row.value || 'Signature')}
                                                    </span>
                                                ) : <span className="text-slate-100">—</span>}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="bg-slate-900 rounded-[50px] p-12 text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 size-64 bg-[#B8860B] opacity-10 rounded-full blur-[80px] -mr-32 -mt-32" />
                        <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">Besoin d'un <span className="text-[#B8860B]">Expert ?</span></h3>
                        <p className="text-slate-400 font-medium mb-10 leading-relaxed">
                            Nos conseillers en éclairage architectural sont à votre disposition pour vous guider dans vos choix techniques les plus complexes.
                        </p>
                        <Link href="/contact" className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-[#B8860B] group">
                            CONTACTER LA CONCIERGERIE <ArrowRight className="group-hover:translate-x-2 transition-transform" size={16} />
                        </Link>
                    </div>

                    <div className="bg-slate-50 rounded-[50px] p-12 relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">Projets <span className="text-[#B8860B]">Sur-Mesure</span></h3>
                            <p className="text-slate-400 font-medium mb-10 leading-relaxed">
                                Pour les projets hôteliers ou résidentiels d'envergure, nous proposons des finitions personnalisées et des études photométriques.
                            </p>
                            <Link href="/about" className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 group">
                                DÉCOUVRIR NOS RÉALISATIONS <ArrowRight className="group-hover:translate-x-2 transition-transform" size={16} />
                            </Link>
                        </div>
                        <Sparkles className="absolute right-12 bottom-12 size-24 text-white opacity-50 group-hover:scale-110 group-hover:text-[#B8860B] transition-all" />
                    </div>
                </div>
            </div>
        </div>
    );
}
