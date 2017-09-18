const Shelter = require("../../../db/shelters/shelterSchema.js");

exports.postShelter = function(req, res, next) {
	const nameOfItem = req.body.nameOfItem,
		postedBy = req.body.postedBy,
		description = req.body.description,
		members = req.body.members,
		place = req.body.place;

	const shelter = new Shelter({
		nameOfItem,
		postedBy,
		description,
		members,
		place
	});

	shelter.save(err => {
		if (err) {
			return res.status(500).send(err);
		}
		res.status(201).json(shelter);
	});
};

exports.getShelters = function(req, res, next) {
	console.log(req.query)
	Shelter.find(req.query, function(err, results) {
		if (err) return res.json({ error: "internal server error" });
		
		res.json(results);
	})//.populate({
	// 	path: "members",
	// 	match: {},
	// 	select: " -password",
	// 	options: {}
	// });
};

exports.getShelter = function(req, res, next) {
	var query = {};
	if (req.params.theShelterId) {
		query._id = req.params.theShelterId;
	}
	
	Shelter.find(query, function(err, results) {
		if (err) return res.json({ error: "internal server error" });
		res.status(201).json(results);
	})//.populate({
	// 	path: "members",
	// 	match: {},
	// 	select: " -password",
	// 	options: {}
	// });
};


exports.updateShelter = function(req, res, next) {
	Shelter.findByIdAndUpdate(
		{ _id: req.params.theShelterId },
		req.body,
		function(err, record) {
			if (err) {
				console.log(err);
				res.status(400).send(err);
			} else if (!record) {
				res.status(400).send("did not find shelter");
			} else {
				res.json(req.body);
			}
		}
	);
};

exports.deleteShelter = function(req, res, next) {
	Shelter.remove({ _id: req.params.theShelterId }, function(error) {
		if (error) {
			res.status(400).json(error);
		}
		res.status(201).json({
			msg: `shelter with id ${req.params.theShelterId} has been removed.`,
			id: req.params.theShelterId
		});
	});
};

exports.validateNewShelter = function(req, res, next) {
	var nameOfItem = req.body.values.nameOfItem;

	Shelter.findOne({ nameOfItem }, (err, existingShelter) => {
		if (err) {
		}
		var errors = { null: null };
		// If user is not unique, return error
		if (existingShelter) {
			errors["nameOfItem"] = "already exists";
		}

		if (Object.keys(errors).length > 0) {
			return res.status(422).send(errors);
		}
	});
};
