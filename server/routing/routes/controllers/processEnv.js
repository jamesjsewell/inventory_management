exports.fetchAPIkeys = function(req, res, next) {
	return res.status(200).json({ key: process.env[req.body.key] });
};
