const mongoose = require('mongoose')

const electricalSchema = mongoose.Schema({
    model_number: {
        type: String,
        required: true,
        unique: true
    },
    PmaxSTC: { // Maximum Power 
        type: String,
        required: true
    },
    PmaxBSTC10P: {
        type: String,
        required: true
    },
    PmaxBSTC20P: {
        type: String,
        required: true
    },
    PmaxBSTC30P: {
        type: String,
        required: true
    },
    VocSTC: { // Open Circuit Voltage
        type: String,
        required: true
    },
    VocBSTC10P: {
        type: String,
        required: true
    },
    VocBSTC20P: {
        type: String,
        required: true
    },
    VocBSTC30P: {
        type: String,
        required: true
    },
    IscSTC: { // Short Circuit Current 
        type: String,
        required: true
    },
    IscBSTC10P: {
        type: String,
        required: true
    },
    IscBSTC20P: {
        type: String,
        required: true
    },
    IscBSTC30P: {
        type: String,
        required: true
    },
    VmpSTC: { // maximum voltage power
        type: String,
        required: true
    },
    VmpBSTC10P: {
        type: String,
        required: true
    },
    VmpBSTC20P: {
        type: String,
        required: true
    },
    VmpBSTC30P: {
        type: String,
        required: true
    },
    ImpSTC: {  // current maximum power
        type: String,
        required: true
    },
    ImpBSTC10P: {
        type: String,
        required: true
    },
    ImpBSTC20P: {
        type: String,
        required: true
    },
    ImpBSTC30P: {
        type: String,
        required: true
    },
    maximumSystemVoltage: {
        type: String,
        required: true,
        default: "1500Vdc"
    },
    moduleLength: {
        type: String,
        required: true,
    },
    moduleWidth: {
        type: String,
        required: true,
    },
    moduleHeight: {
        type: String,
        required: true,
    },
    fuseRating: {
        type: String,
        required: true
    },
    module_weight: {
        type: String,
        required: true
    },
    serial_number:{
        type: String,
        required: true
    },
    nominal_wattage:{
        type: String,
        required: true
    },
    create_At: {
        type: Date,
        default: Date.now
    },
    updated_At: {
        type: Date
    }
});

const Electrical = mongoose.model("Electrical", electricalSchema);

module.exports = Electrical;