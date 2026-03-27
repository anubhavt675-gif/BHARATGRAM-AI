const mongoose = require("mongoose");

const profileViewSchema = new mongoose.Schema({
    viewer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    viewedUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("ProfileView", profileViewSchema);