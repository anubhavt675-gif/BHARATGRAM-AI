const Post = require("../models/Post");
const Follow = require("../models/Follow");
const CloseFriend = require("../models/CloseFriend");

// Create post
exports.createPost = async (req, res) => {
    const post = await Post.create({
        user: req.user.id,
        content: req.body.content,
        mediaUrl: req.body.mediaUrl,
        visibility: req.body.visibility
    });

    res.json(post);
};

// Feed
exports.getFeed = async (req, res) => {
    const userId = req.user.id;

    const posts = await Post.find().populate("user", "username");

    const visiblePosts = [];

    for (let post of posts) {
        if (post.visibility === "PUBLIC") {
            visiblePosts.push(post);
        }

        if (post.visibility === "FOLLOWERS") {
            const isFollower = await Follow.exists({
                follower: userId,
                following: post.user._id
            });
            if (isFollower) visiblePosts.push(post);
        }

        if (post.visibility === "CLOSE_FRIENDS") {
            const isClose = await CloseFriend.exists({
                user: post.user._id,
                closeFriend: userId
            });
            if (isClose) visiblePosts.push(post);
        }

        if (post.visibility === "ONLY_ME" && post.user._id.equals(userId)) {
            visiblePosts.push(post);
        }
    }

    res.json(visiblePosts);
};