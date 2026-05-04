'use client';

import React from 'react';
import { Search, Trophy, Users, BookOpen, Sparkles, Lightbulb, Compass } from 'lucide-react';

interface BlogHeroProps {
  search: string;
  setSearch: (value: string) => void;
}

const BlogHero: React.FC<BlogHeroProps> = ({ search, setSearch }) => {
  return (
    <section className="relative w-full overflow-hidden bg-slate-900 pt-24 pb-0">
      {/* Background with Luxury Interior */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-overlay scale-105"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1600')" }}
      />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 z-10 opacity-10" 
        style={{ 
          backgroundImage: `radial-gradient(#B8860B 1px, transparent 1px)`, 
          backgroundSize: '40px 40px' 
        }} 
      />

      <div className="relative z-30 mx-auto max-w-[1400px] px-6 lg:px-12 pt-12 pb-24">
        <div className="grid grid-cols-1 gap-20 lg:grid-cols-12 lg:items-center">
          
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-2 text-[10px] font-black tracking-[0.4em] text-[#B8860B] uppercase backdrop-blur-xl">
              <span className="size-2 rounded-full bg-[#B8860B] animate-pulse" />
              Journal du Design
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-none uppercase">
              L'Art de <br />
              <span className="text-[#B8860B]">Lumière</span>
            </h1>

            <p className="max-w-xl text-xl font-medium leading-relaxed text-slate-400">
              Inspiration architecturale, conseils de stylisme et coulisses de nos ateliers — explorez l'univers raffiné de Tria Lampe.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl group">
              <div className="flex h-20 w-full items-center gap-4 rounded-[30px] bg-white p-2 shadow-2xl transition-all focus-within:ring-8 focus-within:ring-[#B8860B]/10">
                <div className="flex flex-1 items-center px-6">
                  <Search className="size-6 text-slate-300" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Quelles inspirations cherchez-vous ?"
                    className="w-full border-none bg-transparent px-4 text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-0 font-bold text-lg"
                  />
                </div>
                <button className="h-full rounded-[24px] bg-slate-900 px-10 text-[11px] font-black tracking-[0.2em] text-white transition-all hover:bg-[#B8860B] active:scale-95 shadow-xl">
                  RECHERCHER
                </button>
              </div>
            </div>
          </div>

          {/* Right Stats */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <StatCard 
              icon={<Compass className="size-8 text-white" />}
              value="120+"
              label="Guides de Style"
              sublabel="Expertise & Vision"
            />
            <StatCard 
              icon={<Lightbulb className="size-8 text-white" />}
              value="15K"
              label="Passionnés"
              sublabel="Inspiration quotidienne"
            />
            <StatCard 
              icon={<Sparkles className="size-8 text-white" />}
              value="Elite"
              label="Référence Design"
              sublabel="Showroom d'Exception"
            />
          </div>
        </div>
      </div>

    </section>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  sublabel: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, sublabel }) => (
  <div className="group flex items-center gap-8 rounded-[32px] border border-white/5 bg-white/5 p-8 backdrop-blur-2xl transition-all hover:bg-white/10 hover:translate-x-4 border-l-4 hover:border-l-[#B8860B]">
    <div className="size-16 shrink-0 flex items-center justify-center rounded-2xl bg-white/5 text-[#B8860B] transition-all group-hover:bg-[#B8860B] group-hover:text-white">
      {icon}
    </div>
    <div>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-black tracking-tight text-white uppercase">{value}</span>
      </div>
      <div className="text-sm font-black text-slate-200 uppercase tracking-tight mb-1">{label}</div>
      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{sublabel}</div>
    </div>
  </div>
);

export default BlogHero;
