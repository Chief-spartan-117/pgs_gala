/*
  Warnings:

  - You are about to drop the column `loginCount` on the `UserEventRoles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserEventRoles" DROP COLUMN "loginCount",
ADD COLUMN     "twoFaVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twoFaVerifyKey" TEXT;
