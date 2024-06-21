const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var bookingSchema = new mongoose.Schema({
    pay:{
      type:Array
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    count:{
        type: Number,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    note: {
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },
    images :[{
        public_id:String,
        url:String
    }],
    imagesVeri :[{
        public_id:String,
        url:String
    }],
    startDate: 
    [{
        type: String,
        required: true,
    }],
     paymentMethod:{
      type : String,
      default : "Thanh toán tiền mặt",
      enum : ['Thanh toán tiền mặt',"Chuyển khoản ngân hàng"]
    },
    // endDate: {
    //     type: Date,
    //     required: true,
    // },
    status: {
        type: String,
        default: 'Đang xác nhận',
        enum: ['Đang xác nhận', 'Duyệt đơn', 'Đã trả phòng'],
    },
    
}, {
    timestamps: true
});

//Export the model
module.exports = mongoose.model('Booking', bookingSchema);
