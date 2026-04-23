# ---- Base image: slim variant to reduce image size (Best Practice #1) ----
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy only package files first to leverage Docker layer caching (Best Practice #2)
# This means dependencies are only re-installed when package.json changes
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy the rest of the application source
COPY . .

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
