import "dotenv/config";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import {user_in_college} from "./users"

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

  console.log({ superAdmin, admin, user });

  for (let index = 0; index < user_in_college.length; index++) {
    const element = user_in_college[index];
    
  }  
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
