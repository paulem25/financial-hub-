#!/usr/bin/env python3
"""
🎮 Agent IA Financier Gamifié
Application Flask complète avec agent IA intelligent et calculatrices financières gamifiées
Inspiré de Duolingo et des agents Cursor
"""

import os
import json
import sqlite3
import hashlib
from datetime import datetime, timedelta
from functools import wraps
from dataclasses import dataclass, asdict
from typing import Dict, List, Optional, Any
import math
import logging

from flask import Flask, render_template, request, jsonify, session, redirect, url_for, flash
from flask_cors import CORS
import openai
from werkzeug.security import generate_password_hash, check_password_hash

# Configuration de l'application
app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
CORS(app)

# Configuration des logs
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration OpenAI (pour l'agent IA)
openai.api_key = os.environ.get('OPENAI_API_KEY', '')

# Classes et modèles de données
@dataclass
class User:
    id: int
    username: str
    email: str
    password_hash: str
    level: int = 1
    xp: int = 0
    streak: int = 0
    total_calculations: int = 0
    badges: str = "[]"  # JSON string
    created_at: str = ""
    last_activity: str = ""

@dataclass
class Calculation:
    id: int
    user_id: int
    calc_type: str
    parameters: str  # JSON string
    result: str  # JSON string
    xp_earned: int
    created_at: str

@dataclass
class Badge:
    id: str
    name: str
    description: str
    icon: str
    requirement: int
    requirement_type: str  # 'calculations', 'xp', 'streak', etc.

# Système de badges
BADGES_SYSTEM = [
    Badge("first_calc", "Premier Calcul", "Votre premier calcul réussi!", "🎯", 1, "calculations"),
    Badge("calc_master", "Maître Calculateur", "100 calculs effectués", "🧮", 100, "calculations"),
    Badge("xp_collector", "Collectionneur XP", "1000 XP gagnés", "⭐", 1000, "xp"),
    Badge("streak_warrior", "Guerrier des Séries", "7 jours consécutifs", "🔥", 7, "streak"),
    Badge("financial_expert", "Expert Financier", "Utilisé toutes les calculatrices", "💎", 5, "calc_types"),
    Badge("ai_assistant", "Assistant IA", "Utilisé l'agent IA 10 fois", "🤖", 10, "ai_uses"),
]

# Base de données
def init_db():
    """Initialise la base de données SQLite"""
    conn = sqlite3.connect('financial_agent.db')
    c = conn.cursor()
    
    # Table des utilisateurs
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            level INTEGER DEFAULT 1,
            xp INTEGER DEFAULT 0,
            streak INTEGER DEFAULT 0,
            total_calculations INTEGER DEFAULT 0,
            badges TEXT DEFAULT "[]",
            ai_uses INTEGER DEFAULT 0,
            calc_types_used TEXT DEFAULT "[]",
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Table des calculs
    c.execute('''
        CREATE TABLE IF NOT EXISTS calculations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            calc_type TEXT NOT NULL,
            parameters TEXT NOT NULL,
            result TEXT NOT NULL,
            xp_earned INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Table des conversations IA
    c.execute('''
        CREATE TABLE IF NOT EXISTS ai_conversations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            message TEXT NOT NULL,
            response TEXT NOT NULL,
            context TEXT DEFAULT "{}",
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    conn.commit()
    conn.close()

# Décorateurs
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

def api_key_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        api_key = request.headers.get('X-API-Key')
        if not api_key or api_key != os.environ.get('API_KEY', 'dev-api-key'):
            return jsonify({'error': 'API key required'}), 401
        return f(*args, **kwargs)
    return decorated_function

# Classes métier
class FinancialCalculator:
    """Calculatrices financières avancées"""
    
    @staticmethod
    def mortgage_calculator(principal: float, annual_rate: float, years: int) -> Dict[str, Any]:
        """Calcul de crédit immobilier avec tableau d'amortissement"""
        monthly_rate = annual_rate / 12 / 100
        num_payments = years * 12
        
        if monthly_rate == 0:
            monthly_payment = principal / num_payments
        else:
            monthly_payment = principal * (monthly_rate * (1 + monthly_rate) ** num_payments) / \
                            ((1 + monthly_rate) ** num_payments - 1)
        
        total_payment = monthly_payment * num_payments
        total_interest = total_payment - principal
        
        # Tableau d'amortissement
        schedule = []
        remaining_balance = principal
        
        for month in range(1, min(13, num_payments + 1)):  # Première année
            interest_payment = remaining_balance * monthly_rate
            principal_payment = monthly_payment - interest_payment
            remaining_balance -= principal_payment
            
            schedule.append({
                'month': month,
                'payment': round(monthly_payment, 2),
                'principal': round(principal_payment, 2),
                'interest': round(interest_payment, 2),
                'balance': round(remaining_balance, 2)
            })
        
        return {
            'monthly_payment': round(monthly_payment, 2),
            'total_payment': round(total_payment, 2),
            'total_interest': round(total_interest, 2),
            'schedule': schedule,
            'summary': {
                'principal': principal,
                'rate': annual_rate,
                'years': years,
                'total_months': num_payments
            }
        }
    
    @staticmethod
    def investment_calculator(initial: float, monthly: float, annual_return: float, years: int) -> Dict[str, Any]:
        """Calcul d'investissement avec intérêts composés"""
        monthly_rate = annual_return / 12 / 100
        total_months = years * 12
        
        # Valeur future de l'investissement initial
        fv_initial = initial * ((1 + monthly_rate) ** total_months)
        
        # Valeur future des versements mensuels
        if monthly_rate == 0:
            fv_monthly = monthly * total_months
        else:
            fv_monthly = monthly * (((1 + monthly_rate) ** total_months - 1) / monthly_rate)
        
        total_value = fv_initial + fv_monthly
        total_invested = initial + (monthly * total_months)
        total_gains = total_value - total_invested
        
        # Projection annuelle
        yearly_projection = []
        balance = initial
        total_contributions = initial
        
        for year in range(1, years + 1):
            for month in range(12):
                balance = balance * (1 + monthly_rate) + monthly
                total_contributions += monthly
            
            yearly_projection.append({
                'year': year,
                'balance': round(balance, 2),
                'contributions': round(total_contributions, 2),
                'gains': round(balance - total_contributions, 2)
            })
        
        return {
            'final_value': round(total_value, 2),
            'total_invested': round(total_invested, 2),
            'total_gains': round(total_gains, 2),
            'roi_percentage': round((total_gains / total_invested) * 100, 2),
            'yearly_projection': yearly_projection,
            'summary': {
                'initial_investment': initial,
                'monthly_contribution': monthly,
                'annual_return': annual_return,
                'investment_period': years
            }
        }
    
    @staticmethod
    def retirement_calculator(current_age: int, retirement_age: int, current_savings: float, 
                            monthly_savings: float, annual_return: float, 
                            inflation_rate: float = 2.5) -> Dict[str, Any]:
        """Calcul de planification retraite"""
        years_to_retirement = retirement_age - current_age
        
        if years_to_retirement <= 0:
            return {'error': 'L\'âge de retraite doit être supérieur à l\'âge actuel'}
        
        # Calcul avec inflation
        real_return = ((1 + annual_return/100) / (1 + inflation_rate/100)) - 1
        
        # Valeur à la retraite
        retirement_calc = FinancialCalculator.investment_calculator(
            current_savings, monthly_savings, real_return * 100, years_to_retirement
        )
        
        # Estimation des besoins
        current_annual_expenses = monthly_savings * 12 * 3  # Estimation
        future_annual_expenses = current_annual_expenses * ((1 + inflation_rate/100) ** years_to_retirement)
        
        # Règle des 4% pour la retraite
        safe_withdrawal = retirement_calc['final_value'] * 0.04
        
        return {
            'retirement_savings': retirement_calc['final_value'],
            'estimated_annual_needs': round(future_annual_expenses, 2),
            'safe_annual_withdrawal': round(safe_withdrawal, 2),
            'years_of_coverage': round(retirement_calc['final_value'] / future_annual_expenses, 1),
            'is_sufficient': safe_withdrawal >= future_annual_expenses,
            'shortfall': max(0, round(future_annual_expenses - safe_withdrawal, 2)),
            'years_to_retirement': years_to_retirement,
            'total_contributions': retirement_calc['total_invested'],
            'investment_gains': retirement_calc['total_gains']
        }

class GameificationSystem:
    """Système de gamification avec XP, niveaux et badges"""
    
    @staticmethod
    def calculate_xp(calc_type: str, complexity: int = 1) -> int:
        """Calcule les XP selon le type de calcul"""
        base_xp = {
            'mortgage': 50,
            'investment': 75,
            'retirement': 100,
            'budget': 25,
            'tax': 60,
            'ai_question': 30
        }
        return base_xp.get(calc_type, 25) * complexity
    
    @staticmethod
    def get_level_from_xp(xp: int) -> int:
        """Calcule le niveau basé sur les XP"""
        if xp < 100:
            return 1
        return min(int(math.log(xp / 100) / math.log(1.5)) + 2, 100)
    
    @staticmethod
    def xp_for_next_level(current_xp: int) -> int:
        """XP nécessaires pour le niveau suivant"""
        current_level = GameificationSystem.get_level_from_xp(current_xp)
        next_level_xp = int(100 * (1.5 ** (current_level - 1)))
        return max(0, next_level_xp - current_xp)
    
    @staticmethod
    def check_new_badges(user_id: int) -> List[Badge]:
        """Vérifie les nouveaux badges débloqués"""
        conn = sqlite3.connect('financial_agent.db')
        c = conn.cursor()
        
        c.execute('SELECT * FROM users WHERE id = ?', (user_id,))
        user_data = c.fetchone()
        
        if not user_data:
            conn.close()
            return []
        
        current_badges = json.loads(user_data[8])  # badges column
        new_badges = []
        
        for badge in BADGES_SYSTEM:
            if badge.id not in current_badges:
                earned = False
                
                if badge.requirement_type == 'calculations':
                    earned = user_data[7] >= badge.requirement  # total_calculations
                elif badge.requirement_type == 'xp':
                    earned = user_data[5] >= badge.requirement  # xp
                elif badge.requirement_type == 'streak':
                    earned = user_data[6] >= badge.requirement  # streak
                elif badge.requirement_type == 'ai_uses':
                    earned = user_data[9] >= badge.requirement  # ai_uses
                elif badge.requirement_type == 'calc_types':
                    calc_types_used = json.loads(user_data[10])  # calc_types_used
                    earned = len(calc_types_used) >= badge.requirement
                
                if earned:
                    new_badges.append(badge)
                    current_badges.append(badge.id)
        
        # Mettre à jour les badges en base
        if new_badges:
            c.execute('UPDATE users SET badges = ? WHERE id = ?', 
                     (json.dumps(current_badges), user_id))
            conn.commit()
        
        conn.close()
        return new_badges

class AIAgent:
    """Agent IA intelligent pour assistance financière et technique"""
    
    def __init__(self):
        self.context_memory = {}
        self.conversation_history = []
    
    def generate_response(self, user_message: str, user_id: int, context: Dict = None) -> str:
        """Génère une réponse intelligente avec le contexte utilisateur"""
        try:
            # Récupérer le contexte utilisateur
            user_context = self._get_user_context(user_id)
            
            # Préparer le prompt système
            system_prompt = f"""
            Tu es un agent IA financier gamifié intelligent, spécialisé dans:
            - Les conseils financiers personnalisés
            - L'aide aux calculs financiers
            - La programmation et le développement
            - L'assistance technique
            
            Contexte utilisateur:
            - Niveau: {user_context.get('level', 1)}
            - XP: {user_context.get('xp', 0)}
            - Calculs effectués: {user_context.get('total_calculations', 0)}
            - Dernière activité: {user_context.get('last_activity', 'Première visite')}
            
            Réponds de manière amicale, éducative et motivante.
            Utilise des émojis appropriés et des conseils gamifiés.
            """
            
            if not openai.api_key:
                return "🤖 Agent IA temporairement indisponible. Configuration OpenAI requise."
            
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                max_tokens=500,
                temperature=0.7
            )
            
            ai_response = response.choices[0].message.content
            
            # Enregistrer la conversation
            self._save_conversation(user_id, user_message, ai_response, context or {})
            
            # Mettre à jour les statistiques IA
            self._update_ai_usage(user_id)
            
            return ai_response
            
        except Exception as e:
            logger.error(f"Erreur agent IA: {e}")
            return f"🤖 Désolé, je rencontre une difficulté technique. Voici une réponse basique : {self._get_fallback_response(user_message)}"
    
    def _get_user_context(self, user_id: int) -> Dict:
        """Récupère le contexte utilisateur"""
        conn = sqlite3.connect('financial_agent.db')
        c = conn.cursor()
        c.execute('SELECT level, xp, total_calculations, last_activity FROM users WHERE id = ?', (user_id,))
        result = c.fetchone()
        conn.close()
        
        if result:
            return {
                'level': result[0],
                'xp': result[1],
                'total_calculations': result[2],
                'last_activity': result[3]
            }
        return {}
    
    def _save_conversation(self, user_id: int, message: str, response: str, context: Dict):
        """Sauvegarde la conversation"""
        conn = sqlite3.connect('financial_agent.db')
        c = conn.cursor()
        c.execute('''
            INSERT INTO ai_conversations (user_id, message, response, context)
            VALUES (?, ?, ?, ?)
        ''', (user_id, message, response, json.dumps(context)))
        conn.commit()
        conn.close()
    
    def _update_ai_usage(self, user_id: int):
        """Met à jour le compteur d'utilisation IA"""
        conn = sqlite3.connect('financial_agent.db')
        c = conn.cursor()
        c.execute('UPDATE users SET ai_uses = ai_uses + 1 WHERE id = ?', (user_id,))
        conn.commit()
        conn.close()
    
    def _get_fallback_response(self, message: str) -> str:
        """Réponse de secours si l'IA n'est pas disponible"""
        message_lower = message.lower()
        
        if any(word in message_lower for word in ['crédit', 'prêt', 'emprunt']):
            return "🏠 Pour les calculs de crédit, utilisez notre calculatrice de prêt immobilier ! Vous gagnerez 50 XP."
        
        elif any(word in message_lower for word in ['investissement', 'épargne', 'placement']):
            return "📈 Notre calculatrice d'investissement peut vous aider ! Simulez vos placements et gagnez 75 XP."
        
        elif any(word in message_lower for word in ['retraite', 'pension']):
            return "🏖️ Planifiez votre retraite avec notre calculatrice spécialisée ! 100 XP à la clé."
        
        else:
            return "💡 Je suis votre assistant financier ! Posez-moi des questions sur les finances, investissements, ou utilisez nos calculatrices pour gagner des XP !"

# Instances globales
calculator = FinancialCalculator()
gamification = GameificationSystem()
ai_agent = AIAgent()

# Routes principales
@app.route('/')
def index():
    """Page d'accueil avec statistiques en temps réel"""
    # Statistiques globales
    conn = sqlite3.connect('financial_agent.db')
    c = conn.cursor()
    
    c.execute('SELECT COUNT(*) FROM calculations')
    total_calculations = c.fetchone()[0]
    
    c.execute('SELECT COUNT(*) FROM users')
    total_users = c.fetchone()[0]
    
    c.execute('SELECT COUNT(*) FROM users WHERE last_activity > datetime("now", "-24 hours")')
    active_users = c.fetchone()[0]
    
    c.execute('SELECT SUM(LENGTH(badges) - LENGTH(REPLACE(badges, ",", "")) + 1) FROM users WHERE badges != "[]"')
    total_badges = c.fetchone()[0] or 0
    
    conn.close()
    
    stats = {
        'total_calculations': total_calculations,
        'total_users': total_users,
        'active_users': active_users,
        'total_badges': total_badges
    }
    
    return render_template('index.html', stats=stats, user_logged_in='user_id' in session)

@app.route('/login', methods=['GET', 'POST'])
def login():
    """Connexion utilisateur"""
    if request.method == 'POST':
        data = request.get_json() if request.is_json else request.form
        username = data.get('username')
        password = data.get('password')
        
        conn = sqlite3.connect('financial_agent.db')
        c = conn.cursor()
        c.execute('SELECT id, password_hash FROM users WHERE username = ? OR email = ?', 
                 (username, username))
        user = c.fetchone()
        conn.close()
        
        if user and check_password_hash(user[1], password):
            session['user_id'] = user[0]
            session['username'] = username
            
            # Mettre à jour la dernière activité
            conn = sqlite3.connect('financial_agent.db')
            c = conn.cursor()
            c.execute('UPDATE users SET last_activity = CURRENT_TIMESTAMP WHERE id = ?', 
                     (user[0],))
            conn.commit()
            conn.close()
            
            if request.is_json:
                return jsonify({'success': True, 'redirect': url_for('dashboard')})
            return redirect(url_for('dashboard'))
        
        error = "Nom d'utilisateur ou mot de passe incorrect"
        if request.is_json:
            return jsonify({'success': False, 'error': error}), 401
        flash(error)
    
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    """Inscription utilisateur"""
    if request.method == 'POST':
        data = request.get_json() if request.is_json else request.form
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        if not all([username, email, password]):
            error = "Tous les champs sont requis"
            if request.is_json:
                return jsonify({'success': False, 'error': error}), 400
            flash(error)
            return render_template('register.html')
        
        password_hash = generate_password_hash(password)
        
        try:
            conn = sqlite3.connect('financial_agent.db')
            c = conn.cursor()
            c.execute('''
                INSERT INTO users (username, email, password_hash)
                VALUES (?, ?, ?)
            ''', (username, email, password_hash))
            user_id = c.lastrowid
            conn.commit()
            conn.close()
            
            session['user_id'] = user_id
            session['username'] = username
            
            if request.is_json:
                return jsonify({'success': True, 'redirect': url_for('dashboard')})
            return redirect(url_for('dashboard'))
            
        except sqlite3.IntegrityError:
            error = "Nom d'utilisateur ou email déjà existant"
            if request.is_json:
                return jsonify({'success': False, 'error': error}), 400
            flash(error)
    
    return render_template('register.html')

@app.route('/logout')
def logout():
    """Déconnexion"""
    session.clear()
    return redirect(url_for('index'))

@app.route('/dashboard')
@login_required
def dashboard():
    """Tableau de bord utilisateur"""
    user_id = session['user_id']
    
    conn = sqlite3.connect('financial_agent.db')
    c = conn.cursor()
    
    # Données utilisateur
    c.execute('SELECT * FROM users WHERE id = ?', (user_id,))
    user_data = c.fetchone()
    
    # Calculs récents
    c.execute('''
        SELECT calc_type, result, xp_earned, created_at 
        FROM calculations 
        WHERE user_id = ? 
        ORDER BY created_at DESC 
        LIMIT 5
    ''', (user_id,))
    recent_calculations = c.fetchall()
    
    # Conversations IA récentes
    c.execute('''
        SELECT message, response, created_at 
        FROM ai_conversations 
        WHERE user_id = ? 
        ORDER BY created_at DESC 
        LIMIT 3
    ''', (user_id,))
    recent_conversations = c.fetchall()
    
    conn.close()
    
    # Données de gamification
    current_level = gamification.get_level_from_xp(user_data[5])
    xp_for_next = gamification.xp_for_next_level(user_data[5])
    user_badges = json.loads(user_data[8])
    
    user_info = {
        'username': user_data[1],
        'level': current_level,
        'xp': user_data[5],
        'xp_for_next_level': xp_for_next,
        'streak': user_data[6],
        'total_calculations': user_data[7],
        'badges': [badge for badge in BADGES_SYSTEM if badge.id in user_badges],
        'ai_uses': user_data[9]
    }
    
    return render_template('dashboard.html', 
                         user=user_info, 
                         recent_calculations=recent_calculations,
                         recent_conversations=recent_conversations)

# Routes API pour les calculatrices
@app.route('/api/calculate/mortgage', methods=['POST'])
@login_required
def api_mortgage():
    """API calcul crédit immobilier"""
    try:
        data = request.get_json()
        principal = float(data['principal'])
        rate = float(data['rate'])
        years = int(data['years'])
        
        result = calculator.mortgage_calculator(principal, rate, years)
        
        # Enregistrer le calcul et donner XP
        user_id = session['user_id']
        xp_earned = gamification.calculate_xp('mortgage')
        
        conn = sqlite3.connect('financial_agent.db')
        c = conn.cursor()
        
        # Enregistrer le calcul
        c.execute('''
            INSERT INTO calculations (user_id, calc_type, parameters, result, xp_earned)
            VALUES (?, ?, ?, ?, ?)
        ''', (user_id, 'mortgage', json.dumps(data), json.dumps(result), xp_earned))
        
        # Mettre à jour l'utilisateur
        c.execute('''
            UPDATE users 
            SET xp = xp + ?, total_calculations = total_calculations + 1,
                last_activity = CURRENT_TIMESTAMP
            WHERE id = ?
        ''', (xp_earned, user_id))
        
        # Ajouter le type de calcul utilisé
        c.execute('SELECT calc_types_used FROM users WHERE id = ?', (user_id,))
        calc_types = json.loads(c.fetchone()[0])
        if 'mortgage' not in calc_types:
            calc_types.append('mortgage')
            c.execute('UPDATE users SET calc_types_used = ? WHERE id = ?', 
                     (json.dumps(calc_types), user_id))
        
        conn.commit()
        conn.close()
        
        # Vérifier nouveaux badges
        new_badges = gamification.check_new_badges(user_id)
        
        return jsonify({
            'success': True,
            'result': result,
            'xp_earned': xp_earned,
            'new_badges': [asdict(badge) for badge in new_badges]
        })
        
    except Exception as e:
        logger.error(f"Erreur calcul crédit: {e}")
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/calculate/investment', methods=['POST'])
@login_required
def api_investment():
    """API calcul investissement"""
    try:
        data = request.get_json()
        initial = float(data['initial'])
        monthly = float(data['monthly'])
        rate = float(data['rate'])
        years = int(data['years'])
        
        result = calculator.investment_calculator(initial, monthly, rate, years)
        
        # Enregistrer et XP
        user_id = session['user_id']
        xp_earned = gamification.calculate_xp('investment')
        
        conn = sqlite3.connect('financial_agent.db')
        c = conn.cursor()
        
        c.execute('''
            INSERT INTO calculations (user_id, calc_type, parameters, result, xp_earned)
            VALUES (?, ?, ?, ?, ?)
        ''', (user_id, 'investment', json.dumps(data), json.dumps(result), xp_earned))
        
        c.execute('''
            UPDATE users 
            SET xp = xp + ?, total_calculations = total_calculations + 1,
                last_activity = CURRENT_TIMESTAMP
            WHERE id = ?
        ''', (xp_earned, user_id))
        
        # Ajouter le type de calcul
        c.execute('SELECT calc_types_used FROM users WHERE id = ?', (user_id,))
        calc_types = json.loads(c.fetchone()[0])
        if 'investment' not in calc_types:
            calc_types.append('investment')
            c.execute('UPDATE users SET calc_types_used = ? WHERE id = ?', 
                     (json.dumps(calc_types), user_id))
        
        conn.commit()
        conn.close()
        
        new_badges = gamification.check_new_badges(user_id)
        
        return jsonify({
            'success': True,
            'result': result,
            'xp_earned': xp_earned,
            'new_badges': [asdict(badge) for badge in new_badges]
        })
        
    except Exception as e:
        logger.error(f"Erreur calcul investissement: {e}")
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/calculate/retirement', methods=['POST'])
@login_required
def api_retirement():
    """API calcul retraite"""
    try:
        data = request.get_json()
        current_age = int(data['current_age'])
        retirement_age = int(data['retirement_age'])
        current_savings = float(data['current_savings'])
        monthly_savings = float(data['monthly_savings'])
        annual_return = float(data['annual_return'])
        inflation_rate = float(data.get('inflation_rate', 2.5))
        
        result = calculator.retirement_calculator(
            current_age, retirement_age, current_savings, 
            monthly_savings, annual_return, inflation_rate
        )
        
        # Enregistrer et XP
        user_id = session['user_id']
        xp_earned = gamification.calculate_xp('retirement')
        
        conn = sqlite3.connect('financial_agent.db')
        c = conn.cursor()
        
        c.execute('''
            INSERT INTO calculations (user_id, calc_type, parameters, result, xp_earned)
            VALUES (?, ?, ?, ?, ?)
        ''', (user_id, 'retirement', json.dumps(data), json.dumps(result), xp_earned))
        
        c.execute('''
            UPDATE users 
            SET xp = xp + ?, total_calculations = total_calculations + 1,
                last_activity = CURRENT_TIMESTAMP
            WHERE id = ?
        ''', (xp_earned, user_id))
        
        # Ajouter le type de calcul
        c.execute('SELECT calc_types_used FROM users WHERE id = ?', (user_id,))
        calc_types = json.loads(c.fetchone()[0])
        if 'retirement' not in calc_types:
            calc_types.append('retirement')
            c.execute('UPDATE users SET calc_types_used = ? WHERE id = ?', 
                     (json.dumps(calc_types), user_id))
        
        conn.commit()
        conn.close()
        
        new_badges = gamification.check_new_badges(user_id)
        
        return jsonify({
            'success': True,
            'result': result,
            'xp_earned': xp_earned,
            'new_badges': [asdict(badge) for badge in new_badges]
        })
        
    except Exception as e:
        logger.error(f"Erreur calcul retraite: {e}")
        return jsonify({'success': False, 'error': str(e)}), 400

# Route Agent IA
@app.route('/api/ai/chat', methods=['POST'])
@login_required
def ai_chat():
    """API conversation avec l'agent IA"""
    try:
        data = request.get_json()
        message = data.get('message', '').strip()
        
        if not message:
            return jsonify({'success': False, 'error': 'Message vide'}), 400
        
        user_id = session['user_id']
        context = data.get('context', {})
        
        # Générer la réponse IA
        response = ai_agent.generate_response(message, user_id, context)
        
        # Donner des XP pour l'utilisation de l'IA
        xp_earned = gamification.calculate_xp('ai_question')
        
        conn = sqlite3.connect('financial_agent.db')
        c = conn.cursor()
        c.execute('''
            UPDATE users 
            SET xp = xp + ?, last_activity = CURRENT_TIMESTAMP
            WHERE id = ?
        ''', (xp_earned, user_id))
        conn.commit()
        conn.close()
        
        # Vérifier nouveaux badges
        new_badges = gamification.check_new_badges(user_id)
        
        return jsonify({
            'success': True,
            'response': response,
            'xp_earned': xp_earned,
            'new_badges': [asdict(badge) for badge in new_badges]
        })
        
    except Exception as e:
        logger.error(f"Erreur agent IA: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

# Routes utilitaires
@app.route('/api/user/profile')
@login_required
def user_profile():
    """Profil utilisateur avec statistiques détaillées"""
    user_id = session['user_id']
    
    conn = sqlite3.connect('financial_agent.db')
    c = conn.cursor()
    
    # Données utilisateur
    c.execute('SELECT * FROM users WHERE id = ?', (user_id,))
    user_data = c.fetchone()
    
    # Statistiques détaillées
    c.execute('''
        SELECT calc_type, COUNT(*), SUM(xp_earned)
        FROM calculations 
        WHERE user_id = ? 
        GROUP BY calc_type
    ''', (user_id,))
    calc_stats = c.fetchall()
    
    # Activité mensuelle
    c.execute('''
        SELECT DATE(created_at) as date, COUNT(*) as count
        FROM calculations 
        WHERE user_id = ? AND created_at > datetime('now', '-30 days')
        GROUP BY DATE(created_at)
        ORDER BY date
    ''', (user_id,))
    daily_activity = c.fetchall()
    
    conn.close()
    
    # Traitement des données
    current_level = gamification.get_level_from_xp(user_data[5])
    xp_for_next = gamification.xp_for_next_level(user_data[5])
    user_badges = json.loads(user_data[8])
    
    profile = {
        'id': user_data[0],
        'username': user_data[1],
        'email': user_data[2],
        'level': current_level,
        'xp': user_data[5],
        'xp_for_next_level': xp_for_next,
        'streak': user_data[6],
        'total_calculations': user_data[7],
        'ai_uses': user_data[9],
        'badges': [badge for badge in BADGES_SYSTEM if badge.id in user_badges],
        'member_since': user_data[11],
        'last_activity': user_data[12],
        'calc_statistics': [
            {'type': stat[0], 'count': stat[1], 'total_xp': stat[2]}
            for stat in calc_stats
        ],
        'daily_activity': [
            {'date': activity[0], 'count': activity[1]}
            for activity in daily_activity
        ]
    }
    
    return jsonify({'success': True, 'profile': profile})

@app.route('/api/leaderboard')
def leaderboard():
    """Classement des utilisateurs"""
    conn = sqlite3.connect('financial_agent.db')
    c = conn.cursor()
    
    # Top XP
    c.execute('''
        SELECT username, level, xp, total_calculations
        FROM users 
        ORDER BY xp DESC 
        LIMIT 20
    ''')
    top_xp = c.fetchall()
    
    # Top calculs
    c.execute('''
        SELECT username, total_calculations, xp
        FROM users 
        ORDER BY total_calculations DESC 
        LIMIT 20
    ''')
    top_calculations = c.fetchall()
    
    # Top streak
    c.execute('''
        SELECT username, streak, xp
        FROM users 
        ORDER BY streak DESC 
        LIMIT 20
    ''')
    top_streak = c.fetchall()
    
    conn.close()
    
    return jsonify({
        'success': True,
        'leaderboards': {
            'xp': [
                {'username': row[0], 'level': gamification.get_level_from_xp(row[2]), 
                 'xp': row[2], 'calculations': row[3]}
                for row in top_xp
            ],
            'calculations': [
                {'username': row[0], 'calculations': row[1], 'xp': row[2]}
                for row in top_calculations
            ],
            'streak': [
                {'username': row[0], 'streak': row[1], 'xp': row[2]}
                for row in top_streak
            ]
        }
    })

# Pages calculatrices
@app.route('/calculators')
@login_required
def calculators():
    """Page des calculatrices"""
    return render_template('calculators.html')

@app.route('/calculators/mortgage')
@login_required
def mortgage_calculator_page():
    """Page calculatrice crédit"""
    return render_template('calculators/mortgage.html')

@app.route('/calculators/investment')
@login_required
def investment_calculator_page():
    """Page calculatrice investissement"""
    return render_template('calculators/investment.html')

@app.route('/calculators/retirement')
@login_required
def retirement_calculator_page():
    """Page calculatrice retraite"""
    return render_template('calculators/retirement.html')

@app.route('/ai-assistant')
@login_required
def ai_assistant_page():
    """Page assistant IA"""
    return render_template('ai_assistant.html')

@app.route('/profile')
@login_required
def profile_page():
    """Page profil utilisateur"""
    return render_template('profile.html')

@app.route('/leaderboard')
def leaderboard_page():
    """Page classements"""
    return render_template('leaderboard.html')

# API externe (optionnelle)
@app.route('/api/external/calculate', methods=['POST'])
@api_key_required
def external_calculate():
    """API externe pour intégrations tierces"""
    try:
        data = request.get_json()
        calc_type = data.get('type')
        params = data.get('parameters', {})
        
        if calc_type == 'mortgage':
            result = calculator.mortgage_calculator(
                float(params['principal']),
                float(params['rate']),
                int(params['years'])
            )
        elif calc_type == 'investment':
            result = calculator.investment_calculator(
                float(params['initial']),
                float(params['monthly']),
                float(params['rate']),
                int(params['years'])
            )
        elif calc_type == 'retirement':
            result = calculator.retirement_calculator(
                int(params['current_age']),
                int(params['retirement_age']),
                float(params['current_savings']),
                float(params['monthly_savings']),
                float(params['annual_return']),
                float(params.get('inflation_rate', 2.5))
            )
        else:
            return jsonify({'error': 'Type de calcul non supporté'}), 400
        
        return jsonify({'success': True, 'result': result})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Gestion des erreurs
@app.errorhandler(404)
def not_found(e):
    return render_template('errors/404.html'), 404

@app.errorhandler(500)
def server_error(e):
    return render_template('errors/500.html'), 500

if __name__ == '__main__':
    # Initialiser la base de données
    init_db()
    
    # Configuration selon l'environnement
    if os.environ.get('FLASK_ENV') == 'production':
        app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
    else:
        app.run(debug=True, host='0.0.0.0', port=5000)