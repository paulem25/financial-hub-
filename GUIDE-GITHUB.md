# 🚀 Guide de Déploiement GitHub

Guide étape par étape pour mettre votre projet sur GitHub et le déployer sur Vercel.

## 📋 Étape 1 : Installer Git

### Option A : Installation automatique (recommandée)
```powershell
winget install --id Git.Git -e --source winget
```

### Option B : Installation manuelle
1. Allez sur [git-scm.com/downloads/win](https://git-scm.com/downloads/win)
2. Téléchargez la dernière version (2.50.0)
3. Exécutez l'installateur **en tant qu'administrateur**
4. Suivez l'assistant avec les paramètres par défaut
5. Redémarrez PowerShell

### Vérification
```powershell
git --version
```
Doit afficher : `git version 2.50.0.windows.1` (ou similaire)

## 🌐 Étape 2 : Créer le Repository GitHub

1. **Allez sur [github.com](https://github.com)**
2. **Cliquez sur "Sign up"** si pas de compte, sinon "Sign in"
3. **Cliquez sur le bouton vert "+"** en haut à droite → "New repository"
4. **Remplissez les informations :**
   - **Repository name :** `calculatrices-financieres-gamifiees`
   - **Description :** `Site web de calculatrices financières avec gamification inspirée de Duolingo`
   - **Public** ✅ (ou Private si vous préférez)
   - **❌ NE PAS cocher** "Add a README file"
   - **❌ NE PAS cocher** "Add .gitignore"
   - **❌ NE PAS cocher** "Choose a license"
5. **Cliquez sur "Create repository"**

### 📝 Copier l'URL du repository
Après création, copiez l'URL qui ressemble à :
```
https://github.com/VOTRE-USERNAME/calculatrices-financieres-gamifiees.git
```

## 🚀 Étape 3 : Déploiement Automatique

### Option A : Script PowerShell (recommandé)
```powershell
.\deploy-to-github.ps1
```
Le script vous guidera automatiquement !

### Option B : Commandes manuelles
```powershell
# 1. Initialiser Git
git init

# 2. Configurer Git (première fois seulement)
git config user.name "Votre Nom"
git config user.email "votre.email@example.com"

# 3. Ajouter tous les fichiers
git add .

# 4. Premier commit
git commit -m "🎮 Initial commit: Calculatrices Financières Gamifiées"

# 5. Ajouter le repository distant
git remote add origin https://github.com/VOTRE-USERNAME/calculatrices-financieres-gamifiees.git

# 6. Renommer la branche
git branch -M main

# 7. Push vers GitHub
git push -u origin main
```

## 🌟 Étape 4 : Déploiement sur Vercel

### Méthode rapide (sans Node.js local)
1. **Allez sur [vercel.com](https://vercel.com)**
2. **Cliquez sur "Sign Up"** → "Continue with GitHub"
3. **Autorisez Vercel** à accéder à vos repositories
4. **Cliquez sur "New Project"**
5. **Sélectionnez** votre repository `calculatrices-financieres-gamifiees`
6. **Vercel détectera automatiquement** Next.js
7. **Cliquez sur "Deploy"**
8. **Attendez 2-3 minutes** ⏱️

### 🎉 Résultat
- ✅ **Site en ligne** sur une URL comme : `https://calculatrices-financieres-[hash].vercel.app`
- ✅ **Mises à jour automatiques** à chaque push sur GitHub
- ✅ **HTTPS sécurisé** automatique
- ✅ **PWA installable** sur mobile et desktop

## 🔧 Troubleshooting

### Problème : Git ne reconnaît pas mes identifiants
```powershell
# Configuration globale
git config --global user.name "Votre Nom"
git config --global user.email "votre.email@example.com"

# Vérification
git config --list
```

### Problème : "Permission denied" lors du push
- GitHub peut demander une authentification
- Utilisez votre **Personal Access Token** au lieu de votre mot de passe
- Générez-le sur GitHub : Settings → Developer settings → Personal access tokens

### Problème : "Repository not found"
- Vérifiez que l'URL du repository est correcte
- Vérifiez que le repository existe sur GitHub
- Vérifiez que vous avez les droits d'écriture

## 📞 Aide supplémentaire

### Documentation officielle
- [Guide Git](https://git-scm.com/docs)
- [GitHub Docs](https://docs.github.com)
- [Vercel Docs](https://vercel.com/docs)

### Support
- Ouvrez une [Issue GitHub](../../issues) si problème
- Consultez le [guide de contribution](CONTRIBUTING.md)

---

**🎮 Votre site de calculatrices financières gamifiées sera bientôt en ligne !** 