import { Elysia, t } from "elysia";
import * as authController from "../modules/auth";
import authPlugin from "../plugins/auth";
import { Provider } from "@supabase/supabase-js";

export default (app: Elysia) =>
  app
    .get(
      '/auth/:provider',
      async ({ redirect, query }) => {
        const { provider } = query;

        if (!provider) {
          return new Response('Provider not found', { status: 400 });
        }

        try {
          const data = await authController.signInWithOAuth(provider as Provider);
          return redirect(data?.url || '/');
        } catch (error) {
          if (error instanceof Error) {
            return new Response(error.message, { status: 500 });
          } else {
            return new Response('An unknown error occurred', { status: 500 });
          }
        }
      }
    )
    .get(
      "/auth/callback",
      async ({ query }) => {
        const { code } = query;

        if (!code) {
          return new Response('Authorization code is missing', { status: 400 });
        }

        try {
          const data = await authController.oauthCallback(code);
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
    .get(
      "/signout",
      async ({ redirect }) => {
        await authController.signOut();
        return redirect('/');
      }
    )
    .use(authPlugin)
    .post('/link/steam', async () => {
      return await authController.linkSteam('steam-auth');
    })
    .post('/link/steam/auth', async ({ request }) => {
      return await authController.linkSteam('steam-auth/authenticate');
    })
    // @ts-expect-error Swagger plugin disagrees when adding 200 response
    .delete("/auth/delete/:id", authController.deleteOne, {
      params: t.Object({
        id: t.String(),
      }),
      response: {
        200: t.Object(
          {
            message: t.String(),
          },
          {
            description: "Successfully deleted authorization & relationship",
          },
        ),
        400: t.Object(
          {
            code: t.Number({
              examples: [400],
            }),
            message: t.String({
              examples: ["Failed to delete authorization"],
            }),
          },
          {
            description: "Unable to process authorization delete",
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
            description: "There was a conflict deleting the authentications",
          },
        ),
      },
    });
