import Decimal from 'decimal.js';
import {
  DCFParameters,
  DCFResult,
  DCFProjection,
  SensitivityAnalysis,
  MonteCarloParameters,
  MonteCarloResult,
  WACCCalculation,
  FinancialStatement,
  Company,
  DCFValidationResult,
  DCFScenario,
  ScenarioResult
} from '@/types/dcf';

export class DCFCalculator {
  private parameters: DCFParameters;
  private company: Company;

  constructor(parameters: DCFParameters, company: Company) {
    this.parameters = parameters;
    this.company = company;
  }

  // Calcul DCF principal
  calculate(): DCFResult {
    this.validateInputs();
    
    const projections = this.generateProjections();
    const terminalValue = this.calculateTerminalValue(projections);
    const totalPV = this.calculateTotalPresentValue(projections, terminalValue);
    const equityValue = this.calculateEquityValue(totalPV);
    const valuePerShare = this.calculateValuePerShare(equityValue);
    
    const sensitivityAnalysis = this.generateSensitivityAnalysis();
    const scenarioResults = this.calculateScenarios();
    
    return {
      projections,
      terminalValue,
      totalPresentValue: totalPV,
      equityValue,
      valuePerShare,
      currentPrice: this.company.price,
      upside: valuePerShare - this.company.price,
      upsidePercentage: ((valuePerShare - this.company.price) / this.company.price) * 100,
      wacc: this.parameters.wacc,
      impliedGrowthRate: this.calculateImpliedGrowthRate(),
      sensitivityAnalysis,
      scenarios: scenarioResults,
      assumptions: this.parameters,
      calculationDate: new Date()
    };
  }

  // Génération des projections année par année
  private generateProjections(): DCFProjection[] {
    const projections: DCFProjection[] = [];
    const historicalData = this.parameters.historicalData;
    const lastYear = historicalData[historicalData.length - 1];
    
    let previousRevenue = lastYear.revenue;
    let previousWorkingCapital = this.calculateWorkingCapital(lastYear);
    
    for (let year = 1; year <= this.parameters.terminalYear; year++) {
      const projection = this.calculateYearProjection(
        year, 
        previousRevenue, 
        previousWorkingCapital
      );
      
      projections.push(projection);
      previousRevenue = projection.revenue;
      previousWorkingCapital = projection.revenue * (this.parameters.workingCapitalAsPercentOfRevenue / 100);
    }
    
    return projections;
  }

  private calculateYearProjection(
    year: number, 
    previousRevenue: number, 
    previousWorkingCapital: number
  ): DCFProjection {
    // Calcul de la croissance du chiffre d'affaires
    const revenueGrowth = this.getRevenueGrowthRate(year);
    const revenue = previousRevenue * (1 + revenueGrowth);
    
    // Calcul de la marge opérationnelle avec fade vers la marge industrielle
    const operatingMargin = this.getOperatingMargin(year);
    const operatingIncome = revenue * operatingMargin;
    const operatingExpenses = revenue - operatingIncome;
    
    // Calcul des impôts
    const taxExpense = operatingIncome * this.parameters.taxRate;
    const nopat = operatingIncome - taxExpense;
    
    // Calcul des investissements
    const capex = revenue * (this.parameters.capexAsPercentOfRevenue / 100);
    const depreciation = this.calculateDepreciation(revenue, year);
    
    // Calcul du besoin en fonds de roulement
    const currentWorkingCapital = revenue * (this.parameters.workingCapitalAsPercentOfRevenue / 100);
    const workingCapitalChange = currentWorkingCapital - previousWorkingCapital;
    
    // Calcul du flux de trésorerie libre
    const freeCashFlow = nopat + depreciation - capex - workingCapitalChange;
    
    // Calcul de la valeur actuelle
    const discountFactor = Math.pow(1 + this.parameters.discountRate, year);
    const presentValue = freeCashFlow / discountFactor;
    
    const sharesOutstanding = this.getSharesOutstanding(year);
    
    return {
      year: new Date().getFullYear() + year,
      revenue,
      revenueGrowth,
      operatingExpenses,
      operatingIncome,
      operatingMargin,
      taxExpense,
      nopat,
      capex,
      depreciation,
      workingCapitalChange,
      freeCashFlow,
      presentValue,
      cumulativePV: 0, // Sera calculé après
      sharesOutstanding
    };
  }

  private getRevenueGrowthRate(year: number): number {
    if (year <= this.parameters.revenueGrowthRates.length) {
      return this.parameters.revenueGrowthRates[year - 1] / 100;
    }
    // Fade vers le taux de croissance terminal
    const fadeRate = 0.7; // 70% de fade par an après la période explicite
    const lastExplicitRate = this.parameters.revenueGrowthRates[this.parameters.revenueGrowthRates.length - 1] / 100;
    const terminalRate = this.parameters.terminalGrowthRate / 100;
    const yearsAfterExplicit = year - this.parameters.revenueGrowthRates.length;
    
    return terminalRate + (lastExplicitRate - terminalRate) * Math.pow(fadeRate, yearsAfterExplicit);
  }

