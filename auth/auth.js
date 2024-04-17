const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const pantryModel = require('../models/pantryModel');
const jwt = require("jsonwebtoken");

exports.login = function (req, res, next) {
    let username = req.body.username;
    let password = req.body.password;

    userModel.lookup(username, function (err, user) {
        if (err) {
            console.log("error looking up user", err);
            return res.status(401).send();
        } else if (user) {
            bcrypt.compare(password, user.password, function (err, result) {
                if (result) {
                    let payload = { user: user };
                    let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_USER);
                    res.cookie("jwt", accessToken);

                    console.log("JWT token generated for user:", user)
                    console.log(payload);

                    //and then pass onto the next middleware
                    req.user = user;
                    next();
                }
            });
        } else {
            pantryModel.lookup(username, function (err, pantry) {
                if (err) {
                    console.log("error looking up pantry", err);
                    return res.status(401).send();
                } else if (pantry) {
                    bcrypt.compare(password, pantry.password, function (err, result) {
                        if (result) {
                            let payload = { pantry: pantry };
                            let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_PANTRY);
                            res.cookie("jwt", accessToken);

                            console.log("JWT token generated for pantry:", pantry)
                            console.log(payload);

                            //and then pass onto the next middleware
                            req.pantry = pantry;
                            next();
                        }
                    });
                }
            });
        }
    });
}


exports.verify = function (req, res, next) {
    let accessToken = req.cookies.jwt;
    const user = req.user;
    const pantry = req.pantry;

    if (!accessToken) {
        return res.status(403).send();
    }
    if (user) {
        let payload;
        try {
            payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_USER);
            console.log(payload.user);

            req.user = payload.user;
            next();
        } catch (e) {
            //if an error occured return request unauthorized error
            res.status(401).send();
        }
    } else if (pantry) {
        let payload;
        try {
            payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_PANTRY);
            console.log(payload.pantry);

            req.pantry = payload.pantry;
            next();
        } catch (e) {
            //if an error occured return request unauthorized error
            res.status(401).send();
        }
    }
};
