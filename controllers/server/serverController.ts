import { CreateServerBody } from "./type";
import { FastifyRequest, FastifyReply } from "fastify";
import {
  createServer,
  getAllServers,
  getServerById,
  startServer,
  stopServer,
} from "../../services/server";
import Validator from "validatorjs";
import { ServerType } from "../../minecraft-commons/types/server";
import { SUPPORTED_VERSIONS } from "../../minecraft-commons/ENUMs/versions";

export async function getAllServersController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const servers = await getAllServers();
  if (servers) {
    return reply.status(200).send(servers);
  } else {
    return reply.status(500).send({ error: "Failed to retrieve servers" });
  }
}

export async function createServerController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { name, configuration, version, type } =
    request.body as CreateServerBody;
  // Validation
  const validator = new Validator(
    { name, type, version },
    {
      name: "required|string",
      type: "required|string",
      version: "required|string",
    }
  );

  if (validator.fails()) {
    return reply.status(400).send({
      success: false,
      message: "Validation failed",
    });
  }

  // Validating if the type specified exists in supported types
  if (Object.keys(ServerType).indexOf(type) === -1) {
    return reply.status(400).send({
      success: false,
      message: "Invalid server type specified",
    });
  }

  // Validating if the version specified is supported for the given type
  if (!SUPPORTED_VERSIONS.includes(version)) {
    return reply.status(400).send({
      success: false,
      message: "Unsupported server version specified",
    });
  }

  const userId = request.user?.id;

  const response = await createServer(
    name,
    configuration ?? {},
    version,
    type,
    userId as number
  );

  return reply.status(201).send(response);
}

export async function deleteServerController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  // To be implemented
  return reply.status(501).send({ message: "Not implemented" });
}

export async function updateServerController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  // To be implemented
  return reply.status(501).send({ message: "Not implemented" });
}

export async function getServerDetailsController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  // To be implemented
  return reply.status(501).send({ message: "Not implemented" });
}

export async function stopServerController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  // We get server id from query params
  const { id } = request.params as { id: string };

  if (!id) {
    return reply.status(400).send({ message: "Server ID is required" });
  }

  // Checking if server exists and is running
  const server = await getServerById(parseInt(id));

  if (!server.success || !server.server) {
    return reply.status(404).send({ message: "Server not found" });
  }

  const response = await stopServer(parseInt(id), server.server.name);
  return reply.status(200).send(response);
}

export async function startServerController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  // We get server id from query params
  const { id } = request.params as { id: string };

  if (!id) {
    return reply.status(400).send({ message: "Server ID is required" });
  }

  // Checking if server exists and is running
  const server = await getServerById(parseInt(id));

  if (!server.success || !server.server) {
    return reply.status(404).send({ message: "Server not found" });
  }

  const response = await startServer(parseInt(id), server.server.name);
  return reply.status(200).send(response);
}
