const {
  cloudinaryUploadImg,
  cloudinaryDeleteImg,
} = require("../utils/cloudinaly.js");
const roomModel = require("../models/roomModel.js");
const cloudinary = require("cloudinary").v2;
const uploadImages = async (req, res) => {
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      urls.push(newPath);
    }

    const images = urls.map((file) => {
      return file;
    });
    res.json(images);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "upload product images error !",
    });
  }
};

const deleteImages = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteImg = cloudinaryDeleteImg(id, "images");
    res.json({ message: "deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "upload product images error !",
    });
  }
};
const deleteImagesModel = async (req, res) => {
  const { id, public_id } = req.params;
  try {
    // Find the room by id
    const room = await roomModel.findById(id);
    if (!room) {
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    }

    // Find the image by public_id and remove it from the images array
    const imageIndex = room.images.findIndex(
      (img) => img.public_id === public_id
    );
    if (imageIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Image not found" });
    }

    const [image] = room.images.splice(imageIndex, 1);

    // Save the updated room document
    await room.save();

    // Delete the image from Cloudinary
    cloudinary.uploader.destroy(public_id, (error, result) => {
      if (error) {
        console.error("Cloudinary deletion error:", error);
        return res.status(500).json({
          success: false,
          message: "Failed to delete image from Cloudinary",
        });
      }
      res.json({
        success: true,
        message: "Image deleted successfully from Cloudinary and database",
        result,
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error deleting image!",
    });
  }
};
module.exports = {
  uploadImages,
  deleteImages,
  deleteImagesModel,
};
