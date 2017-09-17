const express = require("express"),
needsPollController = require("./controllers/needsPoll.js"),
needsPollRoutes = express.Router()

needsPollRoutes.post("/needs", needsPollController.postNeed)
needsPollRoutes.get("/needs/:theNeedId", needsPollController.getNeeds)
needsPollRoutes.put("/needs/:theNeedId", needsPollController.updateNeed)
needsPollRoutes.delete("/needs/:theNeedId", needsPollController.deleteNeed)
needsPollRoutes.post("/newNeedForm", needsPollController.validateNewNeed)

module.exports = needsPollRoutes