const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: String,
    mediaUrl: String,

    visibility: {
        type: String,
        enum: ["PUBLIC", "FOLLOWERS", "CLOSE_FRIENDS", "ONLY_ME"],
        default: "PUBLIC"
    }

}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);