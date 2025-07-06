# 🤖 Agent IA Financier Gamifié

Une application Flask complète qui combine les meilleures fonctionnalités d'un agent IA intelligent avec un système de calculatrices financières gamifiées, inspiré de Duolingo et des agents Cursor.

## ✨ Fonctionnalités Principales

### 🎯 Agent IA Intelligent
- **Assistant conversationnel** avec OpenAI GPT
- **Contexte personnalisé** basé sur le profil utilisateur
- **Conseils financiers adaptatifs** selon votre niveau
- **Réponses de secours** intelligentes si l'IA n'est pas disponible

### 🧮 Calculatrices Financières Avancées
- **Crédit Immobilier** : Mensualités, tableau d'amortissement, coût total
- **Investissement** : Intérêts composés, projections annuelles, ROI
- **Retraite** : Planification avec inflation, règle des 4%, projections

### 🎮 Système de Gamification
- **Points d'expérience (XP)** pour chaque action
- **Système de niveaux** progressif
- **Badges et récompenses** personnalisés
- **Classements** et compétitions
- **Séries quotidiennes** pour maintenir l'engagement

### 📊 Fonctionnalités Avancées
- **API REST complète** pour intégrations tierces
- **Base de données SQLite** intégrée
- **Interface responsive** inspirée de Duolingo
- **Authentification sécurisée** avec hashage des mots de passe
- **Statistiques en temps réel** et analytics

## 🚀 Installation Rapide

### Prérequis
- Python 3.8+
- pip (gestionnaire de paquets Python)

### Installation
```bash
# 1. Cloner ou télécharger le projet
git clone <votre-repo> ou décompresser les fichiers
cd agent-ia-financier

# 2. Créer un environnement virtuel (recommandé)
python -m venv venv

# 3. Activer l'environnement virtuel
# Sur Windows :
venv\Scripts\activate
# Sur Mac/Linux :
source venv/bin/activate

# 4. Installer les dépendances
pip install -r requirements.txt

# 5. Configurer les variables d'environnement
cp .env.example .env
# Éditez .env avec vos clés API (voir section Configuration)

# 6. Initialiser la base de données
python app.py
# La base de données SQLite sera créée automatiquement

# 7. Lancer l'application
python app.py
```

L'application sera accessible sur : **http://localhost:5000**

## ⚙️ Configuration

### Variables d'environnement (.env)

```bash
# Configuration Flask
SECRET_KEY=votre-cle-secrete-ultra-secure
FLASK_ENV=development

# Configuration OpenAI (Agent IA)
OPENAI_API_KEY=sk-votre-cle-openai-ici

# Configuration API externe (optionnelle)
API_KEY=votre-cle-api-pour-integrations-tierces

# Configuration production
PORT=5000
HOST=0.0.0.0
```

