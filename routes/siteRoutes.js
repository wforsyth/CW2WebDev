const express = require('express');
const router = express.Router();
const controller = require('../controllers/siteControllers.js');
const {login} = require('../auth/auth.js');
const {verify} = require('../auth/auth.js');

//calling functions to display pages
router.get("/", controller.landing_page);
router.get('/login', controller.show_login_page);
router.get('/register', controller.show_register_page);
router.get('/donate', controller.show_donation_page);
router.get('/aboutUs', controller.show_about_page);
router.get('/contactUs', controller.show_contact_page);

//calling functions to display user pages
router.get('/userAbout', verify, controller.show_userabout_page);

//Calling functions to authenticate user registration and login
router.post('/register', controller.register_user);
router.post('/login', login, controller.handle_login);

//Error handling
router.use(function (req, res) {
    res.status(404);
    res.type('text/plain');
    res.send('404 Not found.');
})

router.use(function (err, req, res, next) {
    res.status(500);
    res.type('text/plain');
    res.send('Internal Server Error.');
})

module.exports = router;