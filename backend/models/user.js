const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); //package de validation pour prévalider les informations avant de les enregistrer

// mot-clé unique pour l'attribut email pour empecher de s'inscrire plusieurs fois avec la même adresse
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true }, 
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);//On applique le validateur au schéma avant d'en faire un modèle

module.exports = mongoose.model('User', userSchema);