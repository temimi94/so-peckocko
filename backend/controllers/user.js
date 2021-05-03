 // Plugin Npm Node.js (avec bcryp pour hasher le mdp, jwt pour le token d'authentification et Crypto afin de chiffrer l'email)
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Import du modèle User
const User = require('../models/User');

// Création d'un nouvel utilisateur
exports.signup = (req, res, next) => {
  //Hashage du mot de passe par Bcrypt
  bcrypt.hash(req.body.password, 10)
      .then(
        hash => {
          // Chiffrement de l'email 
          key = "motDePasseInviolable:)";
          cipher = crypto.createCipher('aes192', key)
          cipher.update(req.body.email, 'binary', 'hex')
          encodedString = cipher.final('hex') 
          // Enregistrement des données de l'utilisateur
          const user = new User({
              email: encodedString,
              password: hash
            });
            // Verification des enregistrements cryptés
            console.log("Voici l'email encrypté : ", encodedString);
            console.log("Voici le mot de passe hashé : ", hash); 
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
    };

  // Récupération d'un utilisateur déja existant dans la base de donnée
  exports.login = (req, res, next) => {
      // Chiffrement de l'émail afin de le comparer avec la base de donnée
      key = "motDePasseInviolable:)";
      cipher = crypto.createCipher('aes192', key)
      cipher.update(req.body.email, 'binary', 'hex')
      encodedString = cipher.final('hex')
      console.log("Voici le FindOne = ", encodedString) 
    // Nous allons comparer l'émail chiffré avec celui de la base de donnée
    User.findOne({ email: encodedString })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        // Bcrypt compare ici le hashage du mot de passe
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                // Attribution du token d'authentification qui durera 24h
                { userId: user._id },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };