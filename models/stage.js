const mongoose = require("mongoose");

const stageSchema = mongoose.Schema({
    stage: {
        type: String,
        required: true,
        unique: true,
        trim: true // Removes leading and trailing whitespace
    },
    stageValue:{
        type:Number
    }
});
// its help to increase role value automatically by 1
stageSchema.pre('save', async function (next) {
    if (this.isNew) { // Only increment for new documents
        const lastStage = await Stage.findOne().sort({ stageValue: -1 }); // Get the department with the highest role
        this.stageValue = lastStage ? lastStage.stageValue + 1 : 1; // Increment by 1 or start from 1 if no departments exist
    }
    next();
});

const Stage = mongoose.model("Stage", stageSchema);

module.exports = Stage;
