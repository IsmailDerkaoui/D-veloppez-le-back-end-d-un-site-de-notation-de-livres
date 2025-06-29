/* eslint-disable */
const multer = require('multer');

// On utilise le stockage en mémoire pour que Sharp traite l'image directement
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite de taille (5 Mo)
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non pris en charge'), false);
    }
  }
});

module.exports = upload.single('image');
