import UnauthorizedError from "../domain/exceptions/UnauthorizedError";
import type { SubmitInvoice } from "../domain/interfaces/invoices";
import { UserRole } from "../domain/types/UserRole";
import type SuccessResponse from "../domain/types/generic/SuccessResponse";
import type { Invoice } from "../drizzle/schema";
import type { AuthenticatedContext } from "../plugins/auth";
import * as invoiceService from "../services/invoice";

/**
 * Creates a new invoice.
 *
 * @param context - The authenticated context containing user and permissions information.
 * @returns A promise that resolves to a success response containing the created invoice.
 * @throws UnauthorizedError - If the user does not have permission to create an invoice.
 */
export const create = async (
  context: AuthenticatedContext,
): Promise<SuccessResponse<Invoice>> => {
  const { user, permissions } = context;
  const { superAdmin, org } = permissions;
  const body = context.body as SubmitInvoice;

  if (superAdmin || (org?.role && org.role > UserRole.CLIENT)) {
    const data = await invoiceService.create({
      client: body.client,
      creator: user.id,
      org: body.org,
      invoice: body.invoice,
    });

    return {
      data,
      message: "Invoice created successfully.",
    };
  }

  throw new UnauthorizedError(
    "You do not have permission to create an invoice.",
  );
};

/**
 * Fetches a single invoice based on the provided context.
 *
 * @param {AuthenticatedContext} context - The context containing authentication and authorization information.
 * @returns {Promise<{ data: any; message: string }>} The fetched invoice data and a success message.
 * @throws {UnauthorizedError} If the user does not have permission to access the invoice.
 */
export const fetchOne = async (context: AuthenticatedContext) => {
  const { invoice: invoiceId } = context.params;
  const { permissions } = context;
  const { superAdmin, invoice, org } = permissions;

  if (superAdmin || (org?.role && org.role > UserRole.EMPLOYEE) || invoice) {
    const data = await invoiceService.fetchById(invoiceId);

    return {
      data,
      message: "Invoice fetched successfully.",
    };
  }

  throw new UnauthorizedError(
    "You do not have permission to access this invoice.",
  );
};

/**
 * Updates an invoice based on the provided context.
 *
 * @param context - The authenticated context containing the invoice data and user permissions.
 * @returns An object containing the updated invoice data and a success message.
 * @throws {UnauthorizedError} If the user does not have permission to update the invoice.
 */
export const update = async (context: AuthenticatedContext) => {
  const body = context.body as SubmitInvoice;
  const { permissions } = context;
  const { superAdmin, invoice, org } = permissions;

  if (
    superAdmin ||
    (org?.role &&
      (org.role > UserRole.EMPLOYEE || (invoice && org.role > UserRole.CLIENT)))
  ) {
    const data = await invoiceService.update(body.invoice);

    return {
      data,
      message: "Invoice updated successfully.",
    };
  }

  throw new UnauthorizedError(
    "You do not have permission to update this invoice.",
  );
};

/**
 * Deletes a single invoice based on the provided context.
 *
 * @param {AuthenticatedContext} context - The context containing authentication and authorization information.
 * @returns {Promise<{ message: string }>} A promise that resolves to an object containing a success message.
 * @throws {UnauthorizedError} If the user does not have permission to delete the invoice.
 */
export const deleteOne = async (context: AuthenticatedContext) => {
  const { invoice: invoiceId } = context.params;
  const { permissions } = context;
  const { superAdmin, invoice, org } = permissions;

  if (
    superAdmin ||
    (org?.role &&
      (org.role > UserRole.EMPLOYEE || (invoice && org.role > UserRole.CLIENT)))
  ) {
    await invoiceService.deleteOne(invoiceId);

    return {
      message: "Invoice deleted successfully.",
    };
  }

  throw new UnauthorizedError(
    "You do not have permission to delete this invoice.",
  );
};
