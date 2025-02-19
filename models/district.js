const mongoose = require("mongoose");

const districtSchema = mongoose.Schema({
    stateID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'State'
    },
    district:[{
        name:{
            type:String,
            required:true
        },
        status:{
            type:Boolean,
            default:false
        }
    }]
});

const District = mongoose.model("District", districtSchema);

module.exports = District;
