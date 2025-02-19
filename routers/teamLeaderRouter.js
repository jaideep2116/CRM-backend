const express = require('express');
const router = express.Router();
const TLController = require('../controllers/TLController');

router.get("/fetchClients",  TLController.showClients);
router.get("/fetchteam")

module.exports = router;