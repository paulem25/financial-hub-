'use client';

import { DCFResult, Company } from '@/types/dcf';

interface ChartsPanelProps {
  result: DCFResult;
  company: Company | null;
}

export function ChartsPanel({ result, company }: ChartsPanelProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Visualisations graphiques</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-semibold mb-4">Évolution des flux de trésorerie</h4>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Graphique des projections FCF
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-semibold mb-4">Décomposition de la valeur</h4>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Graphique en secteurs de la valeur
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-semibold mb-4">Comparaison des scénarios</h4>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Graphique en barres des scénarios
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-semibold mb-4">Analyse de sensibilité</h4>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Heatmap de sensibilité
          </div>
        </div>
      </div>
    </div>
  );
}