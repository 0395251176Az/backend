const express = require('express')
const route = express.Router()

const {authMiddleware,isAdmin} = require('../middlewares/authMiddleware.js')
const {loginAdmin, updateUser, getAllUsers, getsignUser, handleRefreshToken, deletesignUser, addUser, sendEmail} = 
require('../controllers/userController.js')

route.post('/sendemail',sendEmail)
route.post('/register',addUser)
route.post('/admin-login',loginAdmin)
route.put('/update-user/:_id',authMiddleware ,updateUser)

route.get('/all-user',getAllUsers)
route.get('/get-user/:_id',authMiddleware,isAdmin, getsignUser)
route.get("/refresh", handleRefreshToken);

route.delete('/delete-user/:_id',deletesignUser)


module.exports = route
