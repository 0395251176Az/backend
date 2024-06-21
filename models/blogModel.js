const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    images :[{
        public_id:String,
        url:String
    }],
    orderBy:{
        type: mongoose.Schema.Types.ObjectId, ref: "User" ,
        required:true,
    }
},{
    timestamps:true
});

//Export the model
module.exports = mongoose.model('Blog', blogSchema);