const express = require("express"),
	sheltersController = require("./controllers/shelters.js"),
	sheltersRoutes = express.Router();

sheltersRoutes.post("/shelters", sheltersController.postShelter);
sheltersRoutes.get("/shelters/:theShelterId", sheltersController.getShelter);
sheltersRoutes.get("/shelters", sheltersController.getShelters);
sheltersRoutes.put("/shelters/:theShelterId", sheltersController.updateShelter);
sheltersRoutes.delete(
	"/shelters/:theShelterId",
	sheltersController.deleteShelter
);
sheltersRoutes.post("/newShelterForm", sheltersController.validateNewShelter);

module.exports = sheltersRoutes;
