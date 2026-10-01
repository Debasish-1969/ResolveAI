require("dotenv").config();

const bcrypt = require("bcryptjs");
const prisma = require("./lib/prisma");

async function createAdmin() {
    try {
        const passwordHash = await bcrypt.hash("admin123", 10);

        const user = await prisma.user.upsert({
            where: {
                email: "admin@resolveai.local"
            },
            update: {
                role: "ADMIN",
                passwordHash
            },
            create: {
                name: "ResolveAI Admin",
                email: "admin@resolveai.local",
                passwordHash,
                role: "ADMIN"
            }
        });

        console.log({
            id: user.id,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        console.error("Admin creation failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();