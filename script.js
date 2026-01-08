function openLightbox(src) {
  document.getElementById("lightbox-img").src = src;
  document.getElementById("lightbox").style.display = "block";
}

function closeLightbox() {
  document.getElementById("lightbox").style.display = "none";
}

// Protection reCAPTCHA v3 pour les commentaires
document.addEventListener('DOMContentLoaded', function() {
  // Fonction pour vérifier si le consentement reCAPTCHA a été donné
  function hasRecaptchaConsent() {
    const cookieName = 'ukraine_cookie_consent';
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith(cookieName + '='));

    if (cookieValue) {
      try {
        const consent = JSON.parse(decodeURIComponent(cookieValue.split('=')[1]));
        return consent.recaptcha === true;
      } catch (e) {
        return false;
      }
    }
    return false;
  }

  // Surveiller les soumissions du formulaire Cusdis
  const cusdisObserver = new MutationObserver(function(mutations) {
    const submitButton = document.querySelector('#cusdis_thread button[type="submit"]');
    if (submitButton && !submitButton.dataset.captchaProtected) {
      submitButton.dataset.captchaProtected = 'true';

      submitButton.addEventListener('click', function(e) {
        // Vérifier si l'utilisateur a accepté reCAPTCHA
        if (!hasRecaptchaConsent()) {
          // Si pas de consentement, soumettre sans reCAPTCHA
          return;
        }

        // Vérifier si reCAPTCHA est chargé
        if (typeof grecaptcha === 'undefined') {
          // Si reCAPTCHA n'est pas encore chargé, soumettre sans protection
          return;
        }

        e.preventDefault();

        grecaptcha.ready(function() {
          grecaptcha.execute('6LcpU0QsAAAAAB_tr0Smd1MKI17eGr58DyuCs7uY', {action: 'submit_comment'}).then(function(token) {
            // Ajouter le token au formulaire
            let tokenInput = document.querySelector('input[name="g-recaptcha-response"]');
            if (!tokenInput) {
              tokenInput = document.createElement('input');
              tokenInput.type = 'hidden';
              tokenInput.name = 'g-recaptcha-response';
              submitButton.closest('form').appendChild(tokenInput);
            }
            tokenInput.value = token;

            // Soumettre le formulaire
            submitButton.click();
          });
        });
      }, true);
    }
  });

  // Observer le conteneur Cusdis
  const cusdisContainer = document.getElementById('cusdis_thread');
  if (cusdisContainer) {
    cusdisObserver.observe(cusdisContainer, {
      childList: true,
      subtree: true
    });
  }
});
