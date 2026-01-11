import { FastifyRequest, FastifyReply } from "fastify";
import { getAllServers } from "../../services/server";

export async function getAllServersController(request: FastifyRequest, reply: FastifyReply) {
    const servers = await getAllServers();
    if (servers) {
        return reply.status(200).send(servers);
    } else {
        return reply.status(500).send({ error: "Failed to retrieve servers" });
    }
}