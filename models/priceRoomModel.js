const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var priceSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    pricea:{
        type : String,
        required:true,
    },
    priceb:{
        type : String,
        required:true,
    },
    pricec:{
        type : String,
        required:true,
    },
    priced:{
        type : String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
},{
    timestamps:true
});

//Export the model
module.exports = mongoose.model('Price', priceSchema);