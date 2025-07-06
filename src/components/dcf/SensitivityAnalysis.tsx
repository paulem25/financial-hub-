'use client';

import { SensitivityAnalysis as SensitivityData, DCFResult } from '@/types/dcf';

interface SensitivityAnalysisProps {
  sensitivityData: SensitivityData;
  baseCase: DCFResult;
}

export function SensitivityAnalysis({ sensitivityData, baseCase }: SensitivityAnalysisProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Analyse de sensibilité</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold mb-3">Sensibilité WACC</h4>
          <div className="text-sm text-gray-600">
            Analyse de l'impact du coût du capital sur la valorisation
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold mb-3">Sensibilité Croissance</h4>
          <div className="text-sm text-gray-600">
            Impact des hypothèses de croissance sur la valeur
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold mb-3">Sensibilité Marges</h4>
          <div className="text-sm text-gray-600">
            Effet des variations de marge sur l'évaluation
          </div>
        </div>
      </div>
    </div>
  );
}