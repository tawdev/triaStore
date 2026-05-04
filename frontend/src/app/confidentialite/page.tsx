'use client';

import { ShieldCheck, Eye, Lock, Database, Globe, UserCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ConfidentialitePage() {
    return (
        <div className="flex-1 bg-white min-h-screen">
            {/* Header */}
            <div className="bg-slate-50 border-b border-slate-100 py-32">
                <div className="max-w-[1400px] mx-auto px-6 text-center">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="size-20 rounded-[30px] bg-white shadow-2xl flex items-center justify-center text-[#B8860B] mx-auto mb-10"
                    >
                        <ShieldCheck size={32} />
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-black text-slate-900 mb-8 uppercase tracking-tighter leading-none"
                    >
                        Secret <span className="text-[#B8860B]">Professionnel</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed"
                    >
                        La discrétion est l'essence du luxe. Tria Lampe s'engage à protéger l'intégrité de vos données avec la plus haute exigence.
                    </motion.p>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-6 py-32">
                <div className="space-y-32">
                    {/* Intro Card */}
                    <div className="bg-slate-900 rounded-[60px] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 size-96 bg-[#B8860B] opacity-10 rounded-full -mr-48 -mt-48 blur-[100px]"></div>
                        <div className="relative z-10 max-w-3xl">
                            <h2 className="text-3xl font-black uppercase tracking-tight mb-8">Engagement de <span className="text-[#B8860B]">Confiance</span></h2>
                            <p className="text-slate-400 text-lg font-medium leading-[1.8]">
                                Cette politique définit l'usage exclusif et sécurisé de vos données au sein de la Maison Tria. En naviguant sur notre plateforme, vous bénéficiez d'une protection conforme aux standards internationaux du luxe et à la législation marocaine.
                            </p>
                        </div>
                    </div>

                    {/* Policy Sections Grid */}
                    <div className="grid grid-cols-1 gap-24">
                        {[
                            {
                                icon: <Database className="size-8" />,
                                title: "Patrimoine de Données",
                                desc: "Nous collectons uniquement les informations essentielles à votre expérience : identité, coordonnées de livraison et préférences esthétiques. Chaque donnée est traitée comme une pièce de collection, avec soin et respect.",
                                points: ["Identité civile & professionnelle", "Adresses de résidence ou de projet", "Historique de curation", "Échanges de conciergerie WhatsApp"]
                            },
                            {
                                icon: <Eye className="size-8" />,
                                title: "Curation des Informations",
                                desc: "Vos données servent exclusivement à l'excellence de notre service : traitement de vos créations, logistique d'exception et invitations à nos vernissages privés.",
                                points: ["Logistique de précision", "SAV & Maintenance", "Avant-premières exclusives", "Optimisation de l'interface"]
                            },
                            {
                                icon: <Lock className="size-8" />,
                                title: "Coffre-Fort Numérique",
                                desc: "Nos serveurs utilisent des protocoles de chiffrement de grade bancaire. Aucun tiers n'a accès à vos informations sans une nécessité absolue liée à la livraison de vos pièces.",
                                points: ["Chiffrement SSL/TLS", "Stockage sécurisé", "Audit de sécurité trimestriel", "Anonymisation des statistiques"]
                            },
                            {
                                icon: <UserCheck className="size-8" />,
                                title: "Souveraineté Individuelle",
                                desc: "Conformément à la loi 09-08, vous restez maître de vos informations. Droit d'accès, de rectification ou d'oubli total sur simple demande à notre officier de protection des données.",
                                points: ["Droit à l'oubli", "Rectification immédiate", "Transparence totale", "Contrôle des consentements"]
                            }
                        ].map((section, i) => (
                            <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 items-start group">
                                <div className="space-y-6">
                                    <div className="size-20 rounded-[32px] bg-slate-50 flex items-center justify-center text-[#B8860B] group-hover:bg-slate-900 group-hover:text-white transition-all duration-500">
                                        {section.icon}
                                    </div>
                                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{section.title}</h2>
                                </div>
                                <div className="space-y-10">
                                    <p className="text-slate-500 font-medium text-lg leading-relaxed">
                                        {section.desc}
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {section.points.map((point, j) => (
                                            <div key={j} className="flex items-center gap-4 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                                                <div className="size-1.5 rounded-full bg-[#B8860B]" />
                                                {point}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Note */}
                <div className="mt-40 pt-16 border-t border-slate-100 text-center">
                    <Sparkles className="size-8 text-[#B8860B] mx-auto mb-8 opacity-20" />
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">
                        Dernière Édition Prestige : {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }).toUpperCase()}
                    </p>
                </div>
            </div>
        </div>
    );
}
