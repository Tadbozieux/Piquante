const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Thing = require('./models/thing');
const stuffRoutes = require('./routes/stuff');
const userRoutes = require('./routes/user');
mongoose.connect('mongodb+srv://tadtad:nicolas9@qsdqsdqsdqsdqsd.iejnsop.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));



app.use('/api/stuff', stuffRoutes);
app.use('/api/auth', userRoutes);


module.exports = app;