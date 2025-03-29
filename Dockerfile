# Use official Node.js image
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Set environment variable with a default
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Install dependencies based on the environment
COPY package.json ./
RUN if [ "$NODE_ENV" = "development" ]; then npm install; else npm ci --only=production; fi

# Copy the rest of the application
COPY . .

# Expose port 3000
EXPOSE 3000

# Default command (will be overridden by docker-compose)
CMD ["npm", "start"]
