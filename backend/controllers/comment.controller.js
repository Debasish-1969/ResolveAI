const prisma = require("../lib/prisma");

const addComment = async (req, res) => {
    try {
        const { id: issueId } = req.params;
        const { body } = req.body;

        // 1. Validate comment
        if (!body || !body.trim()) {
            return res.status(400).json({
                message: "Comment body is required"
            });
        }

        // 2. Check that the issue exists
        const issue = await prisma.issue.findFirst({
            where: req.user.role === "ADMIN"
                ? {
                    id: issueId,
                    assignedToId: req.user.userId
                }
                : {
                    id: issueId,
                    createdById: req.user.userId
                }
        });
        
        if (!issue) {
            return res.status(404).json({
                message: "Issue not found"
            });
        }

        // 3. Create comment
        const comment = await prisma.comment.create({
            data: {
                body: body.trim(),
                issueId: issueId,
                authorId: req.user.userId
            }
        });

        return res.status(201).json({
            message: "Comment added successfully",
            comment
        });

    } catch (error) {
        console.error("Add comment error:", error);

        return res.status(500).json({
            message: "Something went wrong while adding the comment"
        });
    }
};

const getComments = async (req, res) => {
    try {
        const { id: issueId } = req.params;

        // Check that the issue exists
        const issue = await prisma.issue.findFirst({
            where: req.user.role === "ADMIN"
                ? {
                    id: issueId,
                    assignedToId: req.user.userId
                }
                : {
                    id: issueId,
                    createdById: req.user.userId
                }
        });
        
        if (!issue) {
            return res.status(404).json({
                message: "Issue not found"
            });
        }

        // Get comments for the issue
        const comments = await prisma.comment.findMany({
            where: {
                issueId: issueId
            },
            orderBy: {
                createdAt: "asc"
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        role: true
                    }
                }
            }
        });

        return res.status(200).json({
            comments
        });

    } catch (error) {
        console.error("Get comments error:", error);

        return res.status(500).json({
            message: "Something went wrong while fetching comments"
        });
    }
};

module.exports = {
    addComment,
    getComments
};