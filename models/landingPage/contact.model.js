const mongoose = require("mongoose");

const contactSchema = mongoose.Schema({
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
    solarFor:{
        type:String,
        require:true
    },
    remark:{
        type:String
    }
});

const contact = mongoose.model("Contact", contactSchema);

module.exports = contact;