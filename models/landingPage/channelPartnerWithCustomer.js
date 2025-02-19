const mongoose = require("mongoose");

const channelPartnerWithCustomerSchema = mongoose.Schema({
    serial:{
        type:String,
        ref:"ChannelPartner"
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
    solarFor:{
        type:String
    },
    remark:{
        type:String
    },
    create_At:{
        type:Date,
        default:Date.now
    }
});

const channelPartnerWithCustomer = mongoose.model("ChannelPartnerWithCustomer", channelPartnerWithCustomerSchema);

module.exports = channelPartnerWithCustomer;