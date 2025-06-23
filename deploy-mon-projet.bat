@echo off
chcp 65001 >nul
echo.
echo =================================================================
echo 🎮 Déploiement sur votre repository GitHub
echo URL: https://github.com/paulem25/financial-hub-.git
echo =================================================================
echo.

REM Vérifier si Git est installé
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git n'est pas encore installé !
    echo.
    echo 📋 Étapes à suivre :
    echo 1. Téléchargez Git : https://git-scm.com/download/win
    echo 2. Installez Git EN TANT QU'ADMINISTRATEUR
    echo 3. Redémarrez PowerShell
    echo 4. Relancez ce script : deploy-mon-projet.bat
    echo.
    pause
    exit /b 1
)

echo ✅ Git est installé !
echo.

echo 🔧 Initialisation du repository Git...
git init

echo.
echo 🔧 Configuration Git (si première fois)...
git config user.name "paulem25"
git config user.email "paul@example.com"

echo.
echo 📁 Ajout de tous les fichiers...
git add .

echo.
echo 💾 Création du commit initial...
git commit -m "🎮 Initial commit: Calculatrices Financières Gamifiées

✨ Fonctionnalités:
- Interface gamifiée inspirée de Duolingo  
- Calculatrices financières multiples
- PWA avec fonctionnement offline
- Design responsive et moderne
- TypeScript + Next.js 15 + Tailwind CSS

🚀 Prêt pour déploiement sur Vercel"

echo.
echo 🌐 Configuration du repository distant...
git remote add origin https://github.com/paulem25/financial-hub-.git
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
    echo 1. ✅ Code déployé sur : https://github.com/paulem25/financial-hub-
    echo 2. 🚀 Allez sur : https://vercel.com
    echo 3. 🔗 Cliquez "New Project" et sélectionnez votre repository
    echo 4. 🌟 Votre site sera en ligne en 2-3 minutes !
    echo.
    echo 🔗 Accédez à votre repository : https://github.com/paulem25/financial-hub-
    echo.
) else (
    echo.
    echo ⚠️ Erreur lors du push.
    echo 💡 GitHub peut demander une authentification.
    echo 📧 Utilisez votre email/mot de passe GitHub ou Personal Access Token
    echo.
)

echo.
pause 