  private getOperatingMargin(year: number): number {
    const targetMargin = this.parameters.operatingMarginTarget / 100;
    
    if (!this.parameters.fadeToIndustryMargin || !this.parameters.industryOperatingMargin) {
      return targetMargin;
    }
    
    const industryMargin = this.parameters.industryOperatingMargin / 100;
    const fadeYears = this.parameters.fadeYears || 10;
    
    if (year <= fadeYears) {
      const fadeProgress = year / fadeYears;
      return targetMargin + (industryMargin - targetMargin) * fadeProgress;
    }
    
    return industryMargin;
  }

  private calculateDepreciation(revenue: number, year: number): number {
    // Approximation: dépréciation comme pourcentage du chiffre d'affaires
    return revenue * 0.03; // 3% du CA
  }

  private getSharesOutstanding(year: number): number {
    // Hypothèse: nombre d'actions constant ou avec rachat d'actions
    const historicalShares = this.parameters.historicalData[this.parameters.historicalData.length - 1].sharesOutstanding;
    const dilutionRate = -0.02; // -2% par an (rachat d'actions)
    return historicalShares * Math.pow(1 + dilutionRate, year);
  }

  private calculateTerminalValue(projections: DCFProjection[]): number {
    const lastProjection = projections[projections.length - 1];
    const terminalGrowthRate = this.parameters.terminalGrowthRate / 100;
    const terminalFCF = lastProjection.freeCashFlow * (1 + terminalGrowthRate);
    
    // Valeur terminale = FCF terminal / (WACC - taux de croissance terminal)
    const terminalValue = terminalFCF / (this.parameters.wacc - terminalGrowthRate);
    
    // Actualisation de la valeur terminale
    const discountFactor = Math.pow(1 + this.parameters.discountRate, this.parameters.terminalYear);
    return terminalValue / discountFactor;
  }

  private calculateTotalPresentValue(projections: DCFProjection[], terminalValue: number): number {
    let cumulativePV = 0;
    
    // Calcul cumulatif des valeurs actuelles
    projections.forEach(projection => {
      cumulativePV += projection.presentValue;
      projection.cumulativePV = cumulativePV;
    });
    
    return cumulativePV + terminalValue;
  }

  private calculateEquityValue(totalPV: number): number {
    // Valeur de l'entreprise - dette nette = valeur des fonds propres
    const lastFinancials = this.parameters.historicalData[this.parameters.historicalData.length - 1];
    const netDebt = lastFinancials.totalDebt - lastFinancials.cash;
    
    return totalPV - netDebt;
  }

  private calculateValuePerShare(equityValue: number): number {
    const sharesOutstanding = this.getSharesOutstanding(0); // Actions actuelles
    return equityValue / sharesOutstanding;
  }

  private calculateImpliedGrowthRate(): number {
    // Calcul du taux de croissance implicite basé sur le prix actuel
    const currentPrice = this.company.price;
    const sharesOutstanding = this.getSharesOutstanding(0);
    const currentEquityValue = currentPrice * sharesOutstanding;
    
    // Recherche dichotomique pour trouver le taux de croissance implicite
    let lowRate = 0;
    let highRate = 0.20; // 20% max
    let impliedRate = 0.025; // 2.5% par défaut
    
    for (let i = 0; i < 50; i++) {
      const testRate = (lowRate + highRate) / 2;
      const testParameters = { ...this.parameters, terminalGrowthRate: testRate * 100 };
      const testCalculator = new DCFCalculator(testParameters, this.company);
      const testResult = testCalculator.calculate();
      
      if (Math.abs(testResult.equityValue - currentEquityValue) < currentEquityValue * 0.001) {
        impliedRate = testRate;
        break;
      }
      
      if (testResult.equityValue > currentEquityValue) {
        highRate = testRate;
      } else {
        lowRate = testRate;
      }
    }
    
    return impliedRate * 100;
  }

  // Analyse de sensibilité
  private generateSensitivityAnalysis(): SensitivityAnalysis {
    const baseWACC = this.parameters.wacc;
    const baseGrowth = this.parameters.terminalGrowthRate;
    const baseMargin = this.parameters.operatingMarginTarget;
    
    return {
      waccSensitivity: this.calculateWACCSensitivity(baseWACC, baseGrowth),
      growthSensitivity: this.calculateGrowthSensitivity(baseWACC, baseGrowth),
      marginSensitivity: this.calculateMarginSensitivity(baseMargin)
    };
  }

