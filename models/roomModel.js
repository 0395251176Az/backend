const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var roomSchema = new mongoose.Schema({
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
    priceHour:{
        type : String,
        required:true,
    },
    priceDay:{
        type : String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        // required:true,
        default : "Đang trống",
        enum : ['Đang trống',"Đã được đặt"]
    },
    startDate:{
        type : String
    }
},{
    timestamps:true
});

//Export the model
module.exports = mongoose.model('Room', roomSchema);