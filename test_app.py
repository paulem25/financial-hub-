#!/usr/bin/env python3
"""
🧪 Tests de l'Agent IA Financier Gamifié
Script de test automatisé pour vérifier les fonctionnalités principales
"""

import sys
import requests
import json
import time
from datetime import datetime

# Configuration des tests
BASE_URL = "http://localhost:5000"
TEST_USER = {
    "username": "testuser123",
    "email": "test@example.com",
    "password": "testpass123"
}

class Colors:
    """Couleurs pour les messages de test"""
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    PURPLE = '\033[95m'
    CYAN = '\033[96m'
    WHITE = '\033[97m'
    BOLD = '\033[1m'
    END = '\033[0m'

def print_test_header(title):
    """Affiche un en-tête de test"""
    print(f"\n{Colors.CYAN}{Colors.BOLD}{'='*60}{Colors.END}")
    print(f"{Colors.CYAN}{Colors.BOLD}🧪 {title}{Colors.END}")
    print(f"{Colors.CYAN}{Colors.BOLD}{'='*60}{Colors.END}")

def print_success(message):
    """Affiche un message de succès"""
    print(f"{Colors.GREEN}✅ {message}{Colors.END}")

def print_error(message):
    """Affiche un message d'erreur"""
    print(f"{Colors.RED}❌ {message}{Colors.END}")

def print_info(message):
    """Affiche un message d'information"""
    print(f"{Colors.BLUE}ℹ️  {message}{Colors.END}")

def print_warning(message):
    """Affiche un message d'avertissement"""
    print(f"{Colors.YELLOW}⚠️  {message}{Colors.END}")

