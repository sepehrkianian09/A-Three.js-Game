# Use official Node.js image
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Install dependencies based on the environment
COPY package.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port 3000
EXPOSE 3000

# Default command (will be overridden by docker-compose)
CMD ["npm", "run", "dev"]
