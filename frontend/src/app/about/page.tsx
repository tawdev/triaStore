'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Award, Truck, ShieldCheck, Users, Star, MapPin, Phone, Clock,
  ChevronRight, Heart, Target, TrendingUp,
  CheckCircle2, ArrowRight, Sparkles, Zap, Lightbulb, PenTool
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AboutUsPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const values = [
    {
      icon: <PenTool className="size-8" />,
      title: 'Design Exclusif',
      description: 'Chaque pièce est dessinée par nos designers pour capturer l\'essence du luxe moderne et intemporel.',
    },
    {
      icon: <Award className="size-8" />,
      title: 'Artisanat Noble',
      description: 'Laiton brossé, verre soufflé à la bouche et marbre de Carrare — nous n\'utilisons que l\'excellence.',
    },
    {
      icon: <Sparkles className="size-8" />,
      title: 'Innovation LED',
      description: 'Une technologie de pointe pour une lumière chaleureuse, durable et respectueuse de l\'environnement.',
    },
    {
      icon: <ShieldCheck className="size-8" />,
      title: 'Qualité Heritage',
      description: 'Une garantie de 5 ans sur toutes nos collections, témoignant de notre confiance en notre savoir-faire.',
    },
  ];

  const timeline = [
    { year: '2012', title: 'L\'Étincelle', desc: 'Fondation de Tria Lampe à Casablanca par un collectif d\'artisans et d\'architectes passionnés.' },
    { year: '2016', title: 'Reconnaissance', desc: 'Première collection Signature primée au Salon du Design de Milan pour son audace esthétique.' },
    { year: '2020', title: 'Digital Excellence', desc: 'Lancement de notre plateforme e-commerce exclusive pour apporter le luxe dans chaque foyer marocain.' },
    { year: '2024', title: 'L\'Avenir', desc: 'Ouverture de notre showroom flagship et expansion vers des solutions d\'éclairage intelligentes.' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-white">

      {/* ═══════════ HERO SECTION ═══════════ */}
      <section className="relative h-[80vh] overflow-hidden bg-slate-900">
        <div
          className="absolute inset-0 scale-110 opacity-40"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
        >
          <Image
            src="https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&q=80&w=1920"
            alt="Tria Lampe Workshop"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        {/* Content */}
        <div className="relative z-20 h-full flex flex-col items-center justify-center px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.3em] mb-8"
          >
            L'Héritage du Design
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-none uppercase max-w-5xl"
          >
            Illuminer <span className="text-[#B8860B]">l'Exceptionnel</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-300 text-xl md:text-2xl font-medium leading-relaxed max-w-2xl mb-12"
          >
            Depuis 2012, Tria Lampe façonne la lumière pour transformer vos espaces en sanctuaires d'élégance et de sérénité.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-6"
          >
            <Link
              href="/products"
              className="bg-[#B8860B] text-white px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#966d09] transition-all shadow-2xl shadow-[#B8860B]/20"
            >
              Découvrir nos collections
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ PHILOSOPHY ═══════════ */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="py-32"
      >

        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div className="relative">
                <div className="aspect-[4/5] rounded-[60px] overflow-hidden shadow-2xl">
                    <Image
                        src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&q=80&w=800"
                        alt="Craftsmanship"
                        fill
                        className="object-cover"
                    />
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-10 -right-10 bg-slate-900 text-white p-12 rounded-[50px] shadow-2xl hidden lg:block">
                    <div className="text-6xl font-black text-[#B8860B] mb-2">12+</div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Années d'Excellence</div>
                </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 text-[#B8860B] text-[10px] font-black uppercase tracking-widest mb-8">
                Notre Philosophie
              </div>
              <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-10 leading-[0.95] uppercase tracking-tighter">
                Le Détail qui <span className="text-[#B8860B]">Révèle</span> l'Espace
              </h2>
              <div className="space-y-8 text-slate-500 text-lg leading-relaxed font-medium">
                <p>
                  Chez Tria Lampe, nous croyons que l'éclairage n'est pas qu'une simple fonctionnalité, c'est l'âme d'une pièce. 
                  C'est elle qui définit l'atmosphère, sculpte les volumes et influence nos émotions.
                </p>
                <p>
                  Chaque création Tria est le fruit d'un dialogue entre artisanat traditionnel et innovation technologique. 
                  Nous parcourons le monde pour sourcer les matériaux les plus nobles, garantissant que chaque lampe qui quitte notre atelier est une promesse de durabilité et de raffinement.
                </p>
                <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-100">
                    <div>
                        <h4 className="text-slate-900 font-black uppercase text-[11px] tracking-widest mb-2">Artisanat</h4>
                        <p className="text-sm">Finition main par nos maîtres artisans.</p>
                    </div>
                    <div>
                        <h4 className="text-slate-900 font-black uppercase text-[11px] tracking-widest mb-2">Vision</h4>
                        <p className="text-sm">Un design intemporel pour durer des décennies.</p>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ═══════════ VALUES ═══════════ */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="py-32 bg-slate-50"
      >

        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-xs font-black text-[#B8860B] uppercase tracking-[0.3em] mb-6">Nos Piliers</h2>
            <h3 className="text-5xl font-black text-slate-900 uppercase tracking-tighter">L'Exigence du <span className="text-[#B8860B]">Luxe</span></h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => (
              <div
                key={i}
                className="bg-white rounded-[40px] p-10 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group"
              >
                <div className="size-16 rounded-2xl bg-slate-50 flex items-center justify-center text-[#B8860B] mb-8 group-hover:bg-[#B8860B] group-hover:text-white transition-all duration-500">
                  {value.icon}
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">{value.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ═══════════ TIMELINE ═══════════ */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="py-32"
      >

        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter">Notre <span className="text-[#B8860B]">Parcours</span></h2>
          </div>

          <div className="space-y-20 relative">
            <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-px bg-slate-100 md:-translate-x-1/2" />
            
            {timeline.map((item, i) => (
              <div key={i} className={`flex flex-col md:flex-row items-center gap-12 relative ${i % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                <div className="absolute left-[13px] md:left-1/2 size-4 rounded-full bg-[#B8860B] md:-translate-x-1/2 z-10 border-4 border-white" />
                
                <div className={`w-full md:w-1/2 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <span className="text-4xl font-black text-slate-100 mb-4 block leading-none">{item.year}</span>
                  <h3 className="text-2xl font-black text-slate-900 mb-3 uppercase tracking-tight">{item.title}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                </div>
                <div className="hidden md:block w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ═══════════ EXPERIENCE ═══════════ */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="py-32 bg-slate-900 text-white overflow-hidden"
      >

        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <h2 className="text-5xl md:text-7xl font-black leading-none uppercase tracking-tighter">Une Expérience <br/><span className="text-[#B8860B]">Sensorielle</span></h2>
              <p className="text-slate-400 text-xl font-medium leading-relaxed">
                Plus qu'un achat, nous vous offrons un accompagnement sur mesure pour sublimer votre architecture intérieure.
              </p>
              <div className="space-y-6">
                {[
                    'Étude d\'éclairage personnalisée',
                    'Installation par nos experts certifiés',
                    'Personnalisation des finitions sur demande',
                    'Service après-vente VIP à vie',
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                        <div className="size-6 rounded-full bg-[#B8860B]/20 flex items-center justify-center text-[#B8860B]"><CheckCircle2 size={14} /></div>
                        <span className="text-sm font-black uppercase tracking-widest text-slate-200">{item}</span>
                    </div>
                ))}
              </div>
              <button className="bg-white text-slate-900 px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#B8860B] hover:text-white transition-all">
                Prendre Rendez-vous
              </button>
            </div>
            <div className="relative">
                <div className="aspect-square rounded-[60px] overflow-hidden">
                    <Image src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800" alt="Showroom Lustres Cristal" fill className="object-cover" />
                </div>
                <div className="absolute top-10 -left-10 size-40 bg-[#B8860B] rounded-[40px] flex items-center justify-center rotate-12 shadow-2xl">
                    <Lightbulb size={60} className="text-white -rotate-12" />
                </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ═══════════ CONTACT CARDS ═══════════ */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="py-32"
      >

        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-[40px] p-12 border border-slate-50 text-center group hover:border-[#B8860B] transition-all duration-500">
              <div className="size-20 rounded-3xl bg-slate-50 flex items-center justify-center mx-auto mb-8 text-[#B8860B] group-hover:bg-[#B8860B] group-hover:text-white transition-all">
                <MapPin size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-4 uppercase">Showroom Flagship</h3>
              <p className="text-slate-500 font-medium">Angle Boulevard Anfa, <br/>Casablanca, Maroc</p>
            </div>
            <div className="bg-white rounded-[40px] p-12 border border-slate-50 text-center group hover:border-[#B8860B] transition-all duration-500">
              <div className="size-20 rounded-3xl bg-slate-50 flex items-center justify-center mx-auto mb-8 text-[#B8860B] group-hover:bg-[#B8860B] group-hover:text-white transition-all">
                <Phone size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-4 uppercase">Contact Privé</h3>
              <p className="text-slate-500 font-medium">+212 5 22 12 34 56<br/>conciergerie@trialampe.ma</p>
            </div>
            <div className="bg-white rounded-[40px] p-12 border border-slate-100 text-center group hover:border-[#B8860B] transition-all duration-500">
              <div className="size-20 rounded-3xl bg-slate-50 flex items-center justify-center mx-auto mb-8 text-[#B8860B] group-hover:bg-[#B8860B] group-hover:text-white transition-all">
                <Clock size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-4 uppercase">Horaires VIP</h3>
              <p className="text-slate-500 font-medium">Lun – Sam : 10h00 – 19h30<br/>Dimanche sur rendez-vous</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ═══════════ CTA ═══════════ */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="py-24 bg-[#B8860B] relative overflow-hidden"
      >

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-white text-5xl md:text-7xl font-black mb-8 leading-[0.9] uppercase tracking-tighter">
            Prêt à Illuminer <br/>Votre <span className="text-slate-900">Monde</span> ?
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12">
            <Link
              href="/products"
              className="bg-slate-900 text-white px-12 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-all shadow-2xl"
            >
              Explorer les Collections
            </Link>
            <Link
              href="/contact"
              className="bg-white text-slate-900 px-12 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-100 transition-all"
            >
              Nous Contacter
            </Link>
          </div>
        </div>
      </motion.section>
    </div>

  );
}
