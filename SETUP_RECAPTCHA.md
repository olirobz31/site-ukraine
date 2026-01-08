# 🔐 Configuration du formulaire de contact

## Étape 1 : Obtenir les clés reCAPTCHA

1. Allez sur : https://www.google.com/recaptcha/admin/create

2. Remplissez le formulaire :
   - **Libellé** : Site Ukraine
   - **Type de reCAPTCHA** : Score-based (v3)
   - **Domaines** :
     ```
     site-ukraine.vercel.app
     localhost
     ```
   - Acceptez les conditions

3. Cliquez sur **Envoyer**

4. Vous obtiendrez 2 clés :
   - **Clé du site** (Site Key) - Clé publique
   - **Clé secrète** (Secret Key) - Clé privée

---

## Étape 2 : Mettre à jour la clé publique dans contact.html

**Fichier :** `contact.html` (ligne 9)

Remplacez :
```html
<script src="https://www.google.com/recaptcha/api.js?render=6LfVXZsqAAAAABnLKoN_lhJVe8cQxM9Qvl8T0O8g"></script>
```

Par :
```html
<script src="https://www.google.com/recaptcha/api.js?render=VOTRE_CLE_PUBLIQUE_ICI"></script>
```

**Et aussi à la ligne 134**, remplacez :
```javascript
const token = await grecaptcha.execute('6LfVXZsqAAAAABnLKoN_lhJVe8cQxM9Qvl8T0O8g', {action: 'submit'});
```

Par :
```javascript
const token = await grecaptcha.execute('VOTRE_CLE_PUBLIQUE_ICI', {action: 'submit'});
```

---

## Étape 3 : Mettre à jour les variables d'environnement sur Vercel

Ouvrez un terminal dans le dossier du projet et exécutez :

```bash
# Mettre à jour la clé secrète reCAPTCHA
vercel env rm RECAPTCHA_SECRET_KEY production
vercel env add RECAPTCHA_SECRET_KEY production
# Collez votre nouvelle clé secrète quand demandé

# Vérifier que l'email est configuré
vercel env ls
```

---

## Étape 4 : Redéployer le site

```bash
vercel --prod
```

---

## ✅ Test final

1. Allez sur : https://site-ukraine.vercel.app/contact.html
2. Remplissez le formulaire
3. Cliquez sur "Envoyer le message"
4. Vous devriez recevoir le message "✅ Message envoyé avec succès !"

---

## 🆘 En cas de problème

- Ouvrez la console du navigateur (F12) pour voir les erreurs
- Vérifiez que les domaines sont bien ajoutés dans reCAPTCHA
- Vérifiez que toutes les variables d'environnement sont définies : `vercel env ls`
