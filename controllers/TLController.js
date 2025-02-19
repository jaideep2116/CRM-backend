     const teamleader= require("../models/teamLeader")
     
     const showClients = async(req,res) =>{
    try {
        const {empID, name, district, state, email, mobile, source, stage, page, limit, date, startDate, endDate}= req.query;
        const filters ={};
        if (name) filters.name = { $regex: `^{name}`, $options: 'i' }; // Case-insensitive search
        if (district) filters.district = { $regex: district, $options: 'i' };
        if (state) filters.state = { $regex: state, $options: 'i' };
        if (email) filters.email = { $regex: email, $options: 'i' };
        if (mobile) filters.mobile = mobile;
        if (source) filters.source = { $regex: source, $options : 'i' };
        if (stage) filters.stage = stage;
        if(empID) filters.empID = empID;
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
        const clients = await Client.find(filters) 
        .populate('stageID')
        .populate({
            path: 'empID', 
            select: 'name'
        })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();
        const updatedClients =await Promise.all(clients.map(async(client) =>{
            console.log(client)
            const clientID =await client._id.toString();
            // For finding name of assign Employee and visiting Date 
            const assignEmpData = await AssignEmployee.findOne({clientID})
                .populate({
                    path:'fieldEmpID',
                    select:{
                        'name':1,
                    }
                })
                .lean();
                let name = null;
                let date = null;
                if(assignEmpData != null){
                    name = assignEmpData.fieldEmpID.name;
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
                // below three line use for remove ActivityPaths 
                const plainClient = client.toObject();  // Convert Mongoose model to object 
                delete plainClient['$__'];
                delete plainClient['$isNew'];
                return {
                    ...plainClient,
                    assignEmp: name,
                    visitingDate: date,
                    revisitDate:(revisitDate),
                    stageActivity:stageActivityList
                }
        }));
        return res.status(200).json({
            success:true,
            clients:(updatedClients) ? updatedClients : 'No data found' ,
            nextPage: (clients.length >= limit) ? +page + 1 : null
        })

    
    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error.message
        });
    }
}

const fetchteamleader=async(req,res)=>{
    try{

        const {id}=req.query;
        
        const res=teamleader.find({_id:id});
        if(!res){
            res.status(400).json({
                message:"error no data"
            })
        }
        res.status(200).json({
            message:"success",
            data:res,
        })
    }catch(err){
console.log(err);
    }
}

module.exports ={
    showClients,
    fetchteamleader,
}