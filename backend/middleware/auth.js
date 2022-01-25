//middleware qui vérifie le token envoyé par l'application frontend

//package
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        //on récupère le token dans le header authorization
        const token = req.headers.authorization.split(' ')[1]; //split autour de l'espace qui nous renvoie un tableau avec bearer en 1er et le toker en 2e
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);//décodage et vérification avec la clé secrète 
        const userId = decodedToken.userId; //on récupère l'user id
        req.auth = { userId };
        if(req.body.userId && req.body.userId !== userId){//Si on a un user.id dans le corps de la requête et que cet user.id est différent
            throw 'User ID non valable !';
        }else{
            next();
        }
    }catch (error){
        res.status(401).json({ error: error | 'Requête non authentifiée !' })
    }
};
