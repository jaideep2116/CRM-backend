const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
    senderID:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    receiverID:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    seen:{
        type:Boolean,
        default:false
    },
    createAt:{
        type:Date,
        default:Date.now
    }
});
const  message= mongoose.model('Message',messageSchema);

module.exports = message;
