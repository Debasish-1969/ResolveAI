const bcrypt = require("bcryptjs");
const prisma = require("../lib/prisma");

const createAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        // 2. Validate password length
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long"
            });
        }

        // 3. Check whether email already exists
        const existingUser = await prisma.user.findUnique({
            where: {
                email: email.toLowerCase()
            }
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email is already registered"
            });
        }

        // 4. Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // 5. Create Admin account
        const admin = await prisma.user.create({
            data: {
                name,
                email: email.toLowerCase(),
                passwordHash,
                role: "ADMIN"
            }
        });

        // 6. Return safe information
        return res.status(201).json({
            message: "Admin account created successfully",
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                createdAt: admin.createdAt
            }
        });
    } catch (error) {
        console.error("Create admin error:", error);

        return res.status(500).json({
            message: "Something went wrong while creating the Admin account"
        });
    }
};

module.exports = {
    createAdmin
};