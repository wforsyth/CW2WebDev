const path = require('path');
const userDao = require('../models/userModel.js');
const pantryDao = require('../models/pantryModel.js');
const donationDao = require('../models/donationModel.js');
const auth = require("../auth/auth.js");

exports.show_donations_page = function(req, res){
    const pantry = req.pantry;

    donationDao.getAllDonations().then((list) =>{
        res.render('pantry/pantryDonations', {
            pantry: pantry,
            donations: list,
            imageUrl: path.join('img', 'pantryLogo.jpg'),
        });
    }).catch((err) => {
        console.log("Error retrieving donations:", err);
        res.status(500).send('Internal server error');
    })
}

exports.logout = function (req, res) {
    res
        .clearCookie("jwt")
        .status(200)
        .redirect("/");
}