const incrementDateFunction = async (date) =>{
    console.log()
    const queryDate = new Date(date);  
    const start = new Date(Date.UTC(queryDate.getUTCFullYear(), queryDate.getUTCMonth(), queryDate.getUTCDate()+1, 0, 0, 0));
    return (start) ? start : null;
}

module.exports = incrementDateFunction;