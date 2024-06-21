const express = require('express')
const {createRoom,deleteRoom,getAllRoom,getSlugRoom,getaRoom,updateRoom} = 
    require('../controllers/roomController')
const { isAdmin,authMiddleware} = require('../middlewares/authMiddleware')
const route = express.Router()

route.post('/add-product',authMiddleware,isAdmin,createRoom)

route.get('/get-product/:id',getaRoom)
route.get('/get-slug-product/:slug',getSlugRoom)
route.get('/getall-product',getAllRoom)


route.put('/update-product/:_id',authMiddleware,isAdmin,updateRoom)

route.delete('/delete-product/:_id',authMiddleware,isAdmin,deleteRoom)

module.exports = route