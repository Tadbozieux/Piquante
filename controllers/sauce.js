const Sauce = require('../models/sauce');

exports.createSauce = (req, res, next) => {
  const sauceSchema = JSON.parse(req.body.sauce);
  delete sauceSchema._id;
  delete sauceSchema._userId;
  const sauce = new Sauce({
    ...sauceSchema,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    heat: req.body.heat,
    // likes: 0,
    // dislikes: 0,
    // usersLiked: [""],
    // usersDisliked: [""],
  });
  sauce.save().then(
    () => {
      res.status(201).json({
        message: 'Object enregistré!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
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
  Sauce.deleteOne({_id: req.params.id})
  .then(
    () => {
      res.status(200).json({
        message: 'Deleted!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
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