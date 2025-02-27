const {validationResult} = require('express-validator') // get error response  
const Client = require('../models/client');
const ErrorClient = require("../models/errorClient");
const FindEmpIdByDistrict = require("../helpers/common/findEmpIdByDistrict");
const State = require('../models/state');
const xlsx = require("xlsx");
const axios = require('axios');
const AssignEmployee = require('../models/assignEmployee')
const Revisit = require('../models/revisit');
const insertStageActivity = require('../helpers/common/storeStageActivity')
const stageActivity = require('../models/stageActivity');
const startDateConvertor = require('../helpers/common/dateConversion/startDate');
const endDateConvertor = require('../helpers/common/dateConversion/endDate');
// const incrementDateFunction = require('../helpers/common/dateConversion/incrementDate');
const equalDateFunction = require('../helpers/common/dateConversion/equalDate');
const FollowUp = require('../models/followUp');
// const welcomeTemplate = require("../helpers/aiSensy/welcomeTemplate");
const Employee= require("../models/employee");
const TeamLeader = require("../models/teamLeader");
const findEmpIDAndTLID =  require('../helpers/employee/findEmpIDAndTLID');
const CurrentDate = require('../helpers/common/dateConversion/currentDate');
const mongoose = require('mongoose');
const employee = require('../models/employee');
const Department= require("../models/department");
const Extradetails= require("../models/Extradetails");

