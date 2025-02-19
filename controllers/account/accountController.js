const Electrical = require('../../models/account/electrical');

const excelToJSON = require('../../helpers/common/excel/excelToJSON');

const excelUploads = async(req,res) =>{
    try {

        const JSON_Data = await excelToJSON(req.file);
        
        const deleteResponse = await Electrical.deleteMany({});
        const operations = JSON_Data.map(data => ({
            updateOne: {
                filter: { model_number: data.model_number }, // Check if model_number exists
                update: {
                    $set: { ...data, updated_At: new Date() }, // Update or insert
                },
                upsert: true, // This ensures that a new record is created if one with the same model_number does not exist
            }
        }));

        // Bulk write operation to insert or update all documents
        const electricalDataResponse = await Electrical.bulkWrite(operations);
        if(electricalDataResponse){
            return res.status(200).json({
                success:true,
                msg:'Excel Upload successfully.',
                deleteResponse:(deleteResponse) ? 'Old data delete successfully.' : "something is missing"
            })
        }
        return res.status(400).json({
            success:false,
            msg:'Something is wrong please connect with developer.'
        })

    } catch (error) {
        // console.log(error);
        return res.status(400).json({
            success:true,
            msg:error
        })
    }
}

const fetchModuleData = async(req,res) =>{
    try {
        const moduleList = req.body.moduleList;
        const responseData = await Electrical.find({model_number : { $in : moduleList}}).select(" -__v -create_At -updated_At");
        return res.status(200).json({
            success:true,
            modules:(responseData) ? responseData : 'No Data Found'
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success:false,
            msg:'Something is wrong please connect with developer.'
        })
    }
}
const modelNumbers = async(req,res) =>{
    try {
        const modelNumbersList = await Electrical.find().select("model_number");
        return res.status(200).json({
            success:true,
            modelNumbers:modelNumbersList
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:"something is wrong please connect with developer."
        })
    }
}

module.exports ={
    excelUploads,
    fetchModuleData,
    modelNumbers
}