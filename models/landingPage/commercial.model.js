const mongoose = require("mongoose");

const commercialSchema = mongoose.Schema({
    country:{
        type:String,
        require:true
    },
    state:{
        type:String,
        require:true
    },
    companyName:{
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
    cityOrDistrictOrRegion:{
        type:String,
        require:true
    },
    pinCode:{
        type:Number
    },
    typesOfProperty:{
        type:String,
        require:true
    },
    remark:{
        type:String
    },
});

const commercial = mongoose.model("Commercial", commercialSchema);

module.exports = commercial;