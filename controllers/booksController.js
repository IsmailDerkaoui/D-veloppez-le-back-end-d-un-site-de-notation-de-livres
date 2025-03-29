/* eslint-disable */

const Book = require("../models/books");
const fs = require("fs");

/* GET BEST RATING */

exports.getBestRatedBooks = (req, res, next) => {
  Book.find()
  .sort({ averageRating: -1 })
  .limit(3)
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

/* NOTER UN LIVRE */
exports.rateBook = (req, res, next) => {
  const { grade } = req.body;
  const userId = req.auth.userId;

  if (grade < 1 || grade > 5) {
    return res.status(400).json({ message: "La note doit être comprise entre 1 et 5." });
  }

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: "Livre non trouvé." });
      }

      // Vérifier si l'utilisateur a déjà noté ce livre
      const existingRating = book.ratings.find((r) => r.userId === userId);
      if (existingRating) {
        return res.status(400).json({ message: "Vous avez déjà noté ce livre." });
      }

      // Ajouter la nouvelle note
      book.ratings.push({ userId, grade });

      // Calculer la moyenne des notes
      const totalRatings = book.ratings.length;
      const sumGrades = book.ratings.reduce((sum, r) => sum + r.grade, 0);
      book.averageRating = sumGrades / totalRatings;

      return book.save();
    })
    .then((updatedBook) => res.status(200).json(updatedBook))
    .catch((error) => res.status(400).json({ error }));
};

/* AJOUT D'UN NOUVEAU LIVRE */
exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject.userId;
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  book
    .save()
    .then(() => res.status(201).json({ message: "Livre enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

/* MODIFICATION */
exports.modifyBook = (req, res, next) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  delete bookObject._id;

  // Trouver le livre existant
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: "Livre non trouvé" });
      }
      if (book.userId !== req.auth.userId) {
        return res.status(401).json({ message: "Modification non autorisée." });
      }
      // Mettre à jour le livre si autorisé
      Book.updateOne(
        { _id: req.params.id },
        { ...bookObject, _id: req.params.id }
      )
        .then(() => res.status(200).json({ message: "Livre modifié !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(400).json({ error }));
};

/* SUPPRESSION */
exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id }).then((book) => {
    if (book.userId !== req.auth.userId) {
      return res.status(401).json({ message: "Suppression non autorisée." });
    } else {
      const filename = book.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Book.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Livre supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    }
  });
};

/* RECUPERATION DES DETAILS D'UN LIVRE */
exports.findOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

/* RECUPERATION DE TOUT LES LIVRES */
exports.findAllBook = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};