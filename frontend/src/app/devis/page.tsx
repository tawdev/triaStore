'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Download, FileText, MapPin, Phone, User, Store, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { api } from '../lib/api';
import { motion } from 'framer-motion';

interface OrderItem {
    name: string;
    quantity: number;
    price: number;
    imageUrl?: string | null;
}

interface OrderPayload {
    invoiceNumber: string;
    date: string;
    items: OrderItem[];
    totalPrice: number;
    customerInfo: {
        name: string;
        phone: string;
        address: string;
    };
}

function InvoiceContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    
    const [order, setOrder] = useState<OrderPayload | null>(null);
    const [isClient, setIsClient] = useState(false);
    const [loading, setLoading] = useState(true);
    const invoiceRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsClient(true);
        
        async function fetchOrder() {
            setLoading(true);
            if (orderId) {
                try {
                    const data = await api.getOrderById(orderId);
                    setOrder({
                        invoiceNumber: data.invoiceReference || `TRIA-${data.id}`,
                        date: data.createdAt,
                        items: Array.isArray(data.items) ? data.items : [],
                        totalPrice: Number(data.totalPrice),
                        customerInfo: {
                            name: data.customerName,
                            phone: data.phone || '',
                            address: data.address || ''
                        }
                    });
                } catch (error) {
                    console.error("Erreur backend:", error);
                }
            } else {
                const storedOrder = localStorage.getItem('tria_last_order');
                if (storedOrder) {
                    try {
                        setOrder(JSON.parse(storedOrder));
                    } catch (error) {
                        console.error("Erreur locale:", error);
                    }
                }
            }
            setLoading(false);
        }

        fetchOrder();
    }, [orderId]);

    const generatePDF = () => {
        window.print();
    };

    if (!isClient || loading) {
        return (
        <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 size={40} className="text-[#B8860B] animate-spin" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-white">
                <div className="size-24 bg-slate-50 rounded-[32px] flex items-center justify-center mb-10">
                    <FileText size={40} className="text-slate-200" />
                </div>
                <h1 className="text-4xl font-black text-slate-900 mb-6 uppercase tracking-tighter text-center">Aucun Devis <span className="text-[#B8860B]">Trouvé</span></h1>
                <p className="text-slate-400 mb-12 max-w-md text-center font-medium leading-relaxed">
                    Nous n'avons trouvé aucune trace de votre sélection. Veuillez recommencer votre curation.
                </p>
                <Link 
                    href="/products" 
                    className="flex items-center gap-4 bg-slate-900 text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] hover:bg-[#B8860B] transition-all shadow-2xl shadow-slate-900/10"
                >
                    <ArrowLeft size={16} /> Retour à la Galerie
                </Link>
            </div>
        );
    }

    const orderDate = new Date(order.date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="flex-1 flex flex-col bg-slate-50/50 py-20 px-6 print:bg-white print:py-0 print:px-0 font-outfit">
            <div className="max-w-[1000px] mx-auto w-full">
                {/* Floating Action Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-[32px] shadow-2xl shadow-slate-200/50 border border-slate-100 mb-12 gap-6 print:hidden">
                    <Link 
                        href={orderId ? "/admin/orders" : "/products"} 
                        className="flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-slate-900 transition-all"
                    >
                        <ArrowLeft size={16} className="mr-3" /> {orderId ? "Retour aux commandes" : "Reprendre la Curation"}
                    </Link>
                    <button 
                        onClick={generatePDF}
                        className="flex items-center gap-4 bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] hover:bg-[#B8860B] transition-all shadow-xl shadow-slate-900/20"
                    >
                        <Download size={16} />
                        Télécharger le Devis
                    </button>
                </div>

                {/* Printable Invoice Container */}
                <div className="bg-white rounded-[60px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.05)] overflow-hidden mb-20 border border-slate-100 print:shadow-none print:border-none print:m-0 print:p-0">
                    <div ref={invoiceRef} className="p-12 sm:p-24 bg-white relative overflow-hidden">
                        {/* Decorative Gold Accent */}
                        <div className="absolute top-0 right-0 size-96 bg-[#B8860B] opacity-[0.03] rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />

                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row justify-between items-start border-b border-slate-100 pb-16 mb-16 relative z-10">
                            <div className="mb-10 md:mb-0 space-y-8">
                                <div className="flex flex-col">
                                    <span className="text-3xl font-black tracking-tighter text-slate-900 leading-none">
                                        TRIA <span className="text-[#B8860B]">LAMPE</span>
                                    </span>
                                    <span className="text-[10px] font-black tracking-[0.5em] text-slate-400 uppercase mt-2">
                                        L'Excellence Lumineuse
                                    </span>
                                </div>
                                <div className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 space-y-2 leading-relaxed">
                                    <div className="flex items-center gap-3"><MapPin size={14} className="text-[#B8860B]" /> Casablanca, Maroc</div>
                                    <div className="flex items-center gap-3"><Phone size={14} className="text-[#B8860B]" /> +212 5 22 XX XX XX</div>
                                    <div className="flex items-center gap-3"><FileText size={14} className="text-[#B8860B]" /> concierge@trialampe.ma</div>
                                </div>
                            </div>
                            
                            <div className="text-left md:text-right space-y-4">
                                <div className="flex items-center justify-end gap-3 mb-2">
                                    <Sparkles size={20} className="text-[#B8860B]" />
                                    <h2 className="text-5xl font-black uppercase tracking-tighter text-slate-900">Devis</h2>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[11px] font-black text-[#B8860B] uppercase tracking-[0.3em]">Référence : {order.invoiceNumber}</p>
                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Émis le : {orderDate}</p>
                                </div>
                            </div>
                        </div>

                        {/* Customer Info Section */}
                        {(order.customerInfo.name || order.customerInfo.phone || order.customerInfo.address) && (
                            <div className="mb-16 p-10 bg-slate-50 rounded-[40px] border border-slate-100 relative group overflow-hidden">
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#B8860B]" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-8 flex items-center gap-4">
                                    <User size={14} /> Préparé pour
                                </h3>
                                <div className="grid sm:grid-cols-2 gap-10 text-sm font-bold text-slate-700">
                                    {order.customerInfo.name && (
                                        <div className="space-y-2">
                                             <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Identité</span> 
                                             <span className="text-xl font-black text-slate-900 uppercase tracking-tight">{order.customerInfo.name}</span>
                                        </div>
                                    )}
                                    {order.customerInfo.phone && (
                                        <div className="space-y-2">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Contact</span>
                                            <span className="text-slate-900 flex items-center gap-3"><Phone size={14} className="text-[#B8860B]" /> {order.customerInfo.phone}</span>
                                        </div>
                                    )}
                                    {order.customerInfo.address && (
                                        <div className="space-y-2 sm:col-span-2">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Résidence / Chantier</span>
                                            <div className="flex gap-4 items-start text-slate-900">
                                                <MapPin size={18} className="text-[#B8860B] mt-1 shrink-0" /> 
                                                <span className="text-lg font-black uppercase tracking-tight leading-none">{order.customerInfo.address}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Items Table */}
                        <div className="mb-16 overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[600px]">
                                <thead>
                                    <tr className="border-b-2 border-slate-100 text-[10px] font-black uppercase tracking-[0.3em] text-[#B8860B]">
                                        <th className="py-6 px-4">Désignation</th>
                                        <th className="py-6 px-4 text-center">Quantité</th>
                                        <th className="py-6 px-4 text-right">Valeur Unitaire</th>
                                        <th className="py-6 px-4 text-right">Valorisation</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm font-bold text-slate-600">
                                    {order.items.map((item, index) => (
                                        <tr key={index} className="border-b border-slate-50 group hover:bg-slate-50 transition-colors">
                                            <td className="py-8 px-4 text-slate-900 font-black uppercase tracking-tight">{item.name}</td>
                                            <td className="py-8 px-4 text-center text-slate-400">{item.quantity}</td>
                                            <td className="py-8 px-4 text-right">{item.price.toLocaleString()} <span className="text-[10px]">MAD</span></td>
                                            <td className="py-8 px-4 text-right text-slate-900 font-black">{ (item.price * item.quantity).toLocaleString() } <span className="text-[10px]">MAD</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Totals Section */}
                        <div className="flex justify-end pt-10">
                            <div className="w-full sm:w-1/2 md:w-[400px] space-y-6">
                                <div className="flex justify-between font-black text-slate-300 uppercase tracking-widest text-[10px] px-4">
                                    <span>Estimation Pièces</span>
                                    <span className="text-slate-900">{order.totalPrice.toLocaleString()} MAD</span>
                                </div>
                                <div className="flex justify-between font-black text-slate-300 uppercase tracking-widest text-[10px] px-4">
                                    <span>Logistique Spécialisée</span>
                                    <span className={order.totalPrice >= 2000 ? 'text-[#B8860B]' : 'text-slate-900'}>
                                        {order.totalPrice >= 2000 ? 'OFFERTE' : '250,00 MAD'}
                                    </span>
                                </div>
                                <div className="p-8 bg-slate-900 rounded-[30px] flex justify-between items-center text-white shadow-2xl shadow-slate-900/10">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B8860B] mb-2">Total TTC</p>
                                        <p className="text-4xl font-black tracking-tighter">
                                            {(order.totalPrice + (order.totalPrice >= 2000 ? 0 : 250)).toLocaleString()} <span className="text-lg">MAD</span>
                                        </p>
                                    </div>
                                    <ShieldCheck className="size-10 text-[#B8860B] opacity-50" />
                                </div>
                            </div>
                        </div>

                        {/* Footer Notes */}
                        <div className="mt-24 pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-end gap-10">
                            <div className="max-w-md">
                                <p className="text-[10px] font-black text-[#B8860B] uppercase tracking-[0.4em] mb-4">Note Prestige</p>
                                <p className="text-[11px] font-bold text-slate-400 leading-relaxed italic">
                                    Ce devis est valable 30 jours à compter de sa date d'émission. Les finitions sur-mesure peuvent nécessiter un délai supplémentaire. Merci de nous accorder votre confiance.
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-slate-200 uppercase tracking-[0.5em] mb-4">Sceau d'Excellence</p>
                                <div className="size-20 border-4 border-slate-50 rounded-full flex items-center justify-center opacity-20">
                                    <span className="text-[8px] font-black uppercase tracking-widest">TRIA</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function InvoicePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 size={40} className="text-[#B8860B] animate-spin" />
            </div>
        }>
            <InvoiceContent />
        </Suspense>
    );
}
