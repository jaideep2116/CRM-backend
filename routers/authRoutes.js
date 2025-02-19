const express = require("express");
const verifyToken = require('../middlewares/authMiddleware')
const router = express.Router(); // for creating router


const authController = require("../controllers/authController");

const { empLoginValidation, empRegisterValidation,addTeamLeaderValidation } = require("../helpers/employee/empValidation");
router.post("/adminAdd", authController.adminAdd); //completed 2.0
router.post("/addTeamLeader",addTeamLeaderValidation,authController.addTeamLeader); //completed 2.5
router.get("/showTeamLeader",authController.showTeamLeader); //completed 3.0
router.get("/showTeamLeaderName", authController.showTeamLeaderName) //completed 3.0
router.get("/teamLeaderProfile", authController.teamLeaderProfile); 
router.post("/deleteTeamLeader",authController.deleteTeamLeader); //completed 2.0
router.post("/login", empLoginValidation, authController.empLogin); //completed 2.0
router.get("/logout", verifyToken, authController.logout)
router.post("/empRegister",empRegisterValidation,authController.empRegister); //completed 2.0
router.get("/fetchAllEmployee",authController.fetchAllEmployee ); // completed 3.0
router.post("/employeeDelete",authController.empDelete); //completed 2.0
router.get("/findEmpID", authController.findEmpID); // completed  2.0
router.put("/teamLeaderProfileUpdate", authController.teamLeaderProfileUpdate);

module.exports = router;