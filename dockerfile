# Use a recent Node.js LTS version
FROM node:20

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Set environment variable
ENV PORT=8080

# Expose the port
EXPOSE 8080

# Start the app
CMD ["npm", "start"]
