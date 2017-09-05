// Importing Node packages required for schema
const mongoose = require("mongoose");
const ROLE_MEMBER = require("../../config/constants").ROLE_MEMBER;
const ROLE_CLIENT = require("../../config/constants").ROLE_CLIENT;
const ROLE_OWNER = require("../../config/constants").ROLE_OWNER;
const ROLE_ADMIN = require("../../config/constants").ROLE_ADMIN;

const Schema = mongoose.Schema;

const NeedSchema = new Schema(
    {
        nameOfNeed: {
            type: String,
            required: true
        },
        numberOfPeople: {
            type: Number,
            required: true
        },
        postedBy: {
            type: String,
            lowercase: true,
            required: true
        },
        degreeOfNeed: { type: Number, default: 0 },
        description: { type: String }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Need", NeedSchema);
