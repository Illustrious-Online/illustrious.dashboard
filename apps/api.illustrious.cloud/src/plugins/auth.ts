import { Elysia } from "elysia";
import { JsonWebTokenError, verify } from "jsonwebtoken";

import config from "@/config";
import UnauthorizedError from "@/domain/exceptions/UnauthorizedError";

function validateJwt(token: string) {
  try {
    const decoded = verify(token, config.auth.supabaseServiceRoleKey);
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

export default (app: Elysia) =>
  // @ts-expect-error This remains valid after JWT is implemented.
  app.derive(async ({ bearer }) => {
    if (!bearer) {
      throw new UnauthorizedError("Access token is missing!");
    }

    try {
      validateJwt(bearer);
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedError(error.message);
      }
    }

    return true;
  });
