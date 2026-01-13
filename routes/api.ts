import { FastifyInstance } from "fastify";

// Import controller routes
import authRoutes from "../controllers/auth/authRoutes.js";
import serverRoutes from "../controllers/server/serverRoutes.js";
import userRoutes from "../controllers/user/userRoutes.js";

export default async function apiRouter(fastify: FastifyInstance) {
  fastify.register(authRoutes, { prefix: "/auth" });
  fastify.register(serverRoutes, { prefix: "/server" });
  fastify.register(userRoutes, { prefix: "/user" });
}
