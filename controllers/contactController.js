const Contact = require('../models/Contact');
const { sendContactNotification, sendReplyToContact } = require('../services/ServiceEmail');

// ─── Validar formato de correo ────────────────────────────────
const isValidEmail = (email) => {
  return /^[\w.-]+@[\w.-]+\.\w+$/.test(email);
};

// ─────────────────────────────────────────────────────────────
// POST /api/contacto  — Guardar formulario de contacto
// ─────────────────────────────────────────────────────────────
exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, message, company, phone, projectType } = req.body;

    // Validaciones
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Nombre, email y mensaje son obligatorios.' });
    }
    if (typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'El nombre debe tener al menos 2 caracteres.' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Correo electrónico inválido.' });
    }
    if (typeof message !== 'string' || message.trim().length < 10) {
      return res.status(400).json({ error: 'El mensaje debe tener al menos 10 caracteres.' });
    }
    if (message.length > 1000) {
      return res.status(400).json({ error: 'El mensaje no puede superar los 1000 caracteres.' });
    }

    // Guardar en BD
    const contact = new Contact({
      name:        name.trim(),
      email:       email.trim(),
      message:     message.trim(),
      company:     company?.trim()     || '',
      phone:       phone?.trim()       || '',
      projectType: projectType         || '',
    });

    await contact.save();

    // Notificar al admin (y confirmación al remitente)
    await sendContactNotification(contact);

    res.status(201).json({ message: 'Formulario enviado correctamente' });

  } catch (error) {
    console.error('Error en submitContactForm:', error);
    res.status(500).json({ error: 'Error al enviar el formulario' });
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/contact  — Obtener todos los contactos (dashboard)
// ─────────────────────────────────────────────────────────────
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }); // más recientes primero
    res.status(200).json(contacts);
  } catch (error) {
    console.error('Error al obtener contactos:', error);
    res.status(500).json({ error: 'Error al obtener contactos' });
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/contacto/responder/:id  — Responder a un contacto
// ─────────────────────────────────────────────────────────────
exports.replyContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { replyMessage } = req.body;

    // Validar respuesta
    if (!replyMessage || typeof replyMessage !== 'string' || replyMessage.trim().length < 5) {
      return res.status(400).json({ error: 'La respuesta debe tener al menos 5 caracteres.' });
    }

    // Buscar contacto
    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ error: 'Contacto no encontrado.' });
    }

    // Actualizar estado en BD
    contact.replied      = true;
    contact.replyMessage = replyMessage.trim();
    contact.repliedAt    = new Date();
    await contact.save();

    // Enviar correo de respuesta al cliente con branding II SKIN SAS
    await sendReplyToContact(contact, replyMessage.trim());

    res.status(200).json({ message: 'Respuesta enviada correctamente', contact });

  } catch (error) {
    console.error('Error en replyContact:', error);

    // Si ya se guardó en BD pero falló el correo, avisamos sin romper el flujo
    if (error.message?.includes('nodemailer') || error.code === 'EAUTH') {
      return res.status(500).json({
        error: 'La respuesta se guardó pero no se pudo enviar el correo. Revisa la config de email.',
      });
    }

    res.status(500).json({ error: 'Error al responder el contacto' });
  }
};