'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const buttonVariants = {
  primary: 'bg-duolingo-green hover:bg-primary-600 text-white shadow-duolingo',
  secondary: 'bg-duolingo-orange hover:bg-secondary-600 text-white shadow-lg',
  outline: 'border-2 border-duolingo-green text-duolingo-green hover:bg-duolingo-green hover:text-white',
  ghost: 'text-duolingo-green hover:bg-primary-50',
  danger: 'bg-danger hover:bg-red-600 text-white shadow-lg',
};

const buttonSizes = {
  sm: 'px-3 py-2 text-sm rounded-lg',
  md: 'px-4 py-3 text-base rounded-xl',
  lg: 'px-6 py-4 text-lg rounded-xl',
  xl: 'px-8 py-5 text-xl rounded-2xl',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    isLoading = false,
    disabled = false,
    icon,
    children,
    className,
    ...props 
  }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center gap-2 font-bold',
          'transition-all duration-300 ease-out',
          'focus:outline-none focus:ring-4 focus:ring-primary-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'active:scale-95 transform',
          buttonVariants[variant],
          buttonSizes[size],
          className
        )}
        disabled={disabled || isLoading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        {...props}
      >
        {/* Effet de ripple */}
        <motion.div
          className="absolute inset-0 rounded-inherit"
          initial={{ scale: 0, opacity: 0.5 }}
          whileTap={{ scale: 1, opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
          }}
        />
        
        {/* Icône de chargement */}
        {isLoading && (
          <Loader2 className="w-4 h-4 animate-spin" />
        )}
        
        {/* Icône personnalisée */}
        {icon && !isLoading && (
          <motion.span
            initial={{ rotate: 0 }}
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            {icon}
          </motion.span>
        )}
        
        {/* Contenu du bouton */}
        <span className={cn(isLoading && 'opacity-70')}>
          {children}
        </span>
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export { Button }; 