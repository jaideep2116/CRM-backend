const mongoose = require("mongoose");

const assignEmployeeSchema = mongoose.Schema({
    clientID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Client',
        required:true
    },
    fieldEmpID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Employee',
        default:null
    },
    visitingDate:{
        type:Date,
        required:true
    },
    createAt:{
        type:Date,
        default:Date.now
    }
});

const AssignEmployee = mongoose.model("AssignEmployee", assignEmployeeSchema);
module.exports = AssignEmployee;