### Obtenir une clé OpenAI
1. Créez un compte sur [OpenAI](https://platform.openai.com)
2. Générez une clé API dans la section "API Keys"
3. Ajoutez-la à votre fichier `.env`

**Note :** L'application fonctionne même sans clé OpenAI grâce au système de réponses de secours intelligent.

## 📖 Guide d'Utilisation

### Pour les Utilisateurs

1. **Inscription/Connexion**
   - Créez votre compte via l'interface web
   - Connectez-vous avec vos identifiants

2. **Tableau de Bord**
   - Consultez vos statistiques (niveau, XP, badges)
   - Voyez vos calculs récents
   - Accédez aux conversations IA

3. **Calculatrices**
   - Choisissez votre calculatrice (Crédit, Investissement, Retraite)
   - Saisissez vos paramètres
   - Recevez résultats détaillés + XP

4. **Assistant IA**
   - Posez vos questions financières
   - Recevez conseils personnalisés
   - Gagnez des XP pour chaque interaction

5. **Gamification**
   - Collectionnez badges et récompenses
   - Grimpez dans les classements
   - Maintenez votre série quotidienne

### Pour les Développeurs

#### API REST

**Authentification requise pour la plupart des endpoints**

```python
# Exemple d'utilisation de l'API
import requests

# Calcul de crédit immobilier
data = {
    "principal": 200000,
    "rate": 1.5,
    "years": 25
}
response = requests.post("http://localhost:5000/api/calculate/mortgage", 
                        json=data, 
                        cookies=session_cookies)
result = response.json()
```

**Endpoints principaux :**
- `POST /api/calculate/mortgage` - Calcul crédit immobilier
- `POST /api/calculate/investment` - Calcul investissement
- `POST /api/calculate/retirement` - Calcul retraite
- `POST /api/ai/chat` - Conversation avec l'agent IA
- `GET /api/user/profile` - Profil utilisateur détaillé
- `GET /api/leaderboard` - Classements

#### API Externe (avec clé API)

```python
# Pour intégrations tierces
headers = {"X-API-Key": "votre-cle-api"}
data = {
    "type": "mortgage",
    "parameters": {
        "principal": 300000,
        "rate": 2.0,
        "years": 20
    }
}
response = requests.post("http://localhost:5000/api/external/calculate", 
                        json=data, headers=headers)
```

## 🏗️ Architecture du Projet

```
agent-ia-financier/
├── app.py                 # Application Flask principale
├── requirements.txt       # Dépendances Python
├── .env.example          # Variables d'environnement exemple
├── financial_agent.db    # Base de données SQLite (auto-générée)
├── templates/            # Templates HTML
│   ├── base.html         # Template de base
│   ├── index.html        # Page d'accueil
│   ├── dashboard.html    # Tableau de bord
│   ├── login.html        # Connexion
│   ├── register.html     # Inscription
│   ├── calculators/      # Pages calculatrices
│   └── errors/           # Pages d'erreur
└── static/               # Fichiers statiques
    ├── css/              # Styles CSS
    ├── js/               # JavaScript
    └── img/              # Images
```

## 🔧 Classes et Modules

### Classes Principales

```python
# Calculatrices financières
class FinancialCalculator:
    - mortgage_calculator()     # Crédit immobilier
    - investment_calculator()   # Investissement  
    - retirement_calculator()   # Retraite

# Système de gamification
class GameificationSystem:
    - calculate_xp()           # Calcul des XP
    - get_level_from_xp()      # Niveau selon XP
    - check_new_badges()       # Vérification badges

# Agent IA intelligent
class AIAgent:
    - generate_response()      # Réponse IA
    - _get_user_context()     # Contexte utilisateur
    - _get_fallback_response() # Réponse de secours
```

### Base de Données

**Tables principales :**
- `users` - Utilisateurs avec gamification
- `calculations` - Historique des calculs
- `ai_conversations` - Conversations avec l'IA

## 🚀 Déploiement

### Déploiement Local (Production)

```bash
# 1. Configurer l'environnement
export FLASK_ENV=production
export SECRET_KEY=votre-cle-production-ultra-secure

# 2. Installer Gunicorn
pip install gunicorn

# 3. Lancer avec Gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Déploiement Cloud

**Heroku :**
```bash
# 1. Créer Procfile
echo "web: gunicorn app:app" > Procfile

# 2. Déployer
git add .
git commit -m "Deploy agent IA financier"
heroku create votre-app-name
git push heroku main
heroku config:set OPENAI_API_KEY=sk-votre-cle
```

**Railway/Render :**
- Connectez votre repository GitHub
- Configurez les variables d'environnement
- Le déploiement se fait automatiquement

## 🔐 Sécurité

- **Hashage des mots de passe** avec Werkzeug
- **Sessions sécurisées** avec clés secrètes
- **Protection CSRF** intégrée
- **Validation des entrées** pour toutes les API
- **Limitation des requêtes** (peut être ajoutée)

## 📈 Performances

- **Base SQLite** pour démarrage rapide
- **Peut évoluer vers PostgreSQL** facilement
- **Cache intelligent** pour les calculs
- **Optimisations frontend** (lazy loading, minification)

## 🛠️ Personnalisation

### Ajouter une Nouvelle Calculatrice

1. **Étendre FinancialCalculator :**
```python
@staticmethod
def budget_calculator(income, expenses):
    # Votre logique de calcul
    return result
```

2. **Créer la route API :**
```python
@app.route('/api/calculate/budget', methods=['POST'])
@login_required
def api_budget():
    # Implémenter la logique
```

3. **Ajouter le template HTML**

### Personnaliser les Badges

```python
# Dans BADGES_SYSTEM
Badge("custom_badge", "Nom", "Description", "🎖️", 50, "type")
```

### Modifier l'Agent IA

```python
# Dans AIAgent.generate_response()
system_prompt = f"""
Votre prompt personnalisé avec {user_context}
"""
```

## 🐛 Dépannage

### Problèmes Courants

**L'IA ne répond pas :**
- Vérifiez votre clé OpenAI dans `.env`
- L'application utilise les réponses de secours sinon

**Erreur de base de données :**
```bash
# Supprimer et recréer la DB
rm financial_agent.db
python app.py
```

**Problèmes de dépendances :**
```bash
# Réinstaller dans un nouvel environnement
rm -rf venv
python -m venv venv
source venv/bin/activate  # ou venv\Scripts\activate sur Windows
pip install -r requirements.txt
```

## 📊 Analytics et Monitoring

L'application inclut :
- **Statistiques en temps réel** (utilisateurs actifs, calculs)
- **Logs détaillés** avec le module logging Python
- **Métriques de performance** pour l'IA et les calculs

## 🤝 Contribution

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Committez vos changements (`git commit -m 'Ajouter nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

- **Email :** support@agent-ia-financier.com
- **Documentation :** Voir ce README
- **Issues :** Créez une issue GitHub

---

**Développé avec ❤️ - Inspiré par Duolingo et les agents Cursor**

*Transform your financial knowledge into an engaging, AI-powered learning experience!* 🚀