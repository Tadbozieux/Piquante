const express = require('express');
const app = express();

let cors = require('cors')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })


const path = require("path");

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://tadtad:nicolas9@qsdqsdqsdqsdqsd.iejnsop.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
  });
//       autorisation requetes CORS via le  package node.js///////
  app.get('/products/:id', function (req, res, next) {
    res.json({msg: 'This is CORS-enabled for all origins!'})
  })
  
  app.listen(80, function () {
    console.log('CORS-enabled web server listening on port 80')
  })
  //       autorisation requetes CORS via le  package node.js///////

  

app.use(express.json());  
// app.use(bodyParser.json());
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(cors())



module.exports = app;