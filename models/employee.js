//shiv
const mongoose = require("mongoose");

const employeeSchema = mongoose.Schema({
    empID:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true
    },
    department:{ 
        type:mongoose.Schema.Types.ObjectId,
        ref:'Department'
    },
    teamLeader:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'TeamLeader'
    },
    mobile:{
        type:Number,
        required:true
    },
    stateID:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:'State'
    },
    district:{ 
        type:[String]
    },
    date:{
        type:Date,
        default:Date.now
    },
    refreshToken:{
        type:String
    }
});
//
// employeeSchema.pre('save', async function (next) {
//     const employee = this;

//     // If the employeeID is not yet set, generate a new one
//     if (!employee.empID) {
//         const lastEmployee = await Employee.findOne().sort({ empID: -1 });

//         let newID = 1;

//         if (lastEmployee && lastEmployee.employeeID) {
//             // Extract the numeric part of the last employeeID and increment it
//             newID = parseInt(lastEmployee.employeeID.slice(2)) + 1;
//         }

//         // Set the new employeeID, formatting it as AD001, AD002, etc.
//         employee.employeeID = `EMP${newID.toString().padStart(3, '0')}`;
//     }

//     next();
// });
const employee = mongoose.model("Employee",employeeSchema);

module.exports = employee;