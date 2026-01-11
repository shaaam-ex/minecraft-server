import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getAllServers() {
  try {
    const servers = await prisma.server.findMany();
    return servers;
  } catch (error) {
    console.error("Error fetching servers:", error);
    throw error;
  }
}