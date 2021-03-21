const jwt = require('jsonwebtoken');
const{jwtSecret} = require('../config/enviroment/index')

function auth(req, res, next) {
   
   try {
      const token = req.headers.authorization;
      req.user = jwt.verify(token,jwtSecret);
      next();
   } catch (err) {
      res.sendStatus(401);
   }
}

module.exports = auth;