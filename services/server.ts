import { PrismaClient } from "@prisma/client";
import SERVER_STATUSES from "../minecraft-commons/ENUMs/serverStatus";
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

export async function getServerById(serverId: number) {
  try {
    const server = await prisma.server.findUnique({
      where: { id: serverId },
    });
    if (!server) {
      return { success: false, message: "Server not found" };
    }
    return { success: true, server };
  } catch (error) {
    console.error("Error fetching server by ID:", error);
    return { success: false, message: "Failed to fetch server" };
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
        status: SERVER_STATUSES.CREATING.value,
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

    if (!deploymentResponse.success || !deploymentResponse.data) {
      // If deployment fails, we should rollback the created server entry
      await prisma.server.delete({ where: { id: server.id } });
      return { success: false, message: "Failed to deploy server" };
    }

    // Updating the server status to running after successful deployment
    await prisma.server.update({
      where: { id: server.id },
      data: { status: SERVER_STATUSES.RUNNING.value },
    });

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

type deploymentServerStopResponse = {
  success: boolean;
  message: string;
};

export async function stopServer(serverId: number, serverName: string) {
  try {
    // Updating server status to stopping
    await prisma.server.update({
      where: { id: serverId },
      data: { status: SERVER_STATUSES.STOPPING.value },
    });

    // Calling Deployment Service to stop the server
    const response: Response = await fetch(`${deploymentServiceUrl}/stop`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        containerName: serverName,
      }),
    });

    const deploymentResponse =
      (await response.json()) as deploymentServerStopResponse;

    if (!deploymentResponse.success) {
      return { success: false, message: "Failed to stop server" };
    }

    // Update the server status in the database
    await prisma.server.update({
      where: { id: serverId },
      data: { status: SERVER_STATUSES.STOPPED.value },
    });

    return { success: true, message: "Server stopped successfully" };
  } catch (error) {
    console.error("Error stopping server:", error);
    return { success: false, message: "Failed to stop server" };
  }
}
