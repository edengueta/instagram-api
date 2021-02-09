const md5 = require('md5');
const User = require('../models/user.model')
class UsersController {
    static create (req,res) {
        req.body.password= md5( md5(req.body.password ));
        const user = new User(req.body);
        user.save()
            .then( newUser => res.status(201).send(newUser))
            .catch ( err => {
                console.log(err);
                res.status(400).send(err);
            });
    }

    static login(req,res) {
        User.findOne({
            username:req.body.username,
            password:md5( md5(req.body.password ))
        }).then (user => {
                if (!user) {
                    res.sendStatus(401);
                    return;
                }
                res.sendStatus(200);
            }).catch (err => {
                console.log(err);
                res.sendStatus(500);
            })
    }

    static validateMail(req,res) {
        User.findOne({
           email: req.params.email
        }).then (user => {
            if (user) {
                res.send(false);
                return
            }
            res.send(true);
        }).catch (err => {
            console.log(err);
            res.sendStatus(500);
        })
    }
    static validateUsername(req,res) {
        User.findOne({
            username: req.params.username
        }).then (user => {
            if (user) {
                res.send(false);
                return
            }
            res.send(true);
        }).catch (err => {
            console.log(err);
            res.sendStatus(500);
        })
    }
}
module.exports = UsersController;