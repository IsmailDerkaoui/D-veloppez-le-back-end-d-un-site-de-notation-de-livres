/* eslint-disable */

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const booksRoutes = require('./routes/booksRoute');
const userRoutes = require('./routes/userRoute');
const path = require('path');

mongoose.connect(
  'mongodb+srv://NouvelUtilisateur:NouvelUtilisateur@cluster0.ngysx.mongodb.net/TON_NOM_DE_BDD?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((error) => console.log('Connexion à MongoDB échouée !', error));

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization',
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  );
  next();
});

app.use(bodyParser.json());

app.use('/api/books', booksRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;
