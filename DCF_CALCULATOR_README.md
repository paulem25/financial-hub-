# 📊 Calculatrice DCF NASDAQ - Documentation Complète

## 🚀 Vue d'ensemble

Cette calculatrice de flux de trésorerie actualisés (DCF) est une application web sophistiquée qui permet d'évaluer toutes les entreprises du NASDAQ avec des données financières en temps réel. Elle offre une interface élégante et des fonctionnalités avancées pour l'analyse financière professionnelle.

## ✨ Fonctionnalités principales

### 🏢 Données en temps réel
- **Base de données NASDAQ complète** : Accès à toutes les entreprises cotées au NASDAQ
- **Données financières automatisées** : États financiers, bilans, flux de trésorerie des 5 dernières années
- **Calcul automatique du WACC** : Basé sur le taux sans risque, prime de risque de marché et beta
- **Mise à jour en temps réel** : Prix des actions et métriques financières actualisés

### 🔧 Interface utilisateur avancée
- **Recherche intelligente** : Recherche par symbole ou nom d'entreprise avec autocomplétion
- **Interface à onglets** : Organisation claire des différentes sections d'analyse
- **Paramètres modifiables** : Tous les paramètres DCF sont éditables en temps réel
- **Design responsive** : Optimisé pour desktop, tablette et mobile

### 📈 Moteur de calcul sophistiqué
- **Projections détaillées** : Jusqu'à 15 ans de projections explicites
- **Modélisation avancée** : Convergence vers les marges industrielles
- **Calculs financiers précis** : NOPAT, flux de trésorerie libre, valeur terminale
- **Validation des données** : Contrôles de cohérence et recommandations

### 🎯 Analyse de scénarios
- **3 scénarios pré-configurés** : Base, optimiste, pessimiste
- **Scénarios personnalisables** : Création et modification de scénarios sur mesure
- **Comparaison visuelle** : Tableau de bord comparatif des résultats
- **Pondération probabiliste** : Attribution de probabilités aux scénarios

### 📊 Analyse de sensibilité
- **Sensibilité WACC** : Impact des variations du coût du capital
- **Sensibilité croissance** : Effet des hypothèses de croissance
- **Sensibilité marges** : Analyse des variations de rentabilité
- **Visualisations graphiques** : Heatmaps et graphiques interactifs

### 🎲 Simulation Monte Carlo
- **Distributions probabilistes** : Modélisation des incertitudes
- **Milliers d'itérations** : Jusqu'à 10,000 simulations
- **Intervalles de confiance** : Percentiles 5%, 25%, 75%, 95%
- **Distribution des résultats** : Histogrammes et statistiques descriptives

## 🛠️ Architecture technique

### Frontend
- **Next.js 15** : Framework React avec App Router
- **TypeScript** : Typage strict pour la fiabilité
- **Tailwind CSS** : Design system moderne et responsive
- **Framer Motion** : Animations fluides et professionnelles
- **Recharts** : Visualisations interactives

### Gestion d'état
- **Zustand** : State management léger et performant
- **React Hook Form** : Gestion optimisée des formulaires
- **Zod** : Validation des données côté client

### APIs financières
- **Financial Modeling Prep** : Données financières détaillées
- **Alpha Vantage** : Données de marché complémentaires
- **Federal Reserve API** : Taux sans risque en temps réel
- **Fallback vers données mock** : Fonctionnement même sans API

### Calculs financiers
- **Decimal.js** : Calculs haute précision
- **Algorithmes avancés** : Recherche dichotomique, Box-Muller
- **Optimisations** : Cache intelligent et debouncing

## 📋 Guide d'utilisation

### 1. Sélection d'entreprise
1. Utilisez la barre de recherche pour trouver une entreprise
2. Tapez le symbole (ex: AAPL) ou le nom complet
3. Sélectionnez dans la liste des résultats
4. Les données financières se chargent automatiquement

### 2. Configuration des paramètres
**Onglet Paramètres :**
- **Croissance** : Définissez les taux de croissance par année
- **Marges** : Configurez les marges opérationnelles et taux d'imposition
- **WACC** : Ajustez le coût du capital (calculé automatiquement)
- **Avancé** : Options de convergence vers les marges industrielles

### 3. Gestion des scénarios
**Onglet Scénarios :**
- Sélectionnez le scénario actif (Base, Optimiste, Pessimiste)
- Créez des scénarios personnalisés
- Définissez les probabilités de chaque scénario
- Comparez les résultats entre scénarios

### 4. Analyse des résultats
**Onglet Résultats :**
- **Valeur par action** : Résultat principal de l'évaluation
- **Potentiel de hausse/baisse** : Comparaison avec le prix actuel
- **Décomposition de la valeur** : FCF explicites vs valeur terminale
- **Projections détaillées** : Tableau année par année

### 5. Analyse de sensibilité
**Onglet Sensibilité :**
- Matrices de sensibilité 2D
- Identification des variables critiques
- Zones de confiance pour la valorisation