const clientAdd = async(req,res) =>{
    try {
        // console.log(req.body)
        // const errors = validationResult(req);
        // if(!errors.isEmpty()){
        //     // console.log(errors);
        //     return res.status(500).json({
        //     success:false,
        //     msg:'Errors',
        //     errors:errors.array()
        //     })
        // }
        const {name,email,empID,mobile,source,stageID,stateID,district,city,kwpInterested,remark} = req.body;

        //find TLID for store data 
        console.log(empID)
        let empData ;
        if(empID != null){
            empData = await Employee.findById(empID).select("teamLeader").exec();
        }
        console.log()
        const addClient = new Client({
            name,email,empID,mobile,source,stageID,stateID,district,city,kwpInterested,remark,CurrentDate:Date.now(), TLID:empData?.teamLeader
        })

       
        const newClient = await addClient.save();
        if(newClient && newClient._id){
            const newClientID = newClient._id.toString();
            const stageUpdateDate = new Date();
            // console.log(newClientID, empID, stageUpdateDate);
            await insertStageActivity(newClientID, empID, stageID, stageUpdateDate);
        }
        // await welcomeTemplate(mobile);
        if(newClient){
            return res.status(200).json({
                success:true,
                msg:"Client Added Successfully."
            });
        }else{
            return res.status(400).json({
                success:false,
                msg:'Something is Missing'
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success:false,
            msg:error.message
        });
    }
}

const fetchClients = async(req,res) =>{
    try {
        
        const id = req.id;
        const {TLID, name, empID, district, state, email, mobile, source, stage, page, limit, date, startDate, endDate, type, kwpInterested, employeeName, teamLeaderName}= req.query;
        console.log("QUERY",req.query)
        const stateName = await State.find({state: {$regex : `^${state}`, $options:'i'}}).select("_id");
        const stateList = stateName.map(state => state._id);
        const filters ={};
        if(empID) filters.empID = new mongoose.Types.ObjectId(empID);
        if(id) filters._id = new mongoose.Types.ObjectId(id);
        if (TLID) filters.TLID = new mongoose.Types.ObjectId(TLID);
        if(employeeName === "N/A" || employeeName === "n/a") filters.empID = null; // for find not assign clients
        // find employee id according to employee name and apply filter
        if(employeeName && employeeName != 'undefined' && employeeName != "N/A" && employeeName != "n/a"){
            const empData = await Employee.find({name : { $regex: `^${employeeName}`, $options: 'i' }}).select("_id");
            const empIDs = empData.map(item => item._id);
            console.log(empIDs)
            filters.empID = { $in : empIDs};
        }
        if(teamLeaderName && teamLeaderName != 'undefined'){

            const teamLeaderData = await TeamLeader.find({name : { $regex: `^${teamLeaderName}`, $options: 'i' }}).select("_id");
            const TLIDs = teamLeaderData.map(item =>item._id);
            filters.TLID = {$in : TLIDs};
        }
        if (name) filters.name = { $regex: `^${name}`, $options: 'i' }; // Case-insensitive search
        if (district) filters.district = { $regex: district, $options: 'i' };
        if (state){
            filters.stateID = {$in: stateList}
        };
        if (email) filters.email = { $regex: email, $options: 'i' };
        if (mobile) filters.mobile = mobile;
        if (source) filters.source = { $regex: source, $options : 'i' };
        // if (stage) filters.stageID = stage;  // OLD
        if(stage){
            filters.stageID = new mongoose.Types.ObjectId(stage);
        }
        if (date) {
            filters.CurrentDate = {
                $gte: await startDateConvertor(date),
                $lte: await endDateConvertor(date)    // Less than or equal to end of the day
            };  
        }
        if (startDate && endDate) {
            filters.CurrentDate = {
                $gte: await startDateConvertor(startDate),
                $lte: await endDateConvertor(endDate)
            };
        }
        // console.log(type)
        const typeValue = type?.toLowerCase();
        let typeIndex = 1;
        if(typeValue == 'cold') typeIndex = 3; 
        if(typeValue == 'warm') typeIndex = 2;
        if(typeValue) filters.type = typeIndex;
        if(kwpInterested) filters.kwpInterested = {$regex : kwpInterested, $options : 'i'};

        /* new update for unique clients */
        const pages = parseInt(page);
        const limits = parseInt(limit);
        const skip = (pages - 1) * limits;
        const skipValue = (typeof skip === 'number' && !isNaN(skip)) ? skip : 0;
        const limitValue = (typeof limits === 'number' && !isNaN(limits)) ? limits : undefined; // Default to undefined if limits is invalid
        const uniqueClients = await Client.aggregate([
            { $match: filters}, // Apply filter criteria
            {
                $group: {
                    _id: "$mobile", // Group by mobile
                    client: { $first: "$$ROOT" } // Get the first client document per mobile
                }
            },
            {$replaceRoot: { newRoot: "$client" } },// Replace the root with the client document itself 
            // populate empID
            {
                $lookup:{
                    from:"employees",
                    localField:"empID",
                    foreignField: "_id",
                    as:"empID"
                }
            },
            { $unwind: { path: "$empID", preserveNullAndEmptyArrays: true } },
            // Populate TLID
            {
                $lookup: {
                    from: "teamleaders", // Collection name for TeamLeader
                    localField: "TLID",
                    foreignField: "_id",
                    as: "TLID"
                }
            },
            { $unwind: { path: "$TLID", preserveNullAndEmptyArrays: true } },// Unwind TLID array to a single object
            // Populate stateID
            {
                $lookup: {
                    from: "states", // Collection name for State
                    localField: "stateID",
                    foreignField: "_id",
                    as: "stateID"
                }
            },
            { $unwind: { path: "$stateID", preserveNullAndEmptyArrays: true } },
            {
                $lookup:{
                    from:"stages",
                    localField:"stageID",
                    foreignField: "_id",
                    as: "stageID"
                }
            },
            { $unwind: { path: "$stageID", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id:1,
                    name: 1,
                    email: 1,
                    assignEmp:1,
                    mobile: 1,
                    source: 1,
                    stageID: 1,
                    district: 1,
                    city: 1,
                    zipCode: 1,
                    kwpInterested: 1,
                    type: 1,
                    CurrentDate: 1,
                    "empID.name":1,
                    "empID._id":1,
                    "TLID.name": 1, // Include only the name field of TLID
                    "TLID._id" :1,
                    "stateID.state":1,
                }
            },
            { $sort: { CurrentDate: -1 } },
            { $skip: skipValue },       // Skip documents for pagination
            ...(limitValue !== undefined ? [{ $limit: limitValue }] : [])
        ]);
  

        const updatedClients =await Promise.all(uniqueClients.map(async(client) =>{
            const clientID =await client._id.toString();
            // For finding name of assign Employee and visiting Date 
            const assignEmpData = await AssignEmployee.findOne({clientID})
                .populate({
                    path:'fieldEmpID',
                    select:{'name':1,}
                })
                .lean();
                let name = null;
                



                
                let date = null;
                if(assignEmpData != null){
                    name = assignEmpData?.fieldEmpID?.name;
                    date = assignEmpData.visitingDate;
                }
                //For find Revisit date
                const revisitData = await Revisit.findOne({clientID}).select("revisitDate");
                const revisitDate =(revisitData)? revisitData.revisitDate : null;
                // For find all stage according to client and update Date
                const stageActivityData = await stageActivity.find({clientID})
                .populate({
                    path:"stageID",
                })
                const stageActivityList = (stageActivityData) ? stageActivityData : null;
                // show followUpDate 
                const followData = await FollowUp.findOne({clientID}).select("followUpDate").sort("-createAt");
                // console.log(followData)
                return {
                    ...client,
                    assignEmp: name,
                    visitingDate: date,
                    revisitDate:(revisitDate),
                    stageActivity:stageActivityList,
                    followUpDate : followData?.followUpDate
                }
        }));
        // console.log(updatedClients.length)
        return res.status(200).json({
            success:true,
            clients:(updatedClients) ? updatedClients : 'No data found' ,
            nextPage: (updatedClients.length >= limit) ? +page + 1 : null,
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success:false,
            msg:error.message
        });
    }
}
const updateClient = async(req,res) =>{
    try {
        console.log("hgff",req.query || req.body || req.params);
        let newVisit = null;
        const {kwpInterested, type, email, stageID, selectedFieldSales, visitingDate, followUpDate, remark, clientID, empID,address,location} = req.body;
        const [latitude, longitude] = location.split(", ").map(Number);
        
        if(!req?.body?.clientID){
            return res.status(400).json({
                success:false,
                msg:"client Id not Exist!"
            });
        }

        
        const ElectrcityBill=await req.files["electricitybill"]?`${process.env.SERVER_URL}uploads/ElectricityBill/${req.files["electricitybill"][0].filename}`:null;
        console.log(ElectrcityBill);
        const   ProposalPdf=await req.files["proposalpdf"]?`${process.env.SERVER_URL}uploads/proposalpdf/${req.files["proposalpdf"][0].filename}`:null;
        const additionalsdetails=new Extradetails({
       ElectrcityBill,ProposalPdf
        })
        additionalsdetails.save();

        if(followUpDate || visitingDate){ // check given date is not less the current date 
            const queryData = new Date(followUpDate || visitingDate);
            const today = new Date();
            if(queryData.getDate() < today.getDate() && queryData.getMonth() < today.getMonth() && queryData.getYear() < today.getYear()){
                return res.status(400).json({
                    success:false,
                    msg:" Please give valid Date."
                })
            }  
        }
        if(followUpDate){
            const newFollowUpDate = await equalDateFunction(followUpDate);
            console.log(newFollowUpDate);
            await FollowUp.findOneAndUpdate({clientID: clientID}, {$set : {followUpDate:newFollowUpDate}},{new: true, upsert:true, runValidators: true });
        }
        // console.log("RB",req.body);
        // if(visitingDate && assignEmp == ''){
        //     return res.status(400).json({
        //         success:false,
        //         msg:"Visiting date not save without assign employee."
        //     })
        // }
        if(visitingDate){
            console.log("missin Success")
            const newVisitingDate = await equalDateFunction(visitingDate);
            const visit = new AssignEmployee({
                clientID, fieldEmpID:selectedFieldSales, visitingDate:newVisitingDate
            });
            newVisit = await visit.save();
            console.log(newVisit)
        }
        const UpdatedData ={
            kwpInterested:kwpInterested,
            type:type,
            email:email,
            stageID:stageID,
            AdditionalDetails:additionalsdetails._id,
            address:address,
            latitude:latitude,
            longitude:longitude,
            
        }
        
        const updateClient = await Client.findByIdAndUpdate(clientID, UpdatedData, { new:true, runValidators: true }).populate("AdditionalDetails");
        if(!updateClient){
            return res.status(404).json({
                success:false,
                msg:'Something is Wrong please try again !'
            });
        }
        if(stageID){
            const stageUpdateDate = new Date();
            await insertStageActivity(clientID, empID, stageID, stageUpdateDate, remark);
        }
        return res.status(200).json({
            success:true,
            msg:"Update SuccessFully .",
            data:updateClient,
        });
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success:false,
            msg:error.message
        });
    }
}

