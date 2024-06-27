-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('NOT_PAID', 'PAID');

-- AlterTable
ALTER TABLE "UserEventRoles" ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'NOT_PAID';
