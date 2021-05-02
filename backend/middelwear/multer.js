//plugin Npm Node.js
const multer = require('multer');

// Ajout des formats d'images
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

// Constante qui permets d'enregistrer l'image
const storage = multer.diskStorage({
    //multer enregistre les fichiers dans le dossier images
    destination: (req, file, callback) => {
       callback(null, 'images');
    },
    //multer utilise le nom d'origine, et remplace les espaces par des underscores 
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        //résoudre l'extension de fichier appropriée
        const extension = MIME_TYPES[file.mimetype];
        //ajouter un timestamp Date.now() comme nom de fichier
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({storage: storage}).single('image');
