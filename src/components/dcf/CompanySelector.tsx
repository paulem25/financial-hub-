'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Building2, TrendingUp, Users } from 'lucide-react';
import { searchCompanies } from '@/lib/api/nasdaq';
import { Company } from '@/types/dcf';

interface CompanySelectorProps {
  onCompanySelect: (company: Company) => void;
}

export function CompanySelector({ onCompanySelect }: CompanySelectorProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Recherche avec debounce
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const companies = await searchCompanies(query);
        setResults(companies.slice(0, 10)); // Limiter à 10 résultats
        setIsOpen(true);
        setSelectedIndex(-1);
      } catch (error) {
        console.error('Erreur lors de la recherche:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Navigation au clavier
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : results.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleCompanySelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleCompanySelect = (company: Company) => {
    setQuery(company.name);
    setIsOpen(false);
    setSelectedIndex(-1);
    onCompanySelect(company);
    inputRef.current?.blur();
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
      return `${(marketCap / 1e12).toFixed(1)}T $`;
    } else if (marketCap >= 1e9) {
      return `${(marketCap / 1e9).toFixed(1)}B $`;
    } else if (marketCap >= 1e6) {
      return `${(marketCap / 1e6).toFixed(1)}M $`;
    }
    return `${marketCap.toLocaleString()} $`;
  };

  // Entreprises populaires par défaut
  const popularCompanies = [
    { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', sector: 'Technology' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Discretionary' },
    { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer Discretionary' },
    { symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Technology' },
  ];

  return (
    <div className="relative">
      {/* Champ de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder="Rechercher une entreprise (ex: AAPL, Apple...)"
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {/* Résultats de recherche */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={listRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto"
          >
            {results.length > 0 ? (
              <div className="py-2">
                {results.map((company, index) => (
                  <motion.div
                    key={company.symbol}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleCompanySelect(company)}
                    className={`px-4 py-3 cursor-pointer transition-colors ${
                      selectedIndex === index
                        ? 'bg-blue-50 border-l-4 border-blue-500'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Building2 className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-900">
                              {company.symbol}
                            </span>
                            <span className="text-gray-600">•</span>
                            <span className="text-gray-600 text-sm">
                              {company.name}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {company.sector} • {company.industry}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900">
                          ${company.price?.toFixed(2)}
                        </div>
                        {company.marketCap && (
                          <div className="text-xs text-gray-500">
                            {formatMarketCap(company.marketCap)}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : query.length >= 2 && !isLoading ? (
              <div className="px-4 py-6 text-center text-gray-500">
                <Search className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">Aucune entreprise trouvée</p>
                <p className="text-xs mt-1">Essayez avec le symbole ou le nom complet</p>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Entreprises populaires */}
      {!query && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            Entreprises populaires
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {popularCompanies.map((company) => (
              <button
                key={company.symbol}
                onClick={() => {
                  // Pour les entreprises populaires, on doit d'abord récupérer les données complètes
                  setQuery(company.name);
                }}
                className="text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {company.symbol}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {company.name}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {company.sector}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Conseils de recherche */}
      {!query && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">
            💡 Conseils de recherche
          </h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Utilisez le symbole boursier (ex: AAPL)</li>
            <li>• Ou le nom complet de l'entreprise</li>
            <li>• Minimum 2 caractères pour lancer la recherche</li>
            <li>• Naviguez avec les flèches et validez avec Entrée</li>
          </ul>
        </div>
      )}
    </div>
  );
}