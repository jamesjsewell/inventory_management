const User = require("../../../db/userSchema.js");
const setUserInfo = require("../../../config/helpers.js").setUserInfo;
const _ = require("underscore");

exports.viewProfile = function(req, res, next) {
    const userId = req.params.userId;
    if (req.user._id.toString() !== userId) {
        return res.status(401).json({
            error: "You are not authorized to view this user profile."
        });
    }
    User.findById(userId, "-password", (err, user) => {
        if (err) {
            res
                .status(400)
                .json({ error: "No user could be found for this ID." });
            return next(err);
        }

        return res.status(200).json({ user: user });
    });
};

exports.updateProfile = function(req, res, next) {
    const userId = req.params.userId;

    if (req.user._id.toString() !== userId) {
        return res.status(401).json({
            error: "You are not authorized to view this user profile."
        });
    }
    User.findByIdAndUpdate(userId, req.body, function(err, record) {
        if (err) {
            res
                .status(400)
                .json({ error: "server error, cannot update profile" });
        } else if (!record) {
            res.status(400).json({ error: "no record found with that id" });
        } else {
            return res.status(200).json(_.extend(record, req.body, {}));
        }
    });
};

exports.getUsers = function(req, res, next) {
    const userId = req.params.userId;

    if (req.user._id.toString() !== userId) {
        return res.status(401).json({
            error: "You are not authorized to view this user."
        });
    }
    User.findById(userId, "-password", (err, user) => {
        if (err) {
            res
                .status(400)
                .json({ error: "No user could be found for this ID." });
            return next(err);
        }

        return res.status(200).json(user);
    })
};

exports.updateUser = function(req, res, next) {
    const userId = req.params.userId;
   
    if (req.user._id.toString() !== userId) {
        return res.status(401).json({
            error: "You are not authorized to view this user."
        });
    }
    User.findByIdAndUpdate(userId, req.body, function(
        err,
        record
    ) {
        if (err) {
            res.status(400).json({ error: "server error, cannot update user" });
        } else if (!record) {
            res.status(400).json({ error: "no user found with that id" });
        } else {
           
            var sanitizedUser = _.omit(record.toObject(), 'password')
            var updatedUser = _.extend(sanitizedUser, req.body)
            return res.status(200).json(updatedUser);
        }
    });
};
