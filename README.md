# Reporting Contract Management

Application web de reporting et gestion de contrats, développée avec **React**, **TypeScript**, **Tailwind CSS** et **shadcn/ui**. Le backend et l'authentification sont gérés via **Lovable Cloud**.

---

## Prérequis

- [Node.js](https://nodejs.org/) ≥ 18 (recommandé : LTS)
- [npm](https://www.npmjs.com/) (fourni avec Node.js) ou [bun](https://bun.sh/)
- Un compte GitHub avec accès au dépôt

---

## Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/maoulle07/reporting-contract-management-15-carnot-a632da27.git
cd reporting-contract-management-15-carnot-a632da27
```

### 2. Installer les dépendances

Avec **npm** :

```bash
npm install
```

Ou avec **bun** :

```bash
bun install
```

---

## Configuration

Les variables d'environnement nécessaires au fonctionnement de Lovable Cloud sont déjà présentes dans le fichier `.env` (généré automatiquement) :

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

> **Ne modifiez jamais manuellement** le fichier `.env`. Il est mis à jour automatiquement par l'intégration Lovable Cloud.

---

## Lancement

### Environnement de développement

```bash
npm run dev
```

L'application est alors accessible sur [http://localhost:5173](http://localhost:5173) (par défaut).

### Prévisualiser le build de production

```bash
npm run build
npm run preview
```

### Lancer les tests

```bash
# Une seule passe
npm run test

# Mode watch (re-lance les tests à chaque modification)
npm run test:watch
```

---

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lance le serveur de développement Vite |
| `npm run build` | Build pour la production |
| `npm run build:dev` | Build en mode développement |
| `npm run preview` | Prévisualise le build de production |
| `npm run test` | Exécute les tests Vitest |
| `npm run test:watch` | Tests en mode watch |
| `npm run lint` | Analyse le code avec ESLint |

---

## Contribution

Nous utilisons un workflow basé sur les **Pull Requests**.

### 1. Créer une branche

```bash
git checkout -b feature/ma-nouvelle-fonctionnalite
```

Nommage recommandé :
- `feature/...` pour une nouvelle fonctionnalité
- `fix/...` pour un correctif de bug
- `docs/...` pour une mise à jour de documentation

### 2. Développer et tester en local

```bash
npm run dev      # Vérifier visuellement
npm run test     # S'assurer que les tests passent
npm run lint     # Vérifier la qualité du code
```

### 3. Commiter les changements

```bash
git add .
git commit -m "feat: ajoute la gestion des contrats en lot"
```

Format de message recommandé :
- `feat: ...` nouvelle fonctionnalité
- `fix: ...` correction de bug
- `docs: ...` documentation
- `refactor: ...` refonte de code

### 4. Pousser la branche et ouvrir une Pull Request

```bash
git push origin feature/ma-nouvelle-fonctionnalite
```

Puis ouvrir une **Pull Request** sur GitHub et demander une revue à un membre de l'équipe.

### 5. Après la revue

Une fois la PR approuvée, elle peut être **fusionnée** dans `main`.

> ⚠️ **Ne poussez jamais directement sur `main`.** Passez toujours par une Pull Request.

---

## Structure du projet

```
├── public/               # Fichiers statiques (images, favicon, etc.)
├── src/
│   ├── components/       # Composants React réutilisables (shadcn/ui)
│   ├── hooks/            # Custom hooks React
│   ├── integrations/
│   │   └── supabase/     # Client et types Supabase (auto-générés)
│   ├── lib/              # Utilitaires et helpers
│   ├── pages/            # Pages de l'application
│   ├── test/             # Tests unitaires et configuration
│   ├── App.tsx           # Point d'entrée de l'application
│   ├── main.tsx          # Rendu React
│   └── index.css         # Styles globaux et tokens Tailwind
├── supabase/
│   └── config.toml       # Configuration du projet Supabase
├── .env                  # Variables d'environnement (auto-générées)
├── index.html            # Template HTML
├── package.json          # Dépendances et scripts
├── tailwind.config.ts    # Configuration Tailwind CSS
├── tsconfig.json         # Configuration TypeScript
├── vite.config.ts        # Configuration Vite
└── vitest.config.ts      # Configuration Vitest
```

---

## Technologies

- [Vite](https://vitejs.dev/) — Bundler et serveur de développement
- [React 18](https://react.dev/) — Bibliothèque UI
- [TypeScript](https://www.typescriptlang.org/) — Typage statique
- [Tailwind CSS](https://tailwindcss.com/) — Framework CSS utilitaire
- [shadcn/ui](https://ui.shadcn.com/) — Composants UI accessibles
- [Lovable Cloud](https://lovable.dev/) — Backend, base de données, auth
- [Vitest](https://vitest.dev/) — Tests unitaires
- [ESLint](https://eslint.org/) — Analyse statique du code

---

## Besoin d'aide ?

- Documentation Lovable : [https://docs.lovable.dev](https://docs.lovable.dev)
- Discord communautaire Lovable : lien dans les paramètres du projet
- Pour les problèmes liés au code source : ouvrir une **Issue** sur GitHub

---

> **Note sécurité** : Les clés API, secrets et variables sensibles sont stockés côté Lovable Cloud. Ne les commitez jamais dans le dépôt.
