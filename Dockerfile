
FROM oven/bun:latest AS builder

WORKDIR /app

COPY package.json bun.lockb* ./  
RUN bun install --frozen-lockfile  

COPY . .

RUN bun run build

FROM oven/bun:latest AS production

WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

ENV NODE_ENV=production
EXPOSE 3000
CMD ["bun", "server.js"]