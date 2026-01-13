import { FastifyRequest, FastifyReply } from "fastify";
import jwt, { JwtPayload } from "jsonwebtoken";

interface AuthPayload extends JwtPayload {
  id: number;
  email: string;
}

declare module "fastify" {
  interface FastifyRequest {
    user?: AuthPayload;
  }
}

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function validateAuth(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const cookieHeader = request.headers.cookie;
  const authToken = cookieHeader
    ?.split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("token="))
    ?.split("=")[1];

  if (!authToken) {
    return reply.status(401).send({
      success: false,
      message: "User not authenticated",
    });
  }

  try {
    const decoded = jwt.verify(authToken, JWT_SECRET) as AuthPayload;
    request.user = decoded;
  } catch {
    return reply.status(401).send({
      success: false,
      message: "Invalid or expired token",
    });
  }
}
