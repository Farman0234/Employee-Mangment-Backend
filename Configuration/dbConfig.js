const mongoose = require('mongoose');
const dotenv = require("dotenv");

dotenv.config();

mongoose.connect(process.env.MONGO_URI,{
    serverSelectionTimeoutMS:5000,
})
mongoose.connection.on("connected",()=>{
    
console.log("Datbase Is Conected")
// console.log("Local Datbase Is Conected")
})
mongoose.connection.on("error" ,(err)=>{
    console.log(`Database is not connected :`+ err);
})

module.exports = mongoose
