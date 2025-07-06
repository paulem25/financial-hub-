export interface Company {
  symbol: string;
  name: string;
  sector: string;
  industry: string;
  marketCap: number;
  price: number;
  beta: number;
  peRatio?: number;
  pbRatio?: number;
  dividend?: number;
  dividendYield?: number;
  roe?: number;
  roa?: number;
  debtToEquity?: number;
  currentRatio?: number;
  quickRatio?: number;
  grossMargin?: number;
  operatingMargin?: number;
  netMargin?: number;
  revenueGrowth?: number;
  earningsGrowth?: number;
  bookValuePerShare?: number;
  sharesOutstanding: number;
  employees?: number;
  website?: string;
  description?: string;
  lastUpdated: Date;
}

export interface FinancialStatement {
  year: number;
  quarter?: number;
  revenue: number;
  operatingExpenses: number;
  ebitda: number;
  ebit: number;
  interestExpense: number;
  taxExpense: number;
  netIncome: number;
  operatingCashFlow: number;
  freeCashFlow: number;
  capex: number;
  workingCapitalChange: number;
  depreciation: number;
  amortization: number;
  sharesOutstanding: number;
  totalAssets: number;
  totalLiabilities: number;
  totalDebt: number;
  cash: number;
  inventory: number;
  receivables: number;
  currentAssets: number;
  currentLiabilities: number;
  shareholderEquity: number;
}

export interface DCFParameters {
  // Données historiques
  historicalData: FinancialStatement[];
  
  // Paramètres de croissance
  revenueGrowthRates: number[]; // Années 1-5
  terminalGrowthRate: number;
  
  // Paramètres de marge
  operatingMarginTarget: number;
  taxRate: number;
  
  // Paramètres d'investissement
  capexAsPercentOfRevenue: number;
  workingCapitalAsPercentOfRevenue: number;
  
  // Paramètres de financement
  wacc: number; // Weighted Average Cost of Capital
  terminalYear: number;
  
  // Paramètres de risque
  discountRate: number;
  confidenceInterval: number;
  
  // Paramètres avancés
  fadeToIndustryMargin: boolean;
  industryOperatingMargin?: number;
  fadeYears?: number;
  
  // Scénarios
  scenarios: DCFScenario[];
  currentScenario: string;
}

export interface DCFScenario {
  id: string;
  name: string;
  description?: string;
  parameters: Partial<DCFParameters>;
  probability?: number;
  color?: string;
}

export interface DCFProjection {
  year: number;
  revenue: number;
  revenueGrowth: number;
  operatingExpenses: number;
  operatingIncome: number;
  operatingMargin: number;
  taxExpense: number;
  nopat: number; // Net Operating Profit After Tax
  capex: number;
  depreciation: number;
  workingCapitalChange: number;
  freeCashFlow: number;
  presentValue: number;
  cumulativePV: number;
  terminalValue?: number;
  sharesOutstanding: number;
}

export interface DCFResult {
  projections: DCFProjection[];
  terminalValue: number;
  totalPresentValue: number;
  equityValue: number;
  valuePerShare: number;
  currentPrice: number;
  upside: number;
  upsidePercentage: number;
  wacc: number;
  impliedGrowthRate: number;
  sensitivityAnalysis: SensitivityAnalysis;
  scenarios: ScenarioResult[];
  assumptions: DCFParameters;
  calculationDate: Date;
}

export interface SensitivityAnalysis {
  waccSensitivity: SensitivityGrid;
  growthSensitivity: SensitivityGrid;
  marginSensitivity: SensitivityGrid;
}

export interface SensitivityGrid {
  xAxis: number[];
  yAxis: number[];
  values: number[][];
  baseCase: { x: number; y: number; value: number };
}

export interface ScenarioResult extends DCFResult {
  scenarioId: string;
  scenarioName: string;
  probability?: number;
}

export interface MonteCarloParameters {
  iterations: number;
  revenueGrowthStdDev: number;
  waccStdDev: number;
  terminalGrowthStdDev: number;
  operatingMarginStdDev: number;
}

export interface MonteCarloResult {
  meanValue: number;
  medianValue: number;
  standardDeviation: number;
  confidenceIntervals: {
    percentile5: number;
    percentile25: number;
    percentile75: number;
    percentile95: number;
  };
  distribution: number[];
  scenarios: number;
}

export interface WACCCalculation {
  riskFreeRate: number;
  marketRiskPremium: number;
  beta: number;
  costOfEquity: number;
  costOfDebt: number;
  taxRate: number;
  debtToValue: number;
  equityToValue: number;
  wacc: number;
}

export interface ComparableCompanies {
  companies: Company[];
  medianMultiples: {
    peRatio: number;
    pbRatio: number;
    evRevenue: number;
    evEbitda: number;
  };
  industryMetrics: {
    averageMargin: number;
    averageROE: number;
    averageGrowth: number;
    averageWACC: number;
  };
}

export interface NASDAQData {
  companies: Company[];
  sectors: string[];
  industries: string[];
  lastUpdated: Date;
  marketMetrics: {
    riskFreeRate: number;
    marketRiskPremium: number;
    averageBeta: number;
  };
}

// Utilitaires pour les calculs
export interface DCFCalculationOptions {
  includeTerminalValue: boolean;
  useMonteCarloSimulation: boolean;
  generateSensitivityAnalysis: boolean;
  includeComparables: boolean;
  exportToExcel: boolean;
  saveScenarios: boolean;
}

export interface DCFValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  recommendations: string[];
}

// Types pour l'interface utilisateur
export interface DCFFormData {
  companySymbol: string;
  customData?: Partial<Company>;
  parameters: DCFParameters;
  options: DCFCalculationOptions;
}

export interface ChartData {
  name: string;
  value: number;
  year?: number;
  scenario?: string;
  color?: string;
}

export interface TableData {
  [key: string]: string | number | undefined;
}