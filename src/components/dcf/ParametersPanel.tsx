'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Percent, 
  DollarSign, 
  TrendingUp, 
  Calculator,
  Info,
  AlertTriangle,
  CheckCircle,
  Sliders,
  Target,
  Clock,
  Zap
} from 'lucide-react';

import { DCFParameters, Company } from '@/types/dcf';
import { formatPercentage } from '@/lib/dcf/calculator';

interface ParametersPanelProps {
  parameters: DCFParameters;
  onParametersChange: (parameters: DCFParameters) => void;
  company: Company | null;
  showAdvanced: boolean;
}

export function ParametersPanel({ 
  parameters, 
  onParametersChange, 
  company,
  showAdvanced 
}: ParametersPanelProps) {
  const [activeSection, setActiveSection] = useState<'growth' | 'margins' | 'wacc' | 'advanced'>('growth');

  const updateParameters = (updates: Partial<DCFParameters>) => {
    onParametersChange({ ...parameters, ...updates });
  };

  const updateRevenueGrowthRate = (index: number, value: number) => {
    const newRates = [...parameters.revenueGrowthRates];
    newRates[index] = value;
    updateParameters({ revenueGrowthRates: newRates });
  };

  const sections = [
    { id: 'growth' as const, label: 'Croissance', icon: TrendingUp, color: 'text-green-600' },
    { id: 'margins' as const, label: 'Marges', icon: Percent, color: 'text-blue-600' },
    { id: 'wacc' as const, label: 'WACC & Risque', icon: Target, color: 'text-purple-600' },
    { id: 'advanced' as const, label: 'Avancé', icon: Sliders, color: 'text-orange-600' }
  ];

  return (
    <div className="space-y-6">
      {/* En-tête avec informations sur l'entreprise */}
      {company && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{company.name}</h2>
              <p className="text-gray-600">{company.sector} • {company.industry}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                ${company.price.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Prix actuel</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-white rounded-lg p-3">
              <div className="text-gray-600">Capitalisation</div>
              <div className="font-semibold">${(company.marketCap / 1e9).toFixed(1)}B</div>
            </div>
            <div className="bg-white rounded-lg p-3">
              <div className="text-gray-600">Beta</div>
              <div className="font-semibold">{company.beta?.toFixed(2) || 'N/A'}</div>
            </div>
            <div className="bg-white rounded-lg p-3">
              <div className="text-gray-600">P/E Ratio</div>
              <div className="font-semibold">{company.peRatio?.toFixed(1) || 'N/A'}</div>
            </div>
            <div className="bg-white rounded-lg p-3">
              <div className="text-gray-600">Marge Op.</div>
              <div className="font-semibold">
                {company.operatingMargin ? formatPercentage(company.operatingMargin * 100) : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation des sections */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeSection === section.id
                ? 'bg-white shadow-sm text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <section.icon className={`w-4 h-4 mr-2 ${section.color}`} />
            {section.label}
          </button>
        ))}
      </div>

      {/* Contenu des sections */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {activeSection === 'growth' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold">Paramètres de croissance</h3>
            </div>

            {/* Taux de croissance du chiffre d'affaires */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Taux de croissance du chiffre d'affaires (%)
              </label>
              <div className="grid grid-cols-5 gap-3">
                {parameters.revenueGrowthRates.map((rate, index) => (
                  <div key={index} className="space-y-2">
                    <label className="block text-xs text-gray-600 text-center">
                      Année {index + 1}
                    </label>
                    <input
                      type="number"
                      value={rate}
                      onChange={(e) => updateRevenueGrowthRate(index, parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      step="0.1"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                💡 Les taux de croissance diminuent généralement avec le temps
              </div>
            </div>

            {/* Taux de croissance terminal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Taux de croissance terminal (%)
                <Info className="inline w-4 h-4 ml-1 text-gray-400" />
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={parameters.terminalGrowthRate}
                  onChange={(e) => updateParameters({ terminalGrowthRate: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  step="0.1"
                  min="0"
                  max="10"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  %
                </div>
              </div>
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <div className="text-xs text-yellow-700">
                    <strong>Recommandation:</strong> Le taux de croissance terminal ne devrait pas dépasser 
                    le taux de croissance du PIB à long terme (généralement 2-4%).
                  </div>
                </div>
              </div>
            </div>

            {/* Période de projection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Période de projection explicite (années)
              </label>
              <select
                value={parameters.terminalYear}
                onChange={(e) => updateParameters({ terminalYear: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value={5}>5 ans</option>
                <option value={10}>10 ans</option>
                <option value={15}>15 ans</option>
              </select>
            </div>
          </motion.div>
        )}

        {activeSection === 'margins' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Percent className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Marges et profitabilité</h3>
            </div>

            {/* Marge opérationnelle cible */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marge opérationnelle cible (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={parameters.operatingMarginTarget}
                  onChange={(e) => updateParameters({ operatingMarginTarget: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  step="0.1"
                  min="0"
                  max="100"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  %
                </div>
              </div>
              {company?.operatingMargin && (
                <div className="mt-2 text-xs text-gray-600">
                  Marge opérationnelle actuelle: {formatPercentage(company.operatingMargin * 100)}
                </div>
              )}
            </div>

            {/* Taux d'imposition */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Taux d'imposition effectif (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={parameters.taxRate * 100}
                  onChange={(e) => updateParameters({ taxRate: (parseFloat(e.target.value) || 0) / 100 })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  step="0.1"
                  min="0"
                  max="50"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  %
                </div>
              </div>
            </div>

            {/* CapEx */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Investissements (CapEx) en % du CA
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={parameters.capexAsPercentOfRevenue}
                  onChange={(e) => updateParameters({ capexAsPercentOfRevenue: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  step="0.1"
                  min="0"
                  max="30"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  %
                </div>
              </div>
            </div>

            {/* Besoin en fonds de roulement */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Besoin en fonds de roulement en % du CA
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={parameters.workingCapitalAsPercentOfRevenue}
                  onChange={(e) => updateParameters({ workingCapitalAsPercentOfRevenue: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  step="0.1"
                  min="-10"
                  max="20"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  %
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeSection === 'wacc' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Target className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold">WACC et paramètres de risque</h3>
            </div>

            {/* WACC */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WACC - Coût moyen pondéré du capital (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={parameters.wacc * 100}
                  onChange={(e) => updateParameters({ wacc: (parseFloat(e.target.value) || 0) / 100 })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  step="0.1"
                  min="1"
                  max="30"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  %
                </div>
              </div>
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div className="text-xs text-blue-700">
                    Le WACC a été calculé automatiquement en utilisant le taux sans risque, 
                    la prime de risque du marché et le beta de l'entreprise.
                  </div>
                </div>
              </div>
            </div>

            {/* Taux d'actualisation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Taux d'actualisation (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={parameters.discountRate * 100}
                  onChange={(e) => updateParameters({ discountRate: (parseFloat(e.target.value) || 0) / 100 })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  step="0.1"
                  min="1"
                  max="30"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  %
                </div>
              </div>
              <div className="mt-1 text-xs text-gray-500">
                Généralement égal au WACC pour l'évaluation d'entreprise
              </div>
            </div>

            {/* Intervalle de confiance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Intervalle de confiance
              </label>
              <select
                value={parameters.confidenceInterval}
                onChange={(e) => updateParameters({ confidenceInterval: parseFloat(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value={0.90}>90%</option>
                <option value={0.95}>95%</option>
                <option value={0.99}>99%</option>
              </select>
            </div>

            {company?.beta && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Informations sur le risque</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Beta</span>
                    <div className="font-semibold">{company.beta.toFixed(2)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Ratio dette/fonds propres</span>
                    <div className="font-semibold">{company.debtToEquity?.toFixed(2) || 'N/A'}</div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeSection === 'advanced' && showAdvanced && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Sliders className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-semibold">Paramètres avancés</h3>
            </div>

            {/* Convergence vers la marge industrielle */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700">
                  Convergence vers la marge industrielle
                </label>
                <input
                  type="checkbox"
                  checked={parameters.fadeToIndustryMargin}
                  onChange={(e) => updateParameters({ fadeToIndustryMargin: e.target.checked })}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
              </div>
              
              {parameters.fadeToIndustryMargin && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Marge industrielle (%)
                    </label>
                    <input
                      type="number"
                      value={parameters.industryOperatingMargin || 20}
                      onChange={(e) => updateParameters({ industryOperatingMargin: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Années de convergence
                    </label>
                    <input
                      type="number"
                      value={parameters.fadeYears || 5}
                      onChange={(e) => updateParameters({ fadeYears: parseInt(e.target.value) || 5 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Zap className="w-4 h-4 text-orange-600 mt-0.5" />
                <div className="text-xs text-orange-700">
                  <strong>Note:</strong> Les paramètres avancés permettent un contrôle plus fin 
                  du modèle mais nécessitent une expertise approfondie en évaluation d'entreprise.
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Résumé rapide */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Résumé des hypothèses clés</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Croissance Y1</span>
            <div className="font-semibold">{parameters.revenueGrowthRates[0]}%</div>
          </div>
          <div>
            <span className="text-gray-600">Croissance terminale</span>
            <div className="font-semibold">{parameters.terminalGrowthRate}%</div>
          </div>
          <div>
            <span className="text-gray-600">Marge opérationnelle</span>
            <div className="font-semibold">{parameters.operatingMarginTarget}%</div>
          </div>
          <div>
            <span className="text-gray-600">WACC</span>
            <div className="font-semibold">{(parameters.wacc * 100).toFixed(1)}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}