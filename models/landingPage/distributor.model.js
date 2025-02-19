const mongoose = require("mongoose");

const distributorSchema = mongoose.Schema({
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
    state:{
        type:String,
        require:true
    },
    businessName:{
        type:String,
        require:true
    },
    yearsInBusiness:{
        type:Number,
        require:true
    },
    dealershipInterest:{
        type:String,
        require:true
    },
    productOfInterest:{
        type:String,
        require:true
    },
    estimatedInvestment:{
        type:String,
        require:true
    },
    remark:{
        type:String
    }
});

const distributor = mongoose.model("Distributor", distributorSchema);

module.exports = distributor;