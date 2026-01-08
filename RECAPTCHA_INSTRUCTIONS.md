# Configuration de Google reCAPTCHA v3 + Bannière de Consentement RGPD

## Vue d'ensemble

Votre site dispose maintenant de :
- ✅ **Bannière de consentement aux cookies** conforme RGPD
- ✅ **Google reCAPTCHA v3** chargé uniquement après consentement
- ✅ **Politique de cookies** mise à jour
- ✅ **Politique de confidentialité** mise à jour

## Étapes de configuration

### 1. Obtenir les clés reCAPTCHA

1. Allez sur [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin/create)
2. Connectez-vous avec votre compte Google
3. Remplissez le formulaire :
   - **Label** : Ukraine Blog (ou le nom de votre choix)
   - **Type reCAPTCHA** : Sélectionnez **reCAPTCHA v3**
   - **Domaines** : Ajoutez votre nom de domaine (ex: `votre-domaine.com`)
     - Pour les tests en local, ajoutez aussi : `localhost`
   - Acceptez les conditions d'utilisation
4. Cliquez sur **Soumettre**

### 2. Récupérer vos clés

Après la création, vous obtiendrez deux clés :
- **Clé du site (Site Key)** : Clé publique à utiliser dans le HTML
- **Clé secrète (Secret Key)** : Clé privée pour la vérification côté serveur

### 3. Remplacer les clés dans le code

Remplacez **2 fois** `VOTRE_CLE_SITE_RECAPTCHA_V3` par votre **Clé du site** :

1. Dans `cookie-consent.js`, ligne 162 :
```javascript
script.src = 'https://www.google.com/recaptcha/api.js?render=VOTRE_VRAIE_CLE_SITE';
```

2. Dans le fichier `script.js`, ligne 52 :
```javascript
grecaptcha.execute('VOTRE_VRAIE_CLE_SITE', {action: 'submit_comment'})
```

### 4. Vérification côté serveur (IMPORTANT)

**Note importante** : Cusdis gère lui-même les commentaires. Si vous souhaitez que reCAPTCHA vérifie réellement les soumissions, vous devrez :

1. Configurer un backend (PHP, Node.js, Python, etc.)
2. Intercepter les soumissions de formulaire
3. Vérifier le token reCAPTCHA avec votre **Clé secrète**

Exemple de vérification en PHP :
```php
<?php
$secret = 'VOTRE_CLE_SECRETE';
$token = $_POST['g-recaptcha-response'];
$response = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret={$secret}&response={$token}");
$responseKeys = json_decode($response, true);

if($responseKeys["success"] && $responseKeys["score"] >= 0.5) {
    // Score acceptable, continuer
} else {
    // Bloquer la soumission
}
?>
```

### 5. Test de la bannière de consentement

1. Ouvrez votre site dans un navigateur en navigation privée
2. Vous devriez voir la **bannière de cookies** en bas de l'écran
3. Testez les différentes options :
   - **Tout accepter** : Charge reCAPTCHA immédiatement
   - **Refuser** : N'accepte que les cookies nécessaires, bloque reCAPTCHA
   - **Paramètres** : Ouvre le modal pour choisir individuellement

### 6. Test de reCAPTCHA

1. Acceptez les cookies (ou reCAPTCHA dans les paramètres)
2. Essayez de poster un commentaire
3. Vérifiez dans la console développeur (F12) qu'il n'y a pas d'erreurs
4. Vérifiez dans le [reCAPTCHA Admin Dashboard](https://www.google.com/recaptcha/admin) que les requêtes sont bien enregistrées

### 7. Ajustement du score (optionnel)

reCAPTCHA v3 donne un score entre 0.0 (bot) et 1.0 (humain).

- **Score ≥ 0.7** : Probablement humain
- **Score 0.3-0.7** : Zone grise
- **Score < 0.3** : Probablement bot

Vous pouvez ajuster le seuil selon vos besoins dans votre vérification serveur.

## Limitations actuelles

Comme Cusdis est un service externe, le CAPTCHA actuel :
- ✅ Génère un token reCAPTCHA valide
- ✅ L'ajoute à la soumission du formulaire
- ❌ Ne vérifie PAS le token côté serveur (nécessite un backend personnalisé)

Pour une protection complète, vous devriez soit :
1. Migrer vers un système de commentaires personnalisé
2. Utiliser un proxy/middleware pour vérifier les tokens avant de les envoyer à Cusdis
3. Contacter Cusdis pour savoir s'ils supportent reCAPTCHA nativement

## Fichiers créés et modifiés

### Nouveaux fichiers
- `cookie-consent.css` - Styles de la bannière de consentement
- `cookie-consent.js` - Logique de gestion du consentement RGPD

### Fichiers modifiés
- `index.html` - Ajout de la bannière et du modal de paramètres
- `trident.html` - Ajout de la bannière et du modal de paramètres
- `script.js` - Chargement conditionnel de reCAPTCHA
- `confidentialite.html` - Mention de reCAPTCHA
- `cookies.html` - Mention de reCAPTCHA

## Comment ça fonctionne

1. **Première visite** : La bannière de cookies s'affiche automatiquement
2. **Choix de l'utilisateur** :
   - **Tout accepter** : reCAPTCHA est chargé immédiatement
   - **Refuser** : Seuls les cookies essentiels sont acceptés
   - **Paramètres** : Choix granulaire
3. **Persistance** : Le choix est sauvegardé dans un cookie pendant 365 jours
4. **Conformité RGPD** : reCAPTCHA ne se charge que si l'utilisateur l'accepte

## Ressources

- [Documentation Google reCAPTCHA](https://developers.google.com/recaptcha/docs/v3)
- [Console d'administration](https://www.google.com/recaptcha/admin)
- [FAQ reCAPTCHA](https://developers.google.com/recaptcha/docs/faq)
- [RGPD - CNIL](https://www.cnil.fr/fr/rgpd-de-quoi-parle-t-on)
