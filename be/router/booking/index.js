const express = require("express");
const router = express.Router();
const bookingController = require("../controller/bookingController");

router.use("/", bookingController);

module.exports = router;
