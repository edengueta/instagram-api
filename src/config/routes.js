const express = require('express');
const multer = require('multer');
const uploadPost = multer({dest: 'public/posts'});
const uploadAvatar = multer({dest: 'public/avatars'});
const PostsController = require('../controllers/posts.controller');
const UsersController = require('../controllers/users.controller')
const auth = require('../middlewares/auth')
const routes = express.Router();

//User routes
routes.put('/user', UsersController.create);
routes.post('/user/login', UsersController.login);
routes.get('/user/check', UsersController.check);
routes.post('/user/me', auth, UsersController.me);
routes.get('/user/:username', auth, UsersController.get);
routes.get('/user/:username/posts', auth, UsersController.getPosts);
routes.get('/user', auth, UsersController.getAll);
routes.post('/user/:id/follow', auth, UsersController.follow);
routes.post('/user/:id/unfollow', auth, UsersController.unfollow);
routes.post('/user/avatar', auth,uploadAvatar.single('image'), UsersController.uploadAvatar);



//Post routes
routes.get('/post', auth, PostsController.feed);
routes.get('/post/:id', auth, PostsController.get);
routes.put('/post', auth, uploadPost.single('image'), PostsController.create);
// routes.get('/post/:id/likes/:userId', auth, PostsController.isLiked);
routes.post('/post/:id/likes', auth, PostsController.like);
routes.post('/post/:id/likes/:userId', auth, PostsController.unlike);

routes.put('/post/:id/comment', auth, PostsController.createComment);
routes.get('/post/:id/comment', auth, PostsController.getComments);

routes.get('/', (req,res)=>res.send());








module.exports = routes;