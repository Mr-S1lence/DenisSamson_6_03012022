const Sauce = require('../models/Sauce');
const fs = require('fs');//pasckage fs de node (fs pour filesystem)

//Pour ajouter un fichier à la requête, le front-enddoit envoyer les données de la requête sous la forme form-data et non sous forme de JSON.
//Le corps de la requête contient une chaîne sauce qui est un objet Sauce converti en chaîne.
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce); //Analyse à l'aide de JSON.parse
    delete sauceObject._id;//on suprrime l'id du corps de la requête
    const sauce = new Sauce({//Nouvelle instance du modèle Sauce en lui passant un objet JavaScript
      /* title: req.body.title, etc... */
      ...sauceObject, //raccourcie js avec l'opérateur spread
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`//req.protocol -> http(s)
    });
    //On sauvegarde l'objet dans la bdd en appelant la méthode save
    sauce.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))//promise
      .catch(error => res.status(400).json({ error })); //raccourcie js "error: error" / Erreur générée par mongoose
};

exports.like = (req, res, next) => {
    switch(req.body.like){
        case 1:
            Sauce.updateMany({ _id: req.params.id }, { $push: {"usersLiked" : req.body.userId} ,  $inc: {"likes" : 1 }})
            .then(() => res.status(200).json({ message: 'sauce liké !'}))
            .catch(error => res.status(400).json({ error }));
        break;

        case 0:
            Sauce.findOne({ _id: req.params.id })
            .then((sauce) => {
                if(sauce.usersLiked.includes(req.body.userId)){
                    Sauce.updateMany({ _id: req.params.id }, { $pull: {"usersLiked" : req.body.userId},  $inc: {"likes" : -1 } })
                    .then(() => res.status(200).json({ message: 'Aucun avis !'}))
                    .catch(error => res.status(400).json({ error }));
                }
                if(sauce.usersDisliked.includes(req.body.userId)){
                    Sauce.updateMany({ _id: req.params.id }, { $pull: {"usersDisliked" : req.body.userId} ,  $inc: {"dislikes" : -1 } })
                    .then(() => res.status(200).json({ message: 'Aucun avis !'}))
                    .catch(error => res.status(400).json({ error }));
                }
            })
            .catch(error => res.status(404).json({ error }));
        break;

        case -1:
            Sauce.updateMany({ _id: req.params.id }, { $push: {"usersDisliked" : req.body.userId} ,  $inc: {"dislikes" : 1 } })
            .then(() => res.status(200).json({ message: 'sauce disliké !'}))
            .catch(error => res.status(400).json({ error }));
        break;

        default: console.log(error);
    }

};

exports.modifySauce = (req, res, next) => {
  if(req.file){
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
      });
    })
    .catch(error => res.status(500).json({ error }));
  }
    const sauceObject = req.file ? //vérification si il y a une nouvelle image
      {
        
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body }
      Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) //nouvelle version de l'objet en deuxième en paramètre
        .then(() => res.status(200).json({ message: 'Objet modifié !'}))
        .catch(error => res.status(400).json({ error }));
  };

  exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {//fonction unlink du package fs permet de supprimer un fichier
          Sauce.deleteOne({ _id: req.params.id })//callback à exécuter une fois le fichier supprimé -> suppression du Sauce dans la base de données
            .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  };  

exports.getOneSauce = (req, res, next) => { // ':' pour rendre accessible en tant que paramètre
    Sauce.findOne({ _id: req.params.id })//On compare l'id recherché dans la bdd
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
};






