const assignEmp = require("../models/assignEmployee");
const client = require("../models/client");
const employee = require("../models/employee")
const District= require("../models/district")

const startDateConvertor  = require('../helpers/common/dateConversion/startDate');
const endDateConvertor = require("../helpers/common/dateConversion/endDate");
const StageActivity = require('../models/stageActivity');
const ExtraDetail= require("../models/Extradetails");
const Extradetail = require("../models/Extradetails");
const assignEmployee = async(req,res) =>{
    try {
        const {clientID, callingEmpID, fieldEmpID} = req.body;
        const findData = {clientID};
        const updateData = {callingEmpID, fieldEmpID};
        const updateResult = await assignEmp.findOneAndUpdate(
            findData,
            { $set: updateData },
            { new: true, upsert: true, runValidators: true } // Options: create if not found, return updated doc, and validate
        );
        return res.status(200).json({
            success:true,
            updateData: updateResult
        });
    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error.message
        });
    }
}
const todayLead = async(req,res) => {
    
    try{
        const {date, empID, startDate, stageID, endDate, TLID} = req.query;
        
        let filters = {};
        if(date){
            filters.CurrentDate = {
                $gte: await startDateConvertor(date),
                $lte: await endDateConvertor(date)
            };
        }
        if(startDate && endDate){
            filters.CurrentDate = {
                $gte: await startDateConvertor(startDate),
                $lte: await endDateConvertor(endDate)
            };
        }
        (empID)? filters.empID = empID : null;
        (stageID)? filters.stageID = stageID : null;
        (TLID)? filters.TLID = TLID : null;
        // console.log(filters)
        const todaysLead = await client.countDocuments(filters);
        return res.status(201).json({
            success:true,
            todaysLead:todaysLead
        })
    }catch (error) {
        return res.status(400).json({
            success:false,
            msg:error.message
        });
    }
}
const showVisitingList = async(req,res) =>{

    try {
        const empID = req.user.employee._id;
        console.log(empID)
        // const visitingDate = (req.visitingDate) ? req.visitingDate :  new Date();
        // console.log(empID ,visitingDate)
        const filters = {};
        (empID)? filters.fieldEmpID = empID : null;
        // if(visitingDate){ 
        //     filters.visitingDate = {
        //         $gte: await startDateConvertor(visitingDate),
        //         $lte: await endDateConvertor(visitingDate)
        //     };
        // }

        // console.log(filters)
        const list = await assignEmp.find(filters).select("-__v -fieldEmpID -createAt")
        .populate({
            path: 'clientID',  // Populate client information
                populate: {  // Nested populate for empID inside clientID
                    path: 'empID',  // Assuming empID is a reference inside the Client schema
                    select:(" -_id -empID -teamLeader -stateID -department -district -date -__v")
                },
            select:("-TLID -__v -CurrentDate -stageID -_id")
        });
        return res.status(201).json({
            success:true,
            data:list
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error.message
        });
    }
}
const updateClientByFieldEmp = async(req,res) =>{
    try {
        const empID =req.user.employee._id;
        // field name -> clientID email, stageID, kwpInterested, type, remark
        const clientID = req.body.clientID;
        const updateClient = await client.findByIdAndUpdate(clientID, req.body,{ new:true, runValidators: true });
        console.log(updateClient)
        const stageID = req.body.stageID;
        let updatedStage;
        if(stageID){
            const newStage = new StageActivity({
                clientID, empID, stageID, remark
            });
            updatedStage = await newStage.save(); 
        }
        return res.status(200).json({x:updatedStage})
    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error.message
        });
    }
}
const remark = async(req,res) =>{
    try {
        const clientId = req.query['clientId'] || req.params['clientId'] || req.body.clientId ;
        const stageData = await StageActivity.find({clientID : clientId});
        return res.status(200).json({
            success:true,
            activity:stageData
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error.message
        });
    }
}
const empdetail=async(req,res)=>{
   try{
    const id = req.query.id;
    const user =await employee.find({empID:id}).populate("department").populate("teamLeader").populate(`stateID`);
    res.status(200).json({
        message:"success",
        data:user,
    })

   }catch(err){
    console.log(err);
res.status(400).json({
    message:"error",
})
   }
}
const fetchLeads = async(req,res)=>{
    try{
        const id= req.id;
        if(!id){
            return res.status(400).json({
                success:false,
                message:"please enter the employee ID"
            })
        }
        const user=await assignEmp.find({fieldEmpID:id}).populate("fieldEmpID");
        if(user){
            console.log(user);
            res.status(200).json({
                success:true,
                data:user
            })

        }
    }catch(error){
        res.status(400).json({
            message:"error in fetching",
            error:error.message
        })
    }
 }

 const updateclient=async(req,res)=>{
    try{
        const{AccountNo,IFSC,BankAddress}=req.body;

        const AadharCard= req.files["aadhaarPhotos"] ? `/uploads/aadhar/${req.files["aadhaarPhotos"][0].filename}` : null;
        const  PanCard = req.files["pancard"] ? `/uploads/pancard/${req.files["pancard"][0].filename}` : null;
        const ElectrcityBill=req.files["electricitybill"]?`/uploads/ElectricityBill/${req.files["electricitybill"][0].filename}`:null;
        const Videos=req.files["Video"]?`/uploads/Video/${req.files["Video"][0].filename}`:null;

        const ExtraDetails= new Extradetail({
            AccountNo,IFSC,BankAddress,AadharCard,PanCard,ElectrcityBill,Videos
        })
        ExtraDetails.save();

        res.status(200).json({
            message:"save succesfully",
            data:ExtraDetails,
            success:true,
        })


    



    }catch(err){
        console.log(err)
        res.status(400).json({
            message:"Unsuccesfull",
            success:false,
        })
    }
 }

 const  
 updateEmployee=async(req,res)=>{
    try{
        const {empId,name,teamleader,mobile,stateID,district,status} = req.body;
        console.log(empId);
        console.log(stateID);
        console.log(district);
       
        
        // if(!district || !Array.isArray(district) || district.length==0){
        //     res.status(400).json({
        //         message:"District cannot be empty"
        //     })
        // }
        const empdetail=await employee.findOneAndUpdate({empID:empId},{
            $set:{
                name:name,
                teamLeader:teamleader,
                mobile:mobile,
                stateID:stateID,
                district:district
            },
           
        })
        if(!empdetail){
            return res.status(500).json({
                success:false,
                msg:'Employeee ID not exits!'
            })
        }
       
        

        // for (let state of stateID) {
        // //     console.log(state);
        // //     const districtlist = await District.find({ stateID: state });
        // //     console.log(districtlist)
        // //           districtlist.district = districtlist.district?.map(d => {
        // //             if (district.includes(d.name)  && d.status==false) {
        // //               d.status=true;
                        
        // //             }
        // //             return d;
        // //         });
        // //      await districtlist.save();
        // // }
        
        // for (let state of stateID) {
        //     console.log(state);
            
        //     // Fetch all district documents matching the stateID
        //     const districtlist = await District.find({ stateID: state });
        
        //     console.log(districtlist);
        
        //     // Iterate over each district document and update
        //     for (let district of districtlist) {
        //         district.district = district.district?.map(d => {
        //             if (district.includes(d.name) && d.status === false) {
        //                 d.status = true;
        //             }
        //             return d;
        //         });
        
        //         // Save each updated document
        //         await district.save();
        //     }
        // }
        for( let eachState of stateID ){
            // Find the District document by stateID for change district status value
            const districtDoc = await District.findOne({ stateID: eachState });
            console.log(districtDoc)
            let isModified = false;

            // Loop through each district in the document and toggle the status if the name matches
            districtDoc.district = districtDoc?.district.map(d => {
                if (district?.includes(d.name)) {
                    d.status = !d.status; // Toggle status
                    isModified = true; // Indicate that we made a change
                }
                return d;
            });
            if (isModified) {
                await districtDoc.save();
            }
        }
        
        if(await empdetail.save()){
            res.status(200).json({ 
                success:true,
                msg:'Employee updated succesfully.',
                data:empdetail,
            });
        }else{
            res.status(400).json({ 
                success:false,
                msg:'Something is missing!'
            });
        }



        

    }catch(err){
        console.log(err);
        res.status(400).json({
            success:false,
            message:"Error in up-dating data",

        })
    }
 }
module.exports ={
    assignEmployee,
    showVisitingList,
    updateClientByFieldEmp,
    todayLead,
    remark,
    empdetail,
    fetchLeads,
    updateclient,
    updateEmployee
    
}