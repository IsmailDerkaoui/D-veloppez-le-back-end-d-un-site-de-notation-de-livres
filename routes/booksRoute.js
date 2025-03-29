/* eslint-disable */

const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const multer = require("../middleware/multer-config");

const bookCtrl = require("../controllers/booksController");

/* GET BEST RATING */
  router.get("/bestrating", auth, bookCtrl.getBestRatedBooks);

/* AJOUT D'UN NOUVEAU LIVRE */
  router.post("/", auth, multer, bookCtrl.createBook);

/* MODIFICATION */
  router.put("/:id", auth, multer, bookCtrl.modifyBook);

/* SUPPRESSION */
  router.delete("/:id", auth, bookCtrl.deleteBook);

/* RECUPERATION DES DETAILS D'UN LIVRE */
  router.get("/:id", auth, bookCtrl.findOneBook);

/* RECUPERATION DE TOUT LES LIVRES */
  router.get("/", auth, bookCtrl.findAllBook);

/* RECUPERATION DES NOTES DES LIVRES */
router.post("/:id/rating", auth, bookCtrl.rateBook);

module.exports = router;
