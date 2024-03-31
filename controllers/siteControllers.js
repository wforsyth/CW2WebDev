const path = require('path')
const userDao = require('../models/userModel.js');


//Methods for showing new mustache templates
exports.landing_page = function (req, res) {
    res.render('home', {
        imageUrl: path.join('img', 'pantryLogo.jpg'),
        imageUrl2: path.join('img', 'TSPN_logo_enhanced.png')
    });
};

exports.show_login_page = function (req, res){
    res.render('user/login',{
        imageUrl: path.join('img', 'pantryLogo.jpg'),
    });
};

exports.show_register_page = function (req, res){
    res.render('user/register',{
        imageUrl: path.join('img', 'pantryLogo.jpg'),
    });
};

//Methods for confirming user registration and login
exports.register_user = function (req, res){
    if (!req.body || !req.body.username) {
        res.status(400).send('Username is required');
        return;
    }

    const user = req.body.username; 
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if(!user || !password){
        res.status(401).send('Username or password fields cannot be empty');
        return
    }

    if(password != confirmPassword){
        res.render('register', {title: 'User Registration', errorMessage: 'Passwords do not match'});
        return;
    }

    userDao.lookup(user, function (err, u){
        if(u){
            res.status(401).send('User already exists');
            return;
        }

        userDao.create(user, password);
        console.log("Register user:", user, "Password:", password);

        res.redirect('/login');
    });
}
