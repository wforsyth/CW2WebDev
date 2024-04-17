const path = require('path');
const pantryDao = require('../models/pantryModel.js');
const auth = require("../auth/auth.js");

exports.logout = function (req, res) {
    res
        .clearCookie("jwt")
        .status(200)
        .redirect("/");
}