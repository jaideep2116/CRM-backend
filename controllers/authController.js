const employee = require('../models/employee'); 
const admin = require('../models/admin'); 
const teamLeader = require('../models/teamLeader');
const District = require('../models/district');
const assignemp=require("../models/assignEmployee");
const {validationResult} = require('express-validator') // get error response  
const jwt =require('jsonwebtoken');
const startDateConvertor = require('../helpers/common/dateConversion/startDate');
const endDateConvertor = require('../helpers/common/dateConversion/endDate');

const generateAccessToken = async (user) =>{
    const token = jwt.sign(user, process.env.JWT_SECRET, {expiresIn:"12h"});
    return token;
};
const generateRefreshToken = async (user) =>{
    const token = jwt.sign(user, process.env.JWT_SECRET, {expiresIn:"24h"});
    return token;
};

const addTeamLeader = async(req,res) =>{
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            // console.log(errors);
            return res.status(500).json({
            success:false,
            msg:'Errors',
            errors:errors.array()
            })
        }
        const {empID, name, mobile, stateID} = req.body;
        const existEmpID = await teamLeader.findOne({empID});
        if(existEmpID){
            return res.status(500).json({
                success:false,
                msg:'Employee id already exist!'
            })
        }
        // check state are already assign or not 
        // const isStateAssign = await teamLeader.findOne({stateID});
        // console.log(isStateAssign)
        // if(isStateAssign){
        //     return res.status(500).json({
        //         success:false,
        //         msg:` This State is already assign to ${isStateAssign.name}`
        //     })
        // }
        const addTeamLeader = new teamLeader({
            empID, name, mobile, stateID
        });

        if(await addTeamLeader.save()){
            res.status(200).json({ 
                success:true,
                msg:'Team Leader Added Successfully.'
            });
        }else{
            res.status(400).json({ 
                success:false,
                msg:'Something is missing !'
            });
        }
    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error.message
        });
    }
}
const showTeamLeader = async(req,res) =>{
    try {
        let filter = {};
        const {department, stateID, name, empID, mobile} = req.query;
        if(empID) filter.empID = empID;
        // Apply name filter for character match if provided
        // Use regular expression to match names starting with the given letter/substring
         if (name) {
            // Use regular expression to match names starting with the given letter/substring
            filter.name = { $regex: `^${name}`, $options: 'i' }; // '^' ensures that names start with the provided character
            // filter.name = name;
        }
        if(mobile) filter.mobile = mobile;
        if(department) filter.department = department;
        if(stateID){

            // for stateID=66decf91b797b776b3366e7d&stateID=66decf91b797b776b3366e7a
            const stateIDs = Array.isArray(stateID) ? stateID : [stateID];
            // console.log(stateIDs)
            filter.stateID = { $in: stateIDs };  // Use `$in` to match any of the provided state IDs

            // for stateID=60d3b41abdacab0026a733c6,60d3b41abdacab0026a733c7
            // const stateIDs = stateID.split(',');
            // // console.log(stateIDs)
            // filter.stateID = { $in: stateIDs };
        }
        const teamLeaders = await teamLeader.find(filter).populate('stateID').select("-refreshToken -__v")
            return res.status(200).json({
                success:true,
                data:(teamLeaders) ? teamLeaders : 'Team Leader Not Exist !'
            });

    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error.message
        });
    }
}
const showTeamLeaderName = async (req,res) =>{
    try {
        // const teamLeaders = await teamLeader.find({} , 'name')
        //     return res.status(200).json({
        //         success:true,
        //         data:teamLeaders
        //     });
        let filter = {};
        const {department, stateID, name, empID, mobile} = req.query;
        if(empID) filter.empID = empID;
        // Apply name filter for character match if provided
        // Use regular expression to match names starting with the given letter/substring
         if (name) {
            // Use regular expression to match names starting with the given letter/substring
            filter.name = { $regex: `^${name}`, $options: 'i' }; // '^' ensures that names start with the provided character
            // filter.name = name;
        }
        if(mobile) filter.mobile = mobile;
        if(department) filter.department = department;
        if(stateID){

            // for stateID=66decf91b797b776b3366e7d&stateID=66decf91b797b776b3366e7a
            const stateIDs = Array.isArray(stateID) ? stateID : [stateID];
            // console.log(stateIDs)
            filter.stateID = { $in: stateIDs };  // Use `$in` to match any of the provided state IDs

            // for stateID=60d3b41abdacab0026a733c6,60d3b41abdacab0026a733c7
            // const stateIDs = stateID.split(',');
            // // console.log(stateIDs)
            // filter.stateID = { $in: stateIDs };
        }
        const teamLeaders = await teamLeader.find(filter)
            .populate('stateID', 'state') // Populate stateID field with state name only
            .select(' name stateID');     // Select only 'name' and 'stateID' fields

        // Send the response
        res.status(200).json({
            success: true,
            // data:teamLeaders
            data: teamLeaders.map(leader => ({
                _id:leader._id,
                name: leader.name,
                state: leader.stateID.state,  // Access the populated state name
                stateID : leader.stateID
            })),
        });

    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error.message
        });
    }
}
const deleteTeamLeader = async(req,res) =>{
    try {
        const {id} = req.query;
        if (!id) {
            return res.status(400).json({ 
                success:false,
                message: 'Id is required' 
            });
        }

        const deletedTeamLeader= await teamLeader.findOneAndDelete({ _id:id });
        if (!deletedTeamLeader) {
            return res.status(404).json({ 
                success:false,
                message: 'team Leader not found !' 
            });
        }
        res.status(200).json({ 
            success:true,
            message: 'Employee deleted successfully.', 
            teamLeader: deletedTeamLeader 
        });

    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error.message
        });
    }
}
const adminAdd = async(req,res) =>{
    try {
        const {email,mobile,department,name} = req.body;
        const addAdmin = new admin({
            email,mobile,department,name
        });

        if(await addAdmin.save()){
            res.status(200).json({ 
                success:true,
                msg:'Account create successfully.'
            });
        }
    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error.message
        });
    }
}
const empLogin = async(req,res) =>{
    try {
        const{department,email,password} = req.body;
        const options ={
            httpOnly : true,
            secure : true
        }
        if(department == 1){
            const adminData = await admin.findOne({email}).populate('department');
            console.log(adminData)
            if(!adminData){
                return res.status(500).json({
                    success:false,
                    msg:'Email not exist!'
                })
            }
            const errors = validationResult(req);
            console.log(errors)
            if(!errors.isEmpty()){
                return res.status(500).json({
                success:false,
                errors:errors.array()
                }) 
            }
            if (adminData.mobile != password) {
                return res.status(500).json({ 
                success:false,
                msg: 'Email and password is Incorrect!'
                });
            }
            const accessToken = await generateAccessToken({ admin:adminData });
            const refreshToken = await generateRefreshToken({ admin:adminData._id});
            // console.log(accessToken);
            // console.log(refreshToken);
            const adminLoggedData = await admin.findOne({email})
            .populate('department')
            .select("-mobile -email");
            console.log(adminLoggedData);
          const data=  await admin.findByIdAndUpdate(
                adminLoggedData._id,
                {$set:{ refreshToken: refreshToken }},
                {new:true}
            )
            console.log(data);
     res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                success:true,
                msg:'Login Successfully',
                data:adminData,
                prefixName:adminData.name[0],
                accessToken:accessToken,
                refreshToken:refreshToken,
                tokenType:'Bearer'
              });
        }else if(department == 2){
            try {
                const teamLeaderData = await teamLeader.findOne({empID:email}).populate('department').populate('stateID');
                if(!teamLeaderData){
                    return res.status(500).json({
                        success:false,
                        msg:'Employee ID not exist!'
                    })
                }
                const errors = validationResult(req);
                if(!errors.isEmpty()){
                    return res.status(500).json({
                    success:false,
                    errors:errors.array()
                    }) 
                }
                if(teamLeaderData.mobile != password){
                    return res.status(401).json({ 
                        success:false,
                        msg: 'Employee ID and password is Incorrect!'
                    });
                }
                const accessToken = await generateAccessToken({ teamLeader:teamLeaderData });
                const refreshToken = await generateRefreshToken({ teamLeader:teamLeaderData._id });
                // console.log(teamLeaderData);    
                const TLLoggedData = await teamLeader.findOne({empID:email})
                .populate('department')
                .populate('stateID')
                .select("-mobile -empID");
                await teamLeader.findByIdAndUpdate(
                    TLLoggedData._id,
                    {$set:{ refreshToken: refreshToken }},
                    {new:true}
                )
                return res.status(200)
                .cookie("accessToken", accessToken, options)
                .cookie("refreshToken", refreshToken, options)
                .json({
                    success:true,
                    msg:'Login Successfully',
                    data:TLLoggedData,
                    prefixName:teamLeaderData.name[0],
                    accessToken:accessToken,
                    refreshToken:refreshToken,
                    tokenType:'Bearer'
                  });

            } catch (error) {
                console.log(error)
                return res.status(400).json({
                   
                    success:false,
                    msg:error.message,
                    
                });
            }
            
        }
        else{
            const employeeData = await employee.findOne({empID:email}).populate('department').populate('teamLeader');
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(500).json({
                success:false,
                errors:errors.array()
                }) 
            }
            if(!employeeData){
                return res.status(500).json({
                    success:false,
                    msg:'Employee not exist!'
                })
            }
            if (employeeData.mobile != password) {
                return res.status(401).json({ 
                success:false,
                msg: 'Employee ID and password is Incorrect!'
                });
            }
            const accessToken = await generateAccessToken({ employee:employeeData });
            const refreshToken = await generateRefreshToken({ employee:employeeData._id });
            const employeeLoggedData = await employee.findOne({empID:email}).populate('department').populate('teamLeader').select("-mobile  -date");
            return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                success:true,
                msg:'Login Successfully',
                data:employeeLoggedData,
                prefixName:employeeData.name[0],
                accessToken:accessToken,
                refreshToken:refreshToken,
                tokenType:'Bearer'
              });
        }
        
    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error.message,
            
        });
    }
};

