//Import du modèle Sauce
const Sauce = require('../models/sauce');

// Package pour la suppression
const fs = require('fs');

//regex
const regex = /[a-zA-Z0-9 _.,'’(Ééèàû)]+$/;
 
//créer une sauce
exports.createSauces = (req, res, next) => {
  //analyse de JSON.parse() pour obtenir un objet utilisable
  const sauceObject = JSON.parse(req.body.sauce);

  //suppression de l'id généré par le front-end, car il es crée par mongoDB
  delete sauceObject._id;

  // Si le Regex n'est pas valide
  if (!regex.test(sauceObject.name) || !regex.test(sauceObject.manufacturer) ||
        !regex.test(sauceObject.description) || !regex.test(sauceObject.mainPepper) ||
        !regex.test(sauceObject.heat)) {
        return res.status(500).json({ error: 'Des champs contiennent des caractères invalides' });
    }

  const sauce = new Sauce({
    ...sauceObject,
    //modification de l'url de l'image, pour avoir une url complète
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistré !'}))
    .catch(error => res.status(400).json({ error }));
}; 

//modifier une sauce
exports.updateSauces = (req, res, next) => {
  const sauceObject = req.file ?
  //modification des données et rajout d'une nouvelle image
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : //sinon on traite juste les données
    { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifié !'}))
    .catch(error => res.status(400).json({ error }));
}; 


//supprimer une sauce
exports.deleteSauces = (req, res, next) => {
 Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      //récupération de l'url correspondant à la sauce 
      const filename = sauce.imageUrl.split('/images/')[1];
      //unlink du package fs pour supprimer ce fichier
      fs.unlink(`images/${filename}`, () => {
        //implémenter la logique d'origine, en supprimant sauce de la base de données.
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};


//récupérer ou lire une sauce
exports.getOneSauces = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
  };


//récupérer ou lire toutes les sauce ajouté
 exports.getAllSauces = (req, res, next) => {
    Sauce.find().then(
      (sauces) => {
        res.status(200).json(sauces);
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  };  


// Implantation des Like et Dislike 
exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
 .then(sauce => {
     switch (req.body.like) {
       // si c'est un dislike
         case -1:
           //mettre à jour la sauce par son id
             Sauce.updateOne({ _id: req.params.id }, {
               //ajouter l'utilisateur dans le tableau , et incrémenter de 1 
                 $inc: {dislikes:1},
                 $push: {usersDisliked: req.body.userId},
                 _id: req.params.id
             })
                 .then(() => res.status(201).json({ message: 'Dislike ajouté !'}))
                 .catch( error => res.status(400).json({ error }))
             break;
             //si c'est une annulation d'un like ou un dislike
         case 0:
             if (sauce.usersLiked.find(user => user === req.body.userId)) {
                 Sauce.updateOne({ _id : req.params.id }, {
                     $inc: {likes:-1},
                     $pull: {usersLiked: req.body.userId},
                     _id: req.params.id
                 })
                     .then(() => res.status(201).json({message: ' Like retiré !'}))
                     .catch( error => res.status(400).json({ error }))
             }
             if (sauce.usersDisliked.find(user => user === req.body.userId)) {
                 Sauce.updateOne({ _id : req.params.id }, {
                     $inc: {dislikes:-1},
                     $pull: {usersDisliked: req.body.userId},
                     _id: req.params.id
                 })
                     .then(() => res.status(201).json({message: ' Dislike retiré !'}))
                     .catch( error => res.status(400).json({ error }));
             }
             break;
             //si c'est un like 
         case 1:
             Sauce.updateOne({ _id: req.params.id }, {
               //ajouter l'utilisateur au tableau et l'incrémenter de 1
                 $inc: { likes:1},
                 $push: { usersLiked: req.body.userId},
                 _id: req.params.id
             })
                 .then(() => res.status(201).json({ message: 'Like ajouté !'}))
                 .catch( error => res.status(400).json({ error }));
             break;
         default:
             return res.status(500).json({ error });
     }
 })
 .catch(error => res.status(500).json({ error }))
};
