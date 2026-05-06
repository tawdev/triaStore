'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Package, Truck, ArrowRight, ShoppingBag, FileText, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { api, type Order } from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';

function OrderConfirmationContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrder() {
            if (orderId) {
                try {
                    const data = await api.getOrderById(orderId);
                    setOrder(data);
                } catch (error) {
                    console.error("Error fetching order:", error);
                }
            }
            setLoading(false);
        }
        fetchOrder();
    }, [orderId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 size={40} className="text-[#B8860B] animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex-1 bg-white py-24 px-6 font-outfit">
            <div className="max-w-4xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[60px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.05)] overflow-hidden border border-slate-50"
                >
                    {/* Luxury Success Header */}
                    <div className="bg-slate-900 p-16 md:p-24 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 size-96 bg-[#B8860B] opacity-10 rounded-full -mr-48 -mt-48 blur-[100px]" />
                        <div className="absolute bottom-0 left-0 size-64 bg-slate-800 opacity-20 rounded-full -ml-32 -mb-32 blur-[80px]" />
                        
                        <motion.div 
                            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }}
                            className="inline-flex items-center justify-center size-24 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] mb-10"
                        >
                            <Sparkles size={40} className="text-[#B8860B]" />
                        </motion.div>
                        
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter leading-none">
                            Curation <span className="text-[#B8860B]">Confirmée</span>
                        </h1>
                        <p className="text-slate-400 text-xl font-medium max-w-xl mx-auto leading-relaxed">
                            Votre sélection d'exception a été enregistrée avec succès par notre conciergerie.
                        </p>
                        
                        {orderId && (
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                                className="mt-12 inline-flex items-center gap-4 px-8 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] font-black tracking-[0.4em] text-slate-300 uppercase"
                            >
                                RÉFÉRENCE LUXE : #{orderId}
                            </motion.div>
                        )}
                    </div>

                    <div className="p-10 md:p-20">
                        {/* Status Protocol */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20 relative">
                            {/* Connector Lines (Desktop) */}
                            <div className="hidden md:block absolute top-6 left-[15%] right-[15%] h-[2px] bg-slate-50 z-0" />
                            
                            {/* Step 1: Confirmation */}
                            <div className="flex flex-col items-center text-center relative z-10">
                                <div className={`size-12 rounded-2xl flex items-center justify-center mb-6 shadow-xl transition-all duration-700 ${
                                    ['pending', 'confirmed', 'processing', 'completed'].includes(order?.status ?? '')
                                    ? 'bg-[#B8860B] text-white shadow-[#B8860B]/20' 
                                    : 'bg-slate-50 text-slate-200'
                                }`}>
                                    <ShoppingBag size={20} />
                                </div>
                                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-2 text-slate-900">Protocole</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enregistré</p>
                            </div>

                            {/* Step 2: Artisanat */}
                            <div className="flex flex-col items-center text-center relative z-10">
                                <div className={`size-12 rounded-2xl flex items-center justify-center mb-6 shadow-xl transition-all duration-700 ${
                                    ['confirmed', 'processing', 'completed'].includes(order?.status ?? '')
                                    ? 'bg-slate-900 text-white shadow-slate-900/10' 
                                    : 'bg-slate-50 text-slate-200'
                                }`}>
                                    <Package size={20} className={order?.status === 'confirmed' || order?.status === 'processing' ? 'animate-pulse' : ''} />
                                </div>
                                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-2 text-slate-900">Préparation</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Atelier Artisan</p>
                            </div>

                            {/* Step 3: Logistique */}
                            <div className="flex flex-col items-center text-center relative z-10">
                                <div className={`size-12 rounded-2xl flex items-center justify-center mb-6 shadow-xl transition-all duration-700 ${
                                    order?.status === 'completed'
                                    ? 'bg-[#B8860B] text-white shadow-[#B8860B]/20' 
                                    : 'bg-slate-50 text-slate-200'
                                }`}>
                                    <Truck size={20} />
                                </div>
                                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-2 text-slate-900">Livraison</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transport Prestige</p>
                            </div>
                        </div>

                        {/* Order Summary Detail */}
                        {order && (
                            <div className="bg-slate-50/50 rounded-[40px] p-10 border border-slate-100 mb-16 relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#B8860B]" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-8 flex items-center gap-4">
                                    <FileText size={14} /> Détails du Bordereau
                                </h3>
                                <div className="space-y-6">
                                    {order.items?.map((item: { name: string; quantity: number; price: number }, i: number) => (
                                        <div key={i} className="flex justify-between items-center group/item">
                                            <div className="flex items-center gap-4">
                                                <span className="text-[10px] font-black text-[#B8860B] bg-white size-6 rounded-full flex items-center justify-center shadow-sm">{item.quantity}</span>
                                                <span className="text-sm font-black text-slate-700 uppercase tracking-tight group-hover/item:text-[#B8860B] transition-colors">{item.name}</span>
                                            </div>
                                            <span className="text-sm font-black text-slate-900">{api.formatPrice(item.price * item.quantity)} <span className="text-[10px]">MAD</span></span>
                                        </div>
                                    ))}
                                    <div className="pt-8 mt-8 border-t border-slate-100 flex justify-between items-end">
                                        <div>
                                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] block mb-2">Valorisation Totale</span>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Livraison Prestige Incluse</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-4xl font-black text-slate-900 tracking-tighter italic">{api.formatPrice(order.totalPrice)} <span className="text-lg">MAD</span></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Professional Actions */}
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Link 
                                href="/products"
                                className="flex items-center justify-center gap-4 bg-slate-900 text-white px-12 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] hover:bg-[#B8860B] transition-all shadow-2xl shadow-slate-900/10"
                            >
                                Retour à la Galerie
                                <ArrowRight size={16} />
                            </Link>
                            <Link 
                                href={orderId ? `/devis?orderId=${orderId}` : "/devis"}
                                className="flex items-center justify-center gap-4 bg-white text-slate-900 border border-slate-100 px-12 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] hover:bg-slate-50 transition-all shadow-sm"
                            >
                                <FileText size={16} />
                                Télécharger le Devis
                            </Link>
                        </div>
                    </div>
                    
                    <div className="bg-slate-50 py-10 px-6 text-center border-t border-slate-100">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <ShieldCheck size={16} className="text-[#B8860B]" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Service Conciergerie</span>
                        </div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                            Une question ? Contactez nos experts Tria Lampe au <span className="text-slate-900">+212 5 22 XX XX XX</span>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default function OrderConfirmationPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 size={40} className="text-[#B8860B] animate-spin" />
            </div>
        }>
            <OrderConfirmationContent />
        </Suspense>
    );
}
