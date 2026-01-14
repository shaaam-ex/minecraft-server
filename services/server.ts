import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getAllServers() {
  try {
    const servers = await prisma.server.findMany();
    return {
      success: true,
      servers,
    };
  } catch (error) {
    console.error("Error fetching servers:", error);
    return { success: false, message: "Failed to fetch servers" };
  }
}

export async function createServer(
  name: string,
  configuration: Record<string, any>,
  version: string,
  type: string,
  userId: number
) {
  try {
    const server = await prisma.server.create({
      data: {
        name,
        status: "creating",
        configuration,
        version,
        createdBy: userId,
        type,
      },
    });
    return {
      success: true,
      message: "Server created successfully",
      server: {
        name: server.name,
        status: server.status,
        configuration: server.configuration,
        version: server.version,
        ipAddress: server.ipAddress,
        port: server.port,
      },
    };
  } catch (error) {
    console.error("Error creating server:", error);
    return { success: false, message: "Failed to create server" };
  }
}
