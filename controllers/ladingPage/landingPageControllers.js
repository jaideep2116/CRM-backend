const Homes = require("../../models/landingPage/home.model");
const Residential = require("../../models/landingPage/residential.model");
const Commercial = require("../../models/landingPage/commercial.model");
const Pmkusum = require("../../models/landingPage/pmKusum.model");
const Distributor = require("../../models/landingPage/distributor.model");
const Contact = require("../../models/landingPage/contact.model");
// const {validationResult} = require('express-validator') // get error response  
const ChannelPartner = require("../../models/landingPage/channelPartner");
const ChannelPartnerWithCustomer = require("../../models/landingPage/channelPartnerWithCustomer");

const homes = async(req,res)=>{
    try {
        // const errors = validationResult(req);
        // if(!errors.isEmpty()){
        //     // console.log(errors);
        //     return res.status(500).json({
        //     success:false,
        //     msg:'Errors',
        //     errors:errors.array()
        //     })
        // }
        const {country, state, name, whatsApp, cityOrDistrictOrRegion, pinCode, remark } = req.body;
        // const isExist = await Homes.findOne({whatsApp}).select("_id");
        // console.log(isExist)
        // if(isExist){
        //     return res.status(400).json({
        //         success:false,
        //         msg:"You are already fill the form"
        //     })
        // }
        const newHomes = new Homes({
            country, state, name, whatsApp, cityOrDistrictOrRegion, pinCode, remark
        });
        const responseHomes = await newHomes.save();
        if(responseHomes){
            return res.status(200).json({
                success:true,
                msg: "Thank You for Your Interest!"
            })
        }
        return res.status(400).json({
            success:false,
            msg:"something is missing please try again ?"
        })

    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error
        })
    }
}


const residential = async(req,res)=>{
    try {
        // const errors = validationResult(req);
        // if(!errors.isEmpty()){
        //     // console.log(errors);
        //     return res.status(500).json({
        //     success:false,
        //     msg:'Errors',
        //     errors:errors.array()
        //     })
        // }
        const {country, name, phone, state, cityOrDistrictOrRegion, pinCode, AGMApprovalStatus, designation, remark } = req.body;
        const newResidential = new Residential({
            country, name, phone, state, cityOrDistrictOrRegion, pinCode, AGMApprovalStatus, designation, remark
        });
        const responseResidential = await newResidential.save();
        if(responseResidential){
            return res.status(200).json({
                success:true,
                msg: "Thank You for Your Interest!"
            })
        }
        return res.status(400).json({
            success:false,
            msg:"something is missing please try again ?"
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error
        })
    }
}

const commercial = async(req,res)=>{
    try {
        // const errors = validationResult(req);
        // if(!errors.isEmpty()){
        //     // console.log(errors);
        //     return res.status(500).json({
        //     success:false,
        //     msg:'Errors',
        //     errors:errors.array()
        //     })
        // }
        const {country, state, companyName, name, phone, cityOrDistrictOrRegion, pinCode, typesOfProperty, remark } = req.body;
        const newCommercial = new Commercial({
            country, state, companyName, name, phone, cityOrDistrictOrRegion, pinCode, typesOfProperty, remark
        });
        const responseCommercial = await newCommercial.save();
        if(responseCommercial){
            return res.status(200).json({
                success:true,
                msg: "Thank You for Your Interest!"
            })
        }
        return res.status(400).json({
            success:false,
            msg:"something is missing please try again ?"
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error
        })
    }
}

const pmkusum = async(req,res)=>{
    try {
        // const errors = validationResult(req);
        // if(!errors.isEmpty()){
        //     // console.log(errors);
        //     return res.status(500).json({
        //     success:false,
        //     msg:'Errors',
        //     errors:errors.array()
        //     })
        // }
        const {name, phone, cityOrDistrictOrRegion, pinCode, pmKusumOptions, remark } = req.body;
        const newPmkusum = new Pmkusum({
            name, phone, cityOrDistrictOrRegion, pinCode, pmKusumOptions, remark 
        });
        const responsePmkusum = await newPmkusum.save();
        if(responsePmkusum){
            return res.status(200).json({
                success:true,
                msg: "Thank You for Your Interest!"
            })
        }
        return res.status(400).json({
            success:false,
            msg:"something is missing please try again ?"
        }) 
    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error
        })
    }
}


