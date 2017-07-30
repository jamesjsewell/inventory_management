const express = require("express"),
AccessEnvController = require("./controllers/processEnv.js"),
envRoutes = express.Router()

envRoutes.post("/request-api-key", AccessEnvController.fetchAPIkeys)

module.exports = envRoutes



