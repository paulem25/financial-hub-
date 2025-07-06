'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, 
  TrendingUp, 
  Settings, 
  Download, 
  Save,
  RefreshCw,
  BarChart3,
  Target,
  DollarSign,
  Percent,
  AlertTriangle,
  CheckCircle,
  Info,
  ChevronRight,
  Search,
  Building2,
  Zap
} from 'lucide-react';

import { DCFCalculator, WACCCalculator, formatCurrency, formatPercentage } from '@/lib/dcf/calculator';
import { nasdaqApi, searchCompanies, getCompanyData, getMarketData } from '@/lib/api/nasdaq';
import { 
  Company, 
  DCFParameters, 
  DCFResult, 
  DCFScenario,
  MonteCarloParameters 
} from '@/types/dcf';

import { CompanySelector } from '@/components/dcf/CompanySelector';
import { ParametersPanel } from '@/components/dcf/ParametersPanel';
import { ScenariosPanel } from '@/components/dcf/ScenariosPanel';
import { ResultsPanel } from '@/components/dcf/ResultsPanel';
import { SensitivityAnalysis } from '@/components/dcf/SensitivityAnalysis';
import { ChartsPanel } from '@/components/dcf/ChartsPanel';
import { MonteCarloPanel } from '@/components/dcf/MonteCarloPanel';

