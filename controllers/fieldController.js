const Department = require('../models/department');
const {validationResult} = require('express-validator');
const Stage = require('../models/stage');
const State = require('../models/state');
const District = require('../models/district');
const download = require('../helpers/common/excelDownload');
const XLSX = require("xlsx");
const Proposal = require('../models/proposal');
const Country = require('../models/country');
const path = require('path');
const fs = require('fs');
// const Remark = require('../models/remark');
const addDepartment = async(req,res) =>{
    try {
        const { department } = req.body;
        // console.log(department);
        if (!department) {
            return res.status(400).json({ 
                success:false,
                message: 'Department name is required'
            });
        }
        const isExist =  Department.findOne({department});
        if(!isExist){
            return res.status(400).json({ 
                success:false,
                message: ' Department Already Exist!'
            });
        }
        const newDepartment = new Department({
            department
        });
        const savedDepartment = await newDepartment.save();
        if(!savedDepartment){
            return res.status(400).json({ 
                success:false,
                message: 'Something is Missing !'
            });
        }
        res.status(201).json({ 
            success:true,
            message: 'Department Added Successfully', 
            department: savedDepartment 
        });

    } catch (error) {
        if (error.code === 11000) { // Duplicate key error code
            res.status(400).json({
                success:false,
                message: 'Department Already Exists. !' 
            });
        }
        return res.status(400).json({
            success:false,
            msg:error.message
        });
    }
}
const deleteDepartment = async(req,res) =>{
    try {
        const { department } = req.body;
        if (!department) {
            return res.status(400).json({ 
                success:false,
                message: 'Email is required' 
            });
        }

        const deletedDepartment = await Department.findOneAndDelete({ department });

        if (!deletedDepartment) {
            return res.status(404).json({ 
                success:false,
                message: 'Department not found !' 
            });
        }
        res.status(200).json({ 
            success:true,
            message: 'Department deleted successfully', 
            employee: deletedDepartment 
        });
    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error.message
        });
    }
}
const showDepartment = async(req,res) =>{
    try {
        const {department} = req.query;
        const filter={};
        if(department)  filter.department =  department;
        const departments = await Department.find(filter);
        return res.status(200).json({
            success:true,
            departments:departments
        });
    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error.message
        });
    }
}
const addStage = async(req,res) =>{
    try {
        const {stage} = req.body;
        if (!stage) {
            return res.status(400).json({ 
                success:false,
                message: 'Stage name is required?'
            });
        }
        const isExist = await Stage.findOne({stage});
        // console.log(isExist);
        if(isExist){
            return res.status(400).json({ 
                success:false,
                message: `${stage} Already Exist!`
            });
        }
        const newStage = new Stage({ stage })
        const saveStage = await newStage.save();
        if(!saveStage){
            return res.status(400).json({ 
                success:false,
                message: 'Something is Missing !'
            });
        }
        return res.status(200).json({ 
            success:true,
            message: 'Stage Added Successfully.',
            stage:saveStage
        });

    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error.message
        });
    }
    
}

const showStage = async(req,res) =>{
    try {
        const id = req.query.id;
        let stageValue = 0;
        if(id){
            const stageData = await Stage.findById(id)
            .select({stageValue:1});
            stageValue = stageData.stageValue;
        }
        const stages = await Stage.find({stageValue : {$gte : stageValue}}).select({stage:1});
        return res.status(201).json({
            success:true,
            stages:stages
        });
    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error.message
        });
    }
}
const addState = async(req,res) =>{
    try {
        const {countryID, statesData} = req.body; // Expecting an array of states
        // console.log(statesData)
        if (!statesData || !Array.isArray(statesData) || statesData.length === 0) {
            return res.status(400).json({ 
                success:false,
                message: 'Invalid input data. Expecting an array of states.'
             });
        }
        const isExistCountry = await Country.findOne({_id:countryID});
        if(!isExistCountry){
            return res.status(400).json({
                success:false,
                msg:"country is not exist"
            })
        }
        const stateDocuments = statesData.map((stateName) => ({
            countryID: countryID,  // Set the countryID for all state entries
            state: stateName       // Assign the state name from the statesData array
        }));
        await State.insertMany(stateDocuments);
        res.status(201).json({ 
            success:true,
            message: 'States added successfully',
            data:stateDocuments
        });
    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error.message
        });
    }
}
const showState = async( req,res ) =>{
    const {countryID} = req.query;
    try {
        const filters ={};
        if(countryID != undefined) filters.countryID =  countryID;
        else filters.countryID="6711fee81cb4aa4e5b7f694b";
        const States = await State.find(filters).sort({state : 1}).select("-__v");
        if (!States || States.length === 0) {
            return res.status(404).json({ 
                success:false,
                error: "No states found for the given countryID." 
            });
        }
        return res.status(201).json({
            success: true,
            states: States
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            msg:error.message
        });
    }
}

const addDistrict = async(req,res) =>{
    try {
        const { stateID, district } = req.body;
        // Check if stateId and districts are provided
        if (!stateID || !district || !Array.isArray(district)) {
        return res.status(400).json({
            success: false,
            message: "Invalid input data. Expecting a valid state and an array of districts.",
        });
        }
        const state = await State.findById(stateID);
        if (!state) {
            return res.status(404).json({
                success: false,
                message: "State not found",
            });
        }
        const newDistricts = new District({
        stateID,
        district
        });
        const savedDistricts = await newDistricts.save();
        res.status(201).json({
        success: true,
        message: "Districts added successfully",
        districts:savedDistricts
        });
    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error.message
        });
    }
}
const showDistrict = async(req,res) =>{
    try {
        const stateID = req.body.stateID || req.query.stateID || req.param.stateID;
        const Districts = await District.findOne({stateID}).exec();
        return res.status(200).json({
            success:true,
            Districts:Districts
        });
    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error.message
        });
    }
}

