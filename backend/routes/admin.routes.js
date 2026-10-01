const express = require("express");

const {
    getAllIssues,
    getIssueStats
} = require("../controllers/issue.controller");

const {
    assignAdminSkill,
    getAdminsWithSkills,
    removeAdminSkill
} = require("../controllers/adminSkill.controller");

const {
    createAdmin
} = require("../controllers/admin.controller");

const authenticate = require("../middleware/auth.middleware");
const requireAdmin = require("../middleware/admin.middleware");
const requireSuperAdmin = require("../middleware/superAdmin.middleware");

const router = express.Router();

router.get("/issues", authenticate, requireAdmin, getAllIssues);

router.get("/stats", authenticate, requireAdmin, getIssueStats);

router.post(
    "/admins",
    authenticate,
    requireSuperAdmin,
    createAdmin
);

router.post("/skills", authenticate, requireSuperAdmin, assignAdminSkill);

router.get("/skills", authenticate, requireSuperAdmin, getAdminsWithSkills);

router.delete(
    "/skills/:skillId",
    authenticate,
    requireSuperAdmin,
    removeAdminSkill
);

module.exports = router;