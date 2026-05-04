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
import { api, type Category, type Product, type Brand, type BlogPost, type Testimonial } from '@/app/lib/api';
import ProductCard from '@/app/components/ProductCard';
import { ProductSkeleton } from '@/app/components/Skeleton';
import ProductRating from '@/app/components/ProductRating';

interface HomeClientProps {
  initialCategories: Category[];
  initialPopularProducts: Product[];
  initialNewProducts: Product[];
  initialBrands: Brand[];
  initialBlogs: BlogPost[];
  initialTestimonials: Testimonial[];
}

export default function HomeClient({
  initialCategories,
  initialPopularProducts,
  initialNewProducts,
  initialBrands,
  initialBlogs,
  initialTestimonials
}: HomeClientProps) {
  const [categories] = useState<Category[]>(initialCategories);
  const [activeTab, setActiveTab] = useState('Populaires');
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(initialPopularProducts);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const heroBackground = "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=2000";
  const newsletterImage = "https://images.unsplash.com/photo-1553095066-5014bd030620?auto=format&fit=crop&q=80&w=1000";

  const testimonials = [
    {
        name: "Sofia El Amrani",
        role: "Cliente vérifiée",
        content: "La qualité des lampes est exceptionnelle, le design est magnifique et la livraison rapide. Je recommande Tria Lampe !",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
    },
    {
        name: "Marc Dupont",
        role: "Client vérifié",
        content: "Service client au top et produits magnifiques. J'ai acheté trois lampes pour mon salon et le résultat est superbe.",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
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
      <section 
        className="relative h-[700px] overflow-hidden bg-fixed bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] z-0" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent z-0" />

        <div className="mx-auto max-w-[1440px] w-full px-6 sm:px-12 h-full flex flex-col justify-center relative z-10 pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
            <div className="text-white space-y-8">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <span className="inline-block px-4 py-1 bg-[#B8860B] text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-sm mb-6">Collection Exclusive 2026</span>
                <h1 className="text-6xl md:text-[85px] font-bold leading-[1.05] mb-8 drop-shadow-2xl">Éclairez <br /><span className="text-[#B8860B] italic font-playfair font-light">votre intérieur</span> <br />avec <span className="text-[#B8860B] italic font-playfair font-light">élégance</span></h1>
                <p className="text-xl text-white/80 max-w-lg leading-relaxed font-medium mb-12">Découvrez notre collection de lampes design pour sublimer chaque espace de votre maison.</p>
                <Link href="/products" className="inline-flex px-12 py-5 bg-[#C18E2E] text-white rounded-md font-black uppercase tracking-widest text-[11px] hover:bg-white hover:text-black transition-all">Découvrir la collection</Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-12">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Catégories Vedettes</h2>
            <Link href="/products" className="text-[11px] font-bold text-slate-400 hover:text-[#B8860B] uppercase tracking-widest flex items-center gap-2">Voir toutes les catégories <ChevronRight size={14} /></Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.slice(0, 6).map((cat, i) => (
              <Link key={i} href={`/products?categoryId=${cat.id}`} className={`group flex flex-col items-center bg-white rounded-2xl border ${i === 0 ? 'border-[#B8860B] shadow-lg shadow-[#B8860B]/10' : 'border-slate-100'} overflow-hidden transition-all hover:shadow-xl`}>
                <div className="relative aspect-square w-full bg-slate-50 overflow-hidden">
                  <Image src={cat.imageUrl || "/placeholder.png"} alt={cat.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="p-6 text-center">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-1">{cat.name}</h3>
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-[#B8860B] transition-colors">Découvrir →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* MEILLEURES VENTES */}
      <section className="py-24 bg-slate-50/50">
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

          <div className="relative group">
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
                featuredProducts.slice(0, 12).map((product) => (
                  <div key={product.id} className="min-w-[280px] md:min-w-[240px] lg:min-w-[calc((100%-120px)/6)]">
                    <ProductCard product={product} />
                  </div>
                ))
                )}
            </div>

            {/* Navigation Buttons */}
            <button 
              onClick={() => {
                const el = document.getElementById('featured-slider');
                if (el) el.scrollLeft -= el.offsetWidth;
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 size-12 bg-white/90 backdrop-blur-xl border border-slate-100 rounded-full shadow-xl flex items-center justify-center text-slate-400 hover:text-[#B8860B] hover:scale-110 transition-all z-20 opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => {
                const el = document.getElementById('featured-slider');
                if (el) el.scrollLeft += el.offsetWidth;
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 size-12 bg-white/90 backdrop-blur-xl border border-slate-100 rounded-full shadow-xl flex items-center justify-center text-slate-400 hover:text-[#B8860B] hover:scale-110 transition-all z-20 opacity-0 group-hover:opacity-100"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* PROMO BANNERS */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative h-[320px] rounded-[30px] overflow-hidden group">
              <Image src="https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=1200" alt="Banner 1" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-center p-12 text-white">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-[#B8860B]">Collection Premium</span>
                <h3 className="text-3xl font-black mb-8 leading-tight">Luminaires Design<br />Haut de Gamme</h3>
                <Link href="/products" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border-b-2 border-white pb-1 w-fit hover:text-[#B8860B] hover:border-[#B8860B] transition-all">
                  Découvrez la collection <ChevronRight size={14} />
                </Link>
              </div>
            </div>
            <div className="relative h-[320px] rounded-[30px] overflow-hidden group">
              <Image src="https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=1200" alt="Banner 2" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] flex flex-col justify-center p-12 text-slate-900">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-[#B8860B]">Ambiance Parfaite</span>
                <h3 className="text-3xl font-black mb-8 leading-tight">Créez l'atmosphère<br />idéale chez vous</h3>
                <Link href="/products" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border-b-2 border-slate-900 pb-1 w-fit hover:text-[#B8860B] hover:border-[#B8860B] transition-all">
                  Voir les inspirations <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NOUVEAUTÉS */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-12">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Nouveautés</h2>
            <Link href="/products?sort=createdAt" className="text-[11px] font-bold text-slate-400 hover:text-[#B8860B] uppercase tracking-widest flex items-center gap-2">Voir toutes les nouveautés <ChevronRight size={14} /></Link>
          </div>

          <div className="relative group">
            <div 
              id="new-products-slider"
              className="flex overflow-x-auto gap-6 scroll-smooth no-scrollbar pb-8 px-2"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {initialNewProducts.slice(0, 10).map((product) => (
                    <div key={product.id} className="min-w-[280px] md:min-w-[240px] lg:min-w-[calc((100%-120px)/6)]">
                      <ProductCard product={product} />
                    </div>
                ))}
            </div>

            {/* Navigation Buttons */}
            <button 
              onClick={() => {
                const el = document.getElementById('new-products-slider');
                if (el) el.scrollLeft -= el.offsetWidth;
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 size-12 bg-white/90 backdrop-blur-xl border border-slate-100 rounded-full shadow-xl flex items-center justify-center text-slate-400 hover:text-[#B8860B] hover:scale-110 transition-all z-20 opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => {
                const el = document.getElementById('new-products-slider');
                if (el) el.scrollLeft += el.offsetWidth;
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 size-12 bg-white/90 backdrop-blur-xl border border-slate-100 rounded-full shadow-xl flex items-center justify-center text-slate-400 hover:text-[#B8860B] hover:scale-110 transition-all z-20 opacity-0 group-hover:opacity-100"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION - REFINED AS PER IMAGE */}
      <section className="py-32 bg-white">
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
                        "{testimonials[testimonialIndex].content}"
                    </p>

                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#B8860B]">
                            <Image src={testimonials[testimonialIndex].avatar} alt={testimonials[testimonialIndex].name} width={48} height={48} />
                        </div>
                        <div>
                            <h4 className="text-base font-bold text-slate-900">{testimonials[testimonialIndex].name}</h4>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{testimonials[testimonialIndex].role}</p>
                        </div>
                    </div>

                    {/* Pagination Dots */}
                    <div className="flex justify-center gap-2 mt-10">
                        {testimonials.map((_, i) => (
                            <button 
                                key={i} 
                                onClick={() => setTestimonialIndex(i)}
                                className={`h-1.5 rounded-full transition-all ${i === testimonialIndex ? 'w-8 bg-[#B8860B]' : 'w-2 bg-slate-200 hover:bg-slate-300'}`}
                            />
                        ))}
                    </div>

                    {/* Navigation Buttons */}
                    <button onClick={() => setTestimonialIndex(prev => (prev - 1 + testimonials.length) % testimonials.length)} className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-slate-100 rounded-full shadow-xl flex items-center justify-center text-slate-400 hover:text-[#B8860B] transition-all">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={() => setTestimonialIndex(prev => (prev + 1) % testimonials.length)} className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-slate-100 rounded-full shadow-xl flex items-center justify-center text-slate-400 hover:text-[#B8860B] transition-all">
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
      </section>

      {/* NEWSLETTER BANNER - REFINED WITH ROBUST IMAGE DISPLAY */}
      <section className="py-24 bg-white">
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
                  src="https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=1000" 
                  alt="Newsletter Inspiration" 
                  fill 
                  className="object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#111] via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
