const express = require('express');
const mongoose = require('mongoose');

const userRoutes = require('./routes/user');

//connexion bdd
mongoose.connect('mongodb+srv://samsond:azerty@cluster0.p45tz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


const app = express();

/* CORS signifie « Cross Origin Resource Sharing ». 
Il s'agit d'un système de sécurité qui, par défaut, 
bloque les appels HTTP entre des serveurs différents, 
ce qui empêche donc les requêtes malveillantes d'accéder à des ressources sensibles */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json());//Permet d'accèder au corps de la requête. 
//Intercepte toutes les requêtes contentType json et nous le mets à disposition dans req.body.
//Anciennement body-parser


app.use('/api/auth', userRoutes);

module.exports = app;