'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Phone, MessageSquareMore, Sparkles } from 'lucide-react';
import { useSettings } from '@/app/context/SettingsContext';

export default function ConciergeWidget() {
    const { settings } = useSettings();
    const [isOpen, setIsOpen] = useState(false);

    const whatsappNumber = settings?.phoneNumber?.replace(/\s+/g, '') || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "212773662487";
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Bonjour Tria Lampe, j'aimerais avoir des conseils personnalisés pour mon projet d'éclairage.")}`;

    return (
        <div className="fixed bottom-8 right-8 z-[9999] font-outfit">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="absolute bottom-20 right-0 w-80 bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-[#0a0a0a] p-6 text-white relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#B8860B]/10 rounded-full blur-3xl" />
                            <Sparkles className="text-[#B8860B] mb-2" size={20} />
                            <h3 className="text-xl font-playfair italic font-light">Service Conciergerie</h3>
                            <p className="text-white/50 text-[10px] uppercase tracking-widest font-black mt-1">Disponible 7j/7</p>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-4">
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Bienvenue chez <span className="font-bold text-slate-900">Tria Lampe</span>. 
                                Nos conseillers sont là pour vous accompagner dans vos projets de décoration.
                            </p>
                            
                            <a 
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors group"
                            >
                                <div className="size-10 rounded-full bg-[#25D366] flex items-center justify-center text-white">
                                    <MessageCircle size={20} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Chat WhatsApp</h4>
                                    <p className="text-[10px] text-slate-400 font-bold">Réponse instantanée</p>
                                </div>
                            </a>

                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 opacity-50 cursor-not-allowed">
                                <div className="size-10 rounded-full bg-slate-900 flex items-center justify-center text-white">
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Appel Audio</h4>
                                    <p className="text-[10px] text-slate-400 font-bold">Bientôt disponible</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-4 text-center">
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
                            >
                                Fermer
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`size-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${isOpen ? 'bg-slate-900 text-white' : 'bg-[#B8860B] text-white'}`}
            >
                {isOpen ? <X size={24} /> : <MessageSquareMore size={28} />}
            </motion.button>
        </div>
    );
}
