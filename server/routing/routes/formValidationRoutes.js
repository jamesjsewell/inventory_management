const express = require("express"),
	AsyncValidationController = require("./controllers/asyncFormValidation.js"),
	NewItemFormController = require("./controllers/newItemFormValidation.js"),
	formValidationRoutes = express.Router();
formValidationRoutes.post(
	"/validate",
	AsyncValidationController.aSyncValidation
)
formValidationRoutes.post(
	"/forms/newItemForm",
	NewItemFormController.aSyncValidation
)
module.exports = formValidationRoutes