const mongoose = require("mongoose");

const stageActivitySchema = mongoose.Schema({
    clientID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Client',
        required:true
    },
    empID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Employee'
    },
    stageID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Stage',
        default:'66e15ed1774c6b5fb4ab626b'
    },
    remark:{
        type:String
    },
    stageUpdateDate:{
        type:Date,
        default:Date.now
    }
});
const  stageActivity= mongoose.model('StageActivity',stageActivitySchema);

module.exports = stageActivity;
