import { prisma } from "./prisma";

export async function testPrismaConnection() {
  const users = await prisma.user.findMany();
  console.log("Users from DB:", users);
}
