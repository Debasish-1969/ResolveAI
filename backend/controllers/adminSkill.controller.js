const prisma = require("../lib/prisma");

const assignAdminSkill = async (req, res) => {
    try {
        const { adminId, skill } = req.body;

        // 1. Validate required fields
        if (!adminId || !skill) {
            return res.status(400).json({
                message: "Admin ID and skill are required"
            });
        }

        // 2. Validate skill
        const validSkills = [
            "HARDWARE",
            "NETWORK",
            "SOFTWARE",
            "ACCOUNT"
        ];

        if (!validSkills.includes(skill)) {
            return res.status(400).json({
                message: "Invalid skill"
            });
        }

        // 3. Check whether the user exists and is an admin
        const admin = await prisma.user.findUnique({
            where: {
                id: adminId
            }
        });

        if (!admin) {
            return res.status(404).json({
                message: "Admin not found"
            });
        }

        if (admin.role !== "ADMIN") {
            return res.status(400).json({
                message: "The selected user is not an admin"
            });
        }

        // 4. Create the skill
        const adminSkill = await prisma.adminSkill.create({
            data: {
                userId: adminId,
                skill
            }
        });

        return res.status(201).json({
            message: "Admin skill assigned successfully",
            skill: adminSkill
        });

    } catch (error) {

        // Prevent duplicate skill assignment from becoming a server error
        if (error.code === "P2002") {
            return res.status(409).json({
                message: "This admin already has this skill"
            });
        }

        console.error("Assign admin skill error:", error);

        return res.status(500).json({
            message: "Something went wrong while assigning admin skill"
        });
    }
};


const getAdminsWithSkills = async (req, res) => {
    try {

        const admins = await prisma.user.findMany({
            where: {
                role: "ADMIN"
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                skills: {
                    select: {
                        id: true,
                        skill: true
                    }
                }
            },
            orderBy: {
                name: "asc"
            }
        });

        return res.status(200).json({
            admins
        });

    } catch (error) {

        console.error("Get admins with skills error:", error);

        return res.status(500).json({
            message: "Something went wrong while fetching admins"
        });
    }
};


const removeAdminSkill = async (req, res) => {
    try {

        const { skillId } = req.params;

        if (!skillId) {
            return res.status(400).json({
                message: "Skill ID is required"
            });
        }

        const existingSkill = await prisma.adminSkill.findUnique({
            where: {
                id: skillId
            }
        });

        if (!existingSkill) {
            return res.status(404).json({
                message: "Admin skill not found"
            });
        }

        await prisma.adminSkill.delete({
            where: {
                id: skillId
            }
        });

        return res.status(200).json({
            message: "Admin skill removed successfully"
        });

    } catch (error) {

        console.error("Remove admin skill error:", error);

        return res.status(500).json({
            message: "Something went wrong while removing admin skill"
        });
    }
};


module.exports = {
    assignAdminSkill,
    getAdminsWithSkills,
    removeAdminSkill
};