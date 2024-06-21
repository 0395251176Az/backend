const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const dbConnect = require('./config/dbConnect')

const cookieParser = require('cookie-parser')
const blogRoute =require('./routers/blogRoute')
const uploadRoute =require('./routers/uploadRoute')
const authRoute =require('./routers/authRoute')
const roomRoute =require('./routers/roomRoute')
const bookingRoute =require('./routers/bookingRoute')
const bookingModel = require('./models/booking.js')
const desRoute = require('./routers/desRoute.js')
const contactRoute = require('./routers/contactRoute.js')
const priceRoute = require('./routers/priceRoute.js')
const crypto = require('crypto')
const bodyParser = require('body-parser')
const app = express()
const PORT  = 5000
const axios = require('axios')


dbConnect()
app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : false}))
app.use(cookieParser())


app.use('/api/auth',authRoute)
app.use('/api/upload',uploadRoute)
app.use('/api/blog',blogRoute)
app.use('/api/product',roomRoute)
app.use('/api/booking',bookingRoute)
app.use('/api/des',desRoute)
app.use('/api/contact',contactRoute)
app.use('/api/price',priceRoute)


app.listen(PORT,()=>{
    console.log(`Server is running at PORT ${PORT}`)
})