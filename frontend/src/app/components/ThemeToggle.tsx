'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`
        relative flex items-center justify-center
        w-10 h-10 rounded-full
        transition-all duration-300 ease-in-out
        ${isDark
                    ? 'bg-slate-700 hover:bg-slate-600 text-yellow-300'
                    : 'bg-secondary hover:bg-slate-200 text-slate-600'
                }
      `}
        >
            {/* Sun icon – visible in light mode */}
            <Sun
                className={`
          absolute transition-all duration-300
          ${isDark ? 'opacity-0 scale-75 rotate-90' : 'opacity-100 scale-100 rotate-0'}
        `}
                size={20}
            />

            {/* Moon icon – visible in dark mode */}
            <Moon
                className={`
          absolute transition-all duration-300
          ${isDark ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 -rotate-90'}
        `}
                size={20}
            />
        </button>
    );
}


