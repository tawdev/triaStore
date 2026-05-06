'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';

const looks = [
    { id: 1, img: '/tria-crystal/banner1.png', title: 'Salon Haussmannien', span: 'col-span-1 row-span-2' },
    { id: 2, img: '/tria-crystal/banner2.png', title: 'Minimalisme Doré', span: 'col-span-1 row-span-1' },
    { id: 3, img: '/tria-crystal/hero.png', title: 'Chambre Royale', span: 'col-span-2 row-span-2' },
    { id: 4, img: '/tria-crystal/banner1.png', title: 'Bureau d\'Architecte', span: 'col-span-1 row-span-1' },
    { id: 5, img: '/tria-crystal/banner2.png', title: 'Dining Room', span: 'col-span-1 row-span-2' },
];

export default function InspirationPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-24 px-6 md:px-12 font-outfit">
            <div className="max-w-[1440px] mx-auto">
                {/* Header */}
                <div className="text-center mb-20">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-playfair italic font-light mb-6"
                    >
                        Inspiration
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/60 max-w-2xl mx-auto text-lg"
                    >
                        Découvrez comment nos créations lumineuses transforment les espaces. 
                        Une galerie pensée pour les amoureux du design et de l'architecture.
                    </motion.p>
                </div>

                {/* Masonry Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[300px] gap-6">
                    {looks.map((look, index) => (
                        <motion.div 
                            key={look.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.8 }}
                            className={`relative rounded-3xl overflow-hidden group cursor-pointer ${look.span}`}
                        >
                            <Image 
                                src={look.img} 
                                alt={look.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                            
                            <div className="absolute bottom-8 left-8 right-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                <h3 className="text-2xl font-playfair italic mb-4">{look.title}</h3>
                                <Link 
                                    href="/products"
                                    className="inline-block px-6 py-3 bg-white text-black text-[10px] uppercase font-black tracking-widest rounded-full hover:bg-[#B8860B] hover:text-white transition-colors"
                                >
                                    Acheter le look
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
