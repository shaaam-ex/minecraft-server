import { FastifyInstance } from 'fastify';

// Import controller routes
import authRoutes from '../controllers/auth/authRoutes.js';
import healthRoutes from '../controllers/health/routes.js';

export default async function apiRouter(fastify: FastifyInstance) {
  // Register all controller routes under /api prefix
  // e.g., /api/auth, /api/health, /api/player
  fastify.register(authRoutes, { prefix: '/auth' });
  fastify.register(healthRoutes, { prefix: '/health' });
}
