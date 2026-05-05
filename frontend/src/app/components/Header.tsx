'use client';

import { useSettings } from '@/app/context/SettingsContext';
import { Phone, Truck, Lightbulb, Facebook, Instagram } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Header() {
    const { settings } = useSettings();
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();
    const isHome = pathname === '/';

    useEffect(() => {
        setMounted(true);
    }, []);

    // On home page, we might want to hide the top bar initially or keep it very subtle
    // For now, let's keep it but make it transparent if on home and not scrolled
    // However, the Navbar already handles its own transparency.
    // Let's make the Top Bar always present but very slim.

    return (
        <header className="w-full bg-[#0D0D0D] py-2 text-white/90 relative z-[6000] print:hidden font-outfit">
            <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 sm:px-12">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                        <Truck size={12} className="text-[#B8860B]" />
                        <span className="hidden sm:inline">Livraison Prestige Offerte dès 1000 MAD</span>
                        <span className="sm:hidden">Livraison Offerte</span>
                    </div>
                </div>
                
                <div className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#B8860B]">
                    <Sparkles size={12} />
                    <span>L'Excellence du Luminaire au Maroc</span>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                        <Phone size={12} className="text-[#B8860B]" />
                        <span>{mounted ? (settings?.phoneNumber || '+212 5 22 92 36 24') : '+212 5 22 92 36 24'}</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-4 border-l border-white/10 pl-6">
                        <a href={mounted ? (settings?.facebookUrl || '#') : '#'} target="_blank" className="hover:text-[#B8860B] transition-colors"><Facebook size={12} /></a>
                        <a href={mounted ? (settings?.instagramUrl || '#') : '#'} target="_blank" className="hover:text-[#B8860B] transition-colors"><Instagram size={12} /></a>
                    </div>
                </div>
            </div>
        </header>
    );
}

function Sparkles({ size, className }: { size?: number, className?: string }) {
    return (
        <svg 
            width={size || 16} 
            height={size || 16} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4" />
            <path d="M19 17v4" />
            <path d="M3 5h4" />
            <path d="M17 19h4" />
        </svg>
    );
}
