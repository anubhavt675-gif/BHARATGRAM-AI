const Follow = require("../models/Follow");
const CloseFriend = require("../models/CloseFriend");
const ProfileView = require("../models/ProfileView");
const User = require("../models/User");

// Follow
exports.followUser = async (req, res) => {
    await Follow.create({
        follower: req.user.id,
        following: req.params.id
    });

    res.json({ message: "Followed" });
};

// Add close friend
exports.addCloseFriend = async (req, res) => {
    await CloseFriend.create({
        user: req.user.id,
        closeFriend: req.params.id
    });

    res.json({ message: "Added to close friends" });
};

// View profile (track)
exports.viewProfile = async (req, res) => {
    const user = await User.findById(req.params.id);

    await ProfileView.create({
        viewer: req.user.id,
        viewedUser: req.params.id
    });

    res.json(user);
};

// Who viewed me
exports.getProfileViews = async (req, res) => {
    const views = await ProfileView.find({
        viewedUser: req.user.id
    }).populate("viewer", "username");

    res.json(views);
};