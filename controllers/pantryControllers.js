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

exports.accept_donation = function (req, res) {
    var pantry = req.pantry;
    var donationId = req.body.donationId;
    var foodName = req.body.foodName;
    var quantity = req.body.quantity;
    var expiration = req.body.expiration;
    console.log(foodName);
    console.log(donationId);
    console.log(quantity);
    console.log(expiration);
    
    pantryDao.receiveDonation(foodName, quantity, expiration, pantry, (err) => {
        if (err) {
            console.log('Error receiving donation', err);
            return res.status(500).send('Error receiving donation');
        }

        console.log(donationId);
        console.log(pantry);

        donationDao.removeDonation(donationId, (err) => {
            if (err) {
                console.log('Error removing donation', err);
                return res.status(500).send('Error removing donation');
            }

            console.log('Donation Accepted and Removed successfuly')
        });
    });
}

exports.logout = function (req, res) {
    res
        .clearCookie("jwt")
        .status(200)
        .redirect("/");
}