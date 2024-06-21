const express = require('express')
const {updateblog, createBlog,getaBlog, getAllBlog, deleteBlog} = 
    require('../controllers/blogController')
const { isAdmin,authMiddleware} = require('../middlewares/authMiddleware')
const route = express.Router()



route.post('/add-blog',authMiddleware,isAdmin,createBlog)

route.get('/get-blog/:id',getaBlog)
route.get('/get-all-blog',getAllBlog)

route.put('/update-blog/:_id',authMiddleware,isAdmin,updateblog)

route.delete('/delete-blog/:_id',authMiddleware,isAdmin,deleteBlog)


module.exports = route