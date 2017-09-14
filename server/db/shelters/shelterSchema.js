// Importing Node packages required for schema
const mongoose = require("mongoose");
const ROLE_MEMBER = require("../../config/constants").ROLE_MEMBER;
const ROLE_CLIENT = require("../../config/constants").ROLE_CLIENT;
const ROLE_OWNER = require("../../config/constants").ROLE_OWNER;
const ROLE_ADMIN = require("../../config/constants").ROLE_ADMIN;
// const User = require("../userSchema.js").User
// const Need = require("../needsPoll/needSchema.js").Need

const Schema = mongoose.Schema;

const ShelterSchema = new Schema(
    {
        nameOfItem: {
            type: String
        },
        locationOfShelter: {
            type: String
        },
        postedBy: {
            type: String,
            lowercase: true
        },
        description: { type: String },
        place: { type: Object },
        members: [ {type: mongoose.Schema.Types.ObjectId, ref: 'User'} ],
        needs: [ {type: mongoose.Schema.Types.ObjectId, ref: 'Need'} ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Shelter", ShelterSchema);
