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
        Dimension:{
            type:String,
            default:null
        },
        CancelCheack:{
            type:String,
            default:null,
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
        ProposalPdf:{
            type:String,
            default:null,
        }
})
const Extradetail=mongoose.model("ExtraDetail",Details);
module.exports=Extradetail;