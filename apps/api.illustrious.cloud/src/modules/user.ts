import { Context } from "elysia";

import { Invoice, Org, Report, User } from "../drizzle/schema";
import ConflictError from "../domain/exceptions/ConflictError";
import UnauthorizedError from "../domain/exceptions/UnauthorizedError";
import SuccessResponse from "../domain/types/generic/SuccessResponse";
import * as userService from "../services/user";
import { getSub } from "../utils/extract-sub";
import { supabaseClient } from "..";

export const profile = async (context: Context) => {
  const { authorization } = context.headers as { authorization: string };

  if (!authorization) {
    return new Response('Unauthorized. Please log in.', { status: 400 });
  }

  const { data: user, error } = await supabaseClient.auth.getUser(authorization);

  if (error) {
    throw new Error(error instanceof Error ? error?.message : "An unknown error occurred.");
  }

  return {
    data: user,
    message: "User profile fetched successfully."
  }
};

export const create = async (
  context: Context,
): Promise<SuccessResponse<User>> => {
  const body = context.body as User;
  const data = await userService.create(body);

  return {
    data,
    message: "User created successfully.",
  };
};

export const fetchUser = async (context: Context) => {
  const { authorization } = context.headers as { authorization: string };
  const { include } = context.query;
  const sub = await getSub(authorization);
  const user = await userService.fetchOne({ sub });
  const result: {
    user: User;
    reports?: Report[];
    invoices?: Invoice[];
    orgs?: Org[];
  } = { user };

  if (include) {
    if (include.includes("invoices")) {
      const userInvoices = (await userService.fetchResources(
        user.id,
        "invoices",
      )) as Invoice[];
      result.invoices = userInvoices;
    }

    if (include.includes("reports")) {
      const userReports = (await userService.fetchResources(
        user.id,
        "reports",
      )) as Report[];
      result.reports = userReports;
    }

    if (include.includes("orgs")) {
      const userOrgs = (await userService.fetchResources(
        user.id,
        "orgs",
      )) as Org[];
      result.orgs = userOrgs;
    }
  }

  return {
    data: result,
    message: "User & details fetched successfully",
  };
};

export const fetchResources = async (context: Context) => {
  const { type } = context.params;

  if (!type) {
    throw new Error("Resource type is required.");
  }

  const { authorization } = context.headers;
  const sub = await getSub(authorization!);
  const user = await userService.fetchOne({ sub });
  const data = await userService.fetchResources(user.id, type);

  return {
    data: {
      [type]: data,
    },
    message: "User resources fetched successfully.",
  };
};

export const update = async (context: Context) => {
  const { authorization } = context.headers as { authorization: string };
  const body = context.body as User;
  const { id } = context.params;
  const sub = await getSub(authorization);
  const user = await userService.fetchOne({ sub });

  if (user.id !== id) {
    throw new UnauthorizedError("Token does not match user to be updated.");
  }

  const data = await userService.update(body);

  return {
    data,
    message: "User updated successfully.",
  };
};

export const deleteOne = async (context: Context) => {
  const { authorization } = context.headers as { authorization: string };
  const { id } = context.params;
  const sub = await getSub(authorization);
  const user = await userService.fetchOne({ sub });

  if (user.id !== id) {
    throw new ConflictError("Provided user does not match authenticaiton ID.");
  }

  await userService.deleteOne(id);

  return {
    message: "User deleted successfully.",
  };
};
