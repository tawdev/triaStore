'use client';

import { RefreshCcw, ShieldCheck, HelpCircle, FileText, CheckCircle2, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function RetoursPage() {
    return (
        <div className="flex-1 bg-white">
            {/* Header Section */}
            <div className="bg-slate-50 border-b border-slate-100 py-32">
                <div className="max-w-[1400px] mx-auto px-6 text-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="size-20 rounded-[30px] bg-white shadow-2xl flex items-center justify-center text-[#B8860B] mx-auto mb-10"
                    >
                        <RefreshCcw size={32} />
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black text-slate-900 mb-8 uppercase tracking-tighter leading-none"
                    >
                        Retours & <span className="text-[#B8860B]">Échanges</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed"
                    >
                        L'excellence Tria Lampe se prolonge au-delà de l'achat. Nous assurons un service de retour d'une fluidité absolue pour votre sérénité.
                    </motion.p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-32">
                {/* 7 Days Policy */}
                <div className="bg-slate-900 rounded-[50px] p-12 md:p-20 text-white mb-24 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 size-96 bg-[#B8860B] opacity-10 rounded-full -mr-48 -mt-48 blur-[100px]"></div>
                    <div className="flex flex-col md:flex-row items-center gap-16 relative z-10">
                        <div className="shrink-0 size-40 border-4 border-[#B8860B] rounded-full flex flex-col items-center justify-center bg-white/5 backdrop-blur-xl">
                            <span className="text-6xl font-black text-[#B8860B]">07</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white mt-1">Jours</span>
                        </div>
                        <div>
                            <h2 className="text-3xl font-black mb-6 uppercase tracking-tight">Satisfaction <span className="text-[#B8860B]">Royale</span></h2>
                            <p className="text-slate-400 text-lg font-medium leading-relaxed">
                                Vous disposez de <span className="text-white font-black">7 jours</span> pour changer d'avis. Nous comprenons que l'harmonie d'un luminaire nécessite parfois de le voir in situ. Le produit doit être retourné intact, non installé, dans son écrin d'origine.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Steps Section */}
                <div className="mb-32">
                    <div className="flex items-center gap-4 mb-16">
                        <div className="w-12 h-1 bg-[#B8860B]" />
                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Le Protocole</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { icon: <MessageCircle size={28} />, title: 'Contact Privé', desc: 'Informez votre conseiller Tria via notre conciergerie WhatsApp ou par e-mail.' },
                            { icon: <FileText size={28} />, title: 'Certificat d\'Origine', desc: 'Munissez-vous de votre facture ou de votre certificat d\'authenticité TRIA.' },
                            { icon: <CheckCircle2 size={28} />, title: 'Validation Expertise', desc: 'Après retrait et inspection par nos artisans, nous validons l\'échange ou le crédit.' },
                        ].map((step, i) => (
                            <div key={i} className="bg-slate-50 p-10 rounded-[40px] border border-slate-100 group hover:bg-white hover:shadow-2xl transition-all duration-500">
                                <div className="size-16 bg-white rounded-2xl flex items-center justify-center text-[#B8860B] mb-8 shadow-xl shadow-[#B8860B]/5 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                    {step.icon}
                                </div>
                                <h4 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">{step.title}</h4>
                                <p className="text-slate-500 font-medium leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Important Notes */}
                <div className="space-y-12 bg-slate-50 rounded-[50px] p-12 md:p-20 border border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-1 bg-[#B8860B]" />
                        <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em]">Conditions d'Exception</h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-12">
                        {[
                            'Les luminaires ayant été fixés ou dont les câbles ont été coupés ne sont plus éligibles au retour.',
                            'Les créations réalisées sur-mesure (finitions spéciales) sont définitives et non échangeables.',
                            'Pour les pièces fragiles, nous recommandons le retrait par notre propre service logistique.',
                            'Le remboursement s\'effectue sous 7 jours ouvrés après validation de l\'expertise technique.'
                        ].map((note, i) => (
                            <div key={i} className="flex gap-6 items-start">
                                <div className="size-6 rounded-full bg-[#B8860B]/10 flex items-center justify-center text-[#B8860B] shrink-0 mt-1">
                                    <Sparkles size={14} />
                                </div>
                                <p className="text-slate-600 font-medium text-lg leading-relaxed">{note}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FAQ Link */}
                <div className="mt-32 text-center">
                    <Link href="/faqs" className="inline-flex items-center gap-6 px-10 py-6 bg-white rounded-full border border-slate-100 shadow-xl hover:shadow-2xl hover:border-[#B8860B]/20 transition-all group">
                        <HelpCircle size={28} className="text-[#B8860B]" />
                        <span className="text-lg font-black text-slate-900 uppercase tracking-tight">Des interrogations ?</span>
                        <div className="size-10 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:bg-[#B8860B] transition-all">
                            <ArrowRight size={20} />
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
