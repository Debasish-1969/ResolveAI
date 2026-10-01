const prisma = require("../lib/prisma");

const createIssue = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            priority
        } = req.body;

        // 1. Validate required fields
        if (!title || !description || !category) {
            return res.status(400).json({
                message: "Title, description and category are required"
            });
        }

        // Find administrators who have the required skill

const assignmentCategories = [
    "HARDWARE",
    "NETWORK",
    "SOFTWARE",
    "ACCOUNT"
];

let matchingAdmins = [];

if (assignmentCategories.includes(category)) {

    matchingAdmins = await prisma.user.findMany({

        where: {
            role: "ADMIN",
            skills: {
                some: {
                    skill: category
                }
            }
        },

        select: {
            id: true,
            name: true,
            email: true,

            _count: {
                select: {
                    assignedIssues: {
                        where: {
                            status: {
                                in: ["OPEN", "IN_PROGRESS"]
                            }
                        }
                    }
                }
            }
        }
    });
}

        let assignedToId = null;

if (matchingAdmins.length > 0) {
    const selectedAdmin = matchingAdmins.reduce((leastBusy, currentAdmin) => {
        return currentAdmin._count.assignedIssues <
            leastBusy._count.assignedIssues
            ? currentAdmin
            : leastBusy;
    });

    assignedToId = selectedAdmin.id;
}

        // 2. Create issue
        const issue = await prisma.issue.create({
            data: {
                title,
                description,
                category,
                priority: priority || "MEDIUM",
                status: "OPEN",
                createdById: req.user.userId,
                assignedToId
            }
        });

        return res.status(201).json({
            message: "Issue created successfully",
            issue
        });

    } catch (error) {
        console.error("Create issue error:", error);

        return res.status(500).json({
            message: "Something went wrong while creating the issue"
        });
    }
};

const getMyIssues = async (req, res) => {
    try {
        const issues = await prisma.issue.findMany({
            where: {
                createdById: req.user.userId
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return res.status(200).json({
            issues
        });

    } catch (error) {
        console.error("Get issues error:", error);

        return res.status(500).json({
            message: "Something went wrong while fetching issues"
        });
    }
};

const getIssueById = async (req, res) => {
    try {
        const { id } = req.params;

        const issue = await prisma.issue.findFirst({
            where: req.user.role === "ADMIN"
            ? {
                id: id,
                assignedToId: req.user.userId
            }
            : {
                id: id,
                createdById: req.user.userId
            },
                include: {
                    createdBy: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    },
                    assignedTo: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
        });

        if (!issue) {
            return res.status(404).json({
                message: "Issue not found"
            });
        }

        return res.status(200).json({
            issue
        });

    } catch (error) {
        console.error("Get issue error:", error);

        return res.status(500).json({
            message: "Something went wrong while fetching the issue"
        });
    }
};

const updateIssue = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, category, priority, status } = req.body;

        // Check that the issue belongs to the authenticated user
        const existingIssue = await prisma.issue.findFirst({
            where: req.user.role === "ADMIN"
                ? {
                    id: id,
                    assignedToId: req.user.userId
                }
                : {
                    id: id,
                    createdById: req.user.userId
                }
        });

        if (!existingIssue) {
            return res.status(404).json({
                message: "Issue not found"
            });
        }

        const issue = await prisma.issue.update({
            where: {
                id: id
            },
            data: {
                ...(title !== undefined && { title }),
                ...(description !== undefined && { description }),
                ...(category !== undefined && { category }),
                ...(priority !== undefined && { priority }),
                ...(status !== undefined && { status })
            }
        });

        return res.status(200).json({
            message: "Issue updated successfully",
            issue
        });

    } catch (error) {
        console.error("Update issue error:", error);

        return res.status(500).json({
            message: "Something went wrong while updating the issue"
        });
    }
};

const getAllIssues = async (req, res) => {
    try {
        

        const { status, priority, category } = req.query;

        const issues = await prisma.issue.findMany({
            where: {
                ...(req.user.role === "ADMIN"
                    ? {
                        assignedToId: req.user.userId
                    }
                    : {
                        createdById: req.user.userId
                    }
                ),
                ...(status && { status }),
                ...(priority && { priority }),
                ...(category && { category })
            },
            orderBy: {
                createdAt: "desc"
            },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        return res.status(200).json({
            issues
        });

    } catch (error) {

        console.error("Get all issues error:", error);

        return res.status(500).json({
            message: "Something went wrong while fetching all issues"
        });
    }
};

const getIssueStats = async (req, res) => {

    try {

        const adminFilter =
            req.user.role === "ADMIN"
                ? {
                    assignedToId: req.user.userId
                }
                : {};

        const [
            total,
            open,
            inProgress,
            resolved,
            closed
        ] = await Promise.all([

            prisma.issue.count({
                where: adminFilter
            }),

            prisma.issue.count({
                where: {
                    ...adminFilter,
                    status: "OPEN"
                }
            }),

            prisma.issue.count({
                where: {
                    ...adminFilter,
                    status: "IN_PROGRESS"
                }
            }),

            prisma.issue.count({
                where: {
                    ...adminFilter,
                    status: "RESOLVED"
                }
            }),

            prisma.issue.count({
                where: {
                    ...adminFilter,
                    status: "CLOSED"
                }
            })

        ]);

        return res.status(200).json({
            total,
            open,
            inProgress,
            resolved,
            closed
        });

    } catch (error) {

        console.error("Get issue stats error:", error);

        return res.status(500).json({
            message: "Something went wrong while fetching issue statistics"
        });

    }
};

module.exports = {
    createIssue,
    getMyIssues,
    getIssueById,
    updateIssue,
    getAllIssues,
    getIssueStats
};