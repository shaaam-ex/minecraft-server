import { FastifyInstance } from 'fastify';
import { loginController, registerController } from './authController.js';

export default async function authRoutes(fastify: FastifyInstance) {
  // POST /api/auth/login
  fastify.post('/login', loginController);

  // POST /api/auth/register
  fastify.post('/register', registerController);
}
