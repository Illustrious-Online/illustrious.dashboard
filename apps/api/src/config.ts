import data from "../package.json";

const isTestEnvironment = process.env.NODE_ENV === "test";

interface Config {
  app: {
    env: string;
    url: string;
    name: string;
    version: string;
    host: string;
    port: string;
    dashboardUrl: string;
    sentryUrl: string;
  }
  auth: {
    url: string;
    audience: string;
    clientId: string;
    clientSecret: string;
    supabaseId: string;
    edgeKey: string;
    supabaseServiceRoleKey: string;
  }
  db: {
    dbName: string;
    dbPassword: string;
    dbUsername: string;
    dbPort: string;
    dbHost: string;
  }
}

const config: Config = {
  app: {
    env: process.env.NODE_ENV || 'development',
    url: process.env.APP_URL || 'http://localhost',
    name: data.name,
    version: data.version,
    host: process.env.TEST_APP_HOST || process.env.APP_HOST || "localhost",
    port:
      (isTestEnvironment ? process.env.TEST_APP_PORT : process.env.APP_PORT) || "8000",
    dashboardUrl: process.env.DASHBOARD_URL || 'http://localhost:3000',
    sentryUrl: process.env.SENTRY_URL || 'http://localhost:9000'
  },
  auth: {
    url: process.env.AUTH0_URL || "localhost",
    audience: process.env.AUTH0_AUD || "illustrious",
    clientId: process.env.CLIENT_ID || "lorem",
    clientSecret: process.env.CLIENT_SECRET || "ipsum",
    supabaseId: process.env.SUPABASE_ID || "sit",
    edgeKey: process.env.EDGE_KEY!,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  },
  db: {
    dbName: process.env.DB_NAME!,
    dbPassword: process.env.DB_PASSWORD!,
    dbUsername: process.env.DB_USERNAME!,
    dbPort: process.env.DB_PORT!,
    dbHost: process.env.DB_HOST!,
  },
};

export default config;
