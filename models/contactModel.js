const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var contactSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    note:{
        type:String,
        required:true,
    },
},{
    timestamps:true
});

//Export the model
module.exports = mongoose.model('Contact', contactSchema);