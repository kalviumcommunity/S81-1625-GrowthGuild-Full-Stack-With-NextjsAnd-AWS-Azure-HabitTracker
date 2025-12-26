import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Demo User",
      email: "demo@habit.com",
      habits: {
        create: [
          {
            title: "Daily Coding",
            frequency: "daily",
            logs: {
              create: {
                date: new Date(),
                completed: true,
              },
            },
          },
        ],
      },
    },
  });

  console.log("Seeded user:", user);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
