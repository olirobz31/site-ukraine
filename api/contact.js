import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Ajouter les headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Gérer les requêtes OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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
        error: 'Échec de la vérification reCAPTCHA',
        score: recaptchaData.score
      });
    }

    // 2. Envoyer l'email avec Resend
    const emailData = await resend.emails.send({
      from: 'Site Ukraine <onboarding@resend.dev>',
      to: [process.env.CONTACT_EMAIL],
      subject: `Nouveau message de ${name}`,
      html: `
        <h2>Nouveau message depuis le site Ukraine</h2>
        <p><strong>Nom:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><small>Score reCAPTCHA: ${recaptchaData.score}</small></p>
      `
    });

    // 3. TODO: Stocker en base de données (on ajoutera ça après si tu veux)

    // Réponse de succès
    return res.status(200).json({ 
      success: true, 
      message: 'Message envoyé avec succès!',
      emailId: emailData.id
    });

  } catch (error) {
    console.error('Erreur:', error);
    return res.status(500).json({ 
      error: 'Erreur serveur', 
      details: error.message 
    });
  }
}