const fetchByFile = async(req,res) =>{
    let uploadedFreshClient = 0;
    let notUploadedClient = 0;
    let totalClient = 0;
    let clientData;
    let stageResult = 0;
    let wlcSuccessMsg = 0;
    let wlcUnsuccessMsg = 0;
    let empID = null;
    let teamLeaderID = null;
    let state = null;
    let StateID = null;
    let district = null;
    try {
        if (!req.file) {
            return res.status(400).json({ success:false, message: 'No file uploaded' });
        }
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const excelData = xlsx.utils.sheet_to_json(worksheet); // it is converted data excel->json
        let ClientArray = [];
        for(const row of excelData){
            district = row['city'];
            ++totalClient; // count total leads
            let zipCode = row['zip_code'];
            state = row['state'];
            if(zipCode != undefined && zipCode.length >= 5 && typeof zipCode != "string"){
                const zipCodeResponse = await axios.get(`https://api.postalpincode.in/pincode/${zipCode}`); // these api is help to get area location by zip code
                if(zipCodeResponse.data[0].Status === "Success"){
                    const postOffice = zipCodeResponse.data[0].PostOffice[0];
                    district = postOffice.District;
                    state = postOffice.State;
                    console.log("D = ",district, "S = ",state);
                }
            }
            if(state){
                const responseStateID = await State.findOne({state},'_id');
                StateID = responseStateID?._id.toString();
            }
            const excelEmpID = row['employeeID'];
            if(excelEmpID){
                const employeeResponseData = await findEmpIDAndTLID(excelEmpID);
                empID = employeeResponseData.empID;
                teamLeaderID = employeeResponseData.TLID;
            }else{
                const responseData = await FindEmpIdByDistrict(district, state);
                empID = responseData.empID;
                teamLeaderID = responseData.teamLeaderID;
            }
            const currentDate = await CurrentDate();
            if(typeof zipCode === "string") zipCode = 0;
            clientData = {
                name: row['full_name'],
                mobile: row['mobile'],
                source: row['platform'],
                stateID: StateID,
                district: district,
                city: row['city'],
                zipCode,
                empID:empID,
                TLID:teamLeaderID,
                CurrentDate :currentDate
            };
            // ExcelData.push(clientData);
            try{
                const newClient = await Client.create(clientData);
                if(newClient && newClient._id){
                    const newClientID = newClient._id.toString();
                    const stageUpdateDate = new Date();
                    const stageID = "66e15ed1774c6b5fb4ab626b";
                    const stageResponse =await insertStageActivity(newClientID, empID, stageID, stageUpdateDate);
                    if(stageResponse) stageResult++;
                }
                uploadedFreshClient++;
                // const whatsAppResponse = await welcomeTemplate(clientData.mobile); 
                // (whatsAppResponse) ? ++wlcSuccessMsg : --wlcUnsuccessMsg;
            }catch(error){
                const newClientData = {...clientData, errors:error.message};
                const errorClient = await ErrorClient.create(newClientData);
                notUploadedClient++;
                if(!errorClient){
                    ClientArray.push(clientData);
                }
            }
        }
        return res.status(200).json({
            success:true,
            msg:'Successfully added client in server',
            stage:stageResult,
            totalClient:totalClient,
            uploadedClient:uploadedFreshClient,
            notUploadClient:notUploadedClient,
            // welcomeSuccessMsg:wlcSuccessMsg,
            // welcomeUnsuccessfullyMsg: wlcUnsuccessMsg,
            // list:ExcelData
        })
    } catch (error) {
        const newClientData = {...clientData, errors:error.message};
            const errorClient = await ErrorClient.create(newClientData);
            notUploadedClient++;
            if(!errorClient){
                ClientArray.push(clientData);
            }
        return res.status(400).json({
            success:false,
            msg:error.message
        });
    }
}

