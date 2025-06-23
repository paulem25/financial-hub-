'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type CardVariant = 'default' | 'hover' | 'selected' | 'gamified';

export interface CardProps {
  variant?: CardVariant;
  className?: string;
  children: any;
  onClick?: () => void;
  isSelected?: boolean;
  badge?: any;
  hover?: boolean;
}

const cardVariants = {
  default: 'bg-duolingo-card border border-gray-200 shadow-card',
  hover: 'bg-duolingo-card border border-gray-200 shadow-card hover:shadow-elevated cursor-pointer',
  selected: 'bg-duolingo-card border-2 border-duolingo-green shadow-duolingo',
  gamified: 'bg-gradient-to-br from-duolingo-card to-primary-50 border border-duolingo-green shadow-duolingo',
};

export function Card({
  variant = 'default',
  className,
  children,
  onClick,
  isSelected = false,
  badge,
  hover = true,
  ...props
}: CardProps) {
  const isInteractive = !!onClick;
  const currentVariant = isSelected ? 'selected' : variant;

  return (
    <motion.div
      className={cn(
        'relative rounded-xl p-6 transition-all duration-300',
        cardVariants[currentVariant],
        isInteractive && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      whileHover={hover && isInteractive ? { 
        scale: 1.02, 
        y: -4,
        transition: { duration: 0.2 }
      } : {}}
      whileTap={isInteractive ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {/* Badge dans le coin */}
      {badge && (
        <motion.div
          className="absolute -top-2 -right-2 z-10"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
        >
          {badge}
        </motion.div>
      )}

      {/* Effet de brillance pour les cartes gamifiées */}
      {variant === 'gamified' && (
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ 
            repeat: Infinity, 
            duration: 3, 
            ease: 'linear',
            repeatDelay: 5 
          }}
        />
      )}

      {/* Contenu de la carte */}
      <div className="relative z-1">
        {children}
      </div>
    </motion.div>
  );
}

// Composants annexes pour faciliter l'utilisation
export function CardHeader({ children, className }: { children: any; className?: string }) {
  return (
    <div className={cn('mb-4', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: { children: any; className?: string }) {
  return (
    <h3 className={cn('text-xl font-bold text-duolingo-text mb-2', className)}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className }: { children: any; className?: string }) {
  return (
    <p className={cn('text-gray-600 text-sm', className)}>
      {children}
    </p>
  );
}

export function CardContent({ children, className }: { children: any; className?: string }) {
  return (
    <div className={cn('space-y-4', className)}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className }: { children: any; className?: string }) {
  return (
    <div className={cn('mt-6 pt-4 border-t border-gray-100', className)}>
      {children}
    </div>
  );
} 