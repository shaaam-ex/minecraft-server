import "dotenv/config";
import Fastify from "fastify";
import cookie from "@fastify/cookie";
import apiRouter from "./routes/api.js";
import cors from "@fastify/cors";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config({ path: ".env" });

const fastify = Fastify({ logger: true });

// Register the main /api router
fastify.register(apiRouter, { prefix: "/api" });
fastify.register(cors, {
  origin: [
    "http://localhost:5173",
    "http://localhost:4173",
    "http://192.168.18.18:5173",
    "http://192.168.18.18:4173",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
});

// Register cookie plugin
fastify.register(cookie, {
  secret: process.env.COOKIE_SECRET || "your-secret-key",
  parseOptions: {},
});

// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: "0.0.0.0" });
    console.log("Server running on http://127.0.0.1:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
