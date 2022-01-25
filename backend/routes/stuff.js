const express = require('express');
const router = express.Router();

const stuffCtrl = require('../controllers/stuff');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

//Création d'un produit
router.post('/',auth, multer, stuffCtrl.createSauce); //pas de parenthèses pour stuffCtrl.createSauce ici car on appelle pas la fonction mais on l'applique

//like
router.post('/:id/like',auth, multer, stuffCtrl.like);

//Modification d'un produit
router.put('/:id',auth, multer, stuffCtrl.modifySauce);

//suppression
router.delete('/:id',auth, stuffCtrl.deleteSauce);

//Récupérer un produit spécifique grâce à son id.
router.get('/:id',auth, stuffCtrl.getOneSauce);

//récupérer tous les produits
router.get('/',auth, stuffCtrl.getAllSauces);

module.exports = router;