import { FastifyInstance } from "fastify";
import {
  createServerController,
  getAllServersController,
  stopServerController,
} from "./serverController";
import { validateAuth } from "../../middleware/validateAuth";

export default async function serverRoutes(fastify: FastifyInstance) {
  // GET /api/server/all
  fastify.get("/all", { preHandler: validateAuth }, getAllServersController);

  // POST /api/server/create
  fastify.post("/create", { preHandler: validateAuth }, createServerController);

  // GET /api/server/stop/:id
  fastify.get("/stop/:id", { preHandler: validateAuth }, stopServerController);
}
