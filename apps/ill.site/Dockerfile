# Step 1: Set up Node.js environment
FROM oven/bun

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

# Step 4: Install dependencies
RUN bun install --production

# Step 5: Copy all files
COPY . .

# Step 6: Build the app
RUN bun run build

# Step 7: Expose the app on port 3000
EXPOSE 3000

# Step 8: Start the app
CMD ["bun", "start"]