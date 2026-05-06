'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Search, Package, Truck, ShoppingBag, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { api, normalizeImageUrl } from '../lib/api';
import Image from 'next/image';
import Link from 'next/link';

function TrackOrderContent() {
    const [reference, setReference] = useState('');
    const [mounted, setMounted] = useState(false);
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reference.trim()) return;

        setLoading(true);
        setError(null);
        setOrder(null);

        try {
            const data = await api.trackOrder(reference.trim());
            setOrder(data);
        } catch (err: any) {
            console.error('Tracking error:', err);
            setError('Aucune commande trouvée avec cette référence. Veuillez vérifier et réessayer.');
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-[#fafafa] py-12 md:py-24 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-100 mb-6">
                        <span className="size-1.5 rounded-full bg-[#B8860B] animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Services d&apos;Exception</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter mb-6">
                        Suivi de <span className="text-[#B8860B]">Commande</span>
                    </h1>
                    <p className="text-slate-500 font-medium max-w-lg mx-auto text-sm leading-relaxed">
                        Entrez votre numéro de commande ou votre référence pour suivre l&apos;acheminement de vos pièces de collection.
                    </p>
                </div>

                {/* Search Form */}
                <div className="bg-white rounded-[40px] shadow-[0_40px_80px_rgba(0,0,0,0.04)] p-6 md:p-12 border border-slate-100/60 mb-12 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#B8860B]/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-[#B8860B]/10 transition-colors duration-700" />

                    <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-5 relative z-10">
                        <div className="flex-1 relative">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                            <input
                                type="text"
                                placeholder="Référence (ex: TRIA-20260506-ABCD)"
                                value={reference}
                                onChange={(e) => setReference(e.target.value)}
                                className="w-full h-16 bg-slate-50/50 border border-slate-100 rounded-2xl pl-16 pr-6 text-slate-900 font-bold outline-none focus:border-[#B8860B] focus:bg-white transition-all placeholder:text-slate-300 placeholder:font-medium"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="h-16 px-12 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-[#B8860B] transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 disabled:opacity-70 group/btn"
                        >
                            {loading ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <>Rechercher <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" /></>
                            )}
                        </button>
                    </form>

                    {error && (
                        <div className="mt-8 flex items-center gap-4 p-5 bg-rose-50/50 text-rose-600 rounded-2xl border border-rose-100">
                            <AlertCircle size={20} className="shrink-0" />
                            <p className="text-[11px] font-black uppercase tracking-widest leading-relaxed">{error}</p>
                        </div>
                    )}
                </div>

                {/* Result Section */}
                {order && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="bg-white rounded-[40px] shadow-[0_40px_80px_rgba(0,0,0,0.04)] overflow-hidden border border-slate-100/60">

                            {/* Order Header */}
                            <div className="bg-slate-900 p-10 text-white flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(184,134,11,0.15),transparent_70%)]" />
                                <div className="relative z-10 text-center md:text-left">
                                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2">Référence d&apos;exception</p>
                                    <h2 className="text-3xl font-black tracking-tighter uppercase">{order.invoiceReference || `#${order.id}`}</h2>
                                </div>
                                <div className="relative z-10 text-center md:text-right">
                                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2">Date de Commande</p>
                                    <p className="font-bold text-lg">
                                        {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>

                            <div className="p-10 md:p-16">
                                {/* Status Steps */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20 relative">
                                    <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-[1px] bg-slate-100" />

                                    {/* Step 1 */}
                                    <div className="flex flex-col items-center text-center relative z-10 group/step">
                                        <div className={`w-20 h-20 rounded-[28px] flex items-center justify-center mb-6 transition-all duration-700 ${
                                            ['pending', 'confirmed', 'processing', 'completed'].includes(order.status)
                                                ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/20'
                                                : 'bg-slate-50 text-slate-200'
                                        }`}>
                                            <ShoppingBag size={32} strokeWidth={1.5} />
                                        </div>
                                        <h3 className={`font-black uppercase tracking-widest text-[11px] mb-2 ${
                                            ['pending', 'confirmed', 'processing', 'completed'].includes(order.status)
                                                ? 'text-slate-900' : 'text-slate-300'
                                        }`}>
                                            {order.status === 'pending' ? 'En attente' : 'Confirmée'}
                                        </h3>
                                        <div className="size-1.5 rounded-full bg-[#B8860B] mb-2 opacity-0 group-hover/step:opacity-100 transition-opacity" />
                                        <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.3em]">Validation</p>
                                    </div>

                                    {/* Step 2 */}
                                    <div className="flex flex-col items-center text-center relative z-10 group/step">
                                        <div className={`w-20 h-20 rounded-[28px] flex items-center justify-center mb-6 transition-all duration-700 ${
                                            ['confirmed', 'processing', 'completed'].includes(order.status)
                                                ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/20'
                                                : 'bg-slate-50 text-slate-200'
                                        }`}>
                                            <Package size={32} strokeWidth={1.5} />
                                        </div>
                                        <h3 className={`font-black uppercase tracking-widest text-[11px] mb-2 ${
                                            ['confirmed', 'processing', 'completed'].includes(order.status)
                                                ? 'text-slate-900' : 'text-slate-300'
                                        }`}>
                                            Atelier
                                        </h3>
                                        <div className="size-1.5 rounded-full bg-[#B8860B] mb-2 opacity-0 group-hover/step:opacity-100 transition-opacity" />
                                        <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.3em]">Préparation</p>
                                    </div>

                                    {/* Step 3 */}
                                    <div className="flex flex-col items-center text-center relative z-10 group/step">
                                        <div className={`w-20 h-20 rounded-[28px] flex items-center justify-center mb-6 transition-all duration-700 ${
                                            order.status === 'completed'
                                                ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/20'
                                                : 'bg-slate-50 text-slate-200'
                                        }`}>
                                            <Truck size={32} strokeWidth={1.5} />
                                        </div>
                                        <h3 className={`font-black uppercase tracking-widest text-[11px] mb-2 ${
                                            order.status === 'completed' ? 'text-slate-900' : 'text-slate-300'
                                        }`}>
                                            Expédition
                                        </h3>
                                        <div className="size-1.5 rounded-full bg-[#B8860B] mb-2 opacity-0 group-hover/step:opacity-100 transition-opacity" />
                                        <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.3em]">Livraison</p>
                                    </div>
                                </div>

                                {/* Order Summary */}
                                <div className="bg-slate-50/50 rounded-[32px] p-8 md:p-12 border border-slate-100/60 relative overflow-hidden">
                                    <div className="flex justify-between items-center mb-10 pb-8 border-b border-slate-200/50">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Carnet de livraison</h4>
                                        <span className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                                            order.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                            order.status === 'cancelled' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                                            'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        <div className="space-y-8">
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Destinataire</p>
                                                <p className="text-lg font-black text-slate-900 tracking-tight">{order.customerName}</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Adresse de Résidence</p>
                                                <p className="text-[13px] font-bold text-slate-600 leading-relaxed max-w-xs">{order.address}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-8">
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Composition</p>
                                                <p className="text-lg font-black text-slate-900 tracking-tight">{order.items?.length || 0} Pièces d&apos;Exception</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Investissement Total</p>
                                                <p className="text-3xl font-black text-[#B8860B] tracking-tighter">{api.formatPrice(order.totalPrice)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Products List */}
                                    {order.items && order.items.length > 0 && (
                                        <div className="mt-10 pt-10 border-t border-slate-200/50">
                                            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 mb-6">Pièces Commandées</p>
                                            <div className="space-y-4">
                                                {order.items.map((item: any, idx: number) => (
                                                    <div key={idx} className="flex items-center gap-5 p-4 bg-white rounded-[20px] border border-slate-100 hover:shadow-md transition-shadow group">
                                                        {/* Image */}
                                                        <div className="relative size-16 shrink-0 rounded-[14px] overflow-hidden bg-slate-50 border border-slate-100">
                                                            {item.imageUrl ? (
                                                                <Image
                                                                    src={normalizeImageUrl(item.imageUrl) || '/placeholder.png'}
                                                                    alt={item.name}
                                                                    fill
                                                                    className="object-contain p-1 group-hover:scale-110 transition-transform duration-500"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <Package size={24} className="text-slate-200" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        {/* Details */}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-black text-slate-900 text-sm uppercase tracking-tight truncate">{item.name}</p>
                                                            <p className="text-[10px] font-bold text-slate-400 mt-1">Qté : <span className="text-slate-600">{item.quantity}</span></p>
                                                        </div>
                                                        {/* Price */}
                                                        <div className="text-right shrink-0">
                                                            <p className="font-black text-[#B8860B] tracking-tighter">{api.formatPrice(Number(item.price) * item.quantity)}</p>
                                                            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">MAD</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="mt-16 flex flex-col sm:flex-row gap-5 justify-center">
                                    <Link
                                        href="/products"
                                        className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-[#B8860B] transition-all text-center shadow-xl shadow-slate-900/10"
                                    >
                                        Poursuivre l&apos;Expérience
                                    </Link>
                                    <Link
                                        href={`/devis?orderId=${order.id}`}
                                        className="px-10 py-5 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-slate-50 transition-all text-center"
                                    >
                                        Détails du Devis
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default function TrackOrderPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
                <Loader2 size={40} className="text-[#B8860B] animate-spin" />
            </div>
        }>
            <TrackOrderContent />
        </Suspense>
    );
}
