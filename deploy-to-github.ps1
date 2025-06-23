# 🚀 Script de déploiement GitHub - Calculatrices Financières Gamifiées
# Exécutez ce script après avoir installé Git et créé votre repository GitHub

Write-Host "🎮 Déploiement des Calculatrices Financières Gamifiées sur GitHub" -ForegroundColor Green
Write-Host "=================================================================" -ForegroundColor Green

# Vérifier si Git est installé
try {
    git --version
    Write-Host "✅ Git est installé" -ForegroundColor Green
} catch {
    Write-Host "❌ Git n'est pas installé. Veuillez l'installer depuis https://git-scm.com/downloads/win" -ForegroundColor Red
    Read-Host "Appuyez sur Entrée pour quitter"
    exit
}

# Demander l'URL du repository GitHub
Write-Host ""
Write-Host "📋 Informations nécessaires :" -ForegroundColor Yellow
$repoUrl = Read-Host "Entrez l'URL de votre repository GitHub (ex: https://github.com/username/calculatrices-financieres-gamifiees.git)"

if (-not $repoUrl) {
    Write-Host "❌ URL du repository requis" -ForegroundColor Red
    Read-Host "Appuyez sur Entrée pour quitter"
    exit
}

Write-Host ""
Write-Host "🔧 Initialisation du repository Git..." -ForegroundColor Cyan

# Initialiser le repository Git
git init

# Configurer Git (si pas déjà fait)
$userName = Read-Host "Entrez votre nom d'utilisateur Git (ou appuyez sur Entrée si déjà configuré)"
if ($userName) {
    git config user.name "$userName"
}

$userEmail = Read-Host "Entrez votre email Git (ou appuyez sur Entrée si déjà configuré)"
if ($userEmail) {
    git config user.email "$userEmail"
}

Write-Host ""
Write-Host "📁 Ajout des fichiers..." -ForegroundColor Cyan

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "🎮 Initial commit: Calculatrices Financières Gamifiées

✨ Fonctionnalités:
- Interface gamifiée inspirée de Duolingo
- Calculatrices financières multiples
- PWA avec fonctionnement offline
- Design responsive et moderne
- TypeScript + Next.js 15 + Tailwind CSS

🚀 Prêt pour déploiement sur Vercel"

Write-Host ""
Write-Host "🌐 Configuration du repository distant..." -ForegroundColor Cyan

# Ajouter le repository distant
git remote add origin $repoUrl

# Renommer la branche en main
git branch -M main

Write-Host ""
Write-Host "⬆️ Push vers GitHub..." -ForegroundColor Cyan

# Push vers GitHub
try {
    git push -u origin main
    Write-Host ""
    Write-Host "🎉 SUCCÈS ! Votre projet est maintenant sur GitHub !" -ForegroundColor Green
    Write-Host "=================================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Prochaines étapes :" -ForegroundColor Yellow
    Write-Host "1. ✅ Votre code est sur GitHub"
    Write-Host "2. 🚀 Allez sur vercel.com pour déployer automatiquement"
    Write-Host "3. 🔗 Connectez votre repository GitHub à Vercel"
    Write-Host "4. 🌟 Votre site sera en ligne en 2-3 minutes !"
    Write-Host ""
    Write-Host "🔗 Accédez à votre repository : $($repoUrl.Replace('.git', ''))" -ForegroundColor Cyan
} catch {
    Write-Host ""
    Write-Host "⚠️ Erreur lors du push. Vérifiez :" -ForegroundColor Yellow
    Write-Host "- Que l'URL du repository est correcte"
    Write-Host "- Que vous êtes connecté à GitHub (git config --global user.name et user.email)"
    Write-Host "- Que le repository existe sur GitHub"
    Write-Host ""
    Write-Host "💡 Si c'est votre première fois, GitHub peut demander une authentification"
}

Write-Host ""
Read-Host "Appuyez sur Entrée pour fermer" 