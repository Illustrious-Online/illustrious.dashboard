
FROM oven/bun:latest AS builder

WORKDIR /app

COPY package.json bun.lockb turbo.json ./
COPY packages ./packages
COPY apps ./apps

RUN bun install
RUN bun run build --filter ill.site

FROM oven/bun:latest AS production

WORKDIR /app

COPY --from=builder /app/apps/ill.site/.next/standalone/apps/ill.site /app
COPY --from=builder /app/apps/ill.site/.next/static /app/.next/static
COPY --from=builder /app/node_modules /app/node_modules 

ENV NODE_ENV=production
EXPOSE 3000
CMD ["bun", "server.js"]