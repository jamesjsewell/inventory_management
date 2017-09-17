const express = require("express"),
	AsyncValidationController = require("./controllers/asyncFormValidation.js"),
	formValidationRoutes = express.Router();
formValidationRoutes.post(
	"/validate",
	AsyncValidationController.aSyncValidation
);

module.exports = formValidationRoutes;
