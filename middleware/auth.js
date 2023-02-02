const jwt = require('jsonwebtoken');
 
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1];  // le token se constituant du mot "Bearer"  puis dui token en lui meme on ne garde que la seconde partie
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');  // decodage du token avec la methode verify
       const userId = decodedToken.userId;  // recuperation userId et rajouton cette valeur a l'object request transmis aux routes suivantes
       req.auth = {
           userId: userId
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};






// le token se constituant du mot "Bearer"  puis dui token en lui meme on ne garde que la seconde partie
// decodage du token avec la methode verify
// recuperation userId et rajouton cette valeur a l'object request transmis aux routes suivantes