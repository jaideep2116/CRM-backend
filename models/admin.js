const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email: {
        type: String,
        required: true
    },
    mobile:{
        type:Number,
        required:true
    },
    department:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Department'
    },
    refreshToken:{
        type:String
    }
});

const admin = mongoose.model("Admin", adminSchema);

module.exports = admin;
