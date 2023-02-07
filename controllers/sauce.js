const Sauce = require('../models/sauce');
const fs = require('fs'); // « file system » , donne accès aux fonctions qui nous permettent de modifier le système de fichiers, y compris la suppression

exports.createSauce = (req, res, next) => {
  const sauceSchema = JSON.parse(req.body.sauce);
  console.log(sauceSchema);
  delete sauceSchema._id;
  delete sauceSchema._userId;
  const sauce = new Sauce({
    ...sauceSchema,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [" "],
    usersDisliked: [" "],
  });
  sauce.save()
  .then(
    () => {
      res.status(201).json({
        message: 'Object enregistré!'
      });
    }
  ).catch(
    (error) => {
      res.status(402).json({
        error
      });
    }
  );
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
      ? {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        }
      : { ...req.body };

  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(res.status(200).json({ message: "Sauce modifiée" }))
      .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
      .then(sauce => {
          if (sauce.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'});
          } else {
              const filename = sauce.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  Sauce.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(
    (sauce) => {
      res.status(200).json(sauce);
    }
   ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};


exports.likeAndDislike = (req, res, next) => {
  //declaration variables
  let like = req.body.like;
  let userId = req.body.userId;
  let sauceId = req.params.id;
  //le cas du like
  if (like === 1) {  
    Sauce.updateOne({ _id: sauceId }, { $inc: { likes: +1}, $push: { usersLiked: userId } })
      .then((sauce) => res.status(200).json({ message: 'Sauce likée' }))
      .catch(error => res.status(400).json({ error }));
  } else if (like === -1) { 
      //le cas du dislike
    Sauce.updateOne({ _id: sauceId }, { $inc: { dislikes: +1 }, $push: { usersDisliked: userId } }) 
      .then((sauce) => res.status(200).json({ message: 'Sauce dislikée' }))
      .catch(error => res.status(400).json({ error }));
  } else { 
    // Dans le cas ou l'utilisateur souhaite supprimer son vote (like ou dislike)
    Sauce.findOne({ _id: sauceId })
      .then(sauce => {
        if (sauce.usersLiked.includes(userId)) { 
          //le cas du like retiré
          Sauce.updateOne({ _id: sauceId }, {  $inc: { likes: -1 },$pull: { usersLiked: userId } })
              .then((sauce) => { res.status(200).json({ message: 'Like supprimé' }) })
              .catch(error => res.status(400).json({ error }))
        } else if (sauce.usersDisliked.includes(userId)) {
            //le cas du dislike retiré
            Sauce.updateOne({ _id: sauceId }, {  $inc: { dislikes: -1 },$pull: { usersDisliked: userId } })
              .then((sauce) => { res.status(200).json({ message: 'Dislike supprimé' }) })
              .catch(error => res.status(400).json({ error }))
        }
      })
      .catch(error => res.status(400).json({ error }));
  }
};