'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import { api } from '../lib/api';
import { generateWhatsAppLink } from '../lib/whatsapp';
import { useRouter } from 'next/navigation';
import { 
    ShoppingBag, 
    ArrowLeft, 
    ArrowRight,
    ShieldCheck, 
    Truck, 
    Phone, 
    User, 
    MapPin, 
    Mail, 
    Sparkles, 
    CheckCircle2,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CheckoutPage() {
    const { cartItems, totalPrice, clearCart } = useCart();
    const { showToast } = useNotification();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        notes: ''
    });

    useEffect(() => {
        setMounted(true);
        if (mounted && cartItems.length === 0) {
            router.push('/products');
        }
    }, [cartItems, router, mounted]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const deliveryFee = totalPrice >= 2000 ? 0 : 250;
    const finalTotal = totalPrice + deliveryFee;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.name || !formData.phone || !formData.address) {
            showToast('Veuillez remplir les informations essentielles.', 'error');
            return;
        }

        setLoading(true);
        try {
            // 1. Create order in backend
            const orderData = {
                customerName: formData.name,
                phone: formData.phone,
                email: formData.email,
                address: formData.address,
                items: cartItems.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                    name: item.name
                })),
                totalPrice: finalTotal,
                status: 'pending' as const
            };

            const response = await api.createOrder(orderData);
            
            // 2. Prepare WhatsApp message
            const waLink = generateWhatsAppLink({
                items: cartItems.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
                totalPrice: totalPrice,
                customerInfo: {
                    name: formData.name,
                    phone: formData.phone,
                    address: formData.address
                }
            });

            // 3. Save to localStorage for Devis/Confirmation pages
            localStorage.setItem('tria_last_order', JSON.stringify({
                invoiceNumber: response.invoiceReference || `TRIA-${response.id}`,
                date: new Date().toISOString(),
                items: cartItems,
                totalPrice: totalPrice,
                customerInfo: formData
            }));

            // 4. Redirect to WhatsApp (optional) then success page
            window.open(waLink, '_blank');
            
            clearCart();
            showToast('Votre curation a été transmise avec succès !', 'success');
            router.push(`/order-confirmation?orderId=${response.id}`);

        } catch (error) {
            console.error('Checkout error:', error);
            showToast('Une erreur est survenue lors de la validation.', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) return null;

    return (
        <div className="flex-1 bg-white py-24 px-6 font-outfit">
            <div className="mx-auto max-w-[1440px]">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-20 gap-10 border-b border-slate-50 pb-16">
                    <div className="space-y-4">
                        <Link href="/cart" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-[#B8860B] mb-6 group">
                            <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" />
                            Retour au Panier
                        </Link>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                            Finaliser la <span className="text-[#B8860B]">Curation</span>
                        </h1>
                        <p className="text-xl text-slate-400 font-medium max-w-xl">
                            Validez votre sélection d'exception pour un accompagnement personnalisé par notre conciergerie.
                        </p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-right hidden md:block">
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Paiement Sécurisé</p>
                            <p className="text-xs font-bold text-slate-900">À la livraison</p>
                        </div>
                        <div className="size-16 rounded-[24px] bg-slate-50 flex items-center justify-center text-[#B8860B]">
                            <ShieldCheck size={32} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-20 lg:grid-cols-12 items-start">
                    
                    {/* Checkout Form */}
                    <div className="lg:col-span-7">
                        <form onSubmit={handleSubmit} className="space-y-16">
                            
                            {/* Personal Info */}
                            <section>
                                <div className="flex items-center gap-6 mb-12">
                                    <div className="size-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xs">01</div>
                                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Coordonnées <span className="text-[#B8860B]">Privées</span></h3>
                                </div>
                                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                    <label className="flex flex-col gap-3 md:col-span-2">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] pl-1">Nom Complet</span>
                                        <div className="relative">
                                            <User className="absolute left-6 top-1/2 -translate-y-1/2 size-5 text-slate-300" />
                                            <input 
                                                name="name" value={formData.name} onChange={handleInputChange} required
                                                className="w-full rounded-[24px] border-slate-100 bg-slate-50 py-5 pl-16 pr-6 text-slate-900 focus:bg-white focus:ring-4 focus:ring-[#B8860B]/10 focus:border-[#B8860B] transition-all outline-none font-bold text-lg" 
                                                placeholder="Monsieur / Madame..." type="text" 
                                            />
                                        </div>
                                    </label>
                                    <label className="flex flex-col gap-3">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] pl-1">Téléphone</span>
                                        <div className="relative">
                                            <Phone className="absolute left-6 top-1/2 -translate-y-1/2 size-5 text-slate-300" />
                                            <input 
                                                name="phone" value={formData.phone} onChange={handleInputChange} required
                                                className="w-full rounded-[24px] border-slate-100 bg-slate-50 py-5 pl-16 pr-6 text-slate-900 focus:bg-white focus:ring-4 focus:ring-[#B8860B]/10 focus:border-[#B8860B] transition-all outline-none font-bold text-lg" 
                                                placeholder="+212 6..." type="tel" 
                                            />
                                        </div>
                                    </label>
                                    <label className="flex flex-col gap-3">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] pl-1">Email</span>
                                        <div className="relative">
                                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 size-5 text-slate-300" />
                                            <input 
                                                name="email" value={formData.email} onChange={handleInputChange}
                                                className="w-full rounded-[24px] border-slate-100 bg-slate-50 py-5 pl-16 pr-6 text-slate-900 focus:bg-white focus:ring-4 focus:ring-[#B8860B]/10 focus:border-[#B8860B] transition-all outline-none font-bold text-lg" 
                                                placeholder="votre@email.com" type="email" 
                                            />
                                        </div>
                                    </label>
                                </div>
                            </section>

                            {/* Logistics Detail */}
                            <section>
                                <div className="flex items-center gap-6 mb-12">
                                    <div className="size-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xs">02</div>
                                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Logistique de <span className="text-[#B8860B]">Livraison</span></h3>
                                </div>
                                <div className="grid grid-cols-1 gap-8">
                                    <label className="flex flex-col gap-3">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] pl-1">Adresse de destination</span>
                                        <div className="relative">
                                            <MapPin className="absolute left-6 top-6 size-5 text-slate-300" />
                                            <textarea 
                                                name="address" value={formData.address} onChange={handleInputChange} required
                                                className="w-full rounded-[32px] border-slate-100 bg-slate-50 py-6 pl-16 pr-6 text-slate-900 focus:bg-white focus:ring-4 focus:ring-[#B8860B]/10 focus:border-[#B8860B] transition-all outline-none font-bold text-lg min-h-[140px]" 
                                                placeholder="Quartier, Immeuble, Étage..." 
                                            />
                                        </div>
                                    </label>
                                    <label className="flex flex-col gap-3">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] pl-1">Notes Particulières</span>
                                        <textarea 
                                            name="notes" value={formData.notes} onChange={handleInputChange}
                                            className="w-full rounded-[32px] border-slate-100 bg-slate-50 p-8 text-slate-900 focus:bg-white focus:ring-4 focus:ring-[#B8860B]/10 focus:border-[#B8860B] transition-all outline-none font-bold text-lg min-h-[120px]" 
                                            placeholder="Instructions de livraison, contraintes d'accès..." 
                                        />
                                    </label>
                                </div>
                            </section>

                            <div className="pt-10">
                                <button 
                                    disabled={loading}
                                    className="w-full rounded-[32px] bg-slate-900 px-12 py-7 text-xl font-black text-white shadow-2xl shadow-slate-900/20 transition-all hover:bg-[#B8860B] hover:scale-[1.02] active:scale-[0.98] uppercase tracking-[0.3em] flex items-center justify-center gap-6"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 size={24} className="animate-spin" />
                                            TRANSMISSION...
                                        </>
                                    ) : (
                                        <>
                                            CONFIRMER MA SÉLECTION
                                            <ArrowRight size={20} />
                                        </>
                                    )}
                                </button>
                                <div className="mt-10 flex items-center justify-center gap-6 text-[10px] text-slate-300 font-black uppercase tracking-[0.4em]">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={14} className="text-[#B8860B]" />
                                        VÉRIFICATION ARTISANALE
                                    </div>
                                    <div className="size-1 rounded-full bg-slate-100" />
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck size={14} className="text-[#B8860B]" />
                                        PROTECTION DES DONNÉES
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="lg:col-span-5 lg:sticky lg:top-32">
                        <div className="rounded-[60px] bg-slate-900 p-12 text-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] relative overflow-hidden">
                            {/* Decorative gradient */}
                            <div className="absolute top-0 right-0 size-96 bg-[#B8860B] opacity-10 rounded-full blur-[100px] -mr-48 -mt-48" />
                            
                            <div className="flex items-center justify-between mb-12 relative z-10">
                                <h3 className="text-2xl font-black uppercase tracking-tighter">Récapitulatif</h3>
                                <ShoppingBag size={24} className="text-[#B8860B]" />
                            </div>

                            <div className="space-y-6 mb-12 max-h-[400px] overflow-y-auto pr-4 no-scrollbar relative z-10">
                                {cartItems.map((item) => (
                                    <div key={item.productId} className="flex items-center gap-6 group">
                                        <div className="size-20 shrink-0 overflow-hidden rounded-[24px] bg-white p-3 relative group-hover:scale-105 transition-transform">
                                            {item.imageUrl ? (
                                                <Image fill src={item.imageUrl} alt={item.name} className="object-contain p-2" />
                                            ) : (
                                                <div className="w-full h-full bg-slate-50 flex items-center justify-center"><ShoppingBag className="text-slate-200" /></div>
                                            )}
                                        </div>
                                        <div className="flex flex-1 flex-col justify-center">
                                            <span className="font-black text-white text-sm uppercase tracking-tight leading-tight line-clamp-1">{item.name}</span>
                                            <span className="text-[10px] font-black text-[#B8860B] uppercase tracking-[0.3em] mt-1">Qté: {item.quantity}</span>
                                        </div>
                                        <span className="font-black text-white text-sm">{(item.price * item.quantity).toLocaleString()} <span className="text-[10px]">MAD</span></span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-white/5 pt-10 space-y-6 relative z-10">
                                <div className="flex justify-between text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">
                                    <span>Valeur de la sélection</span>
                                    <span className="text-white">{totalPrice.toLocaleString()} MAD</span>
                                </div>
                                <div className="flex justify-between text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">
                                    <span>Logistique Prestige</span>
                                    <span className={deliveryFee === 0 ? 'text-[#B8860B]' : 'text-white'}>
                                        {deliveryFee === 0 ? 'OFFERTE' : `${deliveryFee.toLocaleString()} MAD`}
                                    </span>
                                </div>
                                
                                <div className="pt-10 border-t border-white/5 flex justify-between items-end">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B8860B]">Total Final</p>
                                        <p className="text-5xl font-black tracking-tighter text-white italic">
                                            {finalTotal.toLocaleString()} <span className="text-xl">MAD</span>
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <Sparkles size={24} className="text-[#B8860B] opacity-50" />
                                        <span className="text-[8px] font-black uppercase tracking-[0.5em] text-slate-500">TRIA LAMPE</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Info Card */}
                        <div className="mt-10 p-10 bg-slate-50 rounded-[40px] border border-slate-100 flex items-start gap-6">
                            <Truck size={24} className="text-[#B8860B] shrink-0" />
                            <div>
                                <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900 mb-2">Protocole de Livraison</h4>
                                <p className="text-xs font-medium text-slate-400 leading-relaxed">
                                    Une fois validée, votre sélection sera traitée par nos artisans. La livraison s'effectue sous 48h à 72h par transporteur spécialisé.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
