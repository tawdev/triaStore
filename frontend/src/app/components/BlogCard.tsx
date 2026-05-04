'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, ArrowRight, Sparkles } from 'lucide-react';
import { type BlogPost } from '../lib/api';
import { calculateReadTime } from '../lib/utils';
import { motion } from 'framer-motion';

interface BlogCardProps {
    post: BlogPost;
    priority?: boolean;
    layout?: 'grid' | 'list';
}

export default function BlogCard({ post, priority = false, layout = 'grid' }: BlogCardProps) {
    const readTime = calculateReadTime(post.content);

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
        >
            <Link
                href={`/blog/post/${post.slug}`}
                className={`group bg-white rounded-[50px] border border-slate-50 flex flex-col overflow-hidden transition-all duration-700 hover:shadow-2xl hover:shadow-slate-200/40 hover:-translate-y-2 hover:border-[#B8860B]/10 ${
                    layout === 'list' ? 'md:flex-row min-h-[380px]' : ''
                }`}
            >
            {/* Image Section */}
            <div className={`relative overflow-hidden shrink-0 bg-slate-100 ${
                layout === 'list' ? 'w-full md:w-[480px] aspect-[1.6] md:aspect-auto' : 'aspect-[1.3] w-full'
            }`}>
                <img
                    src={post.imageUrl || '/placeholder-product.png'}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    loading={priority ? 'eager' : 'lazy'}
                />

                {/* Floating Badges */}
                <div className="absolute top-8 left-8 flex items-center gap-3">
                    <span className="px-5 py-2 rounded-2xl bg-slate-900/80 backdrop-blur-md text-[9px] font-black uppercase tracking-[0.2em] text-white shadow-xl">
                        {post.category || 'JOURNAL'}
                    </span>
                    <div className="size-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white">
                        <Sparkles size={16} className="text-[#B8860B]" />
                    </div>
                </div>

                <div className="absolute bottom-8 right-8 flex items-center gap-2 px-4 py-2 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 text-[9px] font-black text-white uppercase tracking-widest">
                    <Clock size={12} className="text-[#B8860B]" strokeWidth={3} />
                    {readTime} MIN
                </div>
            </div>

            {/* Content Section */}
            <div className={`flex flex-col flex-1 ${
                layout === 'list' ? 'p-12 justify-center' : 'p-10'
            }`}>
                <div className="flex gap-4 mb-6">
                    {post.tags && post.tags.slice(0, 2).map((tag, i) => (
                        <span key={i} className="text-[9px] font-black text-[#B8860B] uppercase tracking-[0.2em]">#{tag}</span>
                    ))}
                </div>

                <h3 className={`font-black text-slate-900 leading-[1.2] uppercase tracking-tighter group-hover:text-[#B8860B] transition-colors line-clamp-2 ${
                    layout === 'list' ? 'text-[32px] mb-6' : 'text-[24px] mb-4'
                }`}>
                    {post.title}
                </h3>
                
                <p className={`font-medium text-slate-500 leading-relaxed line-clamp-3 mb-8 ${
                    layout === 'list' ? 'text-[17px]' : 'text-[15px]'
                }`}>
                    {post.excerpt || "Découvrez les secrets de l'artisanat d'exception et les tendances qui façonnent les intérieurs les plus prestigieux."}
                </p>

                {/* Footer Section */}
                <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 font-black text-xs uppercase border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all">
                            {(post.author || 'T').charAt(0)}
                        </div>
                        <div>
                            <span className="text-xs font-black text-slate-900 uppercase tracking-widest block">{post.author || 'Tria Curator'}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                {new Date(post.createdAt).toLocaleDateString('fr-MA', {
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </span>
                        </div>
                    </div>

                    <div className="size-14 rounded-[20px] bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-[#B8860B] group-hover:text-white transition-all transform group-hover:rotate-[-45deg]">
                        <ArrowRight size={24} />
                    </div>
                </div>
            </div>

        </Link>
        </motion.div>
    );
}
