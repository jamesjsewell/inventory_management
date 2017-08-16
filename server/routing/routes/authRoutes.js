const express = require("express"),
	authRoutes = express.Router(),
	UserAuthController = require("./controllers/userAuthentication.js"),
	passport = require("passport"),
	passportService = require("../../config/passport")

// import user roles
const ROLE_MEMBER = require("../../config/constants").ROLE_MEMBER,
	ROLE_CLIENT = require("../../config/constants").ROLE_CLIENT,
	ROLE_OWNER = require("../../config/constants").ROLE_OWNER,
	ROLE_ADMIN = require("../../config/constants").ROLE_ADMIN

// middleware to require login/auth
const requireAuth = passport.authenticate("jwt", { session: false })
const requireLogin = passport.authenticate("local", { session: false })

// actual crud routes
authRoutes.post("/register", UserAuthController.register)

authRoutes.post("/login", requireLogin, UserAuthController.login)

authRoutes.post("/forgot-password", UserAuthController.forgotPassword)

authRoutes.post("/reset-password/:token", UserAuthController.verifyToken)

authRoutes.get("/authenticate", requireAuth, (req, res) => {
	res.send({ authenticated: true })
})

// tests user role auth
authRoutes.get(
	"/admins-only",
	requireAuth,
	UserAuthController.roleAuthorization(ROLE_ADMIN),
	(req, res) => {
		res.send({ content: "Admin dashboard is working." })
	}
)

module.exports = authRoutes
