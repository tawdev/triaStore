'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { api, type Order, type OrderStats } from '../../lib/api';
import { useSearchParams } from 'next/navigation';
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Package,
  Truck,
  Clock,
  User,
  MapPin,
  Phone,
  FileText,
  MoreHorizontal,
  Mail,
  MessageCircle,
  RefreshCw,
  Eye,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Receipt,
  ShoppingCart
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';

// ─── Loading skeleton ─────────────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-100 rounded-xl ${className}`} />;
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: Order['status'] }) {
  const map: Record<Order['status'], { bg: string; text: string; icon: any; label: string }> = {
    pending: { bg: 'bg-amber-50 text-amber-600', text: 'text-amber-600', icon: Clock, label: 'En attente' },
    confirmed: { bg: 'bg-blue-50 text-blue-600', text: 'text-blue-600', icon: CheckCircle2, label: 'Confirmé' },
    processing: { bg: 'bg-indigo-50 text-indigo-600', text: 'text-indigo-600', icon: Package, label: 'En cours' },
    shipped: { bg: 'bg-purple-50 text-purple-600', text: 'text-purple-600', icon: Truck, label: 'Expédié' },
    completed: { bg: 'bg-emerald-50 text-emerald-600', text: 'text-emerald-600', icon: CheckCircle2, label: 'Livré' },
    cancelled: { bg: 'bg-rose-50 text-rose-600', text: 'text-rose-600', icon: XCircle, label: 'Annulé' },
  };
  const s = map[status] || map.pending;
  const Icon = s.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-current/10 ${s.bg} ${s.text}`}>
      <Icon size={12} />
      {s.label}
    </span>
  );
}

const STATUS_FILTERS = [
  { label: 'Tous', value: '' },
  { label: 'En attente', value: 'pending' },
  { label: 'Confirmés', value: 'confirmed' },
  { label: 'En cours', value: 'processing' },
  { label: 'Expédiés', value: 'shipped' },
  { label: 'Livrés', value: 'completed' },
  { label: 'Annulés', value: 'cancelled' },
];

function OrdersContent() {
  const { showToast } = useNotification();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get('search');

  const [stats, setStats] = useState<OrderStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState(urlSearch || '');
  const [debouncedSearch, setDebouncedSearch] = useState(urlSearch || '');
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => { setDebouncedSearch(searchQuery); }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => { setPage(1); }, [debouncedSearch, statusFilter]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [s, o] = await Promise.all([
        api.getOrderStats(),
        api.getOrders(page, 10, statusFilter || undefined, debouncedSearch || undefined),
      ]);
      setStats(s);
      setOrders(o.data);
      setTotal(o.total);
      setTotalPages(o.totalPages);
    } catch {
      showToast('Impossible de charger les commandes.', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, debouncedSearch, showToast]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleUpdateStatus = async (orderId: number, newStatus: Order['status']) => {
    try {
      setActionLoading(orderId);
      let email: string | undefined = undefined;
      if (newStatus === 'confirmed') {
        const order = orders.find(o => o.id === orderId);
        if (!order?.email) {
          const userEmail = window.prompt("Email manquant. Saisir pour envoyer le devis :");
          if (!userEmail || !userEmail.includes('@')) {
            showToast("Email valide requis.", 'error');
            return;
          }
          email = userEmail;
        }
      }
      await api.updateOrderStatus(orderId, newStatus, email);
      showToast(newStatus === 'confirmed' ? 'Commande confirmée et devis envoyé !' : 'Statut mis à jour.', 'success');
      loadData();
    } catch (err: any) {
      showToast(`Erreur: ${err.message}`, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleResendInvoice = async (orderId: number) => {
    try {
      setActionLoading(orderId);
      await api.resendInvoice(orderId);
      showToast('Devis renvoyé !', 'success');
    } catch (err: any) {
      showToast(`Erreur: ${err.message}`, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto no-scrollbar p-8 bg-white">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Gestion <span className="text-[#B8860B]">Commandes</span></h2>
          <p className="text-slate-400 mt-1 font-medium text-sm">Suivez vos ventes et gérez les flux de livraison.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              className="pl-12 pr-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-[#B8860B]/20 focus:ring-4 focus:ring-[#B8860B]/5 outline-none transition-all w-80"
              placeholder="Client, référence..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button onClick={() => loadData()} className="size-14 flex items-center justify-center bg-slate-50 rounded-2xl text-slate-400 hover:text-[#B8860B] transition-all">
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Total Commandes', value: stats?.total, icon: ShoppingCart, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'En attente', value: stats?.pending, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'Chiffre d\'Affaires', value: stats ? `${Number(stats.revenue).toLocaleString()} MAD` : null, icon: Receipt, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Aujourd\'hui', value: stats?.todayCount, icon: Package, color: 'text-indigo-500', bg: 'bg-indigo-50' },
        ].map(stat => (
          <div key={stat.label} className="bg-white border border-slate-100 rounded-[28px] p-6 shadow-sm">
            <div className={`size-12 rounded-2xl flex items-center justify-center mb-4 ${stat.bg} ${stat.color}`}>
              {stat.icon && <stat.icon size={24} />}
            </div>
            <p className="text-2xl font-black text-slate-900">{loading ? '—' : (stat.value ?? '0')}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Orders Container */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden mb-12">
        <div className="p-6 border-b border-slate-50 flex flex-wrap gap-2 items-center bg-slate-50/30">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === f.value ? 'bg-[#B8860B] text-white shadow-lg shadow-[#B8860B]/20' : 'bg-white text-slate-400 hover:text-slate-900 border border-slate-100 hover:border-slate-200'}`}
            >{f.label}</button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Réf / Client</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Détails</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {orders.length === 0 && !loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center">
                      <Receipt className="size-16 text-slate-100 mb-4" />
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Aucune commande</p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr 
                      className={`hover:bg-slate-50/50 transition-all cursor-pointer group ${expandedOrder === order.id ? 'bg-slate-50/50' : ''}`} 
                      onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    >
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{order.invoiceReference || `#${String(order.id).padStart(4, '0')}`}</span>
                          <span className="text-sm font-bold text-slate-400 mt-0.5">{order.customerName}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-sm font-black text-slate-900">{Number(order.totalPrice).toFixed(2)} MAD</span>
                      </td>
                      <td className="px-8 py-6">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="inline-flex items-center justify-center size-10 rounded-xl bg-white border border-slate-100 text-slate-300 group-hover:text-[#B8860B] group-hover:border-[#B8860B]/30 transition-all">
                          {expandedOrder === order.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                      </td>
                    </tr>

                    {expandedOrder === order.id && (
                      <tr className="bg-slate-50/30">
                        <td colSpan={5} className="px-8 py-10 border-b border-slate-100">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in slide-in-from-top-2 duration-300">
                            {/* Client Info */}
                            <div className="space-y-6">
                              <h4 className="text-[10px] font-black uppercase tracking-widest text-[#B8860B]">Coordonnées Client</h4>
                              <div className="space-y-4">
                                <div className="flex gap-4 items-center">
                                  <div className="size-10 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm"><User size={18}/></div>
                                  <span className="text-sm font-black text-slate-900">{order.customerName}</span>
                                </div>
                                <div className="flex gap-4 items-center">
                                  <div className="size-10 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm"><Mail size={18}/></div>
                                  <span className="text-sm font-bold text-slate-600 break-all">{order.email}</span>
                                </div>
                                <div className="flex gap-4 items-center">
                                  <div className="size-10 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm"><Phone size={18}/></div>
                                  <span className="text-sm font-bold text-slate-600">{order.phone || 'N/A'}</span>
                                </div>
                                <div className="flex gap-4 items-start">
                                  <div className="size-10 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm shrink-0"><MapPin size={18}/></div>
                                  <span className="text-sm font-bold text-slate-500 leading-relaxed">{order.address || 'Adresse non renseignée'}</span>
                                </div>
                              </div>
                              <a 
                                href={`https://wa.me/${order.phone?.replace(/\+/g, '')}`} 
                                target="_blank"
                                className="inline-flex items-center gap-3 px-6 py-3 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all w-full justify-center"
                              >
                                <MessageCircle size={16}/> Discuter sur WhatsApp
                              </a>
                            </div>

                            {/* Order Content */}
                            <div className="border-x border-slate-100 px-12">
                              <h4 className="text-[10px] font-black uppercase tracking-widest text-[#B8860B] mb-6">Articles de la commande</h4>
                              <div className="space-y-4 max-h-64 overflow-y-auto no-scrollbar">
                                {order.items?.map((item: any, i: number) => (
                                  <div key={i} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
                                    <div className="flex flex-col">
                                      <span className="text-sm font-black text-slate-900">{item.name}</span>
                                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Quantité: {item.quantity}</span>
                                    </div>
                                    <span className="text-sm font-black text-slate-900">{(item.price * item.quantity).toFixed(2)} MAD</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Management Actions */}
                            <div className="space-y-8">
                              <div className="p-6 bg-white rounded-3xl border border-slate-100 flex items-center justify-between shadow-sm">
                                <div className="flex items-center gap-4">
                                  <div className="size-12 bg-[#B8860B]/10 text-[#B8860B] rounded-2xl flex items-center justify-center shadow-sm">
                                    <FileText size={20}/>
                                  </div>
                                  <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Document Proforma</p>
                                    <p className="text-sm font-black text-slate-900">{order.invoiceReference || 'N/A'}</p>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Link href={`/devis?orderId=${order.id}`} className="size-10 flex items-center justify-center bg-slate-50 text-slate-400 rounded-xl hover:text-[#B8860B] transition-all"><Eye size={18}/></Link>
                                  <button onClick={() => handleResendInvoice(order.id)} disabled={actionLoading === order.id} className="size-10 flex items-center justify-center bg-slate-50 text-slate-400 rounded-xl hover:text-blue-500 transition-all">
                                    <RefreshCw size={18} className={actionLoading === order.id ? 'animate-spin' : ''}/>
                                  </button>
                                </div>
                              </div>

                              <div className="space-y-3">
                                {user?.role !== 'stock_manager' && (
                                  <div className="grid grid-cols-1 gap-3">
                                    {order.status === 'pending' && (
                                      <button onClick={() => handleUpdateStatus(order.id, 'confirmed')} disabled={actionLoading === order.id} className="w-full py-4 bg-[#B8860B] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-[#B8860B]/20 hover:bg-slate-900 transition-all flex items-center justify-center gap-3">
                                        <CheckCircle2 size={16}/> Confirmer & Envoyer Devis
                                      </button>
                                    )}
                                    {order.status === 'confirmed' && (
                                      <button onClick={() => handleUpdateStatus(order.id, 'processing')} disabled={actionLoading === order.id} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:opacity-90 transition-all flex items-center justify-center gap-3">
                                        <Package size={16}/> Lancer la préparation
                                      </button>
                                    )}
                                    {order.status === 'processing' && (
                                      <button onClick={() => handleUpdateStatus(order.id, 'shipped')} disabled={actionLoading === order.id} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3">
                                        <Truck size={16}/> Marquer comme Expédié
                                      </button>
                                    )}
                                    {order.status === 'shipped' && (
                                      <button onClick={() => handleUpdateStatus(order.id, 'completed')} disabled={actionLoading === order.id} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3">
                                        <CheckCircle2 size={16}/> Marquer comme Livré
                                      </button>
                                    )}
                                    {order.status !== 'cancelled' && order.status !== 'completed' && (
                                      <button onClick={() => handleUpdateStatus(order.id, 'cancelled')} disabled={actionLoading === order.id} className="w-full py-3 bg-white text-rose-500 border border-rose-100 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 transition-all">
                                        Annuler la commande
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {loading ? 'Chargement...' : `Page ${page} sur ${totalPages}`}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="px-5 py-2.5 rounded-full bg-white border border-slate-100 text-[10px] font-black text-slate-500 hover:bg-[#B8860B] hover:text-white transition-all disabled:opacity-50 flex items-center gap-2 uppercase tracking-widest"
            >
              <ChevronLeft size={14} /> Précédent
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || loading}
              className="px-5 py-2.5 rounded-full bg-white border border-slate-100 text-[10px] font-black text-slate-500 hover:bg-[#B8860B] hover:text-white transition-all disabled:opacity-50 flex items-center gap-2 uppercase tracking-widest"
            >
              Suivant <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center bg-white"><Loader2 className="w-10 h-10 text-[#B8860B] animate-spin" /></div>}>
      <OrdersContent />
    </Suspense>
  );
}


