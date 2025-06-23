'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Trophy, Star, Crown, Medal, Zap } from 'lucide-react';

export type BadgeType = 'achievement' | 'level' | 'status' | 'count';
export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'rare' | 'epic' | 'legendary';

export interface BadgeProps {
  type: BadgeType;
  variant?: BadgeVariant;
  icon?: any;
  children: any;
  className?: string;
  animated?: boolean;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  glow?: boolean;
}

const badgeVariants = {
  default: 'bg-gray-100 text-gray-800 border-gray-200',
  success: 'bg-duolingo-green text-white border-primary-600',
  warning: 'bg-duolingo-orange text-white border-secondary-600',
  danger: 'bg-danger text-white border-red-600',
  rare: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-purple-600',
  epic: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-pink-600',
  legendary: 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white border-orange-600',
};

const rarityIcons = {
  common: Star,
  rare: Trophy,
  epic: Crown,
  legendary: Medal,
};

const rarityColors = {
  common: 'text-gray-600',
  rare: 'text-blue-500',
  epic: 'text-purple-500',
  legendary: 'text-yellow-500',
};

export function Badge({
  type,
  variant = 'default',
  icon: CustomIcon,
  children,
  className,
  animated = true,
  rarity = 'common',
  glow = false,
  ...props
}: BadgeProps) {
  const IconComponent = CustomIcon || (type === 'achievement' ? rarityIcons[rarity] : Zap);
  const currentVariant = rarity !== 'common' ? rarity : variant;

  return (
    <motion.div
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border',
        'transition-all duration-300',
        badgeVariants[currentVariant],
        glow && 'animate-glow shadow-lg',
        className
      )}
      initial={animated ? { scale: 0, opacity: 0 } : {}}
      animate={animated ? { scale: 1, opacity: 1 } : {}}
      transition={animated ? { 
        type: 'spring', 
        stiffness: 300, 
        damping: 20,
        delay: 0.1 
      } : {}}
      whileHover={animated ? { scale: 1.05 } : {}}
      whileTap={animated ? { scale: 0.95 } : {}}
      {...props}
    >
      {/* Icône avec animation */}
      {IconComponent && (
        <motion.div
          initial={animated ? { rotate: -180, scale: 0 } : {}}
          animate={animated ? { rotate: 0, scale: 1 } : {}}
          transition={animated ? { delay: 0.2, duration: 0.5 } : {}}
        >
          <IconComponent className="w-3 h-3" />
        </motion.div>
      )}

      {/* Contenu */}
      <motion.span
        initial={animated ? { opacity: 0, x: -10 } : {}}
        animate={animated ? { opacity: 1, x: 0 } : {}}
        transition={animated ? { delay: 0.3 } : {}}
      >
        {children}
      </motion.span>

      {/* Effet de brillance pour les badges légendaires */}
      {rarity === 'legendary' && (
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ 
            repeat: Infinity, 
            duration: 2, 
            ease: 'linear',
            repeatDelay: 3 
          }}
        />
      )}
    </motion.div>
  );
}

// Badge de niveau avec animation spéciale
export function LevelBadge({ 
  level, 
  animated = true, 
  className 
}: { 
  level: number; 
  animated?: boolean; 
  className?: string; 
}) {
  return (
    <motion.div
      className={cn(
        'relative inline-flex items-center justify-center',
        'w-12 h-12 rounded-full bg-gradient-to-br from-duolingo-green to-primary-600',
        'text-white font-bold text-lg shadow-duolingo',
        'border-4 border-white',
        className
      )}
      initial={animated ? { scale: 0, rotate: -180 } : {}}
      animate={animated ? { scale: 1, rotate: 0 } : {}}
      transition={animated ? { 
        type: 'spring', 
        stiffness: 260, 
        damping: 20 
      } : {}}
      whileHover={animated ? { scale: 1.1, rotate: 5 } : {}}
    >
      {level}
      
      {/* Particules autour du badge de niveau élevé */}
      {level >= 10 && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full"
              style={{
                left: '50%',
                top: '50%',
                transformOrigin: '0 0',
              }}
              initial={{ 
                rotate: i * 60,
                x: 0,
                y: 0,
                scale: 0 
              }}
              animate={{ 
                rotate: i * 60,
                x: 20,
                y: 0,
                scale: [0, 1, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                delay: i * 0.2,
                ease: 'easeInOut'
              }}
            />
          ))}
        </>
      )}
    </motion.div>
  );
}

// Badge de count avec animation de numbers
export function CountBadge({ 
  count, 
  label, 
  animated = true,
  className 
}: { 
  count: number; 
  label: string;
  animated?: boolean; 
  className?: string; 
}) {
  return (
    <motion.div
      className={cn(
        'inline-flex flex-col items-center gap-1 px-3 py-2',
        'bg-duolingo-card rounded-xl border border-gray-200 shadow-card',
        className
      )}
      initial={animated ? { opacity: 0, y: 20 } : {}}
      animate={animated ? { opacity: 1, y: 0 } : {}}
      transition={animated ? { duration: 0.3 } : {}}
    >
      <motion.span
        className="text-2xl font-bold text-duolingo-green"
        initial={animated ? { scale: 0 } : {}}
        animate={animated ? { scale: 1 } : {}}
        transition={animated ? { 
          delay: 0.2, 
          type: 'spring', 
          stiffness: 300 
        } : {}}
      >
        {count}
      </motion.span>
      <span className="text-xs text-gray-600 font-medium">
        {label}
      </span>
    </motion.div>
  );
} 