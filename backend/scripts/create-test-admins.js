require("dotenv").config();

const bcrypt = require("bcryptjs");
const prisma = require("../lib/prisma");

const testAdmins = [
    {
        name: "Test Admin 1",
        email: "admin1@resolveai.local"
    },
    {
        name: "Test Admin 2",
        email: "admin2@resolveai.local"
    },
    {
        name: "Test Admin 3",
        email: "admin3@resolveai.local"
    }
];

const createAdmins = async () => {
    try {
        const passwordHash = await bcrypt.hash("Admin@12345", 10);

        for (const admin of testAdmins) {
            const existingAdmin = await prisma.user.findUnique({
                where: {
                    email: admin.email
                }
            });

            if (existingAdmin) {
                console.log(`${admin.email} already exists`);
                continue;
            }

            await prisma.user.create({
                data: {
                    name: admin.name,
                    email: admin.email,
                    passwordHash,
                    role: "ADMIN"
                }
            });

            console.log(`Created: ${admin.email}`);
        }

        console.log("Test admin creation completed.");
    } catch (error) {
        console.error("Error creating test admins:", error);
    } finally {
        await prisma.$disconnect();
    }
};

createAdmins();