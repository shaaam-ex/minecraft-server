import { FastifyRequest, FastifyReply } from "fastify";
import Validatorjs from "validatorjs";
import { login, register, LoginRequest } from "../../services/auth.js";

export interface LoginRequestBody extends LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequestBody extends LoginRequestBody {
  username: string;
}

export async function loginController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { email, password } = (request.body as LoginRequestBody) || {};

    const rules = {
      email: "required|email",
      password: "required",
    };

    const validator = new Validatorjs({ email, password }, rules);

    if (validator.fails()) {
      return reply.status(400).send({
        success: false,
        message: "Validation failed",
      });
    }

    const result = await login({ email, password });

    if (!result.success) {
      return reply
        .status(401)
        .send({ success: false, message: "Invalid credentials" });
    }

    reply.setCookie("token", result.token as string, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: parseInt(process.env.COOKIE_EXPIRES_IN as string) || 43200,
    });

    return reply.status(200).send(result);
  } catch (error) {
    console.error("Login controller error:", error);
    return reply.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function registerController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { email, password, username } =
      (request.body as RegisterRequestBody) || {};

    const rules = {
      email: "required|email",
      password: "required|min:6",
      username: "required|min:3|max:20",
    };

    const validator = new Validatorjs({ email, password, username }, rules);

    if (validator.fails()) {
      return reply.status(400).send({
        success: false,
        message: "Validation failed",
      });
    }

    const result = await register(email, password, username);

    if (!result.success) {
      return reply.status(400).send(result);
    }

    reply.setCookie("token", result.token as string, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: parseInt(process.env.COOKIE_EXPIRES_IN as string) || 43200,
    });

    return reply.status(201).send(result);
  } catch (error) {
    console.error("Register controller error:", error);
    return reply.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function logoutController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  reply.clearCookie("token", { path: "/" });
  return reply.status(200).send({
    success: true,
    message: "Logged out successfully",
  });
}
