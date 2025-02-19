const equalDateFunction = async (date) =>{
    const queryDate = new Date(date);  
    const start = new Date(Date.UTC(queryDate.getUTCFullYear(), queryDate.getUTCMonth(), queryDate.getUTCDate(), 0, 0, 0));
    return (start) ? start : null;
}

module.exports = equalDateFunction;