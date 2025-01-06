# Step 1: Use the Bun image for Node.js
FROM oven/bun:latest AS base

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy the root package files (including bun.lockb, turbo.json, and package.json)
# This ensures we only copy the relevant package files to optimize caching
COPY package.json bun.lockb turbo.json ./

# Step 5: Copy all other necessary files (like source code and ui package)
# This step should copy everything in your repo, including the `packages/ui` workspace
COPY apps/ill.site apps/ill.site
COPY packages/typescript-config packages/typescript-config
COPY packages/ui packages/ui

# Step 4: Install dependencies across workspaces using Bun
RUN bun install

# Step 6: Build the Next.js app
# Assuming your Next.js app is in the `apps/nextjs-app` directory
RUN bun run build --cwd apps/ill.site

# Step 7: Expose the app on port 3000
EXPOSE 3000

# Step 8: Start the app
# Assuming the start script is configured for your Next.js app
CMD ["bun", "start", "--cwd", "apps/ill.site"]
