'use client';

import { motion } from 'framer-motion';
import { Calculator, TrendingUp, PiggyBank, Home, Trophy, Star, Users, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-duolingo-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-duolingo-text mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Maîtrisez vos{' '}
            <span className="text-duolingo-green">finances</span>
            <br />
            en vous amusant ! 🎮
          </motion.h1>
          
          <motion.p
            className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Calculatrices financières interactives avec système de gamification 
            inspiré de Duolingo. Gagnez des points, débloquez des badges et 
            progressez dans la maîtrise de vos finances !
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <button className="bg-duolingo-green hover:bg-primary-600 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-duolingo">
              <Calculator className="inline-block mr-2 w-5 h-5" />
              Commencer maintenant
            </button>
            <button className="border-2 border-duolingo-green text-duolingo-green hover:bg-duolingo-green hover:text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105">
              <Trophy className="inline-block mr-2 w-5 h-5" />
              Voir les classements
            </button>
          </motion.div>
          
          {/* Statistiques en temps réel */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="bg-white rounded-xl p-4 shadow-card border border-gray-100">
              <div className="text-2xl font-bold text-duolingo-green">15,247</div>
              <div className="text-sm text-gray-600">Calculs effectués</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-card border border-gray-100">
              <div className="text-2xl font-bold text-duolingo-orange">1,543</div>
              <div className="text-sm text-gray-600">Utilisateurs actifs</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-card border border-gray-100">
              <div className="text-2xl font-bold text-duolingo-purple">847</div>
              <div className="text-sm text-gray-600">Badges débloqués</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-card border border-gray-100">
              <div className="text-2xl font-bold text-duolingo-teal">4.9</div>
              <div className="text-sm text-gray-600">Note moyenne</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Calculatrices populaires */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center text-duolingo-text mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Calculatrices populaires
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {calculators.map((calc, index) => (
              <motion.div
                key={calc.id}
                className="bg-white rounded-xl p-6 shadow-card border border-gray-100 hover:shadow-elevated transition-all duration-300 cursor-pointer hover:scale-105"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-xl ${calc.bgColor} mr-4`}>
                    <calc.icon className={`w-6 h-6 ${calc.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-duolingo-text">{calc.title}</h3>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{calc.rating} • {calc.users} utilisateurs</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{calc.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-duolingo-orange" />
                    <span className="text-sm font-bold text-duolingo-orange">
                      +{calc.points} XP
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {calc.difficulty}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section gamification */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-duolingo-text mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Apprenez en vous amusant
          </motion.h2>
          
          <motion.p
            className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Notre système de gamification vous motive à utiliser nos calculatrices 
            et à améliorer vos connaissances financières jour après jour.
          </motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                className="bg-white rounded-xl p-8 shadow-card border border-gray-100"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <div className={`w-16 h-16 ${feature.bgColor} rounded-xl flex items-center justify-center mx-auto mb-6`}>
                  <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-duolingo-text mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center text-duolingo-text mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Ce que disent nos utilisateurs
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className="bg-white rounded-xl p-6 shadow-card border border-gray-100"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-duolingo-green to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-duolingo-text">{testimonial.name}</h4>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">&ldquo;{testimonial.comment}&rdquo;</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// Données des calculatrices
const calculators = [
  {
    id: 'credit',
    title: 'Crédit Immobilier',
    description: 'Calculez vos mensualités, coût total et tableau d\'amortissement',
    icon: Home,
    bgColor: 'bg-duolingo-green/10',
    iconColor: 'text-duolingo-green',
    rating: '4.9',
    users: '2,547',
    points: 50,
    difficulty: 'Facile'
  },
  {
    id: 'investment',
    title: 'Investissement',
    description: 'Simulez vos placements et optimisez votre portefeuille',
    icon: TrendingUp,
    bgColor: 'bg-duolingo-orange/10',
    iconColor: 'text-duolingo-orange',
    rating: '4.8',
    users: '1,893',
    points: 75,
    difficulty: 'Moyen'
  },
  {
    id: 'retirement',
    title: 'Retraite',
    description: 'Estimez votre pension et planifiez votre retraite',
    icon: PiggyBank,
    bgColor: 'bg-duolingo-purple/10',
    iconColor: 'text-duolingo-purple',
    rating: '4.7',
    users: '1,256',
    points: 100,
    difficulty: 'Difficile'
  }
];

// Données des fonctionnalités
const features = [
  {
    id: 'points',
    title: 'Système de points',
    description: 'Gagnez des points à chaque calcul et débloquez de nouveaux niveaux',
    icon: Zap,
    bgColor: 'bg-duolingo-orange/10',
    iconColor: 'text-duolingo-orange'
  },
  {
    id: 'badges',
    title: 'Badges et récompenses',
    description: 'Collectionnez des badges uniques selon vos accomplissements',
    icon: Trophy,
    bgColor: 'bg-duolingo-green/10',
    iconColor: 'text-duolingo-green'
  },
  {
    id: 'leaderboard',
    title: 'Classements',
    description: 'Comparez-vous aux autres utilisateurs et gravissez les échelons',
    icon: Users,
    bgColor: 'bg-duolingo-purple/10',
    iconColor: 'text-duolingo-purple'
  }
];

// Données des témoignages
const testimonials = [
  {
    id: 1,
    name: 'Marie Dubois',
    comment: 'J\'adore le côté ludique ! J\'ai enfin compris mes finances grâce aux badges et aux défis quotidiens.'
  },
  {
    id: 2,
    name: 'Pierre Martin',
    comment: 'Les calculatrices sont très précises et le système de points me motive à revenir chaque jour.'
  },
  {
    id: 3,
    name: 'Sophie Laurent',
    comment: 'Interface magnifique et très intuitive. J\'ai optimisé mon crédit immobilier en quelques clics !'
  }
]; 