import { FastifyRequest, FastifyReply } from 'fastify';
import Validatorjs from 'validatorjs';
import { login, register, LoginRequest } from '../../services/auth.js';

export interface LoginRequestBody extends LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequestBody extends LoginRequestBody {
  username: string;
}

export async function loginController(request: FastifyRequest, response: FastifyReply) {
  try {
    const { email, password } = request.body as LoginRequestBody || {};

    const rules = {
      email: 'required|email',
      password: 'required|min:6',
    };

    const validator = new Validatorjs({ email, password }, rules);

    if (validator.fails()) {
      return response.status(400).send({
        success: false,
        message: 'Validation failed',
        errors: validator.errors.all(),
      });
    }

    const result = await login({ email, password });

    if (!result.success) {
      return response.status(401).send(result);
    }

    return response.status(200).send(result);
  } catch (error) {
    console.error('Login controller error:', error);
    return response.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function registerController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { email, password, username } =
      (request.body as RegisterRequestBody) || {};

    const rules = {
      email: 'required|email',
      password: 'required|min:6',
      username: 'required|min:3|max:20',
    };

    const validator = new Validatorjs({ email, password, username }, rules);

    if (validator.fails()) {
      return reply.status(400).send({
        success: false,
        message: 'Validation failed',
      });
    }

    const result = await register(email, password, username);

    if (!result.success) {
      return reply.status(400).send(result);
    }

    return reply.status(201).send(result);
  } catch (error) {
    console.error('Register controller error:', error);
    return reply.status(500).send({
      success: false,
      message: 'Internal server error',
    });
  }
}
