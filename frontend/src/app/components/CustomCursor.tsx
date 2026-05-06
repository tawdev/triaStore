'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const updateMousePosition = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        const updateHoverState = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Vérifie si l'élément survolé est cliquable (lien, bouton, input)
            if (target.tagName.toLowerCase() === 'a' || 
                target.tagName.toLowerCase() === 'button' || 
                target.tagName.toLowerCase() === 'input' || 
                target.closest('a') || 
                target.closest('button')) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', updateMousePosition);
        window.addEventListener('mouseover', updateHoverState);

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
            window.removeEventListener('mouseover', updateHoverState);
        };
    }, []);

    // Ne pas afficher sur mobile
    if (typeof window !== 'undefined' && window.innerWidth < 768) return null;

    return (
        <motion.div
            className="fixed top-0 left-0 w-8 h-8 border-2 border-[#B8860B] rounded-full pointer-events-none z-[9999] flex items-center justify-center mix-blend-difference"
            animate={{
                x: mousePosition.x - 16,
                y: mousePosition.y - 16,
                scale: isHovering ? 1.5 : 1,
                backgroundColor: isHovering ? 'rgba(184, 134, 11, 0.2)' : 'transparent',
            }}
            transition={{
                type: 'spring',
                stiffness: 150,
                damping: 15,
                mass: 0.1
            }}
        >
            <motion.div 
                className="w-1.5 h-1.5 bg-[#B8860B] rounded-full"
                animate={{
                    opacity: isHovering ? 0 : 1
                }}
            />
        </motion.div>
    );
}
