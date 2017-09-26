const Need = require("../../../db/needsPoll/needSchema.js");

exports.postNeed = function(req, res, next) {
	const nameOfNeed = req.body.nameOfNeed,
		postedBy = req.body.postedBy,
		degreeOfNeed = req.body.degreeOfNeed,
		numberOfPeople = req.body.numberOfPeople,
		description = req.body.description,
		shelter = req.body.shelter;

	const need = new Need({
		nameOfNeed,
		postedBy,
		degreeOfNeed,
		numberOfPeople,
		description,
		shelter
	});

	need.save(err => {
		if (err) {
			return res.status(500).send(err);
		}
		res.status(201).json(need);
	});
};

exports.getNeeds = function(req, res, next) {
	var queryObj = {};
	if (req.params.theNeedId) {
		queryObj.shelter = { _id: req.params.theNeedId };
	}

	Need.find(queryObj, function(err, results) {
		if (err) return res.json({ error: "internal server error" });

		res.json(results);
	});
};

exports.updateNeed = function(req, res, next) {
	Need.findByIdAndUpdate({ _id: req.params.theNeedId }, req.body, function(
		err,
		record
	) {
		if (err) {
			console.log(err);
			res.status(400).send(err);
		} else if (!record) {
			res.status(400).send("did not find need");
		} else {
			res.json(req.body);
		}
	});
};

exports.deleteNeed = function(req, res, next) {
	Need.remove({ _id: req.params.theNeedId }, function(error) {
		if (error) {
			res.status(400).json(error);
		}
		res.status(201).json({
			msg: `need with id ${req.params.theNeedId} has been removed.`,
			id: req.params.theNeedId
		});
	});
};

exports.validateNewNeed = function(req, res, next) {
	var nameOfNeed = req.body.values.nameOfNeed;
	var shelter = req.body.values.shelter;
	console.log(shelter);

	Need.findOne({ nameOfNeed, shelter }, (err, existingNeed) => {
		if (err) {
		}
		var errors = {};
		// If user is not unique, return error
		if (existingNeed) {
			errors["nameOfNeed"] = "already exists";
		}

		if (Object.keys(errors).length > 0) {
			return res.status(422).send(errors);
		}
	});
};
