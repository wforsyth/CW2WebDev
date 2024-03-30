const express = require('express');
const router = express.Router();
const controller = require('../controllers/siteControllers.js');

router.get("/", controller.landing_page);

module.exports = router;