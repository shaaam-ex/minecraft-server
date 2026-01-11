import { CreateServerBody } from "./type";
import { FastifyRequest, FastifyReply } from "fastify";
import { getAllServers } from "../../services/server";
import Validator from "validatorjs";

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
  const { name, status, configuration, version } =
    request.body as CreateServerBody;
  // Validation
  const validator = new Validator(
    { name, status, version },
    {
      name: "required|string",
      status: "required|boolean",
      version: "required|string",
    }
  );

  if (validator.fails()) {
    return reply.status(400).send({
      success: false,
      message: "Validation failed",
    });
  }

  const response = createServer(name, status, configuration ?? {}, version);
}
