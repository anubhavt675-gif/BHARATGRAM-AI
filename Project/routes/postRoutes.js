const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const {
    createPost,
    getFeed
} = require("../controllers/postController");

router.post("/", auth, createPost);
router.get("/feed", auth, getFeed);

module.exports = router;