  private calculateWACCSensitivity(baseWACC: number, baseGrowth: number) {
    const waccRange = this.generateRange(baseWACC, 0.02, 9); // ±2% avec 9 points
    const growthRange = this.generateRange(baseGrowth, 2, 7); // ±2% avec 7 points
    const values: number[][] = [];
    
    growthRange.forEach(growth => {
      const row: number[] = [];
      waccRange.forEach(wacc => {
        const testParams = { ...this.parameters, wacc: wacc / 100, terminalGrowthRate: growth };
        const testCalculator = new DCFCalculator(testParams, this.company);
        const result = testCalculator.calculate();
        row.push(result.valuePerShare);
      });
      values.push(row);
    });
    
    return {
      xAxis: waccRange,
      yAxis: growthRange,
      values,
      baseCase: { x: baseWACC, y: baseGrowth, value: this.calculate().valuePerShare }
    };
  }

  private calculateGrowthSensitivity(baseWACC: number, baseGrowth: number) {
    const growthRange = this.generateRange(baseGrowth, 3, 11); // ±3% avec 11 points
    const revenueGrowthRange = this.generateRange(this.parameters.revenueGrowthRates[0], 5, 9); // ±5%
    const values: number[][] = [];
    
    revenueGrowthRange.forEach(revenueGrowth => {
      const row: number[] = [];
      growthRange.forEach(terminalGrowth => {
        const testParams = { 
          ...this.parameters, 
          terminalGrowthRate: terminalGrowth,
          revenueGrowthRates: [revenueGrowth, ...this.parameters.revenueGrowthRates.slice(1)]
        };
        const testCalculator = new DCFCalculator(testParams, this.company);
        const result = testCalculator.calculate();
        row.push(result.valuePerShare);
      });
      values.push(row);
    });
    
    return {
      xAxis: growthRange,
      yAxis: revenueGrowthRange,
      values,
      baseCase: { x: baseGrowth, y: this.parameters.revenueGrowthRates[0], value: this.calculate().valuePerShare }
    };
  }

  private calculateMarginSensitivity(baseMargin: number) {
    const marginRange = this.generateRange(baseMargin, 5, 9); // ±5% avec 9 points
    const capexRange = this.generateRange(this.parameters.capexAsPercentOfRevenue, 2, 7); // ±2%
    const values: number[][] = [];
    
    capexRange.forEach(capex => {
      const row: number[] = [];
      marginRange.forEach(margin => {
        const testParams = { 
          ...this.parameters, 
          operatingMarginTarget: margin,
          capexAsPercentOfRevenue: capex
        };
        const testCalculator = new DCFCalculator(testParams, this.company);
        const result = testCalculator.calculate();
        row.push(result.valuePerShare);
      });
      values.push(row);
    });
    
    return {
      xAxis: marginRange,
      yAxis: capexRange,
      values,
      baseCase: { x: baseMargin, y: this.parameters.capexAsPercentOfRevenue, value: this.calculate().valuePerShare }
    };
  }

  private generateRange(baseValue: number, variation: number, points: number): number[] {
    const range: number[] = [];
    const step = (2 * variation) / (points - 1);
    
    for (let i = 0; i < points; i++) {
      range.push(baseValue - variation + i * step);
    }
    
    return range;
  }

  // Calcul des scénarios
  private calculateScenarios(): ScenarioResult[] {
    return this.parameters.scenarios.map(scenario => {
      const scenarioParams = this.mergeParameters(this.parameters, scenario.parameters);
      const scenarioCalculator = new DCFCalculator(scenarioParams, this.company);
      const result = scenarioCalculator.calculate();
      
      return {
        ...result,
        scenarioId: scenario.id,
        scenarioName: scenario.name,
        probability: scenario.probability
      };
    });
  }

  private mergeParameters(base: DCFParameters, override: Partial<DCFParameters>): DCFParameters {
    return {
      ...base,
      ...override,
      historicalData: override.historicalData || base.historicalData,
      revenueGrowthRates: override.revenueGrowthRates || base.revenueGrowthRates,
      scenarios: base.scenarios // Garder les scénarios originaux
    };
  }

