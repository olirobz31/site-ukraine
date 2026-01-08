export default async function handler(req, res) {
  // Autoriser uniquement les requêtes POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const { name, email, message, recaptchaToken } = req.body;

    // 1. Vérifier le reCAPTCHA avec Google
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    const recaptchaResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${recaptchaSecret}&response=${recaptchaToken}`
      }
    );

    const recaptchaData = await recaptchaResponse.json();

    // Vérifier si le score est suffisant (>0.5 = humain probable)
    if (!recaptchaData.success || recaptchaData.score < 0.5) {
      return res.status(400).json({ 
        error: 'Échec de la vérification reCAPTCHA' 
      });
    }

    // 2. TODO: Envoyer l'email (on ajoutera ça après)
    
    // 3. TODO: Stocker en base de données (on ajoutera ça après)

    // Réponse de succès
    return res.status(200).json({ 
      success: true, 
      message: 'Message envoyé avec succès!' 
    });

  } catch (error) {
    console.error('Erreur:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}