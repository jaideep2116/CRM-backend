//shiv
const mongoose = require("mongoose");

const errorClientSchema = mongoose.Schema({
    name:{
        type:String,
        // required:true
    },
    email:{
        type:String
    }, 
    empID:{ // its hold employee id
        type:String
        // type:mongoose.Schema.Types.ObjectId,
        // ref:'Employee',
        // default:null
    },
    mobile:{
        type:Number,
        // required:true,
        // unique:true
    },
    source:{
        type:String,
        // required:true,
        // default:'Facebook'
    },
    stageID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Stage',
        default:'66e15ed1774c6b5fb4ab626b'
    },
    stateID:{
        type:String
        // type:mongoose.Schema.Types.ObjectId,
        // ref:'State',
        // default:null
    },
    district:{
        type:String,
        // default:null
    },
    city:{
        type:String,
        // default:null
    },
    zipCode:{
        type:Number
    },
    kwpInterested:{
        type:String,
        default:'N/A'
    },
    type:{
         type:Number,
         default:1
    },
    CurrentDate:{
        type: Date, 
        default: Date.now
    },
    errors:{
        type:String
    }
});
const errorClient = mongoose.model("ErrorClient",errorClientSchema);

module.exports = errorClient;