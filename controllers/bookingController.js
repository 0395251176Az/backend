const bookingModel = require('../models/booking.js')
const roomModel = require('../models/roomModel.js')

const addBooking = async (req, res) => {
  try {
    const booking = await bookingModel.create(req.body);
    const room = await roomModel.findById(req.body.room._id);
    const newStartDate = req.body.startDate;
    const existingStartDate = room.startDate ? room.startDate.split(', ') : [];
    const combinedStartDate = [...existingStartDate, ...newStartDate].join(', ');
    room.status = "Đã được đặt";
    room.startDate = combinedStartDate;
    await room.save();
    res.json(booking);
  } catch (error) {
    // Xử lý lỗi
    res.status(500).json({ message: error.message });
  }
  console.log(req.body);
};


const deleteBooking = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the booking to be deleted
    const booking = await bookingModel.findById(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Retrieve room ID and start dates from the booking
    const { room: roomId, startDate: bookingStartDates } = booking;

    // Find the corresponding room
    const room = await roomModel.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Remove the start dates associated with the deleted booking
    const existingStartDateArray = room.startDate ? room.startDate.split(', ') : [];
    const updatedStartDateArray = existingStartDateArray.filter(date => !bookingStartDates.includes(date));

    // Update room status and start dates
    room.status = updatedStartDateArray.length === 0 ? "Đang trống" : room.status;
    room.startDate = updatedStartDateArray.join(', ');

    // Save the updated room
    await room.save();

    // Delete the booking
    await bookingModel.findByIdAndDelete(id);

    // Respond with a success message and the deleted booking
    res.json({
      message: "Đã xóa thành công",
      booking
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllBooking = async(req,res)=>{
  try {
    const booking = await bookingModel.find();
    res.json(booking);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
}

// Xem chi tiết đơn đặt phòng
const getBookingDetails = async (req, res) => {
    try {
      const booking = await bookingModel.findById(req.params.id).populate('room');
      if (!booking) {
          return res.status(404).json({ message: 'Booking not found' });
      }
      res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateStatusBooking = async (req, res) => {
  const { _id, status } = req.params;

  try {
    // Tìm đơn hàng cần cập nhật bằng _id
    const updateOrder = await bookingModel.findById(_id).populate('room');

    if (!updateOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const room = await roomModel.findById(updateOrder.room._id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    if (status === "Đã trả phòng") {
      // Remove start dates associated with the booking
      const bookingStartDates = updateOrder.startDate;
      const existingStartDateArray = room.startDate ? room.startDate.split(', ') : [];
      const updatedStartDateArray = existingStartDateArray.filter(date => !bookingStartDates.includes(date));
      room.startDate = updatedStartDateArray.join(', ');

      // Update room status
      room.status = updatedStartDateArray.length === 0 ? "Đang trống" : room.status;
      await room.save();
    }

    // Update booking status
    updateOrder.status = status;
    await updateOrder.save();

    res.json(updateOrder);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Update order error!",
    });
  }
};

module.exports = {
  getBookingDetails,getAllBooking,addBooking,
  deleteBooking,updateStatusBooking
}