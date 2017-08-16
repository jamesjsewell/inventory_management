const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const User = require("../../../db/userSchema.js")
// const mailchimp = require('../config/mailchimp');
const setUserInfo = require("../../../config/helpers").setUserInfo
const getRole = require("../../../config/helpers").getRole
const nodemailer = require("nodemailer")

// Generate JWT
// TO-DO Add issuer and audience
function generateToken(user) {
    return jwt.sign(user, process.env.AUTH_SECRET, {
        expiresIn: 604800 // in seconds
    })
}

// Login Route
exports.login = function(req, res, next) {
    const userInfo = setUserInfo(req.user)

    res.status(200).json({
        token: `JWT ${generateToken(userInfo)}`,
        user: userInfo
    })
}

// Registration Route
exports.register = function(req, res, next) {
    // Check for registration errors
    const email = req.body.email
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const password = req.body.password

    // Return error if no email provided
    if (!email) {
        return res
            .status(422)
            .send({ error: "You must enter an email address." })
    }

    // Return error if no password provided
    if (!password) {
        return res.status(422).send({ error: "You must enter a password." })
    }

    User.findOne({ email }, (err, existingUser) => {
        if (err) {
            return next(err)
        }

        // If user is not unique, return error
        if (existingUser) {
            return res
                .status(422)
                .send({ error: "That email address is already in use." })
        }

        // If email is unique and password was provided, create account
        const user = new User({
            email,
            password,
            profile: { firstName, lastName }
        })

        user.save((err, user) => {
            if (err) {
                return next(err)
            }

            // Subscribe member to Mailchimp list
            // mailchimp.subscribeToNewsletter(user.email);

            // Respond with JWT if user was created

            const userInfo = setUserInfo(user)

            res.status(201).json({
                token: `JWT ${generateToken(userInfo)}`,
                user: userInfo
            })
        })
    })
}

// Authorization Middleware

// Role authorization check
exports.roleAuthorization = function(requiredRole) {
    return function(req, res, next) {
        const user = req.user

        User.findById(user._id, (err, foundUser) => {
            if (err) {
                res.status(422).json({ error: "No user was found." })
                return next(err)
            }

            // If user is found, check role.
            if (getRole(foundUser.role) >= getRole(requiredRole)) {
                return next()
            }

            return res
                .status(401)
                .json({ error: "You are not authorized to view this content." })
        })
    }
}

// Forgot Password Route
exports.forgotPassword = function(req, res, next) {
    const email = req.body.email

    User.findOne({ email }, (err, existingUser) => {
        // If user is not found, return error
        if (err || existingUser == null) {
            res.status(422).json({
                error: "Your request could not be processed as entered. Please try again."
            })
            return next(err)
        }

        // If user is found, generate and save resetToken

        // Generate a token with Crypto
        crypto.randomBytes(48, (err, buffer) => {
            const resetToken = buffer.toString("hex")
            if (err) {
                return next(err)
            }

            existingUser.resetPasswordToken = resetToken
            existingUser.resetPasswordExpires = Date.now() + 3600000 // 1 hour

            existingUser.save(err => {
                // If error in saving token, return it
                if (err) {
                    console.log(err)
                    return next(err)
                }

                const message = {
                    body: `${"You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" + "Please click on the following link, or paste this into your browser to complete the process:\n\n" + "http://"}${req.headers.host}/reset-password/${resetToken}\n\n` +
                        `If you did not request this, please ignore this email and your password will remain unchanged.\n`
                }

                const nodemailer = require("nodemailer")

                // create reusable transporter object using the default SMTP transport
                let transporter = nodemailer.createTransport({
                    service: "gmail",
                    port: 25,
                    secure: false, // secure:true for port 465, secure:false for port 587
                    auth: {
                        user: process.env.NODEMAILER_USERNAME,
                        pass: process.env.NODEMAILER_PASSWORD
                    }
                })

                // setup email data with unicode symbols
                let mailOptions = {
                    from: "nodemailjs@gmail.com", // sender address
                    to: existingUser.email, // list of receivers
                    subject: "reset password", // Subject line
                    text: message.body,
                    html: "" // html body
                }

                // send mail with defined transport object
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error)
                    }
                    console.log(
                        "Message %s sent: %s",
                        info.messageId,
                        info.response
                    )
                })

                return res.status(200).json({
                    message: "Please check your email for the link to reset your password."
                })
            })
        })
    })
}

// Reset Password Route
exports.verifyToken = function(req, res, next) {
    User.findOne(
        {
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        },
        (err, resetUser) => {
            // If query returned no results, token expired or was invalid. Return error.
            if (!resetUser) {
                res.status(422).json({
                    error: "Your token has expired. Please request to reset your password again."
                })

                return next()
            }

            // Otherwise, save new password and clear resetToken from database
            resetUser.password = req.body.password
            resetUser.resetPasswordToken = undefined
            resetUser.resetPasswordExpires = undefined

            resetUser.save(err => {
                if (err) {
                    return next(err)
                }

                // If password change saved successfully, alert user via email
                const message = {
                    subject: "Password Changed",
                    text: "You are receiving this email because you changed your password. \n\n" +
                        "If you did not request this change, please contact us immediately."
                }

                // Otherwise, send user email confirmation of password change via Mailgun
                //mailgun.sendEmail(resetUser.email, message)

                return res.status(200).json({
                    message: "Password changed successfully. Please login with your new password.",
                    didReset: true
                })
            })
        }
    )
}
