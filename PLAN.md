# Budget Meney — plan de travail

> Document vivant. Mis à jour à chaque décision, chaque livraison, chaque nouvelle idée.
> Dernière mise à jour : 18/07/2026 — v21 livrée (chaîne ticket opérationnelle).

---

## 1. Ce qu'est l'app

PWA monofichier, sans build, hébergée sur GitHub Pages.

| Élément | Valeur |
|---|---|
| Dépôt | `siteflow-io/bm-app` (branche `main`) |
| URL | https://siteflow-io.github.io/bm-app/ |
| Fichiers | `index.html` (tout l'app), `sw.js` (service worker **unique** : cache + partage + push), `manifest.json`, icônes |
| Firebase | projet `budget-meney`, Realtime DB `europe-west1`, nœud racine `/budget` |
| Comptes autorisés | polomeney@gmail.com (Paul), collignonclaire@hotmail.fr (Claire) |
| Serveur | Apps Script « budget-notifs » sur le compte polomeney (notifications + email du samedi) |
| Onglets | Diagnostic · Mois · Optim · Envies · Simu · Comptes · Règles |

**Règle d'or technique** : un seul service worker par scope. Séparer cache et notifications a cassé
les push pendant des semaines (bug résolu en v18).

---

## 2. Règles de travail (non négociables)

1. **Règle de preuve.** Toute affirmation dans un label exige une source : recherche internet aboutie
   et citée, déclaration de l'utilisateur, recoupement interne démonstratif, ou notoriété nationale
   évidente. Sans preuve : catégorie descriptive seule, ou question. Jamais d'invention.
   Les hypothèses vont au commentaire, avec leur degré de confiance.
2. **Méthode d'enquête, dans cet ordre.** (1) Recouper avec les opérations voisines (±10 j) et lire le
   libellé COMPLET. (2) Chercher sur internet, orienté par ce contexte. (3) Ce qui résiste devient une
   question à l'utilisateur.
   Corollaire : les **commerces** se cherchent en ligne ; les **virements à des particuliers** ne s'y
   trouvent jamais → question directe.
3. **Toute décision de contenu passe par la conversation** avant d'exister dans un fichier.
   Labels, arbitrages, montants, dégradations : on en parle, puis on code.
4. **L'app ne ment pas.** Le signe prime sur la catégorie. Les panneaux doivent concorder au centime.
   Une incohérence de calibrage doit être dénoncée par l'app elle-même.
5. **Constater, jamais juger.** Vaut pour les Souvenirs comme pour les tickets de caisse.
   « 16 € de bière ce mois, 11 € le mois dernier » est un fait. Une remontrance n'en est pas un.
6. **R/A** = réponse concise, puis attendre.
7. Avant livraison : `node --check`, tests sur données réelles, cohérence des ⓘ, `APP_VERSION` incrémenté,
   entrée DEVLOG. Après livraison : rappeler la dette.

---

## 3. État des lieux financier (établi le 18/07/2026)

| Donnée | Valeur | Source |
|---|---|---|
| Salaires nets (2 pers.) | 4 633 €/mois | DRFIP, libellé `REMUNERATION DU MM/AAAA` |
| Revenus courants totaux | ~5 100 €/mois | + CAF, CPAM, prévoyance |
| Cible de dépenses | 4 400 €/mois | confirmée par Paul (tenue avant le don) |
| Épargne cible | 900 €/mois | |
| Livret A « Épargne Madeleine » | 22 959 € — **au plafond** (22 950 €) | plus aucun versement possible |
| dont indemnité sinistre | 22 800 € virés le 26/11/2025 | **argent engagé**, pas disponible |
| Épargne réellement libre | ~8 200 € | |
| Compte joint | **−762 €** | plus alimenté depuis octobre 2025 |
| Charges du joint | 3 437 €/mois (dont 1 011 € crédit + prêt) | 2 745 € hors travaux |

**Événements structurants** : don de 60 000 € (30/05/2025) et indemnité sinistre de 24 948 €
(13/10/2025) — ils gonflent les moyennes des 12 derniers mois et faussent tout calibrage
fait sur cette période. Calibrer sur le **régime courant**.

**Sinistre** : phase 1 en septembre (100 % assurance) · phase 2 dans 2-3 ans après période
d'observation, avec ~3 000 € de vétusté à charge — couverte par les 22 959 € du livret.

**Chauffage** : chaudière à granulés, ~3 000 €/an, payé en une fois entre avril et août
(Anjou Bois Énergie : 2 507 € en 2025, dont 1 844 € financés par un retrait du Livret A —
exactement ce que la provision doit empêcher). **Rien payé en 2026 : la livraison arrive.**

---

## 4. Dette — terrain (Paul)

- [ ] Importer `budget-retour-2.json` (34 règles) — *fait le 18/07 ?*
- [ ] Importer le CSV **PayPal** (153 opérations, 13 446 € opaques) et le CSV **Amazon** (162 commandes)
- [ ] Nommer les **43 chèques** restants au talon (dont `paul_64`, 250 € du 04/04/2025)
- [ ] Recoller `code.gs` dans Apps Script
- [ ] Valider les notifications : `debugPush` → la notification doit **apparaître** sur les deux téléphones
- [ ] **LDDS de Claire** (celui de Paul créé le 18/07, virement permanent 300 € depuis son compte perso)
- [ ] Ajouter les deux LDDS dans l'app (bouton « + Ajouter un compte », onglet Comptes)
- [ ] **Vérifier le motif du virement** dans le premier CSV du LDDS (`CHAUFFAGE` / `EPARGNE`)
- [ ] **Alimenter le compte joint** : 1 400 € chacun le 28 du mois + 400 € chacun tout de suite
- [ ] Claire : tuto, répartition CESU (180 € / 134 €), accord pour l'alerte grosse dépense
- [ ] Vérifier au nom de qui est le livret « Épargne Madeleine »

---

## 5. Dette — code (Claude)

### Décidé, pas encore écrit
- **Argent réservé vs disponible.** L'app affiche 31 157 € d'épargne alors que 22 959 € sont engagés.
  Réserves nommées, écrites par l'utilisateur, déduites de l'épargne libre (trajectoire, paliers).
- **Alerte de solde prévisionnel.** Projeter chaque compte à 30 jours avec les prélèvements connus
  (crédit le 5, assurances, abonnements) → « le Commun sera à −300 € le 5 août ».
- **Suivi des salaires.** DRFIP par personne, mois de rémunération lu dans le libellé, écarts et variations.
- **Notification à chaque nouvelle version** (auto-test permanent de la chaîne push).
- **Reclasser une opération seule**, sans créer de règle (indispensable pour les pleins en supermarché).
- **Trois corrections de règles** : `ELECLERC CARBURANTS` → Carburant · `HYPER U STATIO` → Carburant ·
  `STATIONNT HORO` → Péages (ce sont des horodateurs).
- **Recalibrage des enveloppes** (voir §6).
- Décaler le point du samedi vers 9-10 h + TTL sur le message FCM.

### Réglages à l'usage
- Seuil des dépenses exceptionnelles (250 €)
- Goulot de l'import manuel : réévaluer à 2-3 mois (statu quo / agrégateur DSP2 / Woob)

---

## 6. Calibrage des enveloppes — à faire ensemble

**Invariant** : `somme(enveloppes) + fixes de référence = cible`. Aujourd'hui 2 420 + 2 450 = **4 870**
pour une cible de 4 400 → **écart de +470 €**, signalé par l'app.

**Principes retenus** :
- Chaque catégorie de dépense doit avoir une enveloppe (Vacances, Péages, Véhicule n'en ont pas).
- **Postes subis** (Santé, Fixes, Cantine, Péages, Véhicule, Chauffage) : calibrés au **réel observé**.
  Une enveloppe irréaliste ne fait économiser aucun euro, elle ajoute du bruit rouge.
- **Postes pilotables** (Courses, Extras, Vacances) : objectifs exigeants mais atteignables.
  L'effort porte sur eux — mais pas uniquement sur les Extras : les courses ont augmenté aussi.
- Le chauffage est une **dépense différée**, pas de l'épargne → il vit **dans** la cible de 4 400.

**Enveloppes actuelles** : courses 1 000 · carburant 220 · santé 150 · travaux 200 · abonnements 80 ·
cantine 170 · chauffage 300 · extras 300.

**Moyennes réelles constatées** (affichées par l'app) : Santé **497 €/mois** · Travaux **945 €/mois**.
→ à compléter avec les autres postes, puis répartir 4 400 − 2 450 = **1 950 €** entre toutes les enveloppes.

---

## 7. Chantiers validés (non ouverts)

### A. Tickets et paniers — « reprendre le contrôle du ticket »
Motivation : le ticket a été abandonné par la modernité ; on paie sans regarder et la dépense devient
un chiffre abstrait. Le reprendre, c'est savoir ce qu'on achète, pas seulement ce qu'on paie.
Horizon : hygiène de vie, dont le financier fait partie.

**A1. Drive Intermarché par email — le cas nominal, zéro geste.**
L'email de confirmation contient tout : n° de commande, magasin, date de retrait, 64 lignes avec
nom complet, quantité (unités ou poids), prix unitaire et total, remise, total à payer.
Apps Script (qui tourne déjà chaque heure) lit Gmail, parse, écrit dans Firebase.
*Démontré sur la commande du 17/06/2026 : 268,89 € → débit bancaire de 266,90 € le 18/06 (écart 1,99 €,
produit manquant). Appariement : même enseigne, ±3 jours, ±3 %.*
Les marques distributeur donnent le rayon gratuitement : « Le Choix du Primeur » = fruits et légumes,
« Pâturages » = crémerie, « Le Choix du Charcutier » = boucherie, « Le Choix du Fromager » = fromage.
*Ventilation obtenue : Épicerie 63,63 · Fruits et légumes 59,06 · Crémerie 50,67 · Viande 26,32 ·
Grignotage 25,07 · Alcool 16,52 · Boissons 15,29 · Hygiène 8,43 · Entretien 6,56.*
**Levier** : Gmail garde tout → tout l'historique des commandes peut être ventilé rétroactivement.

**A2. Tickets physiques par OCR** (courses « pour flâner », carburant).
Outil : **Google Lens** (présent sur les deux Honor). Vérifié le 18/07 : la barre propose
**Copier · Écouter · Traduire · ⋮** — pas de « Partager » visible.
→ **Chemin retenu : le presse-papier.** Lens → Sélectionner du texte → Copier, puis bouton
**« Coller le ticket »** dans l'app (`navigator.clipboard.readText()`). Trois tapes, aucune dépendance
à un menu qui varie selon les versions d'Android.
→ **En parallèle** : `share_target` étendu au **texte** — si « Partager » existe dans le menu ⋮, une tape
de moins. Les deux chemins mènent au même parseur.
**LIVRÉ en v21** : bouton « Coller un ticket » (onglet Comptes), réception du texte partagé, extracteur
générique (enseigne, date, total, lignes, ventilation par rayon), mode carburant séparé (litres, prix au
litre, contrôle litres × prix = total), rattachement proposé à l'opération bancaire (±4 j, ±5 %),
texte brut toujours conservé.
*Testé* : ticket de courses → 8 lignes ventilées, somme = total ✓ · ticket de plein → 78,42 L × 1,729 =
135,59 € = total ✓.
**Reste à faire** : affiner le décodage sur de VRAIS tickets (Paul doit en capturer deux ou trois),
enrichir le dictionnaire de rayons, afficher le ticket dans la fiche de l'opération rattachée.
*Limite connue* : Lens rend le texte dans l'ordre de lecture, libellé puis prix en alternance, avec des
colonnes parfois fusionnées. Parsable, mais moins net que le mail du drive → traiter le drive d'abord.
Le ticket de **carburant** est un cas distinct et simple : litres, prix au litre, total → permet en prime
le suivi de consommation du T4 (80 L, gazole) et le coût kilométrique.

**A3. Ventilation d'un paiement en plusieurs catégories.**
Prérequis caché derrière tout ça : aujourd'hui une opération n'a qu'une seule catégorie. Un passage à
146 € contenant 80 € de gazole et 66 € de courses doit pouvoir devenir deux lignes.

### B. Souvenirs — moteur narratif déterministe
Quatre familles : habitude + dernier passage + alternative chiffrée (piochée dans les Envies non cochées) ·
« il y a un an » · records et séries · réussites cumulées.
Placement : carte « Souvenir du jour » dans Diagnostic, mini-souvenirs dans les fiches, et **un souvenir
dans l'email du samedi** (pas dans la notification quotidienne).
**Loi de preuve** : chaque phrase cite des transactions vérifiables (date, montant, compteur réels) ;
un tap ouvre les opérations qui la fondent. Aucune phrase illustrative possible par construction.
Les CSV n'ont pas l'heure → « vendredi dernier », jamais « à 17h32 ».

### C. Vue par enseigne
Cliquer « Action » et voir 1 606 € et tous les passages. Grouper par **qui reçoit l'argent**, pas par
catégorie comptable. À cadrer : clé d'agrégation (label affiché ou racine d'enseigne), profondeur
d'historique (12 mois glissants ou tout).

### D. Poste Enfants — étiquette transversale
Différent d'une catégorie : une opération garde sa catégorie (la cantine reste cantine) **et** compte
dans « Enfants ». Objectif : savoir ce que coûtent les enfants, tous sujets confondus.
Volet second : épargner pour eux (réserves nommées à leur nom).

### E. Achats fractionnés
Deux faces : **rétrospective** (regrouper plusieurs débits d'un même achat — la voiture : acompte
1 000 € le 18/02 + 5 990 € + 5 000 € + 50 € de frais le 03/03 = 12 040 €) et **prospective**
(anticiper les échéances à venir d'un paiement en N fois — PayPal 4×, **étalé sur des mois**, à projeter
sur chaque mois d'échéance).
**Difficulté centrale** : distinguer un N× **borné** d'un **abonnement** non borné. Indices : libellé PayPal
(« 2 sur 4 » ?) et comptage d'occurrences. Ne jamais présumer qu'un récurrent est borné — ça fausserait
la projection en notre faveur. **À concevoir quand la 2ᵉ échéance apparaîtra dans un import.**

### F. Le temps
Calendrier interactif (jour passé → opérations ; jour futur → dépense prévue à trois niveaux :
nominale sans montant / estimée → réponse en texte « possible, mais ça te fera N jours pour revenir
au niveau » / réalisée = effacement au rapprochement). Prélèvements annuels anticipés. Séries et records.

### G. Objectifs nommés et datés
« Travaux fissures : 25 000 € pour septembre 2029 » dans la trajectoire, avance ou retard chiffré.
Récurrents qui augmentent (inflation des abonnements). Email du samedi enrichi.
Rétrospective annuelle en janvier.

### H. Alerte grosse dépense croisée
Prévenir l'autre conjoint au-delà d'un seuil. **Nécessite l'accord explicite de Claire.**

---

## 8. Échéances à surveiller

| Échéance | Quand | Pourquoi |
|---|---|---|
| Livraison de granulés 2026 | avril–août, imminente | ~2 600 € à sortir, rien versé cette année |
| Saturation des LDDS | fin 2027 – mi 2028 | 24 000 € à deux, Livret A déjà plein. Critère du support suivant : **export CSV obligatoire** |
| Phase 2 du sinistre | dans 2–3 ans | vétusté ~3 000 € — couverte par le livret, à ne pas entamer |

---

## 9. Journal des décisions

| Date | Décision |
|---|---|
| 17/07 | Règle de preuve non négociable, gravée dans le prompt d'analyse |
| 17/07 | Méthode recouper → chercher → demander |
| 17/07 | Toute décision de contenu passe par la conversation |
| 18/07 | Le signe prime sur la catégorie (v16) — un débit est une dépense, toujours |
| 18/07 | Famille « Remboursements » séparée des vrais revenus |
| 18/07 | Le chauffage est une dépense différée : enveloppe **dans** la cible, pas de l'épargne |
| 18/07 | Report d'enveloppe explicite, jamais automatique |
| 18/07 | Le CSV fait foi : pas de détection de « zones grises » par écart entre opérations |
| 18/07 | Enveloppes : postes subis au réel, effort sur les pilotables, somme = cible |
| 18/07 | Drive par email plutôt que photo : zéro geste, texte propre |
| 18/07 | OCR natif du téléphone plutôt qu'OCR embarqué |
| 18/07 | Google Lens n'offre que « Copier » → chemin presse-papier retenu, partage de texte en bonus |
| 18/07 | Chaîne ticket construite en deux temps : capture d'abord (v21), parseur fin ensuite sur échantillons réels |
