# Apaddicto - Application de Thérapie Sportive

Une application web complète pour la gestion de la thérapie sportive avec authentification, exercices personnalisés et contenu psychoéducatif.

## Fonctionnalités

- 🔐 **Authentification sécurisée** : Système de connexion/inscription pour patients et administrateurs
- 🔑 **Réinitialisation de mot de passe sécurisée** : Système basé sur des tokens avec envoi d'emails
- 💪 **Exercices personnalisés** : Catalogue d'exercices de thérapie sportive avec instructions détaillées
- 📚 **Contenu psychoéducatif** : Articles et ressources pour accompagner le processus de rétablissement
- 📊 **Suivi des progrès** : Tableaux de bord pour suivre l'évolution des patients
- 🏆 **Système de badges** : Récompenses pour motiver les utilisateurs
- 🛡️ **Sécurité avancée** : Protection contre les attaques par force brute, audit des événements de sécurité
- 📧 **Notifications email** : Système d'envoi d'emails pour la réinitialisation de mot de passe
- 📱 **Interface responsive** : Compatible mobile et desktop

## Sécurité

L'application inclut un système de sécurité avancé :

### Réinitialisation de mot de passe
- **Tokens sécurisés** : Génération de tokens cryptographiques uniques
- **Expiration automatique** : Tokens valides 15 minutes seulement
- **Usage unique** : Chaque token ne peut être utilisé qu'une fois
- **Emails professionnels** : Templates d'email sécurisés avec instructions

### Protection contre les attaques
- **Rate limiting** : Maximum 5 tentatives par email/IP par 15 minutes
- **Blocage temporaire** : Blocage de 30 minutes après dépassement du seuil
- **Audit de sécurité** : Enregistrement de tous les événements de sécurité
- **Nettoyage automatique** : Suppression automatique des tokens expirés

### Monitoring (Admin)
- `GET /api/admin/security-events` : Consultation des événements de sécurité
- `GET /api/admin/security-summary` : Résumé des activités suspectes
- `POST /api/admin/security-cleanup` : Nettoyage manuel des données de sécurité
- `DELETE /api/admin/security-events` : Suppression des logs de sécurité

## Technologies utilisées

- **Frontend** : React, TypeScript, Tailwind CSS, Shadcn/UI
- **Backend** : Node.js, Express, TypeScript
- **Base de données** : PostgreSQL (Neon)
- **ORM** : Drizzle
- **Authentification** : Sessions avec bcrypt
- **Déploiement** : Vercel

## Déploiement sur Vercel

### Prérequis

1. Compte Vercel (vercel.com)
2. Base de données PostgreSQL (fournie : Neon)
3. Code Vercel fourni : `wQIOawWSweqWark0ZL4eI9jU`

### Instructions de déploiement

#### Étape 1 : Connexion à Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Connectez-vous avec votre compte GitHub/Google/Email
3. Cliquez sur "New Project"

#### Étape 2 : Import du projet

1. Sélectionnez "Import Git Repository"
2. Si le projet n'est pas encore sur Git, uploadez le dossier `Apaddicto` complet
3. Ou utilisez l'option "Deploy from CLI" avec le code fourni

#### Étape 3 : Configuration des variables d'environnement

Dans les paramètres du projet Vercel, ajoutez ces variables d'environnement :

**Variables obligatoires :**
```
DATABASE_URL=postgresql://neondb_owner:npg_vRJU7LlnYG1y@ep-soft-bush-ab0hbww0-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
SESSION_SECRET=Apaddicto2024SecretKey
NODE_ENV=production
```

**Variables optionnelles (pour les emails de réinitialisation) :**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
CLIENT_URL=https://your-vercel-domain.vercel.app
```

> **Note** : Si les variables SMTP ne sont pas configurées, les tokens de réinitialisation seront générés mais aucun email ne sera envoyé. Les utilisateurs devront contacter l'administrateur.

#### Étape 4 : Configuration du build

Vercel détectera automatiquement le projet Node.js. Vérifiez que :
- **Build Command** : `npm run vercel-build`
- **Output Directory** : `dist`
- **Install Command** : `npm install`

#### Étape 5 : Déploiement

1. Cliquez sur "Deploy"
2. Attendez que le déploiement se termine
3. Votre application sera disponible sur l'URL fournie par Vercel

### Configuration post-déploiement

#### Création d'un compte administrateur

1. Accédez à votre application déployée
2. Créez un compte avec le rôle "admin" lors de l'inscription
3. Ou modifiez un compte existant en base de données

#### Initialisation des données

L'application inclut des exercices et du contenu psychoéducatif par défaut. Pour ajouter plus de contenu :

1. Connectez-vous en tant qu'administrateur
2. Utilisez l'interface d'administration pour ajouter des exercices
3. Ajoutez du contenu psychoéducatif via l'API

## Structure du projet

```
Apaddicto/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Composants UI
│   │   ├── pages/          # Pages de l'application
│   │   ├── hooks/          # Hooks React personnalisés
│   │   └── lib/            # Utilitaires
├── server/                 # Backend Express
│   ├── auth.ts            # Système d'authentification
│   ├── routes.ts          # Routes API
│   ├── storage.ts         # Couche de données
│   └── seed-data.ts       # Données d'exemple
├── shared/                 # Types partagés
│   └── schema.ts          # Schéma de base de données
└── vercel.json            # Configuration Vercel
```

## API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/me` - Profil utilisateur

### Exercices
- `GET /api/exercises` - Liste des exercices
- `POST /api/exercises` - Créer un exercice (admin)

### Contenu psychoéducatif
- `GET /api/psycho-education` - Liste du contenu
- `POST /api/psycho-education` - Créer du contenu (admin)

### Suivi
- `POST /api/cravings` - Enregistrer une envie
- `GET /api/cravings` - Historique des envies
- `POST /api/exercise-sessions` - Enregistrer une session
- `GET /api/exercise-sessions` - Historique des sessions

## Lien Instagram

L'application inclut un lien vers le compte Instagram @apaperigueux dans la page de connexion.

## Support

Pour toute question ou problème, contactez l'équipe de développement.

## Licence

Propriétaire - Tous droits réservés

