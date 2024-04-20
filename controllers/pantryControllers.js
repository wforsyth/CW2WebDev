const path = require('path');
const userDao = require('../models/userModel.js');
const pantryDao = require('../models/pantryModel.js');
const donationDao = require('../models/donationModel.js');
const auth = require("../auth/auth.js");

exports.show_donations_page = function (req, res) {
    const pantry = req.pantry;
    console.log(pantry._id);

    donationDao.getAllDonations().then((donations) => {
        res.render('pantry/pantryDonations', {
            pantry: pantry,
            donations: donations,
            imageUrl: path.join('img', 'pantryLogo.jpg'),
        });
    }).catch((err) => {
        console.log("Error retrieving donations:", err);
        res.status(500).send('Internal server error');
    })
}

exports.show_pantryhome_page = function (req, res) {
    const pantry = req.pantry;

    res.render('pantry/pantryHome', {
        pantry: pantry,
        imageUrl: path.join('img', 'pantryLogo.jpg'),
        imageUrl2: path.join('img', 'TSPN_logo_enhanced.png')
    })
}

exports.accept_donation = function (req, res) {
    var pantryId = req.pantry._id;
    var donationId = req.body.donationId;
    var foodName = req.body.foodName;
    var quantity = req.body.quantity;
    var expiration = req.body.expiration;

    pantryDao.receiveDonation(foodName, quantity, expiration, pantryId, function(err){
        if (err){
            res.status(500). send('Error receiving donation');
        } else{
            donationDao.removeDonation(donationId);

            exports.show_donations_page(req, res);
        }
    });

    
}

exports.show_inventory_page = function (req, res) {
    const pantry = req.pantry;
    const inventory = req.pantry.inventory;
    console.log(pantry);
    console.log(inventory);

    res.render('pantry/pantryInventory', {
        pantry: pantry,
        inventory: inventory,
        imageUrl: path.join('img', 'pantryLogo.jpg'),
    });
}

exports.logout = function (req, res) {
    res
        .clearCookie("jwt")
        .status(200)
        .redirect("/");
}