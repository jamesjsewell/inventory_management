const Need = require("../../../db/needsPoll/needSchema.js");

exports.postNeed = function(req, res, next) {
	const postedBy = req.body.postedBy, degreeOfNeed = req.body.degreeOfNeed;

	const need = new Need({
		postedBy,
		degreeOfNeed
	});

	console.log(need)

	need.save((err, need) => {
		if (err) {
			console.log(err)
			return next(err);
		}

		res.status(201).json({
			needObj: need
		});
	});
};

exports.getNeeds = function(req, res, next) {
	Need.find(req.query, function(err, results) {
		if (err) return res.json(err);
		res.json(results);
	}).populate("");
};

exports.updateNeed = function(req, res, next) {
	Need.findByIdAndUpdate({ _id: req.params.theNeedId }, req.body, function(
		err,
		record
	) {
		if (err) {
			res.status(500).send(err);
		} else if (!record) {
			res.status(400).send("no record found with that id");
		} else {
			res.json(Object.assign({}, req.body, record));
		}
	});
};

exports.deleteNeed = function(req, res, next) {
	Need.remove({ _id: req.params.theNeedId }, function(error) {
		if (error) {
			res.status(400).json(error);
		}
		res.json({
			msg: `need with id ${req.params.theNeedId} has been removed.`,
			id: req.params.theNeedId
		});
	});
};
