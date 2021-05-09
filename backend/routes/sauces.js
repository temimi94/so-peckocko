//plugin Npm Node.js
const express = require('express');
const router = express.Router();

// Controleurs des routes sauces
const saucesCtrl = require('../controllers/sauces');

// Middlewares avec auth pour sécuriser les connexions et Multher pour la gestion des images
const auth = require('../middelwear/auth'); //vérifier que l'utilisateur es authentifié, avant d'authoriser l'envoie
const multer = require('../middelwear/multer');

//les routes
router.get('/', auth, saucesCtrl.getAllSauces);
router.get('/:id', auth, saucesCtrl.getOneSauces);
router.post('/', auth, multer,  saucesCtrl.createSauces);
router.put('/:id', auth, multer, saucesCtrl.updateSauces); 
router.delete('/:id', auth, saucesCtrl.deleteSauces);
router.post('/:id/like', auth, saucesCtrl.likeSauce);

module.exports = router;