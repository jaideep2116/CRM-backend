const mongoose = require("mongoose");

const stateSchema = mongoose.Schema({
    countryID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Country",
        required:true,
    },
    state: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("State", stateSchema);