'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { api } from '../lib/api';
import { 
    LayoutDashboard, 
    Package, 
    Layers, 
    ShoppingCart, 
    ClipboardList, 
    FileText, 
    CheckSquare, 
    HelpCircle, 
    MessageSquare, 
    Star, 
    Quote, 
    BarChart3, 
    Users, 
    Settings,
    LogOut,
    Menu,
    X,
    AlertCircle,
    Bell
} from 'lucide-react';

// ─── Nav items with role restrictions ────────────────────────────────────────
const navItems = [
    { label: 'Dashboard',       href: '/admin',              icon: LayoutDashboard, roles: ['admin'] },
    { label: 'Produits',        href: '/admin/products',     icon: Package,         roles: ['admin', 'stock_manager'] },
    { label: 'Catégories',      href: '/admin/categories',   icon: Layers,          roles: ['admin', 'stock_manager'] },
    { label: 'Commandes',       href: '/admin/orders',       icon: ShoppingCart,    roles: ['admin', 'order_manager', 'stock_manager'] },
    { label: 'Inventaire',      href: '/admin/inventory',    icon: ClipboardList,   roles: ['admin', 'stock_manager'], stockAlert: true },
    { label: 'Blog',            href: '/admin/blog',         icon: FileText,        roles: ['admin', 'order_manager'] },
    { label: 'Marques',         href: '/admin/brands',       icon: CheckSquare,     roles: ['admin'] },
    { label: 'FAQs',            href: '/admin/faqs',         icon: HelpCircle,      roles: ['admin'] },
    { label: 'Messages',        href: '/admin/inquiries',    icon: MessageSquare,   roles: ['admin'] },
    { label: 'Avis Clients',    href: '/admin/reviews',      icon: Star,            roles: ['admin', 'order_manager'] },
    { label: 'Témoignages',     href: '/admin/testimonials', icon: Quote,           roles: ['admin'] },
    { label: 'Analyses',        href: '/admin/analytics',    icon: BarChart3,       roles: ['admin'] },
    { label: 'Utilisateurs',    href: '/admin/users',        icon: Users,           roles: ['admin'] },
    { label: 'Paramètres',      href: '/admin/settings',     icon: Settings,        roles: ['admin'] },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const { settings } = useSettings();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [lowStockCount, setLowStockCount] = useState(0);

    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    useEffect(() => {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }, [pathname]);

    const loadStockAlert = useCallback(async () => {
        if (!user || (user.role !== 'admin' && user.role !== 'stock_manager')) return;
        try {
            const res = await api.getProducts({ page: 1, limit: 100 });
            const low = res.data.filter(p => p.stock <= 10).length;
            setLowStockCount(low);
        } catch {
            // Silently fail
        }
    }, [user]);

    useEffect(() => {
        loadStockAlert();
        const interval = setInterval(loadStockAlert, 60_000);
        return () => clearInterval(interval);
    }, [loadStockAlert]);

    const initials = user?.fullName
        ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'AD';

    const roleLabel: Record<string, string> = {
        admin: 'Super Admin',
        stock_manager: 'Gest. Stock',
        order_manager: 'Gest. Commandes',
        customer: 'Client',
    };

    const visibleNavItems = navItems.filter(item => {
        if (!user) return false;
        return item.roles.includes(user.role);
    });

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    return (
        <div className="light bg-[#F8FAFC] text-slate-900 antialiased min-h-screen" style={{ '--primary': '#B8860B' } as React.CSSProperties}>
            <div className="flex h-screen overflow-hidden">
                {/* Mobile Backdrop Overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[45] lg:hidden animate-in fade-in duration-300"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar Drawer */}
                <aside className={`fixed lg:static inset-y-0 left-0 w-72 lg:w-64 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col h-full z-[50] transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <Link href="/admin" className="flex flex-col gap-0.5 group">
                            <span className="text-xl font-black tracking-tighter text-slate-900 leading-none">
                                TRIA <span className="text-[#B8860B]">LAMPE</span>
                            </span>
                            <span className="text-[7px] font-black tracking-[0.4em] text-slate-400 uppercase">
                                Lumière & Design
                            </span>
                        </Link>
                        {/* Mobile close button */}
                        <button
                            className="lg:hidden text-slate-400 hover:text-slate-900"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar py-6">
                        {visibleNavItems.map((item) => {
                            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href + '/'));
                            const showBadge = item.stockAlert && lowStockCount > 0;
                            const Icon = item.icon;
                            
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                        ? 'bg-[#B8860B]/10 text-[#B8860B]'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-[#B8860B]'
                                    }`}
                                >
                                    <Icon size={20} className={`${isActive ? 'text-[#B8860B]' : 'group-hover:text-[#B8860B]'}`} />
                                    <span className={`text-sm tracking-tight flex-1 ${isActive ? 'font-bold' : 'font-medium'}`}>
                                        {item.label}
                                    </span>
                                    {showBadge && (
                                        <span className="shrink-0 min-w-[20px] h-5 px-1.5 bg-amber-500 text-white rounded-full text-[10px] font-black flex items-center justify-center animate-pulse">
                                            {lowStockCount}
                                        </span>
                                    )}
                                    {isActive && !showBadge && (
                                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#B8860B]" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User card at bottom */}
                    <div className="p-4 mt-auto border-t border-slate-100">
                        <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
                            <div className="size-10 rounded-full bg-[#B8860B]/20 flex items-center justify-center text-[#B8860B] font-bold text-sm uppercase">
                                {initials}
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-sm font-bold text-slate-900 truncate">
                                    {user?.fullName || 'Admin User'}
                                </span>
                                <span className="text-[11px] text-slate-500 truncate">
                                    {roleLabel[user?.role || 'admin']}
                                </span>
                            </div>
                            <button
                                onClick={logout}
                                className="ml-auto text-slate-400 hover:text-red-500 transition-colors"
                                title="Se déconnecter"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Area */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                    {/* Mobile Header Toggle */}
                    <div className="lg:hidden h-14 shrink-0 bg-white border-b border-slate-200 flex items-center px-4 z-40">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                        <span className="ml-3 font-bold text-slate-900 uppercase tracking-widest text-xs">TRIA LAMPE ADMIN</span>
                        {lowStockCount > 0 && (
                            <span className="ml-auto flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                                <AlertCircle size={14} className="animate-pulse" />
                                {lowStockCount} alertes
                            </span>
                        )}
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
