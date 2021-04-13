const md5 = require('md5');
const User = require('../models/user.model');
const Post = require('../models/post.model');
const jwt = require('jsonwebtoken');
const {jwtSecret} = require ('../config/enviroment/index');
const cloudinary = require('../config/cloudinary/cloudinary.config')



class UsersController {

    static async create (req,res) {
        req.body.password= md5( md5(req.body.password ));
        const user = new User(req.body);

		try {
            const newUser = await user.save();
            res.status(201).send(newUser)
        }
        catch (err){
            console.log(err);
            res.status(400).send(err);
        }
    }


    static async login(req,res) {

        try {
            const user = await User.findOne({
                username:req.body.username,
                password:md5( md5(req.body.password ))
            })
            if (!user) {
                res.sendStatus(401);
                return;
            }
            const payload= {
                _id:user._id,
                username:user.username,
                avatar:user.avatar
            }
            const token = jwt.sign(payload, jwtSecret)
            res.send({token});
        }
        catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    }
    
    static async check(req, res) {
		const { username, email } = req.query;

		if (!username && !email) {
			res.sendStatus(400);
			return;
		}
		let property = email ? 'email' : 'username';

		try {
			const user = await User.findOne({
				[property]: req.query[property]
			})
            if (user) {
                res.send(true);
                return
            }
            res.send(false);
		}
        catch(err) {
            console.log(err);
            res.sendStatus(500);		
        }
	}

    static me (req, res) {
        res.send(req.user)
    }

    static async get(req,res) {
        try {
            const user = await User.findOne({
                username: req.params.username
            })
            if (!user) {
                res.send('no such user').status(404);
                return;
            }
            const {_id, username, avatar, bio, followers} = user;
            res.send({_id, username, avatar, bio, followers});
        }
        catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    }

    static async getPosts(req,res) {

        try {
            const user = await User.findOne({
                username: req.params.username
            })
            if (!user) {
                res.send('no such user').status(404);
                return;
            }
            const posts = await Post
                .find({ user:user._id })
                .populate ('user',['username' , 'avatar']);
            res.send(posts);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    }

    static async getAll(req,res) {
        try {
            const users = await User.find({
                username: new RegExp(req.query.username, 'i')
            })
            const result= users.map ( user=> {
                const {_id, username, avatar, bio, createdAt, followers} = user;
                return {_id, username,avatar, bio, createdAt, followers}
            })
            res.send(result);
        }
        catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    }


    static async follow(req, res) {
		const userId = req.params.id;
		const followerUserId =req.user._id;
        if (userId===followerUserId) {
            res.sendStatus(400);
            return;
        }
		try {
			const user = await User.findById(userId);
			if(!user) {
				res.sendStatus(404);
				return;
			}
            
			user.followers.addToSet(followerUserId);
			await user.save();
            const {_id, username, avatar, bio, followers} = user;
			res.status(201).send({_id, username, avatar, bio, followers})
		} catch(err) {
			console.log(err);
			res.sendStatus(400);
		}
	}

	static async unfollow(req, res) {
		const userId = req.params.id;
		const followerUserId =req.user._id;

		try {
			const user = await User.findById(userId);
			if(!user) {
				res.sendStatus(404);
				return;
			}
			user.followers.pull(followerUserId);
			await user.save();
            const {_id, username, avatar, bio, followers} = user;
			res.status(200).send({_id, username, avatar, bio, followers});	
        } catch(err) {
			console.log(err);
			res.sendStatus(400);
		}
	}

    static async uploadAvatar(req, res) {
		const fileName =req.file.filename;

		try {
            const image = await cloudinary.uploader.upload (

				'public/avatars/'+fileName,
				{
					transformation: ["insta-1080"],
					public_id: `${req.user.username}-profile-${fileName}`,
					resource_type: 'image',
					folder:'avatars'
				},
				function(error, result) {
					console.log(result);
				}
			)

			const user = await User.findById(req.user._id);
			if(!user) {
				res.sendStatus(404);
				return;
			}
            user.avatar= image.url
			await user.save();

            const payload= {
                _id:user._id,
                username:user.username,
                avatar:user.avatar
            }
            const token = jwt.sign(payload, jwtSecret)
            res.status(200).send({token});

        } catch(err) {
			console.log(err);
			res.sendStatus(400);
		}

	}

}
module.exports = UsersController;