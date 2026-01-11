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

export async function createServer(
  name: string,
  status: boolean,
  configuration: Record<string, any>,
  version: string,
  userId: number
) {
  try {
    const server = await prisma.server.create({
      data: {
        name,
        status,
        configuration,
        version,
        createdBy: userId,
        // Dynamically set port by using ssh
        ipAddress: "localhost",
        port: 25565,
      },
    });
    return server;
  } catch (error) {
    console.error("Error creating server:", error);
    throw error;
  }
}
