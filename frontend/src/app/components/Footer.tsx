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
import { useSettings } from '../context/SettingsContext';

export default function Footer() {
    const [mounted, setMounted] = useState(false);
    const [year, setYear] = useState<number>(2025);
    const { settings } = useSettings();

    useEffect(() => {
        setMounted(true);
        setYear(new Date().getFullYear());
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (!mounted) return null;

    const storeName = settings?.storeName || 'TRIA LAMPE';
    const storeEmail = settings?.supportEmail || 'concierge@trialampe.ma';
    const phoneNumber = settings?.phoneNumber || '+212 5 22 92 36 24';
    const address = settings?.address || '48 Lot IGUIDER Allal El Fasi Marrakech';
    const facebookUrl = settings?.facebookUrl || '#';
    const instagramUrl = settings?.instagramUrl || '#';
    const storeDescription = settings?.description || "Chaque création Tria Lampe est une pièce d'exception, conçue pour magnifier l'architecture et sublimer l'atmosphère de vos espaces de vie les plus prestigieux.";

    return (
        <footer className="bg-[#FBFBFB] pt-16 pb-10 border-t border-slate-100 font-outfit relative overflow-hidden">
            {/* Architectural Grid Decoration */}
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.015] pointer-events-none" 
                 style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '80px 80px' }} 
            />

            <div className="mx-auto max-w-[1440px] px-8 sm:px-12 relative z-10">
                {/* Upper Section: Brand & Newsletter */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
                    <div className="lg:col-span-5 space-y-8">
                        <Link href="/" className="inline-block group">
                            {settings?.logoUrl ? (
                                <img src={settings.logoUrl} alt={storeName} className="h-12 w-auto object-contain" />
                            ) : (
                                <div className="flex flex-col">
                                    <span className="text-3xl font-bold tracking-tighter text-slate-900 leading-none">
                                        TRIA<span className="text-[#B8860B]">.</span>
                                    </span>
                                    <span className="text-[8px] font-bold tracking-[0.5em] text-slate-400 uppercase mt-2">
                                        L'ART DE LA LUMIÈRE
                                    </span>
                                </div>
                            )}
                        </Link>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-sm font-medium italic opacity-80">
                            "{storeDescription}"
                        </p>
                        <div className="flex gap-5">
                            {[
                                { icon: Instagram, href: instagramUrl },
                                { icon: Facebook, href: facebookUrl },
                                { icon: Twitter, href: '#' }
                            ].map((social, i) => (
                                <Link key={i} href={social.href} className="text-slate-300 hover:text-[#B8860B] transition-colors duration-500">
                                    <social.icon size={18} strokeWidth={1.5} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-7">
                        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 size-32 bg-[#B8860B]/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                            <div className="flex-1 space-y-2">
                                <h4 className="text-lg font-bold text-slate-900 tracking-tight uppercase italic">La <span className="text-[#B8860B]">Maison Tria</span></h4>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">Invitations exclusives sur nos collections d'exception.</p>
                            </div>
                            <div className="w-full md:w-auto shrink-0">
                                <Link href="/blog" className="inline-flex items-center gap-3 bg-slate-900 text-white px-7 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#B8860B] transition-all duration-500">
                                    S'ABONNER <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Middle Section: Navigation & Contact */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16 border-t border-slate-100 pt-16">
                    <div className="space-y-6">
                        <h5 className="text-[9px] font-black uppercase tracking-[0.3em] text-[#B8860B]">Découvrir</h5>
                        <ul className="space-y-4">
                            {[{ name: 'La Boutique', href: '/products' }, { name: 'Nouveautés', href: '/products?sort=newest' }, { name: 'Pièces d\'Art', href: '/products' }, { name: 'Le Blog', href: '/blog' }].map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-[10px] font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">{link.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h5 className="text-[9px] font-black uppercase tracking-[0.3em] text-[#B8860B]">Expérience</h5>
                        <ul className="space-y-4">
                            {[{ name: 'Conciergerie', href: '/contact' }, { name: 'Assistance VIP', href: '/faqs' }, { name: 'À Propos', href: '/about' }, { name: 'Collaborations', href: '/contact' }].map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-[10px] font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">{link.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h5 className="text-[9px] font-black uppercase tracking-[0.3em] text-[#B8860B]">Légal</h5>
                        <ul className="space-y-4">
                            {[{ name: 'Confidentialité', href: '/confidentialite' }, { name: 'Mentions Légales', href: '/conditions-generales' }, { name: 'Livraison', href: '/livraison' }, { name: 'Retours', href: '/retours' }].map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-[10px] font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">{link.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h5 className="text-[9px] font-black uppercase tracking-[0.3em] text-[#B8860B]">Contact</h5>
                        <div className="space-y-5">
                            <div className="flex flex-col gap-1">
                                <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Téléphone</span>
                                <a href={`tel:${phoneNumber}`} className="text-xs font-bold text-slate-900 hover:text-[#B8860B] transition-colors">{phoneNumber}</a>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Conciergerie</span>
                                <a href={`mailto:${storeEmail}`} className="text-xs font-bold text-slate-900 hover:text-[#B8860B] transition-colors break-all">{storeEmail}</a>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Atelier</span>
                                <p className="text-xs font-bold text-slate-900 leading-relaxed">{address}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar: Ethics & Compliance */}
                <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">
                            © {year} <Link href="https://cdigital.ma/" target="_blank" className="text-[#B8860B] hover:opacity-80 transition-opacity">cdigital</Link>. ALL RIGHTS RESERVED.
                        </p>
                        <div className="flex items-center gap-4 text-[8px] font-black text-slate-200 uppercase tracking-[0.2em]">
                            <span>Maroc</span>
                            <div className="size-1 rounded-full bg-slate-100" />
                            <span>International Shipping</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-8 grayscale opacity-30 hover:opacity-100 transition-all duration-700">
                        <div className="flex items-center gap-2 text-[7px] font-black tracking-[0.3em] text-slate-400">
                            <ShieldCheck size={12} className="text-[#B8860B]" />
                            SECURE
                        </div>
                        <div className="flex items-center gap-5">
                            {['VISA', 'MASTERCARD', 'CMI'].map((brand) => (
                                <span key={brand} className="text-[8px] font-black tracking-[0.2em] text-slate-900">{brand}</span>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={scrollToTop}
                        className="group flex items-center gap-3"
                    >
                        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-300 group-hover:text-slate-900 transition-colors">HAUT</span>
                        <div className="size-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                            <ChevronUp size={16} />
                        </div>
                    </button>
                </div>
            </div>
        </footer>
    );
}
