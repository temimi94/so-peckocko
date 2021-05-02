//plugin Npm Node.js
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Modèle des utilisateurs
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

//ajouter plugin pour vérifier que deux utilisateurs ne peuvent pas partager la même adresse e-mail.
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);