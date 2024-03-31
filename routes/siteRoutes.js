const express = require('express');
const router = express.Router();
const controller = require('../controllers/siteControllers.js');

//calling functions to display pages
router.get("/", controller.landing_page);
router.get('/login', controller.show_login_page);
router.get('/register', controller.show_register_page);

//Calling functions to authenticate user registration and login
router.post('/register', controller.register_user);

module.exports = router;