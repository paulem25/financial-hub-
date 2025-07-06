#!/usr/bin/env python3
"""
🚀 Script de Démarrage Rapide - Agent IA Financier Gamifié
Ce script configure automatiquement et lance l'application complète.
"""

import os
import sys
import subprocess
import platform
import shutil
from pathlib import Path

def print_banner():
    """Affiche le banner de démarrage"""
    banner = """
    🤖 Agent IA Financier Gamifié
    ═══════════════════════════════════════════════════════════════
    ✨ Application Flask avec Agent IA et Calculatrices Gamifiées
    🎯 Inspiré de Duolingo et des agents Cursor
    ═══════════════════════════════════════════════════════════════
    """
    print(banner)

def check_python_version():
    """Vérifie la version de Python"""
    print("📋 Vérification de la version Python...")
    version = sys.version_info
    if version.major == 3 and version.minor >= 8:
        print(f"✅ Python {version.major}.{version.minor}.{version.micro} détecté (compatible)")
        return True
    else:
        print(f"❌ Python {version.major}.{version.minor}.{version.micro} détecté")
        print("⚠️  Python 3.8+ requis pour cette application")
        return False

def check_dependencies():
    """Vérifie et installe les dépendances"""
    print("\n📦 Vérification des dépendances...")
    
    # Vérifier si requirements.txt existe
    if not os.path.exists('requirements.txt'):
        print("❌ Fichier requirements.txt non trouvé")
        return False
    
    try:
        # Essayer d'importer les modules principaux
        import flask
        import openai
        print("✅ Dépendances principales déjà installées")
        return True
    except ImportError:
        print("📥 Installation des dépendances requises...")
        try:
            subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'])
            print("✅ Dépendances installées avec succès")
            return True
        except subprocess.CalledProcessError:
            print("❌ Erreur lors de l'installation des dépendances")
            print("💡 Essayez manuellement : pip install -r requirements.txt")
            return False

def setup_environment():
    """Configure l'environnement (.env)"""
    print("\n⚙️  Configuration de l'environnement...")
    
    env_file = '.env'
    env_example = '.env.example'
    
    if os.path.exists(env_file):
        print("✅ Fichier .env déjà configuré")
        return True
    
    if os.path.exists(env_example):
        try:
            shutil.copy2(env_example, env_file)
            print("✅ Fichier .env créé à partir de .env.example")
            print("💡 Éditez .env pour ajouter votre clé OpenAI si nécessaire")
            return True
        except Exception as e:
            print(f"⚠️  Erreur lors de la copie : {e}")
    
    # Créer un .env minimal
    env_content = """# Configuration Agent IA Financier
SECRET_KEY=dev-secret-key-change-in-production
FLASK_ENV=development
FLASK_DEBUG=True

# Configuration OpenAI (optionnelle)
# OPENAI_API_KEY=sk-votre-cle-openai-ici

# Configuration API externe (optionnelle)
API_KEY=dev-api-key

# Configuration serveur
PORT=5000
HOST=0.0.0.0
"""
    
    try:
        with open(env_file, 'w', encoding='utf-8') as f:
            f.write(env_content)
        print("✅ Fichier .env créé avec configuration par défaut")
        return True
    except Exception as e:
        print(f"❌ Erreur lors de la création de .env : {e}")
        return False

def check_database():
    """Vérifie et initialise la base de données"""
    print("\n🗄️  Configuration de la base de données...")
    
    db_file = 'financial_agent.db'
    
    if os.path.exists(db_file):
        print("✅ Base de données trouvée")
        return True
    else:
        print("📝 Base de données sera créée au premier lancement")
        return True

def start_application():
    """Lance l'application Flask"""
    print("\n🚀 Lancement de l'application...")
    print("📍 L'application sera accessible sur : http://localhost:5000")
    print("⏸️  Appuyez sur Ctrl+C pour arrêter\n")
    
    try:
        # Importer et lancer l'app
        from app import app, init_db
        
        # Initialiser la base de données
        init_db()
        print("✅ Base de données initialisée")
        
        # Lancer l'application
        app.run(debug=True, host='0.0.0.0', port=5000)
        
    except ImportError as e:
        print(f"❌ Erreur d'import : {e}")
        print("💡 Assurez-vous que app.py est présent dans le répertoire")
        return False
    except Exception as e:
        print(f"❌ Erreur lors du lancement : {e}")
        return False

def show_usage_tips():
    """Affiche les conseils d'utilisation"""
    tips = """
    💡 Conseils d'utilisation :
    ═══════════════════════════════════════════════════════════════
    
    🔐 Premiers pas :
    • Créez un compte via l'interface web
    • Explorez le tableau de bord
    • Testez les calculatrices financières
    
    🤖 Agent IA :
    • Ajoutez votre clé OpenAI dans .env pour l'IA complète
    • L'app fonctionne même sans clé (réponses de secours)
    • Posez des questions financières à l'assistant
    
    🎮 Gamification :
    • Gagnez des XP en utilisant les calculatrices
    • Débloquez des badges et récompenses
    • Grimpez dans les classements
    
    🔧 Développement :
    • API REST complète disponible
    • Documentation dans README_PYTHON.md
    • Code source commenté dans app.py
    
    ═══════════════════════════════════════════════════════════════
    """
    print(tips)

def main():
    """Fonction principale"""
    print_banner()
    
    # Vérifications préliminaires
    if not check_python_version():
        input("Appuyez sur Entrée pour continuer quand même...")
    
    if not check_dependencies():
        print("\n❌ Impossible de continuer sans les dépendances")
        input("Appuyez sur Entrée pour quitter...")
        return
    
    if not setup_environment():
        print("\n⚠️  Configuration d'environnement incomplète, continuation...")
    
    check_database()
    
    # Afficher les conseils
    show_usage_tips()
    
    # Demander confirmation avant de lancer
    print("🎯 Prêt à lancer l'Agent IA Financier Gamifié ?")
    response = input("Tapez 'oui' pour continuer ou Entrée pour quitter : ").lower().strip()
    
    if response in ['oui', 'o', 'yes', 'y']:
        start_application()
    else:
        print("\n👋 À bientôt ! Relancez ce script quand vous serez prêt.")
        print("💡 Commande manuelle : python app.py")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 Application arrêtée par l'utilisateur")
        print("💡 Relancez avec : python start.py")
    except Exception as e:
        print(f"\n❌ Erreur inattendue : {e}")
        print("💡 Consultez README_PYTHON.md pour l'aide")
        input("Appuyez sur Entrée pour quitter...")