const desModel = require('../models/desModel.js')
const asyncHandle = require('express-async-handler')


// create new product
const createDes = asyncHandle(async(req,res)=>{
    try {
        const newBlog = await desModel.create(req.body);
        res.status(200).send({
            success: true,
            message: "Create des success!",
            newBlog
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Create blog error!"
        });
    }
})


// update product
const updateDes = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedDes = await desModel.findOneAndUpdate({ _id: id }, req.body.blog, {
      new: true, // Trả về document đã được cập nhật
      runValidators: true, // Chạy các validator được định nghĩa trong schema
    });

    if (!updatedDes) {
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy mục để cập nhật",
      });
    }

    res.status(200).send({
      success: true,
      message: "Cập nhật sản phẩm thành công!",
      data: updatedDes, // Trả về dữ liệu sau khi đã cập nhật
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error);
    res.status(500).send({
      success: false,
      message: "Lỗi khi cập nhật sản phẩm",
      error: error.message,
    });
  }
};

// get a product
const getaDes = asyncHandle(async(req,res)=>{
    const {id}= req.params
    try {
        const findBlog = await desModel.findById(id)
        res.status(200).send({
            success : true,
            message : "get a product error !",
            findBlog
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success : false,
            message : "get a product error !"
        })
    }
})

// get all product
const getAllDes = asyncHandle(async(req,res)=>{
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


        let query = desModel.find(JSON.parse(queryStr)) // tìm kiếm các từ khóa được trả về


        // sorting
        if(req.query.sort){
            const sortBy = req.query.sort.split(",").join(" ")
            query=query.sort(sortBy) // lấy hết những gì query.sort có
        }else{
            query = query.sort("-createdAt")
        }
        // liming the fields
        if(req.query.fields){ // truy vấn tất cả những gì mà người search trên url http://localhost:5000/api/product/getall-product?fields=title,price,category
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
            const productCount = await desModel.countDocuments()
            if(skip>= productCount){
                res.status(500).send({
                    success : false,
                    message : "This page does not exists !"
                })
            }
        }

        console.log(page,limit,skip)


        const findProduct = await query // trả về kết quả
        res.json(findProduct)
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success : false,
            message : "get all product error !"
        })
    }
})






module.exports = {createDes ,getaDes,getAllDes,updateDes
  }

