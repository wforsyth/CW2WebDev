const express = require('express');
const router = express.Router();
const controller = require('../controllers/siteControllers.js');

//calling functions to display pages
router.get("/", controller.landing_page);
router.get('/login', controller.show_login_page);

module.exports = router;