const mongoose = require("mongoose");

const revisitSchema = mongoose.Schema({
    clientID:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    revisitDate:{
        type:Date,
        required:true
    },
    createAt:{
        type:Date,
        default:Date.now
    }
});
const  revisit= mongoose.model('Revisit',revisitSchema);

module.exports = revisit;
