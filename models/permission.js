//shiv
const mongoose = require("mongoose");

const permissionSchema = mongoose.Schema({
   user_id:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'Employee'
   },
   permission:[{
    permission_name:String,
    permission_value:[String]
   }],
});
const permission = mongoose.model("Permission",permissionSchema);

module.exports = permission;