const mongoose = require("mongoose");

const channelPartnerSchema = mongoose.Schema({
    empID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:''
    },
    stageID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Stage',
        default:'66e15ed1774c6b5fb4ab626b'
    },
    name:{
        type:String
    },
    phone:{
        type:Number
    },
    state:{
        type:String
    },
    city:{
        type:String
    },
    pinCode:{
        type:Number
    },
    address:{
        type:String
    },
    email:{
        type:String
    },
    businessName:{
        type:String
    },
    yearInBusiness:{
        type:Number
    },
    gstNumber:{
        type:String
    },
    bankAccountNumber:{
        type:String
    },
    IFSCCode:{
        type:String
    },
    sales:{
        type:String
    },
    serial:{
        type:String
    },
    create_At:{
        type:Date,
        default:Date.now
    }
});

const channelPartner = mongoose.model("ChannelPartner", channelPartnerSchema);

module.exports = channelPartner;