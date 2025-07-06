'use client';

import { DCFParameters, Company } from '@/types/dcf';

interface MonteCarloPanelProps {
  parameters: DCFParameters;
  company: Company;
}

export function MonteCarloPanel({ parameters, company }: MonteCarloPanelProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Simulation Monte Carlo</h3>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-semibold mb-4">Paramètres de simulation</h4>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre d'itérations
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="1000">1,000</option>
              <option value="5000">5,000</option>
              <option value="10000">10,000</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Écart-type croissance (%)
            </label>
            <input
              type="number"
              defaultValue="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
        
        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors">
          Lancer la simulation
        </button>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-semibold mb-4">Résultats de la simulation</h4>
        <div className="h-64 flex items-center justify-center text-gray-500">
          Distribution des valorisations
        </div>
      </div>
    </div>
  );
}