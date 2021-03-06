const multer = require('multer');

//function pour supprimer l'extension du nom de fichier.
function removeExtension(filename){
    let lastDotPosition = filename.lastIndexOf(".");
    if (lastDotPosition === -1) return filename;
    else return filename.substr(0, lastDotPosition);
}


const MIME_TYPES = {//constante dictionnaire de type MIME
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
}

const storage = multer.diskStorage({ //funtion diskStorage de multer pour enregistrer sur le disque
    destination: (req, file, callback) => { //indique où enregistrer les fichiers
        callback(null, 'images')//null -> pas d'erreur et nom du dossier
    },
    filename: (req, file, callback) => {//modifie le nom du fichier pour éviter les doublons
        let name = file.originalname.split(' ').join('_'); //Remplacement des espaces par des underscores
        const extension = MIME_TYPES[file.mimetype];
        callback(null, removeExtension(name) + Date.now() + '.' + extension); //génération d'un nom de fichier et ajout d'un timestamp
    }
})

//Export de l'élément multer en lui passant l'objet storage et en lui indiquant que l'on gère que les images. 
//Single pour fichier unique et non un groupe de fichier
module.exports = multer({ storage }).single('image');