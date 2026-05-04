'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, Search, MessageCircle, Phone, Mail, Sparkles, Lightbulb, ShieldCheck, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
    {
        category: 'Collections & Design',
        icon: <Lightbulb className="size-5" />,
        items: [
            {
                q: 'Comment sont fabriqués les luminaires Tria Lampe ?',
                a: "Chaque pièce est le fruit d'un artisanat d'excellence. Nous utilisons des matériaux nobles tels que le laiton massif, le cristal de Bohême et le verre soufflé à la bouche. Nos ateliers à Casablanca allient techniques ancestrales et précision moderne."
            },
            {
                q: 'Puis-je personnaliser un modèle existant ?',
                a: "Absolument. Notre service sur-mesure vous permet de choisir les finitions (laiton poli, brossé, noir mat), la longueur des câbles ou encore la température de couleur des LEDs pour s'adapter parfaitement à votre architecture."
            },
            {
                q: 'Les ampoules sont-elles incluses ?',
                a: "La majorité de nos créations intègrent des modules LED de haute performance (Cree® ou Samsung®). Pour les modèles à douilles, nous fournissons gracieusement des ampoules vintage ou design assorties au style de la lampe."
            }
        ]
    },
    {
        category: 'Installation & Livraison',
        icon: <Truck className="size-5" />,
        items: [
            {
                q: 'Proposez-vous un service d\'installation ?',
                a: "Oui, pour les pièces complexes ou les lustres de grande envergure, nous mettons à votre disposition nos électriciens partenaires certifiés partout au Maroc pour garantir une pose sécurisée et impeccable."
            },
            {
                q: 'Quels sont les délais de livraison pour le Maroc ?',
                a: "Les pièces en stock sont livrées sous 24h à 48h. Pour les créations sur-mesure ou en cours de fabrication, le délai varie généralement entre 2 et 4 semaines."
            },
            {
                q: 'Le transport est-il sécurisé pour les pièces fragiles ?',
                a: "Nous avons développé un emballage haute résistance spécifique à chaque modèle. Chaque envoi est assuré à 100% de sa valeur et transporté par nos partenaires logistiques spécialisés dans les objets d'art."
            }
        ]
    },
    {
        category: 'Garanties & Support',
        icon: <ShieldCheck className="size-5" />,
        items: [
            {
                q: 'Quelle est la durée de la garantie Tria ?',
                a: "Toutes nos collections bénéficient d'une garantie internationale de 5 ans couvrant les défauts de fabrication et les composants électroniques."
            },
            {
                q: 'Comment entretenir mon luminaire en laiton ?',
                a: "Le laiton noble vit avec le temps. Nous recommandons un nettoyage doux avec un chiffon microfibre sec. Un kit d'entretien spécifique est offert avec chaque pièce pour préserver son éclat originel."
            },
            {
                q: 'Puis-je voir les produits avant d\'acheter ?',
                a: "Nous vous accueillons avec plaisir dans notre Showroom Flagship à Casablanca. Vous pouvez également prendre rendez-vous pour une présentation privée à votre domicile ou bureau."
            }
        ]
    }
];

