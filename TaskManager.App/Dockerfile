# Frontend Dockerfile for Railway
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the app for production
RUN npm run build

# Install a simple server to serve the built app
RUN npm install -g serve

# Expose the port that Railway expects
EXPOSE $PORT

# Serve the built app
CMD serve -s dist/fullstack-app -l $PORT
