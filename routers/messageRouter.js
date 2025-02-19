const express = require("express");
const router = express.Router(); // for creating router
const messageController = require('../controllers/messageController.js')

router.post("/wlcMsgByWA", messageController.welcomeMessageByW);
module.exports = router;