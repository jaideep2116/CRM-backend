const mongoose = require("mongoose");

const countrySchema = mongoose.Schema({
    country: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model("Country", countrySchema);