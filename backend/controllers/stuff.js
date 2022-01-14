const Thing = require('../models/Thing');
const fs = require('fs');//pasckage fs de node (fs pour filesystem)

//Pour ajouter un fichier à la requête, le front-enddoit envoyer les données de la requête sous la forme form-data et non sous forme de JSON.
//Le corps de la requête contient une chaîne thing qui est un objet Thing converti en chaîne.
exports.createThing = (req, res, next) => {
    const thingObject = JSON.parse(req.body.sauce); //Analyse à l'aide de JSON.parse
    delete thingObject._id;//on suprrime l'id du corps de la requête
    const thing = new Thing({//Nouvelle instance du modèle Thing en lui passant un objet JavaScript
      /* title: req.body.title, etc... */
      ...thingObject, //raccourcie js avec l'opérateur spread
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`//req.protocol -> http(s)
    });
    //On sauvegarde l'objet dans la bdd en appelant la méthode save
    thing.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))//promise
      .catch(error => res.status(400).json({ error })); //raccourcie js "error: error" / Erreur générée par mongoose
};

exports.like = (req, res, next) => {
    switch(req.body.like){
        case 1:
            Thing.updateMany({ _id: req.params.id }, { $push: {"usersLiked" : req.body.userId} ,  $inc: {"likes" : 1 }})
            .then(() => res.status(200).json({ message: 'sauce liké !'}))
            .catch(error => res.status(400).json({ error }));
        break;

        case 0:
            Thing.findOne({ _id: req.params.id })
            .then((thing) => {
                if(thing.usersLiked.includes(req.body.userId)){
                    Thing.updateMany({ _id: req.params.id }, { $pull: {"usersLiked" : req.body.userId},  $inc: {"likes" : -1 } })
                    .then(() => res.status(200).json({ message: 'Aucun avis !'}))
                    .catch(error => res.status(400).json({ error }));
                }
                if(thing.usersDisliked.includes(req.body.userId)){
                    Thing.updateMany({ _id: req.params.id }, { $pull: {"usersDisliked" : req.body.userId} ,  $inc: {"dislikes" : -1 } })
                    .then(() => res.status(200).json({ message: 'Aucun avis !'}))
                    .catch(error => res.status(400).json({ error }));
                }
            })
            .catch(error => res.status(404).json({ error }));
        break;

        case -1:
            Thing.updateMany({ _id: req.params.id }, { $push: {"usersDisliked" : req.body.userId} ,  $inc: {"dislikes" : 1 } })
            .then(() => res.status(200).json({ message: 'sauce disliké !'}))
            .catch(error => res.status(400).json({ error }));
        break;

        default: console.log(error);
    }

};

exports.modifyThing = (req, res, next) => {
  if(req.file){
    Thing.findOne({ _id: req.params.id })
    .then(thing => {
      const filename = thing.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
      });
    })
    .catch(error => res.status(500).json({ error }));
  }
    const thingObject = req.file ? //vérification si il y a une nouvelle image
      {
        
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body }
      Thing.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id }) //nouvelle version de l'objet en deuxième en paramètre
        .then(() => res.status(200).json({ message: 'Objet modifié !'}))
        .catch(error => res.status(400).json({ error }));
  };

  exports.deleteThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
      .then(thing => {
        const filename = thing.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {//fonction unlink du package fs permet de supprimer un fichier
          Thing.deleteOne({ _id: req.params.id })//callback à exécuter une fois le fichier supprimé -> suppression du Thing dans la base de données
            .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  };  

exports.getOneThing = (req, res, next) => { // ':' pour rendre accessible en tant que paramètre
    Thing.findOne({ _id: req.params.id })//On compare l'id recherché dans la bdd
      .then(thing => res.status(200).json(thing))
      .catch(error => res.status(404).json({ error }));
};

exports.getAllThings = (req, res, next) => {
    Thing.find()
      .then(things => res.status(200).json(things))
      .catch(error => res.status(400).json({ error }));
};






