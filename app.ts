import Fastify from 'fastify';
import apiRouter from './routes/api.js';

const fastify = Fastify({ logger: true });

// Register the main /api router
fastify.register(apiRouter, { prefix: '/api' });

// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server running on http://0.0.0.0:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
