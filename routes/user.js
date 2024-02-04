const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

const userController = require("../controllers/users");


//post user | signup user
router.route("/signup")
.get(userController.renderSignupForm)
.post(userController.signup);


//RENDERLOGIN || LOGIN
router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl, passport.authenticate("local", {
  failureRedirect: "/login",
  failureFlash: true,
}), userController.login);


//Logout Route
router.get("/logout", userController.logout)

module.exports = router;
