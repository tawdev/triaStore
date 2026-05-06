'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product, Review, api } from '@/app/lib/api';
import { useWishlist } from '@/app/context/WishlistContext';
import { useCompare } from '@/app/context/CompareContext';
import { useCart } from '@/app/context/CartContext';
import { generateWhatsAppLink } from '@/app/lib/whatsapp';
import {
    Heart, ShoppingCart, Star, Truck, ShieldCheck, CreditCard,
    HelpCircle, Headphones, ChevronRight, Minus, Plus, Share2,
    Facebook, Linkedin, MessageCircleWarning, Copy as CopyIcon,
    GitCompare, MessageCircle, X, MapPin, User, Phone, CheckCircle2, FileText,
    ArrowRight, Sparkles, Zap, Award
} from 'lucide-react';
import { useNotification } from '@/app/context/NotificationContext';
import ProductImageZoom from '@/app/components/ProductImageZoom';
import RelatedProducts from '@/app/components/RelatedProducts';
import ProductRating from '@/app/components/ProductRating';
import { StoreSettings } from '@/app/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductClientProps {
    initialProduct: Product;
    initialReviews: Review[];
    settings: StoreSettings | null;
}

export default function ProductClient({ initialProduct, initialReviews, settings }: ProductClientProps) {
    const { showToast } = useNotification();
    const [product, setProduct] = useState<Product>(initialProduct);
    const [activeImage, setActiveImage] = useState<string | null>(initialProduct.imageUrl);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState<'description' | 'specification' | 'avis'>('description');
    const [reviewName, setReviewName] = useState('');
    const [reviewComment, setReviewComment] = useState('');
    const [reviewRating, setReviewRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviews, setReviews] = useState<Review[]>(initialReviews);
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { addToCart, clearCart } = useCart();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });
    const [hasReviewed, setHasReviewed] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const reviewed = JSON.parse(localStorage.getItem('reviewed_products') || '[]');
            if (reviewed.includes(product.id)) {
                setHasReviewed(true);
            }
        }
    }, [product.id]);

    const handleCheckout = async () => {
        if (!product) return;
        setIsCheckoutLoading(true);

        try {
            const now = new Date();
            const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
            const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
            const invoiceNumber = `TRIA-${datePart}-${randomPart}`;

            const orderPayload = {
                invoiceNumber,
                date: now.toISOString(),
                items: [{
                    name: product.name,
                    quantity,
                    price: Number(product.price),
                    imageUrl: product.imageUrl,
                }],
                totalPrice: Number(product.price) * quantity,
                customerInfo,
            };

            const backendOrderData = {
                customerName: customerInfo.name || 'Client WhatsApp',
                email: customerInfo.email,
                phone: customerInfo.phone,
                address: customerInfo.address,
                invoiceReference: invoiceNumber,
                totalPrice: orderPayload.totalPrice,
                items: orderPayload.items
            };

            await api.createOrder(backendOrderData as any);

            const whatsappLink = generateWhatsAppLink({
                items: orderPayload.items,
                totalPrice: orderPayload.totalPrice,
                customerInfo,
            }, settings?.phoneNumber);

            setTimeout(() => {
                window.open(whatsappLink, '_blank');
                setIsCheckoutLoading(false);
                setIsCheckingOut(false);
                setIsConfirmed(true);
                clearCart();
            }, 1000);

        } catch (error: unknown) {
            console.error('Order creation failed:', error);
            const errorMsg = error instanceof Error ? error.message : 'Une erreur est survenue lors de la création de la commande.';
            showToast(`${errorMsg} Veuillez réessayer.`, 'error');
            setIsCheckoutLoading(false);
        }
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reviewName || !reviewComment || reviewRating === 0) {
            showToast('Veuillez remplir tous les champs et donner une note.', 'error');
            return;
        }

        try {
            const submitted = await api.submitReview({
                productId: Number(product.id),
                name: reviewName,
                rating: reviewRating,
                comment: reviewComment,
            });

            const newReview: Review = {
                id: submitted?.id ?? Date.now(),
                productId: Number(product.id),
                name: reviewName,
                rating: reviewRating,
                comment: reviewComment,
                status: 'approved',
                createdAt: new Date().toISOString() as any,
            };
            setReviews((prev) => [newReview, ...prev]);

            // Save to localStorage to prevent duplicate reviews
            if (typeof window !== 'undefined') {
                const reviewed = JSON.parse(localStorage.getItem('reviewed_products') || '[]');
                localStorage.setItem('reviewed_products', JSON.stringify([...reviewed, product.id]));
                setHasReviewed(true);
            }

            showToast('Votre avis a été publié avec succès !', 'success');

            setReviewName('');
            setReviewComment('');
            setReviewRating(0);
        } catch (error) {
            console.error('Failed to submit review:', error);
            showToast('Une erreur est survenue lors de la soumission de votre avis.', 'error');
        }
    };

    const averageRating = reviews.length > 0 
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length 
        : 0;

    const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
        const rating = Math.floor(r.rating);
        if (rating >= 1 && rating <= 5) {
            ratingCounts[rating as keyof typeof ratingCounts]++;
        }
    });

    const inWishlist = isInWishlist(product.id);

    if (isConfirmed) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white min-h-[70vh]">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500">
                    <CheckCircle2 size={48} className="text-[#B8860B]" />
                </div>
                <h1 className="text-3xl font-black text-slate-900 mb-3 uppercase tracking-tighter text-center">Commande Envoyée !</h1>
                <p className="text-slate-500 mb-2 max-w-md text-center font-medium">
                    Votre commande a été envoyée sur WhatsApp. Nous vous contacterons très prochainement pour confirmer les détails de la livraison.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm mt-8">
                    <Link
                        href="/products"
                        className="flex items-center justify-center gap-2 bg-[#B8860B] text-white px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-[#966d09] transition-all shadow-xl shadow-[#B8860B]/20 flex-1"
                    >
                        Continuer mes achats
                    </Link>
                </div>
                <Link
                    href="/"
                    className="mt-6 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
                >
                    Retour à l'accueil
                </Link>
            </div>
        );
    }

    const handleShare = (platform: string) => {
        const url = typeof window !== 'undefined' ? window.location.href : '';
        const text = product.name;
        const urls: Record<string, string> = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        };
        if (urls[platform]) window.open(urls[platform], '_blank', 'width=600,height=400');
    };

    return (
        <div className="flex-1 flex flex-col bg-white">
            <div className="max-w-[1400px] mx-auto px-6">

                {/* ═══════ BREADCRUMB ═══════ */}
                <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 py-8">
                    <Link href="/" className="hover:text-[#B8860B] transition-colors">Accueil</Link>
                    <ChevronRight size={10} />
                    <Link href="/products" className="hover:text-[#B8860B] transition-colors">Boutique</Link>
                    {product.category && (
                        <>
                            <ChevronRight size={10} />
                            <Link
                                href={`/products?categoryId=${product.categoryId}`}
                                className="hover:text-[#B8860B] transition-colors"
                            >
                                {product.category.name}
                            </Link>
                        </>
                    )}
                    <ChevronRight size={10} />
                    <span className="text-slate-900">{product.name}</span>
                </nav>

                {/* ═══════ PRODUCT MAIN SECTION ═══════ */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col lg:flex-row gap-12 lg:gap-20 mb-20"
                >

                    {/* ── LEFT: Product Image & Gallery ── */}
                    <div className="w-full lg:w-[600px] flex-shrink-0">
                        <div className="relative aspect-square rounded-[40px] overflow-hidden bg-white group">
                            {activeImage ? (
                                <ProductImageZoom src={activeImage} alt={product.name} />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-200">
                                    <MessageCircleWarning size={64} strokeWidth={1} />
                                </div>
                            )}
                            
                            {/* Tags/Badges */}
                            <div className="absolute top-8 left-8 flex flex-col gap-2">
                                {product.oldPrice && product.oldPrice > product.price && (
                                    <span className="bg-[#B8860B] text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest shadow-xl">
                                        Offre Spéciale
                                    </span>
                                )}
                                {product.ecoFriendly && (
                                    <span className="bg-slate-900 text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest shadow-xl flex items-center gap-2">
                                        <Zap size={12} className="text-[#B8860B]" /> Éco-Conçu
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Thumbnail strip */}
                        {product.imageUrls && product.imageUrls.length > 1 && (
                            <div className="flex gap-4 mt-6 overflow-x-auto pb-4 custom-scrollbar-hide">
                                {product.imageUrls.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(img)}
                                        className={`size-24 flex-shrink-0 rounded-2xl border-2 transition-all p-1 bg-white overflow-hidden ${
                                            activeImage === img 
                                                ? 'border-[#B8860B] shadow-xl shadow-[#B8860B]/10 scale-105' 
                                                : 'border-slate-100 hover:border-slate-200'
                                        }`}
                                    >
                                        <Image src={img} alt="" width={100} height={100} className="w-full h-full object-cover rounded-xl" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── RIGHT: Product Info ── */}
                    <div className="flex-1">
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <ProductRating productId={product.id} starSize={14} className="!gap-1" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    {reviews.length} Avis clients
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-none mb-6 uppercase tracking-tighter">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-6">
                                <div className="flex items-baseline gap-4">
                                    <span className="text-4xl font-black text-[#B8860B] tracking-tighter">
                                        {api.formatPrice(product.price)} <span className="text-sm uppercase ml-1">MAD</span>
                                    </span>
                                    {product.oldPrice && product.oldPrice > product.price && (
                                        <span className="text-xl text-slate-300 line-through font-bold">
                                            {api.formatPrice(product.oldPrice)} MAD
                                        </span>
                                    )}
                                </div>
                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${product.stock > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                    {product.stock > 0 ? 'En Stock' : 'Rupture'}
                                </div>
                            </div>
                        </div>

                        <div className="prose prose-slate max-w-none mb-10">
                            {product.description ? (
                                <div 
                                    className="text-slate-500 text-lg leading-relaxed line-clamp-3 font-medium"
                                    dangerouslySetInnerHTML={{ __html: product.description }}
                                />
                            ) : (
                                <p className="text-slate-500 text-lg leading-relaxed font-medium">
                                    Un luminaire d'exception conçu pour sublimer votre intérieur avec élégance et modernité.
                                </p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="space-y-6 mb-12">
                            <div className="flex flex-wrap items-center gap-6">
                                <div className="flex items-center bg-slate-50 rounded-2xl p-1 border border-slate-100">
                                    <button 
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        className="size-12 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <span className="w-12 text-center font-black text-slate-900">{quantity}</span>
                                    <button 
                                        onClick={() => setQuantity(q => Math.min(q + 1, product.stock || 99))}
                                        className="size-12 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>

                                <button
                                    disabled={product.stock === 0}
                                    onClick={() => addToCart({
                                        productId: Number(product.id),
                                        name: product.name,
                                        price: product.price,
                                        imageUrl: product.imageUrl
                                    }, quantity)}
                                    className="flex-1 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#B8860B] transition-all shadow-xl shadow-slate-900/10 disabled:opacity-50"
                                >
                                    <ShoppingCart size={18} />
                                    Ajouter au panier
                                </button>

                                <motion.button
                                    whileTap={{ scale: 0.8 }}
                                    onClick={() => toggleWishlist(product.id)}
                                    className={`size-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl ${inWishlist ? 'bg-[#B8860B] text-white shadow-[#B8860B]/20' : 'bg-white border-2 border-slate-100 text-slate-300 hover:border-[#B8860B] hover:text-[#B8860B]'}`}
                                    title={inWishlist ? "Retirer des favoris" : "Ajouter aux favoris"}
                                >
                                    <Heart size={20} fill={inWishlist ? 'currentColor' : 'none'} />
                                </motion.button>
                            </div>

                            <button
                                onClick={() => setIsCheckingOut(true)}
                                className="w-full h-16 bg-[#25D366] text-white rounded-2xl flex items-center justify-center gap-4 text-[12px] font-black uppercase tracking-[0.2em] hover:bg-[#1ebc57] transition-all shadow-xl shadow-[#25D366]/20 group"
                            >
                                <MessageCircle size={24} className="group-hover:scale-110 transition-transform" />
                                Commander par WhatsApp
                            </button>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-8 py-8 border-y border-slate-100">
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Référence</h4>
                                <p className="text-sm font-bold text-slate-900">{product.sku || 'TRIA-'+product.id}</p>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Marque</h4>
                                <p className="text-sm font-bold text-[#B8860B]">{product.brand?.name || 'Tria Lampe Signature'}</p>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Livraison</h4>
                                <p className="text-sm font-bold text-slate-900">24h - 48h (Maroc)</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <button onClick={() => handleShare('facebook')} className="text-slate-300 hover:text-[#B8860B] transition-colors"><Facebook size={18} /></button>
                                <button onClick={() => handleShare('linkedin')} className="text-slate-300 hover:text-[#B8860B] transition-colors"><Linkedin size={18} /></button>
                                <button className="text-slate-300 hover:text-[#B8860B] transition-colors"><Share2 size={18} /></button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* ═══════ REVIEWS & DESCRIPTION ═══════ */}
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-32"
                >
                    <div className="flex items-center justify-center gap-12 border-b border-slate-100 mb-12">
                        {[
                            { key: 'description' as const, label: 'Description' },
                            { key: 'specification' as const, label: 'Spécifications' },
                            { key: 'avis' as const, label: `Avis Clients (${reviews.length})` },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`pb-6 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === tab.key ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                {tab.label}
                                {activeTab === tab.key && (
                                    <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-[#B8860B] rounded-t-full" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="max-w-4xl mx-auto">
                        {activeTab === 'description' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                                <div className="grid md:grid-cols-2 gap-12 items-center">
                                    <div className="prose prose-slate max-w-none">
                                        <h2 className="text-3xl font-black uppercase tracking-tight text-slate-900">L'Excellence du <span className="text-[#B8860B]">Design</span></h2>
                                        <p className="text-slate-500 text-lg leading-relaxed font-medium">Chaque luminaire Tria Lampe est une pièce d'art conçue pour transformer votre espace. Nous utilisons uniquement des matériaux nobles pour garantir une longévité et un éclat exceptionnel.</p>
                                        <ul className="space-y-4 list-none p-0">
                                            {[
                                                { icon: Sparkles, text: 'Finition artisanale haute précision' },
                                                { icon: Award, text: 'Matériaux certifiés qualité premium' },
                                                { icon: Zap, text: 'Consommation énergétique optimisée' },
                                            ].map((item, i) => (
                                                <li key={i} className="flex items-center gap-4 text-slate-900 font-bold uppercase text-xs tracking-widest">
                                                    <div className="size-8 rounded-xl bg-slate-50 flex items-center justify-center text-[#B8860B]"><item.icon size={14} /></div>
                                                    {item.text}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden bg-slate-100">
                                        <Image src={product.imageUrl || ''} alt="" fill className="object-cover opacity-80" />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'specification' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-50 rounded-[40px] p-12">
                                <table className="w-full">
                                    <tbody className="divide-y divide-slate-100">
                                        {[
                                            { label: 'Matériau Principal', value: 'Aluminium brossé / Verre soufflé' },
                                            { label: 'Source Lumineuse', value: 'LED Intégrée (Cree®)' },
                                            { label: 'Température de Couleur', value: '3000K - 4000K (Réglable)' },
                                            { label: 'Tension', value: '110V - 240V' },
                                            { label: 'Certification', value: 'CE, RoHS, IP44' },
                                            { label: 'Garantie', value: '2 Ans (Constructeur)' },
                                        ].map((row, i) => (
                                            <tr key={i}>
                                                <td className="py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">{row.label}</td>
                                                <td className="py-6 text-sm font-bold text-slate-900 text-right">{row.value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </motion.div>
                        )}

                        {activeTab === 'avis' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                                <div className="flex flex-col md:flex-row gap-12">
                                    <div className="w-full md:w-80 shrink-0">
                                        <div className="bg-slate-900 rounded-[32px] p-10 text-center">
                                            <h3 className="text-5xl font-black text-white mb-2">{averageRating.toFixed(1)}</h3>
                                            <div className="flex justify-center mb-4">
                                                <ProductRating productId={product.id} starSize={18} className="!gap-1" />
                                            </div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Note Globale</p>
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-12">
                                        {/* Review Form */}
                                        {!hasReviewed ? (
                                            <div className="bg-slate-50 rounded-[40px] p-10 border-2 border-slate-100">
                                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-8 flex items-center gap-3">
                                                    <div className="size-10 rounded-2xl bg-[#B8860B] text-white flex items-center justify-center">
                                                        <FileText size={20} />
                                                    </div>
                                                    Laisser un avis
                                                </h3>
                                                <form onSubmit={handleSubmitReview} className="space-y-6">
                                                    <div className="grid md:grid-cols-2 gap-6">
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Votre Nom</label>
                                                            <input 
                                                                type="text" 
                                                                value={reviewName}
                                                                onChange={(e) => setReviewName(e.target.value)}
                                                                className="w-full h-14 bg-white border-2 border-transparent focus:border-[#B8860B]/20 rounded-2xl px-6 font-bold text-slate-900 outline-none transition-all" 
                                                                placeholder="Ex: Jean Dupont"
                                                                required
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Note</label>
                                                            <div className="flex items-center gap-2 h-14 px-4 bg-white rounded-2xl">
                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                    <button
                                                                        key={star}
                                                                        type="button"
                                                                        onClick={() => setReviewRating(star)}
                                                                        onMouseEnter={() => setHoverRating(star)}
                                                                        onMouseLeave={() => setHoverRating(0)}
                                                                        className="p-1 transition-transform hover:scale-110"
                                                                    >
                                                                        <Star 
                                                                            size={24} 
                                                                            className={`${(hoverRating || reviewRating) >= star ? 'text-[#B8860B] fill-[#B8860B]' : 'text-slate-100'}`} 
                                                                        />
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Votre Commentaire</label>
                                                        <textarea 
                                                            value={reviewComment}
                                                            onChange={(e) => setReviewComment(e.target.value)}
                                                            className="w-full h-32 bg-white border-2 border-transparent focus:border-[#B8860B]/20 rounded-2xl px-6 py-4 font-bold text-slate-900 outline-none transition-all resize-none" 
                                                            placeholder="Partagez votre expérience avec ce produit..."
                                                            required
                                                        />
                                                    </div>
                                                    <button 
                                                        type="submit"
                                                        className="h-14 bg-[#B8860B] text-white px-10 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-[#966d09] transition-all shadow-xl shadow-[#B8860B]/20"
                                                    >
                                                        Publier mon avis
                                                    </button>
                                                </form>
                                            </div>
                                        ) : (
                                            <div className="bg-emerald-50 rounded-[40px] p-10 border-2 border-emerald-100 flex flex-col items-center text-center">
                                                <div className="size-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-4">
                                                    <CheckCircle2 size={32} />
                                                </div>
                                                <h3 className="text-xl font-black text-emerald-900 uppercase tracking-tight mb-2">Avis déjà envoyé</h3>
                                                <p className="text-emerald-600 font-medium max-w-sm">
                                                    Merci ! Vous avez déjà partagé votre avis sur ce produit. Votre contribution aide la communauté.
                                                </p>
                                            </div>
                                        )}

                                        <div className="space-y-6">
                                            {reviews.length > 0 ? (
                                                reviews.map((review) => (
                                                    <div key={review.id} className="bg-white border border-slate-50 rounded-3xl p-8 hover:shadow-xl transition-all">
                                                        <div className="flex justify-between items-start mb-4">
                                                            <div>
                                                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{review.name}</h4>
                                                                <div className="flex gap-1 mt-1">
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <Star key={i} size={10} className={i < review.rating ? 'text-[#B8860B] fill-[#B8860B]' : 'text-slate-100'} />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <span className="text-[10px] font-bold text-slate-400">{mounted ? new Date(review.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : ''}</span>
                                                        </div>
                                                        <p className="text-slate-500 text-sm leading-relaxed">{review.comment}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-20 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-100">
                                                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Aucun avis pour le moment</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                {/* Related Products */}
                <RelatedProducts currentProductId={Number(product.id)} categoryId={product.categoryId} />
            </div>

            {/* WhatsApp Checkout Modal */}
            <AnimatePresence>
                {isCheckingOut && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCheckingOut(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden">
                            <div className="p-10">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Finaliser sur <span className="text-[#25D366]">WhatsApp</span></h3>
                                    <button onClick={() => setIsCheckingOut(false)} className="size-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"><X size={20} /></button>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Nom Complet</label>
                                        <input type="text" value={customerInfo.name} onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})} className="w-full h-14 bg-slate-50 border-none rounded-2xl px-6 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-[#B8860B]/20 transition-all" placeholder="Votre nom" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Téléphone</label>
                                        <input type="tel" value={customerInfo.phone} onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})} className="w-full h-14 bg-slate-50 border-none rounded-2xl px-6 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-[#B8860B]/20 transition-all" placeholder="06 XX XX XX XX" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Adresse de Livraison</label>
                                        <textarea value={customerInfo.address} onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})} className="w-full h-32 bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-[#B8860B]/20 transition-all resize-none" placeholder="Votre adresse complète" />
                                    </div>
                                    <button
                                        disabled={isCheckoutLoading || !customerInfo.name || !customerInfo.phone}
                                        onClick={handleCheckout}
                                        className="w-full h-16 bg-[#25D366] text-white rounded-2xl flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#1ebc57] transition-all shadow-xl shadow-[#25D366]/20 disabled:opacity-50 mt-4"
                                    >
                                        {isCheckoutLoading ? <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><MessageCircle size={20} /> Envoyer la commande</>}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
