import bearer from "@elysiajs/bearer";
import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";

import config from "./config";
import errorPlugin from "./plugins/error";
import loggerPlugin from "./plugins/logger";
import authRoutes from "./routes/auth";
import protectedRoutes from "./routes/protected";
import { createClient } from "@supabase/supabase-js";

export const supabaseClient = createClient(
  `https://${config.auth.supabaseId}.supabase.co`,
  config.auth.supabaseServiceRoleKey
);

// Elysia application setup
export const app = new Elysia()
  .use(
    swagger({
      path: "/docs",
      documentation: {
        info: {
          title: "Illustrious Cloud API Docs",
          version: config.app.version,
        },
        security: [{ JwtAuth: [] }],
        components: {
          securitySchemes: {
            JwtAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
              description: "Enter JWT Bearer token **_only_**",
            },
          },
        },
      },
      swaggerOptions: {
        persistAuthorization: true,
      },
    })
  )
  .use(bearer());

if (process.env.NODE_ENV?.includes("dev")) {
  app.use(loggerPlugin);
}

app
  .use(errorPlugin)
  .get("/", () => ({
    name: config.app.name,
    version: config.app.version,
  }))
  .use(authRoutes)
  .use(protectedRoutes)

if (process.env.NODE_ENV?.includes("dev")) {
  app.listen(config.app.port, () => {
    console.log(`Environment: ${config.app.env}`);
    console.log(
      `Illustrious Cloud API is running at ${config.app.host}:${config.app.port}`,
    );
  });
}

export default app.fetch;
