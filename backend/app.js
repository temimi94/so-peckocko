const express = require('express');
//facilite l'intéraction avec la BD
const mongoose = require('mongoose');
const path = require('path');
// aide à protéger l'application de certaine vulnérabilité en configurant de manière appropriée des en-tête
const helmet = require('helmet');
const dotenv = require('dotenv').config();
// nettoie les données fournis par l'utilisateur pour empecher les injection ( nettoie les $ et les .)
const mongoSanitize = require('express-mongo-sanitize');
const bodyParser = require('body-parser');


const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');



const app = express();

//la connection a MongoDB
mongoose.connect( process.env.DB_CONNEXION,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));



// Middleware pour les headers de requêtes et éviter les erreurs CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//tronsorme les données POST en un objet JSON
app.use(bodyParser.json());


app.use(helmet());
app.use(mongoSanitize());

// Chemin virtuel pour les fichiers statiques tel que nos images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Url des routes
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;
