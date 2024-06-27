-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "rollNo" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "faculty" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "event" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserEventRoles" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    "registrationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentSlip" TEXT,

    CONSTRAINT "UserEventRoles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_rollNo_key" ON "User"("rollNo");

-- CreateIndex
CREATE UNIQUE INDEX "UserEventRoles_userId_key" ON "UserEventRoles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserEventRoles_eventId_key" ON "UserEventRoles"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "UserEventRoles_roleId_key" ON "UserEventRoles"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "UserEventRoles_userId_eventId_roleId_key" ON "UserEventRoles"("userId", "eventId", "roleId");

-- AddForeignKey
ALTER TABLE "UserEventRoles" ADD CONSTRAINT "UserEventRoles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEventRoles" ADD CONSTRAINT "UserEventRoles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEventRoles" ADD CONSTRAINT "UserEventRoles_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
