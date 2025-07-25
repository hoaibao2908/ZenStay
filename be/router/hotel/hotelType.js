const express = require("express");
const router = express.Router();
const hotelTypeController = require("../../controller/hotelTypeController");

//lấy tất cả loại khách sạn
router.get("/", hotelTypeController.get);
//lấy loại theo id
router.get("/:id", hotelTypeController.getById);
//thêm loại khách sạn mới
router.post("/", hotelTypeController.create);

module.exports = router;
