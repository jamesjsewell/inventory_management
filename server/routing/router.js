const express = require("express");

// initializes main router
const apiRoutes = express.Router();

// import routes
const authRoutes = require("./routes/authRoutes.js"),
	envRoutes = require("./routes/envRoutes.js"),
	userRoutes = require("./routes/userRoutes.js"),
	formValidationRoutes = require("./routes/formValidationRoutes.js"),
	needsPollRoutes = require("./routes/needsPollRoutes.js"),
	sheltersRoutes = require("./routes/sheltersRoutes.js")
	
// sets subroutes of the main api route
apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/env", envRoutes);
apiRoutes.use("/user", userRoutes);
apiRoutes.use("/forms", formValidationRoutes);
apiRoutes.use("/needsPoll", needsPollRoutes);
apiRoutes.use("/sheltersFeature", sheltersRoutes);

module.exports = apiRoutes;


