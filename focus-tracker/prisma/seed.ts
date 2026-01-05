import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: "demo@habit.com" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@habit.com",
      habits: {
        create: [
          {
            title: "Daily Coding",
            frequency: "daily",
          },
        ],
      },
    },
  });

  console.log("Seed data inserted successfully");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
