# 🚀 Guide de Déploiement - Calculatrices Financières

## 🎯 Option 1 : Déploiement rapide sur Vercel (RECOMMANDÉ)

### ✅ Sans installer Node.js localement

1. **Allez sur [vercel.com](https://vercel.com)**
2. **Cliquez sur "Sign Up"** et créez un compte gratuit
3. **Connectez votre compte GitHub**
4. **Cliquez sur "New Project"**
5. **Uploadez votre dossier** ou connectez un repository GitHub
6. **Vercel détectera automatiquement Next.js**
7. **Cliquez sur "Deploy"**
8. **Votre site sera en ligne en 2-3 minutes !**

### 📝 Configuration automatique
- ✅ Next.js 15 détecté
- ✅ TypeScript configuré
- ✅ Tailwind CSS activé
- ✅ PWA fonctionnelle
- ✅ HTTPS automatique
- ✅ CDN mondial

## 🎯 Option 2 : Avec Node.js (pour développement local)

### Étape 1 : Installer Node.js
1. Téléchargez depuis [nodejs.org](https://nodejs.org/) (version LTS)
2. Installez en suivant l'assistant
3. Redémarrez votre terminal

### Étape 2 : Installer les dépendances
```bash
npm install
```

### Étape 3 : Lancer en développement
```bash
npm run dev
```
➡️ **Accès local : http://localhost:3000**

### Étape 4 : Déployer sur Vercel
```bash
npm install -g vercel
vercel login
vercel
```

## 🌟 Option 3 : Autres plateformes

### Netlify
1. Compte sur [netlify.com](https://netlify.com)
2. Drag & drop du dossier
3. Paramètres build : `npm run build`
4. Dossier publish : `.next`

### Railway
1. Compte sur [railway.app](https://railway.app)
2. Connect GitHub repository
3. Deploy automatiquement

### Render
1. Compte sur [render.com](https://render.com)
2. Connect repository
3. Configure build settings

## 📱 Fonctionnalités après déploiement

✅ **Site web accessible** depuis n'importe où  
✅ **PWA installable** sur mobile et desktop  
✅ **Fonctionnement offline** avec service worker  
✅ **HTTPS sécurisé** automatique  
✅ **Performance optimisée** (Lighthouse > 90)  
✅ **Responsive design** mobile/desktop  

## 🔧 Résolution de problèmes

### Si le build échoue :
```bash
npm run type-check
npm run lint
```

### Variables d'environnement (optionnelles) :
```env
NEXTAUTH_URL=https://votre-domaine.vercel.app
NEXTAUTH_SECRET=votre-secret-key
```

## 📞 Besoin d'aide ?

1. Vérifiez les **logs de build** sur Vercel
2. Consultez la **documentation Next.js**
3. Vérifiez que tous les **fichiers sont présents**

---

## 🎉 URL d'exemple après déploiement :

**Vercel :** `https://calculatrices-financieres-[hash].vercel.app`  
**Netlify :** `https://[nom-projet].netlify.app`  
**Railway :** `https://[nom-projet].up.railway.app`

### 🚀 Personnaliser l'URL (domaine personnalisé)

1. Sur Vercel : Settings → Domains
2. Ajoutez votre domaine personnalisé
3. Configurez les DNS selon les instructions

---

**🎮 Votre site de calculatrices financières gamifiées sera bientôt en ligne !** 