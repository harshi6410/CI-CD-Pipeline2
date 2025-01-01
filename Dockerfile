# Use Node.js as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json (if available) into the container
COPY package*.json ./

# Install the dependencies using npm ci (faster and more reliable for CI/CD)
RUN npm ci

# Copy the rest of the application code into the container
COPY . .

# Expose the port the app will run on
EXPOSE 3000

# Command to start the application
CMD ["npm", "start"]
