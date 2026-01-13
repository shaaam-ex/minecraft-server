import { FastifyInstance } from "fastify";
import { getUserProfileController } from "./userController";
import { validateAuth } from "../../middleware/validateAuth";

export default async function userRoutes(fastify: FastifyInstance) {
  // GET /api/user/profile
  fastify.get(
    "/profile",
    { preHandler: validateAuth },
    getUserProfileController
  );
}
