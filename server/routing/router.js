const express = require("express");

// initializes main router
const apiRoutes = express.Router();

// import routes
const authRoutes = require("./routes/authRoutes.js"),
	envRoutes = require("./routes/envRoutes.js"),
	userProfileRoutes = require("./routes/userProfileRoutes.js"),
	formValidationRoutes = require("./routes/formValidationRoutes.js"),
	needsPollRoutes = require("./routes/needsPollRoutes.js");

// sets subroutes of the main api route
apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/env", envRoutes);
apiRoutes.use("/user", userProfileRoutes);
apiRoutes.use("/forms", formValidationRoutes);
apiRoutes.use("/needsPoll", needsPollRoutes);

module.exports = apiRoutes;
