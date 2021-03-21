const md5 = require('md5');
const User = require('../models/user.model');
const Post = require('../models/post.model');
const jwt = require('jsonwebtoken');
const {jwtSecret} = require ('../config/enviroment/index');


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
                username:user.username
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
            const {_id, username, avatar, bio} = user
            res.send({_id, username, avatar, bio});
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
                const {_id, username, avatar, bio, createdAt} = user
                return {_id, username,avatar, bio, createdAt}
            })
            res.send(result);
        }
        catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    }

    static async isFollow(req, res) {
        const userId = req.params.id;
		const followerUserId =req.user._id;
		try {
			const follower = await User
                .findById(userId)
                .findOne({
                    followers : followerUserId
                });
            if (!follower) {
                res.send(false)
                return
            }
            res.send(true);

		} catch(err) {
			console.log(err);
			res.sendStatus(400);
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
            const {_id, username, avatar, bio} = user
			res.status(201).send({_id, username, avatar, bio})
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
            const {_id, username, avatar, bio} = user
			res.status(204).send({_id, username, avatar, bio})		
        } catch(err) {
			console.log(err);
			res.sendStatus(400);
		}
	}


}
module.exports = UsersController;