export default function DCFCalculatorPage() {
  // États principaux
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [parameters, setParameters] = useState<DCFParameters | null>(null);
  const [dcfResult, setDCFResult] = useState<DCFResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeTab, setActiveTab] = useState<'parameters' | 'scenarios' | 'results' | 'sensitivity' | 'charts' | 'monte-carlo'>('parameters');
  
  // États UI
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [notifications, setNotifications] = useState<Array<{id: string, type: 'info' | 'warning' | 'error' | 'success', message: string}>>([]);

  // Initialisation des paramètres par défaut
  const initializeDefaultParameters = (company: Company): DCFParameters => {
    return {
      historicalData: [], // Sera rempli par l'API
      revenueGrowthRates: [15, 12, 10, 8, 6], // 5 années de projections
      terminalGrowthRate: 2.5,
      operatingMarginTarget: company.operatingMargin ? company.operatingMargin * 100 : 25,
      taxRate: 0.25,
      capexAsPercentOfRevenue: 5,
      workingCapitalAsPercentOfRevenue: 2,
      wacc: 0.10, // Sera calculé automatiquement
      terminalYear: 10,
      discountRate: 0.10,
      confidenceInterval: 0.95,
      fadeToIndustryMargin: true,
      industryOperatingMargin: 20,
      fadeYears: 5,
      scenarios: [
        {
          id: 'base',
          name: 'Scénario de base',
          description: 'Hypothèses moyennes basées sur l\'historique',
          parameters: {},
          probability: 0.5,
          color: '#10B981'
        },
        {
          id: 'optimistic',
          name: 'Scénario optimiste',
          description: 'Croissance accélérée et marges améliorées',
          parameters: {
            revenueGrowthRates: [20, 18, 15, 12, 10],
            operatingMarginTarget: company.operatingMargin ? company.operatingMargin * 100 + 5 : 30,
            terminalGrowthRate: 3.5
          },
          probability: 0.25,
          color: '#3B82F6'
        },
        {
          id: 'pessimistic',
          name: 'Scénario pessimiste',
          description: 'Croissance ralentie et pression sur les marges',
          parameters: {
            revenueGrowthRates: [8, 6, 5, 4, 3],
            operatingMarginTarget: company.operatingMargin ? company.operatingMargin * 100 - 3 : 18,
            terminalGrowthRate: 1.5
          },
          probability: 0.25,
          color: '#EF4444'
        }
      ],
      currentScenario: 'base'
    };
  };

  // Sélection d'une entreprise
  const handleCompanySelect = async (company: Company) => {
    setSelectedCompany(company);
    setIsCalculating(true);
    
    try {
      // Récupérer les données financières et de marché
      const [companyData, marketData] = await Promise.all([
        getCompanyData(company.symbol),
        getMarketData()
      ]);

      // Calculer le WACC automatiquement
      const waccCalculation = WACCCalculator.calculate(
        marketData.riskFreeRate,
        marketData.marketRiskPremium,
        company.beta,
        0.04, // Coût de la dette estimé à 4%
        0.25, // Taux d'imposition
        company.marketCap,
        companyData.financials[companyData.financials.length - 1]?.totalDebt || 0
      );

      // Initialiser les paramètres avec les données réelles
      const defaultParams = initializeDefaultParameters(company);
      const initialParameters: DCFParameters = {
        ...defaultParams,
        historicalData: companyData.financials,
        wacc: waccCalculation.wacc,
        discountRate: waccCalculation.wacc
      };

      setParameters(initialParameters);
      
      addNotification('success', `Données chargées pour ${company.name}`);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      addNotification('error', 'Erreur lors du chargement des données financières');
    } finally {
      setIsCalculating(false);
    }
  };

  // Calcul DCF
  const calculateDCF = async () => {
    if (!selectedCompany || !parameters) return;

    setIsCalculating(true);
    
    try {
      const calculator = new DCFCalculator(parameters, selectedCompany);
      const result = calculator.calculate();
      setDCFResult(result);
      
      addNotification('success', 'Calcul DCF terminé avec succès');
      setActiveTab('results');
    } catch (error) {
      console.error('Erreur lors du calcul DCF:', error);
      addNotification('error', 'Erreur lors du calcul DCF');
    } finally {
      setIsCalculating(false);
    }
  };

  // Gestion des notifications
  const addNotification = (type: 'info' | 'warning' | 'error' | 'success', message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, type, message }]);
    
    // Auto-suppression après 5 secondes
    setTimeout(() => {
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    }, 5000);
  };

  // Calcul automatique quand les paramètres changent
  useEffect(() => {
    if (selectedCompany && parameters && !isCalculating) {
      const timer = setTimeout(() => {
        calculateDCF();
      }, 1000); // Debounce de 1 seconde

      return () => clearTimeout(timer);
    }
  }, [parameters, selectedCompany]);

  const tabs = [
    { id: 'parameters' as const, label: 'Paramètres', icon: Settings },
    { id: 'scenarios' as const, label: 'Scénarios', icon: Target },
    { id: 'results' as const, label: 'Résultats', icon: Calculator },
    { id: 'sensitivity' as const, label: 'Sensibilité', icon: BarChart3 },
    { id: 'charts' as const, label: 'Graphiques', icon: TrendingUp },
    { id: 'monte-carlo' as const, label: 'Monte Carlo', icon: Zap }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Calculator className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Calculatrice DCF NASDAQ
                </h1>
                <p className="text-gray-600 mt-1">
                  Analyse de flux de trésorerie actualisés avec données en temps réel
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4 inline mr-2" />
                Options avancées
              </button>
              
              {dcfResult && (
                <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                  <Download className="w-4 h-4 inline mr-2" />
                  Exporter
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <AnimatePresence>
        {notifications.map(notification => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.3 }}
            className="fixed top-4 right-4 z-50"
          >
            <div className={`px-4 py-3 rounded-lg shadow-lg max-w-sm ${
              notification.type === 'success' ? 'bg-green-500 text-white' :
              notification.type === 'error' ? 'bg-red-500 text-white' :
              notification.type === 'warning' ? 'bg-yellow-500 text-white' :
              'bg-blue-500 text-white'
            }`}>
              <div className="flex items-center">
                {notification.type === 'success' && <CheckCircle className="w-5 h-5 mr-2" />}
                {notification.type === 'error' && <AlertTriangle className="w-5 h-5 mr-2" />}
                {notification.type === 'warning' && <AlertTriangle className="w-5 h-5 mr-2" />}
                {notification.type === 'info' && <Info className="w-5 h-5 mr-2" />}
                <span className="text-sm font-medium">{notification.message}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sélection d'entreprise */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-blue-500" />
                Sélection d'entreprise
              </h2>
              <CompanySelector onCompanySelect={handleCompanySelect} />
              
              {selectedCompany && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 p-4 bg-blue-50 rounded-lg"
                >
                  <h3 className="font-semibold text-blue-900">{selectedCompany.name}</h3>
                  <p className="text-sm text-blue-700 mt-1">{selectedCompany.sector}</p>
                  <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                    <div>
                      <span className="text-blue-600">Prix actuel</span>
                      <div className="font-semibold">{formatCurrency(selectedCompany.price)}</div>
                    </div>
                    <div>
                      <span className="text-blue-600">Capitalisation</span>
                      <div className="font-semibold">{formatCurrency(selectedCompany.marketCap)}</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Résumé des résultats */}
            {dcfResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-500" />
                  Résumé DCF
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-gray-600">Valeur par action</span>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatCurrency(dcfResult.valuePerShare)}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-600">Prix actuel</span>
                    <div className="text-lg font-semibold text-gray-700">
                      {formatCurrency(dcfResult.currentPrice)}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-600">Potentiel de hausse</span>
                    <div className={`text-lg font-semibold ${
                      dcfResult.upsidePercentage > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatPercentage(dcfResult.upsidePercentage)}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600 mb-2">WACC</div>
                    <div className="text-sm font-semibold">{formatPercentage(dcfResult.wacc * 100)}</div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Panneau principal */}
          <div className="lg:col-span-3">
            {/* Onglets */}
            <div className="bg-white rounded-t-xl shadow-sm border border-gray-200 border-b-0">
              <div className="flex space-x-1 p-2">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Contenu des onglets */}
            <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 min-h-[600px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="p-6"
                >
                  {activeTab === 'parameters' && parameters && (
                    <ParametersPanel
                      parameters={parameters}
                      onParametersChange={setParameters}
                      company={selectedCompany}
                      showAdvanced={showAdvancedOptions}
                    />
                  )}

                  {activeTab === 'scenarios' && parameters && (
                    <ScenariosPanel
                      scenarios={parameters.scenarios}
                      currentScenario={parameters.currentScenario}
                      onScenariosChange={(scenarios) => 
                        setParameters({...parameters, scenarios})
                      }
                      onCurrentScenarioChange={(scenarioId) =>
                        setParameters({...parameters, currentScenario: scenarioId})
                      }
                    />
                  )}

                  {activeTab === 'results' && dcfResult && (
                    <ResultsPanel 
                      result={dcfResult} 
                      company={selectedCompany}
                    />
                  )}

                  {activeTab === 'sensitivity' && dcfResult && (
                    <SensitivityAnalysis 
                      sensitivityData={dcfResult.sensitivityAnalysis}
                      baseCase={dcfResult}
                    />
                  )}

                  {activeTab === 'charts' && dcfResult && (
                    <ChartsPanel 
                      result={dcfResult}
                      company={selectedCompany}
                    />
                  )}

                  {activeTab === 'monte-carlo' && parameters && selectedCompany && (
                    <MonteCarloPanel 
                      parameters={parameters}
                      company={selectedCompany}
                    />
                  )}

                  {!selectedCompany && (
                    <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                      <Search className="w-16 h-16 mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Sélectionnez une entreprise</h3>
                      <p className="text-center max-w-md">
                        Choisissez une entreprise du NASDAQ pour commencer l'analyse DCF.
                        Toutes les données financières seront automatiquement chargées.
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Indicateur de calcul */}
      {isCalculating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 flex items-center space-x-4">
            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Calcul en cours...</h3>
              <p className="text-gray-600">Traitement des données financières</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}