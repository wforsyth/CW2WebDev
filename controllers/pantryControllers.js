const path = require('path');
const userDao = require('../models/userModel.js');
const pantryDao = require('../models/pantryModel.js');
const donationDao = require('../models/donationModel.js');
const inventoryDao = require('../models/inventoryModel.js');
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
    var pantry = req.pantry;
    var donationId = req.body.donationId;
    var food = req.body.foodName;
    var quantity = req.body.quantity;
    var expiration = req.body.expiration;

    inventoryDao.addInventory(pantry.pantry, food, quantity, expiration);

    donationDao.removeDonation(donationId);

    exports.show_donations_page(req, res); 
};

exports.show_inventory_page = function (req, res){
    const pantry = req.pantry;
    
    inventoryDao.getInventoryByPantry(pantry.pantry).then((inventory) => {
        res.render('pantry/pantryInventory', {
            pantry: pantry,
            inventory: inventory,
            imageUrl: path.join('img', 'pantryLogo.jpg'),
        });
    }).catch((err) => {
        console.log("Error retrieving donations:", err);
        res.status(500).send('Internal server error');
    })
}

exports.delete_inventory = function (req, res){
    const inventoryId = req.body.inventoryId;

    inventoryDao.removeInventory(inventoryId);

    exports.show_inventory_page(req, res);
}

exports.logout = function (req, res) {
    res
        .clearCookie("jwt")
        .status(200)
        .redirect("/");
}