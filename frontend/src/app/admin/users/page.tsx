'use client';

import { useEffect, useState, useCallback } from 'react';
import { api, type AdminUser, type AdminRole } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { 
    Users as UsersIcon, 
    CheckCircle2, 
    ClipboardList, 
    ShoppingCart, 
    ShieldCheck, 
    Info, 
    Plus, 
    X, 
    Save, 
    Edit2, 
    Ban, 
    Trash2,
    UserPlus,
    Loader2
} from 'lucide-react';

// ─── Role config ──────────────────────────────────────────────────────────────
const ROLE_CONFIG: Record<AdminRole, { label: string; color: string; icon: any }> = {
    admin: {
        label: 'Super Admin',
        color: 'bg-violet-50 text-violet-600 border-violet-100',
        icon: ShieldCheck,
    },
    stock_manager: {
        label: 'Gestionnaire Stock',
        color: 'bg-blue-50 text-blue-600 border-blue-100',
        icon: ClipboardList,
    },
    order_manager: {
        label: 'Gestionnaire Commandes',
        color: 'bg-amber-50 text-amber-600 border-amber-100',
        icon: ShoppingCart,
    },
};

// ─── Modal ────────────────────────────────────────────────────────────────────
function UserFormModal({
    user,
    onClose,
    onSave,
}: {
    user: AdminUser | null;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
}) {
    const isEdit = !!user;
    const [form, setForm] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        password: '',
        role: (user?.role || 'stock_manager') as AdminRole,
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload: any = { fullName: form.fullName, email: form.email, role: form.role };
            if (form.password) payload.password = form.password;
            if (!isEdit) payload.password = form.password; 
            await onSave(payload);
            onClose();
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-8 border-b border-slate-50">
                    <div>
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                            {isEdit ? 'Modifier le compte' : 'Nouveau compte'}
                        </h3>
                        <p className="text-sm text-slate-400 font-medium mt-1">
                            {isEdit ? `Édition de ${user?.fullName}` : 'Créer un gestionnaire'}
                        </p>
                    </div>
                    <button onClick={onClose} className="size-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Nom complet</label>
                        <input
                            type="text"
                            required
                            value={form.fullName}
                            onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                            className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-[#B8860B]/20 focus:ring-4 focus:ring-[#B8860B]/5 outline-none transition-all"
                            placeholder="Ex: Mohamed Alami"
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Email</label>
                        <input
                            type="email"
                            required
                            value={form.email}
                            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                            disabled={isEdit}
                            className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-[#B8860B]/20 focus:ring-4 focus:ring-[#B8860B]/5 outline-none transition-all disabled:opacity-50"
                            placeholder="email@exemple.com"
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">
                            {isEdit ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe'}
                        </label>
                        <input
                            type="password"
                            required={!isEdit}
                            value={form.password}
                            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                            className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-[#B8860B]/20 focus:ring-4 focus:ring-[#B8860B]/5 outline-none transition-all"
                            placeholder={isEdit ? 'Laisser vide pour garder l\'actuel' : '••••••••'}
                            minLength={6}
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block">Rôle et Permissions</label>
                        <div className="grid grid-cols-1 gap-3">
                            {(Object.entries(ROLE_CONFIG) as [AdminRole, typeof ROLE_CONFIG[AdminRole]][])
                                .filter(([r]) => r !== 'admin')
                                .map(([roleKey, config]) => (
                                    <label key={roleKey} className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${form.role === roleKey ? 'border-[#B8860B] bg-[#B8860B]/5' : 'border-slate-50 hover:border-slate-200'}`}>
                                        <input type="radio" name="role" value={roleKey} checked={form.role === roleKey} onChange={() => setForm(f => ({ ...f, role: roleKey }))} className="hidden" />
                                        <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${config.color}`}>
                                            <config.icon size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-black text-slate-900">{config.label}</p>
                                            <p className="text-[10px] text-slate-500 font-medium">
                                                {roleKey === 'stock_manager' ? 'Accès : Inventaire & Produits' : 'Accès : Commandes uniquement'}
                                            </p>
                                        </div>
                                        {form.role === roleKey && (
                                            <CheckCircle2 size={20} className="text-[#B8860B]" />
                                        )}
                                    </label>
                                ))
                            }
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 px-6 py-4 rounded-2xl border border-slate-100 text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-colors">
                            Annuler
                        </button>
                        <button type="submit" disabled={saving} className="flex-2 px-6 py-4 rounded-2xl bg-[#B8860B] text-white text-xs font-black uppercase tracking-widest hover:bg-slate-900 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-[#B8860B]/20">
                            {saving ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                isEdit ? <Save size={18} /> : <UserPlus size={18} />
                            )}
                            {saving ? 'Sauvegarde...' : (isEdit ? 'Enregistrer' : 'Créer')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminUsersPage() {
    const { user: currentUser } = useAuth();
    const { showToast } = useNotification();
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalUser, setModalUser] = useState<AdminUser | null | 'new'>('new' as any);
    const [modalOpen, setModalOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [togglingId, setTogglingId] = useState<number | null>(null);

    const openCreate = () => { setModalUser(null); setModalOpen(true); };
    const openEdit = (u: AdminUser) => { setModalUser(u); setModalOpen(true); };
    const closeModal = () => setModalOpen(false);

    const loadUsers = useCallback(async () => {
        try {
            setLoading(true);
            const data = await api.getAdminUsers();
            setUsers(data);
        } catch {
            showToast('Impossible de charger les utilisateurs', 'error');
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => { loadUsers(); }, [loadUsers]);

    const handleSave = async (data: any) => {
        try {
            if (modalUser && modalUser !== 'new') {
                await api.updateAdminUser((modalUser as AdminUser).id, data);
                showToast('Compte mis à jour', 'success');
            } else {
                await api.createAdminUser(data);
                showToast('Compte créé avec succès', 'success');
            }
            loadUsers();
        } catch (err: any) {
            showToast(err.message || 'Erreur lors de la sauvegarde', 'error');
            throw err;
        }
    };

    const handleToggle = async (u: AdminUser) => {
        try {
            setTogglingId(u.id);
            await api.toggleAdminUserActive(u.id);
            showToast(`Compte ${u.isActive ? 'désactivé' : 'activé'}`, 'success');
            loadUsers();
        } catch (err: any) {
            showToast(err.message || 'Erreur', 'error');
        } finally {
            setTogglingId(null);
        }
    };

    const handleDelete = async (u: AdminUser) => {
        if (!confirm(`Supprimer définitivement le compte de ${u.fullName} ?`)) return;
        try {
            setDeletingId(u.id);
            await api.deleteAdminUser(u.id);
            showToast('Compte supprimé', 'success');
            setUsers(prev => prev.filter(x => x.id !== u.id));
        } catch (err: any) {
            showToast(err.message || 'Erreur lors de la suppression', 'error');
        } finally {
            setDeletingId(null);
        }
    };

    const stats = {
        total: users.length,
        active: users.filter(u => u.isActive).length,
        stockManagers: users.filter(u => u.role === 'stock_manager').length,
        orderManagers: users.filter(u => u.role === 'order_manager').length,
    };

    return (
        <main className="flex-1 p-8 overflow-y-auto no-scrollbar bg-white">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Gestion de l&apos;Équipe</h2>
                        <p className="text-slate-400 mt-1 font-medium text-sm">Contrôlez les accès et les permissions de vos collaborateurs.</p>
                    </div>
                    <button
                        onClick={openCreate}
                        className="flex items-center gap-3 px-8 py-4 bg-[#B8860B] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#B8860B]/20 hover:bg-slate-900 transition-all"
                    >
                        <UserPlus size={18} />
                        Nouveau compte
                    </button>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {[
                        { label: 'Total comptes', value: stats.total, icon: UsersIcon, color: 'text-slate-600', bg: 'bg-slate-50' },
                        { label: 'Actifs', value: stats.active, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { label: 'Gestion Stock', value: stats.stockManagers, icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'Gestion Commandes', value: stats.orderManagers, icon: ShoppingCart, color: 'text-amber-600', bg: 'bg-amber-50' },
                    ].map(stat => (
                        <div key={stat.label} className="bg-white border border-slate-100 rounded-[28px] p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className={`size-12 rounded-2xl flex items-center justify-center mb-4 ${stat.bg} ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <p className="text-3xl font-black text-slate-900">{loading ? '—' : stat.value}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Info Box */}
                <div className="mb-10 p-6 bg-[#B8860B]/5 border border-[#B8860B]/10 rounded-[32px] flex items-start gap-4">
                    <div className="size-10 bg-white rounded-xl flex items-center justify-center text-[#B8860B] shrink-0 shadow-sm">
                        <Info size={20} />
                    </div>
                    <div className="text-sm text-slate-600">
                        <p className="font-black text-[#B8860B] uppercase tracking-widest text-[11px] mb-3">Guide des Permissions</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex items-center gap-3">
                                <div className="size-2 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.4)]" />
                                <p className="font-bold text-xs"><span className="text-slate-400">Super Admin :</span> Accès total</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="size-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
                                <p className="font-bold text-xs"><span className="text-slate-400">Stock :</span> Inventaire & Produits</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="size-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
                                <p className="font-bold text-xs"><span className="text-slate-400">Commandes :</span> Gestion ventes</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden mb-12">
                    {loading ? (
                        <div className="p-12 space-y-6">
                            {[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-slate-50 rounded-2xl animate-pulse" />)}
                        </div>
                    ) : users.length === 0 ? (
                        <div className="p-24 text-center flex flex-col items-center">
                            <div className="size-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
                                <UsersIcon size={40} />
                            </div>
                            <h4 className="font-black text-slate-900 uppercase tracking-tight text-xl">Aucun collaborateur</h4>
                            <p className="text-slate-400 mt-2 text-sm max-w-xs">Commencez par ajouter les membres de votre équipe.</p>
                            <button onClick={openCreate} className="mt-8 px-8 py-3.5 bg-[#B8860B] text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all">
                                Ajouter un membre
                            </button>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-50">
                            {users.map(u => {
                                const roleConf = ROLE_CONFIG[u.role] || ROLE_CONFIG['stock_manager'];
                                const initials = u.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                                const isSelf = currentUser?.id === u.id;
                                const Icon = roleConf.icon;

                                return (
                                    <div key={u.id} className={`flex items-center gap-6 px-8 py-6 transition-all group ${u.isActive ? 'hover:bg-slate-50/50' : 'opacity-50'}`}>
                                        {/* Avatar */}
                                        <div className={`size-14 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 border-2 transition-transform group-hover:scale-105 ${u.isActive ? 'bg-[#B8860B]/10 text-[#B8860B] border-[#B8860B]/20' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                                            {initials}
                                        </div>

                                        {/* User Details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3">
                                                <h5 className="font-black text-slate-900 text-base tracking-tight">{u.fullName}</h5>
                                                {isSelf && (
                                                    <span className="text-[10px] font-black px-2 py-0.5 bg-[#B8860B] text-white rounded-full uppercase tracking-widest">Moi</span>
                                                )}
                                                {!u.isActive && (
                                                    <span className="text-[10px] font-black px-2 py-0.5 bg-slate-200 text-slate-500 rounded-full uppercase tracking-widest">Inactif</span>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-400 font-medium truncate mt-0.5">{u.email}</p>
                                        </div>

                                        {/* Role Badge */}
                                        <div className={`hidden md:flex items-center gap-2.5 px-4 py-2 rounded-2xl border ${roleConf.color} font-black text-[10px] uppercase tracking-widest`}>
                                            <Icon size={14} />
                                            {roleConf.label}
                                        </div>

                                        {/* Date Joined */}
                                        <div className="hidden lg:flex flex-col items-end">
                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Membre depuis</span>
                                            <span className="text-xs text-slate-600 font-bold">
                                                {new Date(u.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                            </span>
                                        </div>

                                        {/* Action Menu */}
                                        {!isSelf && (
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                                <button
                                                    onClick={() => openEdit(u)}
                                                    className="size-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-[#B8860B] hover:border-[#B8860B]/30 hover:shadow-lg transition-all"
                                                    title="Modifier"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleToggle(u)}
                                                    disabled={togglingId === u.id}
                                                    className={`size-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 transition-all ${u.isActive ? 'hover:text-amber-500 hover:border-amber-200 hover:shadow-lg' : 'hover:text-emerald-500 hover:border-emerald-200 hover:shadow-lg'} text-slate-400`}
                                                    title={u.isActive ? 'Suspendre' : 'Activer'}
                                                >
                                                    {togglingId === u.id ? <Loader2 size={16} className="animate-spin" /> : (u.isActive ? <Ban size={16} /> : <CheckCircle2 size={16} />)}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(u)}
                                                    disabled={deletingId === u.id}
                                                    className="size-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:shadow-lg transition-all"
                                                    title="Supprimer"
                                                >
                                                    {deletingId === u.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {modalOpen && (
                <UserFormModal
                    user={modalUser === 'new' ? null : modalUser as AdminUser | null}
                    onClose={closeModal}
                    onSave={handleSave}
                />
            )}
        </main>
    );
}
