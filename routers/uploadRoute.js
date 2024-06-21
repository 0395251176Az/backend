const express = require("express");
const {
  uploadImages,
  deleteImages,
  deleteImagesModel,
} = require("../controllers/uploadController");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const { uploadPhoto, productImgResize } = require("../middlewares/uploadImg");
const route = express.Router();

route.post("/upload", uploadPhoto.array("images", 10), uploadImages);

route.delete("/delete-image/:id", deleteImages);
route.delete("/delete-imagemodel/:id/:public_id", deleteImagesModel);

module.exports = route;
