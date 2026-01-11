import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

export default async function healthRoutes(fastify: FastifyInstance) {
  // GET /api/health
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // GET /api/health/ping
  fastify.get('/ping', async (request: FastifyRequest, reply: FastifyReply) => {
    return { message: 'pong' };
  });
}
