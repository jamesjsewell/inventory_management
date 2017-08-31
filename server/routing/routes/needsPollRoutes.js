const express = require("express"),
needsPollController = require("./controllers/needsPoll.js"),
needsPollRoutes = express.Router()

needsPollRoutes.post("/needs", needsPollController.postNeed)
needsPollRoutes.get("/needs", needsPollController.getNeeds)
needsPollRoutes.put("/needs/:theNeedId", needsPollController.updateNeed)
needsPollRoutes.delete("/needs/:theNeedId", needsPollController.deleteNeed)

module.exports = needsPollRoutes