// const addRemark = async (req,res) =>{
//     try {
//         const errors = validationResult(req);
//         if(!errors.isEmpty()){
//             return res.status(500).json({
//             success:false,
//             msg:'Errors',
//             errors:errors.array()
//             })
//         }
//         const {clientID, employeeID, teamLeaderID, adminID, remark } = req.body;
//         if(!employeeID && !teamLeaderID && !adminID){
//             return res.status(401).json({
//                 success:false,
//                 msg:'Login First'
//             })
//         }

//         const newRemark = new Remark({
//             clientID, employeeID, teamLeaderID, adminID, remark
//         });
//         if(await newRemark.save()){
//             return res.status(201).json({
//                 success:true,
//                 msg:'Added remark successfully.'
//             })
//         }
//         return res.status(401).json({
//             success:false,
//             msg:'Something is Missing please try again.'
//         })

//     } catch (error) {
//         return res.status(400).json({
//             success:false,
//             msg:error.message
//         });
//     }
// }
// const showRemark = async(req,res) =>{
//     try {
//         const clientID = req.query.clientID || req.body.clientID || req.param.clientID;
//         if(!clientID){
//             return res.status(401).json({
//                 success:false,
//                 msg:'clientID Not Exist!'
//             })
//         }
//         const remarkData = await Remark.find({clientID}).sort({currentDate: -1});
//         return res.status(201).json({
//             return :true,
//             remarks:(remarkData)?remarkData :'No Data Found.'
//         })
//     } catch (error) {
//         return res.status(400).json({
//             success:false,
//             msg:error.message
//         });
//     }
// }
const downloadExcel = async(req,res) =>{
    try {
        const jsonData = req.body;
        if (!jsonData || jsonData.length === 0) {
            return res.status(400).json({
                success:false, 
                msg: "There is no record for this employee"
             });
        }
    
        // Convert JSON data to a worksheet
        const ws = XLSX.utils.json_to_sheet(jsonData);
    
        // Create a new workbook and append the worksheet
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Data");
    
        // Define the file name
        const fileName = "converted_data.xlsx";
    
        // Write the Excel file to a buffer (in-memory)
        const buffer = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });
    
        // Set the response headers to force download in the browser
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${fileName}"`
        );
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.send(buffer);  
    } catch (error) {
        return res.status(400).json({
            success:false,
            error:error.msg
        })
    }
}
const addProposal = async(req,res) =>{
    try {
        if (!req.file) return res.status(400).json({success:false, msg: 'No file uploaded or invalid file type' });
        const { proposalName, stateID } = req.body;
        const fileName= req.file.filename;
        const newProposal = new Proposal({
            stateID, proposalName, fileName
        });
        const responseProposal = await newProposal.save();
        // console.log("responseProposal" , responseProposal);
        if(responseProposal){
            return res.status(200).json({
                success:true,
                msg:"Successfully Insert Proposal."
            })
        }

    } catch (error) {
        // console.log(error)
        return res.status(400).json({
            success:false,
            error:error
        })
    }
}

const addCountries = async(req,res) =>{
    try {
        const { countries } = req.body; // Expecting an array of country names

        if (!Array.isArray(countries)) {
            return res.status(400).json({ success:false, error: "Input should be an array of country names." });
        }
        const countryDocuments = countries.map((countryName) => ({
            country: countryName,
        }));

        const result = await Country.insertMany(countryDocuments, { ordered: false });
        return res.status(200).json({ 
            success: true,
            countries:result, 
            msg:"Successfully countries name added." 
        });
    } catch (error) {
        console.log(error)
        if (error.code === 11000) {
            return res.status(400).json({ success:false, error: "One or more countries already exist in the database." });
        } else {
            return res.status(400).json({
                success:false,
                error:error
            })
        }
    }
}
const showCountries = async(req,res)=>{
    try {
        const country = await Country.find();
        console.log(country)
        return res.status(200).json({
            success:true,
            country
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            error:error
        })
    }
}
const downloadProposal = async(req,res) =>{
    try {
        const fileName =  req.query.fileName;
        console.log(fileName)
        const uploadFolder = path.join(__dirname, '../uploads');
        const filePath = path.join(uploadFolder, fileName);
        if (fs.existsSync(filePath)) {
            res.setHeader('Content-Type', 'application/pdf');  // Set the content type
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);  // Force download
            // Set headers to prompt download
            res.download(filePath, fileName, (err) => {
                if (err) {
                    console.error('Error during file download:', err);
                    res.status(500).send({success:false, error: 'Error during file download' });
                }
            });
        } else {
            // If the file does not exist, return a 404 response
            res.status(404).json({success:false, error: 'File not found' });
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success:false,
            error:error
        })
    }
}
const districtStatusReset = async(req,res) =>{
    const stateID  = req.query.stateID;
    try {
        const result = await District.updateMany(
            { stateID: stateID },
            { $set: { 'district.$[].status': false } }  // Update all statuses to false
        );
        if (result.modifiedCount > 0) {
            res.status(200).json({ message: "District statuses updated to false" });
        } else {
            res.status(404).json({ message: "No districts found for the provided stateID"});
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success:false,
            error:error
        })
    }
}
module.exports ={
    addDepartment,
    deleteDepartment,
    showDepartment,
    addStage,
    showStage,
    addState,
    showState,
    addDistrict,
    showDistrict,
    // addRemark,
    // showRemark,
    downloadExcel,
    addProposal,
    addCountries,
    showCountries,
    downloadProposal,
    districtStatusReset
}