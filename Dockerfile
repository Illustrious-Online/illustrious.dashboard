
FROM oven/bun:latest AS builder

WORKDIR /app

COPY package.json bun.lockb ./
COPY ./ /app

RUN bun install
RUN bun run build

FROM oven/bun:latest AS production

WORKDIR /app

COPY --from=builder /app/.next/standalone/node_modules /app/node_modules 
COPY --from=builder /app/.next/standalone/apps/ill.dashboard /app
COPY --from=builder /app/.next/static /app/.next/static

ENV NODE_ENV=production
EXPOSE 3000
CMD ["bun", "server.js"]