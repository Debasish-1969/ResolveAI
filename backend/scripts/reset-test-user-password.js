require("dotenv").config();

const bcrypt = require("bcryptjs");
const prisma = require("../lib/prisma");

const resetPassword = async () => {
    try {
        const passwordHash = await bcrypt.hash("Admin@12345", 10);

        const user = await prisma.user.update({
            where: {
                email: "test@resolveai.local"
            },
            data: {
                passwordHash
            }
        });

        console.log(`Password reset successfully for ${user.email}`);
    } catch (error) {
        console.error("Error resetting password:", error);
    } finally {
        await prisma.$disconnect();
    }
};

resetPassword();