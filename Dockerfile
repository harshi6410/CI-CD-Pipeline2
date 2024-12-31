# Use the official Node.js image
FROM node:14

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all the files
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Run the app
CMD ["node", "backend/server.js"]
