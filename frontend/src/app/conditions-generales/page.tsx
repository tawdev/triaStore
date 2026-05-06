'use client';

import Link from 'next/link';
import { Gavel, Scale, FileCheck, AlertCircle, ShoppingBag, CreditCard, Sparkles, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const sections = [
    {
        icon: <ShoppingBag className="size-6" />,
        title: "1. Commandes & Créations",
        content: "Les commandes de nos collections sont fermes dès validation. Pour les créations sur-mesure ou les modifications architecturales, un acompte de 50% est requis avant le lancement en atelier. Tria Lampe s'engage sur l'excellence des finitions, bien que des nuances mineures inhérentes aux matériaux naturels (laiton, cristal) puissent apparaître."
    },
    {
        icon: <Scale className="size-6" />,
        title: "2. Tarification Prestige",
        content: "Tous nos prix sont exprimés en Dirhams Marocains (MAD) TTC. Tria Lampe se réserve le droit de réviser ses tarifs selon le cours des métaux précieux, toutefois le prix validé lors de la signature du devis reste immuable."
    },
    {
        icon: <CreditCard className="size-6" />,
        title: "3. Protocole de Règlement",
        content: "Le règlement s'effectue par virement bancaire, chèque certifié ou carte bancaire. Pour les livraisons à Casablanca, le solde peut être honoré à la réception via notre terminal de paiement mobile sécurisé."
    },
    {
        icon: <ShieldCheck className="size-6" />,
        title: "4. Garantie & Responsabilité",
        content: "Nos pièces bénéficient d'une garantie de 5 ans. La responsabilité de Tria Lampe ne saurait être engagée en cas d'installation non conforme effectuée par un tiers non agréé ou d'utilisation d'ampoules de puissance supérieure aux recommandations."
    },
    {
        icon: <FileCheck className="size-6" />,
        title: "5. Propriété Artistique",
        content: "Chaque modèle Tria Lampe est une œuvre protégée. Toute reproduction, même partielle, de nos designs, schémas techniques ou visuels de campagne est strictement interdite sans autorisation écrite."
    },
    {
        icon: <Gavel className="size-6" />,
        title: "6. Juridiction d'Exception",
        content: "En cas de litige, nous privilégions toujours la médiation courtoise. À défaut, les tribunaux de Casablanca seront seuls compétents, sous l'égide du droit marocain."
    }
];

export default function ConditionsGeneralesPage() {
    const [mounted, setMounted] = (require('react') as typeof import('react')).useState(false);
    (require('react') as typeof import('react')).useEffect(() => {
        setMounted(true);
    }, []);
    return (
        <div className="flex-1 bg-white min-h-screen">
            {/* Hero Header */}
            <div className="relative py-40 bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center opacity-40 scale-105" style={{ backgroundImage: "url('/tria-crystal/hero.png')" }}></div>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent"></div>
                <div className="relative max-w-[1400px] mx-auto px-6 text-left">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-3 px-6 py-2 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full text-[#B8860B] mb-10"
                    >
                        <Gavel size={14} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Cadre Légal Tria</span>
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-8xl font-black text-white mb-8 uppercase tracking-tighter leading-none"
                    >
                        Cadre <br />
                        <span className="text-[#B8860B]">Légal</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-slate-400 font-medium max-w-2xl leading-relaxed"
                    >
                        Les conditions régissant l'acquisition de vos pièces d'exception et l'expérience Tria Lampe.
                    </motion.p>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-[1000px] mx-auto px-6 py-32">
                <div className="bg-white rounded-[60px] p-12 md:p-24 border border-slate-50 shadow-2xl shadow-slate-200/40">
                    <div className="space-y-20">
                        {sections.map((section, i) => (
                            <section key={i} className="group">
                                <div className="flex items-center gap-6 mb-8">
                                    <div className="size-16 bg-slate-50 rounded-[24px] flex items-center justify-center text-[#B8860B] group-hover:bg-slate-900 group-hover:text-white transition-all duration-500">
                                        {section.icon}
                                    </div>
                                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                                        {section.title}
                                    </h2>
                                </div>
                                <div className="pl-0 md:pl-24">
                                    <p className="text-slate-500 font-medium leading-[2] text-lg">
                                        {section.content}
                                    </p>
                                </div>
                            </section>
                        ))}
                    </div>

                    <div className="mt-32 p-12 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200 text-center">
                        <Sparkles className="size-8 text-[#B8860B] mx-auto mb-6 opacity-30" />
                        <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">
                            Mise à jour prestige : {mounted ? new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }).toUpperCase() : '...'}
                        </p>
                    </div>
                </div>
                
                <div className="mt-16 text-center">
                    <p className="text-slate-400 text-sm font-medium">
                        Pour toute clarification juridique, notre conciergerie est à votre écoute : <Link href="/contact" className="text-[#B8860B] font-black hover:underline uppercase tracking-widest ml-2">Contact</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
