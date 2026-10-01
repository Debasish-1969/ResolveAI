-- CreateEnum
CREATE TYPE "SkillCategory" AS ENUM ('HARDWARE', 'NETWORK', 'SOFTWARE', 'ACCOUNT');

-- CreateTable
CREATE TABLE "AdminSkill" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "skill" "SkillCategory" NOT NULL,

    CONSTRAINT "AdminSkill_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminSkill_userId_skill_key" ON "AdminSkill"("userId", "skill");

-- AddForeignKey
ALTER TABLE "AdminSkill" ADD CONSTRAINT "AdminSkill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
