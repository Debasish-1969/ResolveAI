const express = require("express");

const {
    addComment,
    getComments
} = require("../controllers/comment.controller");

const authenticate = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/:id/comments", authenticate, addComment);
router.get("/:id/comments", authenticate, getComments);

module.exports = router;