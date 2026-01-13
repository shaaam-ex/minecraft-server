import { FastifyInstance } from "fastify";
import {
  loginController,
  logoutController,
  registerController,
} from "./authController.js";

export default async function authRoutes(fastify: FastifyInstance) {
  // POST /api/auth/login
  fastify.post("/login", loginController);

  // POST /api/auth/register
  fastify.post("/register", registerController);

  // GET /api/auth/logout
  fastify.get("/logout", logoutController);
}
