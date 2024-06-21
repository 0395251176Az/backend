const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var desSchema = new mongoose.Schema({
    description:{
        type:String,
        required:true
    }
},{
    timestamps:true
});

//Export the model
module.exports = mongoose.model('Des', desSchema);