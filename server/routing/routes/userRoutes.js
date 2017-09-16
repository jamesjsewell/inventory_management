const express = require("express"),
	UserController = require("./controllers/user.js"),
	userRoutes = express.Router(),
	passport = require("passport"),
	passportService = require("../../config/passport");

// middleware to require login/auth
const requireAuth = passport.authenticate("jwt", { session: false });
const requireLogin = passport.authenticate("local", { session: false });

userRoutes.get("/profile/:userId", requireAuth, UserController.viewProfile);

userRoutes.put("/profile/:userId", requireAuth, UserController.updateProfile);

userRoutes.get("/:userId", requireAuth, UserController.getUsers);

userRoutes.put("/:userId", requireAuth, UserController.updateUser);

module.exports = userRoutes;