### 6. Visualisations
**Onglet Graphiques :**
- Évolution des flux de trésorerie projetés
- Décomposition graphique de la valeur
- Comparaison des scénarios
- Heatmaps de sensibilité

### 7. Simulation Monte Carlo
**Onglet Monte Carlo :**
- Configuration des paramètres de simulation
- Lancement de milliers d'itérations
- Distribution des valorisations possibles
- Statistiques et intervalles de confiance

## 🎨 Fonctionnalités UX/UI

### Design élégant et sobre
- **Palette de couleurs professionnelle** : Bleus, gris et verts
- **Typographie claire** : Hiérarchie visuelle optimisée
- **Espacement cohérent** : Design system Tailwind CSS
- **Iconographie** : Lucide React pour la consistance

### Interactions fluides
- **Animations Framer Motion** : Transitions douces entre les états
- **Feedback visuel** : Indicateurs de chargement et notifications
- **Navigation intuitive** : Onglets et navigation claire
- **Raccourcis clavier** : Navigation efficace

### Responsive design
- **Mobile first** : Optimisé pour tous les écrans
- **Grilles adaptatives** : Layout fluide selon la taille d'écran
- **Touch friendly** : Interactions tactiles optimisées

## 📊 Détails des calculs DCF

### Formules utilisées
```
Valeur d'entreprise = Σ(FCF_t / (1 + WACC)^t) + Valeur terminale actualisée

Valeur terminale = FCF_terminal × (1 + g) / (WACC - g)

FCF = NOPAT + Dépréciation - CapEx - Δ BFR

NOPAT = Résultat opérationnel × (1 - Taux d'imposition)

WACC = (E/V × Re) + (D/V × Rd × (1-T))
```

### Méthodologie
1. **Collecte des données historiques** : 5 ans minimum
2. **Normalisation** : Ajustements des éléments non récurrents
3. **Projections** : Modèles de croissance décroissante
4. **Convergence** : Fade vers les marges industrielles
5. **Actualisation** : Application du WACC calculé
6. **Validation** : Contrôles de cohérence automatiques

## 🔍 Sources de données

### APIs intégrées
- **Financial Modeling Prep** : États financiers, ratios, profils d'entreprise
- **Alpha Vantage** : Prix, données de marché
- **Federal Reserve (FRED)** : Taux sans risque (Treasury 10 ans)
- **Yahoo Finance** : Données complémentaires

### Données mockées (fallback)
- Apple Inc. (AAPL) : Données complètes de démonstration
- Microsoft Corp. (MSFT) : Profil technologique
- Données sectorielles : Moyennes par industrie

## 🚀 Installation et démarrage

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Clés API (optionnelles) :
  - `NEXT_PUBLIC_FMP_API_KEY`
  - `NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY`
  - `NEXT_PUBLIC_FRED_API_KEY`

### Installation
```bash
# Cloner le projet
git clone [repository-url]
cd dcf-calculator

# Installer les dépendances
npm install

# Démarrer en développement
npm run dev

# Construire pour la production
npm run build
npm start
```

### Configuration
Créer un fichier `.env.local` :
```
NEXT_PUBLIC_FMP_API_KEY=your_fmp_key
NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
NEXT_PUBLIC_FRED_API_KEY=your_fred_key
```

## 📈 Roadmap et améliorations futures

### Version 2.0
- [ ] **Comparaison par multiples** : P/E, EV/EBITDA, P/B
- [ ] **Analyse des comparables** : Sociétés similaires automatiques
- [ ] **Export Excel/PDF** : Rapports détaillés
- [ ] **Historique des valorisations** : Tracking dans le temps

### Version 2.1
- [ ] **Autres marchés** : NYSE, LSE, Euronext
- [ ] **Devises multiples** : Support EUR, GBP, etc.
- [ ] **API personnalisée** : Endpoints pour développeurs

### Version 2.2
- [ ] **Intelligence artificielle** : Recommandations automatiques
- [ ] **Machine learning** : Prédictions améliorées
- [ ] **Collaboration** : Partage de modèles entre utilisateurs

## 🤝 Contribution

### Guide de contribution
1. Fork le repository
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -m 'Ajouter nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

### Standards de code
- **TypeScript strict** : Typage complet obligatoire
- **ESLint + Prettier** : Formatage automatique
- **Tests unitaires** : Jest + Testing Library
- **Documentation** : JSDoc pour les fonctions complexes

## 📄 Licence

MIT License - Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

- **Documentation** : Ce README et commentaires dans le code
- **Issues GitHub** : Pour les bugs et demandes de fonctionnalités
- **Discussions** : Pour les questions générales

---

**🎯 Objectif** : Démocratiser l'analyse financière DCF avec une interface moderne et des calculs précis, accessible aux professionnels comme aux étudiants en finance.

**🏆 Vision** : Devenir la référence pour l'évaluation d'entreprises par la méthode DCF, en combinant rigueur financière et excellence UX/UI.