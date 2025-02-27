const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        let folder=""

        if(file.fieldname==='aadhaarPhotos') folder='uploads/aadhar/';
        if(file.fieldname==='pancard') folder='uploads/pancard/';
        if(file.fieldname==='electricitybill') folder='uploads/ElectricityBill/';
        if(file.fieldname==='Video')  folder='uploads/video/';
        if(file.fieldname==='dimensions') folder='uploads/dimensions/';
        if(file.fieldname==='cancelcheack')folder='uploads/cancelcheack/';
        if(file.fieldname==='proposalpdf' ) folder='uploads/proposalpdf/';
        const uploadDirs = ["uploads/aadhar/", "uploads/pancard/","uploads/ElectricityBill/","uploads/video/","uploads/dimensions/","uploads/cancelcheack/","uploads/proposalpdf/"]
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
// const fileFilter = (req, file, cb) => {
//     if (
//         file.mimetype === "application/pdf" || // PDF files
//         file.mimetype.startsWith("image/")    // Images (Aadhar, PAN)
//     ) {
//         cb(null, true);
//     } else {
//         cb(new Error("Invalid file type! Only PDFs and Images are allowed."), false);
//     }
// };

const upload=multer({storage:storage});

module.exports=upload;


