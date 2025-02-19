const mongoose = require("mongoose");

const teamLeaderSchema = mongoose.Schema({
    empID:{
        type:String,
        unique:true
    },
    name:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        required:true
    },
    department:{ 
        type:mongoose.Schema.Types.ObjectId,
        ref:'Department',
        default:"66e13988a9afb40e2bbbd828"
    },
    stateID:{
        type:[mongoose.Schema.Types.ObjectId],
        required:true,
        ref:'State'
    },
    refreshToken:{
        type:String
    }
});
const teamLeader = mongoose.model("TeamLeader",teamLeaderSchema);

module.exports = teamLeader;