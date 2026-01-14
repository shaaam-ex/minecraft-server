import { FastifyInstance } from "fastify";
import {
  createServerController,
  deleteServerController,
  getAllServersController,
  getServerDetailsController,
  getServerPerformanceMetricsController,
  startServerController,
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

  // GET /api/server/start/:id
  fastify.get(
    "/start/:id",
    { preHandler: validateAuth },
    startServerController
  );

  // GET /api/server/details/:id
  fastify.get(
    "/details/:id",
    { preHandler: validateAuth },
    getServerDetailsController
  );

  // GET /api/server/metrics/:id
  fastify.get(
    "/metrics/:id",
    { preHandler: validateAuth },
    getServerPerformanceMetricsController
  );

  // DELETE /api/server/delete/:id
  fastify.delete(
    "/delete/:id",
    { preHandler: validateAuth },
    deleteServerController
  );
}
