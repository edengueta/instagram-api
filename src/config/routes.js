const express = require('express');
const PostsController = require('../controllers/posts.controller');
const UsersController = require('../controllers/users.controller')
const auth = require('../middlewares/auth')
const routes = express.Router();

//User routes
routes.put('/user', UsersController.create);
routes.post('/user/login', UsersController.login);
routes.get('/user/check', UsersController.check);
routes.post('/user/me', auth, UsersController.me);

//Post routes
routes.get('/post', auth, PostsController.feed);



module.exports = routes;