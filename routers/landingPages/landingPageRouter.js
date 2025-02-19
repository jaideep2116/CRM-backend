const express = require("express");
const router = express.Router(); // for creating router


const landingPageController = require("../../controllers/ladingPage/landingPageControllers");
// const {homesValidation, residentialValidation, commercialValidation, pmkusumValidation, distributorValidation, contactValidation } = require("../../helpers/landingPages/landingPageValidation");
// const {} = require("../helpers/employee/empValidation");
router.post("/homes", landingPageController.homes); //completed 1.0
router.post("/residential", landingPageController.residential); //completed 1.0
router.post("/commercial", landingPageController.commercial); //completed 1.0
router.post("/pmkusum", landingPageController.pmkusum); //completed 1.0
router.post("/distributor", landingPageController.distributor); //completed 1.0
router.post("/contact", landingPageController.contact); //completed 1.0
router.post("/addChannelPartner",landingPageController.addChannelPartner); // under Process(auto assign)
router.get("/showChannelPartner", landingPageController.showChannelPartner); // completed 1.0
router.post("/addChannelPartnerWithCustomer", landingPageController.addChannelPartnerWithCustomer); // under Process(auto assign)
module.exports = router;
