const express = require("express");
const router = express.Router();
const amenityController = require("../controller/amenityController");


router.use("/", amenityController);

module.exports = router;