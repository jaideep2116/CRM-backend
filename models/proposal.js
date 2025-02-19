const mongoose = require("mongoose");

const proposalSchema = mongoose.Schema({
    stateID:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    proposalName:{
        type:String,
        required:true
    },
    fileName:{
        type:String,
        required:true
    },
    createAt:{
        type:Date,
        default:Date.now
    }
});
const proposal = mongoose.model('Proposal',proposalSchema);

module.exports = proposal;
