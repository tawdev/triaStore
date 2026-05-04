'use client';

import Link from 'next/link';
import { 
    Facebook, 
    Instagram, 
    Twitter, 
    Youtube, 
    Mail, 
    Phone, 
    MapPin, 
    ChevronUp,
    Sparkles,
    ArrowRight,
    ShieldCheck
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Footer() {
    const [mounted, setMounted] = useState(false);
    const currentYear = new Date().getFullYear();

    useEffect(() => {
        setMounted(true);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (!mounted) return null;

    return (
        <footer className="bg-white pt-32 pb-12 border-t border-slate-50 font-outfit relative overflow-hidden">
            {/* Ambient background decoration */}
            <div className="absolute bottom-0 left-0 size-96 bg-[#B8860B] opacity-[0.03] rounded-full blur-[120px] -ml-48 -mb-48" />

            <div className="mx-auto max-w-[1440px] px-6 sm:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-24 mb-24">
                    
                    {/* Brand Pillar */}
                    <div className="lg:col-span-4 space-y-10">
                        <Link href="/" className="flex flex-col">
                            <span className="text-3xl font-black tracking-tighter text-slate-900 leading-none">
                                TRIA <span className="text-[#B8860B]">LAMPE</span>
                            </span>
                            <span className="text-[10px] font-black tracking-[0.5em] text-slate-400 uppercase mt-2">
                                L'Art de la Lumière
                            </span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-sm font-medium">
                            Chaque création Tria Lampe est une pièce d'exception, conçue pour magnifier l'architecture et sublimer l'atmosphère de vos espaces de vie les plus prestigieux.
                        </p>
                        <div className="flex gap-4">
                            {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                                <Link key={i} href="#" className="size-11 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-500 shadow-sm">
                                    <Icon size={18} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Links Grid */}
                    <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-2 gap-12">
                        {/* Service & Experience */}
                        <div className="space-y-10">
                            <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-900 flex items-center gap-3">
                                <div className="h-[2px] w-4 bg-[#B8860B]" />
                                Expérience
                            </h4>
                            <ul className="space-y-5">
                                {[
                                    { name: 'Conciergerie', href: '/contact' },
                                    { name: 'Assistance VIP', href: '/faqs' },
                                    { name: 'Livraison Prestige', href: '/livraison' },
                                    { name: 'Satisfaction Royale', href: '/retours' },
                                    { name: 'Garantie Atelier', href: '/conditions-generales' }
                                ].map((item) => (
                                    <li key={item.name}>
                                        <Link href={item.href} className="text-xs font-black text-slate-400 hover:text-[#B8860B] transition-colors uppercase tracking-widest flex items-center gap-3 group">
                                            <div className="size-1 rounded-full bg-slate-100 group-hover:bg-[#B8860B] transition-all" />
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Collections */}
                        <div className="space-y-10">
                            <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-900 flex items-center gap-3">
                                <div className="h-[2px] w-4 bg-[#B8860B]" />
                                Collections
                            </h4>
                            <ul className="space-y-5">
                                {[
                                    { name: 'La Galerie', href: '/products' },
                                    { name: 'Nouveautés', href: '/products?sort=newest' },
                                    { name: 'Luminaires d\'Art', href: '/products' },
                                    { name: 'À Propos', href: '/about' },
                                    { name: 'Journal', href: '/blog' }
                                ].map((item) => (
                                    <li key={item.name}>
                                        <Link href={item.href} className="text-xs font-black text-slate-400 hover:text-[#B8860B] transition-colors uppercase tracking-widest flex items-center gap-3 group">
                                            <div className="size-1 rounded-full bg-slate-100 group-hover:bg-[#B8860B] transition-all" />
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Contact & Newsletter Placeholder */}
                    <div className="lg:col-span-3 space-y-12">
                        <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 size-32 bg-[#B8860B] opacity-10 rounded-full -mr-16 -mt-16 blur-2xl" />
                            <Sparkles className="size-6 text-[#B8860B] mb-6" />
                            <h4 className="text-lg font-black uppercase tracking-tight mb-4 leading-tight">Rejoignez le <br/><span className="text-[#B8860B]">Cercle Privé</span></h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-8 leading-relaxed">Invitations exclusives et avant-premières sur nos nouvelles créations.</p>
                            <Link href="/blog" className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[#B8860B] group">
                                S'INSCRIRE <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                            </Link>
                        </div>
                        
                        <div className="space-y-6 px-4">
                            <div className="flex items-center gap-4 group">
                                <div className="size-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#B8860B] group-hover:bg-slate-900 group-hover:text-white transition-all">
                                    <Phone size={16} />
                                </div>
                                <span className="text-xs font-black text-slate-900 tracking-widest uppercase">05 22 XX XX XX</span>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="size-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#B8860B] group-hover:bg-slate-900 group-hover:text-white transition-all">
                                    <Mail size={16} />
                                </div>
                                <span className="text-xs font-black text-slate-900 tracking-widest uppercase">concierge@trialampe.ma</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-8 relative">
                    <div className="flex items-center gap-8">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                            © {currentYear} TRIA LAMPE MAISON D'EXCEPTION.
                        </p>
                        <div className="hidden md:flex items-center gap-6">
                            <Link href="/confidentialite" className="text-[10px] font-black text-slate-300 hover:text-slate-900 transition-colors uppercase tracking-widest">Confidentialité</Link>
                            <Link href="/conditions-generales" className="text-[10px] font-black text-slate-300 hover:text-slate-900 transition-colors uppercase tracking-widest">Mentions Légales</Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-8 opacity-40 hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-4 text-[9px] font-black tracking-widest text-slate-400">
                            <ShieldCheck size={14} className="text-[#B8860B]" />
                            PAIEMENT SÉCURISÉ
                        </div>
                        <div className="flex items-center gap-6 grayscale scale-75 md:scale-90">
                            {['VISA', 'MASTERCARD', 'CMI'].map((brand) => (
                                <span key={brand} className="text-[10px] font-black tracking-[0.2em]">{brand}</span>
                            ))}
                        </div>
                    </div>

                    <button 
                        onClick={scrollToTop}
                        className="size-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center hover:bg-[#B8860B] transition-all shadow-xl shadow-slate-900/10 active:scale-90"
                    >
                        <ChevronUp size={24} />
                    </button>
                </div>
            </div>
        </footer>
    );
}
