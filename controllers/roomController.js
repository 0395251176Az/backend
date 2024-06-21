const roomModel = require('../models/roomModel.js')
const slugify = require('slugify')

// create new room
const createRoom = async(req,res)=>{
    try {
        if(req.body.title){
            req.body.slug = slugify(req.body.title)
        }
        const newroom = await roomModel.create(req.body)
        res.status(200).send({
            success : true,
            message : "create room success !",
            newroom
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success : false,
            message : "create room error !"
        })
    }
}


// update room
const updateRoom = async (req, res) => {
    const {_id} = req.params;
    console.log(req.body)
    try {
      if (req.body.title) {
        req.body.slug = slugify(req.body.title);
      }
      const updateRoom = await roomModel.findOneAndUpdate({ _id }, req.body, {
        new: true,
      })
      res.status(200).send({
        success : true,
        message : "update room success !"
    })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success : false,
            message : "update room error !"
        })
    }
  }
  // delete room
const deleteRoom = async (req, res) => {
    const {_id} = req.params;
    try {
      const deleteRoom = await roomModel.findOneAndDelete({_id})
      res.status(200).send({
        success : false,
        message : "delete room success !",
        deleteRoom
    })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success : false,
            message : "delete room error !"
        })
    }
}

// get a room
const getaRoom = async(req,res)=>{
    const {id}= req.params
    try {
        const findroom = await roomModel.findById(id)
        res.status(200).send({
            success : true,
            message : "get a room error !",
            findroom
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success : false,
            message : "get a room error !"
        })
    }
}

const getSlugRoom = async(req,res)=>{
    const {slug}= req.params
    try {
        const findroom = await roomModel.findOne({slug})
        res.json(findroom)
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success : false,
            message : "get a room error !"
        })
    }
    // console.log(slug)
}

// get all room
const getAllRoom = async(req,res)=>{
    try {

        // filtering 
        const queryObj = {...req.query} //truy vấn của yêu cầu (req.query) bằng cách sử dụng toán tử spread (...)
        // Một mảng excludeFields được định nghĩa để loại bỏ các trường cụ thể khỏi các tham số truy vấn (page, sort, limit, fields).
        const excludeFiedls = ['page','sort','limit','fields'] // cho ban đầu 
        excludeFiedls.forEach(el =>delete queryObj[el]) // nếu có cái nào trùng với queryObj thì xóa đi

        let queryStr = JSON.stringify(queryObj)
        // Các tham số truy vấn còn lại được chuyển đổi thành một chuỗi JSON 
        // (queryStr) và sau đó được biến đổi bằng một biểu thức chính quy để thay thế một 
        // số toán tử so sánh cụ thể (gte, gt, lte, lt) bằng các giá trị tương ứng của MongoDB ($gte, $gt, $lte, $lt).
        // replace sử dụng để thay thế một chuỗi con cụ thể bằng một chuỗi mới
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) =>`$${match}`) 
        // Nếu match là "gte", thì chuỗi mới sẽ là "$gte".
        // Nếu match là "gt", thì chuỗi mới sẽ là "$gt".


        let query = roomModel.find(JSON.parse(queryStr)) // tìm kiếm các từ khóa được trả về


        // sorting
        if(req.query.sort){
            const sortBy = req.query.sort.split(",").join(" ")
            query=query.sort(sortBy) // lấy hết những gì query.sort có
        }else{
            query = query.sort("-createdAt")
        }
        // liming the fields
        if(req.query.fields){ // truy vấn tất cả những gì mà người search trên url http://localhost:5000/api/room/getall-room?fields=title,price,category
            const fields = req.query.fields.split(",").join(" ")
            query=query.select(fields) // lấy hết những gì query.sort có
        }else{
            query = query.select("-__v")
        }

        // pagination
        const page = req.query.page
        const limit = req.query.limit
        const skip = (page - 1) * limit
        query = query.skip(skip).limit(limit)
        if(req.query.page){
            const roomCount = await roomModel.countDocuments()
            if(skip>= roomCount){
                res.status(500).send({
                    success : false,
                    message : "This page does not exists !"
                })
            }
        }
        const findroom = await query // trả về kết quả
        res.json(findroom)
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success : false,
            message : "get all room error !"
        })
    }
}




module.exports = {createRoom ,getaRoom,getAllRoom
  ,updateRoom,deleteRoom,getSlugRoom
  }

