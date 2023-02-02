const bcrypt = require('bcrypt');
const { JsonWebTokenError } = require('jsonwebtoken');
const User = require ("../models/user");
const jwt = require("JsonWebToken"); // appel jason web token pour cripter TOken


exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash,
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch((error) => res.status(400).json({ error }));
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({ error });
  })}

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
      .then(user => {
          if (!user) {
              return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
          }
          bcrypt.compare(req.body.password, user.password)
              .then(valid => {
                  if (!valid) {
                      return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                  }
                  res.status(200).json({
                      userId: user._id,
                      token: jwt.sign(    // fonction sign prend 3 arguments
                        {userId: user._id},  // user ID
                        "RANDOM_TOKEN_SECRET",  // clef secrete (normalement plus complexe)
                        {expiresIn: "24h"} // expiration du token au bout de 24h
                      )
                  });
              })
              .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};