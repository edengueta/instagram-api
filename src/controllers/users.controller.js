const md5 = require('md5');
const User = require('../models/user.model')
const jwt = require('jsonwebtoken');
const {jwtSecret} = require ('../config/enviroment/index')


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
        res.send(req.instaUser)            
    }

}
module.exports = UsersController;