const express = require("express");
const verifyToken = require('../middlewares/authMiddleware')
const router = express.Router();
const empC = require("../controllers/empController");
const upload=require("../middlewares/Multer")
const multer= require("multer");

const tempFun = ()=>{
    console.log("Hi")
}

router.post("/assignEmployee", empC.assignEmployee?empC.assignEmployee:tempFun);
router.get("/todayLead", empC.todayLead?empC.todayLead:tempFun);
router.get("/showVisitingList", empC.showVisitingList?empC.showVisitingList:tempFun); // completed 1.0
router.post("/updateClientByFieldEmp", verifyToken , empC.updateClientByFieldEmp?empC.updateClientByFieldEmp:tempFun); // do work 
router.get("/remark", verifyToken, empC.remark?empC.remark:tempFun);
router.get("/Employee",empC.empdetail ?empC.empdetail:tempFun);
router.get("/fetchLeads",verifyToken, empC.fetchLeads)
router.post("/addtionalclientDetails",upload.fields([
    {name:'aadhaarPhotos', maxCount:1},
   {name:'pancard',maxCount:1},
   {name:'electricitybill',maxCount:1},
   {name:'Video',maxCount:1},
]),empC.updateclient);
router.put("/UpdateEmployee",empC.updateEmployee?empC.updateEmployee:tempFun);

// empController.emp();

module.exports = router;
