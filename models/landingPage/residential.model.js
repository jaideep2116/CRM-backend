const mongoose = require("mongoose");

const residentialSchema = mongoose.Schema({
    country:{
        type:String,
        require:true
    },
    name:{
        type:String,
        require:true
    },
    phone:{
        type:Number,
        require:true
    },
    state:{
        type:String,
        require:true
    },
    cityOrDistrictOrRegion:{
        type:String,
        require:true
    },
    pinCode:{
        type:Number,
    },
    AGMApprovalStatus:{
        type:String,
        require:true
    },
    designation:{
        type:String,
        require:true
    },
    remark:{
        type:String,
    },
});

const residential = mongoose.model("Residential", residentialSchema);

module.exports = residential;