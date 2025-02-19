const mongoose = require("mongoose");

const followUpSchema = mongoose.Schema({
    clientID:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    followUpDate:{
        type:Date,
        required:true
    },
    remark:{
        type:String
    },
    createAt:{
        type:Date,
        default:Date.now
    }
});
const  followUp= mongoose.model('FollowUp',followUpSchema);

module.exports = followUp;
