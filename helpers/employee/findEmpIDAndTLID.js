const Employee = require("../../models/employee");
const findEmpIDAndTLID = async(empID) =>{
    try {
        const empData = await Employee.findOne({empID:{$regex : empID, $options:"i"} }).select("_id teamLeader");
        const mongooseEmpID = empData._id.toString();
        const TLID = empData.teamLeader.toString();
        return {
            empID:mongooseEmpID,
            TLID
        }
    } catch (error) {
        console.log(error);
        return empData ={
            empID:null,
            TLID:null
        }
    }
}


module.exports = findEmpIDAndTLID;