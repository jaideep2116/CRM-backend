require("dotenv").config();
const axios = require('axios');
const wlcMsg =async(phoneNumber) =>{
    try {
        const aiSencyToken= process.env.AISENSY_TOKEN;
        const aiSency = {
            apiKey: aiSencyToken,
            campaignName: "Gautam Solar",
            destination: phoneNumber.toString(),
            userName: "Galo solar",
            templateParams: [],
            source: "new-landing-page form",
            media: {
                url: "https://whatsapp-media-library.s3.ap-south-1.amazonaws.com/IMAGE/6353da2e153a147b991dd812/4958901_highanglekidcheatingschooltestmin.jpg",
                filename: "sample_media"
            }
        }
        // console.log(aiSency)
        const response = await axios.post("https://backend.aisensy.com/campaign/t1/api/v2", aiSency);
        // console.log(response.data)
        return response.data.success;
    } catch (error) {
        console.log(error)
        return false;
    }
}
module.exports = wlcMsg;