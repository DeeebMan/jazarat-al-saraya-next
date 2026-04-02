'use client';

import { cn } from '@/lib/utils/cn';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'success' | 'ghost' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export function Button({ variant = 'primary', size = 'md', isLoading, children, className, disabled, ...props }: ButtonProps) {
  const variants = {
    primary: 'bg-gradient-to-l from-[#d4a574] to-[#e8c49a] text-[#0a0a0a] hover:shadow-[0_0_25px_rgba(212,165,116,0.4)]',
    danger: 'bg-gradient-to-l from-red-600 to-red-500 text-white hover:shadow-[0_0_25px_rgba(239,68,68,0.4)]',
    success: 'bg-gradient-to-l from-[#25D366] to-[#128C7E] text-white hover:shadow-[0_0_25px_rgba(37,211,102,0.4)]',
    ghost: 'bg-transparent text-[#d4a574] hover:bg-[#d4a574]/10 border border-[#d4a574]/30',
    secondary: 'bg-[#1a1a2e] text-[#a0a0b0] hover:bg-[#2a2a3e] border border-white/10',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...(props as any)}
    >
      {isLoading && (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </motion.button>
  );
}
