const express = require("express");

const {
    createIssue,
    getMyIssues,
    getIssueById,
    updateIssue
} = require("../controllers/issue.controller");

const authenticate = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", authenticate, createIssue);
router.get("/", authenticate, getMyIssues);
router.get("/:id", authenticate, getIssueById);
router.patch("/:id", authenticate, updateIssue);
module.exports = router;