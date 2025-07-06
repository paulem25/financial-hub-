'use client';

import { DCFScenario } from '@/types/dcf';

interface ScenariosPanelProps {
  scenarios: DCFScenario[];
  currentScenario: string;
  onScenariosChange: (scenarios: DCFScenario[]) => void;
  onCurrentScenarioChange: (scenarioId: string) => void;
}

export function ScenariosPanel({ 
  scenarios, 
  currentScenario, 
  onScenariosChange, 
  onCurrentScenarioChange 
}: ScenariosPanelProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Gestion des scénarios</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scenarios.map((scenario) => (
          <div
            key={scenario.id}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              currentScenario === scenario.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onCurrentScenarioChange(scenario.id)}
          >
            <h4 className="font-semibold text-gray-900">{scenario.name}</h4>
            <p className="text-sm text-gray-600 mt-1">{scenario.description}</p>
            {scenario.probability && (
              <div className="text-xs text-gray-500 mt-2">
                Probabilité: {(scenario.probability * 100).toFixed(0)}%
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}