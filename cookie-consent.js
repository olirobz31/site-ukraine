/**
 * Système de gestion du consentement aux cookies - Conforme RGPD
 * Gère le consentement pour Google reCAPTCHA
 */

const CookieConsent = {
    // Configuration
    cookieName: 'ukraine_cookie_consent',
    cookieExpireDays: 365,

    // État du consentement
    consent: {
        necessary: true,  // Toujours activé
        analytics: false,
        recaptcha: false
    },

    /**
     * Initialise le système de consentement
     */
    init: function() {
        // Charger le consentement existant
        this.loadConsent();

        // Si pas de consentement enregistré, afficher la bannière
        if (!this.hasConsent()) {
            this.showBanner();
        } else {
            // Si consentement existant, charger reCAPTCHA si accepté
            if (this.consent.recaptcha) {
                this.loadRecaptcha();
            }
        }

        // Attacher les événements
        this.attachEvents();
    },

    /**
     * Vérifie si l'utilisateur a déjà donné son consentement
     */
    hasConsent: function() {
        return document.cookie.includes(this.cookieName + '=');
    },

    /**
     * Charge le consentement depuis le cookie
     */
    loadConsent: function() {
        const cookieValue = this.getCookie(this.cookieName);
        if (cookieValue) {
            try {
                this.consent = JSON.parse(decodeURIComponent(cookieValue));
            } catch (e) {
                console.error('Erreur de lecture du consentement:', e);
            }
        }
    },

    /**
     * Sauvegarde le consentement dans un cookie
     */
    saveConsent: function() {
        const consentString = encodeURIComponent(JSON.stringify(this.consent));
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + this.cookieExpireDays);

        document.cookie = this.cookieName + '=' + consentString +
            '; expires=' + expiryDate.toUTCString() +
            '; path=/; SameSite=Lax';
    },

    /**
     * Récupère un cookie par son nom
     */
    getCookie: function(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },

    /**
     * Affiche la bannière de consentement
     */
    showBanner: function() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.classList.add('show');
        }
    },

    /**
     * Cache la bannière de consentement
     */
    hideBanner: function() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.classList.remove('show');
        }
    },

    /**
     * Affiche le modal de paramètres
     */
    showSettings: function() {
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
            modal.classList.add('show');
            // Mettre à jour les toggles avec l'état actuel
            document.getElementById('toggle-recaptcha').checked = this.consent.recaptcha;
        }
    },

    /**
     * Cache le modal de paramètres
     */
    hideSettings: function() {
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
            modal.classList.remove('show');
        }
    },

    /**
     * Accepte tous les cookies
     */
    acceptAll: function() {
        this.consent.necessary = true;
        this.consent.recaptcha = true;
        this.saveConsent();
        this.hideBanner();
        this.loadRecaptcha();
    },

    /**
     * Refuse les cookies non nécessaires
     */
    declineAll: function() {
        this.consent.necessary = true;
        this.consent.recaptcha = false;
        this.saveConsent();
        this.hideBanner();
    },

    /**
     * Sauvegarde les préférences personnalisées
     */
    savePreferences: function() {
        this.consent.necessary = true;
        this.consent.recaptcha = document.getElementById('toggle-recaptcha').checked;
        this.saveConsent();
        this.hideSettings();
        this.hideBanner();

        if (this.consent.recaptcha) {
            this.loadRecaptcha();
        }
    },

    /**
     * Charge le script reCAPTCHA
     */
    loadRecaptcha: function() {
        // Vérifier si reCAPTCHA n'est pas déjà chargé
        if (window.grecaptcha || document.querySelector('script[src*="recaptcha"]')) {
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://www.google.com/recaptcha/api.js?render=6LcpU0QsAAAAAB_tr0Smd1MKI17eGr58DyuCs7uY';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
    },

    /**
     * Attache les événements aux boutons
     */
    attachEvents: function() {
        const self = this;

        // Bouton accepter tout
        const acceptBtn = document.getElementById('cookie-accept-all');
        if (acceptBtn) {
            acceptBtn.addEventListener('click', function() {
                self.acceptAll();
            });
        }

        // Bouton refuser
        const declineBtn = document.getElementById('cookie-decline');
        if (declineBtn) {
            declineBtn.addEventListener('click', function() {
                self.declineAll();
            });
        }

        // Bouton paramètres
        const settingsBtn = document.getElementById('cookie-settings');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', function() {
                self.showSettings();
            });
        }

        // Bouton sauvegarder les préférences
        const saveBtn = document.getElementById('cookie-save-preferences');
        if (saveBtn) {
            saveBtn.addEventListener('click', function() {
                self.savePreferences();
            });
        }

        // Bouton fermer le modal
        const closeBtn = document.getElementById('cookie-close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                self.hideSettings();
            });
        }

        // Fermer le modal en cliquant à l'extérieur
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    self.hideSettings();
                }
            });
        }
    }
};

// Initialiser au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    CookieConsent.init();
});
