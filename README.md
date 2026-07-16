# Budget Meney v2 — mise en place

## 1. Projet Firebase (compte polomeney@gmail.com, PAS monsieurmeney)
1. https://console.firebase.google.com → Ajouter un projet → nom : `budget-meney` (Analytics : non).
2. Build → **Realtime Database** → Créer → zone `europe-west1` → mode **verrouillé**.
3. Build → **Authentication** → Commencer → activer **E-mail/Mot de passe**.
4. Authentication → Users → **Ajouter** deux utilisateurs : ton email + celui de Claire, avec mot de passe.
5. Realtime Database → **Règles** → coller (remplacer les deux emails) :
```json
{
  "rules": {
    "budget": {
      ".read": "auth != null && (auth.token.email === 'polomeney@gmail.com' || auth.token.email === 'EMAIL_CLAIRE')",
      ".write": "auth != null && (auth.token.email === 'polomeney@gmail.com' || auth.token.email === 'EMAIL_CLAIRE')"
    }
  }
}
```
6. Paramètres du projet (roue dentée) → Vos applications → icône **Web** `</>` → enregistrer l'app → copier la config.
7. Dans `index.html`, remplir `FIREBASE_CONFIG` avec `apiKey`, `authDomain`, `databaseURL`, `projectId`.
   ⚠️ `databaseURL` : visible dans l'onglet Realtime Database (forme `https://budget-meney-default-rtdb.europe-west1.firebasedatabase.app`). Si absent de la config copiée, l'ajouter à la main.

## 2. Déploiement (GitHub Pages — indispensable, PWA exige HTTPS)
Dépôt **séparé et privé impossible avec Pages gratuit → utiliser un dépôt public au nom neutre** (ex. `bm-app`) : aucune donnée n'y transite (tout est dans Firebase), seul le code y est.
1. Nouveau dépôt → y pousser `index.html`, `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png`.
2. Settings → Pages → Deploy from branch → main → racine.
3. Firebase → Authentication → Settings → **Domaines autorisés** → ajouter `<compte>.github.io`.

## 3. Installation sur les téléphones
- **Android (Paul)** : ouvrir l'URL dans Chrome → menu ⋮ → « Ajouter à l'écran d'accueil » / « Installer l'application ».
- **iPhone (si Claire)** : Safari → Partager → « Sur l'écran d'accueil ».
- Se connecter une fois ; la session persiste.

## 4. Premier lancement
1. Connexion → écran **Soldes de départ** : saisir les 4 soldes du jour (source de vérité de toutes les projections — les prendre dans l'espace CE le jour même).
2. Onglet **Import** → mode Auto → sélectionner les 4 CSV d'un coup (l'app reconnaît chaque compte par son numéro dans le nom du fichier). Importer 3 mois d'historique minimum pour des projections fiables.
3. Rythme de croisière : **un import par semaine** (les 3-4 CSV, 2 minutes). L'app harcèle au-delà de 7 jours.

## Sans Firebase (test rapide)
Config vide = mode local (bandeau orange « non partagé ») : tout fonctionne dans le navigateur, rien n'est synchronisé. Pour tester avant de créer le projet.

## Phase 2 (à la demande, quand la v1 tourne)
Notifications push (FCM) + email quotidien via Apps Script : projection du jour envoyée chaque matin sur vos deux téléphones.
