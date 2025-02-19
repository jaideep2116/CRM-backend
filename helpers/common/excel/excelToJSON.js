const xlsx = require("xlsx");
const excelToJSON = async(file) =>{
    try {
        const workbook = xlsx.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const excelData = xlsx.utils.sheet_to_json(worksheet , { defval: "" }); // defval is help to revoke auto data formatting when data convert in json format

        // this function help to convert decimal number in floating number for example 704 -> 704.00 OR 28.12 -> 28.12 
        const formattedData = excelData.map(row =>
            Object.fromEntries(
                Object.entries(row).map(([key, value]) => {
                    if (typeof value === 'number' && Number.isInteger(value) === false) {
                        // Check if the value should include ".00"
                        value = value.toFixed(2); // Force two decimal places
                    } else if (typeof value === 'number' && value % 1 === 0) {
                        value = value.toString().includes('.') ? value.toString() : `${value}.00`;
                    }
                    return [key, value];
                })
            )
        );
        return formattedData;
    } catch (error) {
        console.log(error);
        return null;
    }


}   

module.exports = excelToJSON;