// Types pour le système de gamification
export interface User {
  id: string;
  email: string;
  name: string;
  level: number;
  experience: number;
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  achievements: Achievement[];
  avatar?: string;
  createdAt: Date;
  lastLogin: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  condition: string;
  unlockedAt?: Date;
}

export interface GameificationStats {
  totalCalculations: number;
  calculatorsUsed: string[];
  averageAccuracy: number;
  timeSpent: number;
  favoriteCalculator?: string;
}

// Types pour les calculatrices
export interface CalculationResult {
  id: string;
  type: CalculatorType;
  inputs: Record<string, any>;
  results: Record<string, any>;
  timestamp: Date;
  pointsEarned: number;
}

export type CalculatorType = 
  | 'credit'
  | 'investment' 
  | 'retirement'
  | 'taxes'
  | 'budget';

export interface CreditCalculationInputs {
  amount: number;
  duration: number; // en mois
  rate: number; // taux annuel
  insurance?: number;
  fees?: number;
}

export interface CreditCalculationResults {
  monthlyPayment: number;
  totalCost: number;
  totalInterest: number;
  amortizationTable: AmortizationRow[];
}

export interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

export interface InvestmentInputs {
  initialAmount: number;
  monthlyContribution: number;
  annualReturn: number;
  duration: number; // en années
  riskLevel: 'low' | 'medium' | 'high';
  fees?: number;
}

export interface InvestmentResults {
  finalAmount: number;
  totalContributions: number;
  totalGains: number;
  projectionChart: ChartDataPoint[];
  riskAnalysis: RiskAnalysis;
}

export interface ChartDataPoint {
  period: number;
  value: number;
  label: string;
}

export interface RiskAnalysis {
  volatility: number;
  maxDrawdown: number;
  sharpeRatio: number;
  scenarios: {
    pessimistic: number;
    realistic: number;
    optimistic: number;
  };
}

import { ReactNode } from 'react';

// Types pour l'interface utilisateur
export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'outline' 
  | 'ghost' 
  | 'danger';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export type CardVariant = 
  | 'default' 
  | 'hover' 
  | 'selected' 
  | 'gamified';

export interface CardProps {
  variant?: CardVariant;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}

export interface ProgressBarProps {
  value: number;
  max: number;
  variant?: 'default' | 'xp' | 'level';
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

export interface BadgeProps {
  type: 'achievement' | 'level' | 'status' | 'count';
  variant?: 'default' | 'success' | 'warning' | 'danger';
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  animated?: boolean;
} 