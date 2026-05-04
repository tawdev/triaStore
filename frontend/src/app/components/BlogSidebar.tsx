'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api, type BlogPost, type Tip, type TagCount } from '../lib/api';
import { Check, AlertCircle, ArrowRight, Sparkles, BookOpen, Star, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BlogListingSidebarProps {
    recentPosts?: BlogPost[];
    activeTag?: string | null;
    onTagClick?: (tag: string) => void;
    author?: {
        name: string;
        role: string;
        bio: string;
        avatar: string;
    };
    tags?: string[];
    toc?: { id: string; text: string }[];
    hideTip?: boolean;
    variant?: 'light' | 'dark';
}

export default function BlogListingSidebar({ 
    recentPosts = [], 
    activeTag = null, 
    onTagClick,
    author,
    tags: articleTags,
    toc,
    hideTip = false,
    variant = 'light'
}: BlogListingSidebarProps) {
    const [email, setEmail] = useState('');
    const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [newsletterMessage, setNewsletterMessage] = useState('');

    const [tags, setTags] = useState<TagCount[]>([]);
    const [activeTip, setActiveTip] = useState<Tip | null>(null);

    useEffect(() => {
        api.getPopularTags().then(setTags).catch(() => setTags([]));
        api.getActiveTip().then(setActiveTip).catch(() => setActiveTip(null));
    }, []);

    const handleNewsletterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        setNewsletterStatus('loading');
        try {
            await api.subscribeNewsletter(email.trim());
            setNewsletterStatus('success');
            setNewsletterMessage('Bienvenue dans l\'univers Tria.');
            setEmail('');
            setTimeout(() => setNewsletterStatus('idle'), 4000);
        } catch (err: any) {
            setNewsletterStatus('error');
            setNewsletterMessage('Veuillez vérifier votre email.');
            setTimeout(() => setNewsletterStatus('idle'), 4000);
        }
    };

    return (
        <aside className="w-full space-y-12">
            {/* Table of Contents */}
            {toc && toc.length > 0 && (
                <div className="bg-white rounded-[40px] p-10 border border-slate-50 shadow-2xl shadow-slate-200/40">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="size-1 h-8 rounded-full bg-[#B8860B]" />
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em]">
                            Sommaire
                        </h4>
                    </div>
                    <nav className="space-y-4">
                        {toc.map((item, idx) => (
                            <a 
                                key={idx}
                                href={`#${item.id}`}
                                className="flex items-center gap-4 group"
                            >
                                <span className="text-[10px] font-black text-slate-300 group-hover:text-[#B8860B] transition-colors">0{idx + 1}</span>
                                <span className="text-sm font-bold text-slate-500 group-hover:text-slate-900 transition-colors truncate">
                                    {item.text}
                                </span>
                            </a>
                        ))}
                    </nav>
                </div>
            )}

            {/* Author Card */}
            {author && (
                <div className="bg-slate-900 rounded-[40px] p-12 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 size-32 bg-[#B8860B] opacity-5 rounded-full -mr-16 -mt-16 blur-2xl" />
                    <div className="relative mb-8 flex justify-center">
                        <div className="size-24 rounded-[32px] bg-slate-800 p-1 flex items-center justify-center border border-white/5">
                            <div className="size-full rounded-[28px] bg-[#B8860B] flex items-center justify-center text-white text-3xl font-black">
                                {author.name.charAt(0)}
                            </div>
                        </div>
                    </div>
                    <h4 className="text-lg font-black text-white uppercase tracking-tight mb-2">{author.name}</h4>
                    <span className="text-[10px] font-black text-[#B8860B] uppercase tracking-[0.3em] mb-6 block">{author.role}</span>
                    <p className="text-sm font-medium text-slate-400 leading-relaxed mb-8">
                        {author.bio}
                    </p>
                    <div className="flex justify-center gap-4">
                        <div className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#B8860B] transition-all cursor-pointer">
                            <Star size={16} />
                        </div>
                    </div>
                </div>
            )}

            {/* Newsletter Exclusive */}
            <div className="bg-slate-50 rounded-[50px] p-12 border border-slate-100 group">
                <div className="size-16 rounded-[24px] bg-white flex items-center justify-center text-[#B8860B] mb-8 shadow-xl shadow-[#B8860B]/5">
                    <Mail size={28} />
                </div>
                <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4">
                    Le Cercle <span className="text-[#B8860B]">Privé</span>
                </h4>
                <p className="text-sm font-medium text-slate-500 leading-relaxed mb-10">
                    Inspiration hebdomadaire, avant-premières et invitations exclusives.
                </p>
                
                <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                    <input
                        className="w-full h-16 rounded-[24px] bg-white border-none px-8 text-sm font-bold placeholder-slate-300 focus:ring-2 focus:ring-[#B8860B]/10 outline-none transition-all text-slate-900"
                        placeholder="votre@email.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="w-full h-16 rounded-[24px] bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#B8860B] transition-all shadow-2xl shadow-slate-900/10 active:scale-95 flex items-center justify-center gap-3"
                    >
                        {newsletterStatus === 'loading' ? (
                            <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>S'inscrire <ArrowRight size={16} /></>
                        )}
                    </button>
                </form>
                
                <AnimatePresence>
                    {newsletterStatus === 'success' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex items-center gap-3 text-emerald-600 font-black text-[10px] uppercase tracking-widest">
                            <Check size={16} /> {newsletterMessage}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Recent Stories */}
            {recentPosts.length > 0 && (
                <div className="space-y-8">
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] ml-4">Histoires Récentes</h4>
                    <div className="space-y-6">
                        {recentPosts.map((post) => (
                            <Link
                                key={post.id}
                                href={`/blog/post/${post.slug}`}
                                className="flex items-center gap-6 group"
                            >
                                <div className="size-20 rounded-2xl overflow-hidden shrink-0 bg-slate-50 border border-slate-100">
                                    <img
                                        src={post.imageUrl || '/placeholder-product.png'}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h5 className="text-sm font-black text-slate-900 leading-tight line-clamp-2 group-hover:text-[#B8860B] transition-colors uppercase tracking-tight">
                                        {post.title}
                                    </h5>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2 block">
                                        {new Date(post.createdAt).toLocaleDateString('fr-MA', { month: 'long', year: 'numeric' })}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Tags Cloud */}
            {(articleTags || tags.length > 0) && (
                <div className="bg-white rounded-[40px] p-10 border border-slate-50 shadow-2xl shadow-slate-200/40">
                    <h4 className="text-[11px] font-black text-[#B8860B] uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                        <Sparkles size={14} /> Inspirations
                    </h4>
                    <div className="flex flex-wrap gap-3">
                        {(articleTags || tags.map(t => t.tag)).map((t, idx) => (
                            <button
                                key={idx}
                                onClick={() => onTagClick?.(t)}
                                className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                    activeTag === t 
                                        ? 'bg-slate-900 text-white' 
                                        : 'bg-slate-50 text-slate-500 hover:bg-[#B8860B] hover:text-white'
                                }`}
                            >
                                #{t.replace(/[\[\]"]+/g, '')}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Tip of the Moment */}
            {activeTip && !hideTip && (
                <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 size-40 bg-[#B8860B] opacity-10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl group-hover:opacity-30 transition-opacity" />
                    <BookOpen className="text-[#B8860B] mb-8" size={32} />
                    <p className="text-lg font-medium text-slate-200 leading-relaxed mb-8 italic">
                        "{activeTip.content}"
                    </p>
                    <div className="pt-6 border-t border-white/5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#B8860B]">
                            {activeTip.authorName} <span className="text-slate-500 ml-2">— {activeTip.authorRole}</span>
                        </p>
                    </div>
                </div>
            )}
        </aside>
    );
}
