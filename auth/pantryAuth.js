const bcrypt = require('bcrypt');
const pantryModel = require('../models/pantryModel');
const jwt = require("jsonwebtoken");

exports.login = function (req, res, next) {
    let username = req.body.username;
    let password = req.body.password;

    pantryModel.lookup(username, function (err, pantry) {
        if (err) {
            console.log("error looking up user", err); return res.status(401).send();
        } if (!pantry) {
            console.log("pantry ",
                username, " not found"); return
            res.status(401).send();
        }
        //compare provided password with stored password
        bcrypt.compare(password, user.password, function (err, result) {
            if (result) {
                let payload = { pantry: pantry }; 
                let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_PANTRY);
                res.cookie("jwt", accessToken);

                console.log("JWT token generated for pantry:", pantry)
                console.log(payload);
            
                //and then pass onto the next middleware
                req.pantry = pantry;
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
        payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_PANTRY);
        console.log(payload.user);

        req.pantry = payload.pantry;
        next();
    } catch (e) {
        //if an error occured return request unauthorized error
        res.status(401).send();
    }
};