const teamLeaderProfileUpdate = async(req,res) =>{
    try {
        const teamLeaderId = req.query.TLID;
        const updates = req.body;

    // Validate input
        const isExist = await teamLeader.findOne({_id:teamLeaderId});
        if(!isExist){
            return res.status(200).json({
                success:false,
                msg:'Coordinator not exist'
            })
        }
        const updatedTeamLeader = await teamLeader.findByIdAndUpdate(
            teamLeaderId,
            updates,
            { new: true, runValidators: true } // Return the updated document
        );

        if (!updatedTeamLeader) {
            return res.status(404).json({ 
                success:false,
                msg: 'Team Leader not found' 
            });
        }
        return res.status(200).json({ 
            success:true,
            message: 'Team Leader updated successfully', 
            updatedTeamLeader
        });
    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error.message
        });
    }
}
const logout = async(req,res) =>{
    try {
        const options ={
            httpOnly : true,
            secure : true
        }
        let role;
        role =(req.user.employee == !undefined)? req.user.employee.department.role : 
        role = (req.user.teamLeader == !undefined) ? req.user.teamLeader.department.role :
        role = (req.user.admin == !undefined) ? req.user.admin.department.role: ""

        if(role === 1){
            await admin.findByIdAndUpdate(
                req.user._id,
                {$set:{ refreshToken:undefined }},
                {new:true}
            )
        }
        if(role === 2){
            await teamLeader.findByIdAndUpdate(
                req.user._id,
                {$set:{ refreshToken:undefined }},
                {new:true}
            )
        }
        if(role === 3 || role === 4){
            await employee.findByIdAndUpdate(
                req.user._id,
                {$set:{ refreshToken:undefined }},
                {new:true}
            )
        }
        
        return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({
            success:true,
            msg:"Logout Successfully"
        })
    } catch (error) {
        return res.status(400)
        .json({
            success:false,
            msg:error.message
        });
    }
}
const empRegister = async(req,res)=>{
    try {
        const id = req.id;
        console.log(id);
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            const errorsMSG = errors.array();
            return res.status(500).json({
            success:false,
            msg:errorsMSG
            })
        }
        const {empID,name,department,teamLeader,mobile,stateID,district} = req.body;
        // console.log(req.body)
        const existId = await employee.findOne({empID});
        if(existId){
            return res.status(500).json({
                success:false,
                msg:'Employee Id already exist!'
            })
        }
        
        const addEmployee = new employee({
            empID,name,department,teamLeader,mobile,stateID,district
        });
        if(department  != "66e139caa9afb40e2bbbd82e" ) { // 66e139caa9afb40e2bbbd82e = Field Sales
            // check Districts Are Exist or Not
            if (!district || !Array.isArray(district) || district.length === 0) {
                return res.status(400).json({ message: "districtNames must be an array and cannot be empty." });
            }

            for( let eachState of stateID ){
                // Find the District document by stateID for change district status value
                const districtDoc = await District.findOne({ stateID: eachState });
                let isModified = false;

                // Loop through each district in the document and toggle the status if the name matches
                districtDoc.district = districtDoc.district.map(d => {
                    if (district.includes(d.name)) {
                        d.status = !d.status; // Toggle status
                        isModified = true; // Indicate that we made a change
                    }
                    return d;
                });
                if (isModified) {
                    await districtDoc.save();
                }
            }
            
        }   
        if(await addEmployee.save()){
            res.status(200).json({ 
                success:true,
                msg:'Employee Account Create Successfully.'
            });
        }else{
            res.status(400).json({ 
                success:false,
                msg:'Something is missing!'
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

const empDelete = async(req,res) =>{
    try {
        const { empID } = req.body;
        if (!empID) {
            return res.status(400).json({ 
                success:false,
                message: 'Employee ID is required' 
            });
        }

        const deletedEmployee = await employee.findOneAndDelete({ empID:email });

        if (!deletedEmployee) {
            return res.status(404).json({ 
                success:false,
                message: 'Employee not found' 
            });
        }
        res.status(200).json({ 
            success:true,
            message: 'Employee deleted successfully', 
            employee: deletedEmployee 
        });
    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error.message
        });
    }
}
const fetchAllEmployee = async(req,res)=>{
    const {empID, teamLeader, name, district, stateID, mobile, department, startDate, endDate, specificDate} =req.query; 
    const filters ={}; // Define filter conditions based on query parameters

    // Add filters only if present in the request query
    if(empID) filters.empID = empID;
    if(name) filters.name = { $regex: `^${name}`, $options: 'i' }; // Case-insensitive search
    if(department) filters.department = department;
    if(teamLeader) filters.teamLeader = `${teamLeader}`;
    if(mobile) filters.mobile = mobile;
    if(stateID) {
        const stateIDs = Array.isArray(stateID) ? stateID : [stateID];
        filters.stateID = { $in: stateIDs };
    }
    if(district){
        const districts = Array.isArray(district) ? district : [district]; 
        filters.district =  { $in: districts};
    }
    if (startDate && endDate) {
        filters.date = {
            $gte: await startDateConvertor(startDate),  // Greater than or equal to startDate
            $lte: await endDateConvertor(endDate)     // Less than or equal to endDate
        };
    }
    if(specificDate) {
        filters.date = {
            $gte: await startDateConvertor(specificDate),
            $lte: await endDateConvertor(specificDate)    // Less than or equal to end of the day
        };
    }
    try {
        const {page, limit} = req.query;
        const employees = await employee.find(filters)
            .populate({
                path:'teamLeader',
                select:'name'
            })
            .populate({
                path:'department',
                select:'department'
            })
            .populate({
                path:'stateID',
                select:"-__v -countryID"
            })
            .skip((page - 1) * limit)
            .limit(limit)
            .select("-__v")
            .exec();
            return res.status(200).json({
                success:true,
                employees:employees,
                nextPage:(employees.length >= limit) ? + page + 1 : null
            });
    }catch (error) {
        return res.status(400).json({
            success:false,
            msg:error.message
        });
    }
    
}

const findEmpID = async(req,res) =>{
    try {
        const empID = req.query.empID || req.body.empID || req.param.empID;
        const existId = await employee.exists({empID});
        // console.log(existId)
        if(existId){
            return res.status(201).json({
                success:true,
                msg:'Employee Id already exist!'
            })
        }
        return res.status(500).json({
            success:false,
            msg:'Employee Id not Exist.'
        })

    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error.message
        });
    }
}
const teamLeaderProfile = async(req,res) =>{
    try {
        const id = req.query.id || req.param.id || req.body.id;
        if(!id){
            return res.status(401).json({
                success:false,
                msg:"Enter the Team Leader Id"
            })
        }
        const empData = await teamLeader.exists({_id:id});
        // .populate('stateID','state')
        // .select({
        //     empID: 1,  // Include empID
        //     name: 1,   // Include name
        
        //     mobile: 1, // Include mobile
        //     state: 1 // Include stateID (populated field)
        //   });
        const employeeList = await employee.find({teamLeader:empData._id})
        .populate("department","department")
        .select({
            empID:1,
            name:1,
            department:1,
            mobile:1,
            district:1
        });
        return res.status(200).json({
            success:true,
            id:empData._id,
            employeeList: employeeList
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error.message
        });
    }
}

// const empUpdate = async(req, res) => {
//     try{
//         const { updates } = req.body;
//         const empId = req.body.empID;
//         const empData = await employee.findOne({empID: empId});
//         if(!empData){
//             return res.status(404).json({
//                 success: false,
//                 message: "Employee Not Found"
//             });
//         }
//         if(updates.name){
//             empData.name = updates.name;
//         }

//         if(updates.stateID){
//             const stateData = await District.findOne({stateID: updates.stateID});
//         }
        

//     }
// }

module.exports={
    addTeamLeader,
    showTeamLeader,
    showTeamLeaderName,
    deleteTeamLeader,
    empLogin,
    empRegister,
    // empUpdate,
    adminAdd,
    empDelete,
    fetchAllEmployee,
    findEmpID,
    teamLeaderProfile,
    teamLeaderProfileUpdate,
    logout,

}