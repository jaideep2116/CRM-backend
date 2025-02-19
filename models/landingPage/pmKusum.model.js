const mongoose = require("mongoose");

const pmKusumSchema = mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    phone:{
        type:Number,
        require:true
    },
    cityOrDistrictOrRegion:{
        type:String,
        require:true
    },
    pinCode:{
        type:Number
    },
    pmKusumOptions:{
        type:String,
        require:true
    },
    remark:{
        type:String
    },
});

const pmKusum = mongoose.model("PmKusum", pmKusumSchema);

module.exports = pmKusum;