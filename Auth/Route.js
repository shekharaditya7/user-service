const express = require("express");
const router = express.Router();
const { adminAuth } = require("../middleware/auth");

const { register, login, loginStatus } = require("./auth");

router.route("/login-status").get(loginStatus);
router.route("/register").post(register);
router.route("/login").post(login);

/*
Protecting the update and delete routes
*/
// router.route("/update").put(adminAuth, update);
// router.route("/deleteUser").delete(adminAuth, deleteUser);

module.exports = router;
