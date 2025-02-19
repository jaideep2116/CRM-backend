const mongoose = require("mongoose");

const homeSchema = mongoose.Schema({
    country:{
        type:String,
        require:true
    },
    state:{
        type:String,
        require:true
    },
    name:{
        type:String,
        require:true
    },
    whatsApp:{
        type:String,
        require:true
    },
    cityOrDistrictOrRegion:{
        type:String,
        require:true
    },
    pinCode:{
        type:Number
    },
    remark:{
        type:String
    },
});

const home = mongoose.model("Home", homeSchema);

module.exports = home;
