-- CreateEnum
CREATE TYPE "EntryStatus" AS ENUM ('FREE', 'PAID');

-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'ACTIVE', 'ATTENDING');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "entryStatus" "EntryStatus" NOT NULL DEFAULT 'FREE';

-- AlterTable
ALTER TABLE "UserEventRoles" ADD COLUMN     "registrationStatus" "RegistrationStatus" NOT NULL DEFAULT 'PENDING';
