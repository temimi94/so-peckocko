//plugin Npm Node.js
const mongoose = require('mongoose');

// Modèle des sauces avec le type de données
const sauceSchema = mongoose.Schema({
    id: {type: String, require: true},
    name: {type: String, required: true, maxLength: 20},
    manufacturer: {type: String, required: true, maxLength: 20},
    description: {type: String, required: true, minLength: 10},
    heat: {type: Number, required: true},
    likes: {type: Number, required: false},
    dislikes: {type: Number, required: false},
    imageUrl: {type: String, required: true},
    mainPepper: {type: String, required: true},
    usersLiked: {type: [String], required: false},
    usersDisliked: {type:[String], required: false},
    userId: {type: String, required: true}
});


module.exports = mongoose.model('sauce', sauceSchema);