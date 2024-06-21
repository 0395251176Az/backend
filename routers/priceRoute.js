const express = require('express')
const {createPrice,deletePrice,getAllPrice,getaPrice,updatePrice} = 
    require('../controllers/priceController')
const { isAdmin,authMiddleware} = require('../middlewares/authMiddleware')
const route = express.Router()



route.post('/add-price',authMiddleware,isAdmin,createPrice)

route.get('/get-price/:id',getaPrice)

route.get('/get-all-price',getAllPrice)

route.put('/update-price/:_id',authMiddleware,isAdmin,updatePrice)

route.delete('/delete-price/:_id',authMiddleware,isAdmin,deletePrice)


module.exports = route