const express = require("express");
const router = express.Router();
const imagesController = require("../controller/imagesController");

router.use("/", imagesController);

module.exports = router;
