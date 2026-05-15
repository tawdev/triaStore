'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MobileBottomNav() {
    const pathname = usePathname();

    const navItems = [
        { name: 'Accueil', href: '/', icon: Home },
        { name: 'Boutique', href: '/products', icon: LayoutGrid },
        { name: 'Contact', href: '/contact', icon: Phone },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-[6000] px-4 pb-6 pt-2 pointer-events-none">
            <div className="mx-auto max-w-sm bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-[32px] p-2 flex items-center justify-around pointer-events-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link 
                            key={item.name} 
                            href={item.href}
                            className="relative flex flex-col items-center justify-center py-2 px-6 rounded-2xl transition-all active:scale-90"
                        >
                            <div className="relative z-10 flex flex-col items-center gap-1">
                                <Icon 
                                    size={20} 
                                    className={`transition-colors duration-300 ${
                                        isActive ? 'text-[#B8860B]' : 'text-slate-400'
                                    }`} 
                                />
                                <span className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${
                                    isActive ? 'text-[#B8860B]' : 'text-slate-400'
                                }`}>
                                    {item.name}
                                </span>
                            </div>

                            {isActive && (
                                <motion.div
                                    layoutId="mobile-nav-pill"
                                    className="absolute inset-0 bg-[#B8860B]/5 rounded-2xl border border-[#B8860B]/10"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
