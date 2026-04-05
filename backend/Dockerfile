# Use Node.js 20 Alpine for a small, secure image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first (to leverage Docker caching)
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
