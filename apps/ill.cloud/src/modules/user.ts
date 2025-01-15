import BadRequestError from "@/domain/exceptions/BadRequestError";
import ServerError from "@/domain/exceptions/ServerError";
import UnauthorizedError from "../domain/exceptions/UnauthorizedError";
import type SuccessResponse from "../domain/types/generic/SuccessResponse";
import type { Invoice, Org, Report, User } from "../drizzle/schema";
import type { AuthenticatedContext } from "../plugins/auth";
import * as userService from "../services/user";

export interface UserDetails {
  user: User;
  reports?: Report[];
  invoices?: Invoice[];
  orgs?: Org[];
}

/**
 * Fetches the details of the authenticated user including invoices, reports, and organizations.
 *
 * @param context - The authenticated context containing the user information.
 * @returns A promise that resolves to a success response containing the user details.
 */
export const me = async (
  context: AuthenticatedContext,
): Promise<SuccessResponse<UserDetails>> => {
  const { user } = context;

  if (!user || !user.id) {
    throw new BadRequestError("Required user information is missing.");
  }

  const result: UserDetails = { user };
  const myResources = await userService.fetchResources(user.id);

  return {
    data: {
      ...result,
      invoices: myResources.invoices,
      reports: myResources.reports,
      orgs: myResources.orgs,
    },
    message: "User details fetched successfully!",
  };
};

/**
 * Fetches the details of the authenticated user.
 *
 * @param context - The authenticated context containing user information and query parameters.
 * @returns A promise that resolves to a success response containing user details.
 *
 * The function fetches additional resources (invoices, reports, orgs) if the `include` query parameter is present
 * and the user is a super admin. The additional resources are fetched using the `userService.fetchResources` method.
 *
 * @example
 * const context = {
 *   user: { id: '123', superAdmin: true },
 *   query: { include: ['invoices', 'reports'] }
 * };
 * const response = await fetchUser(context);
 * console.log(response.data); // { user: { id: '123', superAdmin: true }, invoices: [...], reports: [...] }
 */
export const fetchUser = async (
  context: AuthenticatedContext,
): Promise<SuccessResponse<UserDetails>> => {
  const { user } = context;
  const { include } = context.query;
  const result: UserDetails = { user };

  if (include && user.superAdmin) {
    const userResources = (await userService.fetchResources(user.id, {
      invoices: include.includes("invoices"),
      reports: include.includes("reports"),
      orgs: include.includes("orgs"),
    })) as UserDetails;

    result.invoices = userResources.invoices;
    result.reports = userResources.reports;
    result.orgs = userResources.orgs;
  }

  return {
    data: result,
    message: `User details fetched successfully${include && !user.superAdmin ? " ('include' details restricted)" : ""}`,
  };
};

/**
 * Updates the user information.
 *
 * @param {AuthenticatedContext} context - The authenticated context containing user information, request body, and parameters.
 * @throws {UnauthorizedError} If the token does not match the user to be updated.
 * @returns {Promise<{ data: User, message: string }>} The updated user data and a success message.
 */
export const update = async (
  context: AuthenticatedContext,
): Promise<SuccessResponse<User>> => {
  const { user } = context;
  const body = context.body as User;
  const { id } = context.params;

  if (!user.superAdmin && user.id !== id) {
    throw new UnauthorizedError("Token does not match user to be updated.");
  }

  const data = await userService.update(body);

  return {
    data,
    message: "User updated successfully.",
  };
};

/**
 * Deletes a user based on the provided authenticated context.
 *
 * @param context - The authenticated context containing user information and parameters.
 * @throws {UnauthorizedError} If the provided user ID does not match the authenticated user ID.
 * @returns An object containing a success message.
 */
export const deleteOne = async (
  context: AuthenticatedContext,
): Promise<SuccessResponse<string>> => {
  const { user } = context;
  const { id } = context.params;

  if (!user.superAdmin && user.id !== id) {
    throw new UnauthorizedError(
      "You do not have permission to delete this account.",
    );
  }

  if (!user.identifier) {
    throw new ServerError("User identifier is missing.", 500);
  }

  await userService.deleteOne(id, user.identifier);

  return {
    message: "User deleted successfully.",
  };
};

/**
 * Links a Steam account to the authenticated user's account.
 *
 * @param {AuthenticatedContext} context - The authenticated context of the user.
 * @returns {Promise<void>} A promise that resolves when the user is redirected to the Steam link URL.
 * @throws {ServerError} If the Steam link URL could not be generated.
 */
export const linkSteam = async (
  context: AuthenticatedContext,
): Promise<void> => {
  const data = await userService.linkSteam();

  if (!data.url) {
    throw new ServerError("Failed to generate Steam link URL.", 500);
  }

  context.redirect(data.url);
};

/**
 * Handles the callback for linking a Steam account.
 *
 * This function calls the `linkSteam` method from the `userService` with a
 * parameter indicating whether the linking is successful. It then returns
 * an object containing a message from the response data.
 *
 * @returns {Promise<{ message: string }>} An object containing a message from the response data.
 */
export const steamCallback = async (): Promise<{ message: string }> => {
  const data = await userService.linkSteam(true);
  return {
    message: data.message ?? "Steam account linked successfully.",
  };
};
