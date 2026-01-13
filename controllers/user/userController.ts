import { User } from "./type";
import { FastifyRequest, FastifyReply } from "fastify";
import { createServer, getAllServers } from "../../services/server";
import Validator from "validatorjs";
import { getUserProfile } from "../../services/user";

export async function getUserProfileController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const user = await getUserProfile(request.user?.id as number);
  if (!user) {
    return reply.status(500).send({
      success: false,
      message: "Failed to fetch user profile",
    });
  }

  return reply.send({
    success: true,
    user: user,
  });
}
