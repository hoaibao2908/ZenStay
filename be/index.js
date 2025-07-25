const express = require("express");
const cors = require("cors");
const { Op } = require("sequelize");
var app = express(); //tạo ứng dụng nodejs
const port = 4000;
const router = require("./router/index");
const db = require("./config/database");

//api
app.use(express.urlencoded({ extended: true })); //cho phép đọc dữ liệu dạng form
app.use(express.json()); //cho phép đọc dữ liệu dạng json
app.use(cors()); //cho phép mọi nguồi bên ngoài request đến ứnd dụng

//routes
router(app);

app.use((req, res, next) => {
  res.status(404).json({ message: "Không tìm thấy tài nguyên." });
});

// Xử lý lỗi chung (Error handling middleware) - đặt cuối cùng
app.use((err, req, res, next) => {
  console.error(err.stack); // Log lỗi ra console
  res.status(err.status || 500).json({
    message: err.message || "Đã xảy ra lỗi nội bộ máy chủ.",
    error: process.env.NODE_ENV === "development" ? err : {}, // Chỉ gửi chi tiết lỗi trong môi trường dev
  });
});

app
  .listen(port, () => {
    console.log(`Ung dung dang chay o port ${port}`);
  })

  .on("error", function (err) {
    console.log(`Loi xay ra khi chay ung dung ${err}`);
  });
