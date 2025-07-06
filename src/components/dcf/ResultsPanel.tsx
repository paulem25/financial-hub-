'use client';

import { motion } from 'framer-motion';
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  Percent,
  Info,
  ArrowUp,
  ArrowDown,
  Target,
  Building2,
  Calendar,
  BarChart3,
  AlertCircle
} from 'lucide-react';

import { DCFResult, Company } from '@/types/dcf';
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/dcf/calculator';

interface ResultsPanelProps {
  result: DCFResult;
  company: Company | null;
}

export function ResultsPanel({ result, company }: ResultsPanelProps) {
  const isUndervalued = result.upsidePercentage > 0;
  const absUpside = Math.abs(result.upsidePercentage);
  
  const getValuationColor = (percentage: number) => {
    if (percentage > 20) return 'text-green-600';
    if (percentage > 0) return 'text-green-500';
    if (percentage > -20) return 'text-red-500';
    return 'text-red-600';
  };

  const getValuationBadge = (percentage: number) => {
    if (percentage > 30) return { text: 'Fortement sous-évaluée', color: 'bg-green-600' };
    if (percentage > 10) return { text: 'Sous-évaluée', color: 'bg-green-500' };
    if (percentage > -10) return { text: 'Juste évaluée', color: 'bg-gray-500' };
    if (percentage > -30) return { text: 'Surévaluée', color: 'bg-red-500' };
    return { text: 'Fortement surévaluée', color: 'bg-red-600' };
  };

  const valuationBadge = getValuationBadge(result.upsidePercentage);

  return (
    <div className="space-y-6">
      {/* Résumé exécutif */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Résultats de l'évaluation DCF</h2>
            <p className="text-gray-600">
              Calculé le {result.calculationDate.toLocaleDateString('fr-FR')}
              {company && ` pour ${company.name}`}
            </p>
          </div>
          <div className={`px-4 py-2 rounded-full text-white text-sm font-semibold ${valuationBadge.color}`}>
            {valuationBadge.text}
          </div>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">Valeur par action</h3>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(result.valuePerShare)}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Building2 className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">Prix actuel</h3>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(result.currentPrice)}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-3">
              <div className={`p-2 rounded-lg ${isUndervalued ? 'bg-green-100' : 'bg-red-100'}`}>
                {isUndervalued ? (
                  <ArrowUp className="w-5 h-5 text-green-600" />
                ) : (
                  <ArrowDown className="w-5 h-5 text-red-600" />
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">Potentiel</h3>
                <div className={`text-2xl font-bold ${getValuationColor(result.upsidePercentage)}`}>
                  {isUndervalued ? '+' : ''}{formatPercentage(result.upsidePercentage)}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">WACC</h3>
                <div className="text-2xl font-bold text-gray-900">
                  {formatPercentage(result.wacc * 100)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Décomposition de la valeur */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
            Décomposition de la valeur
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Valeur actualisée des FCF explicites</span>
              <span className="font-semibold">
                {formatCurrency(result.totalPresentValue - result.terminalValue)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Valeur terminale actualisée</span>
              <span className="font-semibold">
                {formatCurrency(result.terminalValue)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200 border-b-2">
              <span className="text-sm text-gray-600">Valeur d'entreprise totale</span>
              <span className="font-semibold">
                {formatCurrency(result.totalPresentValue)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Valeur des fonds propres</span>
              <span className="font-semibold">
                {formatCurrency(result.equityValue)}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 bg-blue-50 rounded-lg px-3">
              <span className="font-semibold text-blue-900">Valeur par action</span>
              <span className="text-xl font-bold text-blue-900">
                {formatCurrency(result.valuePerShare)}
              </span>
            </div>
          </div>

          {/* Répartition en pourcentage */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Répartition de la valeur</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">FCF explicites</span>
                <span className="font-medium">
                  {formatPercentage(((result.totalPresentValue - result.terminalValue) / result.totalPresentValue) * 100)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Valeur terminale</span>
                <span className="font-medium">
                  {formatPercentage((result.terminalValue / result.totalPresentValue) * 100)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Métriques clés */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calculator className="w-5 h-5 mr-2 text-green-600" />
            Métriques clés
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-600 mb-1">WACC utilisé</div>
              <div className="text-lg font-bold text-gray-900">
                {formatPercentage(result.wacc * 100)}
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-600 mb-1">Croissance terminale</div>
              <div className="text-lg font-bold text-gray-900">
                {formatPercentage(result.assumptions.terminalGrowthRate)}
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-600 mb-1">Taux implicite</div>
              <div className="text-lg font-bold text-gray-900">
                {formatPercentage(result.impliedGrowthRate)}
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-600 mb-1">Multiple implicite</div>
              <div className="text-lg font-bold text-gray-900">
                {(result.valuePerShare / result.currentPrice).toFixed(1)}x
              </div>
            </div>
          </div>

          {/* Alertes et recommandations */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Points d'attention</h4>
            <div className="space-y-2">
              {result.terminalValue / result.totalPresentValue > 0.8 && (
                <div className="flex items-start space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <div className="text-xs text-yellow-700">
                    La valeur terminale représente plus de 80% de la valeur totale. 
                    Considérez d'allonger la période de projection explicite.
                  </div>
                </div>
              )}
              
              {Math.abs(result.upsidePercentage) > 50 && (
                <div className="flex items-start space-x-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5" />
                  <div className="text-xs text-orange-700">
                    Écart important avec le prix du marché (&gt;50%). 
                    Vérifiez vos hypothèses et considérez une analyse de sensibilité.
                  </div>
                </div>
              )}
              
              {result.assumptions.terminalGrowthRate > 4 && (
                <div className="flex items-start space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                  <div className="text-xs text-red-700">
                    Taux de croissance terminal élevé (&gt;4%). 
                    Cela pourrait surestimer la valeur à long terme.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tableau de projections */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
          Projections détaillées
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 font-semibold text-gray-700">Année</th>
                <th className="text-right py-3 px-2 font-semibold text-gray-700">Chiffre d'affaires</th>
                <th className="text-right py-3 px-2 font-semibold text-gray-700">Croissance</th>
                <th className="text-right py-3 px-2 font-semibold text-gray-700">Marge op.</th>
                <th className="text-right py-3 px-2 font-semibold text-gray-700">NOPAT</th>
                <th className="text-right py-3 px-2 font-semibold text-gray-700">FCF</th>
                <th className="text-right py-3 px-2 font-semibold text-gray-700">Valeur actuelle</th>
              </tr>
            </thead>
            <tbody>
              {result.projections.slice(0, 10).map((projection, index) => (
                <motion.tr
                  key={projection.year}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-2 font-medium">{projection.year}</td>
                  <td className="py-3 px-2 text-right">{formatCurrency(projection.revenue)}</td>
                  <td className="py-3 px-2 text-right">
                    {formatPercentage(projection.revenueGrowth * 100)}
                  </td>
                  <td className="py-3 px-2 text-right">
                    {formatPercentage(projection.operatingMargin * 100)}
                  </td>
                  <td className="py-3 px-2 text-right">{formatCurrency(projection.nopat)}</td>
                  <td className="py-3 px-2 text-right">{formatCurrency(projection.freeCashFlow)}</td>
                  <td className="py-3 px-2 text-right font-semibold">
                    {formatCurrency(projection.presentValue)}
                  </td>
                </motion.tr>
              ))}
              
              {/* Ligne de la valeur terminale */}
              <tr className="border-t-2 border-gray-300 bg-blue-50">
                <td className="py-3 px-2 font-semibold">Valeur terminale</td>
                <td className="py-3 px-2 text-right">-</td>
                <td className="py-3 px-2 text-right">
                  {formatPercentage(result.assumptions.terminalGrowthRate)}
                </td>
                <td className="py-3 px-2 text-right">-</td>
                <td className="py-3 px-2 text-right">-</td>
                <td className="py-3 px-2 text-right">-</td>
                <td className="py-3 px-2 text-right font-bold text-blue-900">
                  {formatCurrency(result.terminalValue)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Comparaison avec les scénarios */}
      {result.scenarios.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
            Comparaison des scénarios
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {result.scenarios.map((scenario, index) => (
              <motion.div
                key={scenario.scenarioId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{scenario.scenarioName}</h4>
                  {scenario.probability && (
                    <span className="text-xs text-gray-500">
                      {formatPercentage(scenario.probability * 100)}
                    </span>
                  )}
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Valeur/action</span>
                    <span className="font-semibold">{formatCurrency(scenario.valuePerShare)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Potentiel</span>
                    <span className={`font-semibold ${getValuationColor(scenario.upsidePercentage)}`}>
                      {scenario.upsidePercentage > 0 ? '+' : ''}{formatPercentage(scenario.upsidePercentage)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}