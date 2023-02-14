const multer = require('multer');

const MIME_TYPES = {
    'images/jpg': 'jpg',
    'images/jpeg': 'jpg',
    'images/png':'png'
}


const storage = multer.diskStorage({     
    destination : (req, file, callback) =>{       // on indique a multer d' enregistrer les fichiers dans le dossier images
        callback(null, 'images')
    },
    filename: (req, file, callback) =>{
        const name = file.originalname.split(' ').join('_');    // on rename le l'image avec son nom d'origine en supprimant les espaces potentiels
        const extension = MIME_TYPES[file.minetype];            // le timestamp "Date.now()" permet de rendre le nom unique
        callback(null, name + Date.now() + '.' + extension);
    }
})

module.exports = multer({storage}).single('image');