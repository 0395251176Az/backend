const { genarateToken } = require("../config/jwtToken.js");
const { genarateRefreshToken } = require("../config/refreshToken.js");
const userModel = require("../models/userModel.js");
const nodemailer = require("nodemailer");
require("dotenv").config();

let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "tuan_2051220002@dau.edu.vn",
    pass: "ikbtmqhjdxhahznd",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendEmail = async (req, res) => {
  const { email } = req.params;
  var mailOptions = {
    from: process.env.SMTP_MAIL,
    to: "huongangel1120@gmail.com", // thay ở đây
    subject: "THÔNG BÁO ĐƠN HÀNG MỚI",
    text: `Bạn vừa có đơn hàng mới, vào admin để kiểm tra`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(500).send("Error sending email");
    } else {
      console.log("Email sent successfully!");
      res.status(200).json({
        OTP: otp,
      });
    }
  });
};
const addUser = async (req, res) => {
  const { email } = req.body;
  const exisitingUser = await userModel.findOne({ email }); // kiểm tra có email nào chưa
  if (exisitingUser) {
    return res.status(500).send({
      success: true,
      message: "Email này đã tồn tại", // nếu tìm thấy có tồn tại
    });
  }
  try {
    const newUser = new userModel(req.body).save();
    res.status(201).send({
      newUser: req.body,
      success: true,
      message: "Create new user successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Create new User False",
      success: false,
      error: error,
    });
  }
};

// login admin
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  const findAdmin = await userModel.findOne({ email });
  if (findAdmin.role !== "admin") {
    return res.status(500).send({
      success: false,
      message: "not authorised", // nếu tìm thấy có tồn tại
    });
  }
  if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
    const refreshToken = await genarateRefreshToken(findAdmin?._id);
    const updateUser = await userModel.findByIdAndUpdate(
      findAdmin?._id,
      {
        refreshToken: refreshToken,
      },
      {
        new: true,
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.status(201).send({
      success: true,
      message: "Login successfully",
      _id: findAdmin?._id,
      name: findAdmin?.name,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      password: findAdmin?.password,
      role: findAdmin?.role,
      token: genarateToken(findAdmin?._id), // hiển thị ra token
    });
  } else {
    return res.status(500).send({
      success: true,
      message: "please create new user, Invalid", // nếu tìm thấy có tồn tại
    });
  }
};

// handle refresh token
const handleRefreshToken = async (req, res) => {
  const cookie = req.cookies;
  console.log(cookie);
  if (!cookie?.refreshToken) {
    res.send({
      success: false,
      message: "No refresh token in cookies",
    });
  }
  const refreshToken = cookie?.refreshToken;
  console.log(refreshToken);
  const user = await userModel.findOne({ refreshToken });
  if (!user) {
    res.status(401).send({
      success: false,
      message: "No refresh token present in db or not matched",
      user,
    });
  }
  jwt.verify(refreshToken, "SECRET", (err, decoded) => {
    if (err || user.id !== decoded.id) {
      res.status(401).send({
        success: false,
        message: "there is something wrong with refresh token",
      });
    }
    const accessToken = genarateToken(user.id);
    res.status(200).send({
      success: true,
      message: "refresh token success",
      accessToken,
    });
  });
};

// get all users
const getAllUsers = async (req, res) => {
  try {
    const user = await userModel.find({});
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Get all users error !",
    });
  }
};

// get a user
const getsignUser = async (req, res) => {
  const { _id } = req.params;
  try {
    const getUser = await userModel.findById(_id);
    res.status(200).json({
      success: true,
      message: "Get user successfully !",
      getUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Get user error !",
    });
  }
};

// update user
const updateUser = async (req, res) => {
  const { _id } = req.params;
  try {
    // Hash lại mật khẩu mới nếu có
    if (req.body.password) {
      const salt = await bcrypt.genSaltSync(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    const user = await userModel.findByIdAndUpdate(
      _id,
      {
        name: req?.body?.name,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
        password: req?.body?.password,
        role: req?.body?.role,
      },
      {
        new: true,
      }
    );
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Update user error !",
    });
  }
};

// delete a user
const deletesignUser = async (req, res) => {
  const { _id } = req.params;
  try {
    const user = await userModel.findByIdAndDelete(_id);
    res.status(200).json({
      success: true,
      message: "delete user successfully !",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "delete user error !",
    });
  }
};

module.exports = {
  sendEmail,
  getAllUsers,
  getsignUser,
  deletesignUser,
  loginAdmin,
  handleRefreshToken,
  updateUser,
  addUser,
};