const fetchAssignEmployee= async(req,res) =>{
    try {
        const clientID = req.query.clientID;
        if(!clientID){
            return res.status(400).json({
                success:false,
                msg:"client Id not Exist!"
            });
        }
        const assignData = await AssignEmployee.findOne({clientID})
        .populate({
            path:"fieldEmpID",
            select:({
                "name":1
            })
        }).select({
            "name":1,
            "visitingDate":1
        });
        return res.status(200).json({
            success:true,
            data:assignData
        });
    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error.message
        });
    }
}
const bulkAssign = async(req,res) =>{
    try {
        const {clientsID, empID} = req.body;

        if (!clientsID || !empID) {
            return res.status(400).json({
              success: false,
              msg: "clientIDs and empID are required",
            });
          }

          // find employee ID and Team Leader id for update client
          const empData = await Employee.findOne({empID:{$regex : empID, $options:"i"} }).select("_id teamLeader");
        //   console.log(empData);
          const employeeID = empData._id.toString();
          const teamLeaderID = empData.teamLeader.toString();

          const updateData = {
            empID:employeeID,
            TLID:teamLeaderID
          }
          // Update empID for all clients in clientIDs array
          const updatedClients = await Client.updateMany(
            { _id: { $in: clientsID } }, // Filter clients by multiple IDs
            { $set: updateData }   // Set new empID for each client
          );

          // Check if any clients were updated
          if (updatedClients.nModified === 0) {
            return res.status(404).json({
              success: false,
              message: "No clients found to update",
            });
          }
          res.status(200).json({
            success: true,
            // message: `${updatedClients.nModified} clients were updated`,
            msg :"Successfully updated clients"
          });

    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error
        })
    }
}

