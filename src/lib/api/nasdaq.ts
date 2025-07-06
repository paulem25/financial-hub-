import axios from 'axios';
import { Company, FinancialStatement, NASDAQData } from '@/types/dcf';

// Configuration des APIs financières
const API_CONFIG = {
  // Alpha Vantage (gratuit avec limitations)
  ALPHA_VANTAGE: {
    baseUrl: 'https://www.alphavantage.co/query',
    apiKey: process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY || 'demo',
  },
  // Financial Modeling Prep (freemium)
  FMP: {
    baseUrl: 'https://financialmodelingprep.com/api/v3',
    apiKey: process.env.NEXT_PUBLIC_FMP_API_KEY || 'demo',
  },
  // Yahoo Finance (gratuit mais pas officiel)
  YAHOO: {
    baseUrl: 'https://query1.finance.yahoo.com/v8/finance/chart',
  },
  // Taux sans risque (Fed)
  TREASURY: {
    baseUrl: 'https://api.stlouisfed.org/fred/series/observations',
    apiKey: process.env.NEXT_PUBLIC_FRED_API_KEY || 'demo',
  }
};

class NASDAQDataService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private isValidCacheEntry(entry: { data: any; timestamp: number }): boolean {
    return Date.now() - entry.timestamp < this.CACHE_DURATION;
  }

  private async fetchWithCache<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    const cached = this.cache.get(key);
    if (cached && this.isValidCacheEntry(cached)) {
      return cached.data;
    }

    try {
      const data = await fetcher();
      this.cache.set(key, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      console.error(`Failed to fetch ${key}:`, error);
      if (cached) {
        return cached.data; // Return stale data if available
      }
      throw error;
    }
  }

  async getAllNASDAQCompanies(): Promise<Company[]> {
    return this.fetchWithCache('nasdaq-companies', async () => {
      try {
        // Essayer Financial Modeling Prep en premier
        const response = await axios.get(
          `${API_CONFIG.FMP.baseUrl}/stock/list?apikey=${API_CONFIG.FMP.apiKey}`
        );

        const nasdaqCompanies = response.data
          .filter((company: any) => company.exchange === 'NASDAQ')
          .slice(0, 100) // Limiter pour les performances
          .map((company: any) => this.mapFMPToCompany(company));

        return nasdaqCompanies;
      } catch (error) {
        console.warn('FMP API failed, using mock data');
        return this.getMockNASDAQCompanies();
      }
    });
  }

  async getCompanyDetails(symbol: string): Promise<Company> {
    return this.fetchWithCache(`company-${symbol}`, async () => {
      try {
        const [profile, quote, ratios] = await Promise.all([
          this.getCompanyProfile(symbol),
          this.getCompanyQuote(symbol),
          this.getCompanyRatios(symbol)
        ]);

        return {
          ...profile,
          ...quote,
          ...ratios,
          lastUpdated: new Date()
        };
      } catch (error) {
        console.warn(`Failed to fetch ${symbol}, using mock data`);
        return this.getMockCompany(symbol);
      }
    });
  }

  private async getCompanyProfile(symbol: string) {
    const response = await axios.get(
      `${API_CONFIG.FMP.baseUrl}/profile/${symbol}?apikey=${API_CONFIG.FMP.apiKey}`
    );
    
    const data = response.data[0];
    return {
      symbol: data.symbol,
      name: data.companyName,
      sector: data.sector,
      industry: data.industry,
      marketCap: data.mktCap,
      beta: data.beta,
      sharesOutstanding: data.volAvg,
      employees: data.fullTimeEmployees,
      website: data.website,
      description: data.description,
    };
  }

  private async getCompanyQuote(symbol: string) {
    const response = await axios.get(
      `${API_CONFIG.FMP.baseUrl}/quote/${symbol}?apikey=${API_CONFIG.FMP.apiKey}`
    );
    
    const data = response.data[0];
    return {
      price: data.price,
      peRatio: data.pe,
      dividend: data.dividend,
      dividendYield: data.dividendYield,
    };
  }

  private async getCompanyRatios(symbol: string) {
    const response = await axios.get(
      `${API_CONFIG.FMP.baseUrl}/ratios/${symbol}?apikey=${API_CONFIG.FMP.apiKey}&limit=1`
    );
    
    const data = response.data[0];
    return {
      pbRatio: data.priceToBookRatio,
      roe: data.returnOnEquity,
      roa: data.returnOnAssets,
      debtToEquity: data.debtEquityRatio,
      currentRatio: data.currentRatio,
      quickRatio: data.quickRatio,
      grossMargin: data.grossProfitMargin,
      operatingMargin: data.operatingProfitMargin,
      netMargin: data.netProfitMargin,
    };
  }

  async getFinancialStatements(symbol: string, years: number = 5): Promise<FinancialStatement[]> {
    return this.fetchWithCache(`financials-${symbol}-${years}`, async () => {
      try {
        const [incomeStatement, balanceSheet, cashFlow] = await Promise.all([
          this.getIncomeStatement(symbol, years),
          this.getBalanceSheet(symbol, years),
          this.getCashFlowStatement(symbol, years)
        ]);

        return this.combineFinancialStatements(incomeStatement, balanceSheet, cashFlow);
      } catch (error) {
        console.warn(`Failed to fetch financials for ${symbol}, using mock data`);
        return this.getMockFinancialStatements(symbol, years);
      }
    });
  }

  private async getIncomeStatement(symbol: string, years: number) {
    const response = await axios.get(
      `${API_CONFIG.FMP.baseUrl}/income-statement/${symbol}?apikey=${API_CONFIG.FMP.apiKey}&limit=${years}`
    );
    return response.data;
  }

  private async getBalanceSheet(symbol: string, years: number) {
    const response = await axios.get(
      `${API_CONFIG.FMP.baseUrl}/balance-sheet-statement/${symbol}?apikey=${API_CONFIG.FMP.apiKey}&limit=${years}`
    );
    return response.data;
  }

  private async getCashFlowStatement(symbol: string, years: number) {
    const response = await axios.get(
      `${API_CONFIG.FMP.baseUrl}/cash-flow-statement/${symbol}?apikey=${API_CONFIG.FMP.apiKey}&limit=${years}`
    );
    return response.data;
  }

  private combineFinancialStatements(
    incomeStatements: any[],
    balanceSheets: any[],
    cashFlows: any[]
  ): FinancialStatement[] {
    const statements: FinancialStatement[] = [];

    for (let i = 0; i < incomeStatements.length; i++) {
      const income = incomeStatements[i];
      const balance = balanceSheets[i];
      const cashFlow = cashFlows[i];

      statements.push({
        year: new Date(income.date).getFullYear(),
        revenue: income.revenue || 0,
        operatingExpenses: income.operatingExpenses || 0,
        ebitda: income.ebitda || 0,
        ebit: income.operatingIncome || 0,
        interestExpense: income.interestExpense || 0,
        taxExpense: income.incomeTaxExpense || 0,
        netIncome: income.netIncome || 0,
        operatingCashFlow: cashFlow.operatingCashFlow || 0,
        freeCashFlow: cashFlow.freeCashFlow || 0,
        capex: Math.abs(cashFlow.capitalExpenditure || 0),
        workingCapitalChange: cashFlow.changeInWorkingCapital || 0,
        depreciation: cashFlow.depreciationAndAmortization || 0,
        amortization: 0,
        sharesOutstanding: income.weightedAverageShsOut || 0,
        totalAssets: balance.totalAssets || 0,
        totalLiabilities: balance.totalLiabilities || 0,
        totalDebt: balance.totalDebt || 0,
        cash: balance.cashAndCashEquivalents || 0,
        inventory: balance.inventory || 0,
        receivables: balance.netReceivables || 0,
        currentAssets: balance.totalCurrentAssets || 0,
        currentLiabilities: balance.totalCurrentLiabilities || 0,
        shareholderEquity: balance.totalStockholdersEquity || 0,
      });
    }

    return statements.sort((a, b) => a.year - b.year);
  }

  async getRiskFreeRate(): Promise<number> {
    return this.fetchWithCache('risk-free-rate', async () => {
      try {
        const response = await axios.get(
          `${API_CONFIG.TREASURY.baseUrl}?series_id=DGS10&api_key=${API_CONFIG.TREASURY.apiKey}&file_type=json&limit=1&sort_order=desc`
        );
        
        const rate = parseFloat(response.data.observations[0].value);
        return rate / 100; // Convert percentage to decimal
      } catch (error) {
        console.warn('Failed to fetch risk-free rate, using default');
        return 0.025; // 2.5% default
      }
    });
  }

  async getMarketRiskPremium(): Promise<number> {
    // Historical market risk premium (approximation)
    return 0.065; // 6.5%
  }

  async getSectorComparables(sector: string): Promise<Company[]> {
    const allCompanies = await this.getAllNASDAQCompanies();
    return allCompanies.filter(company => company.sector === sector);
  }

  // Données mock pour la démonstration
  private getMockNASDAQCompanies(): Company[] {
    return [
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        sector: 'Technology',
        industry: 'Consumer Electronics',
        marketCap: 3000000000000,
        price: 180.00,
        beta: 1.2,
        peRatio: 28.5,
        pbRatio: 45.2,
        dividend: 0.92,
        dividendYield: 0.51,
        roe: 0.175,
        roa: 0.108,
        debtToEquity: 1.73,
        currentRatio: 1.0,
        quickRatio: 0.88,
        grossMargin: 0.433,
        operatingMargin: 0.307,
        netMargin: 0.253,
        revenueGrowth: 0.078,
        earningsGrowth: 0.095,
        bookValuePerShare: 3.98,
        sharesOutstanding: 16666666667,
        employees: 154000,
        website: 'https://www.apple.com',
        description: 'Apple Inc. designs, manufactures, and markets consumer electronics.',
        lastUpdated: new Date()
      },
      {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        sector: 'Technology',
        industry: 'Software',
        marketCap: 2800000000000,
        price: 380.00,
        beta: 0.9,
        peRatio: 32.1,
        pbRatio: 12.8,
        dividend: 2.72,
        dividendYield: 0.72,
        roe: 0.186,
        roa: 0.098,
        debtToEquity: 0.47,
        currentRatio: 1.77,
        quickRatio: 1.75,
        grossMargin: 0.689,
        operatingMargin: 0.416,
        netMargin: 0.307,
        revenueGrowth: 0.128,
        earningsGrowth: 0.145,
        bookValuePerShare: 29.67,
        sharesOutstanding: 7368421053,
        employees: 221000,
        website: 'https://www.microsoft.com',
        description: 'Microsoft Corporation develops and supports software, services, devices and solutions.',
        lastUpdated: new Date()
      },
      // Ajouter plus d'entreprises...
    ];
  }

  private getMockCompany(symbol: string): Company {
    const mockCompanies = this.getMockNASDAQCompanies();
    return mockCompanies.find(c => c.symbol === symbol) || mockCompanies[0];
  }

  private getMockFinancialStatements(symbol: string, years: number): FinancialStatement[] {
    const statements: FinancialStatement[] = [];
    const currentYear = new Date().getFullYear();
    
    // Base des données réalistes pour Apple
    const baseRevenue = symbol === 'AAPL' ? 365000000000 : 150000000000;
    const growthRate = 0.08;
    
    for (let i = 0; i < years; i++) {
      const year = currentYear - years + i + 1;
      const revenue = baseRevenue * Math.pow(1 + growthRate, i - years + 1);
      
      statements.push({
        year,
        revenue,
        operatingExpenses: revenue * 0.25,
        ebitda: revenue * 0.35,
        ebit: revenue * 0.31,
        interestExpense: revenue * 0.005,
        taxExpense: revenue * 0.055,
        netIncome: revenue * 0.25,
        operatingCashFlow: revenue * 0.28,
        freeCashFlow: revenue * 0.22,
        capex: revenue * 0.06,
        workingCapitalChange: revenue * 0.01,
        depreciation: revenue * 0.04,
        amortization: revenue * 0.01,
        sharesOutstanding: 16000000000,
        totalAssets: revenue * 2.2,
        totalLiabilities: revenue * 1.5,
        totalDebt: revenue * 0.8,
        cash: revenue * 0.4,
        inventory: revenue * 0.02,
        receivables: revenue * 0.12,
        currentAssets: revenue * 0.8,
        currentLiabilities: revenue * 0.6,
        shareholderEquity: revenue * 0.7,
      });
    }
    
    return statements;
  }

  private mapFMPToCompany(fmpData: any): Company {
    return {
      symbol: fmpData.symbol,
      name: fmpData.name,
      sector: fmpData.sector || 'Unknown',
      industry: fmpData.industry || 'Unknown',
      marketCap: fmpData.marketCap || 0,
      price: fmpData.price || 0,
      beta: fmpData.beta || 1.0,
      sharesOutstanding: fmpData.sharesOutstanding || 0,
      lastUpdated: new Date()
    };
  }
}

export const nasdaqApi = new NASDAQDataService();

// Fonctions utilitaires
export async function searchCompanies(query: string): Promise<Company[]> {
  const allCompanies = await nasdaqApi.getAllNASDAQCompanies();
  return allCompanies.filter(company => 
    company.symbol.toLowerCase().includes(query.toLowerCase()) ||
    company.name.toLowerCase().includes(query.toLowerCase())
  );
}

export async function getCompanyData(symbol: string): Promise<{
  company: Company;
  financials: FinancialStatement[];
}> {
  const [company, financials] = await Promise.all([
    nasdaqApi.getCompanyDetails(symbol),
    nasdaqApi.getFinancialStatements(symbol)
  ]);

  return { company, financials };
}

export async function getMarketData(): Promise<{
  riskFreeRate: number;
  marketRiskPremium: number;
}> {
  const [riskFreeRate, marketRiskPremium] = await Promise.all([
    nasdaqApi.getRiskFreeRate(),
    nasdaqApi.getMarketRiskPremium()
  ]);

  return { riskFreeRate, marketRiskPremium };
}