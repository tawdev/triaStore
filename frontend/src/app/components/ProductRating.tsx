'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { api } from '../lib/api';

interface ProductRatingProps {
    productId: number;
    className?: string;
    starSize?: number;
    textSize?: string;
}

export default function ProductRating({ 
    productId, 
    className = "", 
    starSize = 12,
    textSize = "text-[10px]"
}: ProductRatingProps) {
    const [stats, setStats] = useState({ avg: 0, count: 0 });

    useEffect(() => {
        let isMounted = true;

        const loadStats = async () => {
            if (!productId) return;
            
            try {
                // Quick initial load from localStorage
                const saved = localStorage.getItem(`reviews_${productId}`);
                if (saved) {
                    try {
                        const reviews = JSON.parse(saved);
                        if (Array.isArray(reviews) && reviews.length > 0) {
                            const avg = reviews.reduce((acc: number, r: any) => acc + (r.rating || 0), 0) / reviews.length;
                            if (isMounted) setStats({ avg, count: reviews.length });
                        }
                    } catch (e) {
                        // Ignore parse errors
                    }
                }

                // Fetch real data from API with a small delay to avoid overwhelming the server on page load
                // only if we haven't already fetched it in this session (optional optimization)
                
                const realReviews = await api.getProductReviews(productId).catch(err => {
                    // Fail silently or log a warning instead of a full error for "Failed to fetch"
                    if (err.message === 'Failed to fetch') {
                        console.warn(`Could not reach API for product ${productId} reviews. Using cached data if available.`);
                        return null;
                    }
                    throw err;
                });

                if (isMounted && realReviews) {
                    if (Array.isArray(realReviews)) {
                        const avg = realReviews.length > 0 
                            ? realReviews.reduce((acc: number, r: any) => acc + (r.rating || 0), 0) / realReviews.length
                            : 0;
                        setStats({ avg, count: realReviews.length });
                        // Update local cache
                        localStorage.setItem(`reviews_${productId}`, JSON.stringify(realReviews));
                    }
                }
            } catch (err) {
                // Silently handle other errors to avoid crashing the UI
            }
        };

        loadStats();

        // Listen for local custom events if reviews are added in the same window
        const handleReviewUpdate = () => loadStats();
        window.addEventListener('reviewsUpdated', handleReviewUpdate);
        
        // Listen for storage changes in other tabs
        window.addEventListener('storage', (e) => {
            if (e.key === `reviews_${productId}`) loadStats();
        });

        return () => {
            isMounted = false;
            window.removeEventListener('reviewsUpdated', handleReviewUpdate);
            window.removeEventListener('storage', loadStats);
        };
    }, [productId]);

    return (
        <div className={`flex items-center gap-1.5 ${className}`}>
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                    <Star 
                        key={s} 
                        size={starSize} 
                        className={`${s <= Math.round(stats.avg) ? 'fill-[#FFB800] text-[#FFB800]' : 'fill-slate-100 text-slate-100'}`} 
                        strokeWidth={s <= Math.round(stats.avg) ? 0 : 1.5}
                    />
                ))}
            </div>
            <span className={`${textSize} font-bold text-slate-400 uppercase tracking-wider`}>
                {stats.count} Avis
            </span>
        </div>
    );
}
