// multerConfig.js
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Define storage for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath); // Save in the "uploads" directory
    },
    filename: (req, file, cb) => {
        const customFileName = `${req.body.name || Date.now()}-${file.originalname}`;
        cb(null, customFileName);
    }
});

// File filter to only accept PDFs
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true); // Accept PDF files
    } else {
        cb(new Error('Only PDF files are allowed'), false); // Reject non-PDF files
    }
};

// Export Multer middleware
const upload = multer({ storage, fileFilter });

module.exports = upload;
