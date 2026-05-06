'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ChevronRight,
  Truck,
  ShieldCheck,
  Headset,
  Star,
  Quote,
  Lamp,
  Lightbulb,
  Zap,
  ChevronLeft,
  Users,
  Box,
  CheckCircle2,
  ExternalLink,
  ShoppingBag,
  Heart,
  Award,
  ThumbsUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api, normalizeImageUrl, type Category, type Product, type Brand, type BlogPost, type Testimonial, type Faq } from '@/app/lib/api';
import ProductCard from '@/app/components/ProductCard';
import { ProductSkeleton } from '@/app/components/Skeleton';
import ProductRating from '@/app/components/ProductRating';

interface HomeClientProps {
  initialCategories: Category[];
  initialPopularProducts: Product[];
  initialNewProducts: Product[];
  initialBrands: Brand[];
  initialBlogs: BlogPost[];
  initialFaqs: Faq[];
  initialTestimonials: Testimonial[];
}

export default function HomeClient({
  initialCategories,
  initialPopularProducts,
  initialNewProducts,
  initialBrands,
  initialBlogs,
  initialFaqs,
  initialTestimonials
}: HomeClientProps) {
  const [categories] = useState<Category[]>(initialCategories);
  const [activeTab, setActiveTab] = useState('Populaires');
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(initialPopularProducts);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const heroBackground = "/tria-crystal/hero.png";
  const newsletterImage = "/tria-crystal/banner1.png";

  const testimonialsList = initialTestimonials.length > 0 ? initialTestimonials : [
    {
        id: 0,
        name: "Sofia El Amrani",
        role: "Cliente vérifiée",
        content: "La qualité des lampes est exceptionnelle, le design est magnifique et la livraison rapide. Je recommande Tria Lampe !",
        initial: "SE",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 1,
        name: "Marc Dupont",
        role: "Client vérifié",
        content: "Service client au top et produits magnifiques. J'ai acheté trois lampes pour mon salon et le résultat est superbe.",
        initial: "MD",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
  ];

  useEffect(() => {
    setIsLoadingFeatured(true);
    let query: any = { page: 1, limit: 12, active: true };
    if (activeTab === 'Populaires') query.sort = 'popularity';
    if (activeTab === 'Nouveautés') query.sort = 'createdAt';
    if (activeTab === 'Promotions') query.onSale = true;

    api.getProducts(query)
      .then(res => setFeaturedProducts(res.data))
      .catch(console.error)
      .finally(() => setIsLoadingFeatured(false));
  }, [activeTab]);

  return (
    <div className="flex-1 flex flex-col bg-white overflow-x-hidden font-outfit">
      
      {/* HERO SECTION */}
      <section className="relative h-[700px] lg:h-[800px] overflow-hidden">
        {/* Optimized Hero Image */}
        <motion.div 
            initial={{ scale: 1.15, opacity: 0 }}
            animate={{ scale: 1.05, opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute inset-0 z-0"
        >
            <Image 
                src={heroBackground} 
                alt="Lustre Cristal Luxe" 
                fill 
                priority 
                quality={100}
                className="object-cover object-center"
            />
        </motion.div>
        <div className="absolute inset-0 bg-black/40 z-0" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent z-0" />

        <div className="mx-auto max-w-[1440px] w-full px-6 sm:px-12 h-full flex flex-col justify-center relative z-10 pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
            <div className="text-white space-y-8">
              <div className="flex flex-col">
                <motion.span 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="inline-block px-4 py-1 bg-[#B8860B] text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-sm mb-6 w-fit"
                >
                    Collection Exclusive 2026
                </motion.span>
                
                <h1 className="text-6xl md:text-[85px] leading-[1.05] mb-8 drop-shadow-2xl">
                    <motion.span 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.8 }}
                        className="block font-bold font-outfit"
                    >
                        Éclairez
                    </motion.span>
                    <motion.span 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9, duration: 0.8 }}
                        className="text-[#B8860B] italic font-playfair font-light block tracking-wide"
                    >
                        votre intérieur
                    </motion.span>
                    <motion.span 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1, duration: 0.8 }}
                        className="block"
                    >
                        avec <span className="text-[#B8860B] italic font-playfair font-light">élégance</span>
                    </motion.span>
                </h1>

                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4, duration: 1 }}
                    className="text-xl text-white/80 max-w-lg leading-relaxed font-medium mb-12"
                >
                    Découvrez notre collection de lampes design pour sublimer chaque espace de votre maison.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.7, duration: 0.5 }}
                >
                    <Link href="/products" className="inline-flex px-12 py-5 bg-[#C18E2E] text-white rounded-md font-black uppercase tracking-widest text-[11px] hover:bg-white hover:text-black transition-all shadow-xl shadow-black/20">
                        Découvrir la collection
                    </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* TRUST BADGES SECTION */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="relative z-20 -mt-12 lg:-mt-16 px-6 sm:px-12"
      >

        <div className="mx-auto max-w-[1440px]">
          <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-50 p-8 lg:p-12 flex flex-wrap justify-between gap-12 lg:gap-8">
            <div className="flex items-center gap-5 group">
              <div className="size-14 rounded-2xl bg-slate-50 flex items-center justify-center text-[#B8860B] group-hover:bg-[#B8860B] group-hover:text-white transition-all duration-500">
                <Truck size={28} strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-1">Livraison gratuite</h4>
                <p className="text-[11px] font-bold text-slate-400">À partir de 1000 MAD</p>
              </div>
            </div>

            <div className="flex items-center gap-5 group">
              <div className="size-14 rounded-2xl bg-slate-50 flex items-center justify-center text-[#B8860B] group-hover:bg-[#B8860B] group-hover:text-white transition-all duration-500">
                <ShieldCheck size={28} strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-1">Paiement sécurisé</h4>
                <p className="text-[11px] font-bold text-slate-400">100% sécurisé</p>
              </div>
            </div>

            <div className="flex items-center gap-5 group">
              <div className="size-14 rounded-2xl bg-slate-50 flex items-center justify-center text-[#B8860B] group-hover:bg-[#B8860B] group-hover:text-white transition-all duration-500">
                <Box size={28} strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-1">Retours faciles</h4>
                <p className="text-[11px] font-bold text-slate-400">30 jours pour changer d'avis</p>
              </div>
            </div>

            <div className="flex items-center gap-5 group">
              <div className="size-14 rounded-2xl bg-slate-50 flex items-center justify-center text-[#B8860B] group-hover:bg-[#B8860B] group-hover:text-white transition-all duration-500">
                <Award size={28} strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-1">Garantie 2 ans</h4>
                <p className="text-[11px] font-bold text-slate-400">Sur tous nos produits</p>
              </div>
            </div>

            <div className="flex items-center gap-5 group">
              <div className="size-14 rounded-2xl bg-slate-50 flex items-center justify-center text-[#B8860B] group-hover:bg-[#B8860B] group-hover:text-white transition-all duration-500">
                <Headset size={28} strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-1">Service client</h4>
                <p className="text-[11px] font-bold text-slate-400">Disponible 7j/7</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* BRANDS SECTION */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="py-16 bg-white border-y border-slate-50 overflow-hidden"
      >

        <div className="mx-auto max-w-[1440px]">
          <div className="relative flex overflow-x-hidden">
            <div className="flex animate-marquee whitespace-nowrap items-center gap-16 lg:gap-24 py-2">
              {[...initialBrands, ...initialBrands].map((brand, i) => (
                <div 
                  key={`${brand.id}-${i}`} 
                  className="h-10 w-32 md:w-40 relative flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-500 group flex items-center justify-center"
                >
                  {brand.logoUrl?.trim() ? (
                    <img
                      src={normalizeImageUrl(brand.logoUrl) || brand.logoUrl}
                      alt={brand.name}
                      className="h-full w-full object-contain opacity-50 group-hover:opacity-100 transition-opacity"
                      onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = `<span class="text-[10px] font-black text-slate-300 uppercase tracking-widest">${brand.name}</span>`;
                      }}
                    />
                  ) : (
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{brand.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* CATEGORIES SECTION */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="py-24 bg-white"
      >

        <div className="mx-auto max-w-[1440px] px-6 sm:px-12">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Catégories Vedettes</h2>
            <Link href="/products" className="text-[11px] font-bold text-slate-400 hover:text-[#B8860B] uppercase tracking-widest flex items-center gap-2">Voir toutes les catégories <ChevronRight size={14} /></Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.slice(0, 6).map((cat, i) => (
              <Link key={i} href={`/products?categoryId=${cat.id}`} className={`group flex flex-col items-center bg-white rounded-2xl border ${i === 0 ? 'border-[#B8860B] shadow-lg shadow-[#B8860B]/10' : 'border-slate-100'} overflow-hidden transition-all hover:shadow-xl`}>
                <div className="relative aspect-square w-full bg-white overflow-hidden">
                  <Image src={cat.imageUrl || "/placeholder.png"} alt={cat.name} fill quality={100} className="object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="p-6 text-center">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-1">{cat.name}</h3>
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-[#B8860B] transition-colors">Découvrir →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </motion.section>

      {/* MEILLEURES VENTES */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="py-24 bg-slate-50/50"
      >

        <div className="mx-auto max-w-[1440px] px-6 sm:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Meilleures ventes</h2>
            </div>
            <div className="flex gap-10">
              {['Populaires', 'Nouveautés', 'Promotions', 'Meilleures notes'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all pb-2 border-b-2 ${activeTab === tab ? 'text-[#B8860B] border-[#B8860B]' : 'text-slate-300 border-transparent hover:text-slate-500'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <Link href="/products" className="text-[11px] font-bold text-slate-400 hover:text-[#B8860B] uppercase tracking-widest flex items-center gap-2 ml-auto">Voir toutes les lampes <ChevronRight size={14} /></Link>
          </div>

          <div className="relative group/slider">
            <div 
              id="featured-slider"
              className="flex overflow-x-auto gap-6 scroll-smooth no-scrollbar pb-8 px-2"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {isLoadingFeatured ? (
                    Array(12).fill(0).map((_, i) => (
                        <div key={i} className="min-w-[280px] md:min-w-[240px] lg:min-w-[calc((100%-120px)/6)]">
                            <ProductSkeleton />
                        </div>
                    ))
                ) : (
                    featuredProducts.slice(0, 12).map((product, idx) => (
                        <motion.div 
                            key={product.id} 
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            className="min-w-[280px] md:min-w-[240px] lg:min-w-[calc((100%-120px)/6)]"
                        >
                            <ProductCard product={product} />
                        </motion.div>
                    ))
                )}
            </div>

            {/* Navigation Buttons */}
            <button 
              onClick={() => {
                const el = document.getElementById('featured-slider');
                if (el) el.scrollLeft -= el.offsetWidth;
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 size-12 bg-white/90 backdrop-blur-xl border border-slate-100 rounded-full shadow-xl flex items-center justify-center text-slate-400 hover:text-[#B8860B] hover:scale-110 transition-all z-20 opacity-0 group-hover/slider:opacity-100"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => {
                const el = document.getElementById('featured-slider');
                if (el) el.scrollLeft += el.offsetWidth;
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 size-12 bg-white/90 backdrop-blur-xl border border-slate-100 rounded-full shadow-xl flex items-center justify-center text-slate-400 hover:text-[#B8860B] hover:scale-110 transition-all z-20 opacity-0 group-hover/slider:opacity-100"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </motion.section>

      {/* PROMO BANNERS */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="py-24 bg-white"
      >

        <div className="mx-auto max-w-[1440px] px-6 sm:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative h-[320px] rounded-[30px] overflow-hidden group">
              <Image src="/tria-crystal/banner1.png" alt="Lustre Cristal Collection Premium" fill quality={100} className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-center p-12 text-white">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-[#B8860B]">Collection Premium</span>
                <h3 className="text-3xl font-black mb-8 leading-tight">Luminaires Design<br />Haut de Gamme</h3>
                <Link href="/products" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border-b-2 border-white pb-1 w-fit hover:text-[#B8860B] hover:border-[#B8860B] transition-all">
                  Découvrez la collection <ChevronRight size={14} />
                </Link>
              </div>
            </div>
            <div className="relative h-[320px] rounded-[30px] overflow-hidden group">
              <Image src="/tria-crystal/blog-dining.png" alt="Lustre Cristal Ambiance" fill quality={100} className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-center p-12 text-white">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-[#B8860B]">Ambiance Parfaite</span>
                <h3 className="text-3xl font-black mb-8 leading-tight">Créez l'atmosphère<br />idéale chez vous</h3>
                <Link href="/products" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border-b-2 border-white pb-1 w-fit hover:text-[#B8860B] hover:border-[#B8860B] transition-all">
                    Voir les inspirations <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* NOUVEAUTÉS */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="py-24 bg-white"
      >

        <div className="mx-auto max-w-[1440px] px-6 sm:px-12">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Nouveautés</h2>
            <Link href="/products?sort=createdAt" className="text-[11px] font-bold text-slate-400 hover:text-[#B8860B] uppercase tracking-widest flex items-center gap-2">Voir toutes les nouveautés <ChevronRight size={14} /></Link>
          </div>

          <div className="relative group/new">
            <div 
              id="new-products-slider"
              className="flex overflow-x-auto gap-6 scroll-smooth no-scrollbar pb-8 px-2"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {initialNewProducts.slice(0, 10).map((product, idx) => (
                    <motion.div 
                        key={product.id} 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1, duration: 0.5 }}
                        className="min-w-[280px] md:min-w-[240px] lg:min-w-[calc((100%-120px)/6)]"
                    >
                      <ProductCard product={product} />
                    </motion.div>
                ))}
            </div>

            {/* Navigation Buttons */}
            <button 
              onClick={() => {
                const el = document.getElementById('new-products-slider');
                if (el) el.scrollLeft -= el.offsetWidth;
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 size-12 bg-white/90 backdrop-blur-xl border border-slate-100 rounded-full shadow-xl flex items-center justify-center text-slate-400 hover:text-[#B8860B] hover:scale-110 transition-all z-20 opacity-0 group-hover/new:opacity-100"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => {
                const el = document.getElementById('new-products-slider');
                if (el) el.scrollLeft += el.offsetWidth;
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 size-12 bg-white/90 backdrop-blur-xl border border-slate-100 rounded-full shadow-xl flex items-center justify-center text-slate-400 hover:text-[#B8860B] hover:scale-110 transition-all z-20 opacity-0 group-hover/new:opacity-100"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </motion.section>

      {/* WHY CHOOSE US SECTION */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="py-24 bg-white"
      >

        <div className="mx-auto max-w-[1440px] px-6 sm:px-12">
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden flex flex-col lg:flex-row">
            {/* Left Brand Block */}
            <div className="w-full lg:w-[400px] relative min-h-[300px] group">
              <Image 
                src="/tria-crystal/hero.png" 
                alt="Tria Lampe Design" 
                fill 
                priority
                unoptimized
                className="object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-center p-12 text-white">
                <h2 className="text-3xl font-black mb-8 uppercase leading-tight tracking-tight">Pourquoi choisir<br /><span className="text-[#B8860B]">Tria Lampe ?</span></h2>
                <Link href="/about" className="px-8 py-4 bg-[#B8860B] text-white rounded-md font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-all w-fit shadow-lg shadow-[#B8860B]/20">
                  En savoir plus
                </Link>
              </div>
            </div>

            {/* Right Features Block */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-center p-8 lg:p-12 gap-12 bg-slate-50/30">
              <div className="flex flex-col items-center text-center px-4">
                <div className="size-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#B8860B] mb-6">
                  <Lamp size={28} strokeWidth={1.5} />
                </div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-3">Design unique</h4>
                <p className="text-[11px] font-bold text-slate-400 leading-relaxed uppercase tracking-tighter">Des lampes au style moderne et intemporel.</p>
              </div>

              <div className="flex flex-col items-center text-center px-4">
                <div className="size-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#B8860B] mb-6">
                  <Award size={28} strokeWidth={1.5} />
                </div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-3">Qualité supérieure</h4>
                <p className="text-[11px] font-bold text-slate-400 leading-relaxed uppercase tracking-tighter">Matériaux durables et finitions impeccables.</p>
              </div>

              <div className="flex flex-col items-center text-center px-4">
                <div className="size-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#B8860B] mb-6">
                  <Zap size={28} strokeWidth={1.5} />
                </div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-3">Économie d'énergie</h4>
                <p className="text-[11px] font-bold text-slate-400 leading-relaxed uppercase tracking-tighter">Ampoules LED pour un éclairage durable.</p>
              </div>

              <div className="flex flex-col items-center text-center px-4">
                <div className="size-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#B8860B] mb-6">
                  <CheckCircle2 size={28} strokeWidth={1.5} />
                </div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-3">Satisfaction garantie</h4>
                <p className="text-[11px] font-bold text-slate-400 leading-relaxed uppercase tracking-tighter">Votre satisfaction est notre priorité.</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* TESTIMONIALS SECTION */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="py-32 bg-white"
      >

        <div className="mx-auto max-w-[1440px] px-6 sm:px-12">
          <div className="flex items-center justify-center gap-6 mb-24">
            <div className="w-16 h-px bg-[#B8860B]/30" />
            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Ils nous font confiance</h2>
            <div className="w-16 h-px bg-[#B8860B]/30" />
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-20">
            {/* Testimonial Card */}
            <div className="w-full lg:w-1/2 relative">
                <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl p-10 md:p-14 relative z-10">
                    <div className="flex gap-1 mb-8">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={18} fill="#B8860B" color="#B8860B" />
                        ))}
                    </div>
                    
                    <p className="text-lg text-slate-600 italic leading-relaxed mb-10 font-medium">
                        "{testimonialsList[testimonialIndex].content}"
                    </p>

                    <div className="flex items-center gap-6 mt-12">
                        <div className="size-16 rounded-2xl bg-[#B8860B]/10 border border-[#B8860B]/20 flex items-center justify-center text-[#B8860B] font-black text-xl italic uppercase">
                            {testimonialsList[testimonialIndex].initial || testimonialsList[testimonialIndex].name.substring(0, 2)}
                        </div>
                        <div>
                            <h4 className="text-xl font-black text-slate-900 italic uppercase">{testimonialsList[testimonialIndex].name}</h4>
                            <p className="text-xs font-bold text-slate-400 tracking-[0.2em] uppercase mt-1">{testimonialsList[testimonialIndex].role}</p>
                        </div>
                    </div>

                    {/* Pagination Dots */}
                    <div className="flex gap-3 mt-10 ml-4">
                        {testimonialsList.map((_, i) => (
                            <button 
                                key={i} 
                                onClick={() => setTestimonialIndex(i)}
                                className={`h-1.5 transition-all duration-500 rounded-full ${i === testimonialIndex ? 'w-10 bg-[#B8860B]' : 'w-3 bg-slate-200 hover:bg-slate-300'}`}
                            />
                        ))}
                    </div>

                    {/* Navigation Buttons */}
                    <button onClick={() => setTestimonialIndex(prev => (prev - 1 + testimonialsList.length) % testimonialsList.length)} className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-slate-100 rounded-full shadow-xl flex items-center justify-center text-slate-400 hover:text-[#B8860B] transition-all">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={() => setTestimonialIndex(prev => (prev + 1) % testimonialsList.length)} className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-slate-100 rounded-full shadow-xl flex items-center justify-center text-slate-400 hover:text-[#B8860B] transition-all">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Stats Blocks */}
            <div className="w-full lg:w-1/2 grid grid-cols-3 gap-8">
                {[
                  { icon: Heart, value: "5000+", label: "Clients satisfaits" },
                  { icon: Award, value: "4.9/5", label: "Note moyenne" },
                  { icon: ThumbsUp, value: "98%", label: "Recommandations" },
                ].map((stat, i) => (
                  <div key={i} className="text-center group">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#B8860B] group-hover:text-white transition-all shadow-sm">
                        <stat.icon size={28} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-1">{stat.value}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{stat.label}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* NEWSLETTER BANNER */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="py-24 bg-white"
      >

        <div className="mx-auto max-w-[1440px] px-6 sm:px-12">
          <div className="bg-[#111] rounded-[40px] overflow-hidden flex flex-col md:flex-row min-h-[400px]">
            {/* Left Content */}
            <div className="flex-1 p-12 md:p-20 flex flex-col justify-center">
                <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tight">Restez inspiré</h2>
                <p className="text-white/50 text-sm mb-10 max-w-sm font-medium">Recevez nos nouveautés, offres exclusives et conseils déco directement par email.</p>
                <form className="flex flex-col sm:flex-row gap-4 max-w-md">
                    <input
                        type="email"
                        placeholder="Votre adresse email"
                        className="flex-1 px-8 py-5 bg-white rounded-md text-slate-900 placeholder:text-slate-400 outline-none transition-all font-medium"
                    />
                    <button className="px-10 py-5 bg-[#C18E2E] text-white rounded-md font-black uppercase tracking-widest text-[11px] hover:bg-[#B8860B] transition-all whitespace-nowrap">
                        S'ABONNER
                    </button>
                </form>
            </div>
            
            {/* Right Image */}
            <div className="hidden md:block w-full md:w-[45%] relative">
                <Image 
                  src="/tria-crystal/hero.png" 
                  alt="Newsletter Inspiration" 
                  fill 
                  quality={100}
                  className="object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#111] via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </motion.section>

    </div>

  );
}
