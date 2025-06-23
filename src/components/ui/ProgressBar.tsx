'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Sparkles, Star } from 'lucide-react';

export type ProgressBarVariant = 'default' | 'xp' | 'level';

export interface ProgressBarProps {
  value: number;
  max: number;
  variant?: ProgressBarVariant;
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
  label?: string;
  showSparkles?: boolean;
}

const progressVariants = {
  default: {
    bg: 'bg-gray-200',
    fill: 'bg-duolingo-green',
    text: 'text-duolingo-text',
  },
  xp: {
    bg: 'bg-gradient-to-r from-gray-200 to-gray-300',
    fill: 'bg-gradient-to-r from-duolingo-green to-primary-400',
    text: 'text-duolingo-green font-bold',
  },
  level: {
    bg: 'bg-gradient-to-r from-accent-200 to-accent-300',
    fill: 'bg-gradient-to-r from-duolingo-purple to-accent-400',
    text: 'text-duolingo-purple font-bold',
  },
};

export function ProgressBar({
  value,
  max,
  variant = 'default',
  showLabel = true,
  animated = true,
  className,
  label,
  showSparkles = false,
  ...props
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const styles = progressVariants[variant];

  return (
    <div className={cn('w-full', className)} {...props}>
      {/* Label */}
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className={cn('text-sm', styles.text)}>
            {label || `Progression ${variant}`}
          </span>
          <span className={cn('text-sm font-mono', styles.text)}>
            {Math.round(value)} / {max}
          </span>
        </div>
      )}

      {/* Barre de progression */}
      <div className="relative">
        {/* Background */}
        <div className={cn('h-3 rounded-full overflow-hidden', styles.bg)}>
          {/* Fill avec animation */}
          <motion.div
            className={cn('h-full rounded-full relative overflow-hidden', styles.fill)}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ 
              duration: animated ? 1.5 : 0, 
              ease: 'easeOut',
              delay: 0.2 
            }}
          >
            {/* Effet de brillance */}
            {animated && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  repeatDelay: 3,
                  ease: 'linear' 
                }}
              />
            )}
          </motion.div>
        </div>

        {/* Sparkles pour les barres XP */}
        <AnimatePresence>
          {showSparkles && percentage > 80 && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${20 + i * 25}%`,
                    top: '-8px',
                  }}
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{ 
                    scale: [0, 1, 0], 
                    rotate: [0, 180, 360],
                    y: [0, -10, 0]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    delay: i * 0.5,
                    ease: 'easeInOut'
                  }}
                >
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Icône de niveau */}
        {variant === 'level' && percentage >= 100 && (
          <motion.div
            className="absolute -right-2 -top-2"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              delay: 1.5, 
              duration: 0.5, 
              type: 'spring',
              stiffness: 300 
            }}
          >
            <Star className="w-6 h-6 text-yellow-400 fill-current" />
          </motion.div>
        )}
      </div>

      {/* Pourcentage en dessous */}
      {animated && (
        <motion.div
          className="text-center mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <span className={cn('text-xs', styles.text)}>
            {Math.round(percentage)}%
          </span>
        </motion.div>
      )}
    </div>
  );
}

// Composant circulaire pour les niveaux
export function CircularProgress({
  value,
  max,
  size = 120,
  strokeWidth = 8,
  className,
  children,
}: {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  children?: any;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min((value / max) * 100, 100);
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#58CC02" />
            <stop offset="100%" stopColor="#74D634" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Contenu central */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
} 