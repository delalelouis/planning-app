# Delale Bureau Web App

Base sérieuse pour mettre ton planning et ton calculateur en ligne sur ton domaine, avec sauvegarde serveur.

## Stack choisie
- Next.js App Router
- Supabase Auth + Postgres
- déploiement Vercel

## 1. Installer
```bash
npm install
```

## 2. Créer le projet Supabase
- crée un projet
- récupère l'URL et la clé anon
- copie `.env.example` vers `.env.local`
- remplis les variables

## 3. Créer les tables
- ouvre SQL Editor dans Supabase
- colle `supabase/schema.sql`
- exécute

## 4. Lancer en local
```bash
npm run dev
```

## 5. Déployer
- pousse le projet sur GitHub
- importe le repo dans Vercel
- ajoute les variables d'environnement
- connecte ton domaine

## Ce que fait déjà cette base
- connexion / déconnexion
- planning sauvegardé en ligne
- calculateur sauvegardé en ligne
- données séparées par utilisateur
- base prête pour évoluer

## Ce qu'il faudra améliorer ensuite
- migration complète de ton ancien planning local
- reprise complète de tous les calculateurs
- historique / sauvegardes
- meilleure UI mobile