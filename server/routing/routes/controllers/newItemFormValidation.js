const User = require("../../../db/userSchema.js");

exports.aSyncValidation = function(req, res, next) {
    const email = req.body.values.email;
    const emailConfirm = req.body.values.emailConfirm;
    const password = req.body.values.password;
    const passwordConfirm = req.body.values.passwordConfirm;
    const username = req.body.values.username;
    var errors = {};

    if (!username) {
        User.findOne({ email }, (err, existingUser) => {
            if (err) {
            }

            // If user is not unique, return error
            if (existingUser) {
                errors["email"] = "email already in use";
            }

            if (password && passwordConfirm) {
                if (password != passwordConfirm) {
                    errors["passwordConfirm"] = "passwords must match";
                }
            }

            if (email && emailConfirm) {
                if (email.toLowerCase() != emailConfirm.toLowerCase()) {
                    errors["emailConfirm"] = "emails must match";
                }
            }

            if (Object.keys(errors).length > 0) {
                return res.status(422).send(errors);
            }
        });
    } else {
        User.findOne({ username }, (err, existingUser) => {
            if (err) {
            }

            // If user is not unique, return error
            if (existingUser) {
                errors["username"] = "username already in use";
                return res.status(422).send(errors);
            }
        });
    }
};
