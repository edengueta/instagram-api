const express = require('express');
const UsersController = require('../controllers/users.controller')
const routes = express.Router();

routes.put('/user', UsersController.create);
routes.post('/user/login', UsersController.login);
routes.get('/user/validatemail/:email', UsersController.validateMail);
routes.get('/user/validateusername/:username', UsersController.validateUsername);



module.exports = routes;