// const Fetchemployee=async(req,res)=>{
//     try{
//         // const{Statename}=req.body;
//         // if(!Statename){
//         //     res.status(400).json({
//         //         success:false,
//         //         message:"please enter a valid state"
//         //     })
            
//         // }
//         const arr=[];
//         const user = await Employee.find({empID:'CL001'})
//         .populate("department")
//         .populate("teamLeader")
//         .populate("stateID");
//         console.log(user);
//         console.log(user.stateID)
      

//     //   console.log(user?.stateID);
//     //     console.log(user);
//         res.status(200).json({
//             message:"succesfulyy fetched",
            
//         })

//     }catch(error){
//    console.log(error);
//    res.status(400).json({
//     status:false,
//     message:"Error in assign employee",

//    })
//     }
// }

const  Assignfieldemployee=async(req,res)=>{
    try{
   
        const{Statename}=req.body;
        if(!Statename){
            res.status(400).json({
            message:"State not found",
            status:false,
            })
        }

     
  

  const response= await  employee.aggregate([
    
        // populate the states
        {
            $lookup: {
                from: "states", // Collection name for State
                localField: "stateID",
                foreignField: "_id",
                as: "statedetails"
            },
            
        },{
            $unwind:"$statedetails"
        },{
            $match:{
                "statedetails.state":Statename,
            }
        }, {
            $lookup: {
                from: "departments",
                localField: "department",
                foreignField: "_id",
                as: "depratmentdetails",
            }
        },
    
        { $unwind: "$depratmentdetails" }, // Unwind department details
    
        // Match only employees from "Field Sales" department
        {
            $match: {
                "depratmentdetails.department": "Field Sales"
            }
        }
        
    
  ]);



     
 
     res.status(200).json({
         message:"success",
         data:response,
     })
 
    }catch(err){
     console.log(err);
 res.status(400).json({
     message:"error",
 })
    }
 }
module.exports = {
    clientAdd,
    fetchClients,
    updateClient,
    fetchByFile,
    fetchAssignEmployee,
    bulkAssign,
   Assignfieldemployee
}