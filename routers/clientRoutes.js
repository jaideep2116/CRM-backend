const express = require("express");
const router = express.Router(); // for creating router
const multer = require('multer');

const clientController =require("../controllers/clientController");
const authMiddleware = require("../middlewares/authMiddleware");
const { clientRegisterValidation  } = require("../helpers/client/clientValidation");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/clientAdd",clientRegisterValidation, clientController.clientAdd); //completed 2.0
router.get("/fetchClients", clientController.fetchClients); // completed 3.0
router.put('/updateClient',clientController.updateClient); //completed 2.0
router.post('/fetchByFile',  upload.single('file'), clientController.fetchByFile); //completed 2.0
router.get("/fetchAssignEmployee", clientController.fetchAssignEmployee); //completed 1.5
router.put("/bulkAssign", clientController.bulkAssign) //completed 2.0
// router.post()
module.exports = router;