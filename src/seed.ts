import "dotenv/config";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { user_in_college } from "./users.ts";

async function main() {
  const superAdmin = await prisma.role.upsert({
    create: {
      role: "Super Admin",
    },
    where: {
      id: 1,
    },
    update: {},
  });

  const admin = await prisma.role.upsert({
    where: { id: 2 },
    update: {},
    create: {
      role: "Admin",
    },
  });

  const user = await prisma.role.upsert({
    where: { id: 3 },
    update: {},
    create: {
      role: "User",
    },
  });

  const event = await prisma.event.upsert({
    where: { id: 1 },
    update: {},
    create: {
      event: "PGS Gala",
      entryStatus: "PAID",
    },
  });

  const usersData = user_in_college;

  let count = 1;
  for (let users of usersData) {
    await prisma.user.upsert({
      where: {
        id: usersData.length + 1,
      },
      update: {},
      create: {
        firstName: users.first,
        lastName: users.last,
        rollNo: users.id,
        faculty: users.field,
        email: `${count++}`,
        phoneNumber: "",
      },
    });
  }

  console.log({ superAdmin, admin, user });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });