import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import apiRouter from "./routes/api.js";
import dotenv from "dotenv";

// Load env
dotenv.config({ path: ".env" });

const fastify = Fastify({
  logger: true,
  trustProxy: true, // IMPORTANT for nginx + cookies
});

/**
 * CORS MUST be registered BEFORE routes
 */
fastify.register(cors, {
  origin: [
    "http://minecraft.cinemarque.space",
    "https://minecraft.cinemarque.space",
    "http://192.168.18.18",
    "http://192.168.18.18:5173",
    "http://192.168.18.18:4173",
    "http://localhost:5173"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
});

/**
 * Cookies
 */
fastify.register(cookie, {
  secret: process.env.COOKIE_SECRET || "dev-secret",
});

/**
 * Routes
 */
fastify.register(apiRouter, { prefix: "/api" });

/**
 * Start server
 */
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: "0.0.0.0" });
    fastify.log.info("API running on :3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
