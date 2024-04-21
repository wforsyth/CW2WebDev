const path = require('path');
const adminDao = require('../models/adminModel.js');
const userDao = require('../models/userModel.js');
const pantryDao = require('../models/pantryModel.js');
const auth = require("../auth/auth.js");

//renders the admin homepage
exports.show_adminhome_page = function (req, res) {
    const admin = req.admin;

    res.render('admin/adminHome', {
        admin: admin,
        imageUrl: path.join('img', 'pantryLogo.jpg'),
        imageUrl2: path.join('img', 'TSPN_logo_enhanced.png')
    })
}

//renders the users page
exports.show_users_page = function (req, res) {
    const admin = req.admin;

    userDao.getAllUsers().then((user) => {
        res.render('admin/displayUsers', {
            admin: admin,
            user: user,
            imageUrl: path.join('img', 'pantryLogo.jpg'),
        });
    }).catch((err) => {
        console.log("Error retrieving donations:", err);
        res.status(500).send('Internal server error');
    })
}

//renders the admin pantires page
exports.show_pantries_page = function (req, res) {
    const admin = req.admin;

    pantryDao.getAllPantries().then((pantry) => {
        res.render('admin/displayPantries', {
            admin: admin,
            pantry: pantry,
            imageUrl: path.join('img', 'pantryLogo.jpg'),
        });
    }).catch((err) => {
        console.log("Error retrieving donations:", err);
        res.status(500).send('Internal server error');
    })
}

//shows register pantry page
exports.show_createpantry_page = function (req, res){
    const admin = req.admin;

    res.render('admin/createPantry', {
        admin: admin,
        imageUrl: path.join('img', 'pantryLogo.jpg'),
    });
}

//adds new pantry to database
exports.register_pantry = function (req, res) {
    if (!req.body || !req.body.pantryName) {
        res.status(400).send('Username is required');
        return;
    }

    const pantryName = req.body.pantryName;
    const admin = req.admin;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const location = req.body.location;
    const role = "Pantry";
    const inventory = [];

    if (!pantryName || !password) {
        res.status(401).send('Username or password fields cannot be empty');
        return
    }
    if (password != confirmPassword) {
        res.render('register', { title: 'Pantry Registration', errorMessage: 'Passwords do not match' });
        return;
    }
    pantryDao.lookup(pantryName, function (err, u) {
        if (u) {
            res.status(401).send('Pantry already exists');
            return;
        }

        pantryDao.create(pantryName, password, location, role, inventory);
        console.log("Register pantry:", pantryName, "Password:", password, "Location:", location, "Inventory:", inventory);

        exports.show_pantries_page(req, res);
    });
}

//deletes user from database
exports.delete_user = function (req, res){
    const userId = req.body.userId;

    userDao.delete(userId);

    exports.show_users_page(req, res);
}

//deletes pantry from database
exports.delete_pantry = function (req, res){
    const pantryId = req.body.pantryId;

    pantryDao.delete(pantryId);

    exports.show_pantries_page(req, res);
}

//logs out admin
exports.logout = function (req, res) {
    res
        .clearCookie("jwt")
        .status(200)
        .redirect("/");
}