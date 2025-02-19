const mongoose=require("mongoose")

const Details= new mongoose.Schema({
    Videos:{
        type:String,
         default:null,
        },
        AadharCard:{
            type:String,
            default:null
        },
        PanCard:{
            type:String,
            default:null
        },
        ElectrcityBill:{
            type:String,
            default:null
        },
        AccountNo:{
            type:Number
        },
        IFSC:{
            type:String,
        },
        BankAddress:{
            type:String,
        },
})
const Extradetail=mongoose.model("ExtraDetail",Details);
module.exports=Extradetail;