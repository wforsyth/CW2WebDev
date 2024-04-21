const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel.js');
const pantryModel = require('../models/pantryModel.js');
const adminModel = require('../models/adminModel.js');
const jwt = require("jsonwebtoken");

//method to log in user
exports.login = function (req, res, next) {
    let username = req.body.username;
    let password = req.body.password;

    //checks for user information and logs in
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

                    //and then pass onto the next middleware
                    req.user = user;
                    next();
                }
            });
        } else {
            //checks for pantry information and logs in
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

                            //and then pass onto the next middleware
                            req.pantry = pantry;
                            next();
                        }
                    });
                } else {
                    //checks for admin information and logs in
                    adminModel.lookup(username, function (err, admin) {
                        if (err) {
                            console.log("error looking up admin", err);
                            return res.status(401).send();
                        } else if (admin) {
                            bcrypt.compare(password, admin.password, function (err, result) {
                                if (result) {
                                    let payload = { admin: admin };
                                    let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_ADMIN);
                                    res.cookie("jwt", accessToken);

                                    //and then pass onto the next middleware
                                    req.admin = admin;
                                    next();
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

//verifies if user is logged in
exports.verify = function (req, res, next) {
    let accessToken = req.cookies.jwt;
    if (!accessToken) {
        return res.status(403).send();
    }
    let payload;
    try {
        payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_USER);
        //console.log(payload.user);

        req.user = payload.user;
        next();
    } catch (e) {
        //if an error occured return request unauthorized error
        res.status(401).send();
    }
};

//verifies if pantry is logged in
exports.verifyPantry = function (req, res, next) {
    let accessToken = req.cookies.jwt;
    if (!accessToken) {
        return res.status(403).send();
    }
    let payload;
    try {
        payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_PANTRY);
        //console.log(payload.pantry);

        req.pantry = payload.pantry;
        next();
    } catch (e) {
        //if an error occured return request unauthorized error
        res.status(401).send();
    }
};

//verifies if admin is logged in
exports.verifyAdmin = function (req, res, next) {
    let accessToken = req.cookies.jwt;
    if (!accessToken) {
        return res.status(403).send();
    }
    let payload;
    try {
        payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_ADMIN);

        req.admin = payload.admin;
        next();
    } catch (e) {
        res.status(401).send();
    }
};