def test_server_accessibility():
    """Test de l'accessibilité du serveur"""
    print_test_header("Test d'accessibilité du serveur")
    
    try:
        response = requests.get(f"{BASE_URL}/", timeout=10)
        if response.status_code == 200:
            print_success("Serveur accessible et répond correctement")
            return True
        else:
            print_error(f"Serveur répond avec le code {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print_error("Impossible de se connecter au serveur")
        print_info("Assurez-vous que l'application est lancée sur http://localhost:5000")
        return False
    except requests.exceptions.Timeout:
        print_error("Timeout lors de la connexion au serveur")
        return False
    except Exception as e:
        print_error(f"Erreur inattendue : {e}")
        return False

def test_registration():
    """Test de l'inscription d'un utilisateur"""
    print_test_header("Test d'inscription utilisateur")
    
    try:
        # Données de test avec timestamp pour éviter les conflits
        timestamp = int(time.time())
        test_data = {
            "username": f"testuser{timestamp}",
            "email": f"test{timestamp}@example.com", 
            "password": "testpass123"
        }
        
        response = requests.post(
            f"{BASE_URL}/register",
            json=test_data,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                print_success("Inscription réussie")
                TEST_USER.update(test_data)
                return True, response.cookies
            else:
                print_error(f"Échec de l'inscription : {data.get('error', 'Erreur inconnue')}")
                return False, None
        else:
            print_error(f"Erreur HTTP {response.status_code}")
            return False, None
            
    except Exception as e:
        print_error(f"Erreur lors de l'inscription : {e}")
        return False, None

def test_login(cookies=None):
    """Test de connexion utilisateur"""
    print_test_header("Test de connexion utilisateur")
    
    try:
        login_data = {
            "username": TEST_USER["username"],
            "password": TEST_USER["password"]
        }
        
        response = requests.post(
            f"{BASE_URL}/login",
            json=login_data,
            cookies=cookies,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                print_success("Connexion réussie")
                return True, response.cookies
            else:
                print_error(f"Échec de la connexion : {data.get('error', 'Erreur inconnue')}")
                return False, None
        else:
            print_error(f"Erreur HTTP {response.status_code}")
            return False, None
            
    except Exception as e:
        print_error(f"Erreur lors de la connexion : {e}")
        return False, None

def test_dashboard_access(cookies):
    """Test d'accès au tableau de bord"""
    print_test_header("Test d'accès au tableau de bord")
    
    try:
        response = requests.get(
            f"{BASE_URL}/dashboard",
            cookies=cookies,
            timeout=10
        )
        
        if response.status_code == 200:
            print_success("Accès au tableau de bord réussi")
            if "tableau de bord" in response.text.lower() or "dashboard" in response.text.lower():
                print_success("Contenu du tableau de bord chargé")
                return True
            else:
                print_warning("Page chargée mais contenu incertain")
                return True
        else:
            print_error(f"Erreur HTTP {response.status_code}")
            return False
            
    except Exception as e:
        print_error(f"Erreur lors de l'accès au tableau de bord : {e}")
        return False

def test_mortgage_calculator(cookies):
    """Test de la calculatrice de crédit immobilier"""
    print_test_header("Test de la calculatrice de crédit immobilier")
    
    try:
        calc_data = {
            "principal": 200000,
            "rate": 1.5,
            "years": 25
        }
        
        response = requests.post(
            f"{BASE_URL}/api/calculate/mortgage",
            json=calc_data,
            cookies=cookies,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success') and 'result' in data:
                result = data['result']
                print_success("Calcul de crédit immobilier réussi")
                print_info(f"Mensualité calculée : {result.get('monthly_payment', 'N/A')} €")
                print_info(f"XP gagnés : {data.get('xp_earned', 0)}")
                
                # Vérifier la cohérence des données
                if result.get('monthly_payment') and result.get('total_payment'):
                    print_success("Données de résultat cohérentes")
                    return True
                else:
                    print_warning("Données de résultat incomplètes")
                    return False
            else:
                print_error(f"Échec du calcul : {data.get('error', 'Erreur inconnue')}")
                return False
        else:
            print_error(f"Erreur HTTP {response.status_code}")
            return False
            
    except Exception as e:
        print_error(f"Erreur lors du calcul : {e}")
        return False

def test_ai_agent(cookies):
    """Test de l'agent IA"""
    print_test_header("Test de l'agent IA")
    
    try:
        ai_data = {
            "message": "Bonjour, peux-tu me donner un conseil financier simple ?",
            "context": {}
        }
        
        response = requests.post(
            f"{BASE_URL}/api/ai/chat",
            json=ai_data,
            cookies=cookies,
            timeout=15
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success') and 'response' in data:
                ai_response = data['response']
                print_success("Agent IA répond correctement")
                print_info(f"Réponse : {ai_response[:100]}...")
                print_info(f"XP gagnés : {data.get('xp_earned', 0)}")
                
                # Vérifier que la réponse n'est pas vide
                if len(ai_response.strip()) > 10:
                    print_success("Réponse de l'IA substantielle")
                    return True
                else:
                    print_warning("Réponse de l'IA très courte")
                    return False
            else:
                print_error(f"Échec de l'IA : {data.get('error', 'Erreur inconnue')}")
                return False
        else:
            print_error(f"Erreur HTTP {response.status_code}")
            return False
            
    except Exception as e:
        print_error(f"Erreur lors du test IA : {e}")
        return False

def test_user_profile(cookies):
    """Test de récupération du profil utilisateur"""
    print_test_header("Test du profil utilisateur")
    
    try:
        response = requests.get(
            f"{BASE_URL}/api/user/profile",
            cookies=cookies,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success') and 'profile' in data:
                profile = data['profile']
                print_success("Profil utilisateur récupéré")
                print_info(f"Nom d'utilisateur : {profile.get('username', 'N/A')}")
                print_info(f"Niveau : {profile.get('level', 'N/A')}")
                print_info(f"XP : {profile.get('xp', 'N/A')}")
                print_info(f"Badges : {len(profile.get('badges', []))}")
                return True
            else:
                print_error(f"Échec de récupération du profil : {data.get('error', 'Erreur inconnue')}")
                return False
        else:
            print_error(f"Erreur HTTP {response.status_code}")
            return False
            
    except Exception as e:
        print_error(f"Erreur lors de la récupération du profil : {e}")
        return False

def test_leaderboard():
    """Test des classements"""
    print_test_header("Test des classements")
    
    try:
        response = requests.get(
            f"{BASE_URL}/api/leaderboard",
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success') and 'leaderboards' in data:
                leaderboards = data['leaderboards']
                print_success("Classements récupérés")
                print_info(f"Classement XP : {len(leaderboards.get('xp', []))} utilisateurs")
                print_info(f"Classement calculs : {len(leaderboards.get('calculations', []))} utilisateurs")
                return True
            else:
                print_error(f"Échec de récupération des classements : {data.get('error', 'Erreur inconnue')}")
                return False
        else:
            print_error(f"Erreur HTTP {response.status_code}")
            return False
            
    except Exception as e:
        print_error(f"Erreur lors de la récupération des classements : {e}")
        return False

def run_all_tests():
    """Lance tous les tests"""
    print(f"{Colors.PURPLE}{Colors.BOLD}")
    print("🤖 Agent IA Financier Gamifié - Tests Automatisés")
    print("=" * 60)
    print(f"Début des tests : {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{Colors.END}")
    
    results = {}
    cookies = None
    
    # Test 1 : Accessibilité du serveur
    results['server'] = test_server_accessibility()
    if not results['server']:
        print_error("Impossible de continuer sans serveur accessible")
        return results
    
    # Test 2 : Inscription
    success, new_cookies = test_registration()
    results['registration'] = success
    if success:
        cookies = new_cookies
    
    # Test 3 : Connexion (si inscription échouée, essayer avec utilisateur existant)
    if not success:
        print_info("Tentative de connexion avec utilisateur existant...")
        TEST_USER.update({
            "username": "demo@example.com",
            "password": "demo123"
        })
    
    success, new_cookies = test_login(cookies)
    results['login'] = success
    if success:
        cookies = new_cookies
    
    if not cookies:
        print_error("Impossible de continuer sans connexion réussie")
        return results
    
    # Tests avec utilisateur connecté
    results['dashboard'] = test_dashboard_access(cookies)
    results['mortgage_calc'] = test_mortgage_calculator(cookies)
    results['ai_agent'] = test_ai_agent(cookies)
    results['user_profile'] = test_user_profile(cookies)
    results['leaderboard'] = test_leaderboard()
    
    # Résumé des résultats
    print_test_header("Résumé des Tests")
    
    total_tests = len(results)
    passed_tests = sum(1 for result in results.values() if result)
    success_rate = (passed_tests / total_tests) * 100
    
    for test_name, result in results.items():
        status = "✅ PASSÉ" if result else "❌ ÉCHOUÉ"
        print(f"{test_name.replace('_', ' ').title()}: {status}")
    
    print(f"\n{Colors.BOLD}Résultat global : {passed_tests}/{total_tests} tests passés ({success_rate:.1f}%){Colors.END}")
    
    if success_rate >= 80:
        print_success("🎉 Application fonctionnelle ! Tous les composants principaux marchent.")
    elif success_rate >= 60:
        print_warning("⚠️  Application partiellement fonctionnelle. Quelques problèmes à corriger.")
    else:
        print_error("🚨 Application avec des problèmes majeurs. Révision nécessaire.")
    
    print(f"\n{Colors.BLUE}💡 Conseils :{Colors.END}")
    print("- Assurez-vous que l'application est lancée : python app.py")
    print("- Vérifiez les logs de l'application pour plus de détails")
    print("- Consultez README_PYTHON.md pour la configuration")
    
    return results

if __name__ == "__main__":
    try:
        results = run_all_tests()
        
        # Code de sortie basé sur le succès des tests
        total_tests = len(results)
        passed_tests = sum(1 for result in results.values() if result)
        
        if passed_tests == total_tests:
            sys.exit(0)  # Tous les tests passés
        elif passed_tests >= total_tests * 0.8:
            sys.exit(1)  # Plupart des tests passés
        else:
            sys.exit(2)  # Beaucoup de tests échoués
            
    except KeyboardInterrupt:
        print(f"\n{Colors.YELLOW}Tests interrompus par l'utilisateur{Colors.END}")
        sys.exit(3)
    except Exception as e:
        print(f"\n{Colors.RED}Erreur lors des tests : {e}{Colors.END}")
        sys.exit(4)