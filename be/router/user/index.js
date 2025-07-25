const express = require("express");
const router = express.Router();
const userController = require("../../controller/userController");

// router.get("/", userController);
router.post("/login", userController.login);
router.post("/register", userController.register);
router.get("/verify", userController.verify);
module.exports = router;
