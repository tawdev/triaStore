'use client';

import React from 'react';
import { Sparkles, Star, Zap, Award } from 'lucide-react';

const TICKER_ITEMS = [
    'DESIGN EXCLUSIF',
    'TRIA LAMPE SIGNATURE',
    'ARTISANAT MAROCAIN',
    'LUMIÈRE ARCHITECTURALE',
    'L\'ART DE VIVRE',
    'COLLECTION 2024',
    'LUXE INTEMPOREL',
];

export default function BlogTicker() {
    return (
        <div className="bg-slate-900 py-3 overflow-hidden whitespace-nowrap border-y border-white/5 relative z-20">
            <div className="flex animate-marquee gap-16 items-center">
                {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                    <div key={i} className="flex items-center gap-16 group">
                        <span className="text-white font-black text-[10px] uppercase tracking-[0.4em] flex items-center gap-8">
                            {item} 
                            <Award size={14} className="text-[#B8860B] group-hover:scale-125 transition-transform" />
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
