const express = require("express");
const router = express.Router();
const roomController = require("../controller/roomController");

router.use("/", roomController);

module.exports = router;
