const path = require('path')
const userDao = require('../models/userModel.js');
const donationDao = require('../models/donationModel.js');
const auth = require("../auth/auth.js")

//renders home page
exports.landing_page = function (req, res) {
    res.render('home', {
        imageUrl: path.join('img', 'pantryLogo.jpg'),
        imageUrl2: path.join('img', 'TSPN_logo_enhanced.png')
    });
};

//renders login page
exports.show_login_page = function (req, res) {
    res.render('user/login', {
        imageUrl: path.join('img', 'pantryLogo.jpg'),
    });
};

//renders register page
exports.show_register_page = function (req, res) {
    res.render('user/register', {
        imageUrl: path.join('img', 'pantryLogo.jpg'),
    });
};

//renders donate page
exports.show_donation_page = function (req, res) {
    const user = req.user;

    res.render('donate', {
        user: user,
        imageUrl: path.join('img', 'pantryLogo.jpg'),
    });
}

//renders about page
exports.show_about_page = function (req, res) {
    res.render('aboutUs', {
        imageUrl: path.join('img', 'pantryLogo.jpg'),
        imageUrl2: path.join('img', 'TSPN_logo_enhanced.png')
    });
}

//renders about page when user logged in
exports.show_userabout_page = function (req, res) {
    const user = req.user;

    res.render('aboutUs', {
        user: user,
        imageUrl: path.join('img', 'pantryLogo.jpg'),
        imageUrl2: path.join('img', 'TSPN_logo_enhanced.png')
    });
}

//renders contact page when user logged in
exports.show_usercontact_page = function (req, res) {
    const user = req.user;

    res.render('contactUs', {
        user: user,
        imageUrl: path.join('img', 'pantryLogo.jpg'),
        imageUrl2: path.join('img', 'TSPN_logo_enhanced.png')
    });
}

//renders contact page
exports.show_contact_page = function (req, res) {
    res.render('contactUs', {
        imageUrl: path.join('img', 'pantryLogo.jpg'),
        imageUrl2: path.join('img', 'TSPN_logo_enhanced.png')
    });
}

//renders home page when user logged in
exports.show_userhome = function (req, res) {
    const user = req.user;

    res.render('user/userHome', {
        user: user,
        imageUrl: path.join('img', 'pantryLogo.jpg'),
        imageUrl2: path.join('img', 'TSPN_logo_enhanced.png')
    });
}

//confirms user registration and renders login page
exports.register_user = function (req, res) {
    if (!req.body || !req.body.username) {
        res.status(400).send('Username is required');
        return;
    }

    const user = req.body.username;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const location = req.body.location;
    const role = "User";

    if (!user || !password) {
        res.status(401).send('Username or password fields cannot be empty');
        return
    }
    if (password != confirmPassword) {
        res.render('register', { title: 'User Registration', errorMessage: 'Passwords do not match' });
        return;
    }
    userDao.lookup(user, function (err, u) {
        if (u) {
            res.status(401).send('User already exists');
            return;
        }

        userDao.create(user, password, role,  location);
        console.log("Register user:", user, "Password:", password, "Location:", location);

        res.redirect('/login');
    });
}

//handles user login and renders relevant page
exports.handle_login = function (req, res) {

    const user = req.user;
    const pantry = req.pantry;
    const admin = req.admin;

    if (user) {
        res.render("user/userHome", {
            user: user,
            imageUrl: path.join('img', 'pantryLogo.jpg'),
            imageUrl2: path.join('img', 'TSPN_logo_enhanced.png')
        });
    } else if (pantry) {
        res.render("pantry/pantryHome", {
            pantry: pantry,
            imageUrl: path.join('img', 'pantryLogo.jpg'),
            imageUrl2: path.join('img', 'TSPN_logo_enhanced.png')
        });
    } else if (admin) {
        res.render("admin/adminHome", {
            admin: admin,
            imageUrl: path.join('img', 'pantryLogo.jpg'),
            imageUrl2: path.join('img', 'TSPN_logo_enhanced.png')
        });
    }
}

//adds donation to donation model 
exports.handle_donation = function (req, res) {
    const user = req.user;
    const foodName = req.body.food;
    const quantity = req.body.quantity;
    const expirationDate = req.body.expirationDate;

    if (!user) {
        res.status(401).send('User not authenticated');
        return
    }

    donationDao.addDonation(user.user, user.location, foodName, quantity, expirationDate);
    res.render("user/userHome", {
        user: user,
        imageUrl: path.join('img', 'pantryLogo.jpg'),
        imageUrl2: path.join('img', 'TSPN_logo_enhanced.png')
    });
}

//logs out user
exports.logout = function (req, res) {
    res
        .clearCookie("jwt")
        .status(200)
        .redirect("/");
}


