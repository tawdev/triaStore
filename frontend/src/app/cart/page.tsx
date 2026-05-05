'use client';

import { useState, useEffect } from 'react';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, MessageCircle, X, MapPin, User, Phone, CheckCircle2, FileText, Sparkles, ShieldCheck, Box } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';
import { useNotification } from '@/app/context/NotificationContext';
import { generateWhatsAppLink } from '@/app/lib/whatsapp';
import { api } from '@/app/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function ShoppingCartPage() {
    const { cartItems, totalPrice, totalItems, updateQuantity, removeFromCart, clearCart } = useCart();
    const { showToast } = useNotification();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });
    const [settings, setSettings] = useState<any>(null);

    useEffect(() => {
        api.getSettings().then(setSettings).catch(console.error);
    }, []);

    useEffect(() => {
        if (isCheckingOut) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isCheckingOut]);

    const handleCheckout = async () => {
        setIsLoading(true);

        try {
            const now = new Date();
            const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
            const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
            const invoiceNumber = `TRIA-${datePart}-${randomPart}`;

            const orderPayload = {
                invoiceNumber,
                date: now.toISOString(),
                items: cartItems.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: Number(item.price),
                    imageUrl: item.imageUrl,
                })),
                totalPrice: Number(totalPrice),
                customerInfo,
            };

            const backendOrderData = {
                customerName: customerInfo.name || 'Client Tria Lampe',
                email: customerInfo.email,
                phone: customerInfo.phone,
                address: customerInfo.address,
                invoiceReference: invoiceNumber,
                totalPrice: Number(totalPrice),
                items: orderPayload.items
            };

            await api.createOrder(backendOrderData as any);

            try {
                localStorage.setItem('tria_last_order', JSON.stringify(orderPayload));
            } catch (e) {
                console.error('Could not save order to localStorage', e);
            }

            const whatsappLink = generateWhatsAppLink({
                items: orderPayload.items,
                totalPrice: orderPayload.totalPrice,
                customerInfo,
            }, settings?.phoneNumber);

            setTimeout(() => {
                window.open(whatsappLink, '_blank');
                setIsLoading(false);
                setIsConfirmed(true);
                clearCart();
            }, 1000);

        } catch (error: unknown) {
            console.error('Order creation failed:', error);
            const errorMsg = error instanceof Error ? error.message : 'Une erreur est survenue lors de la création de la commande.';
            showToast(`${errorMsg} Veuillez réessayer.`, 'error');
            setIsLoading(false);
        }
    };

    if (totalItems === 0 && !isConfirmed) {
        return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-white">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="size-32 bg-slate-50 rounded-[40px] flex items-center justify-center mb-10"
                >
                    <ShoppingCart size={48} className="text-slate-200" />
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 uppercase tracking-tighter text-center">Votre curation est <span className="text-[#B8860B]">vide</span></h1>
                <p className="text-slate-400 mb-12 max-w-md text-center font-medium leading-relaxed">Parcourez nos collections exclusives et sélectionnez les pièces qui illumineront votre demeure.</p>
                <Link
                    href="/products"
                    className="flex items-center gap-4 bg-slate-900 text-white px-12 py-5 rounded-[20px] font-black uppercase text-[10px] tracking-[0.3em] hover:bg-[#B8860B] transition-all shadow-2xl shadow-slate-900/20"
                >
                    Explorer la Galerie <ArrowRight size={16} />
                </Link>
            </div>
        );
    }

    if (isConfirmed) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-white">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="size-32 bg-[#B8860B]/10 rounded-[40px] flex items-center justify-center mb-10"
                >
                    <CheckCircle2 size={56} className="text-[#B8860B]" />
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 uppercase tracking-tighter text-center">Protocole Envoyé</h1>
                <p className="text-slate-400 mb-12 max-w-md text-center font-medium leading-relaxed">
                    Votre demande de réservation a été transmise à notre conciergerie WhatsApp. Un conseiller vous accompagnera pour finaliser l'acquisition.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg">
                    <Link
                        href="/devis"
                        className="flex items-center justify-center gap-3 bg-[#B8860B] text-white px-10 py-5 rounded-[20px] font-black uppercase text-[10px] tracking-[0.3em] hover:bg-slate-900 transition-all shadow-xl shadow-[#B8860B]/20 flex-1"
                    >
                        <FileText size={18} />
                        Télécharger le Devis
                    </Link>
                    <button
                        onClick={() => { setIsConfirmed(false); clearCart(); }}
                        className="flex items-center justify-center gap-3 bg-slate-100 text-slate-900 px-10 py-5 rounded-[20px] font-black uppercase text-[10px] tracking-[0.3em] hover:bg-slate-200 transition-all flex-1"
                    >
                        Nouvelle Curation
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-white py-24">
            <div className="mx-auto max-w-[1400px] px-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 border-b border-slate-50 pb-12">
                    <div className="space-y-4">
                        <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-[#B8860B] mb-4">
                            <Link href="/">Accueil</Link>
                            <div className="size-1 rounded-full bg-slate-200" />
                            <span className="text-slate-400 font-bold tracking-widest uppercase">Votre Curation</span>
                        </nav>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                            Bordereau de <span className="text-[#B8860B]">Curation</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex -space-x-4">
                            {cartItems.slice(0, 3).map((item, i) => (
                                <div key={i} className="size-12 rounded-full border-4 border-white bg-slate-50 overflow-hidden shadow-lg relative z-[10-i]">
                                    <Image src={item.imageUrl || '/placeholder.png'} alt="item" fill className="object-cover" />
                                </div>
                            ))}
                        </div>
                        <span className="text-slate-400 font-black uppercase tracking-widest text-[10px]">
                            {totalItems} Article{totalItems > 1 ? 's' : ''} Sélectionné{totalItems > 1 ? 's' : ''}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                    {/* Cart Items List */}
                    <div className="lg:col-span-8 space-y-10">
                        {cartItems.map((item) => (
                            <motion.div 
                                layout
                                key={item.productId} 
                                className="flex flex-col sm:flex-row items-center gap-10 p-8 bg-white border border-slate-50 rounded-[40px] hover:shadow-2xl hover:shadow-slate-200/50 transition-all group relative overflow-hidden"
                            >
                                {/* Decorative line */}
                                <div className="absolute top-0 left-0 w-1 h-full bg-[#B8860B] opacity-0 group-hover:opacity-100 transition-opacity" />

                                <button
                                    onClick={() => removeFromCart(item.productId)}
                                    className="absolute top-8 right-8 text-slate-200 hover:text-red-500 transition-colors p-2"
                                >
                                    <Trash2 size={20} />
                                </button>

                                {/* Image */}
                                <div className="w-full sm:w-48 h-48 relative bg-slate-50 rounded-[30px] overflow-hidden shrink-0 border border-slate-50 group-hover:shadow-xl transition-all duration-500">
                                    <Image
                                        src={item.imageUrl || '/placeholder.png'}
                                        alt={item.name}
                                        fill
                                        className="object-contain p-4 group-hover:scale-110 transition-transform duration-700"
                                    />
                                </div>

                                {/* Details */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="h-[2px] w-6 bg-[#B8860B]" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#B8860B]">Pièce Signature</span>
                                    </div>
                                    <Link href={`/products/${item.productId}`} className="text-2xl font-black text-slate-900 hover:text-[#B8860B] transition-colors block mb-4 truncate uppercase tracking-tight">
                                        {item.name}
                                    </Link>
                                    
                                    <div className="flex items-center justify-between mt-10">
                                        {/* Quantity Selector */}
                                        <div className="flex items-center bg-slate-900 rounded-[20px] p-1.5 shadow-xl">
                                            <button
                                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                className="size-10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="w-10 text-center font-black text-white text-sm">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                className="size-10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>

                                        {/* Item Total */}
                                        <div className="text-right">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-1">Valorisation</p>
                                            <p className="text-2xl font-black text-slate-900 tracking-tighter">
                                                {new Intl.NumberFormat('fr-MA').format(Number(item.price) * item.quantity)} <span className="text-sm">MAD</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        <div className="pt-12 border-t border-slate-50 flex items-center justify-between">
                            <Link href="/products" className="text-[10px] font-black uppercase tracking-[0.3em] text-[#B8860B] hover:text-slate-900 flex items-center gap-4 transition-all hover:gap-6">
                                <ArrowRight size={14} className="rotate-180" /> Reprendre la Galerie
                            </Link>
                            <button
                                onClick={clearCart}
                                className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500/40 hover:text-red-500 transition-colors"
                            >
                                Archiver le Panier
                            </button>
                        </div>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
                        <div className="bg-slate-900 rounded-[50px] p-10 text-white shadow-[0_40px_80px_-15px_rgba(15,23,42,0.3)] relative overflow-hidden border border-white/5">
                            {/* Ambient Glow */}
                            <div className="absolute top-0 right-0 size-64 bg-[#B8860B] rounded-full blur-[100px] opacity-10 pointer-events-none -mr-32 -mt-32" />

                            <div className="flex items-center gap-3 mb-10">
                                <Sparkles className="size-5 text-[#B8860B]" />
                                <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#B8860B]">Estimation Prestige</h2>
                            </div>

                            <div className="space-y-6 mb-12 relative z-10">
                                <div className="flex justify-between items-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                                    <span>Valeur des pièces</span>
                                    <span className="text-white">{new Intl.NumberFormat('fr-MA').format(Number(totalPrice))} MAD</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                                    <span>Logistique Spécialisée</span>
                                    <span className={Number(totalPrice) >= 2000 ? 'text-[#B8860B]' : 'text-white'}>
                                        {Number(totalPrice) >= 2000 ? 'OFFERTE' : '250,00 MAD'}
                                    </span>
                                </div>
                                
                                <div className="pt-10 mt-10 border-t border-white/5 space-y-4">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B8860B] mb-2">Total Estimé</p>
                                            <p className="text-5xl font-black tracking-tighter">
                                                {new Intl.NumberFormat('fr-MA').format(Number(totalPrice) + (Number(totalPrice) >= 2000 ? 0 : 250))} <span className="text-xl">MAD</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-500 font-medium text-[10px] uppercase tracking-widest">
                                        <ShieldCheck size={14} className="text-[#B8860B]" />
                                        Garantie 5 ans incluse
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsCheckingOut(true)}
                                className="w-full bg-[#B8860B] hover:bg-white hover:text-slate-900 text-white py-6 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] transition-all flex items-center justify-center gap-4 shadow-2xl shadow-[#B8860B]/20 group"
                            >
                                <MessageCircle size={20} className="group-hover:scale-110 transition-transform" />
                                Ouvrir Conciergerie WhatsApp
                            </button>

                            <div className="mt-8 text-center px-4">
                                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest leading-loose">
                                    Nos conseillers valideront les spécifications techniques de votre projet.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Checkout Modal */}
            <AnimatePresence>
                {isCheckingOut && (
                    <div className="fixed inset-0 z-[6000] flex items-center justify-center p-6">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/90 backdrop-blur-md"
                            onClick={() => !isLoading && setIsCheckingOut(false)}
                        />

                        {/* Modal Content */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-xl rounded-[60px] overflow-hidden relative z-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-slate-50"
                        >
                            <div className="bg-slate-900 p-12 text-white relative">
                                <button
                                    onClick={() => setIsCheckingOut(false)}
                                    className="absolute top-10 right-10 text-white/20 hover:text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="size-12 rounded-2xl bg-[#B8860B] flex items-center justify-center text-white">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B8860B]">Protocole de Réservation</span>
                                        <h2 className="text-3xl font-black uppercase tracking-tighter mt-1">Vos Coordonnées</h2>
                                    </div>
                                </div>
                            </div>

                            <div className="p-12 space-y-8">
                                <div className="space-y-6">
                                    {[
                                        { label: 'Nom Complet', icon: User, key: 'name', placeholder: 'Votre identité' },
                                        { label: 'Email Architecture', icon: FileText, key: 'email', placeholder: 'votre@agence.com' },
                                        { label: 'Téléphone Liaison', icon: Phone, key: 'phone', placeholder: '+212 ...' },
                                        { label: 'Lieu de Livraison', icon: MapPin, key: 'address', placeholder: 'Ville, Quartier, État du projet' },
                                    ].map((field) => (
                                        <div key={field.key} className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 block px-1">{field.label}</label>
                                            <div className="relative group">
                                                <field.icon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#B8860B] transition-colors" size={18} />
                                                <input
                                                    type="text"
                                                    placeholder={field.placeholder}
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-[20px] py-4 pl-16 pr-6 text-slate-900 font-bold focus:ring-4 focus:ring-[#B8860B]/5 focus:border-[#B8860B]/30 transition-all outline-none"
                                                    value={(customerInfo as any)[field.key]}
                                                    onChange={(e) => setCustomerInfo({ ...customerInfo, [field.key]: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => {
                                        if (!customerInfo.email || !customerInfo.email.includes('@')) {
                                            showToast('Veuillez spécifier une adresse email valide pour l\'édition du devis.', 'error');
                                            return;
                                        }
                                        handleCheckout();
                                    }}
                                    disabled={isLoading}
                                    className="w-full bg-slate-900 hover:bg-[#B8860B] disabled:bg-slate-100 text-white py-6 rounded-[24px] font-black uppercase text-[10px] tracking-[0.3em] transition-all flex items-center justify-center gap-4 shadow-2xl shadow-slate-900/10"
                                >
                                    {isLoading ? (
                                        <div className="size-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>Finaliser avec la Conciergerie</>
                                    )}
                                </button>

                                <div className="text-center flex items-center justify-center gap-3 text-slate-300 font-bold uppercase tracking-widest text-[9px]">
                                    <ShieldCheck size={14} className="text-[#B8860B]" />
                                    Données sécurisées & Confidentielles
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
