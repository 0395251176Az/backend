const express = require('express')
const {updateContact, createContact,getaContact, getAllContact, deleteContact} = 
    require('../controllers/contactController')
const route = express.Router()



route.post('/add-contact',createContact)

route.get('/get-contact/:id',getaContact)
route.get('/get-all-contact',getAllContact)

route.put('/update-contact/:_id',updateContact)

route.delete('/delete-contact/:_id',deleteContact)


module.exports = route