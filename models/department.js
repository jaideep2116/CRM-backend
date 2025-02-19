const mongoose = require("mongoose");

const departmentSchema = mongoose.Schema({
    department: {
        type: String,
        required: true,
        unique: true,
        trim: true // Removes leading and trailing whitespace
    },
    role:{
        type:Number,
        default:0
    }
});

// its help to increase role value automatically by 1
departmentSchema.pre('save', async function (next) {
    if (this.isNew) { // Only increment for new documents
        const lastDepartment = await Department.findOne().sort({ role: -1 }); // Get the department with the highest role
        this.role = lastDepartment ? lastDepartment.role + 1 : 1; // Increment by 1 or start from 1 if no departments exist
    }
    next();
});

const Department = mongoose.model("Department", departmentSchema);

module.exports = Department;
