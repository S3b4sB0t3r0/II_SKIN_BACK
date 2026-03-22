const express = require('express');
const router = express.Router();
const { submitContactForm, getContacts, replyContact } = require('../controllers/contactController');

router.post('/contacto', submitContactForm);
router.get('/contact', getContacts);
router.post('/contacto/responder/:id', replyContact); 

module.exports = router;
