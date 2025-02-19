const endDateFunction = async (date) =>{
    const queryDate = new Date(date);  
    const end = new Date(Date.UTC(queryDate.getUTCFullYear(), queryDate.getUTCMonth(), queryDate.getUTCDate(), 23, 59, 59,999));
    return (end) ? end : null;
}

module.exports = endDateFunction;