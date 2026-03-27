const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const {
  followUser,
  addCloseFriend,
  viewProfile,
  getProfileViews
} = require("../controllers/userController");

router.post("/:id/follow", auth, followUser);
router.post("/:id/close-friend", auth, addCloseFriend);
router.get("/:id", auth, viewProfile);
router.get("/me/views", auth, getProfileViews);

module.exports = router;