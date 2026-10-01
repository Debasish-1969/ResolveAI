const express = require("express");

const {
    assistant
} = require("../controllers/assistant.controller");

const authenticate = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", authenticate, assistant);

module.exports = router;