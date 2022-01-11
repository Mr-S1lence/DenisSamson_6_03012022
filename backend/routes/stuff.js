const express = require('express');
const router = express.Router();

const stuffCtrl = require('../controllers/stuff');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');


router.post('/',auth, multer, stuffCtrl.createThing); //pas de parenthèses pour stuffCtrl.createThing ici car on appelle pas la fonction mais on l'applique

//Modification d'un produit
router.put('/:id',auth, multer, stuffCtrl.modifyThing);

//suppression
router.delete('/:id',auth, stuffCtrl.deleteThing);

//Récupérer un produit spécifique grâce à son id.
router.get('/:id',auth, stuffCtrl.getOneThing);

//récupérer tous les produits
router.get('/',auth, stuffCtrl.getAllThings);

module.exports = router;