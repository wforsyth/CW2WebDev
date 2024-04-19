const express = require('express');
const router = express.Router();
const controller = require('../controllers/siteControllers.js');
const pantryController = require('../controllers/pantryControllers.js');
const adminController = require('../controllers/adminControllers.js');
const {verifyPantry} = require('../auth/auth.js');
const {verifyAdmin} = require('../auth/auth.js');
const {login} = require('../auth/auth.js');
const {verify} = require('../auth/auth.js');

//calling functions to display pages
router.get("/", controller.landing_page);
router.get('/login', controller.show_login_page);
router.get('/register', controller.show_register_page);
router.get('/donate', verify, controller.show_donation_page);
router.get('/aboutUs', controller.show_about_page);
router.get('/contactUs', controller.show_contact_page);
router.get('/logout', verify, controller.logout);

//Calling pantry functions 
router.get('/pantryLogout', verifyPantry, pantryController.logout);
router.get('/pantryDonate', verifyPantry, pantryController.show_donations_page);
router.post('/acceptDonation', verifyPantry, pantryController.accept_donation);
router.get('/pantryHome', verifyPantry, pantryController.show_pantryhome_page);

//Calling admin functions
router.get('/adminLogout', verifyAdmin, adminController.logout);
router.get('/adminHome', verifyAdmin, adminController.show_adminhome_page);
router.get('/viewUsers', verifyAdmin, adminController.show_users_page);
router.get('/viewPantries', verifyAdmin, adminController.show_pantries_page);
router.get('/createPantryPage', verifyAdmin, adminController.show_createpantry_page);
router.post('/registerPantry', verifyAdmin, adminController.register_pantry);

//Calling user functions
router.post('/userDonation', verify, controller.handle_donation);

//calling functions to display user pages
router.get('/userAbout', verify, controller.show_userabout_page);
router.get('/userContact', verify, controller.show_usercontact_page);
router.get('/userHome', verify, controller.show_userhome);

//Calling functions to authenticate user registration and login
router.post('/register', controller.register_user);
router.post('/login', login, controller.handle_login);

//Error handling
/*router.use(function (req, res) {
    res.status(404);
    res.type('text/plain');
    res.send('404 Not found.');
})*/

/*router.use(function (err, req, res, next) {
    res.status(500);
    res.type('text/plain');
    res.send('Internal Server Error.');
})*/

module.exports = router;