export default function FAQsPage() {
    const [openIndex, setOpenIndex] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const toggleFaq = (index: string) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="flex-1 bg-white min-h-screen">
            {/* Header Section */}
            <div className="bg-slate-50 border-b border-slate-100 py-32">
                <div className="max-w-[1400px] mx-auto px-6 text-center">
                    <motion.span 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B8860B] mb-8 block"
                    >
                        Assistance & Expertise
                    </motion.span>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black text-slate-900 mb-10 uppercase tracking-tighter leading-none"
                    >
                        Questions <span className="text-[#B8860B]">Fréquentes</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-slate-500 font-medium mb-12 max-w-2xl mx-auto leading-relaxed"
                    >
                        Tout ce que vous devez savoir pour illuminer vos projets avec l'excellence Tria Lampe.
                    </motion.p>
                    
                    {/* Search Bar */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="relative max-w-2xl mx-auto group"
                    >
                        <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300 size-6" />
                        <input 
                            type="text" 
                            placeholder="Rechercher une réponse..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-20 pl-20 pr-8 bg-white border-none rounded-[30px] shadow-2xl shadow-slate-200/50 focus:ring-8 focus:ring-[#B8860B]/10 transition-all outline-none font-bold text-lg text-slate-900 placeholder-slate-300"
                        />
                    </motion.div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto px-6 py-32">
                <div className="space-y-24">
                    {faqs.map((group, groupIdx) => {
                        const filteredItems = group.items.filter(item => 
                            item.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.a.toLowerCase().includes(searchQuery.toLowerCase())
                        );

                        if (filteredItems.length === 0) return null;

                        return (
                            <div key={groupIdx}>
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="size-12 rounded-2xl bg-slate-50 flex items-center justify-center text-[#B8860B] shadow-xl shadow-slate-100">
                                        {group.icon}
                                    </div>
                                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                                        {group.category}
                                    </h2>
                                </div>
                                <div className="space-y-6">
                                    {filteredItems.map((item, itemIdx) => {
                                        const originalItemIdx = group.items.findIndex(i => i.q === item.q);
                                        const id = `${groupIdx}-${originalItemIdx}`;
                                        const isSearchActive = searchQuery.trim().length > 0;
                                        const isOpen = openIndex === id || isSearchActive;
                                        
                                        return (
                                            <div 
                                                key={id} 
                                                className={`rounded-[32px] border transition-all duration-500 overflow-hidden ${isOpen ? 'border-[#B8860B] bg-white shadow-2xl shadow-[#B8860B]/5' : 'border-slate-50 bg-slate-50/30 hover:border-slate-100 hover:bg-white'}`}
                                            >
                                                <button 
                                                    onClick={() => !isSearchActive && toggleFaq(id)}
                                                    className={`w-full px-10 py-8 flex items-center justify-between text-left ${isSearchActive ? 'cursor-default' : 'cursor-pointer'}`}
                                                >
                                                    <span className={`text-lg font-black uppercase tracking-tight ${isOpen ? 'text-slate-900' : 'text-slate-500'}`}>
                                                        {item.q}
                                                    </span>
                                                    {!isSearchActive && (
                                                        <div className={`size-10 rounded-2xl flex items-center justify-center transition-all ${isOpen ? 'bg-[#B8860B] text-white rotate-180' : 'bg-white text-slate-300 shadow-sm'}`}>
                                                            <ChevronDown className="size-5" />
                                                        </div>
                                                    )}
                                                </button>
                                                <AnimatePresence>
                                                    {isOpen && (
                                                        <motion.div 
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="px-10 pb-10 text-slate-500 font-medium text-lg leading-relaxed">
                                                                {item.a}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}

                    {searchQuery.trim().length > 0 && faqs.every(group => 
                        group.items.filter(item => 
                            item.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.a.toLowerCase().includes(searchQuery.toLowerCase())
                        ).length === 0
                    ) && (
                        <div className="text-center py-24 bg-slate-50 rounded-[50px] border-2 border-dashed border-slate-100">
                            <div className="size-20 rounded-[30px] bg-white flex items-center justify-center mx-auto mb-8 shadow-xl">
                                <Search className="size-8 text-slate-200" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">Aucun résultat trouvé</h3>
                            <p className="text-slate-400 font-medium max-w-md mx-auto">
                                Nous n'avons trouvé aucune réponse pour &quot;{searchQuery}&quot;.
                            </p>
                        </div>
                    )}
                </div>

                {/* CTA Card */}
                <div className="mt-32 relative group">
                    <div className="absolute inset-0 bg-[#B8860B] rounded-[50px] blur-3xl opacity-10 group-hover:opacity-20 transition-opacity" />
                    <div className="relative bg-slate-900 p-16 rounded-[50px] text-center text-white overflow-hidden">
                        <div className="absolute top-0 right-0 size-64 bg-[#B8860B] opacity-10 rounded-full -mr-32 -mt-32 blur-3xl" />
                        <Sparkles size={40} className="text-[#B8860B] mx-auto mb-8" />
                        <h3 className="text-3xl md:text-5xl font-black mb-6 uppercase tracking-tighter leading-none">
                            Besoin d'un Conseil <br/><span className="text-[#B8860B]">Personnalisé</span> ?
                        </h3>
                        <p className="text-slate-400 text-lg font-medium mb-10 max-w-xl mx-auto">
                            Nos experts en éclairage architectural vous accompagnent dans la concrétisation de vos projets les plus audacieux.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Link href="/contact" className="bg-[#B8860B] text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#966d09] transition-all shadow-2xl">
                                Contacter la Conciergerie
                            </Link>
                            <a href="tel:+212522123456" className="bg-white/5 backdrop-blur-md text-white border border-white/10 px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all">
                                Appeler un Expert
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