  // Simulation Monte Carlo
  calculateMonteCarlo(params: MonteCarloParameters): MonteCarloResult {
    const results: number[] = [];
    
    for (let i = 0; i < params.iterations; i++) {
      const randomParams = this.generateRandomParameters(params);
      const calculator = new DCFCalculator(randomParams, this.company);
      const result = calculator.calculate();
      results.push(result.valuePerShare);
    }
    
    results.sort((a, b) => a - b);
    
    const mean = results.reduce((sum, val) => sum + val, 0) / results.length;
    const median = results[Math.floor(results.length / 2)];
    const variance = results.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / results.length;
    const stdDev = Math.sqrt(variance);
    
    return {
      meanValue: mean,
      medianValue: median,
      standardDeviation: stdDev,
      confidenceIntervals: {
        percentile5: results[Math.floor(results.length * 0.05)],
        percentile25: results[Math.floor(results.length * 0.25)],
        percentile75: results[Math.floor(results.length * 0.75)],
        percentile95: results[Math.floor(results.length * 0.95)]
      },
      distribution: this.createDistribution(results, 20),
      scenarios: params.iterations
    };
  }

  private generateRandomParameters(params: MonteCarloParameters): DCFParameters {
    const randomRevenueGrowth = this.parameters.revenueGrowthRates.map(rate => 
      this.normalRandom(rate, params.revenueGrowthStdDev)
    );
    
    const randomWACC = this.normalRandom(this.parameters.wacc * 100, params.waccStdDev) / 100;
    const randomTerminalGrowth = this.normalRandom(this.parameters.terminalGrowthRate, params.terminalGrowthStdDev);
    const randomOperatingMargin = this.normalRandom(this.parameters.operatingMarginTarget, params.operatingMarginStdDev);
    
    return {
      ...this.parameters,
      revenueGrowthRates: randomRevenueGrowth,
      wacc: Math.max(0.01, randomWACC), // Minimum 1%
      terminalGrowthRate: Math.max(0, Math.min(15, randomTerminalGrowth)), // Entre 0% et 15%
      operatingMarginTarget: Math.max(0, Math.min(50, randomOperatingMargin)) // Entre 0% et 50%
    };
  }

  private normalRandom(mean: number, stdDev: number): number {
    // Box-Muller transform pour génération normale
    let u = 0, v = 0;
    while(u === 0) u = Math.random();
    while(v === 0) v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return mean + stdDev * z;
  }

  private createDistribution(values: number[], buckets: number): number[] {
    const min = Math.min(...values);
    const max = Math.max(...values);
    const bucketSize = (max - min) / buckets;
    const distribution = new Array(buckets).fill(0);
    
    values.forEach(value => {
      const bucketIndex = Math.min(Math.floor((value - min) / bucketSize), buckets - 1);
      distribution[bucketIndex]++;
    });
    
    return distribution;
  }

  // Validation des entrées
  private validateInputs(): DCFValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];
    
    // Validation des données historiques
    if (!this.parameters.historicalData || this.parameters.historicalData.length < 3) {
      errors.push('Au moins 3 années de données historiques sont requises');
    }
    
    // Validation des taux de croissance
    if (this.parameters.revenueGrowthRates.some(rate => rate > 50)) {
      warnings.push('Taux de croissance supérieur à 50% détecté');
    }
    
    if (this.parameters.terminalGrowthRate > 5) {
      warnings.push('Taux de croissance terminal supérieur à 5% (PIB historique)');
    }
    
    // Validation du WACC
    if (this.parameters.wacc < 0.05 || this.parameters.wacc > 0.25) {
      warnings.push('WACC en dehors de la fourchette normale (5%-25%)');
    }
    
    // Recommandations
    if (this.parameters.revenueGrowthRates.length < 5) {
      recommendations.push('Considérer une projection sur 5-10 ans pour plus de précision');
    }
    
    if (errors.length > 0) {
      throw new Error(`Erreurs de validation: ${errors.join(', ')}`);
    }
    
    return {
      isValid: true,
      errors,
      warnings,
      recommendations
    };
  }

  // Utilitaires
  private calculateWorkingCapital(statement: FinancialStatement): number {
    return statement.currentAssets - statement.currentLiabilities;
  }
}

// Calcul du WACC
export class WACCCalculator {
  static calculate(
    riskFreeRate: number,
    marketRiskPremium: number,
    beta: number,
    costOfDebt: number,
    taxRate: number,
    marketValueEquity: number,
    marketValueDebt: number
  ): WACCCalculation {
    const costOfEquity = riskFreeRate + beta * marketRiskPremium;
    const totalValue = marketValueEquity + marketValueDebt;
    const equityWeight = marketValueEquity / totalValue;
    const debtWeight = marketValueDebt / totalValue;
    const afterTaxCostOfDebt = costOfDebt * (1 - taxRate);
    
    const wacc = equityWeight * costOfEquity + debtWeight * afterTaxCostOfDebt;
    
    return {
      riskFreeRate,
      marketRiskPremium,
      beta,
      costOfEquity,
      costOfDebt,
      taxRate,
      debtToValue: debtWeight,
      equityToValue: equityWeight,
      wacc
    };
  }
}

// Fonctions utilitaires d'export
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('fr-FR').format(value);
}