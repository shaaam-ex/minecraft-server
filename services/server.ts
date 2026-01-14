import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const deploymentServiceUrl =
  process.env.DEPLOYMENT_SERVER || "http://localhost:4000";
const defaultMemory = process.env.DEFAULT_MEMORY || "1g";
const defaultCPU = process.env.DEFAULT_CPU || "1";

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

type deploymentServerCreateResponse = {
  success: boolean;
  message: string;
  data: {
    port: number;
    ipAddress: string;
  };
};

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
    // Calling Deployment Service to actually deploy the server
    const response: Response = await fetch(`${deploymentServiceUrl}/deploy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        containerName: name,
        type,
        version,
        memory: defaultMemory,
        cpus: defaultCPU,
        // Will add more configuration options later
        // configuration,
      }),
    });

    const deploymentResponse =
      (await response.json()) as deploymentServerCreateResponse;

    if (!deploymentResponse.success) {
      // If deployment fails, we should rollback the created server entry
      await prisma.server.delete({ where: { id: server.id } });
      return { success: false, message: "Failed to deploy server" };
    }
    return {
      success: true,
      message: "Server created successfully",
      server: {
        name: server.name,
        status: server.status,
        configuration: server.configuration,
        version: server.version,
        ipAddress: deploymentResponse.data.ipAddress,
        port: deploymentResponse.data.port,
      },
    };
  } catch (error) {
    console.error("Error creating server:", error);
    return { success: false, message: "Failed to create server" };
  }
}
