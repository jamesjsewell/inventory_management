// Importing Node packages required for schema
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const ROLE_MEMBER = require("../config/constants").ROLE_MEMBER;
const ROLE_CLIENT = require("../config/constants").ROLE_CLIENT;
const ROLE_OWNER = require("../config/constants").ROLE_OWNER;
const ROLE_ADMIN = require("../config/constants").ROLE_ADMIN;

const Schema = mongoose.Schema;

//= ===============================
// User Schema
//= ===============================
const UserSchema = new Schema(
    {
        email: {
            type: String,
            lowercase: true,
            unique: true,
            required: true
        },
        username: { type: String, default: "" },
        password: {
            type: String,
            required: true,
            select: true 
        },
        profile: {
            firstName: { type: String },
            lastName: { type: String },
            website: { type: String, default: "" },
            location: { type: String, default: "" },
            gender: { type: String, default: "" },
            age: { type: Number, default: "" },
            avatarUrl: { type: String, default: "" },
            relationshipStatus: { type: String, default: "" },
            aboutMe: { type: String, default: "" }
        },
        currentShelter: { type: String },
        role: {
            type: String,
            enum: [ROLE_MEMBER, ROLE_CLIENT, ROLE_OWNER, ROLE_ADMIN],
            default: ROLE_MEMBER
        },
        stripe: {
            customerId: { type: String },
            subscriptionId: { type: String },
            lastFour: { type: String },
            plan: { type: String },
            activeUntil: { type: Date }
        },
        resetPasswordToken: { type: String },
        resetPasswordExpires: { type: Date }
    },
    {
        timestamps: true
    }
);

//ORM methods

// Pre-save of user to database, hash password if password is modified or new
UserSchema.pre("save", function(next) {
    const user = this, SALT_FACTOR = 5;

    if (!user.isModified("password")) return next();

    bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });

    //next()
});

// Method to compare password for login
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) {
            return cb(err);
        }

        cb(null, isMatch);
    });
};

module.exports = mongoose.model("User", UserSchema);
