require("dotenv").config();
const mongoose = require("mongoose");
const db_pass = process.env.DB_PASS;
const DB = `mongodb+srv://solarshiv9:${db_pass}@cluster0.9jxao.mongodb.net/CRM?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true
}).then(() => console.log("connection Start")).catch((error) => console.log(error.message));