const distributor = async(req,res)=>{
    try {
        // const errors = validationResult(req);
        // if(!errors.isEmpty()){
        //     // console.log(errors);
        //     return res.status(500).json({
        //     success:false,
        //     msg:'Errors',
        //     errors:errors.array()
        //     })
        // }
        const {name, phone, cityOrDistrictOrRegion, state, businessName, yearsInBusiness, dealershipInterest, productOfInterest, estimatedInvestment, remark } = req.body;
        const newDistributor = new Distributor({
            name, phone, cityOrDistrictOrRegion, state, businessName, yearsInBusiness, dealershipInterest, productOfInterest, estimatedInvestment, remark
        });
        const responseDistributor = await newDistributor.save();
        if(responseDistributor){
            return res.status(200).json({
                success:true,
                msg: "Thank You for Your Interest!"
            })
        }
        return res.status(400).json({
            success:false,
            msg:"something is missing please try again ?"
        }) 
    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error
        })
    }
}


const contact = async(req,res)=>{
    try {
        // const errors = validationResult(req);
        // if(!errors.isEmpty()){
        //     // console.log(errors);
        //     return res.status(500).json({
        //     success:false,
        //     msg:'Errors',
        //     errors:errors.array()
        //     })
        // }
        const {country, state, name, phone, cityOrDistrictOrRegion, pinCode, solarFor, remark } = req.body;
        const newContact = new Contact({
            country, state, name, phone, cityOrDistrictOrRegion, pinCode, solarFor, remark 
        });
        const responseContact = await newContact.save();
        if(responseContact){
            return res.status(200).json({
                success:true,
                msg: "Thank You for Your Interest!"
            })
        }
        return res.status(400).json({
            success:false,
            msg:"something is missing please try again ?"
        })  
    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error
        })
    }
}


const addChannelPartner = async(req,res) =>{
    try {
        // const {name, phone, state, city, pinCode, address, email, businessName, yearsInBusiness, gstNumber, bankAccountNumber, IFSCCode, sales, serial} = req.body;
        const newChannelPartner = new ChannelPartner(req.body);
        const result = await newChannelPartner.save();
        res.status(201).json({ success: true, result });
    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error
        })
    }
}

const showChannelPartner = async(req,res) =>{
    try {
        let filters = {};
        if (req.query.name) filters.name = req.query.name;
        if (req.query.phone) filters.phone = req.query.phone;
        if (req.query.state) filters.state = req.query.state;
        if (req.query.city) filters.city = req.query.city;
        if (req.query.pinCode) filters.pinCode = req.query.pinCode;
        if (req.query.businessName) filters.businessName = req.query.businessName;
        if (req.query.sales) filters.sales = req.query.sales;
        if (req.query.yearInBusiness) filters.yearInBusiness = req.query.yearInBusiness;
        if (req.query.gstNumber) filters.gstNumber = req.query.gstNumber;
        const channelPartners = await ChannelPartner.find(filters);
        
        return res.status(200).json({
            success:true,
            data:(channelPartners)? channelPartners : "No data found"
        })
        
    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error
        })
    }
}


const addChannelPartnerWithCustomer = async(req,res) =>{
    try {
        // const id = req.params.id;
        const id = req.query.id;
        console.log(id);
        const { name, phone, state, city, pinCode, solarFor, remark } = req.body;
        console.log(req.body)
        const newEntry = new ChannelPartnerWithCustomer({
            serial:id,
            name,
            phone,
            state,
            city,
            pinCode,
            solarFor,
            remark
        });

        const result = await newEntry.save();
        return res.status(201).json({ 
            success: true,
            msg:"Thanks for showing your interest we will reach out to you quickly",
            result
        });
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success:false,
            msg:error
        })
    }
}

module.exports={
    homes,
    residential,
    commercial,
    pmkusum,
    distributor,
    contact,
    addChannelPartner,
    showChannelPartner,
    addChannelPartnerWithCustomer
}