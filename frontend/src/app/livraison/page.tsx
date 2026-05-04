'use client';

import { Truck, Clock, MapPin, ShieldCheck, Box, CheckCircle2, Heart, Zap, MessageCircle, Sparkles, Award } from 'lucide-react';
import Link from 'next/link';
import { useSettings } from '../context/SettingsContext';
import { motion } from 'framer-motion';

export default function LivraisonPage() {
    const { settings, loading: settingsLoading } = useSettings();
    const whatsappNumber = (settings?.phoneNumber || "+212 522 123 456").replace(/\D/g, '');

    return (
        <div className="flex-1 bg-white">
            {/* Hero Section */}
            <div className="relative py-40 bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1566208532454-e53b4776e001?q=80&w=2048&auto=format&fit=crop')] bg-cover bg-center opacity-40 scale-105"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent"></div>
                <div className="relative max-w-[1400px] mx-auto px-6 text-left">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-3 px-6 py-2 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full text-[#B8860B] mb-10"
                    >
                        <Truck size={14} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Service Logistique Tria</span>
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-8xl font-black text-white mb-8 uppercase tracking-tighter leading-none"
                    >
                        L'Art de la <br />
                        <span className="text-[#B8860B]">Livraison</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-slate-400 font-medium max-w-2xl leading-relaxed"
                    >
                        De notre atelier à votre demeure, chaque luminaire Tria est transporté avec une attention méticuleuse, garantissant une intégrité absolue et un service d'exception.
                    </motion.p>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 py-32">
                {/* Key Benefits */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                    <div className="p-12 bg-slate-50 rounded-[50px] border border-slate-100 group hover:bg-white hover:shadow-2xl transition-all duration-500">
                        <div className="size-16 bg-slate-900 rounded-2xl flex items-center justify-center text-[#B8860B] mb-10 group-hover:bg-[#B8860B] group-hover:text-white transition-all">
                            <Sparkles size={32} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tight">Conditionnement Haute-Couture</h3>
                        <p className="text-slate-500 font-medium leading-relaxed">
                            Emballages sur-mesure à triple cannelure et mousses de protection spécifiques pour préserver chaque finition en laiton et cristal.
                        </p>
                    </div>
                    <div className="p-12 bg-slate-50 rounded-[50px] border border-slate-100 group hover:bg-white hover:shadow-2xl transition-all duration-500">
                        <div className="size-16 bg-slate-900 rounded-2xl flex items-center justify-center text-[#B8860B] mb-10 group-hover:bg-[#B8860B] group-hover:text-white transition-all">
                            <Clock size={32} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tight">Rendez-vous Privé</h3>
                        <p className="text-slate-500 font-medium leading-relaxed">
                            Nous planifions ensemble le créneau idéal. Livraison sur rendez-vous pour s'adapter parfaitement à votre agenda.
                        </p>
                    </div>
                    <div className="p-12 bg-slate-50 rounded-[50px] border border-slate-100 group hover:bg-white hover:shadow-2xl transition-all duration-500">
                        <div className="size-16 bg-slate-900 rounded-2xl flex items-center justify-center text-[#B8860B] mb-10 group-hover:bg-[#B8860B] group-hover:text-white transition-all">
                            <Award size={32} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tight">Installation Signature</h3>
                        <p className="text-slate-500 font-medium leading-relaxed">
                            Option de montage par nos experts certifiés pour une mise en lumière immédiate et sécurisée de vos espaces.
                        </p>
                    </div>
                </div>

                {/* Detailed Process */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-32">
                    <div className="relative">
                        <div className="aspect-square rounded-[60px] overflow-hidden shadow-2xl">
                            <img 
                                src="https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=800" 
                                alt="Tria Delivery" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-10 -right-10 size-48 bg-[#B8860B] rounded-[40px] flex items-center justify-center shadow-2xl rotate-6">
                            <ShieldCheck size={64} className="text-white -rotate-6" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-12 uppercase tracking-tighter leading-none">
                            L'Expérience de <br /><span className="text-[#B8860B]">Réception</span>
                        </h2>
                        <div className="space-y-12">
                            {[
                                { title: 'Inspection Préparatoire', desc: 'Chaque pièce subit un test d\'allumage et une inspection visuelle sous lumière rasante avant d\'être scellée.' },
                                { title: 'Protection de Surface', desc: 'Application d\'un film protecteur sur les finitions brossées et polies pour éviter toute trace lors du déballage.' },
                                { title: 'Logistique Dédiée', desc: 'Utilisation de nos propres véhicules pour les livraisons à Casablanca afin de garantir une manipulation zéro défaut.' },
                                { title: 'Conciergerie de Suivi', desc: 'Un conseiller personnel vous informe par SMS et appel dès que votre luminaire approche de sa destination.' },
                            ].map((step, i) => (
                                <div key={i} className="flex gap-10 group">
                                    <div className="shrink-0 size-14 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center font-black text-2xl border border-slate-100 group-hover:bg-[#B8860B] group-hover:text-white transition-all">
                                        0{i + 1}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-tight">{step.title}</h4>
                                        <p className="text-slate-500 font-medium leading-relaxed">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Pricing Table */}
                <div className="bg-slate-900 rounded-[60px] p-12 md:p-24 text-white relative overflow-hidden mb-32 shadow-2xl">
                    <div className="absolute top-0 right-0 size-96 bg-[#B8860B] opacity-10 rounded-full -mr-48 -mt-48 blur-[100px]"></div>
                    
                    <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-20">
                        <div>
                            <h3 className="text-4xl font-black mb-10 uppercase tracking-tighter">Grille de <span className="text-[#B8860B]">Courtoisie</span></h3>
                            <p className="text-slate-400 font-medium mb-12 leading-relaxed italic">
                                Nous appliquons des tarifs transparents basés sur la spécificité de manipulation des pièces d'exception.
                            </p>
                            <div className="space-y-4">
                                {[
                                    { region: 'Casablanca (Showroom & Proximité)', price: 'Offert' },
                                    { region: 'Axe Rabat - Mohammedia', price: '150 MAD' },
                                    { region: 'Marrakech - Tanger - Agadir', price: '250 MAD' },
                                    { region: 'Autres Régions du Royaume', price: '350 MAD' },
                                ].map((row, i) => (
                                    <div key={i} className="flex justify-between items-center p-8 bg-white/5 rounded-3xl border border-white/5 hover:border-[#B8860B]/30 hover:bg-white/10 transition-all group">
                                        <span className="text-slate-300 font-black uppercase tracking-[0.2em] text-[10px]">{row.region}</span>
                                        <span className={`text-2xl font-black ${row.price === 'Offert' ? 'text-[#B8860B]' : 'text-white'}`}>{row.price}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-[#B8860B] rounded-[50px] p-16 flex flex-col justify-center items-center text-center shadow-2xl">
                            <div className="size-24 bg-white/20 rounded-3xl flex items-center justify-center mb-10">
                                <CheckCircle2 size={48} className="text-white" />
                            </div>
                            <h4 className="text-4xl font-black mb-6 uppercase tracking-tighter">Livraison <br/>Prestige</h4>
                            <p className="text-white/80 font-medium mb-12 leading-relaxed">
                                Gratuite pour toute commande supérieure à 
                                <span className="block text-5xl font-black text-slate-900 mt-4">2 500 MAD</span>
                            </p>
                            <Link href="/products" className="w-full py-6 bg-slate-900 text-white rounded-[24px] font-black uppercase tracking-[0.2em] text-xs hover:bg-black transition-all shadow-xl">
                                Explorer le Catalogue
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Final CTA */}
                <div className="text-center bg-slate-50 rounded-[60px] py-32 px-8 relative overflow-hidden">
                    <Sparkles size={48} className="text-[#B8860B] mx-auto mb-10" />
                    <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-10 uppercase tracking-tighter">
                        Une Demande <br/><span className="text-[#B8860B]">Spécifique</span> ?
                    </h2>
                    <p className="text-slate-500 font-medium mb-12 max-w-2xl mx-auto text-lg leading-relaxed">
                        Pour des projets hôteliers ou des installations hors-norme, notre service logistique dédié élabore des solutions de transport sur-mesure.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
                        <Link 
                            href={`https://wa.me/${whatsappNumber}`} 
                            className="inline-flex h-20 items-center px-12 bg-slate-900 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-3xl hover:bg-[#B8860B] transition-all shadow-2xl"
                        >
                            Conciergerie WhatsApp
                        </Link>
                        <Link 
                            href="/contact" 
                            className="inline-flex h-20 items-center px-12 bg-white text-slate-900 font-black uppercase tracking-[0.2em] text-[10px] border border-slate-200 rounded-3xl hover:bg-slate-50 transition-all"
                        >
                            Contacter l'Expertise
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
