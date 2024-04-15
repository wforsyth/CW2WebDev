const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const jwt = require("jsonwebtoken");

exports.login = function (req, res, next) {
    let username = req.body.username;
    let password = req.body.password;

    userModel.lookup(username, function (err, user) {
        if (err) {
            console.log("error looking up user", err); return res.status(401).send();
        } if (!user) {
            console.log("user ",
                username, " not found"); return
            res.status(401).send();
        }
        //compare provided password with stored password
        bcrypt.compare(password, user.password, function (err, result) {
            if (result) {
                let payload = { username: user.username }; let accessToken =
                    jwt.sign(payload, process.env.ACCESS_TOKEN_USER);
                res.cookie("jwt", accessToken);
            
                //and then pass onto the next middleware
                next();
            } else {
                return
                res.status(403).send();
            }
        });
    });
};

exports.verify = function (req, res, next) {
    let accessToken = req.cookies.jwt;
    if (!accessToken) {
        return res.status(403).send();
    }
    let payload;
    try {
        payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_USER);
        next();
    } catch (e) {
        //if an error occured return request unauthorized error
        res.status(401).send();
    }
};