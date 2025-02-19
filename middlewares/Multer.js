const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        let folder=""

        if(file.fieldname==='aadhaarPhotos') folder='uploads/aadhar/';
        if(file.fieldname==='pancard') folder='uploads/pancard/';
        if(file.fieldname==='electricitybill') folder='uploads/ElectricityBill/';
        if(file.fieldname==='Video')  folder='uploads/video/';
        const uploadDirs = ["uploads/aadhar/", "uploads/pancard/","uploads/ElectricityBill/","uploads/video/"];
       uploadDirs.forEach(dir => { 
       if (!fs.existsSync(dir)) {
       fs.mkdirSync(dir, { recursive: true });
     }
     });
        cb(null,folder)
        


    },
    filename:(req,file,cb)=>{
        cb(null,`${Date.now()}-${file.originalname}`);
    }
})

const upload=multer({storage:storage})

module.exports=upload;