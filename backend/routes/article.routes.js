const express = require("express");

const {
    createArticle,
    getArticles
} = require("../controllers/article.controller");

const authenticate = require("../middleware/auth.middleware");
const requireAdmin = require("../middleware/admin.middleware");

const router = express.Router();

router.post("/", authenticate, requireAdmin, createArticle);
router.get("/", authenticate, getArticles);

module.exports = router;