'use client';

import { useEffect, useState } from 'react';
import { api, Product } from '../lib/api';
import ProductCard from './ProductCard';
import { motion } from 'framer-motion';

export default function RelatedProducts({ categoryId, currentProductId }: { categoryId?: number | null, currentProductId: number }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await api.getProducts({ categoryId: categoryId || undefined, limit: 12 });
        const related = res.data.filter(p => Number(p.id) !== currentProductId).slice(0, 4);
        setProducts(related);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [categoryId, currentProductId]);

  if (loading || !products || products.length === 0) return null;

  return (
    <div className="mt-32 mb-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-12"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="h-[1px] flex-1 bg-slate-100"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Suggestions d'exception</span>
          <div className="h-[1px] flex-1 bg-slate-100"></div>
        </div>
        <h3 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter text-center">
          Complétez votre <span className="text-[#B8860B]">Collection</span>
        </h3>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product, idx) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
