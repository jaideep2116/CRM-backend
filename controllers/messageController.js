require("dotenv").config();
const wlcMsg = require('../helpers/aiSensy/welcomeTemplate');
const welcomeMessageByW = async(req,res) =>{
    try {
        const phoneNumber = req.body.phoneNumber;
        const response = await wlcMsg(phoneNumber);
        if(response == 'true'){
            return res.status(200).json({
                success:true,
                msg:"Welcome message send successfully."
            })
        }
        return res.status(400).json({
            success:false,
            msg:"something is missing"
        })

    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error.message
        })
    }
}

module.exports ={
    welcomeMessageByW
}