const express = require("express");
const router = express.Router(); // for creating router
// const axios = require('axios')
const upload = require("../helpers/common/multer");
const fieldController =require("../controllers/fieldController.js");

router.post("/addDepartment",fieldController.addDepartment);  //completed 1.0
router.post("/deleteDepartment",fieldController.deleteDepartment); //completed 1.0
router.get("/showDepartment", fieldController.showDepartment); //completed 1.0
router.post("/addStage", fieldController.addStage); // completed 1.0
router.get('/showStage',fieldController.showStage); // completed 1.0
router.post('/addState', fieldController.addState); // completed 1.0
router.get("/showState",fieldController.showState); // completed 3.0
router.post('/addDistrict', fieldController.addDistrict); // completed 1.0
router.get("/showDistrict",fieldController.showDistrict);
router.post("/download-excel", fieldController.downloadExcel); // completed 1.0
router.post("/addProposal", upload.single("pdf"), fieldController.addProposal); // completed 1.0
router.post("/addCountries", fieldController.addCountries); // completed 1.0
router.get("/showCountries", fieldController.showCountries); // completed 3.0

router.get("/downloadProposal", fieldController.downloadProposal); // under process 
router.put("/districtStatusReset",fieldController.districtStatusReset); // under process
module.exports = router;