const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        // 2. Check password length
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

        // 5. Create user
        const user = await prisma.user.create({
            data: {
                name,
                email: email.toLowerCase(),
                passwordHash,
                role: "USER"
            }
        });

        // 6. Return safe user information
        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            }
        });

    } catch (error) {
        console.error("Registration error:", error);

        return res.status(500).json({
            message: "Something went wrong while registering"
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password, loginAs } = req.body;

        // 1. Validate required fields
        if (!email || !password || !loginAs) {
            return res.status(400).json({
                message: "Email, password and login type are required"
            });
        }

        // 2. Validate requested login type
        if (!["USER", "ADMIN", "SUPER_ADMIN"].includes(loginAs)) {
            return res.status(400).json({
                message: "Invalid login type"
            });
        }

        // 3. Find user by email
        const user = await prisma.user.findUnique({
            where: {
                email: email.toLowerCase()
            }
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // 4. Compare password with stored hash
        const isPasswordValid = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // 5. Check whether the account has the requested role
        if (user.role !== loginAs) {
            if (loginAs === "ADMIN") {
                return res.status(403).json({
                    message: "This account does not have Admin access."
                });
            }
        
            if (loginAs === "SUPER_ADMIN") {
                return res.status(403).json({
                    message: "This account does not have Super Admin access."
                });
            }
        
            return res.status(403).json({
                message: "This account is not registered as a User."
            });
        }

        // 6. Create JWT token
        const token = jwt.sign(
            {
                userId: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        // 7. Return token + safe user information
        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Something went wrong while logging in"
        });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.userId
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            }
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            user
        });

    } catch (error) {
        console.error("Get me error:", error);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};

module.exports = {
    register,
    login,
    getMe
};