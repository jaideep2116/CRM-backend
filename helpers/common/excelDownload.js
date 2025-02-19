const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const excelDownload = async(jsonData) =>{
    try {
        console.log(jsonData);
    // Convert JSON data to a worksheet
    const ws = XLSX.utils.json_to_sheet(jsonData);

    // Create a new workbook and append the worksheet
    const currentData = new Date();
    const month = currentData.getMonth();
    const year = currentData.getFullYear()
    const date = currentData.getDay()
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");

    // Define the file path for the Excel file
    // const filePath = path.join(__dirname, `${date}-${month}-${year}Report.xlsx`);
    // Write the workbook to the file system
    // XLSX.writeFile(wb, filePath);
    // return filePath;


    const fileName = `${date}-${month}-${year}Report.xlsx`;
    return fileName;
    } catch (error) {
        return error.msg
    }
}

module.exports = excelDownload;
