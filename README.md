# 🎮 Calculatrices Financières Gamifiées

Un site web moderne de calculatrices financières avec un système de gamification inspiré de Duolingo.

## 🚀 Installation et déploiement

### Étape 1 : Installer Node.js

1. **Téléchargez Node.js** depuis [nodejs.org](https://nodejs.org/)
2. **Choisissez la version LTS** (Long Term Support)
3. **Exécutez l'installateur** et suivez les instructions
4. **Vérifiez l'installation** en ouvrant un terminal et tapant :
   ```bash
   node --version
   npm --version
   ```

### Étape 2 : Installer les dépendances

```bash
# Dans le dossier du projet
npm install
```

### Étape 3 : Lancer en développement

```bash
npm run dev
```

Le site sera accessible sur http://localhost:3000

### Étape 4 : Déploiement sur Vercel (Recommandé)

1. **Créez un compte sur** [vercel.com](https://vercel.com)
2. **Connectez votre repository GitHub** (ou uploadez les fichiers)
3. **Déployez automatiquement** - Vercel détectera Next.js
4. **Votre site sera en ligne** en quelques minutes !

#### Alternative : Déploiement via CLI Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter à Vercel
vercel login

# Déployer le projet
vercel

# Pour le déploiement en production
vercel --prod
```

## ✨ Fonctionnalités

- **🎯 Gamification** : Points, badges, niveaux comme Duolingo
- **🧮 Calculatrices** : Crédit, investissement, retraite, taxes, budget
- **📱 Responsive** : Optimisé mobile et desktop
- **⚡ Performance** : PWA avec cache intelligent
- **🎨 Design** : Interface colorée inspirée de Duolingo

## 🛠️ Stack technique

- **Framework** : Next.js 15 avec App Router
- **Language** : TypeScript (mode strict)
- **Styling** : Tailwind CSS + variables CSS
- **Animations** : Framer Motion
- **État** : Zustand
- **Formulaires** : React Hook Form + Zod
- **Graphiques** : Recharts
- **Icônes** : Lucide React

## 📦 Scripts disponibles

```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run start    # Serveur de production
npm run lint     # Vérification du code
npm run type-check # Vérification TypeScript
```

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env.local` :

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
DATABASE_URL=your-database-url
```

### Base de données (Prisma)

```bash
npx prisma generate
npx prisma db push
```

## 📱 PWA (Progressive Web App)

Le site est configuré comme PWA et peut être installé sur mobile et desktop.

## 🎨 Personnalisation

Les couleurs et animations sont configurées dans :
- `tailwind.config.ts` - Configuration Tailwind
- `src/app/globals.css` - Styles CSS globaux
- `src/lib/utils.ts` - Utilitaires et helpers

## 📈 Performance

- ✅ Score Lighthouse > 90
- ✅ Images optimisées (WebP/AVIF)
- ✅ Code splitting automatique
- ✅ Lazy loading des composants
- ✅ Service Worker pour cache

## 🚀 Déploiement rapide sans installation

Si vous ne voulez pas installer Node.js localement, vous pouvez :

1. **Créer un repository GitHub** avec ces fichiers
2. **Connecter à Vercel** directement
3. **Déployer automatiquement** sans installation locale

## 📞 Support

Pour toute question ou problème, consultez la documentation ou créez une issue.

---

**Développé avec ❤️ et inspiré par l'approche gamifiée de Duolingo** 