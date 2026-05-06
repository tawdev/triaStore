'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, ShieldCheck, Headphones, CheckCircle2, XCircle, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';
import { api } from '@/app/lib/api';

export default function ContactPage() {
    const { settings, loading: settingsLoading } = useSettings();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const storeName = "Tria Lampe";
    const storeAddress = settings?.address || "Angle Boulevard Anfa, Casablanca, Maroc";
    const coordPhone = settings?.phoneNumber || "+212 5 22 12 34 56";
    const coordEmail = settings?.supportEmail || "conciergerie@trialampe.ma";

    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('loading');
        
        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            subject: formData.get('subject') as string,
            message: formData.get('message') as string,
        };
        
        try {
            await api.submitInquiry(data);
            
            const waPhone = coordPhone.replace(/\D/g, '');
            const waMessage = `*Nouveau Message Conciergerie Tria*\n\n*Nom:* ${data.name}\n*Email:* ${data.email}\n*Sujet:* ${data.subject}\n*Message:* ${data.message}`;
            const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(waMessage)}`;
            
            setStatus('success');
            (e.target as HTMLFormElement).reset();
            
            setTimeout(() => {
                window.open(waUrl, '_blank');
                setStatus('idle');
            }, 1000);

        } catch (error) {
            console.error('Contact error:', error);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 5000);
        }
    };

    if (!mounted || settingsLoading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-white min-h-screen">
                <div className="size-12 border-4 border-[#B8860B] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-white min-h-screen">
            {/* Header Section with Luxury Background */}
            <div className="relative min-h-[60vh] flex items-center overflow-hidden bg-slate-900">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=2069&auto=format&fit=crop" 
                        alt="Maison Tria"
                        className="w-full h-full object-cover opacity-60 scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                </div>

                <div className="max-w-[1400px] mx-auto px-6 w-full relative z-10 py-32">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl"
                    >
                        <motion.span 
                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                            className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B8860B] mb-8 block"
                        >
                            Service Conciergerie
                        </motion.span>
                        <h1 className="text-6xl md:text-8xl font-black text-white mb-10 uppercase tracking-tighter leading-[0.9]">
                            À Votre <br/><span className="text-[#B8860B]">Écoute</span>
                        </h1>
                        <p className="text-xl text-slate-300 font-medium leading-relaxed max-w-2xl">
                            Qu'il s'agisse d'un projet d'éclairage complet ou d'une simple question sur une pièce exclusive, nos experts sont là pour vous guider dans l'excellence.
                        </p>
                    </motion.div>
                </div>
            </div>

            <main className="max-w-[1400px] mx-auto px-6 py-24">
                <div className="grid lg:grid-cols-2 gap-24">
                    
                    {/* Form Section */}
                    <motion.section 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8 }}
                      className="bg-white rounded-[50px] p-12 shadow-2xl shadow-slate-200/40 border border-slate-50"
                    >
                        <div className="flex items-center gap-4 mb-10">
                            <div className="size-12 rounded-2xl bg-slate-50 flex items-center justify-center text-[#B8860B]"><Mail size={20} /></div>
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Message <span className="text-[#B8860B]">Privé</span></h3>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Nom & Prénom</label>
                                    <input 
                                        name="name"
                                        required
                                        className="w-full h-16 px-8 rounded-3xl bg-slate-50 border-none focus:ring-2 focus:ring-[#B8860B]/20 transition-all outline-none font-bold text-slate-900" 
                                        placeholder="Votre identité" 
                                        type="text" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">E-mail</label>
                                    <input 
                                        name="email"
                                        required
                                        className="w-full h-16 px-8 rounded-3xl bg-slate-50 border-none focus:ring-2 focus:ring-[#B8860B]/20 transition-all outline-none font-bold text-slate-900" 
                                        placeholder="votre@email.com" 
                                        type="email" 
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Sujet de la demande</label>
                                <input 
                                    name="subject"
                                    required
                                    className="w-full h-16 px-8 rounded-3xl bg-slate-50 border-none focus:ring-2 focus:ring-[#B8860B]/20 transition-all outline-none font-bold text-slate-900" 
                                    placeholder="Ex: Projet Résidentiel, Question technique..." 
                                    type="text" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Message</label>
                                <textarea 
                                    name="message"
                                    required
                                    className="w-full rounded-[32px] bg-slate-50 border-none px-8 py-6 focus:ring-2 focus:ring-[#B8860B]/20 transition-all outline-none resize-none font-bold text-slate-900" 
                                    placeholder="Comment pouvons-nous vous aider ?" 
                                    rows={6}
                                ></textarea>
                            </div>

                            <AnimatePresence mode="wait">
                                {status === 'success' ? (
                                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-emerald-50 text-emerald-600 p-6 rounded-3xl flex items-center gap-4 font-bold text-sm border border-emerald-100">
                                        <CheckCircle2 size={24} /> Message transmis. Redirection WhatsApp...
                                    </motion.div>
                                ) : status === 'error' ? (
                                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-red-50 text-red-600 p-6 rounded-3xl flex items-center gap-4 font-bold text-sm border border-red-100">
                                        <XCircle size={24} /> Une erreur est survenue. Veuillez réessayer.
                                    </motion.div>
                                ) : (
                                    <button 
                                        disabled={status === 'loading'}
                                        className="w-full h-20 bg-slate-900 text-white font-black rounded-3xl hover:bg-[#B8860B] transition-all shadow-2xl shadow-slate-900/10 flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-xs" 
                                        type="submit"
                                    >
                                        {status === 'loading' ? (
                                            <div className="size-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                Envoyer la demande
                                                <ArrowRight size={18} />
                                            </>
                                        )}
                                    </button>
                                )}
                            </AnimatePresence>
                        </form>
                    </motion.section>
 
                    {/* Info & Map Section */}
                    <motion.section 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="space-y-12"
                    >
                        {/* Contact Cards */}
                        <div className="grid sm:grid-cols-2 gap-8">
                            <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 size-40 bg-[#B8860B] opacity-10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:opacity-30 transition-opacity" />
                                <Phone size={32} className="text-[#B8860B] mb-8" />
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Téléphone</h4>
                                <p className="text-xl font-bold mb-1">{coordPhone}</p>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">7j/7 • 9h - 20h</p>
                            </div>
                            <div className="bg-slate-50 rounded-[40px] p-10 relative overflow-hidden group border border-slate-100">
                                <Mail size={32} className="text-[#B8860B] mb-8" />
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Email</h4>
                                <p className="text-xl font-bold mb-1 truncate">{coordEmail}</p>
                                <p className="text-xs text-[#B8860B] font-bold uppercase tracking-widest">Réponse sous 12h</p>
                            </div>
                        </div>

                        {/* Location / WhatsApp */}
                        <div className="bg-white border-2 border-slate-50 rounded-[40px] p-10 flex items-center justify-between group hover:border-[#B8860B] transition-all">
                            <div className="flex items-center gap-6">
                                <div className="size-16 rounded-3xl bg-[#25D366]/5 flex items-center justify-center text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white transition-all shadow-xl shadow-[#25D366]/10">
                                    <MessageCircle size={32} />
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#25D366] group-hover:text-slate-900 mb-1 transition-colors">Assistance Instantanée</h4>
                                    <p className="text-xl font-black text-slate-900 uppercase tracking-tight">Direct WhatsApp</p>
                                </div>
                            </div>
                            <a 
                                href={`https://wa.me/${coordPhone.replace(/\D/g, '')}`} 
                                target="_blank"
                                className="size-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center hover:bg-[#B8860B] transition-all"
                            >
                                <ArrowRight size={20} />
                            </a>
                        </div>

                        {/* Map Preview */}
                        <div className="rounded-[50px] overflow-hidden shadow-2xl h-[400px] border-8 border-slate-50 relative group">
                            <iframe 
                                src={`https://maps.google.com/maps?q=${encodeURIComponent(storeAddress + " (Tria Lampe)")}&t=&z=15&ie=UTF8&iwloc=B&output=embed`}
                                className="absolute inset-0 w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
                                style={{ border: 0 }}
                            />
                            <div className="absolute inset-0 bg-slate-900/10 pointer-events-none group-hover:opacity-0 transition-opacity" />
                            <div className="absolute bottom-8 left-8 right-8 bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-white/40 flex items-center justify-between">
                                <div>
                                    <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Notre Adresse</h5>
                                    <p className="text-sm font-bold text-slate-900">{storeAddress}</p>
                                </div>
                                <MapPin size={24} className="text-[#B8860B]" />
                            </div>
                        </div>
                    </motion.section>
                </div>
            </main>

            {/* Newsletter / CTA */}
            <motion.section 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="bg-slate-900 py-24 overflow-hidden relative"
            >
                <div className="max-w-[1400px] mx-auto px-6 text-center relative z-10">
                    <Sparkles size={40} className="text-[#B8860B] mx-auto mb-8" />
                    <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-8 leading-none">
                        Vivez <span className="text-[#B8860B]">L'Expérience</span> Tria
                    </h2>
                    <p className="text-slate-400 text-lg font-medium max-w-xl mx-auto mb-12">
                        Inscrivez-vous pour recevoir nos invitations aux ventes privées et découvrir nos nouvelles collections en avant-première.
                    </p>
                    <div className="max-w-md mx-auto flex gap-4">
                        <input type="email" placeholder="Votre email exclusif" className="flex-1 h-16 bg-white/5 border border-white/10 rounded-2xl px-8 font-bold text-white focus:ring-2 focus:ring-[#B8860B] outline-none transition-all" />
                        <button className="bg-[#B8860B] text-white px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#966d09] transition-all">S'inscrire</button>
                    </div>
                </div>
            </motion.section>
        </div>

    );
}
