const express = require('express')
const {createDes,getAllDes,getaDes,updateDes} = 
    require('../controllers/desController')
const route = express.Router()



route.post('/add-des',createDes)

route.get('/get-des/:id',getaDes)
route.get('/get-all-des',getAllDes)

route.put('/update-des/:id',updateDes)


module.exports = route