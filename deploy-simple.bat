@echo off
echo.
echo =================================================================
echo 🎮 Déploiement des Calculatrices Financières Gamifiées sur GitHub
echo =================================================================
echo.

REM Vérifier si Git est installé
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git n'est pas installé !
    echo.
    echo 📋 Étapes à suivre :
    echo 1. Téléchargez Git : https://git-scm.com/download/win
    echo 2. Installez Git EN TANT QU'ADMINISTRATEUR
    echo 3. Redémarrez ce terminal
    echo 4. Relancez ce script
    echo.
    pause
    exit /b 1
)

echo ✅ Git est installé
echo.

REM Demander l'URL du repository
set /p repo_url="Entrez l'URL de votre repository GitHub : "
if "%repo_url%"=="" (
    echo ❌ URL du repository requis
    pause
    exit /b 1
)

echo.
echo 🔧 Initialisation du repository Git...
git init

echo.
echo 📁 Ajout des fichiers...
git add .

echo.
echo 💾 Création du commit initial...
git commit -m "🎮 Initial commit: Calculatrices Financières Gamifiées - Interface gamifiée inspirée de Duolingo - PWA avec fonctionnement offline - TypeScript + Next.js 15 + Tailwind CSS"

echo.
echo 🌐 Configuration du repository distant...
git remote add origin %repo_url%
git branch -M main

echo.
echo ⬆️ Push vers GitHub...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo 🎉 SUCCÈS ! Votre projet est maintenant sur GitHub !
    echo =================================================================
    echo.
    echo 📋 Prochaines étapes :
    echo 1. ✅ Votre code est sur GitHub
    echo 2. 🚀 Allez sur vercel.com
    echo 3. 🔗 Connectez votre repository GitHub à Vercel
    echo 4. 🌟 Votre site sera en ligne en 2-3 minutes !
    echo.
) else (
    echo.
    echo ⚠️ Erreur lors du push. Vérifiez :
    echo - Que l'URL du repository est correcte
    echo - Que vous êtes connecté à GitHub
    echo - Que le repository existe sur GitHub
    echo.
    echo 💡 GitHub peut demander une authentification lors du premier push
)

echo.
pause 