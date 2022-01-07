//package de hashage
const bcrypt = require('bcrypt');
//package permettant de créer des tokens et de les vérifier
const jwt = require('jsonwebtoken');
const User = require('../models/User');

//fonction signup pour l'enregistrement de nouveaux utilisateurs
exports.signup =  (req, res, next) =>{ 
    //fonction asynchrone pour hasher le mot de passe
    bcrypt.hash(req.body.password, 10) //salt : On demande de "saler" le mdp 10 fois. Plus la valeur est élevé plus le hachage sera sécurisé.
    .then(hash => {
        const user = new User({//modele mongoose
            email: req.body.email,
            password: hash
        });
        user.save()//méthode save de user pour enregistrer dans la base de données
        .then(() => res.status(201).json({ message : 'Utilisateur créé !'}))//201 pour création de ressource
        .catch(error => res.status(400).json({ error}));
    })
    .catch(error => res.status(500).json({ error}));//erreur serveur
};

//fonction login qui permet aux users de se connecter.
exports.login = (req, res, next) =>{
    //recherche de l'user dans BDD.
    User.findOne({ email: req.body.email })
        .then(user => {
            if(!user){
                return res.status(401).json({ error : 'Utilisateur non trouvé !'});
            }
            bcrypt.compare(req.body.password, user.password)//User trouvé : comparration des mdp avec bcrypt
                .then(valid => {
                    if(!valid){
                        return res.status(401).json({ error : 'Mot de passe incorrect !'});
                    }
                    res.status(200).json({ //requête ok
                        userId: user._id, //identifiant de l'utilisateur dans la BDD
                        token: jwt.sign( //fonction sign du package jwt
                            { userId: user._id }, //données que l'on veut encodé (payload)
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }))//Erreur serveur
        }

        )
        .catch(error => res.status(500).json({ error }));//Erreur serveur
};