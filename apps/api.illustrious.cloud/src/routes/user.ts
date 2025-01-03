import { Elysia, t } from "elysia";
import { Invoice } from "@/domain/models/invoice";
import { Org } from "@/domain/models/org";
import { Report } from "@/domain/models/report";
import { User } from "@/domain/models/user";
import * as userController from "../modules/user";

export default (app: Elysia) =>
  app
    .get(
      "/profile",
      async ({ request }) => {
        const token = request.headers.get('authorization');

        if (!token) {
          return new Response('Unauthorized. Please log in.', { status: 400 });
        }

        try {
          const data = await userController.profile(token);
          return new Response(JSON.stringify(data), { status: 200 });
        } catch (error) {
          if (error instanceof Error) {
            return new Response(error.message, { status: 500 });
          } else {
            return new Response('An unknown error occurred', { status: 500 });
          }
        }
      }
    )
    // @ts-expect-error Swagger plugin disagrees with context
    .get("/users", userController.fetchUser, {
      query: t.Optional(
        t.Object({
          include: t.Optional(t.String()),
        }),
      ),
      headers: t.Object({
        authorization: t.String(),
      }),
      response: {
        200: t.Object(
          {
            message: t.String(),
            data: t.Object({
              user: User,
              invoices: t.Optional(t.Array(Invoice)),
              reports: t.Optional(t.Array(Report)),
              orgs: t.Optional(t.Array(Org)),
            }),
          },
          {
            description: "Successfully found the user",
          },
        ),
        400: t.Object(
          {
            code: t.Number({
              examples: [400],
            }),
            message: t.String({
              examples: ["Unable to find user with ID"],
            }),
          },
          {
            description: "Failed to find the user based on ID",
          },
        ),
      },
    })
    // @ts-expect-error Swagger plugin disagrees with context
    .get("/users/:type", userController.fetchResources, {
      params: t.Object({
        type: t.String(),
      }),
      headers: t.Object({
        authorization: t.String(),
      }),
      response: {
        200: t.Object(
          {
            message: t.String(),
            data: t.Object({
              orgs: t.Optional(t.Array(Org)),
              reports: t.Optional(t.Array(Report)),
              invoices: t.Optional(t.Array(Invoice)),
            }),
          },
          {
            description: "Found resources based on user ID",
          },
        ),
        400: t.Object(
          {
            code: t.Number({
              examples: [400],
            }),
            message: t.String({
              examples: ["Unable to find user resources"],
            }),
          },
          {
            description: "Failed to find the user resources based on ID",
          },
        ),
      },
    })
    // @ts-expect-error Swagger plugin disagrees with context
    .post("/users", userController.create, {
      body: User,
      headers: t.Object({
        authorization: t.String(),
      }),
      response: {
        200: t.Object(
          {
            message: t.String(),
            data: User,
          },
          {
            description: "Successfully created new user & relations",
          },
        ),
        400: t.Object(
          {
            code: t.Number({
              examples: [400],
            }),
            message: t.String({
              examples: ["Unable to find user with email"],
            }),
          },
          {
            description: "Unable to process with authorization from request",
          },
        ),
        409: t.Object(
          {
            code: t.Number({
              examples: [409],
            }),
            message: t.String({
              examples: ["User already exists"],
            }),
          },
          {
            description: "There was a conflict when creating a new user",
          },
        ),
      },
    })
    // @ts-expect-error Swagger plugin disagrees when adding 200 response
    .put("/users/:id", userController.update, {
      body: User,
      headers: t.Object({
        authorization: t.String(),
      }),
      response: {
        200: t.Object(
          {
            message: t.String(),
            data: User,
          },
          {
            description: "Successfully updated the user",
          },
        ),
        400: t.Object(
          {
            code: t.Number({
              examples: [400],
            }),
            message: t.String({
              examples: ["Unable to find user to be updated"],
            }),
          },
          {
            description: "Unable to process with authorization from request",
          },
        ),
        409: t.Object(
          {
            code: t.Number({
              examples: [409],
            }),
            message: t.String({
              examples: ["User already exists"],
            }),
          },
          {
            description: "There was a conflict when updating the user",
          },
        ),
      },
    })
    // @ts-expect-error Swagger plugin disagrees when adding 200 response
    .delete("/users/:id", userController.deleteOne, {
      params: t.Object({
        id: t.String(),
      }),
      headers: t.Object({
        authorization: t.String(),
      }),
      response: {
        200: t.Object(
          {
            message: t.String(),
          },
          {
            description: "Successfully deleted new user & relations",
          },
        ),
        400: t.Object(
          {
            code: t.Number({
              examples: [400],
            }),
            message: t.String({
              examples: ["Failed to delete user"],
            }),
          },
          {
            description: "Unable to process with authorization from request",
          },
        ),
        409: t.Object(
          {
            code: t.Number({
              examples: [409],
            }),
            message: t.String({
              examples: ["Unable to find user to processes delete"],
            }),
          },
          {
            description: "There was a conflict deleting the user",
          },
        ),
      },
    });
