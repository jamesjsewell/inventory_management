const express = require("express"),
UserProfileController = require("./controllers/userProfile.js"),
userProfileRoutes = express.Router(),
passport = require("passport"),
passportService = require("../../config/passport")

// middleware to require login/auth
const requireAuth = passport.authenticate("jwt", { session: false })
const requireLogin = passport.authenticate("local", { session: false })

userProfileRoutes.get(
	"/:userId",
	requireAuth,
	UserProfileController.viewProfile
)

userProfileRoutes.put(
	"/:userId",
	requireAuth,
	UserProfileController.updateProfile
)

module.exports = userProfileRoutes