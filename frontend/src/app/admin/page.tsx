'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api, type Order, type ProductStats, type OrderStats, type Product } from '../lib/api';
import { 
  Search, 
  ShoppingBag, 
  Image as ImageIcon, 
  AlertCircle, 
  Package, 
  ListOrdered, 
  Calendar, 
  Wallet, 
  Inbox,
  ChevronRight,
  Loader2
} from 'lucide-react';

// ─── Loading skeleton ─────────────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-100 rounded-lg ${className}`} />;
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: Order['status'] }) {
  const styles: Record<Order['status'], string> = {
    pending: 'bg-amber-50 text-amber-600 border-amber-100',
    confirmed: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    processing: 'bg-blue-50 text-blue-600 border-blue-100',
    shipped: 'bg-purple-50 text-purple-600 border-purple-100',
    completed: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    cancelled: 'bg-slate-50 text-slate-500 border-slate-100',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${styles[status]}`}>
      {status}
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const [productStats, setProductStats] = useState<ProductStats | null>(null);
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ products: Product[], orders: Order[] } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const [pStats, oStats, orders] = await Promise.all([
          api.getProductStats(),
          api.getOrderStats(),
          api.getOrders(1, 5),
        ]);
        setProductStats(pStats);
        setOrderStats(oStats);
        setRecentOrders(orders.data);
      } catch {
        setError('Impossible de se connecter au backend. Vérifiez que le serveur NestJS est lancé.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Debounced Search Logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const [products, orders] = await Promise.all([
          api.getProducts({ search: searchQuery, limit: 5 }),
          api.getOrders(1, 5, undefined, searchQuery)
        ]);
        setSearchResults({
          products: products.data,
          orders: orders.data
        });
        setShowResults(true);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <main className="flex-1 flex flex-col overflow-y-auto no-scrollbar bg-white" onClick={() => setShowResults(false)}>
      <header className="h-20 flex items-center justify-between px-8 bg-white border-b border-slate-100 sticky top-0 z-40 shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="text-slate-900 text-lg font-black tracking-tight uppercase">Tableau de bord <span className="text-[#B8860B]">Tria Lampe</span></h2>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="relative w-64 lg:w-96 hidden md:block" onClick={(e) => e.stopPropagation()}>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              className="w-full h-11 pl-12 pr-12 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-[#B8860B]/20 focus:ring-4 focus:ring-[#B8860B]/5 text-sm placeholder:text-slate-400 transition-all font-medium outline-none" 
              placeholder="Rechercher commandes, produits..." 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery && setShowResults(true)}
            />
            {isSearching && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Loader2 className="w-4 h-4 text-[#B8860B] animate-spin" />
              </div>
            )}

            {/* Search Results Dropdown */}
            {showResults && searchResults && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                <div className="max-h-[min(70vh,500px)] overflow-y-auto p-3 scrollbar-hide">
                  
                  {/* Orders Section */}
                  <div className="mb-6">
                    <div className="px-3 py-2 flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Commandes</span>
                      <Link href="/admin/orders" className="text-[10px] font-bold text-[#B8860B] hover:underline">Tout voir</Link>
                    </div>
                    {searchResults.orders.length === 0 ? (
                      <p className="px-3 py-2 text-xs text-slate-400 italic">Aucune commande trouvée</p>
                    ) : (
                      <div className="space-y-1">
                        {searchResults.orders.map(order => (
                          <Link 
                            key={order.id} 
                            href={`/admin/orders?search=${encodeURIComponent(order.customerName)}`}
                            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                          >
                            <div className="size-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                              <ShoppingBag size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-slate-900 truncate">{order.customerName}</p>
                              <p className="text-[10px] text-slate-400 truncate">#{String(order.id).padStart(4, '0')} • {Number(order.totalPrice).toFixed(2)} MAD</p>
                            </div>
                            <span className="text-[9px] font-black px-2 py-1 rounded-full bg-slate-100 text-slate-500 uppercase">
                              {order.status}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Products Section */}
                  <div>
                    <div className="px-3 py-2 flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Produits</span>
                      <Link href="/admin/products" className="text-[10px] font-bold text-[#B8860B] hover:underline">Tout voir</Link>
                    </div>
                    {searchResults.products.length === 0 ? (
                      <p className="px-3 py-2 text-xs text-slate-400 italic">Aucun produit trouvé</p>
                    ) : (
                      <div className="space-y-1">
                        {searchResults.products.map(product => (
                          <Link 
                            key={product.id} 
                            href={`/admin/products?search=${encodeURIComponent(product.name)}`}
                            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                          >
                            <div className="size-9 rounded-lg bg-slate-50 overflow-hidden relative border border-slate-100">
                              {product.imageUrl ? (
                                <Image src={product.imageUrl} alt={product.name} fill className="object-contain p-1" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                  <ImageIcon size={18} />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-slate-900 truncate">{product.name}</p>
                              <p className="text-[10px] text-slate-400 truncate">{product.category?.name || 'Sans catégorie'} • {Number(product.price).toFixed(2)} MAD</p>
                            </div>
                            <div className="text-right">
                              <p className={`text-[10px] font-bold ${product.stock > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {product.stock > 0 ? `${product.stock} dispo.` : 'Rupture'}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="p-8 space-y-8">
        {/* Error state */}
        {error && (
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-center gap-3 text-rose-600 animate-in fade-in duration-500">
            <AlertCircle size={20} />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Produits Totaux', value: productStats?.total, icon: Package, color: 'text-blue-500', bg: 'bg-blue-50' },
            { label: 'Commandes Totales', value: orderStats?.total, icon: ListOrdered, color: 'text-amber-500', bg: 'bg-amber-50' },
            { label: "Commandes d'Aujourd'hui", value: orderStats?.todayCount, icon: Calendar, color: 'text-[#B8860B]', bg: 'bg-[#B8860B]/5' },
            { label: 'Revenu Total', value: orderStats ? `${orderStats.revenue.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} MAD` : null, icon: Wallet, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-7 rounded-3xl border border-slate-100 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest">{stat.label}</p>
                {loading ? (
                  <Skeleton className="h-8 w-24 mt-2" />
                ) : (
                  <p className="text-slate-900 text-2xl font-black mt-1">
                    {stat.value !== null ? stat.value.toLocaleString() : '—'}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Orders section */}
        <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
          <div className="px-8 py-7 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
            <h3 className="text-slate-900 text-lg font-black uppercase tracking-tight">Dernières Commandes</h3>
            <Link href="/admin/orders" className="text-[11px] font-black text-[#B8860B] hover:text-slate-900 uppercase tracking-widest flex items-center gap-1 transition-colors">
              Voir tout <ChevronRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="p-8 space-y-4">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
                <Inbox size={40} />
              </div>
              <p className="text-slate-400 text-sm font-medium">Aucune commande récente pour le moment.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID Commande</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Téléphone</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Montant</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5 text-xs font-black text-[#B8860B]">#{String(order.id).padStart(4, '0')}</td>
                      <td className="px-8 py-5">
                        <p className="text-sm font-bold text-slate-900">{order.customerName}</p>
                      </td>
                      <td className="px-8 py-5 text-sm text-slate-500 font-medium">{order.phone || '—'}</td>
                      <td className="px-8 py-5 text-sm font-black text-slate-900">{Number(order.totalPrice).toFixed(2)} MAD</td>
                      <td className="px-8 py-5"><StatusBadge status={order.status} /></td>
                      <td className="px-8 py-5 text-xs text-slate-400 font-bold uppercase tracking-wider">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString('fr-FR') : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="px-8 py-5 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
              {loading ? 'Chargement...' : `${recentOrders.length} sur ${orderStats?.total ?? 0} commandes`}
            </p>
            <Link href="/admin/orders" className="px-6 py-2.5 text-[10px] font-black bg-[#B8860B] text-white rounded-full hover:bg-slate-900 transition-all uppercase tracking-widest">
              Voir tout
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
