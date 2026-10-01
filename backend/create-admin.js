require("dotenv").config();

const bcrypt = require("bcryptjs");
const prisma = require("./lib/prisma");

async function createSuperAdmin() {
    try {
        const name = process.env.SUPER_ADMIN_NAME;
        const email = process.env.SUPER_ADMIN_EMAIL;
        const password = process.env.SUPER_ADMIN_PASSWORD;

        if (!name || !email || !password) {
            throw new Error(
                "SUPER_ADMIN_NAME, SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD must be provided."
            );
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.upsert({
            where: {
                email
            },
            update: {
                name,
                passwordHash,
                role: "SUPER_ADMIN"
            },
            create: {
                name,
                email,
                passwordHash,
                role: "SUPER_ADMIN"
            }
        });

        console.log({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        console.error("Super Admin creation failed:", error);
        process.exitCode = 1;
    } finally {
        await prisma.$disconnect();
    }
}

createSuperAdmin();