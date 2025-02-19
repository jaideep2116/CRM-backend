const StageActivity = require("../../models/stageActivity");
const insertStageActivity = async (clientID, empID, stageID, stageUpdateDate, remark) => {
    const newStage = new StageActivity({
        clientID, empID, stageID, remark , stageUpdateDate
    });
    if(await newStage.save()) 
        return true;
    return false;
}

module.exports = insertStageActivity;