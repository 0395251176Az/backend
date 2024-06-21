const express = require('express');
const router = express.Router();
const { getBookingDetails, getAllBooking, addBooking, deleteBooking, updateStatusBooking} = require('../controllers/bookingController');

router.post('/booking/add-booking',addBooking)
router.put('/booking/update-booking/:_id/:status',updateStatusBooking)

router.get('/booking/:id', getBookingDetails);
router.get('/get-all-booking', getAllBooking);

router.delete('/delete-booking/:id', deleteBooking);

module.exports = router;
